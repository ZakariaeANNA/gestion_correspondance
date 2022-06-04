import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


// Define a service using a base URL and expected endpoints
export const exportationApi = createApi({
  reducerPath: "exportationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `/api/correspondences`,
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("token");
        if (token)
            headers.set('authorization', `Bearer ${token}`);
        return headers;
    },
  }),
  endpoints: (builder) => ({
    addExportations: builder.mutation({
      query: (body) => {
        return {
          url: "",
          method: "post",
          body,
        };
      },
    }),
    deleteExportation: builder.mutation({
      query: (id)=>{
        return{
          url:`/${id}`,
          method: "delete"
        }
      }
    }),
    getExportationBycodeGRESA: builder.query({
        query: ({doti , page : pageDefault = 1}) => `/sender/${doti}?page=${pageDefault}`,
    }),
    getUserLatestExportRecords: builder.query({
      query: ()=> '/exportrecords'
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetUserLatestExportRecordsQuery,
  useAddExportationsMutation,
  useGetExportationBycodeGRESAQuery,
  useDeleteExportationMutation,
} = exportationApi;
