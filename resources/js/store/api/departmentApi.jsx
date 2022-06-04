import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


// Define a service using a base URL and expected endpoints
export const departmentApi = createApi({
  reducerPath: "departmentApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: `/api/departments`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token)
          headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getDepartments: builder.query({
      query: () => ``,
    }),
    updateDepartment: builder.mutation({
      query: ({body,id}) => {
        return {
          url: `/${id}`,
          method: "put",
          body,
        };
      },
    }),
    deleteDepartment: builder.mutation({
      query: (id)=>{
        return {
          url: `/${id}`,
          method: "delete"
        }
      }
    }),
    addDepartment: builder.mutation({
      query: (body)=>{
        return {
          url: ``,
          method: "post",
          body
        }
      }
    }),
  }),
});
// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetDepartmentsQuery,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  useAddDepartmentMutation
} = departmentApi;
