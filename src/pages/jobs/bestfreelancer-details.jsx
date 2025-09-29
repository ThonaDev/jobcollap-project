import React from "react";
import { HiOutlineBookmark } from "react-icons/hi";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { FaRegUser } from "react-icons/fa6";
import { AiOutlineGlobal } from 'react-icons/ai';
import { FiMapPin } from 'react-icons/fi'; // Change this line
import { LuPhone } from "react-icons/lu";
import { LuMail } from "react-icons/lu";
import { VscGithub } from "react-icons/vsc";
import { TiSocialLinkedinCircular } from "react-icons/ti";
import { RiTelegramLine } from "react-icons/ri";


function FreeLancerDetail() {

  return (
   <div className="bg-[#F5F5F5] min-h-screen p-4">
    <div className="mx-[105px]">
       <div className="max-w-5xl mx-auto p-6 rounded-lg font-sans text-[#1A5276]">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <img src="/images/BenThona.jpg" alt="Profile" className="w-16 h-16 rounded-full object-cover" />
          <div className="text-left">
            <h1 className="text-xl font-semibold">Ben Thona</h1>
            <p className="text-sm">Full-Stack Developer</p>
          </div>
        </div>
        <div className="flex gap-2">
 <button className="bg-[#1A5276] text-white border border-[#1A5276] px-4 py-2 rounded-[10px] hover:bg-white hover:text-[#1A5276] h-[45px] whitespace-nowrap">
  Send Mail
</button>

          <button>
            <HiOutlineBookmark color="FF7A00" size={50} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-6">
          {/* Biography */}
          <div>
            <h2 className="font-semibold mb-2 text-left">BIOGRAPHY</h2>
            <p className="text-sm text-left">
              I've been passionate about programming and building things from an
              early age, with a keen interest in both the user-facing and
              server-side aspects of web applications. I can architect and
              create robust, scalable, and user-friendly web solutions from
              scratch. Check out the project section of my profile to see
              samples of my work and feel free to discuss your development
              needs. My expertise lies in the MERN stack (MongoDB, Express.js,
              React, Node.js), but I’m always eager to adapt to new
              technologies.
            </p>
          </div>
          <hr />

          {/* Cover Letter */}
          <div>
            <h2 className="font-semibold mb-2 text-left">COVER LETTER</h2>
            <p className="text-sm whitespace-pre-line text-left">
              Dear Mr. Phat Phea,{"\n"}
              I'm writing to express my interest in your project for [Project
              Name or Type]. As a full-stack developer with a passion for
              building robust and scalable web applications, I can deliver a
              complete solution from the ground up, tailored to your specific
              needs. I am confident that my expertise in front-end and back-end
              development, coupled with a deep understanding of modern web
              technologies, makes me the ideal candidate to bring your vision to
              life.{"\n\n"}
              In my recent work, I developed a [mention a project type, e.g., an
              e-commerce platform] using the MERN stack (MongoDB, Express.js,
              React, Node.js). The project involved creating a dynamic user
              interface with React, a secure API with Node.js, and an optimized
              database with MongoDB. My responsibilities included architecting
              the application, managing the database, and ensuring a seamless
              and responsive user experience.{"\n\n"}
              My goal is to provide a comprehensive, end-to-end solution that
              not only meets your requirements but also exceeds your
              expectations. I am eager to discuss your project in more detail
              and demonstrate how my skills can contribute to its success.
              {"\n\n"}
              Sincerely,{"\n"}
              Ben Thona
            </p>
          </div>
          <hr />

          {/* Social Media */}
              <div className="flex gap-3 mt-4">
  <button className="flex items-center justify-center w-12 h-12 bg-[#D1DCE4] rounded-[10px] hover:bg-[#BDC9D6] transition-colors duration-200 cursor-pointer">
    {/* VscGithub icon looks good at a larger size */}
    <VscGithub size={25} color="#1A5276"/>
  </button>
  <button className="flex items-center justify-center w-12 h-12 bg-[#D1DCE4] rounded-[10px] hover:bg-[#BDC9D6] transition-colors duration-200 cursor-pointer">
    {/* LinkedIn icon also needs to be large to match */}
    <TiSocialLinkedinCircular size={35} color="#1A5276"/>
  </button>
  <button className="flex items-center justify-center w-12 h-12 bg-[#D1DCE4] rounded-[10px] hover:bg-[#BDC9D6] transition-colors duration-200 cursor-pointer">
    {/* Telegram icon matches others at this size */}
    <RiTelegramLine size={30} color="#1A5276"/>
  </button>
</div>
        </div>

        {/* Right Column */}
       <div className="space-y-4 text-sm">
  {/* Top Section: Birthday and Gender */}
  <div className="grid grid-cols-2 gap-4">
    <div className="flex flex-col items-center justify-center">
      <LiaBirthdayCakeSolid size={25} color="#1A5276" />
      <span className="mt-2 text-left">
        <strong>DATE OF BIRTH</strong>
        <br />
        14 JUNE, 2000
      </span>
    </div>
    <div className="flex flex-col items-center justify-center">
      <FaRegUser size={20} color="#1A5276" />
      <span className="mt-2 text-left">
        <strong>Gender</strong>
        <br />
        Male
      </span>
    </div>
  </div>

  <hr/>

  {/* Other Sections with Lines */}
  <div className="space-y-4 text-left">
    <div className="flex items-center gap-4">
      <AiOutlineGlobal size={20} color="#1A5276" />
      <div>
        <strong>Website</strong>
        <br />
        <span className="text-sm">www.jobcollap.com</span>
      </div>
    </div>
    <hr/>
    <div className="flex items-center gap-4">
      <FiMapPin size={20} color="#1A5276" />
      <div>
        <strong>Location</strong>
        <br />
        <span className="text-sm">No. 25, St. 271, Phnom Penh, Cambodia</span>
      </div>
    </div>
    <hr/>
    <div className="flex items-center gap-4">
      <LuPhone size={20} color="#1A5276" />
      <div>
        <strong>Phone</strong>
        <br />
        <span className="text-sm">096 6666 7777</span>
      </div>
    </div>
    <hr/>
    <div className="flex items-center gap-4">
      <LuMail size={20} color="#1A5276" />
      <div>
        <strong>Email</strong>
        <br />
        <span className="text-sm">jobcollap@gmail.com</span>
      </div>
    </div>
  </div>
</div>

      </div>
    </div>
    </div>
   </div>
  );
}

export default FreeLancerDetail;
