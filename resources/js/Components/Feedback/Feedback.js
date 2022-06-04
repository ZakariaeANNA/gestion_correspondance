import React,{ useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import FeedbackExport from './FeedbackExport';
import FeedbackImport from './FeedbackImport';
import { useCheckUserInMailQuery } from "../../store/api/feedbackApi";
import { CircularProgress , Box  } from "@mui/material";
import { decodeToken } from "react-jwt";

  
export default function Feedback(){
    const token = localStorage.getItem("token");
    const user = decodeToken(token);
    const dispatch = useDispatch();
    const history = useHistory();
    const { idemail } = useParams();
    const previousRoute = localStorage.getItem("path");
    const { isLoading , isError } = useCheckUserInMailQuery({ id : idemail , doti : user.doti });
    
    useEffect(()=>{
        dispatch({ type : "checkLogin" , history : history , route : "/auth/"});
        if(isError){
            history.push("/403");
        }
    },[isError]);

    if( isLoading ){
        return (
            <Box
                sx={{
                    position : "absolute",
                    top : "50%",
                    right : "50%"
                }}
            >
                <CircularProgress/>
            </Box>
        );
    }

    if(previousRoute === "export"){
        return(
            <FeedbackExport idemail={idemail} auth={user} />
        )
    }else{
        return (
            <FeedbackImport idemail={idemail} auth={user}/>
        )
    }
}