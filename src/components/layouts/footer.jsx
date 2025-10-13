import React from 'react';
import { MdMailOutline } from 'react-icons/md';
import { TiSocialFacebookCircular } from "react-icons/ti";
import { LiaTelegram } from "react-icons/lia";
import { AiOutlineYoutube } from "react-icons/ai";
import { GrLocation } from "react-icons/gr";

const Footer = () => {
  // Define a color variable consistent with the lucide icon styling
  const ICON_COLOR = "text-[#3b5998]"; 
  const ACCENT_HOVER_COLOR = "hover:text-[#FF7A00]";

  return (
    <footer className="bg-[#EFF7FF] py-8 text-[#1A5276] font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid/Flex Container: Stacks on small screens, becomes a row on medium screens */}
        <div className="flex flex-col md:flex-row flex-wrap justify-between items-center md:items-start space-y-8 md:space-y-0 md:space-x-4 lg:space-x-16">

          {/* Organized and sponsored By */}
          {/* Use md:w-1/5 and lg:w-1/6 to allow Contact/Follow sections more space */}
          <div className="flex-1 w-full md:w-auto md:max-w-[20%] flex flex-col items-center text-center">
            <h4 className="font-bold text-lg mb-4 whitespace-nowrap">Organized and sponsored By</h4>
            {/* Adjust logo size for better mobile scaling */}
            <div className="w-24 h-24 sm:w-30 sm:h-30"> 
              <img src="ISTAD.png" alt="ISTAD" className="w-full h-full object-contain" />
            </div>
          </div>

          {/* Prepared By */}
          <div className="flex-1 w-full md:w-auto md:max-w-[20%] flex flex-col items-center text-center">
            <h4 className="font-bold text-lg mb-4 whitespace-nowrap">Prepared By</h4>
            {/* Adjust logo size for better mobile scaling */}
            <div className="w-32 h-auto sm:w-40">
              <img src="JOBCOLLAB.png" alt="JOBCOLLAB" className="w-full h-full object-contain" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex-1 w-full md:w-auto md:max-w-[20%] text-center md:text-left">
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline hover:text-[#FF7A00]">Home</a></li>
              <li><a href="#" className="hover:underline hover:text-[#FF7A00]">Find Jobs</a></li>
              <li><a href="#" className="hover:underline hover:text-[#FF7A00]">About Us</a></li>
              <li><a href="#" className="hover:underline hover:text-[#FF7A00]">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact Us & Follow Us Container - Takes up more space on large screens */}
          {/* Changed to flex-col on small, then flex-row on medium to keep contact/follow side-by-side */}
          <div className="w-full md:w-auto md:max-w-[40%] flex flex-col sm:flex-row md:flex-row md:space-x-8 lg:space-x-12 mt-8 md:mt-0">


            {/* Contact Us */}
           <div className="flex-1 text-center sm:text-left min-w-[250px] mb-8 sm:mb-0">
              <h4 className="font-bold text-lg mb-4">Contact Us</h4>
              <div className="flex flex-col space-y-2">
                {/* Email Address */}
                <div className="flex items-start space-x-2 justify-center sm:justify-start"> 
                  {/* Adjusted mt-1 to mt-0.5 for slight alignment shift */}
                  <MdMailOutline className={`text-xl flex-shrink-0 mt-0.5`} /> 
                  <span className="text-left">info@jobcollap.com</span> 
                </div>
                
                {/* Address section (UPDATED TO USE MdOutlineLocationOn) */}
                <div className="flex items-start space-x-2 text-[#1A5276] justify-center sm:justify-start">
                  
                  <GrLocation 
                    className={`text-xl flex-shrink-0 mt-0.5`} 
                  />

                  {/* Address text container */}
                  <address className="not-italic text-left mb-1">
                    <span className="block">#24, St.562, Boeung Kak,</span>
                    <span className="block">Toul Kork, Phnom Penh,</span>
                    <span className="block">Cambodia</span>
                  </address>
                </div>
              </div>
            </div>

            {/* Follow Us */}
            {/* Ensure Follow Us is centered on small/tablet, but aligned right or left depending on available space on large screens */}
            <div className="flex-1 text-center">
              <h4 className="font-bold text-lg mb-4">Follow Us</h4>
              <div className="flex justify-center sm:justify-center space-x-2.5 text-2xl ">
                {/* TiSocialFacebookCircular is already a React Icon, keeping it */}
                <a href="#" aria-label="Facebook" className={` transition-colors duration-300 text-right `}>
                  <TiSocialFacebookCircular />
                </a>
                {/* LiaTelegram is already a React Icon, keeping it */}
                <a href="#" aria-label="Telegram" className={` transition-colors duration-300`}>
                  <LiaTelegram />
                </a>
                {/* AiOutlineYoutube is already a React Icon, keeping it */}
                <a href="#" aria-label="YouTube" className={` transition-colors duration-300`}>
                  <AiOutlineYoutube />
                </a>
              </div>
            </div>
          </div>
        </div>
       {/* Copyright Section */}
       <div className="mt-8 pt-4 border-t border-t-[#c4d4e3] text-[#1A5276] bg-[#EFF7FF]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-[#1A5276] text-sm py-2">
            <p className="flex justify-center items-center space-x-1">
              <span className="text-xl">©</span>
              <span>2025 JobCollab. All rights reserved.</span>
            </p>
          </div>
       </div>
      </div>
    </footer>
  );
};

export default Footer;
