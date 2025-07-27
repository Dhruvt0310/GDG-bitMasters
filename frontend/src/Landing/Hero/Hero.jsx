import React from "react";
import hero from "../../assets/hero.jpg";
import "./Hero.css";
import CardsSwiper from "./CardsSwiper/CardsSwiper";
function Hero() {
  return (
    <div className="hero-container mb-4">
      <div className="hero-text">Reconnect. Inspire. Thrive.</div>
      <div className="hero-image">
        <img src={hero} alt="Image of a class reunion" />
      </div>
      <div className="cards-overlay">
        <CardsSwiper/>
      </div>
    </div>
  );
}

export default Hero;
