import React, { Component } from "react";
import update from "immutability-helper";
import { DragDropContext } from "react-dnd";
import HTML5Backend, { NativeTypes } from "react-dnd-html5-backend";
import Dustbin from "./Dustbin";
import Bomb from "./Bomb";
import ItemTypes from "./ItemTypes";

@DragDropContext(HTML5Backend)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dustbins: [
        { accepts: [ItemTypes.RED], lastDroppedItem: null },
        { accepts: [ItemTypes.BLUE], lastDroppedItem: null },
        { accepts: [ItemTypes.GREEN], lastDroppedItem: null }
      ],
      bombs: [
        { id: 1, type: ItemTypes.RED, ttl: 5 },
        { id: 2, type: ItemTypes.RED, ttl: 5 },
        { id: 3, type: ItemTypes.GREEN, ttl: 5 },
        { id: 4, type: ItemTypes.BLUE, ttl: 5 },
        { id: 5, type: ItemTypes.RED, ttl: 5 }
      ],
      droppedBombNames: []
    };
  }

  isDropped(bombName) {
    return this.state.droppedBombNames.indexOf(bombName) > -1;
  }

  render() {
    const { dustbins } = this.state;

    return (
      <div>
        <div className="bottom-wrap">
          <div className="dustbin-wrap">
            {dustbins.map(({ accepts, lastDroppedItem }, index) => (
              <Dustbin
                accepts={accepts}
                lastDroppedItem={lastDroppedItem}
                onDrop={item => this.handleDrop(index, item)}
                key={index}
              />
            ))}
          </div>
        </div>

        <div style={{ overflow: "hidden", clear: "both" }}>
          {this.state.bombs.map((bomb, index) => (
            <Bomb
              id={bomb.id}
              type={bomb.type}
              isDropped={this.isDropped(bomb.name)}
              key={index}
            />
          ))}
        </div>
      </div>
    );
  }

  handleDrop(index, item) {
    const { id } = item;
    // const droppedBombNames = name ? { $push: [name] } : {};

    /*  this.setState(
      update(this.state, {
        dustbins: {
          [index]: {
            lastDroppedItem: {
              $set: item
            }
          }
        },
        droppedBombNames
      })
    ); */

    const bombsCopy = [...this.state.bombs];
    const bombs = bombsCopy.filter(item => item.id !== id);
    this.setState({ bombs });
  }
}
