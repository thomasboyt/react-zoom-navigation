import React from "react";

export const ANIMATION_TIME_MS = 500;

const startStyles = {
  transformOrigin: "top left",
  zIndex: 100,
  position: "absolute",
  top: "40px",
  left: 0,
  background: "white",
  maxHeight: "100vh"
};

// yoinked from material design's timing fns
const timing = "cubic-bezier(0.4, 0.0, 0.2, 1)";

const activeStyles = {
  transition: `all ${ANIMATION_TIME_MS}ms ${timing}`
  // border: "0px grey solid"
};

/**
 * 1. Route with {fromCard: '.cardName'} state is clicked.
 * 2. New route enters with "entering" state. <CardOpenTransition /> diffs this
 *    state on each update, and in this case, when it sees it go to "entering,"
 *    it gets the current location of the card by looking up the selector and
 *    measuring the card's position and size, storing it locally.
 * 3. <CardOpenTransition /> sets itself to be `position: absolute` and places
 *    itself at the measured dimensions. It then scales down for sizing to match
 *    the card size - this is VERY up in the air; I think this may need to do a
 *    scale() transform that is calculated by comparing size of viewport and
 *    size of card? Can also use translate() to place it instead of position
 *    absolute if doing this.
 *  4. The animation of <CardOpenTransition /> scales from this set position and
 *     scale to the correct transform - translate(0, 0) scale(1, 1).
 */
class CardOpenCloseTransition extends React.Component {
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

  getContentToCardSizeTransform() {
    // XXX: this relies on dom structure, so, careful updating the hierarchy...
    // would be nice if this had a query selector coupled with it but can't
    // really do parent query selectors easily w/o jquery or something afaik
    const card = this.ref.current.parentElement;

    const cardRect = card.getBoundingClientRect();

    const content = this.ref.current;
    const contentRect = content.getBoundingClientRect();

    const translate = {
      x: cardRect.x - contentRect.x,
      y: cardRect.y - contentRect.y
    };

    const scale = {
      x: card.offsetWidth / window.innerWidth,
      y: card.offsetHeight / window.innerHeight
    };

    const translateRule = `translate3d(${translate.x}px, ${translate.y}px, 0)`;
    const scaleRule = `scale3d(${scale.x}, ${scale.y}, 1)`;
    return `${translateRule} ${scaleRule}`;
  }

  onEntering() {
    this.setState({
      styles: {
        transform: this.getContentToCardSizeTransform(),
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
          transition: `all ${ANIMATION_TIME_MS}ms ${timing}`
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

    requestAnimationFrame(() => {
      this.setState({
        styles: {
          transform: this.getContentToCardSizeTransform(),
          ...activeStyles,
          ...startStyles
        },
        innerStyles: {
          opacity: 0,
          transition: `all ${ANIMATION_TIME_MS}ms ${timing}`
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

export default CardOpenCloseTransition;
