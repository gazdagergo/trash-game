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
          <Bomb
            name="Bottle"
            type={ItemTypes.RED}
            isDropped={this.isDropped("Bottle")}
            key={1}
          />
          <Bomb
            name="Banana"
            type={ItemTypes.BLUE}
            isDropped={this.isDropped("Banana")}
            key={2}
          />
          <Bomb
            name="Magazine"
            type={ItemTypes.GREEN}
            isDropped={this.isDropped("Magazine")}
            key={3}
          />
        </div>
      </div>
    );
  }

  handleDrop(index, item) {
    const { name } = item;
    const droppedBombNames = name ? { $push: [name] } : {};

    this.setState(
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
    );
  }
}
