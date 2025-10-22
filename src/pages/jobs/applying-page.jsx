import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  useGetUserQuery,
  useGetLatestUserCVQuery,
} from "../../features/api/apiSlice";
import { useApplyForJobMutation } from "../../features/job/jobSlice";

const ApplyJob = ({ jobUuid, onClose }) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Fetch user data
  const { data: userData, isLoading: userLoading, error: userError } =
    useGetUserQuery();

  // Fetch latest CV
  const {
    data: latestCV,
    isLoading: cvLoading,
    error: cvError,
  } = useGetLatestUserCVQuery(userData?.uuid, { skip: !userData?.uuid });

  // Apply for job mutation
  const [applyForJob, { isLoading: applyLoading }] = useApplyForJobMutation();

  const handleViewCV = () => {
    if (!latestCV || !latestCV.fileUrl) {
      toast.error("No CV found. Please upload a CV in your profile first.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!latestCV.fileUrl.toLowerCase().endsWith(".pdf")) {
      toast.error("Invalid CV file format. Please upload a valid PDF.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    window.open(latestCV.fileUrl, "_blank");
  };

  const handleConfirm = async () => {
    if (!userData?.uuid) {
      setError("⚠️ User data not available. Please log in again.");
      toast.error("User data not available. Redirecting to login...", {
        position: "top-center",
        autoClose: 3000,
      });
      setTimeout(() => navigate("/login"), 3000);
      return;
    }

    if (!latestCV?.uuid) {
      setError("⚠️ No valid CV available. Please upload a new CV in your profile.");
      toast.error("No valid CV available. Please upload in your profile first.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    try {
      await applyForJob({
        userUuid: userData.uuid,
        jobUuid,
        cvUuid: latestCV.uuid,
        coverLetterUrl: null,
      }).unwrap();

      toast.success("🎉 Applied Job Successfully!", {
        position: "top-center",
        autoClose: 3000,
      });

      // Show success message on top
      setSuccess(true);

      // Close the modal after 2 seconds
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Apply error:", err);

      if (err.status === 401) {
        toast.error("Unauthorized. Please log in again.", {
          position: "top-center",
          autoClose: 3000,
        });
        setTimeout(() => navigate("/login"), 3000);
      } else if (err.status === 400) {
        toast.error(
          err?.data?.message ||
            "Invalid request. Please check your CV and try again.",
          { position: "top-center", autoClose: 3000 }
        );
      } else {
        toast.error(
          err?.data?.message ||
            "Failed to apply for job. Please try again.",
          { position: "top-center", autoClose: 3000 }
        );
      }
    }
  };

  const handleCancel = () => onClose();

  // Loading state
  if (userLoading || cvLoading || applyLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
        <div className="bg-white rounded-xl shadow-lg w-96 p-8 text-center max-w-full">
          <p className="text-[#1A5276] text-base">Loading...</p>
        </div>
      </div>
    );
  }


  // Success message (top position)
  if (success) {
    return (
      <div className="fixed inset-0 flex items-start justify-center bg-black/40 z-50">
        <div className="mt-10 bg-white rounded-xl shadow-lg w-96 p-6 text-center max-w-full animate-fadeIn">
          <p className="text-[#1A5276] text-lg font-semibold">
            🎉 Applied Job Successfully!
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (userError || cvError) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
        <div className="bg-white rounded-xl shadow-lg w-96 p-8 text-center max-w-full">
          <p className="text-red-600 text-base">
            Error:{" "}
            {userError?.data?.message ||
              cvError?.data?.message ||
              "Failed to load data."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-xl shadow-lg w-96 p-8 text-center max-w-full">
        <h2 className="text-xl font-semibold mb-4 text-[#1A5276]">
          APPLYING JOB
        </h2>
        <p className="text-[#1A5276] mb-6 text-base">
          Do you want to apply for this job?
        </p>

        <div className="mb-6">
          <label className="block text-base font-medium text-[#1A5276] mb-2">
            Review your CV
          </label>
          <button
            type="button"
            onClick={handleViewCV}
            className="flex items-center justify-center w-full px-6 py-3 bg-[#1A5276] text-white font-medium text-base rounded-lg shadow-md hover:bg-[#149AC5] focus:outline-none focus:ring-2 focus:ring-[#149AC5] transition duration-150 ease-in-out"
          >
            <FiEye className="w-6 h-6 mr-2" /> View current CV
          </button>
          <p className="mt-3 text-sm text-[#1A5276]">
            If you want to upload a new CV, please upload it in your profile
            details.
          </p>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleConfirm}
            className="px-6 py-3 rounded-full bg-[#1A5276] text-white text-base hover:bg-[#149AC5] transition"
            disabled={applyLoading}
          >
            OK
          </button>
          <button
            onClick={handleCancel}
            className="px-6 py-3 rounded-full border border-gray-400 text-[#1A5276] text-base hover:border-[#149AC5] hover:text-[#149AC5] transition"
          >
            Cancel
          </button>
        </div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default ApplyJob;
