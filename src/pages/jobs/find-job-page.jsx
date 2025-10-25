import React, { useState, useEffect, useRef } from 'react';
import { HiOutlineChevronDown } from 'react-icons/hi';
import SingleJobCard from '../../components/card/jobs/single-job-card';
import ApplyJob from './applying-page';
import { useGetAllJobsQuery, useGetPaginatedJobsQuery, useGetLatestJobsQuery } from '../../features/job/jobSlice';
import { useLocation } from 'react-router-dom';

const Dropdown = ({ label, options, onSelect, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(label);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!options.includes(selected) && selected !== label) {
      setSelected(label);
    }
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
    onSelect(option === label ? '' : option);
    setIsOpen(false);
  };

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-3 rounded-[10px] bg-white border border-gray-300 w-full text-sm sm:text-base text-[#1A5276] font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1A5276]"
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

const FindJobPage = () => {
  const [jobs, setJobs] = useState([]);
  const [latestJobs, setLatestJobs] = useState([]);
  const [allJobContent, setAllJobContent] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [filteredPage, setFilteredPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [categories, setCategories] = useState(['All Categories']);
  const [experiences, setExperiences] = useState(['All Experiences']);
  const [locations, setLocations] = useState(['All Locations']);
  const [salaries, setSalaries] = useState(['All Prices']);
  const [workingTimes, setWorkingTimes] = useState(['All Working Hours']);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedSalary, setSelectedSalary] = useState('');
  const [selectedWorkingTime, setSelectedWorkingTime] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedJobUuid, setSelectedJobUuid] = useState(null);
  const pageSize = 6;
  const location = useLocation();

  const { data: allJobsData, isLoading: allJobsLoading, error: allJobsError } = useGetAllJobsQuery();
  const { data: paginatedJobsData, isLoading: paginatedJobsLoading, error: paginatedJobsError } = useGetPaginatedJobsQuery({ pageNumber: currentPage, pageSize });
  const { data: latestJobsData, isLoading: latestJobsLoading, error: latestJobsError } = useGetLatestJobsQuery();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('query') || '';
    console.log("URL query:", query);
    setSearchTerm(query.trim().toLowerCase());
  }, [location.search]);

  useEffect(() => {
    if (allJobsError || paginatedJobsError || latestJobsError) {
      console.error("Failed to fetch jobs:", allJobsError || paginatedJobsError || latestJobsError);
    }

    if (allJobsData) {
      const allContent = allJobsData.data.content || [];
      setAllJobContent(allContent);

      const allCategories = allContent.map(job => job.jobTitle).filter(Boolean);
      const uniqueCategories = [...new Set(allCategories)].sort();
      setCategories(['All Categories', ...uniqueCategories]);

      const allExperiences = allContent.map(job => job.requirementExperience).filter(num => typeof num === 'number' && num >= 0);
      const uniqueExperiences = [...new Set(allExperiences)]
        .sort((a, b) => a - b)
        .map(exp => (exp === 0 ? 'No experience' : `${exp} year${exp > 1 ? 's' : ''} experiences`));
      setExperiences(['All Experiences', ...uniqueExperiences]);

      const allLocations = allContent.map(job => job.location).filter(Boolean);
      const uniqueLocations = [...new Set(allLocations)].sort();
      setLocations(['All Locations', ...uniqueLocations]);

      const allSalaries = allContent.map(job => job.salary).filter(num => typeof num === 'number' && num > 0);
      const uniqueSalaries = [...new Set(allSalaries)]
        .sort((a, b) => a - b)
        .map(salary => `${salary.toFixed(0)}$`);
      setSalaries(['All Prices', ...uniqueSalaries]);

      const allWorkingTimes = allContent.map(job => job.workingTime).filter(Boolean);
      const uniqueWorkingTimes = [...new Set(allWorkingTimes)].sort();
      setWorkingTimes(['All Working Hours', ...uniqueWorkingTimes]);
    }

    if (paginatedJobsData) {
      setJobs(paginatedJobsData.data.content || []);
      setTotalPages(paginatedJobsData.data.totalPages || 0);
    }

    if (latestJobsData) {
      setLatestJobs(latestJobsData.data.content || []);
    }
  }, [allJobsData, paginatedJobsData, latestJobsData, allJobsError, paginatedJobsError, latestJobsError]);

  useEffect(() => {
    setFilteredPage(0);
  }, [selectedCategory, selectedExperience, selectedLocation, selectedSalary, selectedWorkingTime, searchTerm]);

  const filteredJobs = allJobContent.filter(job => {
    const matchesCategory = !selectedCategory || job.jobTitle === selectedCategory;
    const matchesExperience = !selectedExperience ||
      (selectedExperience === 'No experience' && job.requirementExperience === 0) ||
      (selectedExperience.includes('years') && job.requirementExperience === parseInt(selectedExperience));
    const matchesLocation = !selectedLocation || job.location === selectedLocation;
    const matchesSalary = !selectedSalary || job.salary === parseInt(selectedSalary);
    const matchesWorkingTime = !selectedWorkingTime || job.workingTime === selectedWorkingTime;

    const lowerSearchTerm = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ||
      job.jobTitle?.toLowerCase().includes(lowerSearchTerm) ||
      job.location?.toLowerCase().includes(lowerSearchTerm) ||
      job.workingTime?.toLowerCase().includes(lowerSearchTerm) ||
      (job.requirementExperience === 0 && 'no experience'.includes(lowerSearchTerm)) ||
      (typeof job.requirementExperience === 'number' && `${job.requirementExperience} year`.includes(lowerSearchTerm)) ||
      (typeof job.salary === 'number' && `${job.salary}`.includes(lowerSearchTerm));

    return matchesCategory && matchesExperience && matchesLocation && matchesSalary && matchesWorkingTime && matchesSearch;
  });

  const isFiltered = selectedCategory || selectedExperience || selectedLocation || selectedSalary || selectedWorkingTime || searchTerm;
  const jobsToDisplay = isFiltered ? filteredJobs : jobs;

  const displayedJobs = isFiltered
    ? jobsToDisplay.slice(filteredPage * pageSize, (filteredPage + 1) * pageSize)
    : jobsToDisplay;

  const displayTotalPages = isFiltered ? Math.ceil(jobsToDisplay.length / pageSize) : totalPages;
  const displayCurrentPage = isFiltered ? filteredPage : currentPage;

  const handlePageChange = (page) => {
    if (isFiltered) {
      if (page >= 0 && page < displayTotalPages) {
        setFilteredPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      if (page >= 0 && page < displayTotalPages) {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleApplyClick = (jobUuid) => {
    setSelectedJobUuid(jobUuid);
    setIsApplyModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsApplyModalOpen(false);
    setSelectedJobUuid(null);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(0, displayCurrentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(displayTotalPages - 1, startPage + maxPagesToShow - 1);

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

    if (endPage < displayTotalPages - 1) {
      if (endPage < displayTotalPages - 2) {
        pageNumbers.push('...');
      }
      pageNumbers.push(displayTotalPages - 1);
    }

    return pageNumbers;
  };

  if (allJobsLoading || paginatedJobsLoading || latestJobsLoading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <p className="text-[#1A5276] text-lg sm:text-xl">Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans px-4 sm:px-6 lg:px-10 xl:px-24 mt-10 bg-[#f5f5f5]">
      {/* ===== HEADER ===== */}
      <header className="mb-8 md:mb-12 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-[32px] font-semibold text-[#1A5276]">
          Find your dream jobs
        </h1>
      </header>

      {/* ===== FILTER SECTION ===== */}
      <section className="flex flex-col items-center gap-6 mb-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full">
          <Dropdown label="All Categories" options={categories} onSelect={setSelectedCategory} />
          <Dropdown label="All Experiences" options={experiences} onSelect={setSelectedExperience} />
          <Dropdown label="All Locations" options={locations} onSelect={setSelectedLocation} />
          <Dropdown label="All Prices" options={salaries} onSelect={setSelectedSalary} />
          <Dropdown label="All Working Hours" options={workingTimes} onSelect={setSelectedWorkingTime} />
        </div>
      </section>

      {/* ===== JOB LIST ===== */}
      <section className="max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer px-4 justify-items-center">
          {displayedJobs.length > 0 ? (
            displayedJobs.map((job) => (
              <SingleJobCard
                key={job.uuid}
                jobUuid={job.uuid}
                jobTitle={job.jobTitle}
                postDate={job.createdDate}
                location={job.location}
                salary={job.salary}
                Photos={job.jobPhotos}
                onApplyClick={handleApplyClick}
              />
            ))
          ) : (
            <p className="text-center text-[#1A5276] col-span-full text-lg sm:text-xl py-10">
              No jobs found matching your current filter criteria.
            </p>
          )}
        </div>
      </section>

      {/* ===== PAGINATION ===== */}
      {displayTotalPages > 1 && (
        <div className="flex items-center justify-center flex-wrap gap-2 mt-8 mb-12">
          <button
            onClick={() => handlePageChange(displayCurrentPage - 1)}
            disabled={displayCurrentPage === 0}
            className={`px-3 sm:px-4 py-2 rounded-full font-semibold transition-colors duration-200 ${
              displayCurrentPage === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-[#1A5276] hover:bg-gray-200'
            }`}
          >
            Previous
          </button>
          {renderPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && handlePageChange(page)}
              className={`px-3 sm:px-4 py-2 rounded-full font-semibold transition-colors duration-200 ${
                page === '...' ? 'text-[#1A5276] cursor-default' : displayCurrentPage === page ? 'bg-[#1A5276] text-white' : 'text-[#1A5276] hover:bg-gray-200'
              }`}
            >
              {page === '...' ? page : page + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(displayCurrentPage + 1)}
            disabled={displayCurrentPage === displayTotalPages - 1}
            className={`px-3 sm:px-4 py-2 rounded-full font-semibold transition-colors duration-200 ${
              displayCurrentPage === displayTotalPages - 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-[#1A5276] hover:bg-gray-200'
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* ===== LATEST JOBS ===== */}
      <section className="max-w-7xl mx-auto mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-[32px] font-semibold text-[#1A5276] text-center mb-8">
          Latest Jobs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer px-4 justify-items-center">
          {latestJobs.length > 0 ? (
            latestJobs.map((job) => (
              <SingleJobCard
                key={job.uuid}
                jobUuid={job.uuid}
                jobTitle={job.jobTitle}
                postDate={job.createdDate}
                location={job.location}
                salary={job.salary}
                Photos={job.jobPhotos}
                onApplyClick={handleApplyClick}
              />
            ))
          ) : (
            <p className="text-center text-[#1A5276] col-span-full text-lg sm:text-xl">
              No latest jobs found.
            </p>
          )}
        </div>
      </section>

      {/* ===== APPLY JOB MODAL ===== */}
      {isApplyModalOpen && (
        <ApplyJob jobUuid={selectedJobUuid} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default FindJobPage;