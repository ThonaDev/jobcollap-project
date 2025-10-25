import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import VerifyImage from "../../assets/verify.png";
import JOBCollapLogo from "../../assets/jobCollapLogo.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.warn("⚠️ Please enter your email address.", {
        position: "top-center",
        autoClose: 2500,
      });
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/auth/forgot-password/verify-email?email=${email}`
      );

      const result = response.data;

      if (response.status === 200 || result?.status === 204) {
        toast.success(
          result?.message ||
            "✅ Please check your email to reset your password.",
          {
            position: "top-center",
            autoClose: 3000,
          }
        );

        // Save token for next step
        if (result?.data?.forgotPasswordToken) {
          localStorage.setItem(
            "forgotPasswordToken",
            result.data.forgotPasswordToken
          );
        }

        setEmail("");

        // ✅ Redirect to Reset Password page
        setTimeout(() => {
          window.location.href = "/reset-password";
        }, 3000);
      } else {
        toast.error(
          result?.message || "Something went wrong. Try again later.",
          {
            position: "top-center",
            autoClose: 3000,
          }
        );
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("❌ Failed to send email. Please try again.", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="w-full h-auto max-w-5xl bg-white rounded-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side */}
        <div className="relative hidden md:flex md:w-1/2 flex-col items-center justify-start bg-[#ECF2FF] p-8">
          <div className="absolute top-6 left-6 flex flex-col items-start">
            <h1 className="text-2xl lg:text-3xl font-bold text-[#1A5276]">
              Welcome to
            </h1>
            <img
              src={JOBCollapLogo}
              alt="JOBCollap Logo"
              className="h-10 lg:h-12 mt-1"
            />
          </div>
          <div className="text-center w-full max-w-sm relative mt-20">
            <img
              src={VerifyImage}
              alt="Verify"
              className="w-full h-auto max-w-md"
            />
          </div>
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-6 sm:p-8 lg:p-10 bg-[#ECF2FF]">
          <h2 className="text-2xl sm:text-3xl text-center font-bold text-[#1A5276] mb-6">
            Enter your email to reset password
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 flex flex-col items-center"
          >
            <div className="w-full sm:w-11/12">
              <label className="block text-md font-bold text-[#1A5276]">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-[#1A5276] rounded-lg mt-1 bg-white focus:ring-2 focus:ring-[#149AC5] outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-40 bg-[#154360] text-white py-2 rounded-full mt-6 transition ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#149AC5]"
              }`}
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}