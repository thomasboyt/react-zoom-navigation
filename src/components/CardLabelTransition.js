import React from "react";

import { ELEMENTS_FADE_IN_MS, ELEMENTS_FADE_OUT_MS } from "./timing";

class CardLabelTransition extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      styles: {
        opacity: 1
      }
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

  onEntering = isAppear => {
    this.setState({
      styles: {
        opacity: 0,
        display: "none"
      }
    });

    setTimeout(() => {
      this.setState({
        styles: {
          opacity: 0,
          transition: `all ${ELEMENTS_FADE_IN_MS}ms ease-in`
        }
      });

      requestAnimationFrame(() => {
        this.setState({
          styles: {
            opacity: 1,
            transition: `all ${ELEMENTS_FADE_IN_MS}ms ease-in`
          }
        });
      });
    }, ELEMENTS_FADE_OUT_MS);
  };

  onEntered = () => {
    this.setState({
      styles: {
        opacity: 1
      }
    });
  };

  // base card is disappearing
  onExiting = () => {
    console.log("exit!");
    this.setState({
      styles: {
        opacity: 1
      }
    });

    requestAnimationFrame(() => {
      this.setState({
        styles: {
          opacity: 0,
          transition: `all ${ELEMENTS_FADE_OUT_MS}ms ease-in`
        }
      });
    });
  };

  render() {
    return <div style={this.state.styles}>{this.props.children}</div>;
  }
}
export default CardLabelTransition;
