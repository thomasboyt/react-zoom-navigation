import React from "react";
import Card from "../components/Card";
import TransitionRouter from "../components/TransitionRouter";

import DetailLong from "./DetailLong";
import { Link } from "@reach/router";
import Nav from "../components/Nav";
import DetailShort from "./DetailShort";

const CardLink = ({ to, label }) => (
  <Link to={to} state={{ fromCard: true, card: to }}>
    {label}
  </Link>
);

const ShortDetailCard = () => (
  <Card>
    <TransitionRouter for="short">
      <CardLink path="/" to="short" label="View short detail" />
      <DetailShort path="short" />
    </TransitionRouter>
  </Card>
);

const LongDetailCard = () => (
  <Card>
    <TransitionRouter for="long">
      <CardLink path="/" to="long" label="View long detail" />
      <DetailLong path="long" />
    </TransitionRouter>
  </Card>
);

const Home = () => (
  <div className="page-container">
    <Nav />
    <div style={{ padding: "20px" }}>
      <h2>Welcome back!</h2>

      <div className="cards-container">
        <ShortDetailCard />
        <LongDetailCard />
      </div>
    </div>
  </div>
);

export default Home;
