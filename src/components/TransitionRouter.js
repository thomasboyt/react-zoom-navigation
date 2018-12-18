import React from "react";
import { Location, Router } from "@reach/router";
import { TransitionGroup, Transition } from "react-transition-group";
import CardOpenCloseTransition, {
  ANIMATION_TIME_MS
} from "./CardOpenCloseTransition";

// TODO: Support links to/from non-card things... don't do the big transition!
class TransitionRouter extends React.Component {
  render() {
    return (
      <Location>
        {({ location }) => (
          <TransitionGroup className="transition-group" component={null}>
            <Transition key={location.key} timeout={ANIMATION_TIME_MS}>
              {state => {
                const inner = (
                  <Router location={location}>{this.props.children}</Router>
                );

                // TODO: This doesn't currently support accessing /detail
                // directly and then closing into a card. Refresh will work
                // because browsers persist the state, but return visit direct
                // to the URL won't.
                //
                // I am _fine_ not supporting this animation, but we need to
                // support _something_ - right now it just appears to hang for
                // ANIMATION_TIME_MS.
                if (location.state && location.state.card === this.props.for) {
                  return (
                    <CardOpenCloseTransition state={state}>
                      {inner}
                    </CardOpenCloseTransition>
                  );
                } else {
                  return inner;
                }
              }}
            </Transition>
          </TransitionGroup>
        )}
      </Location>
    );
  }
}

export default TransitionRouter;
