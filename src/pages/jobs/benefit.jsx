// BenefitsData
import React from 'react';
// Using Feather Icons (fi) from react-icons for a clean, minimalist, and modern look.
// Make sure you have react-icons installed: npm install react-icons
import { FiBriefcase, FiMapPin, FiUsers, FiClock } from 'react-icons/fi';

// Define the data for the cards to keep the JSX clean
const benefitsData = [
  {
    // Combining Briefcase and Clock to represent Work-Life Balance
    icon: () => (
      <div className="relative">
        {/* Switched to Feather Icons FiBriefcase */}
        <FiBriefcase className="w-6 h-6" />
        {/* Switched to Feather Icons FiClock. Adjusted positioning for react-icons/fi */}
        <FiClock className="w-3 h-3 absolute -top-1 -right-1 fill-current stroke-2" />
      </div>
    ),
    title: "Work-Life Balance",
    description: "Many remote jobs also come with flexible schedules, which means that workers can start and end their day as they want to choose.",
    // Adjusted: Lighter blue icon background and slightly deeper text color for better contrast
    color: "text-[#3b5998] bg-[#f0f7ff]", // Light blue theme, matching the pale background of the original icons
    iconColor: "text-blue-500", // Blue icon color
  },
  {
    // Using MapPin with Clock to represent working from anywhere/flexibility
    icon: () => (
      <div className="relative">
        {/* Switched to Feather Icons FiMapPin */}
        <FiMapPin className="w-6 h-6" />
        {/* Switched to Feather Icons FiClock. Adjusted positioning for react-icons/fi */}
        <FiClock className="w-3 h-3 absolute -top-1 -right-1 fill-current stroke-2" />
      </div>
    ),
    title: "Work Anywhere",
    description: "Having access to a broader range of job opportunities that aren't limited by geographic location. This can be especially helpful.",
    // Adjusted: Lighter orange icon background
    color: "text-orange-500 bg-[#fff8f0]", // Very light orange theme
    iconColor: "text-orange-500",
  },
  {
    // Using FiUsers for the linked/inclusive group feel
    icon: FiUsers, // FiUsers is the component itself
    title: "Improved Inclusivity",
    description: "Remote work enables companies to embrace diversity and inclusion by hiring people from a wide variety of different cultural backgrounds. ",
    // Adjusted: Lighter pink icon background
    color: "text-pink-600 bg-[#fff0f5]", // Very light pink theme
    iconColor: "text-pink-600",
  },
];

// Reusable Card Component
const BenefitCard = ({ icon: Icon, title, description, color, iconColor }) => (
  // Restored fixed width (w-[373px]) and height (h-[216px])
  <div className="bg-white rounded-xl border border-gray-200 p-6 w-[373px] gap-2 h-[216px] flex flex-col justify-between transition duration-300 text-[#1A5276]">
    <div className="flex items-center"> {/* Removed mb-4 to save vertical space for fixed height */}
      
      {/* Icon and its styling */}
      {/* Increased padding (p-3) on the icon wrapper for better visual spacing */}
      <div className={`p-3 rounded-lg mr-4 ${color} ${iconColor}`}> 
        {/* Render the Icon component. We check the name to apply className only to standalone icons */}
        {Icon.name === 'FiUsers' ? <Icon className="w-6 h-6" /> : <Icon />}
      </div>
      
      {/* Title matching the dark blue/gray text aesthetic */}
      <h2 className="text-lg font-bold text-[#1A5276] whitespace-nowrap">{title}</h2>
    </div>
    
    {/* Description text */}
    {/* text-left ensures text is aligned to the start line */}
    <p className="text-[#1A5276] text-[0.95rem] leading-relaxed text-left">
        {description}
    </p>
  </div>
);


// Main Layout Component (Renamed to Homepage)
const BenefitsData = () => {
  return (
    // Added 'items-center' back to center the card row if it doesn't fill the full width
    <div className="min-h-screen flex flex-col pt-24 pb-12 text-[#1A5276] items-center"> 
      
      {/* Main Title Area */}
      <header className="mb-14 w-full max-w-6xl px-4 mx-auto">
        {/* Title color is a deep blue, matching the source image */}
        <h1 className="text-3xl sm:text-4xl font-semibold text-[#1A5276] text-center">Your benefit</h1>
      </header>
      
      {/* Cards Container */}
      <main className="w-full max-w-6xl px-4 mx-auto gap-2">
        
        <div className="grid gap-15 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
          
          {/* Map through data to render the cards */}
          {benefitsData.map((benefit, index) => (
            <BenefitCard 
              key={index} 
              icon={benefit.icon} 
              title={benefit.title} 
              description={benefit.description} 
              color={benefit.color}
              iconColor={benefit.iconColor}
            />
          ))}
          
        </div>
      </main>
    </div>
  );
};

export default BenefitsData;
