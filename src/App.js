import React, { Component } from "react";

import Home from "./pages/Home";
import { Router } from "@reach/router";

// XXX: I don't know if we'll need this top-level router right now, since the
// only pages within the SPA are subpages of the portal section. I also don't
// know whether <Home />'s wildcard path would prevent rendering other paths,
// like `/book-a-session`, as non-nested components.
class App extends Component {
  render() {
    return (
      <Router>
        <Home path="/*" />
      </Router>
    );
  }
}

export default App;
