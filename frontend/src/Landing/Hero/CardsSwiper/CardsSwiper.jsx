import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import "./CardsSwiper.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase, faUsers, faGraduationCap, faMoneyBill, faBook } from "@fortawesome/free-solid-svg-icons";


// Import Swiper CSS
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";

const services = [
  {
    title: "Groups & Forums",
    description: "Connect with alumni and join interest-based groups.",
    icon: faUsers,
  },
  {
    title: "Mentorship",
    description: "Get guidance from experienced alumni.",
    icon: faGraduationCap,
  },
  {
    title: "Donation Portal",
    description: "Support future students by contributing.",
    icon: faMoneyBill,
  },
  {
    title: "Career Guidance",
    description: "Receive tailored career advice.",
    icon: faBriefcase,
  },
  {
    title: "Webinars",
    description: "Enhance your skills through engaging sessions.",
    icon: faBook,
  },
];

// Card component
const Card = ({ title, description, icon }) => (
    <div className="card">
      <div className="card-icon">
        <FontAwesomeIcon icon={icon} size="sm" /> {/* Render the icon properly */}
      </div>
      <h3 className="card-title">{title}</h3>
      <p className="card-description">{description}</p>
    </div>
  );

function CardsSwiper() {
  return (
    <div className="card-slider">
      <Swiper
        centeredSlides={true}
        slidesPerView={3} 
        loop={true}
        navigation={true} 
        spaceBetween={20}
        pagination={{ clickable: true }}
        modules={[ Navigation, Pagination]}
        className="swiper-container"
      >
        {services.map((service, index) => (
          <SwiperSlide key={index}>
            <Card
              title={service.title}
              description={service.description}
              icon={service.icon}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default CardsSwiper;
