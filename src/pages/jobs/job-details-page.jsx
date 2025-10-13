import React, { useEffect, useState } from 'react';
import { FaLocationDot, FaEnvelope, FaPhone, FaClock, FaRegBookmark, FaBookmark } from 'react-icons/fa6';

export default function JobDetail() {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const Card = ({ children, className }) => (
    <div className={`bg-white rounded-xl p-4 sm:p-6 md:p-8 mb-6 mx-auto ${className}`}>
      {children}
    </div>
  );

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(
          'https://job-api.sokpheng.com/api/v1/jobs/get?job=8ed23958-ff3e-4a5d-9bc3-64ab50356f8a'
        );
        const result = await response.json();
        
        if (result.status === 200 && result.data) {
          // Use the data from the API response directly
          setJob(result.data);
        }
      } catch (err) {
        console.error('Error fetching job:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-[#1A5276] font-semibold">
        Loading job details...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 font-semibold">
        Failed to load job data.
      </div>
    );
  }
  
  // Helper function to format the salary
  const formatSalary = (salary) => {
    if (typeof salary === 'number') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(salary);
    }
    return salary; // Fallback for non-number salaries (e.g., 'Negotiate')
  };

  const iconClass = 'h-8 w-8 transition-colors duration-300';

  return (
    <div className="bg-[#EFF7FF] min-h-screen px-4 sm:px-8 md:px-16 py-8 flex flex-col items-center font-sans">
      <style jsx="true">{`
        .font-sans {
          font-family: 'Inter', sans-serif;
        }
      `}</style>

      {/* Section 1: Job Header and Tags */}
      <Card className="w-full max-w-6xl py-6 px-8 rounded-2xl">
        <div className="flex justify-between items-center mt-2">
          <h1 className="text-xl font-semibold text-[#1A5276] py-1.5">
            {job.jobTitle}
          </h1>

          <button className="text-[#FF6C1A] p-2 text-center" onClick={toggleBookmark}>
            {isBookmarked ? (
              <FaBookmark className={`${iconClass} text-[#FF6C1A]`} />
            ) : (
              <FaRegBookmark className={`${iconClass} text-[#FF6C1A]`} />
            )}
          </button>
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-white p-1 rounded-full flex items-center justify-center w-10 h-10 flex-shrink-0">
            <img
              src={job.jobPhotos?.[0]?.url || './google.png'}
              alt="company"
              className="w-11 h-10 rounded-full object-cover"
            />
          </div>
          <div className="text-start">
            <div className="flex flex-col items-start">
              <p className="text-[#1A5276] text-sm py-1">{job.workingTime || 'Full-time'}</p>
              <div className="flex items-center text-xs text-[#1A5276] mt-0.5">
                <FaLocationDot className="w-3 h-3 mr-1 text-[#1A5276]" />
                <span>{job.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Note: Tags are still hardcoded. You'd need a tags/skills field in your API for dynamic data. */}
        <div className="flex flex-wrap items-center space-x-2 pb-4 hover:text-[#FF7A00]">
          <span className="bg-transparent text-orange-400 text-xs font-medium px-2 py-1 rounded-md border border-blue-300 hover:text-[#FF7A00]">
            HTML
          </span>
          <span className="bg-transparent text-purple-400 text-xs font-medium px-2 py-1 rounded-md border border-orange-300 hover:text-[#FF7A00]">
            CSS
          </span>
          <span className="bg-transparent text-yellow-400 text-xs font-medium px-2 py-1 rounded-md border border-blue-300 hover:text-[#FF7A00]">
            JavaScript
          </span>
          <span className="bg-transparent text-cyan-400 text-xs font-medium px-2 py-1 rounded-md border border-purple-400 hover:text-[#FF7A00]">
            React
          </span>
          <span className="bg-transparent text-orange-300 text-xs font-medium px-2 py-1 rounded-md border border-red-400 hover:text-[#FF7A00]">
            Figma
          </span>
        </div>

        <div className="flex justify-between items-center mt-4 hover:text-[#FF7A00]">
          <span className="text-[#1A5276] text-sm font-normal hover:text-[#FF7A00]">
            {formatSalary(job.salary)}
          </span>
          <button className="bg-[#1A5276] text-white font-medium text-[0.6rem] px-2 py-0.5 mr-1.2 rounded-lg hover:bg-[#149AC5] transition-colors">
            Apply
          </button>
        </div>
      </Card>

      {/* Section 2: Description */}
      <Card className="w-full max-w-6xl py-6 px-8 rounded-2xl text-start">
        <h2 className="text-xl font-semibold text-[#1A5276] mb-1">Description</h2>
        <p className="text-[#1A5276] leading-relaxed text-base font-regular">
          {job.description}
        </p>
      </Card>

      {/* Section 3: Job Requirements and Contact Info */}
      <Card className="w-full max-w-6xl rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Column 1: Job Requirements and Key Skills */}
          <div className="text-start">
            <h2 className="text-xl font-semibold text-[#1A5276] mb-4">
              Job Requirements:
            </h2>
            <ul className="list-none text-[#1A5276] space-y-3 mb-8">
              {/* Render requirements from the API data */}
              {job.requirements?.map((req, index) => (
                <li key={index} className="flex items-start text-sm">
                  <span className="text-[#1A5276] mr-2 text-lg leading-none">•</span>
                  <span>{req.requirement}</span>
                </li>
              ))}
            </ul>
            
            <h2 className="text-xl font-semibold text-[#1A5276] mb-4">
              Key Skills:
            </h2>
            <ul className="list-none text-[#1A5276] space-y-3">
              {/* Still hardcoded for demonstration, ideal for API integration */}
              {[
                'Frontend development (HTML, CSS, JS, frameworks).',
                'Backend development and API integration.',
                'Database management (SQL/NoSQL).',
                'UI/UX awareness for better user experience.',
                'Problem-solving and teamwork skills.',
              ].map((skill, index) => (
                <li key={`skill-${index}`} className="flex items-start text-sm">
                  <span className="text-[#1A5276] mr-2 text-lg leading-none">•</span>
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Contact Owner */}
          <div className="text-start md:mt-0 mt-8">
            <h2 className="text-xl font-semibold text-[#1A5276] mb-3">
              Contact owner
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              If you have any questions, please feel free to let us know
            </p>
            <div className="space-y-4 text-gray-500 text-sm">
              {/* Address */}
              <div className="flex items-start space-x-3">
                <FaLocationDot className="w-5 h-5 text-[#1A5276] flex-shrink-0" />
                <address className="not-italic">
                  <a
                    href="#"
                    className="underline text-gray-500 hover:text-[#FF6C1A] hover:no-underline block"
                  >
                    <span className="block">{job.location}</span>
                  </a>
                </address>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-3">
                <FaEnvelope className="w-5 h-5 text-[#1A5276] flex-shrink-0" />
                <a
                  href={`mailto:${job.email}`}
                  className="hover:underline text-gray-500 hover:text-[#FF6C1A]"
                >
                  {job.email}
                </a>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-3">
                <FaPhone className="w-5 h-5 text-[#1A5276] flex-shrink-0" />
                <a
                  href={`tel:${job.phoneNumber}`}
                  className="hover:underline text-gray-500 hover:text-[#FF6C1A]"
                >
                  {job.phoneNumber}
                </a>
              </div>

              {/* Hours */}
              <div className="flex items-start space-x-3">
                <FaClock className="w-5 h-5 text-[#1A5276] flex-shrink-0" />
                <div className="text-gray-500">
                  <span className="block">Monday - Friday</span>
                  <span className="block text-gray-500">8:00 AM - 5:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}