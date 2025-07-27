import React from "react";
import "./Slogan.css";
function Slogan() {
  return (
    <div className="slogan-container">
      <div className="slogan-header">
        Connecting Legacies, Inspiring Futures
      </div>
      <div className="slogan-subtitle">
        Empowering alumni connections to foster mentorship, growth, and lasting
        impact for future generations.
      </div>
      <a className="slogan-button" href="/connect">Start Now</a>
    </div>
  );
}

export default Slogan;
