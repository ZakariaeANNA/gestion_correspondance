import { createSlice } from '@reduxjs/toolkit'
import { isExpired, decodeToken } from "react-jwt";


const initialState = { 
    user : {}
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
  },
  extraReducers: function(builder){
    builder.addCase("checkLogin" , (state,action)=>{
      const token = localStorage.getItem("token");
      if(!token){
        action.history.push(action.route);
      }
      if(token && isExpired(token)){
        localStorage.clear("token");
        action.history.push({pathname: action.route , appState: { session : true } });
      }else{
        state.user = decodeToken(token);
      }
      return state;
    });
    builder.addCase("logout" , (state,action)=>{
      localStorage.removeItem("token");
      state.user = {};
      action.history.push(action.route);
      return state;
    });
    builder.addCase("logoutTimeOut" , (state,action)=>{
      localStorage.removeItem("token");
      state.user = {};
      action.history.push({pathname: action.route , appState: { session : true } });
      return state;
    });
  }
})

export const { checkLogin , logout , logoutTimeOut } = authSlice.actions
export default authSlice.reducer