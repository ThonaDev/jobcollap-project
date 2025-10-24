import React from "react";
import { NavLink } from "react-router-dom";
import NavBar from "../../components/layouts/navbar-afterLogin";
import Sokeang from "../../assets/Sokkeang.jpg";

const Herosection = () => {
  return (
    <section className="bg-gradient-to-b from-blue-200 via-blue-100 to-white pb-21 pt-21 px-6 sm:px-12 md:px-24 lg:px-32 xl:px-40 absolute top-0 w-full">
      {/* <NavBar className="mb-16" /> */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center pt-16">
        {/* Left Content */}
        <div className="space-y-10 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-poppins font-bold leading-snug md:leading-tight text-[#1A5276]">
            The Bridge Between <br />
            Talent, <span className="text-[#FF7A00]">Work and Growth</span>
          </h1>

          <p className="text-[#1A5276] font-poppins text-base sm:text-lg md:text-lg xl:text-xl max-w-md md:max-w-lg mx-auto md:mx-0 leading-relaxed">
            Hire world-class freelancers, collaborate on real-world projects, or
            level up with peer-driven learning – all in one place.
          </p>

          <NavLink
            to="/jobs"
            className="inline-block bg-[#1A5276] text-white px-6 py-3 sm:px-8 sm:py-4 font-poppins rounded-full font-medium hover:bg-blue-50 border border-transparent hover:border-[#1A5276] hover:text-[#1A5276] transition"
          >
            Find Jobs →
          </NavLink>
        </div>

        {/* Right Image */}
        <div className="relative flex justify-center mt-10 md:mt-0">
          <div className="rounded-full border-4 border-blue-200 p-2">
            <img
              // src="https://job-api.sokpheng.com/api/v1/medias/preview/55dfe748-f37a-44c5-a775-9330b9b9cae3.jpg"
              src={Sokeang}
              alt="Professional"
              className="rounded-full w-40 sm:w-52 md:w-64 lg:w-72 xl:w-80 h-40 sm:h-52 md:h-64 lg:h-72 xl:h-80 object-cover shadow-lg"
            />
          </div>

          {/* Decorative Shapes */}
          <div className="absolute top-4 sm:top-6 left-4 sm:left-6 w-3 h-3 sm:w-4 sm:h-4 bg-[#FF7A00] rounded-full"></div>
          <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 w-2 h-2 sm:w-4 sm:h-4 bg-[#1A5276] rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default Herosection;
