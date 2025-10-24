import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  getDecryptedAccessToken,
  getDecryptedRefreshToken,
  storeAccessToken,
  storeRefreshToken,
  clearTokens,
} from "../../utils/tokenUtils";
import { setCredentials, clearCredentials } from "../auth/authSlide";

// Define public endpoints that do not require Authorization header
const PUBLIC_ENDPOINTS = [
  "login",
  "register",
  "getAllJobs",
  "getPaginatedJobs",
  "getLatestJobs",
  "getJobById",
  "getPositions",
  "getSkills",
];

const baseQueryCustom = fetchBaseQuery({
  // Access the environment variable (VITE_BASE_URL)
  baseUrl: import.meta.env.VITE_BASE_URL,
  prepareHeaders: (headers, { endpoint }) => {
    if (!PUBLIC_ENDPOINTS.includes(endpoint)) {
      const accessToken = getDecryptedAccessToken();
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
    }
    // Do NOT set Content-Type for uploadMedia; let the browser handle multipart/form-data with boundary
    if (endpoint !== "uploadMedia") {
      headers.set("content-type", "application/json");
    }
    console.log(
      `Preparing headers for endpoint: ${endpoint}`,
      headers.get("Authorization"),
      headers.get("content-type")
    );
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQueryCustom(args, api, extraOptions);

  if (
    result.error?.status === 401 &&
    !PUBLIC_ENDPOINTS.includes(api.endpoint)
  ) {
    console.log("Attempting to refresh token...");
    const refreshToken = getDecryptedRefreshToken();
    if (refreshToken) {
      try {
        const refreshResult = await baseQueryCustom(
          {
            url: "/auth/get-new-token",
            method: "POST",
            body: { refreshToken },
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          console.log("Refresh token success:", refreshResult.data);
          const { accessToken, refreshToken: newRefreshToken } =
            refreshResult.data.data;
          storeAccessToken(accessToken);
          storeRefreshToken(newRefreshToken);
          api.dispatch(
            setCredentials({ accessToken, refreshToken: newRefreshToken })
          );
          result = await baseQueryCustom(args, api, extraOptions);
        } else {
          console.error("Refresh token failed:", refreshResult.error);
          api.dispatch(clearCredentials());
          clearTokens();
        }
      } catch (error) {
        console.error("Refresh token error:", error);
        api.dispatch(clearCredentials());
        clearTokens();
      }
    } else {
      console.error("No refresh token available");
      api.dispatch(clearCredentials());
      clearTokens();
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "apiSlice",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Positions", "Skills", "CV"],
  endpoints: (build) => ({
    login: build.mutation({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
    register: build.mutation({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),
    logout: build.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    getUser: build.query({
      query: () => ({
        url: "/users/me",
        method: "GET",
      }),
      transformResponse: (response) => response.data,
      providesTags: ["User"],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("Fetched user data:", data);
          dispatch(
            setCredentials({ user: { name: data.name, email: data.email } })
          );
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      },
    }),
    refreshToken: build.mutation({
      query: () => ({
        url: "/auth/get-new-token",
        method: "POST",
        body: { refreshToken: getDecryptedRefreshToken() },
      }),
    }),
    getPositions: build.query({
      query: () => ({
        url: "/positions",
        method: "GET",
      }),
      transformResponse: (response) => response.data,
      providesTags: ["Positions"],
    }),
    getSkills: build.query({
      query: () => ({
        url: "/skills",
        method: "GET",
      }),
      transformResponse: (response) => response.data,
      providesTags: ["Skills"],
    }),
    updateUser: build.mutation({
      query: ({ userId, body }) => ({
        url: `/users/update/${userId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    uploadMedia: build.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("files", file);
        return {
          url: "/medias/upload",
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (response) => response.data[0], // Return first file's data
    }),
    createCV: build.mutation({
      query: (body) => ({
        url: "/cvs",
        method: "POST",
        body,
      }),
      invalidatesTags: ["CV"],
    }),
    getUserCVs: build.query({
      query: (userId) => ({
        url: `/cvs/user/${userId}?pageNumber=0&pageSize=5`,
        method: "GET",
      }),
      transformResponse: (response) => {
        const cvs = response.data.content || [];
        return {
          content: cvs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)).slice(0, 3),
        };
      },
      providesTags: ["CV"],
    }),
    getLatestUserCV: build.query({
      query: (userId) => ({
        url: `/cvs/user/${userId}?pageNumber=0&pageSize=1`,
        method: "GET",
      }),
      transformResponse: (response) => {
        const cvs = response.data.content || [];
        return cvs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))[0] || null;
      },
      providesTags: ["CV"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetUserQuery,
  useRefreshTokenMutation,
  useGetPositionsQuery,
  useGetSkillsQuery,
  useUpdateUserMutation,
  useUploadMediaMutation,
  useCreateCVMutation,
  useGetUserCVsQuery,
  useGetLatestUserCVQuery,
} = apiSlice;