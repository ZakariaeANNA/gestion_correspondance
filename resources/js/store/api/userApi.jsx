import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


// Define a service using a base URL and expected endpoints
export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: `/api/users`,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token)
        headers.set('authorization', `Bearer ${token}`);
    return headers;
},
}),
endpoints: (builder) => ({
    addUser: builder.mutation({
      query: (body) => {
      return {
        url: "",
        method: "post",
        body,
      };
    },
    }),
    getAllUsers: builder.query({
      query: () => "",
    }),
    changePassword: builder.mutation({
      query: (data)=>{
        return{
          url: `/changepassword/${data.doti}/${data.password}/${data.currentPassword}`,
          method: "put"
        }
      }
    }),
    updateUser: builder.mutation({
      query: ({body,id})=>{
        return{
          url: `/${id}`,
          method: "put",
          body,
        }
      }
    }),
    resetPassword: builder.mutation({
      query: (data)=>{
        return {
          url: `/resetpassword/${data.doti}/${data.cin}`,
          method: "post"
        }
      }
    }),
    deleteUser: builder.mutation({
      query: (id)=>{
        return {
          url: `/${id}`,
          method: "delete"
        }
      }
    }),
    getCurrentUser: builder.query({
      query: (id)=>{
        return{
          url: `/${id}`,
          method: 'get'
        }
      }
    }),
    getUserByIdDepartement: builder.mutation({
      query: (idDep)=>{
        return{
          url: `/getuserbyiddpartement/${idDep}`,
          method: 'get'
        }
      }
    }),
    getUserByCodeGresa: builder.mutation({
      query: (codegresa)=>{
        return{
          url: `/getuserbycodegresa/${codegresa}`,
          method: 'get'
        }
      }
    }),
    getUnreadNotification: builder.query({
      query: ()=>`/notifications`
    }),
    deleteNotification: builder.mutation({
      query: (id)=>{
        return {
          url: `/notifications/${id}`,
          method: 'post'
        }
      }
    }),
    clearNotifications:  builder.mutation({
      query: () => {
        return {
          url: "/notifications/delete",
          method: 'delete'
        }
      }
    })
  }),
});
// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useClearNotificationsMutation,
  useAddUserMutation,
  useGetAllUsersQuery,
  useChangePasswordMutation,
  useUpdateUserMutation,
  useResetPasswordMutation,
  useDeleteUserMutation,
  useGetCurrentUserQuery,
  useGetUserByIdDepartementMutation,
  useGetUserByCodeGresaMutation,
  useGetUnreadNotificationQuery,
  useDeleteNotificationMutation
} = userApi;
