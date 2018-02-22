import React, { Component } from "react";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import Dustbin from "./Dustbin";
import Bomb from "./Bomb";
import ItemTypes from "./ItemTypes";
import {
  getRandPosition,
  pickRandomType,
  callWithIncreasingFrequency,
  getRemainingSec,
  shuffleArray,
  getFrequencyChange
} from "./helper";

const frequencyChange = getFrequencyChange(5, 0.5, 120); // 5 sec to .5 sec in 120 sec
const binShuffleTime = 40;

@DragDropContext(HTML5Backend)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dustbins: [
        { accepts: [ItemTypes.RED] },
        { accepts: [ItemTypes.BLUE] },
        { accepts: [ItemTypes.GREEN] }
      ],
      bombs: [],
      score: 0,
      bombId: 0,
      overtimeBombIds: [],
      start: 0,
      binsShuffleIn: binShuffleTime,
      endGame: false
    };
    this.timeout = null;
  }

  componentDidMount() {
    callWithIncreasingFrequency(
      5000,
      frequencyChange,
      this.bombFactory,
      this.timeout
    );
    this.setState({ start: Date.now() });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.binsShuffleIn === binShuffleTime) {
      this.interval = setInterval(this.handleTrashColorShuffle, 50);
    }
  }

  removeBomb = id => {
    const bombsCopy = [...this.state.bombs];
    const bombs = bombsCopy.filter(item => item.id !== id);
    this.setState({ bombs });
  };

  changeScore = points => {
    this.setState(prevState => ({ score: prevState.score + points }));
  };

  handleDrop(id) {
    this.removeBomb(id);
    this.changeScore(1);
  }

  handleBombLifeEnd = id => {
    this.changeScore(-1);
    this.setState(prevState => ({
      overtimeBombIds: [...prevState.overtimeBombIds, id]
    }));
  };

  handleTrashColorShuffle = () => {
    const binsShuffleIn = getRemainingSec(this.state.start, binShuffleTime);
    if (binsShuffleIn === 0) {
      clearInterval(this.interval);
      const dustbins = [...this.state.dustbins];
      shuffleArray(dustbins);
      this.setState({
        start: Date.now(),
        binsShuffleIn: binShuffleTime,
        dustbins
      });
    } else if (binsShuffleIn < this.state.binsShuffleIn) {
      this.setState({ binsShuffleIn });
    }
  };

  bombFactory = () => {
    this.setState(prevState => ({
      bombs: [
        ...prevState.bombs,
        {
          id: prevState.bombId++,
          type: pickRandomType(ItemTypes),
          position: getRandPosition(),
          handleLifeEnd: this.handleBombLifeEnd
        }
      ]
    }));
  };

  isOvertimed(bombId) {
    return this.state.overtimeBombIds.indexOf(bombId) > -1;
  }

  render() {
    return (
      <div>
        <div className="score">Score: {this.state.score}</div>
        <div className="bomb-wrap">
          {this.state.bombs.map((bomb, index) => {
            if (this.isOvertimed(bomb.id)) return null;
            return (
              <Bomb
                key={index}
                id={bomb.id}
                type={bomb.type}
                position={bomb.position}
                handleLifeEnd={() => bomb.handleLifeEnd(bomb.id)}
              />
            );
          })}
        </div>

        <div className="bottom-wrap">
          <div className="dustbin-wrap">
            {this.state.dustbins.map(({ accepts }, index) => (
              <Dustbin
                key={index}
                accepts={accepts}
                onDrop={item => this.handleDrop(item.id)}
              />
            ))}
          </div>
          <div className="color-change-timer">
            Changes in: {this.state.binsShuffleIn} sec
          </div>
        </div>
      </div>
    );
  }
}
