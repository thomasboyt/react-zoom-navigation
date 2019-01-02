import React from "react";

import {
  CARD_FADE_TIME_MS,
  CARD_EXPAND_CLOSE_TIME_MS
} from "./CardOpenCloseTransition";

class BaseCardTransition extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: 1
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.state !== prevProps.state) {
      if (this.props.state === "entering") {
        this.onEntering();
        // } else if (this.props.state === "entered") {
        //   this.onEntered();
      } else if (this.props.state === "exiting") {
        this.onExiting();
      }
    }
  }

  onEntering = () => {
    this.setState({
      opacity: 0
    });

    requestAnimationFrame(() => {
      this.setState({
        opacity: 1,
        transition: `all ${CARD_FADE_TIME_MS}ms ease-in ${CARD_EXPAND_CLOSE_TIME_MS}ms`
      });
    });
  };

  // onEntered = () => {
  //   this.setState({
  //     opacity: 1
  //   });
  // };

  // base card is disappearing
  onExiting = () => {
    this.setState({
      opacity: 1,
      transition: `all ${CARD_FADE_TIME_MS}ms ease-out`
    });

    requestAnimationFrame(() => {
      this.setState({
        opacity: 0
      });
    });
  };

  render() {
    return (
      <div
        style={{
          transition: this.state.transition,
          opacity: this.state.opacity
        }}
      >
        {this.props.children}
      </div>
    );
  }
}
export default BaseCardTransition;
