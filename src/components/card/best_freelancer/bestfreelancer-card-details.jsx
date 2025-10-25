import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { FaRegUser } from "react-icons/fa6";
import { AiOutlineGlobal } from "react-icons/ai";
import { FiMapPin } from "react-icons/fi";
import { LuPhone, LuMail } from "react-icons/lu";
import { VscGithub } from "react-icons/vsc";
import { TiSocialLinkedinCircular } from "react-icons/ti";
import { RiTelegramLine } from "react-icons/ri";
import { freelancers } from "./freelancers";

export default function FreelancerDetail() {
  const { id } = useParams();
  const freelancer = freelancers.find((f) => f.id === Number(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!freelancer) {
    return (
      <div className="text-center py-16 sm:py-20 text-gray-500 text-base sm:text-lg">
        Freelancer not found
      </div>
    );
  }

  return (
    <div className="bg-[#F5F5F5] px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 mb-6 sm:mb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="p-4 sm:p-6 md:p-8 lg:p-10 rounded-lg font-sans text-[#1A5276] bg-white shadow-sm">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-4 sm:mb-6 gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <img
                src={freelancer.avatar}
                alt={freelancer.name}
                className="w-16 h-16 sm:w-20 md:w-24 sm:h-20 md:h-24 rounded-full object-cover"
              />
              <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">{freelancer.name}</h1>
                <p className="text-sm sm:text-base md:text-lg">{freelancer.role}</p>
              </div>
            </div>
            {/* Uncomment if you want to restore the Send Mail button */}
            {/* <div className="flex items-center justify-center sm:justify-end w-full sm:w-auto">
              <button className="bg-[#1A5276] text-white border border-[#1A5276] px-4 sm:px-5 py-2 rounded-[10px] hover:bg-white hover:text-[#1A5276] h-[40px] sm:h-[45px] whitespace-nowrap text-sm sm:text-base transition-colors duration-200">
                Send Mail
              </button>
            </div> */}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="font-semibold mb-2 text-left text-lg sm:text-xl md:text-2xl">BIOGRAPHY</h2>
                <p className="text-sm sm:text-base md:text-lg text-left leading-relaxed">
                  {freelancer.bio}
                </p>
              </div>
              <hr className="border-gray-200" />
              <div className="flex flex-wrap gap-3 justify-center sm:justify-start mt-4">
                <button className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-[#D1DCE4] rounded-[10px] hover:bg-[#BDC9D6] transition-colors duration-200 cursor-pointer">
                  <VscGithub size={25} color="#1A5276" />
                </button>
                <button className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-[#D1DCE4] rounded-[10px] hover:bg-[#BDC9D6] transition-colors duration-200 cursor-pointer">
                  <TiSocialLinkedinCircular size={35} color="#1A5276" />
                </button>
                <button className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-[#D1DCE4] rounded-[10px] hover:bg-[#BDC9D6] transition-colors duration-200 cursor-pointer">
                  <RiTelegramLine size={30} color="#1A5276" />
                </button>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4 text-sm sm:text-base">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 text-center">
                <div className="flex flex-col items-center justify-center">
                  <LiaBirthdayCakeSolid size={25} color="#1A5276" />
                  <span className="mt-2">
                    <strong>DATE OF BIRTH</strong>
                    <br />
                    {freelancer.birth}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <FaRegUser size={20} color="#1A5276" />
                  <span className="mt-2">
                    <strong>Gender</strong>
                    <br />
                    {freelancer.gender}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 text-center">
                <div className="flex flex-col items-center justify-center">
                  <AiOutlineGlobal size={22} color="#1A5276" />
                  <span className="mt-2">
                    <strong>Website</strong>
                    <br />
                    <span className="text-sm sm:text-base break-all">{freelancer.website}</span>
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <FiMapPin size={22} color="#1A5276" />
                  <span className="mt-2">
                    <strong>Location</strong>
                    <br />
                    <span className="text-sm sm:text-base">{freelancer.location}</span>
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <LuPhone size={22} color="#1A5276" />
                  <span className="mt-2">
                    <strong>Phone</strong>
                    <br />
                    <span className="text-sm sm:text-base">{freelancer.phone}</span>
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <LuMail size={22} color="#1A5276" />
                  <span className="mt-2">
                    <strong>Email</strong>
                    <br />
                    <span className="text-sm sm:text-base break-all">{freelancer.email}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}