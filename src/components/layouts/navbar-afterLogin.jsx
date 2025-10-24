import React, { useState, useEffect, useRef } from "react";
import {
  FiSearch,
  FiMoon,
  FiSun,
  FiUser,
  FiMenu,
  FiX,
  FiLogOut,
  FiBookmark,
} from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCredentials } from "../../features/auth/authSlide";
import { useGetAllJobsQuery } from "../../features/job/jobSlice";
import { clearTokens } from "../../utils/tokenUtils";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase-config";
import { toast } from "react-toastify";
import logo from "../../assets/jobCollapLogo.png"; // Import the logo

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const profileRef = useRef(null);
  const searchRef = useRef(null);
  const suggestionRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { data: allJobsData, isLoading: allJobsLoading } = useGetAllJobsQuery();
  const username = user?.name || "My Profile";

  useEffect(() => {
    console.log("NavBar user state:", { user, isAuthenticated });
  }, [user, isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target)
      ) {
        console.log("Clicked outside search and suggestions, closing suggestions");
        setShowSuggestions(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() && allJobsData && !allJobsLoading) {
      const jobs = allJobsData.data.content || [];
      const lowerQuery = searchQuery.trim().toLowerCase();
      const uniqueSuggestions = new Set();

      jobs.forEach((job) => {
        if (job.jobTitle?.toLowerCase().includes(lowerQuery)) {
          uniqueSuggestions.add(job.jobTitle);
        }
        if (job.location?.toLowerCase().includes(lowerQuery)) {
          uniqueSuggestions.add(job.location);
        }
        if (job.workingTime?.toLowerCase().includes(lowerQuery)) {
          uniqueSuggestions.add(job.workingTime);
        }
        if (job.requirementExperience === 0 && "no experience".includes(lowerQuery)) {
          uniqueSuggestions.add("No experience");
        }
        if (
          typeof job.requirementExperience === "number" &&
          `${job.requirementExperience} year`.includes(lowerQuery)
        ) {
          uniqueSuggestions.add(
            `${job.requirementExperience} year${job.requirementExperience > 1 ? "s" : ""} experiences`
          );
        }
        if (typeof job.salary === "number" && `${job.salary}`.includes(lowerQuery)) {
          uniqueSuggestions.add(`${job.salary.toFixed(0)}$`);
        }
      });

      const suggestionArray = [...uniqueSuggestions].slice(0, 5);
      setSuggestions(suggestionArray);
      setShowSuggestions(suggestionArray.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, allJobsData, allJobsLoading]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", !darkMode);
    document.body.classList.toggle("dark", !darkMode);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase sign-out
      dispatch(clearCredentials());
      clearTokens();
      toast.success("Logged out successfully!", {
        position: "top-center",
        autoClose: 1000,
        onClose: () => {
          navigate("/"); // Navigate after toast closes
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
      dispatch(clearCredentials());
      clearTokens();
      toast.error("Logout failed. Please try again.", {
        position: "top-center",
        autoClose: 3000,
        onClose: () => {
          navigate("/"); // Navigate after toast closes
        },
      });
    }
  };

  const handleSearch = (query = searchQuery) => {
    console.log("handleSearch called with query:", query);
    if (query.trim()) {
      navigate(`/jobs?query=${encodeURIComponent(query)}`);
      setSearchQuery("");
      setShowSuggestions(false);
      setOpen(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      console.log("Enter key pressed with query:", searchQuery);
      handleSearch();
    }
  };

  const handleSuggestionClick = (e, suggestion) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Suggestion clicked:", suggestion);
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };

  return (
    <nav className="bg-white p-4 rounded-[20px] mx-auto px-12 md:px-12 max-w-7xl flex items-center justify-between sticky top-3 z-50">
      <div className="flex items-center">
        <NavLink to="/">
          <img
            src={logo}
            alt="JOBCOLLAP Logo"
            className="h-10 md:h-12 mr-4 object-contain"
          />
        </NavLink>
      </div>

      <div className="hidden lg:flex space-x-8 text-gray-700 font-medium">
        {[
          { name: "Home", path: "/" },
          { name: "Find Jobs", path: "/jobs" },
          { name: "About Us", path: "/about" },
          { name: "Contact Us", path: "/contact" },
        ].map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? "text-green-500 font-semibold hover:text-[#FF7A00] transition-colors"
                : "text-[#1A5276] hover:text-[#FF7A00] transition-colors"
            }
          >
            {item.name}
          </NavLink>
        ))}
      </div>

      <div className="hidden lg:flex items-center space-x-6 relative">
        <div className="relative" ref={searchRef}>
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
            <FiSearch className="text-[#1A5276] mr-2" size={20} />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent outline-none text-[#1A5276] placeholder-[#1A5276] w-32 lg:w-48"
            />
          </div>
          {showSuggestions && (
            <div
              ref={suggestionRef}
              className="absolute z-30 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto pointer-events-auto"
            >
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={(e) => handleSuggestionClick(e, suggestion)}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="p-3 hover:bg-gray-100 cursor-pointer text-[#1A5276]"
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4 text-[#1A5276]" ref={profileRef}>
          <button
            aria-label="Toggle dark mode"
            className="p-2 hover:bg-gray-100 rounded-full hover:text-[#FF7A00] transition-colors"
            onClick={toggleDarkMode}
          >
            {darkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
          </button>

          <div className="relative">
            <button
              aria-label="User profile"
              onClick={() => setProfileOpen(!profileOpen)}
              className="p-2 hover:bg-gray-100 rounded-full hover:text-[#FF7A00] transition-colors"
            >
              <FiUser size={24} />
            </button>

            <div
              className={`absolute right-0 mt-10 w-56 bg-white shadow-lg rounded-xl overflow-hidden transform transition-all duration-200 z-20 ${
                profileOpen
                  ? "scale-100 opacity-100"
                  : "scale-95 opacity-0 pointer-events-none"
              }`}
            >
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center px-4 py-3 text-green-500 font-semibold hover:bg-gray-50 hover:text-[#FF7A00] transition-colors"
                    : "flex items-center px-4 py-3 text-[#1A5276] hover:bg-gray-50 hover:text-[#FF7A00] transition-colors"
                }
                onClick={() => setProfileOpen(false)}
              >
                <FiUser className="mr-3" size={20} /> {username}
              </NavLink>
              <hr />
              <NavLink
                to="/saved-jobs"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center px-4 py-3 text-green-500 font-semibold hover:bg-gray-50 hover:text-[#FF7A00] transition-colors"
                    : "flex items-center px-4 py-3 text-[#1A5276] hover:bg-gray-50 hover:text-[#FF7A00] transition-colors"
                }
                onClick={() => setProfileOpen(false)}
              >
                <FiBookmark className="mr-3" size={20} /> My Saved Jobs
              </NavLink>
              <button
                onClick={handleLogout}
                className="flex items-center w-full text-left px-4 py-3 text-red-600 hover:bg-gray-50 hover:text-red-700 transition-colors"
              >
                <FiLogOut className="mr-3" size={20} /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        className="lg:hidden text-[#1A5276]"
        onClick={() => setOpen(!open)}
      >
        {open ? <FiX size={28} /> : <FiMenu size={28} />}
      </button>

      <div
        className={`lg:hidden absolute top-full left-0 w-full bg-white rounded-xl transition-all duration-300 z-10 ${
          open
            ? "max-h-screen opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="flex flex-col space-y-4 p-6 text-[#1A5276] font-medium">
          {[
            { name: "Home", path: "/" },
            { name: "Find Jobs", path: "/jobs" },
            { name: "About Us", path: "/about" },
            { name: "Contact Us", path: "/contact" },
          ].map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? "text-green-500 font-semibold hover:text-[#FF7A00] transition-colors px-2"
                  : "text-[#1A5276] hover:text-[#FF7A00] transition-colors px-2"
              }
            >
              {item.name}
            </NavLink>
          ))}

          <div className="relative" ref={searchRef}>
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
              <FiSearch className="text-[#1A5276] mr-2" size={20} />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-transparent outline-none text-[#1A5276] placeholder-[#1A5276] w-full"
              />
            </div>
            {showSuggestions && (
              <div
                ref={suggestionRef}
                className="absolute z-30 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto pointer-events-auto"
              >
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={(e) => handleSuggestionClick(e, suggestion)}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="p-3 hover:bg-gray-100 cursor-pointer text-[#1A5276]"
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>

          <NavLink
            to="/profile"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              isActive
                ? "flex items-center px-2 text-green-500 font-semibold hover:text-[#FF7A00] transition-colors"
                : "flex items-center px-2 text-[#1A5276] hover:text-[#FF7A00] transition-colors"
            }
          >
            <FiUser className="mr-3" size={20} /> {username}
          </NavLink>
          <NavLink
            to="/saved-jobs"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              isActive
                ? "flex items-center px-2 py-2 text-green-500 font-semibold hover:text-[#FF7A00] transition-colors"
                : "flex items-center px-2 py-2 text-[#1A5276] hover:text-[#FF7A00] transition-colors"
            }
          >
            <FiBookmark className="mr-3" size={20} /> My Saved Jobs
          </NavLink>
          <button
            onClick={handleLogout}
            className="flex items-center px-2 py-2 text-red-600 hover:text-red-700 transition-colors"
          >
            <FiLogOut className="mr-3" size={20} /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;