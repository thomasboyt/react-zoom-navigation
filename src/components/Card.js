import React from "react";
import { Link } from "@reach/router";
import TransitionRouter from "./TransitionRouter";

import {
  ANIMATION_TIME_MS,
  timingFn,
  ELEMENTS_FADE_OUT_MS,
  ELEMENTS_FADE_IN_MS,
  accelerationFn,
  decelerationFn
} from "./timing";

const CardLink = ({ to, label }) => (
  <Link to={to} state={{ fromCard: true, card: to }}>
    {label}
  </Link>
);

const CardContent = ({ render, style }) => <div style={style}>{render()}</div>;
const CardPage = ({ render, style }) => <div style={style}>{render()}</div>;

const baseExpandedStyles = {
  margin: "0px",
  position: "absolute",
  zIndex: 100,
  background: "white",
  overflow: "hidden",
  transformOrigin: "top left",
  top: "0px",
  left: "0px",
  height: "100%",
  width: "100%",
  WebkitOverflowScrolling: "touch"
};

const enteredStyles = {
  borderColor: "white"
};

const borderTransition = `border-color ${ANIMATION_TIME_MS}ms ${timingFn}`;
const transformTransition = `transform ${ANIMATION_TIME_MS}ms ${timingFn}`;

function getScale(naturalSize, targetSize) {
  const scale = {
    x: targetSize.x / naturalSize.x,
    y: targetSize.y / naturalSize.y
  };

  return scale;
}

const initialState = {
  showPlaceholder: false,
  style: {
    overflow: "hidden"
  },
  pageStyle: {
    position: "absolute",
    opacity: 0
  },
  contentStyle: {}
};

class Card extends React.Component {
  constructor(props) {
    super(props);

    this.state = initialState;

    this.ref = React.createRef();
    this.placeholderRef = React.createRef();
  }

  handleCardPageEnter = () => {
    /*
     * Expand card sizing
     */

    const card = this.ref.current;
    const scale = getScale(
      { x: window.innerWidth, y: window.innerHeight },
      { x: card.offsetWidth, y: card.offsetHeight }
    );
    const { x, y } = card.getBoundingClientRect();
    const transform = `translate3d(${x}px, ${y}px, 0) scale3d(${scale.x}, ${
      scale.y
    }, 1)`;
    console.log(transform);

    this.setState({
      showPlaceholder: true,
      style: {
        ...baseExpandedStyles,
        transform
      }
    });

    requestAnimationFrame(() => {
      this.setState({
        style: {
          ...baseExpandedStyles,
          ...enteredStyles,
          transform: "translate3d(0px, 40px, 0px) scale3d(1, 1, 1)",
          transition: `${transformTransition}, ${borderTransition}`
        }
      });
    });

    /*
     * Fade out card content
     */
    this.setState({
      contentStyle: {
        opacity: 1,
        transformOrigin: "top left",
        transform: `scale3d(${1 / scale.x}, ${1 / scale.y}, 1)`
      }
    });

    requestAnimationFrame(() => {
      this.setState({
        contentStyle: {
          opacity: 0,
          transformOrigin: "top left",
          transform: `scale3d(1, 1, 1)`,
          transition: `${transformTransition}, opacity ${ELEMENTS_FADE_OUT_MS}ms ${accelerationFn}`
        }
      });
    });

    /*
     * Fade in page
     */

    const basePageStyle = {
      position: "absolute",
      opacity: 0
    };

    this.setState({
      pageStyle: basePageStyle
    });

    requestAnimationFrame(() => {
      this.setState({
        pageStyle: {
          ...basePageStyle,
          opacity: 1,
          transition: `opacity ${ELEMENTS_FADE_IN_MS}ms ${decelerationFn} ${ELEMENTS_FADE_OUT_MS}ms`
        }
      });
    });
  };

  handleCardPageEntered = () => {
    // used for page where you open to already expanded card
    this.setState({
      showPlaceholder: true,
      style: {
        ...baseExpandedStyles,
        ...enteredStyles,
        overflow: "auto",
        top: "40px",
        height: "calc(100% - 40px)"
      },
      pageStyle: {
        opacity: 1
      }
    });
  };

  handleCardPageExit = () => {
    /*
     * Scale card back down
     */
    const card = this.placeholderRef.current;
    const scale = getScale(
      { x: window.innerWidth, y: window.innerHeight },
      { x: card.offsetWidth, y: card.offsetHeight }
    );
    const { x, y } = card.getBoundingClientRect();
    const transform = `translate3d(${x}px, ${y}px, 0) scale3d(${scale.x}, ${
      scale.y
    }, 1)`;

    this.setState({
      showPlaceholder: true,
      style: {
        ...baseExpandedStyles,
        ...enteredStyles,
        transform: "translate3d(0px, 40px, 0px) scale3d(1, 1, 1)"
      }
    });

    requestAnimationFrame(() => {
      this.setState({
        style: {
          ...baseExpandedStyles,
          transform,
          transition: `${transformTransition}, ${borderTransition}`
        }
      });
    });

    /*
     * Fade out page content
     */

    const basePageStyle = {
      position: "absolute",
      opacity: 1
    };

    this.setState({
      pageStyle: basePageStyle
    });

    requestAnimationFrame(() => {
      this.setState({
        pageStyle: {
          ...basePageStyle,
          opacity: 0,
          transition: `opacity ${ELEMENTS_FADE_OUT_MS}ms ${accelerationFn}`
        }
      });
    });

    /*
     * Fade in card content
     */
    this.setState({
      contentStyle: {
        // set to prevent the incoming content from pushing down the page down
        // before it starts fading in. you'd think you could use display: none
        // for this, but it appears to break the opacity transition for reasons
        // I don't understand, so this works out since it's invisible anyways
        position: "absolute",
        opacity: 0,
        transformOrigin: "top left",
        transform: `scale3d(1, 1, 1)`
      }
    });

    setTimeout(() => {
      this.setState({
        contentStyle: {
          opacity: 0,
          transformOrigin: "top left",
          transform: `scale3d(${1 / scale.x}, ${1 / scale.y}, 1)`,
          transition: `opacity ${ELEMENTS_FADE_IN_MS}ms ease-in`
        }
      });

      requestAnimationFrame(() => {
        this.setState({
          contentStyle: {
            opacity: 1,
            transformOrigin: "top left",
            transform: `scale3d(${1 / scale.x}, ${1 / scale.y}, 1)`,
            transition: `opacity ${ELEMENTS_FADE_IN_MS}ms ease-in`
          }
        });
      });
    }, ELEMENTS_FADE_OUT_MS);
  };

  handleCardPageExited = () => {
    this.setState(initialState);
  };

  renderPlaceholder() {
    const style = {
      visibility: "hidden",
      display: this.state.showPlaceholder ? "block" : "none"
    };

    return (
      <div className="card" style={style} ref={this.placeholderRef}>
        {this.props.label}
      </div>
    );
  }

  render() {
    return (
      <React.Fragment>
        <div className="card" style={this.state.style} ref={this.ref}>
          <div style={{ position: "relative" }}>
            <TransitionRouter
              for={this.props.path}
              onCardPageEnter={this.handleCardPageEnter}
              onCardPageEntered={this.handleCardPageEntered}
              onCardPageExit={this.handleCardPageExit}
              onCardPageExited={this.handleCardPageExited}
            >
              <CardContent
                path="/"
                render={() => (
                  <CardLink
                    path="/"
                    to={this.props.path}
                    label={this.props.label}
                  />
                )}
                style={this.state.contentStyle}
              />
              <CardPage
                path={this.props.path}
                render={this.props.renderPage}
                style={this.state.pageStyle}
              />
            </TransitionRouter>
          </div>
        </div>
        {this.renderPlaceholder()}
      </React.Fragment>
    );
  }
}

export default Card;
