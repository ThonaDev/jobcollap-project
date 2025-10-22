import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import VerifyImage from "../../assets/verify.png";
import JOBCollapLogo from "../../assets/jobCollapLogo.png";

export default function ResetPassword() {
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(""); // ✅ inline error
  const [confirmError, setConfirmError] = useState("");   // ✅ inline error
  const navigate = useNavigate();

  // ✅ Password regex
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

  const handleReset = async (e) => {
    e.preventDefault();
    const forgotPasswordToken = localStorage.getItem("forgotPasswordToken");

    setPasswordError(""); // reset errors
    setConfirmError("");

    if (!code || !newPassword || !confirmPassword) {
      toast.warn("⚠️ Please fill in all fields.", {
        position: "top-center",
        autoClose: 2500,
      });
      return;
    }

    if (!strongPasswordRegex.test(newPassword)) {
      setPasswordError(
        "Password must be strong (at least 8 characters, include uppercase, lowercase, number, and symbol)"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setConfirmError("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/auth/update-forgot-password`,
        {
          code,
          forgotPasswordToken,
          newPassword,
          confirmedPassword: confirmPassword,
        }
      );

      if (response.status === 200) {
        toast.success(
          "✅ Password updated successfully! Redirecting to login...",
          {
            position: "top-center",
            autoClose: 2000,
          }
        );

        localStorage.removeItem("forgotPasswordToken");

        setTimeout(() => {
          navigate("/login");
        }, 2200);
      } else {
        toast.error("⚠️ Invalid code or token.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("❌ Invalid code or token. Please try again.", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50 px-4">
      <div className="w-full h-auto max-w-5xl bg-white rounded-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side Illustration */}
        <div className="relative hidden md:flex md:w-1/2 flex-col items-center justify-start bg-[#ECF2FF] p-8">
          <div className="absolute top-6 left-6 flex flex-col items-start">
            <h1 className="text-2xl lg:text-3xl font-bold text-[#1A5276]">Welcome to</h1>
            <img src={JOBCollapLogo} alt="JOBCollap Logo" className="h-10 lg:h-12 mt-1" />
          </div>
          <div className="text-center w-full max-w-sm relative mt-20">
            <img src={VerifyImage} alt="Reset Illustration" className="w-full h-auto max-w-md" />
          </div>
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-6 sm:p-8 lg:p-10 bg-[#ECF2FF]">
          <h2 className="text-2xl sm:text-3xl text-center font-bold text-[#1A5276] mb-6">
            Reset Your Password
          </h2>

          <form onSubmit={handleReset} className="space-y-5 flex flex-col items-center">
            {/* Code Input */}
            <div className="w-full sm:w-11/12 relative">
              <label className="block text-md font-bold text-[#1A5276]">
                Verification Code
              </label>
              <input
                type="text"
                placeholder="Enter code from your email"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full p-2 border border-[#1A5276] rounded-lg mt-1 bg-white focus:ring-2 focus:ring-[#149AC5] outline-none"
              />
            </div>

            {/* New Password */}
            <div className="w-full sm:w-11/12 relative">
              <label className="block text-md font-bold text-[#1A5276]">New Password</label>
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 border border-[#1A5276] rounded-lg mt-1 bg-white focus:ring-2 focus:ring-[#149AC5] outline-none pr-10"
              />
              <button
                type="button"
                className="absolute top-10 right-3 text-gray-600"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
              </button>
              {passwordError && (
                <p className="text-red-600 text-sm mt-1">{passwordError}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="w-full sm:w-11/12 relative">
              <label className="block text-md font-bold text-[#1A5276]">Confirm Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border border-[#1A5276] rounded-lg mt-1 bg-white focus:ring-2 focus:ring-[#149AC5] outline-none pr-10"
              />
              <button
                type="button"
                className="absolute top-10 right-3 text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
              </button>
              {confirmError && <p className="text-red-600 text-sm mt-1">{confirmError}</p>}
            </div>

            {/* Update Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-40 bg-[#154360] text-white py-2 rounded-full mt-6 transition ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#149AC5]"
              }`}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
      </div>

      {/* Toast Notification */}
      <ToastContainer />
    </div>
  );
}
