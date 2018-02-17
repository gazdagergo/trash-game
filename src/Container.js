import React, { Component } from "react";
import update from "immutability-helper";
import { DragDropContext } from "react-dnd";
import HTML5Backend, { NativeTypes } from "react-dnd-html5-backend";
import Dustbin from "./Dustbin";
import Box from "./Box";
import ItemTypes from "./ItemTypes";

@DragDropContext(HTML5Backend)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dustbins: [
        { accepts: [ItemTypes.GLASS], lastDroppedItem: null },
        { accepts: [ItemTypes.FOOD], lastDroppedItem: null },
        {
          accepts: [ItemTypes.PAPER, ItemTypes.GLASS, NativeTypes.URL],
          lastDroppedItem: null
        },
        { accepts: [ItemTypes.PAPER, NativeTypes.FILE], lastDroppedItem: null }
      ],
      droppedBoxNames: []
    };
  }

  isDropped(boxName) {
    return this.state.droppedBoxNames.indexOf(boxName) > -1;
  }

  render() {
    const { dustbins } = this.state;

    return (
      <div>
        <div style={{ overflow: "hidden", clear: "both" }}>
          {dustbins.map(({ accepts, lastDroppedItem }, index) => (
            <Dustbin
              accepts={accepts}
              lastDroppedItem={lastDroppedItem}
              onDrop={item => this.handleDrop(index, item)}
              key={index}
            />
          ))}
        </div>

        <div style={{ overflow: "hidden", clear: "both" }}>
          <Box
            name="Bottle"
            type={ItemTypes.GLASS}
            isDropped={this.isDropped("Bottle")}
            key={1}
          />
          <Box
            name="Banana"
            type={ItemTypes.FOOD}
            isDropped={this.isDropped("Banana")}
            key={2}
          />
          <Box
            name="Magazine"
            type={ItemTypes.PAPER}
            isDropped={this.isDropped("Magazine")}
            key={3}
          />
        </div>
      </div>
    );
  }

  handleDrop(index, item) {
    const { name } = item;
    const droppedBoxNames = name ? { $push: [name] } : {};

    this.setState(
      update(this.state, {
        dustbins: {
          [index]: {
            lastDroppedItem: {
              $set: item
            }
          }
        },
        droppedBoxNames
      })
    );
  }
}
