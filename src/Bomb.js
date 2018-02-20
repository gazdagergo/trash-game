import React, { Component } from "react";
import PropTypes from "prop-types";
import { DragSource } from "react-dnd";
import { getRandomInRange, getRemainingSec } from "./helper";

const BombSource = {
  beginDrag(props) {
    return {
      id: props.id
    };
  }
};

@DragSource(props => props.type, BombSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
export default class Bomb extends Component {
  state = {
    ttl: 0,
    start: null,
    remaining: 0
  };

  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    id: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    position: PropTypes.shape({
      left: PropTypes.string,
      top: PropTypes.string
    }),
    handleLifeEnd: PropTypes.func
  };

  componentDidMount() {
    const ttl = getRandomInRange(5, 10);
    this.setState({ ttl, remaining: ttl });
    this.setState({ start: Date.now() });
    this.timer = setInterval(() => this.handleTtl(), 50);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  handleTtl = () => {
    const remaining = getRemainingSec(this.state.start, this.state.ttl);

    if (remaining === 0) {
      clearInterval(this.timer);
      this.props.handleLifeEnd();
    }
    if (remaining < this.state.remaining) {
      this.setState({ remaining });
    }
  };

  render() {
    const { type, connectDragSource, position } = this.props;

    return connectDragSource(
      <div className={`bomb bomb-${type}`} style={{ ...position }}>
        <div className="bomb-ttl">{this.state.remaining}</div>
      </div>
    );
  }
}
