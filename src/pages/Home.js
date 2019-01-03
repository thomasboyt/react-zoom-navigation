import React from "react";

import Nav from "../components/Nav";
import Card from "../components/Card";

import DetailLong from "./DetailLong";
import DetailShort from "./DetailShort";

const Home = () => (
  <div className="page-container">
    <Nav />

    <div style={{ padding: "20px 3px" }}>
      <h2>Welcome back!</h2>

      <div className="cards-container">
        <Card
          path="short"
          label="View short detail"
          renderPage={() => <DetailShort />}
        />
        <Card
          path="long"
          label="View long detail"
          renderPage={() => <DetailLong />}
        />
        <Card
          path="long2"
          label="View long detail 2"
          renderPage={() => <DetailLong />}
        />
      </div>
    </div>
  </div>
);

export default Home;
