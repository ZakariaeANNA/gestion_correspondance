import { Box, Button, Typography } from '@mui/material'
import { Save } from '@mui/icons-material'
import { TextField,Paper } from '@mui/material'
import React, { useEffect } from 'react'
import { t } from 'i18next';
import { useSelector} from 'react-redux';
import {useChangePasswordMutation } from "../../store/api/userApi";
import { useSnackbar } from 'notistack';
import LoadingButton from '@mui/lab/LoadingButton';


const ChangePassword =  () =>{
    const { enqueueSnackbar } = useSnackbar();
    const auth = useSelector( state => state.auth.user );
    const [onPasswordChange,{ data, isLoading, error, isError, isSuccess}] = useChangePasswordMutation()
    const handleSaveButton = (event) =>{
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        if(formData.get("newpassword").length <= 8){
            enqueueSnackbar( t("password_length_error"),  { variant: "error" });
        }else{
            if(formData.get("newpassword") !== formData.get("retypepassword")){
                enqueueSnackbar(t("password_match_error"),  { variant: "error" });
            }else{
                onPasswordChange({doti:auth.doti,password: formData.get("newpassword") ,currentPassword: formData.get("oldPassword")});
                event.target.reset();
            }
        }
    }
    useEffect(()=>{
        if(isError){
            enqueueSnackbar(t("password_incorrect"),  { variant: "error" });
        }
        if(isSuccess){
            enqueueSnackbar(t("password_changed"),  { variant: "success" });
        }
    },[data,error])
    return(
        <React.Fragment>
            <Box sx={{display: 'flex',flexDirection: 'row',justifyContent: 'flex-start',paddingBottom:2,alignItems:"center"}}>
                <Typography variant='h6' sx={{fontSize:25 , fontWeight:"bold" }}>{t("change_password")}</Typography>
            </Box>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column',justifyContent: 'space-between' }}>
                    <Box>
                        <form onSubmit={handleSaveButton}>
                            <TextField type={"password"} sx={{marginY: 1}} name="oldPassword" fullWidth label={t("old_password")} variant="outlined" required disabled={isLoading}/>
                            <TextField type={"password"} sx={{marginY: 1}} name="newpassword" fullWidth label={t("new_password")} variant="outlined" required disabled={isLoading}/>
                            <TextField type={"password"} sx={{marginY: 1}} name="retypepassword" fullWidth label={t("retype_password")} variant="outlined" required disabled={isLoading}/>
                            <Box sx={{display:'flex',justifyContent: 'flex-end'}}>
                                { isLoading ? (
                                    <LoadingButton 
                                        loading 
                                        variant="contained"
                                    >
                                        Submit
                                    </LoadingButton>
                                ) : (
                                    <Button variant='contained' type="submit" startIcon={<Save />} >
                                        {t("save")}
                                    </Button>
                                )}
                            </Box>
                        </form>
                    </Box>
                    <Box sx={{display: 'flex',justifyContent: 'center',alignContent: 'center',p:3}}>
                        <Typography style={{color: "#FF0033"}}>
                            {t("password_condition")}
                        </Typography>
                    </Box>
            </Paper>
        </React.Fragment>
    )
}

export default ChangePassword