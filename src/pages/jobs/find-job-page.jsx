import React, { useState, useEffect, useRef } from 'react';
import { HiOutlineBookmark } from "react-icons/hi";
import { FiMapPin } from 'react-icons/fi';
import { HiOutlineChevronDown } from 'react-icons/hi';

// Reusable Dropdown component for filters
const Dropdown = ({ label, options, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(label);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (option) => {
        setSelected(option);
        onSelect(option);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between p-3 rounded-[10px] bg-white border border-gray-300 w-full text-sm text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1A5276]"
            >
                <span className="truncate">{selected}</span>
                <HiOutlineChevronDown className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto animate-fadeIn">
                    {options.map((option, index) => (
                        <div
                            key={index}
                            onClick={() => handleSelect(option)}
                            className="p-3 hover:bg-gray-100 cursor-pointer text-gray-800"
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Reusable Job Card component from your provided code
const JobCard = ({ companyName, jobTitle, postDate, location, salary, Photos }) => {
    const photoUrl = Photos && Photos.length > 0 ? Photos[0].url : 'https://via.placeholder.com/40';

    return (
        <div className="bg-white p-6 rounded-[10px] w-full max-w-sm mx-auto transition-transform duration-300 hover:scale-105 shadow-md">
            {/* Header section with company logo and bookmark icon */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                    <img src={photoUrl} alt="Company logo" className="w-10 h-10 rounded-full mr-3 object-cover" />
                    <div>
                        <h3 className="text-[#1A5276] font-semibold">{companyName}</h3>
                        <span className="text-[#1A5276] text-sm">{jobTitle}</span>
                    </div>
                </div>
                <button aria-label="Bookmark job">
                    <HiOutlineBookmark color="#FF7A00" size={40} />
                </button>
            </div>

            {/* Job details section */}
            <div className="space-y-2 mb-4">
                <h2 className="text-xl text-left font-bold text-[#1A5276]">{jobTitle}</h2>
                <div className="flex items-center text-sm text-[#1A5276]">
                    <span>Posted: {new Date(postDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm text-[#1A5276]">
                    <FiMapPin size={20} color="#1A5276" />
                    <span className='pl-2'>{location}</span>
                </div>
            </div>
            <hr className="bg-[#1A5276]" />

            {/* Footer section with salary and apply button */}
            <div className="pt-4 mt-auto flex items-center justify-between">
                <span className="text-base font-semibold text-[#1A5276]">{salary}</span>
                <button className="bg-[#1A5276] text-white border border-[#1A5276] px-4 py-2 rounded-[10px] hover:bg-white hover:text-[#1A5276] transition-colors duration-200">
                    Apply
                </button>
            </div>
        </div>
    );
};

// Main App component for the job board page
const FindJob = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter states (not implemented for simplicity, but ready to be used)
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [selectedExperience, setSelectedExperience] = useState('All Experiences');
    const [selectedLocation, setSelectedLocation] = useState('All Locations');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch('https://job-api.sokpheng.com/api/v1/jobs?pageNumber=0&pageSize=20');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                // The API response is nested, so we access the content array
                setJobs(data.data.content);
            } catch (error) {
                console.error("Failed to fetch jobs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    // Placeholder data for the dropdowns
    const categories = ['All Categories', 'IT', 'Marketing', 'Finance', 'Human Resources'];
    const experiences = ['All Experiences', 'Entry-Level', 'Mid-Level', 'Senior-Level'];
    const locations = ['All Locations', 'Phnom Penh', 'Siem Reap', 'Battambang'];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p>Loading jobs...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6 md:p-12 font-sans">
            <header className="mb-10 text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Find your dream jobs</h1>
            </header>

            {/* Filter and Search Bar */}
            <section className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 p-4 rounded-lg bg-gray-200 mb-8 max-w-7xl mx-auto shadow-md">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full">
                    <Dropdown label="All Categories" options={categories} onSelect={setSelectedCategory} />
                    <Dropdown label="All Experiences" options={experiences} onSelect={setSelectedExperience} />
                    <Dropdown label="All Locations" options={locations} onSelect={setSelectedLocation} />
                    <Dropdown label="All Projects" options={['All Projects', 'Remote', 'On-site']} onSelect={() => {}} />
                    <Dropdown label="Freelancer" options={['Freelancer', 'Full-time', 'Part-time']} onSelect={() => {}} />
                </div>
            </section>

            {/* Available Jobs Grid */}
            <section className="max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Latest jobs</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.length > 0 ? (
                        jobs.map((job) => (
                            <JobCard
                                key={job.uuid}
                                companyName={job.companyName || "Company Name"} // Placeholder for Company Name
                                jobTitle={job.jobTitle}
                                postDate={job.createdDate}
                                location={job.location}
                                salary={job.salary}
                                Photos={job.jobPhotos}
                            />
                        ))
                    ) : (
                        <p className="text-center text-gray-500 col-span-full">No jobs found.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default FindJob;