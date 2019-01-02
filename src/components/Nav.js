import React from "react";
import { Location } from "@reach/router";

const Nav = () => {
  const backLink = (
    <Location>
      {({ location, navigate }) => {
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

        if (location.pathname !== "/") {
          return (
            <button
              type="button"
              onClick={() => navigate("/")}
              style={{ position: "absolute", left: "20px", top: "10px" }}
            >
              Close
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
