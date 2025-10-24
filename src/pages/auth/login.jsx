import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import LoginImage from "../../assets/login.png";
import JOBCollapLogo from "../../assets/jobCollapLogo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLoginMutation } from "../../features/api/apiSlice";
import { setCredentials } from "../../features/auth/authSlide";
import { useAppDispatch } from "../../store";
import { storeAccessToken, storeRefreshToken } from "../../utils/tokenUtils";
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

const loginSchema = z.object({
  email: z
    .string()
    .nonempty("Please fill out this field")
    .email("Enter a valid email"),
  password: z
    .string()
    .nonempty("Please fill out this field")
    .min(8, "Password must be at least 8 characters")
    .regex(
      strongPasswordRegex,
      "Password must include uppercase, lowercase, number, and symbol"
    ),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading: isSubmitting }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    try {
      const result = await login(data).unwrap();
      dispatch(
        setCredentials({
          accessToken: result.data.accessToken,
          refreshToken: result.data.refreshToken,
          user: { email: data.email },
        })
      );
      storeAccessToken(result.data.accessToken);
      storeRefreshToken(result.data.refreshToken);
      toast.success("🎉 Login successfully!", {
        position: "top-center",
        autoClose: 2500,
      });
      reset();
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("❌ Invalid email or password.", {
        position: "top-center",
        autoClose: 3000,
      });
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
      const { email } = result.user;

      // Attempt to log in with the email (assuming the user already exists)
      toast.info("Attempting to log in with social account...", {
        position: "top-center",
        autoClose: 3000,
      });

      const loginPayload = { email, socialProvider: providerType };
      const loginResponse = await login(loginPayload).unwrap();

      dispatch(
        setCredentials({
          accessToken: loginResponse.data.accessToken,
          refreshToken: loginResponse.data.refreshToken,
          user: { email },
        })
      );
      storeAccessToken(loginResponse.data.accessToken);
      storeRefreshToken(loginResponse.data.refreshToken);

      toast.success("✅ Logged in successfully!", {
        position: "top-center",
        autoClose: 2500,
      });
      navigate("/");
    } catch (error) {
      console.error(`${providerType} login error:`, error);
      if (error.code === "auth/account-exists-with-different-credential") {
        const email = error.customData?.email;
        const methods = await fetchSignInMethodsForEmail(auth, email);
        toast.error(
          `Email already used with ${methods.join(", ")}. Please login with that provider.`,
          { position: "top-center", autoClose: 5000 }
        );
      } else {
        toast.error(
          `🚨 ${providerType} login failed. Please ensure your account exists or register first.`,
          { position: "top-center", autoClose: 5000 }
        );
        navigate("/register");
      }
    } finally {
      setIsSocialLoading(false);
    }
  };

  return (
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
              src={LoginImage}
              alt="Login Illustration"
              className="w-full h-auto max-w-md"
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center p-6 sm:p-8 lg:p-10 bg-[#ECF2FF]">
          <h2 className="text-2xl sm:text-3xl text-center font-bold text-[#1A5276] mb-6">
            Login
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 flex flex-col items-center"
          >
            <div className="w-full sm:w-11/12">
              <label className="block text-md font-bold text-[#1A5276]">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                className="w-full p-2 border border-[#1A5276] rounded-lg mt-1 bg-white focus:ring-2 focus:ring-[#149AC5] outline-none"
                placeholder="Enter email address"
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
                {showPassword ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
              </button>
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}

              <div className="text-right mt-1">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-[#1A5276] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isSocialLoading}
              className="w-40 bg-[#154360] text-white py-2 rounded-full mt-6 hover:bg-[#149AC5] transition disabled:opacity-50 sm:w-11/12 text-center font-semibold"
            >
              {isSubmitting ? "Login..." : "Login"}
            </button>
          </form>

          <div className="mt-3 text-center w-full">
            <p className="text-lg mb-3 text-[#1A5276]">Or</p>
            <div className="flex justify-center space-x-6">
              <button
                onClick={() => !isSocialLoading && handleSocialLogin("github")}
                disabled={isSocialLoading}
                className={`flex items-center justify-center space-x-3 py-2 px-2 border border-[#1A5276] rounded-lg text-sm font-medium text-[#1A5276] bg-white hover:bg-gray-50 transition ${
                  isSocialLoading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                <FaGithub size={24} className="text-black" />
                <span>Login with GitHub</span>
              </button>

              <button
                onClick={() => !isSocialLoading && handleSocialLogin("google")}
                disabled={isSocialLoading}
                className={`flex items-center justify-center space-x-3 py-2 px-2 border border-[#1A5276] rounded-lg text-sm font-medium text-[#1A5276] bg-white hover:bg-gray-50 transition ${
                  isSocialLoading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                <FcGoogle size={24} />
                <span>Login with Google</span>
              </button>
            </div>
          </div>

          <p className="mt-4 text-lg text-center">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-[#1A5276] hover:underline"
            >
              Register
            </button>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}