import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RegisterImage from "../../assets/register.png";
import JOBCollapLogo from "../../assets/jobCollapLogo.png";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useRegisterMutation,
  useLoginMutation,
} from "../../features/api/apiSlice";
import { setCredentials } from "../../features/auth/authSlide";
import { useAppDispatch } from "../../store";
import {
  storeAccessToken,
  storeRefreshToken,
  generateSecurePassword,
} from "../../utils/tokenUtils";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  fetchSignInMethodsForEmail,
  signOut,
} from "firebase/auth";
import { auth } from "../../firebase/firebase-config";

const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

const registerSchema = z
  .object({
    userName: z
      .string()
      .nonempty("Please fill out this field")
      .min(3, "User name must be at least 3 characters"),
    email: z
      .string()
      .nonempty("Please fill out this field")
      .email("Please include '@' in the email address"),
    password: z
      .string()
      .nonempty("Password is required")
      .min(8, "Password must be at least 8 characters long")
      .regex(
        strongPasswordRegex,
        "Password must include an uppercase letter, a lowercase letter, a number, and a symbol"
      ),
    confirmPassword: z.string().nonempty("Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try again later.</h1>;
    }
    return this.props.children;
  }
}

export default function Register() {
  console.log("Register component rendered"); // Debug log
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [login] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const { userName, email, password } = data;
      console.log("Submitting registration:", { userName, email, password }); // Debug log
      const result = await registerUser({ userName, email, password }).unwrap();
      console.log("Registration result:", result); // Debug log
      toast.success("Please check your email to verify your registration", {
        position: "top-center",
        autoClose: 40000,
      });
      reset();
      setTimeout(() => navigate("/login"), 5100); // Delay navigation
    } catch (err) {
      console.error("❌ Registration failed:", err, err?.data, err?.status); // Debug log
      if (
        err?.data?.message?.includes("already registered") ||
        err?.data?.message?.includes("email already exists") ||
        err?.status === 409
      ) {
        toast.error(
          "This email is already registered. Please use a different email or login.",
          {
            position: "top-center",
            autoClose: 5000,
          }
        );
        setTimeout(() => navigate("/login"), 5100);
      } else {
        toast.error(
          err?.data?.message || "Registration failed! Please try again.",
          {
            position: "top-center",
            autoClose: 5000,
          }
        );
      }
    }
  };

  const handleSocialLogin = async (providerType) => {
    try {
      setIsSocialLoading(true);
      await signOut(auth);
      const provider =
        providerType === "github"
          ? new GithubAuthProvider()
          : new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const { email, displayName } = result.user;
      const userName = displayName || email.split("@")[0];
      const socialPassword = generateSecurePassword();

      const registerPayload = { userName, email, password: socialPassword };
      console.log("Registering social user:", registerPayload); // Debug log
      await registerUser(registerPayload).unwrap();

      toast.success(
        "Account created! Please check your email to verify your registration. Logging in shortly...",
        {
          position: "top-center",
          autoClose: 35000,
        }
      );

      setTimeout(async () => {
        try {
          const loginPayload = { email, password: socialPassword };
          console.log("Attempting social login:", loginPayload); // Debug log
          const loginResponse = await login(loginPayload).unwrap();

          dispatch(
            setCredentials({
              accessToken: loginResponse.data.accessToken,
              refreshToken: loginResponse.data.refreshToken,
              user: { userName, email },
            })
          );
          storeAccessToken(loginResponse.data.accessToken);
          storeRefreshToken(loginResponse.data.refreshToken);

          toast.success("✅ Logged in successfully!", {
            position: "top-center",
            autoClose: 2500,
          });
          navigate("/");
        } catch (loginError) {
          console.error("Social login error:", loginError); // Debug log
          toast.error(
            "🚨 Login failed after registration. Please try logging in manually.",
            {
              position: "top-center",
              autoClose: 5000,
            }
          );
          navigate("/login");
        }
      }, 60000);
    } catch (error) {
      console.error(
        `${providerType} login error:`,
        error,
        error?.data,
        error?.code
      ); // Debug log
      if (error.code === "auth/account-exists-with-different-credential") {
        const email = error.customData?.email;
        const methods = await fetchSignInMethodsForEmail(auth, email);
        toast.error(
          `Email already used with ${methods.join(
            ", "
          )}. Please login with that provider.`,
          { position: "top-center", autoClose: 5000 }
        );
      } else if (
        error?.data?.message?.includes("already registered") ||
        error?.data?.message?.includes("email already exists") ||
        error?.status === 409
      ) {
        toast.error(
          "This email is already registered. Please use a different email or login.",
          {
            position: "top-center",
            autoClose: 5000,
          }
        );
        setTimeout(() => navigate("/login"), 5100);
      } else {
        toast.error(`🚨 ${providerType} login failed`, {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } finally {
      setIsSocialLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex items-center justify-center min-h-screen bg-white px-4">
        <div className="w-full max-w-5xl bg-white rounded-2xl overflow-hidden flex flex-col md:flex-row">
          <div className="hidden md:flex md:w-1/2 flex-col items-center justify-start bg-[#ECF2FF] p-8 relative">
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
            <div className="text-center w-full max-w-sm mt-20">
              <img
                src={RegisterImage}
                alt="Register Illustration"
                className="w-full h-auto max-w-md"
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center p-6 sm:p-8 lg:p-10 bg-[#ECF2FF]">
            <h2 className="text-2xl sm:text-3xl text-center font-bold text-[#1A5276] mb-6">
              Register
            </h2>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5 flex flex-col items-center"
            >
              <div className="w-full sm:w-11/12">
                <label className="block text-md font-bold text-[#1A5276]">
                  Full Name
                </label>
                <input
                  type="text"
                  {...register("userName")}
                  className="w-full p-2 border border-[#1A5276] rounded-lg mt-1 bg-white focus:ring-2 focus:ring-[#149AC5] outline-none"
                  placeholder="Enter full name"
                />
                {errors.userName && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.userName.message}
                  </p>
                )}
              </div>

              <div className="w-full sm:w-11/12">
                <label className="block text-md font-bold text-[#1A5276]">
                  Email
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full p-2 border border-[#1A5276] rounded-lg mt-1 bg-white focus:ring-2 focus:ring-[#149AC5] outline-none"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="relative w-full sm:w-11/12">
                <label className="block text-md font-bold text-[#1A5276]">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="w-full p-2 border border-[#1A5276] rounded-lg mt-1 bg-white focus:ring-2 focus:ring-[#149AC5] outline-none"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute top-10 right-3 text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEye size={18} />
                  ) : (
                    <FaEyeSlash size={18} />
                  )}
                </button>
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="relative w-full sm:w-11/12">
                <label className="block text-md font-bold text-[#1A5276]">
                  Confirm Password
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  className="w-full p-2 border border-[#1A5276] rounded-lg mt-1 bg-white focus:ring-2 focus:ring-[#149AC5] outline-none"
                  placeholder="Re-confirm password"
                />
                <button
                  type="button"
                  className="absolute top-10 right-3 text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FaEye size={18} />
                  ) : (
                    <FaEyeSlash size={18} />
                  )}
                </button>
                {errors.confirmPassword && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || isSocialLoading}
                className="w-40 bg-[#154360] text-white py-2 rounded-full mt-6 hover:bg-[#149AC5] transition disabled:opacity-50 sm:w-11/12 text-center font-semibold"
              >
                {isLoading ? "Registering..." : "Register"}
              </button>
            </form>

            <div className="mt-3 text-center w-full">
              <p className="text-lg mb-3 text-[#1A5276]">Or sign up with</p>
              <div className="flex justify-center space-x-6">
                <button
                  onClick={() =>
                    !isSocialLoading && handleSocialLogin("github")
                  }
                  disabled={isSocialLoading}
                  className={`flex items-center justify-center space-x-3 py-2 px-2 border border-[#1A5276] rounded-lg text-sm font-medium text-[#1A5276] bg-white hover:bg-gray-50 transition ${
                    isSocialLoading ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  <FaGithub size={24} className="text-black" />
                  <span>Sign up with GitHub</span>
                </button>

                <button
                  onClick={() =>
                    !isSocialLoading && handleSocialLogin("google")
                  }
                  disabled={isSocialLoading}
                  className={`flex items-center justify-center space-x-3 py-2 px-2 border border-[#1A5276] rounded-lg text-sm font-medium text-[#1A5276] bg-white hover:bg-gray-50 transition ${
                    isSocialLoading ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  <FcGoogle size={24} />
                  <span>Sign up with Google</span>
                </button>
              </div>
            </div>

            <p className="mt-4 text-lg text-center">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-[#1A5276] hover:underline"
              >
                Login
              </button>
            </p>
          </div>
        </div>
        <ToastContainer />
      </div>
    </ErrorBoundary>
  );
}
