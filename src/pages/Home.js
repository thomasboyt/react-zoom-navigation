import React from "react";

import Nav from "../components/Nav";
import Card from "../components/Card";

import DetailLong from "./DetailLong";
import DetailShort from "./DetailShort";

const Home = () => (
  <div className="page-container">
    <Nav />
    <div style={{ padding: "20px" }}>
      <h2>Welcome back!</h2>

      <div className="cards-container">
        <Card
          path="short"
          label="View short detail"
          renderPage={() => <DetailShort path="short" />}
        />
        <Card
          path="long"
          label="View long detail"
          renderPage={() => <DetailLong path="long" />}
        />
      </div>
    </div>
  </div>
);

export default Home;
