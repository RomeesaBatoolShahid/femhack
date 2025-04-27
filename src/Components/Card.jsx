import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const Card = ({ title }) => {
  const cardRef = useRef();

  useEffect(() => {
    gsap.from(cardRef.current, {
      opacity: 0,
      y: 50,
      rotateY: 90,
      duration: 1,
      ease: "power4.out"
    });
  }, []);

  return (
    <div
      ref={cardRef}
      className="bg-purple-500 text-white p-4 rounded-lg shadow-md hover:scale-105 transform transition-transform duration-300"
    >
      {title}
    </div>
  );
};

export default Card;
