import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


// Define a service using a base URL and expected endpoints
export const feedbackApi = createApi({
  reducerPath: "feedbackApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `/api`,
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("token");
        if (token)
            headers.set('authorization', `Bearer ${token}`);
        return headers;
    },
  }),
  endpoints: (builder) => ({
    addFeedback: builder.mutation({
      query: (body) => {
        return {
          url: "/feedbacks",
          method: "post",
          body,
        };
      },
    }),
    confirmMailBySender: builder.mutation({
      query: (data) => {
        return {
          url: `/correspondences/confirm/sender/${data.idReceiver}/${data.mail_id}/${data.state}`,
          method: "put",
        };
      },
    }),
    confirmMailByReceiver: builder.mutation({
      query: (data) => {
        return {
          url: `/correspondences/confirm/receiver/${data.idReceiver}/${data.mail_id}/${data.state}`,
          method: "put",
        };
      },
    }),
    checkUserInMail : builder.query({
      query : (data) => `/correspondences/checkmail/${data.id}/${data.doti}`,
    }),
    getReceiverByMail : builder.query({
      query : (data) => `/correspondences/receivers/${data.mail_id}`,
    }),
    getReceiverByMailIdAndDoti : builder.query({
      query : (data) => `/correspondences/senders/${data.mail_id}/${data.receiver}`,
    }),
    updateFeedbackStatus: builder.mutation({
      query: (data) => {
        return {
          url: `/feedbacks/${data.idReceiver}/${data.mail_id}`,
          method: "put",
        };
      },
    }),
    getFeedbackByidAndBysender: builder.query({
      query: (data) => `/feedbacks/sent/${data.id}/${data.user}`,
    }),
    getFeedbackByidAndByreceiver: builder.mutation({
        query: (data) => {
          return {
            url: `/feedbacks/received/${data.id}/${data.user}`,
            method: "get"
          };
        },
    }),
    getFeedbackBymailAndBysenderAndByreceiver: builder.mutation({
      query: (data) => {
        return {
          url: `/feedbacks/${data.mail}/${data.sender}/${data.receiver}`,
          method: "get"
        };
      },
    }),
    getFeedbackBymailAndBysenderAndByreceiverclone: builder.query({
      query: (data) => `/feedbacks/${data.mail}/${data.sender}/${data.receiver}`,
    }),
    getUserLatestFeedBack: builder.query({
      query: () => '/feedbacks/getlatestfeedbacks'
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetUserLatestFeedBackQuery,
  useAddFeedbackMutation,
  useGetFeedbackByidAndByreceiverMutation,
  useGetFeedbackByidAndBysenderQuery,
  useGetFeedbackBymailAndBysenderAndByreceiverMutation,
  useGetFeedbackBymailAndBysenderAndByreceivercloneQuery,
  useConfirmMailByReceiverMutation,
  useConfirmMailBySenderMutation,
  useUpdateFeedbackStatusMutation,
  useGetReceiverByMailQuery,
  useGetSenderByMailIdQuery,
  useCheckUserInMailQuery,
  useGetReceiverByMailIdAndDotiQuery
} = feedbackApi;
