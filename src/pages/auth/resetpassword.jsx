import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import VerifyImage from "../../assets/verify.png";
import JOBCollapLogo from "../../assets/jobCollapLogo.png";

const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const resetPasswordSchema = z
  .object({
    code: z
      .string()
      .nonempty("Please fill out this field")
      .length(8, "Verification code must be exactly 8 digits")
      .regex(/^\d{8}$/, "Verification code must contain only digits"),
    newPassword: z
      .string()
      .nonempty("Please fill out this field")
      .min(8, "Password must be at least 8 characters long")
      .regex(
        strongPasswordRegex,
        "Password must include an uppercase letter, a lowercase letter, a number, and a symbol"
      ),
    confirmPassword: z.string().nonempty("Please fill out this field"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPassword() {
  const [otp, setOtp] = useState(["", "", "", "", "", "", "", ""]);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      code: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Update form value for code
      const newCode = newOtp.join("");
      setValue("code", newCode, { shouldValidate: true });

      // Move to next input if value is entered
      if (value && index < 7) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  // Handle backspace to move to previous input
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle paste event for OTP
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{8}$/.test(pastedData)) {
      const newOtp = pastedData.split("").slice(0, 8);
      setOtp(newOtp);
      setValue("code", pastedData, { shouldValidate: true });
      inputRefs.current[7].focus();
    } else {
      toast.warn("⚠️ Please paste a valid 8-digit code.", {
        position: "top-center",
        autoClose: 2500,
      });
    }
  };

  // Handle form submission
  const handleReset = async (data) => {
    const forgotPasswordToken = localStorage.getItem("forgotPasswordToken");

    try {
      setLoading(true);

      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/auth/update-forgot-password`,
        {
          code: data.code,
          forgotPasswordToken,
          newPassword: data.newPassword,
          confirmedPassword: data.confirmPassword,
        }
      );

      if (response.status === 200) {
        toast.success("✅ Password updated successfully! Redirecting to login...", {
          position: "top-center",
          autoClose: 2000,
        });

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

  // Auto-focus first OTP input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
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

          <form onSubmit={handleSubmit(handleReset)} className="space-y-5 flex flex-col items-center">
            {/* OTP Input */}
            <div className="w-full sm:w-11/12 relative">
              <label className="block text-md font-bold text-[#1A5276]">
                Verification Code
              </label>
              <div className="flex justify-between gap-2 mt-1" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    ref={(el) => (inputRefs.current[index] = el)}
                    className="w-10 h-10 text-center border border-[#1A5276] rounded-lg bg-white focus:ring-2 focus:ring-[#149AC5] outline-none"
                    placeholder="-"
                  />
                ))}
              </div>
              {errors.code && (
                <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
              )}
            </div>

            {/* New Password */}
            <div className="w-full sm:w-11/12 relative">
              <label className="block text-md font-bold text-[#1A5276]">
                New Password
              </label>
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                {...register("newPassword")}
                className="w-full p-2 border border-[#1A5276] rounded-lg mt-1 bg-white focus:ring-2 focus:ring-[#149AC5] outline-none pr-10"
              />
              <button
                type="button"
                className="absolute top-10 right-3 text-gray-600"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
              </button>
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="w-full sm:w-11/12 relative">
              <label className="block text-md font-bold text-[#1A5276]">
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                {...register("confirmPassword")}
                className="w-full p-2 border border-[#1A5276] rounded-lg mt-1 bg-white focus:ring-2 focus:ring-[#149AC5] outline-none pr-10"
              />
              <button
                type="button"
                className="absolute top-10 right-3 text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
              </button>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
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