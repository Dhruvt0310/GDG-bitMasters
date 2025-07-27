import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Link } from "react-router-dom";

const Section1 = () => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  const cardContents = [
    { title: "Cognitive Engagement", text: "Overloaded with work? Relieve some stress ", link: "/cognition" },
    { title: "AI Counselor", text: "Need to talk to someone? Feel free to do so", link: "/counselor" },
    { title: "Calendar", text: "This is the content for Calendar.", link: "/calendar" },
    { title: "Social Network", text: "This is the content for Social Network.", link: "/socialnetwork" },
  ];

  useEffect(() => {
    const tl = gsap.timeline();

    tl.set(cardsRef.current, { opacity: 0, scale: 0.5 })
      .to(cardsRef.current, { opacity: 1, scale: 1, duration: 6 })
      .to(cardsRef.current, { rotation: 360, duration: 2 })
      .to(cardsRef.current[4], {
        width: "520px",
        height: "180px",
        backgroundColor:"#fffff",
        duration: 1,
      })
      .to(cardsRef.current[0], { top: "17%", left: "50%", duration: 1 }, "move")
      .to(cardsRef.current[1], { top: "83%", left: "50%", duration: 1 }, "move")
      .to(cardsRef.current[2], { top: "50%", left: "24%", duration: 1 }, "move")
      .to(cardsRef.current[3], { top: "50%", left: "76%", duration: 1 }, "move");
      
  }, []);

  return (
    <div
      ref={containerRef}
      className=" section1-background bg-cover relative w-screen h-screen max-w-full flex items-center justify-center "
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          ref={(el) => (cardsRef.current[index] = el)}
          className=" absolute w-60 h-56 text-center bg-gray-800 flex flex-col items-center justify-center text-white shadow-lg p-4 rounded-2xl"
          style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
        >
          {index < 4 ? (
            <>
              <p className="text-lg font-semibold">{cardContents[index].title}</p>
              <p className="text-sm mt-2">{cardContents[index].text}</p>
              <Link to={cardContents[index].link}>
                <button className="mt-8 px-4 py-2 bg-[#3e3e3e] text-[#ffff] rounded border-2 border-[#4e4848] hover:bg-[#333333cc] hover:border-[#555]">
                  Explore
                </button>
              </Link>
            </>
          ) : (
            <p className="text-2xl font-bold">Our Implementations</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Section1;
