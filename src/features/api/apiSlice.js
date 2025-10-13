import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getDecryptedAccessToken } from "../../utils/tokenUtils";

// Custom fetchBaseQuery to handle the base URL and Authorization header
const baseQueryCustom = fetchBaseQuery({
  // Access the environment variable (VITE_BASE_URL)
  baseUrl: import.meta.env.VITE_BASE_URL,
  prepareHeaders: (headers) => {
    const accessToken = getDecryptedAccessToken();

    if (accessToken) {
      // Assuming getDecryptedAccessToken returns the full "Bearer <token>" string
      headers.set("Authorization", accessToken);
    }

    return headers;
  },
});

// Define the root API service
export const apiSlice = createApi({
  reducerPath: "apiSlice",
  baseQuery: baseQueryCustom,
  // Define tags for caching (used by jobSlice)
  tagTypes: ["Job"], 
  endpoints: (build) => ({
    // Empty base endpoints - concrete endpoints are defined in jobSlice
  }),
});