import React from "react";
import { Location } from "@reach/router";

const Nav = () => {
  const backLink = (
    <Location>
      {({ location }) => {
        if (location.state && location.state.fromCard) {
          return (
            <button
              type="button"
              onClick={() => window.history.back()}
              style={{ position: "absolute", left: "20px", top: "10px" }}
            >
              Back
            </button>
          );
        }
        return null;
      }}
    </Location>
  );

  return (
    <nav>
      {backLink}
      <h3 style={{ margin: 0 }}>Website name!</h3>
    </nav>
  );
};

export default Nav;
