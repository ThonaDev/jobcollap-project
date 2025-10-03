import React, { useState, useEffect, useRef } from 'react';
// IMPORT BOTH ICONS HERE
import { HiOutlineBookmark, HiBookmark } from "react-icons/hi";
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
import { FiMapPin } from 'react-icons/fi';
import { HiOutlineChevronDown } from 'react-icons/hi';

// Reusable Dropdown component for filters (NO CHANGES HERE)
const Dropdown = ({ label, options, onSelect, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(label);
    const dropdownRef = useRef(null);

    // Reset selected label when options change (e.g., when API data loads)
    useEffect(() => {
        // Only reset to label if the selected value is no longer in options
        if (!options.includes(selected) && selected !== label) {
            setSelected(label);
        }
        // Ensure the label state is set correctly when options load
        if (options.length > 1 && selected === label) {
             setSelected(label);
        }
    }, [label, options, selected]);

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
        // Pass the selection up to the parent component
        onSelect(option === label ? '' : option); 
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

// 🌟 Job Card component (No functional changes here)
const JobCard = ({ jobTitle, postDate, location, salary, Photos, jobUuid }) => {
    // Track the bookmark status for this specific card
    const [isBookmarked, setIsBookmarked] = useState(false); 
    
    const photoUrl = Photos && Photos.length > 0 ? Photos[0].url : 'https://via.placeholder.com/400x200';

    // Function to toggle the bookmark state
    const handleBookmarkClick = (e) => {
        e.stopPropagation(); // Prevents card click logic if any
        setIsBookmarked(!isBookmarked);
        console.log(`Job ${jobTitle} (UUID: ${jobUuid}) bookmark status toggled to: ${!isBookmarked}`);
    };

    return (
        <div className="bg-white rounded-[10px] w-full max-w-xs sm:max-w-none shadow-md overflow-hidden">
            <div className="relative">
                <img
                    src={photoUrl}
                    alt="Job listing visual"
                    className="w-full h-48 object-cover p-4 rounded-[20px]"
                />
                <button 
                    aria-label="Bookmark job" 
                    className="absolute top-5 right-5 bg-white rounded-full p-2 shadow-md"
                    onClick={handleBookmarkClick} 
                >
                    {isBookmarked ? (
                        <FaBookmark color="#FF7A00" size={24}/>
                    ) : (
                        <FaRegBookmark color="#FF7A00" size={24}/>
                    )}
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

// Main App component with dynamic fetching and filtering
const FindJob = () => {
    // Data states
    const [jobs, setJobs] = useState([]);
    const [latestJobs, setLatestJobs] = useState([]);
    const [allJobContent, setAllJobContent] = useState([]); // Store all jobs for filtering
    
    // UI/Loading states
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0); 
    const [totalPages, setTotalPages] = useState(0);
    
    // Dropdown options states
    const [categories, setCategories] = useState(['All Categories']);
    const [experiences, setExperiences] = useState(['All Experiences']);
    const [locations, setLocations] = useState(['All Locations']);
    const [salaries, setSalaries] = useState(['All Projects']);
    const [workingTimes, setWorkingTimes] = useState(['All Working Hours']);

    // 🌟 FILTER SELECTION STATES
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedExperience, setSelectedExperience] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedSalary, setSelectedSalary] = useState('');
    const [selectedWorkingTime, setSelectedWorkingTime] = useState('');


    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                // Fetch ALL jobs to collect all unique filter values
                const allJobsResponse = await fetch(`https://job-api.sokpheng.com/api/v1/jobs?pageNumber=0&pageSize=1000`);
                
                // Fetch the main paginated jobs (used for the initial display/pagination)
                const paginatedJobsResponse = await fetch(`https://job-api.sokpheng.com/api/v1/jobs?pageNumber=${currentPage}&pageSize=6&sortBy=RANDOM`);
                
                // Fetch the latest 3 jobs
                const latestJobsResponse = await fetch(`https://job-api.sokpheng.com/api/v1/jobs?pageNumber=0&pageSize=3&sortBy=createdDate&sortDirection=desc`);


                if (!paginatedJobsResponse.ok || !allJobsResponse.ok || !latestJobsResponse.ok) {
                    throw new Error("Failed to fetch job data from one or more endpoints.");
                }
                
                const paginatedJobsData = await paginatedJobsResponse.json();
                const allJobsData = await allJobsResponse.json();
                const latestJobsData = await latestJobsResponse.json();

                setJobs(paginatedJobsData.data.content);
                setTotalPages(paginatedJobsData.data.totalPages);
                setLatestJobs(latestJobsData.data.content);
                setAllJobContent(allJobsData.data.content); // Store all jobs for client-side filtering


                // 🌟 Extract and set unique values for all dropdowns
                const allContent = allJobsData.data.content;

                // --- Categories (from jobTitle) ---
                const allCategories = allContent.map(job => job.jobTitle).filter(Boolean);
                const uniqueCategories = [...new Set(allCategories)].sort();
                setCategories(['All Categories', ...uniqueCategories]);

                // --- Experiences (from requirementExperience, formatted) ---
                const allExperiences = allContent.map(job => job.requirementExperience).filter(num => typeof num === 'number' && num >= 0);
                const uniqueExperiences = [...new Set(allExperiences)]
                    .sort((a, b) => a - b)
                    .map(exp => (exp === 0 ? 'No experience' : `${exp} year${exp > 1 ? 's' : ''} experiences`));
                setExperiences(['All Experiences', ...uniqueExperiences]);

                // --- Locations (from location) ---
                const allLocations = allContent.map(job => job.location).filter(Boolean);
                const uniqueLocations = [...new Set(allLocations)].sort();
                setLocations(['All Locations', ...uniqueLocations]);

                // --- Project Price / Salary (from salary, sorted and formatted with $) ---
                const allSalaries = allContent.map(job => job.salary).filter(num => typeof num === 'number' && num > 0);
                const uniqueSalaries = [...new Set(allSalaries)]
                    .sort((a, b) => a - b) 
                    .map(salary => `${salary.toFixed(0)}$`); 
                setSalaries(['All Projects', ...uniqueSalaries]);
                
                // --- Working Hours (from workingTime) ---
                const allWorkingTimes = allContent.map(job => job.workingTime).filter(Boolean);
                const uniqueWorkingTimes = [...new Set(allWorkingTimes)].sort();
                setWorkingTimes(['All Working Hours', ...uniqueWorkingTimes]);


            } catch (error) {
                console.error("Failed to fetch jobs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [currentPage]); // Re-fetch only if page changes

    // 🌟 FILTERING LOGIC
    const filteredJobs = allJobContent.filter(job => {
        const matchesCategory = !selectedCategory || job.jobTitle === selectedCategory;

        // Extract raw number from experience string for comparison
        const matchesExperience = !selectedExperience || 
            (selectedExperience === 'No experience' && job.requirementExperience === 0) ||
            (selectedExperience.includes('years') && job.requirementExperience === parseInt(selectedExperience));

        const matchesLocation = !selectedLocation || job.location === selectedLocation;

        // Extract raw number from salary string for comparison
        const matchesSalary = !selectedSalary || job.salary === parseInt(selectedSalary);

        const matchesWorkingTime = !selectedWorkingTime || job.workingTime === selectedWorkingTime;

        return matchesCategory && matchesExperience && matchesLocation && matchesSalary && matchesWorkingTime;
    });

    // 🌟 PAGINATION FOR FILTERED RESULTS (optional, for a full implementation)
    // For simplicity, we will display all filtered results for now. 
    // To implement pagination on filtered results, you'd need to paginate `filteredJobs`.
    // The existing pagination only applies to the initial random API fetch.

    // Page handling for the initial random view
    const handlePageChange = (page) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const renderPageNumbers = () => {
        // ... (Pagination logic remains the same for the initial random fetch)
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

    // Determine which list to show: filteredJobs if any filter is selected, or the paginated 'jobs'
    const isFiltered = selectedCategory || selectedExperience || selectedLocation || selectedSalary || selectedWorkingTime;
    const jobsToDisplay = isFiltered ? filteredJobs : jobs;

    return (
        <div className="min-h-screen font-sans mx-[105px] bg-[#F5F5F5]">
            <header className="mb-8 md:mb-12 text-center">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A5276]">Find your dream jobs</h1>
            </header>
            <section className="flex flex-col items-center gap-4 mb-10 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
                    
                    {/* Categories (Job Title) */}
                    <div className="flex flex-col">
                        <label className="text-[#1A5276] font-medium text-lg mb-2">Categories</label>
                        <Dropdown label="All Categories" options={categories} onSelect={setSelectedCategory} />
                    </div>
                    
                    {/* Experiences (requirementExperience) */}
                    <div className="flex flex-col">
                        <label className="text-[#1A5276] font-medium text-lg mb-2">Experiences</label>
                        <Dropdown label="All Experiences" options={experiences} onSelect={setSelectedExperience} />
                    </div>
                    
                    {/* Locations */}
                    <div className="flex flex-col">
                        <label className="text-[#1A5276] font-medium text-lg mb-2">Locations</label>
                        <Dropdown label="All Locations" options={locations} onSelect={setSelectedLocation} />
                    </div>
                    
                    {/* 🌟 Project Price (Salary) */}
                    <div className="flex flex-col">
                        <label className="text-[#1A5276] font-medium text-lg mb-2">Project Price</label>
                        <Dropdown label="All Prices" options={salaries} onSelect={setSelectedSalary} />
                    </div>
                    
                    {/* Working Hour (workingTime) */}
                    <div className="flex flex-col">
                        <label className="text-[#1A5276] font-medium text-lg mb-2">Working Hour</label>
                        <Dropdown label="All Working Hours" options={workingTimes} onSelect={setSelectedWorkingTime} />
                    </div>
                </div>
            </section>
            
            <section className="max-w-7xl mx-auto mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobsToDisplay.length > 0 ? (
                        jobsToDisplay.map((job) => (
                            <JobCard
                                key={job.uuid}
                                jobUuid={job.uuid}
                                companyName={job.companyName || "Company Name"}
                                jobTitle={job.jobTitle}
                                postDate={job.createdDate}
                                location={job.location}
                                salary={job.salary}
                                Photos={job.jobPhotos}
                            />
                        ))
                    ) : (
                        <p className="text-center text-[#1A5276] col-span-full text-xl py-10">
                            No jobs found matching your current filter criteria.
                        </p>
                    )}
                </div>
            </section>
            
            {/* Show pagination only if no filters are currently active */}
            {!isFiltered && totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-8 mb-12">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        className={`px-4 py-2 rounded-full font-semibold transition-colors duration-200 ${
                            currentPage === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-[#1A5276] hover:bg-gray-200'
                        }`}
                    >
                        Previous
                    </button>
                    {renderPageNumbers().map((page, index) => (
                        <button
                            key={index}
                            onClick={() => typeof page === 'number' && handlePageChange(page)}
                            className={`px-4 py-2 rounded-full font-semibold transition-colors duration-200 ${
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
                        className={`px-4 py-2 rounded-full font-semibold transition-colors duration-200 ${
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
                                jobUuid={job.uuid}
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