import React, { useState, useEffect, useRef } from 'react';
import { HiOutlineBookmark } from "react-icons/hi";
import { FiMapPin } from 'react-icons/fi';
import { HiOutlineChevronDown } from 'react-icons/hi';

// Reusable Dropdown component for filters
const Dropdown = ({ label, options, onSelect, className }) => {
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
        <div className={`relative w-full ${className}`} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between p-3 rounded-[10px] bg-white border border-gray-300 w-full text-sm text-[#1A5276] font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1A5276]"
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
                            className="p-3 hover:bg-gray-100 cursor-pointer text-[#1A5276]"
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Updated Job Card component
const JobCard = ({ jobTitle, postDate, location, salary, Photos }) => {
    const photoUrl = Photos && Photos.length > 0 ? Photos[0].url : 'https://via.placeholder.com/400x200';

    return (
        <div className="bg-white rounded-[10px] w-full max-w-xs sm:max-w-none shadow-md overflow-hidden">
            <div className="relative">
                <img
                    src={photoUrl}
                    alt="Job listing visual"
                    className="w-full h-48 object-cover p-4 rounded-[20px]"
                />
                <button aria-label="Bookmark job" className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md">
                    <HiOutlineBookmark color="#FF7A00" size={24} />
                </button>
            </div>
            <div className="px-4">
                <h2 className="text-xl md:text-2xl text-left font-bold text-[#1A5276] mb-2">{jobTitle}</h2>
                <div className="text-sm text-[#1A5276] mb-2">
                    <span className="mr-4">Posted: {new Date(postDate).toLocaleDateString()}</span>
                    <span className="flex items-center"><FiMapPin size={16} className="mr-1" />{location}</span>
                </div>
                <hr className="border-t border-gray-200 mb-2" />
                <div className="flex items-center justify-between pb-4 pt-2">
                    <span className="text-xl font-bold text-[#1A5276]">{salary}$</span>
                    <button className="bg-[#1A5276] text-white border border-[#1A5276] px-4 py-2 rounded-lg hover:bg-white hover:text-[#1A5276] transition-colors duration-200 text-sm">
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
};

// Main App component for the job board page with pagination logic
const FindJob = () => {
    const [jobs, setJobs] = useState([]);
    const [latestJobs, setLatestJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0); // API page numbers are 0-indexed
    const [totalPages, setTotalPages] = useState(0);

    const categories = ['All Categories', 'Web Development', 'IT Support', 'Java Developer', 'AI Engineer'];
    const experiences = ['All Experiences', 'No experience', '1 year experiences', '2 year experiences'];
    const locations = ['All Locations', 'Phnom Penh', 'Siem Reap', 'Battambang'];

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                // Fetch the main paginated jobs with a random sort
                const paginatedJobsResponse = await fetch(`https://job-api.sokpheng.com/api/v1/jobs?pageNumber=${currentPage}&pageSize=6&sortBy=RANDOM`);
                if (!paginatedJobsResponse.ok) {
                    throw new Error(`HTTP error! status: ${paginatedJobsResponse.status}`);
                }
                const paginatedJobsData = await paginatedJobsResponse.json();
                setJobs(paginatedJobsData.data.content);
                setTotalPages(paginatedJobsData.data.totalPages);

                // Then fetch the latest 3 jobs, sorted by createdDate descending
                const latestJobsResponse = await fetch(`https://job-api.sokpheng.com/api/v1/jobs?pageNumber=0&pageSize=3&sortBy=createdDate&sortDirection=desc`);
                if (!latestJobsResponse.ok) {
                    throw new Error(`HTTP error! status: ${latestJobsResponse.status}`);
                }
                const latestJobsData = await latestJobsResponse.json();
                setLatestJobs(latestJobsData.data.content);

            } catch (error) {
                console.error("Failed to fetch jobs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [currentPage]);

    const handlePageChange = (page) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
        const endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(0, endPage - maxPagesToShow + 1);
        }

        if (startPage > 0) {
            pageNumbers.push(0);
            if (startPage > 1) {
                pageNumbers.push('...');
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        if (endPage < totalPages - 1) {
            if (endPage < totalPages - 2) {
                pageNumbers.push('...');
            }
            pageNumbers.push(totalPages - 1);
        }

        return pageNumbers;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-[#1A5276]">Loading jobs...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen font-sans mx-[105px] bg-[#F5F5F5]">
            <header className="mb-8 md:mb-12 text-center">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A5276]">Find your dream jobs</h1>
            </header>
            <section className="flex flex-col items-center gap-4 mb-10 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
                    <div className="flex flex-col">
                        <label className="text-[#1A5276] font-medium text-lg mb-2">Categories</label>
                        <Dropdown label="All Categories" options={categories} onSelect={() => {}} />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[#1A5276] font-medium text-lg mb-2">Experiences</label>
                        <Dropdown label="All Experiences" options={experiences} onSelect={() => {}} />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[#1A5276] font-medium text-lg mb-2">Locations</label>
                        <Dropdown label="All Locations" options={locations} onSelect={() => {}} />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[#1A5276] font-medium text-lg mb-2">Project Price</label>
                        <Dropdown label="All Projects" options={['All Projects', 'Remote', 'On-site']} onSelect={() => {}} />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[#1A5276] font-medium text-lg mb-2">Working Hour</label>
                        <Dropdown label="Freelancer" options={['Freelancer', 'Full-time', 'Part-time']} onSelect={() => {}} />
                    </div>
                </div>
            </section>
            
            <section className="max-w-7xl mx-auto mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.length > 0 ? (
                        jobs.map((job) => (
                            <JobCard
                                key={job.uuid}
                                companyName={job.companyName || "Company Name"}
                                jobTitle={job.jobTitle}
                                postDate={job.createdDate}
                                location={job.location}
                                salary={job.salary}
                                Photos={job.jobPhotos}
                            />
                        ))
                    ) : (
                        <p className="text-center text-[#1A5276] col-span-full">No jobs found.</p>
                    )}
                </div>
            </section>
            
            {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-8 mb-12">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                            currentPage === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-[#1A5276] hover:bg-gray-200'
                        }`}
                    >
                        Previous
                    </button>
                    {renderPageNumbers().map((page, index) => (
                        <button
                            key={index}
                            onClick={() => typeof page === 'number' && handlePageChange(page)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                                page === '...'
                                    ? 'text-[#1A5276] cursor-default'
                                    : currentPage === page
                                    ? 'bg-[#1A5276] text-white'
                                    : 'text-[#1A5276] hover:bg-gray-200'
                            }`}
                        >
                            {page === '...' ? page : page + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages - 1}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                            currentPage === totalPages - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-[#1A5276] hover:bg-gray-200'
                        }`}
                    >
                        Next
                    </button>
                </div>
            )}
            
            <section className="max-w-7xl mx-auto mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-[#1A5276] text-center mb-8">Latest Jobs</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {latestJobs.length > 0 ? (
                        latestJobs.map((job) => (
                            <JobCard
                                key={job.uuid}
                                companyName={job.companyName || "Company Name"}
                                jobTitle={job.jobTitle}
                                postDate={job.createdDate}
                                location={job.location}
                                salary={job.salary}
                                Photos={job.jobPhotos}
                            />
                        ))
                    ) : (
                        <p className="text-center text-[#1A5276] col-span-full">No latest jobs found.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default FindJob;