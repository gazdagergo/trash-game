import React, { Component } from "react";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import Dustbin from "./Dustbin";
import Bomb from "./Bomb";
import ItemTypes from "./ItemTypes";

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
      bombs: [
        { id: 1, type: ItemTypes.RED },
        { id: 2, type: ItemTypes.RED },
        { id: 3, type: ItemTypes.GREEN },
        { id: 4, type: ItemTypes.BLUE },
        { id: 5, type: ItemTypes.RED }
      ],
      score: 0
    };
  }

  render() {
    return (
      <div>
        <div className="bottom-wrap">
          <div className="dustbin-wrap">
            {this.state.dustbins.map(({ accepts }, index) => (
              <Dustbin
                accepts={accepts}
                onDrop={item => this.handleDrop(item)}
                key={index}
              />
            ))}
          </div>
        </div>

        <div style={{ overflow: "hidden", clear: "both" }}>
          {this.state.bombs.map((bomb, index) => (
            <Bomb id={bomb.id} type={bomb.type} key={index} />
          ))}
        </div>
      </div>
    );
  }

  handleDrop(item) {
    const { id } = item;

    const bombsCopy = [...this.state.bombs];
    const bombs = bombsCopy.filter(item => item.id !== id);

    let { score } = this.state;
    score += 1;

    this.setState({ bombs, score });
  }
}
