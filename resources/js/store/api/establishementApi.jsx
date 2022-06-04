import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


// Define a service using a base URL and expected endpoints
export const establishementApi = createApi({
  reducerPath: "establishementApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: `/api/etablishments`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token)
          headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
 }),
 endpoints: (builder) => ({
  getEstablishments: builder.query({
    query: () =>''
  }),
  updateEstablishment: builder.mutation({
    query: ({body,id}) => {
      return {
        url: `/${id}`,
        method: "put",
        body,
      };
    },
  }),
  deleteEstablishment: builder.mutation({
    query: (id)=>{
      return {
        url: `/${id}`,
        method: "delete"
      }
    }
  }),
  addEstablishment: builder.mutation({
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
  useGetEstablishmentsQuery,
  useUpdateEstablishmentMutation,
  useDeleteEstablishmentMutation,
  useAddEstablishmentMutation
} = establishementApi;
