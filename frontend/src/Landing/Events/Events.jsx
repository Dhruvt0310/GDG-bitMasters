// import React, { useRef } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";

// import "./Events.css";

// import "swiper/css";
// import alumni from "../../assets/alumni-meet.jpg";
// import networking from "../../assets/networking-dinner.jpg";
// import mentorship from "../../assets/mentorship-circles.jpg";
// import webinars from "../../assets/webinars.jpg";
// import gala from "../../assets/fundraising-gala.jpg";
// import award from "../../assets/award-ceremony.jpg";

// function Events() {
//   const swiperRef = useRef(null);

//   const events = [
//     { name: "2024 Alumni Meet", image: alumni },
//     { name: "Networking Dinners", image: networking },
//     { name: "Mentorship Circles", image: mentorship },
//     { name: "Webinars with Experts", image: webinars },
//     { name: "Fundraising Gala", image: gala },
//     { name: "Award Ceremonies", image: award },
//   ];

//   const handleHover = (index) => {
//     if (swiperRef.current) {
//       swiperRef.current.slideTo(index); // Change the active slide
//     }
//   };

//   return (
//     <div className="events-container">
//       <div className="events-text">
//         Discover upcoming events, workshops,<br/> and networking opportunities to
//         connect and grow with our community.
//       </div>
//       <div className="events-content">
//         <div className="events-list">
//           <ul>
//             {events.map((event, index) => (
//               <li
//                 key={index}
//                 onMouseEnter={() => handleHover(index)}
//                 className="event-item"
//               >
//                 {event.name}
//               </li>
//             ))}
//           </ul>
//         </div>
//         <div className="events-slider">
//           <Swiper
//             onSwiper={(swiper) => (swiperRef.current = swiper)}
//             slidesPerView={1}
//             centeredSlides={true}
//             loop={true}
//             className="events-swiper-container"
//           >
//             {events.map((event, index) => (
//               <SwiperSlide key={index}>
//                 <img
//                   src={event.image}
//                   alt={event.name}
//                   className="event-image"
//                 />
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Events;
