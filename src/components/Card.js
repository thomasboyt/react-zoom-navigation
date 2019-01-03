import React from "react";
import { Link } from "@reach/router";
import innerHeight from "ios-inner-height";
import TransitionRouter from "./TransitionRouter";

import {
  ANIMATION_TIME_MS,
  timingFn,
  ELEMENTS_FADE_OUT_MS,
  ELEMENTS_FADE_IN_MS,
  accelerationFn,
  decelerationFn
} from "./timing";

const transition = `all ${ANIMATION_TIME_MS}ms ${timingFn}`;

const CardLink = ({ to, label }) => (
  <Link to={to} state={{ fromCard: true, card: to }}>
    {label}
  </Link>
);

const CardContent = ({ render, style }) => <div style={style}>{render()}</div>;
const CardPage = ({ render, style }) => <div style={style}>{render()}</div>;

const baseExpandedStyles = {
  position: "absolute",
  zIndex: 100,
  background: "white",
  overflow: "hidden",
  borderWidth: "0px"
};

const enteredStyles = {
  top: "40px",
  left: "0px",
  height: "calc(100% - 40px)",
  width: "100%",
  WebkitOverflowScrolling: "touch"
};

function getClosedCardSizing(el) {
  const rect = el.getBoundingClientRect();

  const style = {
    left: `${rect.x}px`,
    top: `${rect.y}px`,
    width: `${el.offsetWidth}px`,
    height: `${el.offsetHeight}px`
  };

  return style;
}

function getScaledRule(naturalSize, targetSize) {
  const scale = {
    x: targetSize.x / naturalSize.x,
    y: targetSize.y / naturalSize.y
  };

  const scaleRule = `scale3d(${scale.x}, ${scale.y}, 1)`;
  return `${scaleRule}`;
}

class Card extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showPlaceholder: false,
      style: {
        overflow: "hidden"
      },
      pageStyle: {
        position: "absolute",
        opacity: 0
      }
    };

    this.ref = React.createRef();
    this.placeholderRef = React.createRef();
  }

  handleCardPageEnter = () => {
    /*
     * Expand card sizing
     */

    const card = this.ref.current;

    this.setState({
      showPlaceholder: true,
      style: {
        ...baseExpandedStyles,
        ...getClosedCardSizing(card)
      }
    });

    requestAnimationFrame(() => {
      this.setState({
        style: {
          ...baseExpandedStyles,
          ...enteredStyles,
          transition
        }
      });
    });

    /*
     * Fade out card content
     */
    this.setState({
      contentStyle: {
        opacity: 1
      }
    });

    requestAnimationFrame(() => {
      this.setState({
        contentStyle: {
          opacity: 0,
          transition: `opacity ${ELEMENTS_FADE_OUT_MS}ms ${accelerationFn}`
        }
      });
    });

    /*
     * Fade in page
     */

    const basePageStyle = {
      position: "absolute",
      transformOrigin: "top left",
      opacity: 0,
      transform: getScaledRule(
        { x: window.innerWidth, y: innerHeight() },
        { x: card.offsetWidth, y: card.offsetHeight }
      )
    };

    this.setState({
      pageStyle: basePageStyle
    });

    requestAnimationFrame(() => {
      this.setState({
        pageStyle: {
          ...basePageStyle,
          opacity: 1,
          transform: `scale3d(1, 1, 1)`,
          transition: `transform ${ANIMATION_TIME_MS}ms ${timingFn}, opacity ${ELEMENTS_FADE_IN_MS}ms ${decelerationFn} ${ELEMENTS_FADE_OUT_MS}ms`
          // transition: `transform ${ANIMATION_TIME_MS}ms ${timingFn}`
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
        overflow: "auto"
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

    this.setState({
      style: {
        ...baseExpandedStyles,
        ...enteredStyles
      }
    });

    requestAnimationFrame(() => {
      this.setState({
        style: {
          ...baseExpandedStyles,
          ...getClosedCardSizing(card),
          transition
        }
      });
    });

    /*
     * Fade out page content
     */

    const basePageStyle = {
      position: "absolute",
      transformOrigin: "top left",
      opacity: 1,
      transform: `scale3d(1, 1, 1)`
    };

    this.setState({
      pageStyle: basePageStyle
    });

    const transform = getScaledRule(
      { x: window.innerWidth, y: innerHeight() },
      { x: card.offsetWidth, y: card.offsetHeight }
    );

    requestAnimationFrame(() => {
      this.setState({
        pageStyle: {
          ...basePageStyle,
          opacity: 0,
          transform,
          transition: `transform ${ANIMATION_TIME_MS}ms ${timingFn}, opacity ${ELEMENTS_FADE_OUT_MS}ms ease-in`
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
        opacity: 0
      }
    });

    setTimeout(() => {
      this.setState({
        contentStyle: {
          opacity: 0,
          transition: `opacity ${ELEMENTS_FADE_IN_MS}ms ease-in`
        }
      });

      requestAnimationFrame(() => {
        this.setState({
          contentStyle: {
            opacity: 1,
            transition: `opacity ${ELEMENTS_FADE_IN_MS}ms ease-in`
          }
        });
      });
    }, ELEMENTS_FADE_OUT_MS);
  };

  handleCardPageExited = () => {
    this.setState({
      style: { overflow: "hidden" },
      showPlaceholder: false
    });
  };

  renderPlaceholder() {
    const style = {
      visibility: "hidden",
      display: this.state.showPlaceholder ? "block" : "none"
    };

    return (
      <div className="card home-card" style={style} ref={this.placeholderRef}>
        {this.props.label}
      </div>
    );
  }

  render() {
    return (
      <React.Fragment>
        <div className="card home-card" style={this.state.style} ref={this.ref}>
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
