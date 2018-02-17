import React, { Component } from "react";
import PropTypes from "prop-types";
import { DragSource } from "react-dnd";

const BombSource = {
  beginDrag(props) {
    return {
      name: props.name
    };
  }
};

@DragSource(props => props.type, BombSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
export default class Bomb extends Component {
  state = {
    ttl: 5
  };

  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    isDropped: PropTypes.bool.isRequired
  };

  render() {
    const { type, isDropped, connectDragSource } = this.props;

    return connectDragSource(
      <div className={`bomb bomb-${type}`}>
        <div className="bomb-ttl">{this.state.ttl}</div>
      </div>
    );
  }
}
