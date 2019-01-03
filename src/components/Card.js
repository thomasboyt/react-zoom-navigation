import React from "react";
import { Link } from "@reach/router";
import TransitionRouter from "./TransitionRouter";

import { ANIMATION_TIME_MS, timingFn } from "./timing";

const transition = `all ${ANIMATION_TIME_MS}ms ${timingFn}`;

const CardLink = ({ to, label }) => (
  <Link to={to} state={{ fromCard: true, card: to }}>
    {label}
  </Link>
);

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
  height: "100vh",
  width: "100vw"
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

class Card extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showPlaceholder: false,
      style: {
        overflow: "hidden"
      }
    };

    this.ref = React.createRef();
    this.placeholderRef = React.createRef();
  }

  handleExpand = isAppear => {
    if (isAppear) {
      // initial page render, skip transition
      this.handleExpanded();
      return;
    }

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
  };

  handleExpanded = () => {
    // used for page where you open to already expanded card
    this.setState({
      showPlaceholder: true,
      style: {
        ...baseExpandedStyles,
        ...enteredStyles,
        overflow: "auto"
      }
    });
  };

  handleClose = () => {
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
  };

  handleClosed = () => {
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
              onCardPageEnter={this.handleExpand}
              onCardPageEntered={this.handleExpanded}
              onCardPageExit={this.handleClose}
              onCardPageExited={this.handleClosed}
            >
              <CardLink
                path="/"
                to={this.props.path}
                label={this.props.label}
              />
              {this.props.renderPage()}
            </TransitionRouter>
          </div>
        </div>
        {this.renderPlaceholder()}
      </React.Fragment>
    );
  }
}

export default Card;
