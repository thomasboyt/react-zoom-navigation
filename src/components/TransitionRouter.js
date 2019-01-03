import React from "react";
import { Location, Router } from "@reach/router";
import { TransitionGroup, Transition } from "react-transition-group";

import { ANIMATION_TIME_MS } from "./timing";

class TransitionRouter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isActiveRouter: false
    };
  }

  componentDidMount() {
    if (this.testLocation(window.location)) {
      // ensure card is opened if page is initially with an open card
      // TODO: should this logic live in <Card /> ?
      this.props.onCardPageEntered();
    }
  }

  testLocation = location => {
    const matches = location.pathname === "/" + this.props.for;
    return matches;
  };

  handleEnter(location) {
    if (this.testLocation(location)) {
      this.setState({ isActiveRouter: true });
      this.props.onCardPageEnter();
    }
  }

  handleEntered(location) {
    if (this.testLocation(location)) {
      this.setState({ isActiveRouter: false });
      this.props.onCardPageEntered();
    }
  }
  handleExit(location) {
    if (this.testLocation(location)) {
      this.setState({ isActiveRouter: true });
      this.props.onCardPageExit();
    }
  }

  handleExited(location) {
    if (this.testLocation(location)) {
      this.setState({ isActiveRouter: false });
      this.props.onCardPageExited();
    }
  }

  render() {
    return (
      <Location>
        {({ location }) => (
          <TransitionGroup className="transition-group" component={null}>
            <Transition
              key={location.key}
              timeout={ANIMATION_TIME_MS}
              onEnter={() => this.handleEnter(location)}
              onEntered={() => this.handleEntered(location)}
              onExit={() => this.handleExit(location)}
              onExited={() => this.handleExited(location)}
            >
              {state => {
                const inner = (
                  <Router location={location}>{this.props.children}</Router>
                );

                return inner;
              }}
            </Transition>
          </TransitionGroup>
        )}
      </Location>
    );
  }
}

export default TransitionRouter;
