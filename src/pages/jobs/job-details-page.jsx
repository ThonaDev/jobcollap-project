import React, { useState } from "react";
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
import { GrLocation } from "react-icons/gr";
import { AiOutlineMail } from "react-icons/ai";
import { BiPhone } from "react-icons/bi";
import { MdOutlineAccessTime } from "react-icons/md";
import { useParams } from "react-router-dom";
import { useGetJobByIdQuery } from "../../features/job/jobSlice";
import ApplyJob from "./applying-page";

export default function JobDetail() {
  const { jobUuid } = useParams();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: jobData, isLoading, isError } = useGetJobByIdQuery(jobUuid);

  const Card = ({ children, className }) => (
    <div className={`bg-white rounded-xl p-4 sm:p-6 md:p-8 mb-6 mx-auto ${className}`}>
      {children}
    </div>
  );

  const toggleBookmark = () => setIsBookmarked(!isBookmarked);
  const handleApplyClick = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const formatSalary = (salary) => {
    if (typeof salary === "number") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(salary);
    }
    return salary;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-[#1A5276] font-semibold">
        Loading job details...
      </div>
    );
  }

  if (isError || !jobData?.data) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 font-semibold">
        Failed to load job data.
      </div>
    );
  }

  const job = jobData.data;
  const iconClass = "h-8 w-8 transition-colors duration-300";
  const workingTime = job.workingTime?.toLowerCase();

  return (
    <div className="bg-[#f5f5f5] min-h-screen px-4 sm:px-8 md:px-16 py-8 flex flex-col items-center font-sans">
      <style jsx="true">{`
        .font-sans { font-family: "Poppins", sans-serif; }
      `}</style>

      {/* Section 1: Job Header */}
      <Card className="w-full max-w-6xl px-8 rounded-2xl">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-semibold text-[#1A5276]">{job.jobTitle}</h1>
          <button className="text-[#FF6C1A]" onClick={toggleBookmark}>
            {isBookmarked ? <FaBookmark className={`${iconClass} text-[#FF6C1A]`} /> : <FaRegBookmark className={`${iconClass} text-[#FF6C1A]`} />}
          </button>
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <div className="p-1 rounded-full flex items-center justify-center flex-shrink-0">
            <img
              src={job.jobPhotos?.[0]?.url || "./google.png"}
              alt="company"
              className="w-[120px] rounded-lg object-cover"
            />
          </div>
          <div className="text-start">
            <div className="flex flex-col items-start">
              <p className="text-[#1A5276] text-lg py-1">{job.workingTime || "Full-time"}</p>
              <div className="flex items-center text-sm text-[#1A5276] mt-0.5">
                <GrLocation className="w-3 h-3 mr-1 text-[#1A5276]" />
                <span>{job.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center space-x-2 hover:text-[#FF7A00]">
          <span className="bg-transparent text-orange-400 text-sm font-medium px-2 py-1 rounded-md border border-blue-300 hover:text-[#FF7A00]">HTML</span>
          <span className="bg-transparent text-purple-400 text-sm font-medium px-2 py-1 rounded-md border border-orange-300 hover:text-[#FF7A00]">CSS</span>
          <span className="bg-transparent text-yellow-400 text-sm font-medium px-2 py-1 rounded-md border border-blue-300 hover:text-[#FF7A00]">JavaScript</span>
          <span className="bg-transparent text-cyan-400 text-sm font-medium px-2 py-1 rounded-md border border-purple-400 hover:text-[#FF7A00]">React</span>
          <span className="bg-transparent text-orange-300 text-sm font-medium px-2 py-1 rounded-md border border-red-400 hover:text-[#FF7A00]">Figma</span>
        </div>

        {/* Salary / Project Rate */}
        <div className="flex justify-between items-center mt-4 hover:text-[#FF7A00]">
          <span className="text-[#1A5276] text-lg">
            {workingTime === "freelance" ? (
              <>
                <span>Project Rate: </span>
                <span className="text-[#FF7A00]">{formatSalary(job.salary)}</span>
              </>
            ) : (
              <>
                <span>Salary: </span>
                <span className="text-[#FF7A00]">{formatSalary(job.salary)} /Month</span>
              </>
            )}
          </span>

          <button
            className="bg-[#1A5276] text-white font-medium text-base px-4 py-1.5 mr-1.2 rounded-full hover:bg-[#149AC5] transition-colors"
            onClick={handleApplyClick}
          >
            Apply
          </button>
        </div>
      </Card>

      {/* Section 2: Description */}
      <Card className="w-full max-w-6xl py-6 px-8 rounded-xl text-start">
        <h2 className="text-2xl font-semibold text-[#1A5276] mb-1">Description</h2>
        <p className="text-[#1A5276] leading-relaxed font-regular text-lg">{job.description}</p>
      </Card>

      {/* Section 3: Requirements & Contact */}
      <Card className="w-full max-w-6xl rounded-2xl text-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Requirements */}
          <div className="text-start text-2xl">
            <h2 className="font-semibold text-[#1A5276] mb-4">Job Requirements</h2>
            <ul className="list-none text-[#1A5276] space-y-3 mb-8">
              {job.requirements?.map((req, index) => (
                <li key={index} className="flex items-start text-sm">
                  <span className="text-[#1A5276] mr-2 text-3xl leading-none">•</span>
                  <span className="text-lg">{req.requirement}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="text-start md:mt-0 mt-8">
            <h2 className="text-2xl font-semibold text-[#1A5276] mb-3">Contact Owner</h2>
            <p className="text-[#1A5276] mb-6 text-lg">If you have any questions, please feel free to let us know</p>
            <div className="space-y-4 text-[#1A5276] text-lg">
              {/* Address */}
              <div className="flex items-start space-x-3">
                <GrLocation className="w-5 h-5 text-[#1A5276] flex-shrink-0" />
                <address className="not-italic">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-[#1A5276] hover:text-[#FF6C1A] hover:no-underline block"
                  >
                    {job.location}
                  </a>
                </address>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-3">
                <AiOutlineMail className="w-5 h-5 text-[#1A5276] flex-shrink-0" />
                <a href={`mailto:${job.email}`} className="hover:underline text-[#1A5276] hover:text-[#FF6C1A]">{job.email}</a>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-3">
                <BiPhone className="w-5 h-5 text-[#1A5276] flex-shrink-0" />
                <a href={`tel:${job.phoneNumber}`} className="hover:underline text-[#1A5276] hover:text-[#FF6C1A]">{job.phoneNumber}</a>
              </div>

              {/* Hours */}
              <div className="flex items-start space-x-3">
                <MdOutlineAccessTime className="w-5 h-5 text-[#1A5276] flex-shrink-0" />
                <div className="text-[#1A5276]">
                  <span className="block">Monday - Friday</span>
                  <span className="block text-[#1A5276]">8:00 AM - 5:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* ApplyJob Modal */}
      {isModalOpen && <ApplyJob jobUuid={jobUuid} onClose={handleCloseModal} />}
    </div>
  );
}
