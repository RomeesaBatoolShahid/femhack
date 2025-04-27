import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Navbar from "../Components/Navbar"; // ✅ Import Navbar properly

const LandingPage = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonRef = useRef(null);
  const featuresRef = useRef([]);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });
    tl.from(titleRef.current, { opacity: 0, y: -50, duration: 1, ease: "power4.out" })
      .from(subtitleRef.current, { opacity: 0, y: 20, duration: 1, ease: "power4.out" }, "-=0.6")
      .from(buttonRef.current, { opacity: 0, scale: 0.9, duration: 1, ease: "elastic.out(1, 0.5)" }, "-=0.8")
      .from(featuresRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
      }, "-=0.5");
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-100 via-blue-100 to-purple-200 text-gray-800 relative overflow-hidden">
      
      {/* Navbar */}
      <Navbar /> {/* ✅ Navbar Component used here */}

      {/* Floating background shapes */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-purple-300 opacity-30 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-300 opacity-20 rounded-full blur-3xl animate-ping"></div>
      <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-pink-300 opacity-30 rounded-full blur-2xl animate-pulse"></div>

      {/* Hero Section */}
      <div className="flex flex-col justify-center items-center flex-grow px-6 pt-20">
        <h1 ref={titleRef} className="text-4xl sm:text-6xl font-extrabold mb-4 text-center leading-tight">
          Welcome to Trello Clone 🚀
        </h1>

        <p ref={subtitleRef} className="text-lg sm:text-xl mb-8 text-center max-w-2xl">
          Organize your tasks beautifully with an intuitive and powerful Kanban board experience.
        </p>

        {/* Single "Get Started" Button */}
        <div ref={buttonRef} className="flex justify-center">
          <Link
            to="/signup"
            className="px-10 py-4 bg-purple-500 text-white font-bold rounded-full shadow-lg hover:bg-purple-600 transition text-center text-lg"
          >
            Get Started
          </Link>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 mb-20 max-w-6xl w-full text-center">
          {[ 
            { title: "Organize Everything", desc: "Sort your tasks in custom boards and lists." },
            { title: "Move Fast", desc: "Drag and drop tasks effortlessly between stages." },
            { title: "Stay Focused", desc: "See your priorities clearly and stay productive." },
          ].map((feature, index) => (
            <div
              key={index}
              ref={(el) => (featuresRef.current[index] = el)}
              className="bg-white/60 p-6 rounded-2xl shadow-lg backdrop-blur-md"
            >
              <h3 className="text-xl font-bold mb-2 text-purple-700">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-600 pb-4">
        Crafted with 💖 for Hackathon 2025
      </div>
    </div>
  );
};

export default LandingPage;
