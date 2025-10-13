import { apiSlice } from "../api/apiSlice";

const jobApi = apiSlice.injectEndpoints({
    // Use tagTypes from the base slice
    // tagTypes: ["Job"], // NOTE: Redundant if already defined in apiSlice, but harmless.
    endpoints: (build) => ({
        
        // 1. Endpoint for fetching general, paginated job list (accepts dynamic parameters)
        getJobs: build.query({
            // Set default parameters for the query
            query: (params = { pageNumber: 0, pageSize: 20, sortBy: 'RANDOM' }) => ({
                // RTK Query automatically converts the params object into a query string
                url: "/jobs",
                params: params,
                method: "GET",
            }),
            // Provides tags for the entire list and each individual job UUID
            providesTags: (result) =>
                result?.data?.content
                    ? [
                          // Tag each individual job by UUID
                          ...result.data.content.map(({ uuid }) => ({ type: "Job", id: uuid })),
                          // Tag the list itself
                          { type: "Job", id: "LIST" },
                      ]
                    : [{ type: "Job", id: "LIST" }],
        }),
        
        // 2. Dedicated endpoint for the latest 3 jobs (used for the "Latest Jobs" section)
        getLatestJobs: build.query({
            query: () => ({
                // Hardcoding parameters to get the latest 3 jobs
                url: "/jobs?pageNumber=0&pageSize=3&sortBy=createdDate&sortDirection=desc",
                method: "GET",
            }),
            // Provides tags to the list for easy invalidation if a new job is created
            providesTags: [{ type: "Job", id: "LIST" }],
        }),
    }),
});

// Export the generated hooks for use in components
export const { useGetJobsQuery, useGetLatestJobsQuery } = jobApi;