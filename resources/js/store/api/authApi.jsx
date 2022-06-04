import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


// Define a service using a base URL and expected endpoints
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: `/api/users` }),
  endpoints: (builder) => ({
    signinUser: builder.mutation({
      query: (body) => {
        return {
          url: "/login",
          method: "post",
          body,
        };
      },
    }),
    logout: builder.mutation({
      query: (body) => {
        return {
          url: "/logout",
          method: "post",
          body,
        };
      },
    }),
    refresh: builder.mutation({
      query : (body) => {
        return {
          url : "/refresh",
          method : "post" ,
          headers: {
            authorization : `Bearer ${localStorage.getItem("token")}`
          }
        }
      }
    })
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useSigninUserMutation,
  useLogoutMutation,
  useRefreshMutation
} = authApi;
