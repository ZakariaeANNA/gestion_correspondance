import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./state/authSlice";
import { authApi } from "./api/authApi";
import { exportationApi } from "./api/exportationApi";
import { importationApi } from "./api/importationApi";
import { feedbackApi } from "./api/feedbackApi";
import { setupListeners } from '@reduxjs/toolkit/query';
import { userApi } from "./api/userApi";
import { departmentApi } from "./api/departmentApi";
import { establishementApi } from "./api/establishementApi";




export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [exportationApi.reducerPath]: exportationApi.reducer,
    [importationApi.reducerPath]: importationApi.reducer,
    [feedbackApi.reducerPath]: feedbackApi.reducer,
    [feedbackApi.reducerPath]: feedbackApi.reducer,
    [establishementApi.reducerPath]: establishementApi.reducer,
    [departmentApi.reducerPath]: departmentApi.reducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(authApi.middleware,userApi.middleware,exportationApi.middleware,importationApi.middleware,feedbackApi.middleware,departmentApi.middleware,establishementApi.middleware),
  });

setupListeners(store.dispatch);
