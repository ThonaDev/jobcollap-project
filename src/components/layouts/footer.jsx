import React from 'react';
import { MdMailOutline } from 'react-icons/md';
import { TiSocialFacebookCircular } from "react-icons/ti";
import { LiaTelegram } from "react-icons/lia";
import { AiOutlineYoutube } from "react-icons/ai";
import { GrLocation } from 'react-icons/gr';
import { NavLink } from 'react-router-dom';
import istadLogo from '../../assets/istad.png'; // Import ISTAD logo
import jobCollabLogo from '../../assets/jobCollapLogo.png'; // Import JOBCOLLAB logo

const Footer = () => {
  return (
    <footer className="py-8 text-[#1A5276] font-Poppins">
      <div className="container mx-auto px-8">

        {/* Main Flex/Grid Container */}
        <div className="
          flex flex-col space-y-8
          md:grid md:grid-cols-2 md:gap-x-12 md:gap-y-10 md:space-y-0
          lg:flex lg:flex-row lg:justify-between lg:items-start
        ">

{/* 1. Organized and Sponsored By */}
<div className="flex flex-col items-center text-center space-x-1">
  <h4 className="font-bold text-lg mb-5.5 whitespace-nowrap">
    Organized and Sponsored By
  </h4>
  <div className="w-32 h-auto sm:w-40">
    <img src={istadLogo} alt="ISTAD" className="w-40 h-full object-contain" />
  </div>
</div>



          {/* 2. Prepared By */}
          <div className="flex flex-col items-center text-center">
            <h4 className="font-bold text-lg mb-8 whitespace-nowrap">Prepared By</h4>
            <div className="w-32 h-auto sm:w-40">
              <img src={jobCollabLogo} alt="JOBCOLLAB" className="w-full h-full object-contain" />
            </div>
          </div>

          {/* 3. Quick Links */}
          <div className="text-center md:text-center lg:text-left">
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><NavLink to="/" className="hover:underline hover:text-[#FF7A00]">Home</NavLink></li>
              <li><NavLink to="/jobs" className="hover:underline hover:text-[#FF7A00]">Find Jobs</NavLink></li>
              <li><NavLink to="/about" className="hover:underline hover:text-[#FF7A00]">About Us</NavLink></li>
              <li><NavLink to="/contact" className="hover:underline hover:text-[#FF7A00]">Contact Us</NavLink></li>
            </ul>
          </div>

          {/* 4. Contact Us */}
          <div className="text-center md:text-center lg:text-left">
            <h4 className="font-bold text-lg mb-4">Contact Us</h4>
            <div className="flex flex-col space-y-2">
              <div className="flex items-start space-x-2 justify-center lg:justify-start md:justify-center">
                <MdMailOutline className="text-xl flex-shrink-0 mt-0.5 hover:text-[#FF7A00]" />
                <span className="text-left">info@jobcollap.com</span>
              </div>
              <div className="flex items-start space-x-2 justify-center lg:justify-start md:justify-center">
                <GrLocation className="text-xl flex-shrink-0 mt-0.5 hover:text-[#FF7A00]" />
                <address className="not-italic text-left mb-1">
                  <span className="block">#24, St.562, Boeung Kak,</span>
                  <span className="block">Toul Kork, Phnom Penh,</span>
                  <span className="block">Cambodia</span>
                </address>
              </div>
            </div>
          </div>

          {/* Follow Us (Mobile & Tablet) */}
          <div className="flex flex-col items-center order-last md:order-none lg:hidden">
            <h4 className="font-bold text-lg mb-4">Follow Us</h4>
            <div className="flex justify-center space-x-2.5 text-2xl">
              <a href="#" aria-label="Facebook" className="transition-colors duration-300 hover:text-[#FF7A00]">
                <TiSocialFacebookCircular />
              </a>
              <a href="#" aria-label="Telegram" className="transition-colors duration-300 hover:text-[#FF7A00]">
                <LiaTelegram />
              </a>
              <a href="#" aria-label="YouTube" className="transition-colors duration-300 hover:text-[#FF7A00]">
                <AiOutlineYoutube />
              </a>
            </div>
          </div>

          {/* Follow Us (Desktop) */}
          <div className="hidden lg:flex flex-col text-center lg:text-left">
            <h4 className="font-bold text-lg mb-4">Follow Us</h4>
            <div className="flex justify-center lg:justify-start space-x-2.5 text-2xl">
              <a href="#" aria-label="Facebook" className="transition-colors duration-300 hover:text-[#FF7A00]">
                <TiSocialFacebookCircular />
              </a>
              <a href="#" aria-label="Telegram" className="transition-colors duration-300 hover:text-[#FF7A00]">
                <LiaTelegram />
              </a>
              <a href="#" aria-label="YouTube" className="transition-colors duration-300 hover:text-[#FF7A00]">
                <AiOutlineYoutube />
              </a>
            </div>
          </div>

        </div>

        {/* Copyright Section */}
        <div className="mt-8 pt-4 border-t border-t-[#c4d4e3] text-[#1A5276]">
          <div className="text-center text-sm py-2">
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