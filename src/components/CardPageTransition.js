import React from "react";
import innerHeight from "ios-inner-height";

import {
  timingFn,
  ANIMATION_TIME_MS,
  ELEMENTS_FADE_IN_MS,
  ELEMENTS_FADE_OUT_MS
} from "./timing";

const startStyles = {
  transformOrigin: "top left",
  zIndex: 100,
  position: "absolute",
  left: 0,
  maxHeight: "100vh"
};

const activeStyles = {
  transition: `all ${ANIMATION_TIME_MS}ms ${timingFn}`
};

class CardPageTransition extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      styles: startStyles,
      innerStyles: null
    };

    this.ref = React.createRef();
  }

  componentDidUpdate(prevProps) {
    if (this.props.state !== prevProps.state) {
      if (this.props.state === "entering") {
        this.onEntering();
      } else if (this.props.state === "entered") {
        this.onEntered();
      } else if (this.props.state === "exiting") {
        this.onExiting();
      } else if (this.props.state === "exited") {
      }
    }
  }

  getCard() {
    // XXX: this relies on dom structure, so, careful updating the hierarchy...
    // would be nice if this had a query selector coupled with it but can't
    // really do parent query selectors easily w/o jquery or something afaik
    const card = this.ref.current.parentElement.parentElement;
    return card;
  }

  getContentToCardSizeTransform() {
    const card = this.getCard();

    const scale = {
      x: card.offsetWidth / window.innerWidth,
      y: card.offsetHeight / innerHeight()
    };

    const scaleRule = `scale3d(${scale.x}, ${scale.y}, 1)`;
    return `${scaleRule}`;
  }

  onEntering() {
    this.setState({
      styles: {
        transform: this.getContentToCardSizeTransform(),
        visibility: "hidden",
        ...startStyles
      },
      innerStyles: {
        opacity: 0
      }
    });

    requestAnimationFrame(() => {
      this.setState({
        styles: {
          transform: `translate3d(0px, 0px, 0px) scale3d(1, 1, 1)`,
          ...activeStyles,
          ...startStyles
        },
        innerStyles: {
          opacity: 1,
          transition: `all ${ELEMENTS_FADE_IN_MS}ms ease-out ${ELEMENTS_FADE_OUT_MS}ms`
        }
      });
    });
  }

  onExiting() {
    this.setState({
      styles: {
        transform: `translate3d(0px, 0px, 0px) scale3d(1, 1, 1)`,
        ...startStyles
      },
      innerStyles: {
        opacity: 1
      }
    });

    const endStyles = {
      transform: this.getContentToCardSizeTransform(),
      ...activeStyles,
      ...startStyles
    };

    requestAnimationFrame(() => {
      this.setState({
        styles: endStyles,
        innerStyles: {
          opacity: 0,
          transition: `all ${ELEMENTS_FADE_OUT_MS}ms ease-in`
        }
      });
    });
  }

  onEntered() {
    this.setState({
      styles: startStyles
    });
  }

  render() {
    return (
      <div style={this.state.styles} ref={this.ref}>
        <div style={this.state.innerStyles}>{this.props.children}</div>
      </div>
    );
  }
}

export default CardPageTransition;
