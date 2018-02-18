import React, { Component } from "react";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import Dustbin from "./Dustbin";
import Bomb from "./Bomb";
import ItemTypes from "./ItemTypes";

const getRandPosition = () => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`
});

const pickRandomType = obj => {
  let result;
  let count = 0;
  for (var prop in obj) if (Math.random() < 1 / ++count) result = obj[prop];
  return result;
};

const frequencyChange = (5000 - 500) / 120; // 5 sec to .5 sec in 120 iteration

const callWithIncreasingFrequency = (interval, callback) => {
  interval -= frequencyChange;
  if (interval >= 0.5)
    setTimeout(() => {
      callback();
      callWithIncreasingFrequency(interval, callback);
    }, interval);
};

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
      overtimeBombIds: []
    };
  }

  componentDidMount() {
    callWithIncreasingFrequency(5000, this.bombFactory);
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
                accepts={accepts}
                onDrop={item => this.handleDrop(item.id)}
                key={index}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}
