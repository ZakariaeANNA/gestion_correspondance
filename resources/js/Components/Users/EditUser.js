import React,{useEffect, useState} from "react";
import PropTypes from 'prop-types';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { Button, IconButton ,Tooltip, TextField , CircularProgress } from "@mui/material";
import { Box } from '@mui/system';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {Save} from "@mui/icons-material";
import {Paper } from "@mui/material";
import { t } from 'i18next';
import i18next from 'i18next'
import MenuItem from '@mui/material/MenuItem';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { useSnackbar } from 'notistack';
import { useUpdateUserMutation } from "../../store/api/userApi";
import { useGetDepartmentsQuery } from "../../store/api/departmentApi";
import LoadingButton from '@mui/lab/LoadingButton';
import { useRefreshMutation } from "../../store/api/authApi";



const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
  }));
  const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;
    return (
      <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
        {children}
        {onClose ? (
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
            }}
            >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
    );
  };
  BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

const EditUser = (props) =>{
    const [open, setOpen] = useState(false);
    const [userDepartement,setUserDepartement] = useState();
    const [ departments , setDepartments ] = useState([]);
    const [roles,setRoles] = useState();
    const { data : dataDep , isLoading : isLoadingDep , error : errorDep , isError : isErrorDep , isSuccess : isSuccessDep } = useGetDepartmentsQuery("",{skip : !open,});
    const [updateUser,{data,error,isLoading,isError,isSuccess}] = useUpdateUserMutation();
    const { enqueueSnackbar } = useSnackbar();
    const [ refresh ] = useRefreshMutation();
    const handleClickOpen = () => {
        setOpen(true);
        setRoles(props.props.roles ? props.props.roles : "admin");
        setUserDepartement(props.props?.departement ? "departement" : "etablissement");
    };

    const handleClose = () => {
        setOpen(false);
    };
    
    const handleRoleChange = (event) =>{
        setRoles(event.target.value)
    }

    const handleUserDepartementChange  = (event) => {
      setUserDepartement(event.target.value)
    }
    
    const onUpdateUser = async(event)=>{
        event.preventDefault();
        const formdata = new FormData(event.currentTarget);
        const body = {
            fullnamear: formdata.get("fullnamear"),
            fullnamela: formdata.get("fullnamela"),
            doti: formdata.get("doti"),
            CIN: formdata.get("CIN"),
            email: formdata.get("email"),
            phone: formdata.get("phone"),
            roles: userDepartement === "etablissement" ? "directeur" : roles,
            idDepartement: formdata.get("idDepartement"),
            codegresa : formdata.get("codegresa")
        }
        try{
            await updateUser({body: body ,id: props.props.id}).unwrap();
            setRoles();
        }catch(error){
            if(error.status === 401){
                await refresh({ token : localStorage.getItem("token") }).unwrap().then( data => {
                    localStorage.setItem( "token" , data );
                    updateUser({body: body ,id: props.props.id});
                    setRoles();
                });
            }
        }
    }
    useEffect(()=>{
        if(isError){
            if(error.data === "edit_user/fields_required")
                enqueueSnackbar(t("credentials_empty"),  { variant: "error" });
            else if(error.data === "edit_user/user_already_exist")
                enqueueSnackbar(t("user_already_exist"),  { variant: "error" });
            else if(error.data === "edit_user/foreign_not_exist")
                enqueueSnackbar(t("foreign_not_exist"),  { variant: "error" });
        }
        if(isSuccess){
            enqueueSnackbar(t("edit_user_success"),  { variant: "success" });
            props.refetch();
        }
        if(isSuccessDep){
            setDepartments(dataDep.data);
        }
    },[data,error,dataDep]);

    return(
        <>
            <Tooltip title={t("edit_user")}>
                <IconButton aria-label="delete" size="large" onClick={handleClickOpen}> 
                    <ModeEditIcon sx={{ color: 'blue' }}/>
                </IconButton>
            </Tooltip>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                fullWidth
                maxWidth="md" 
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    {t("edit_user")}
                </BootstrapDialogTitle>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    { isLoadingDep ? (
                        <Box
                            sx={{
                                position : "absolute",
                                top : "50%",
                                right : "50%",
                                background : "transparent"
                            }}
                        >
                            <CircularProgress/>
                        </Box>
                    ):(
                        <form className="p" onSubmit={onUpdateUser}>
                            <Box>
                                <TextField defaultValue={props.props.fullnamela} name='fullnamela' sx={{ width : 1/2 , paddingInlineEnd : 1 , marginY : 1 }} label={t("namefr")} variant="outlined" required disabled={isLoading}/>
                                <TextField defaultValue={props.props.fullnamear} name='fullnamear' sx={{ width : 1/2 , paddingInlineEnd : 1 , marginY : 1 }} label={t("namear")} variant="outlined" required disabled={isLoading}/>
                                <TextField defaultValue={props.props.phone} name='phone' sx={{ width : 1/2 , paddingInlineEnd : 1 , marginY : 1 }} label={t("phone")} variant="outlined" required disabled={isLoading}/>
                                <TextField defaultValue={props.props.cin} name='CIN' sx={{ width : 1/2 , paddingInlineEnd : 1 , marginY : 1 }} label={t("cin")} variant="outlined" required disabled={isLoading}/>
                                <TextField defaultValue={props.props.email} name='email' sx={{ width : 1/2 , paddingInlineEnd : 1 , marginY : 1 }} className='inputField' label={t("email")} variant="outlined" required disabled={isLoading}/>
                                <FormControl className='inputField' sx={{ width : 1/2 , paddingInlineEnd : 1 , marginY : 1 }} required disabled={isLoading}>
                                    <InputLabel id="demo-simple-select-label">{t("departementOrestablishement")}</InputLabel>
                                    <Select
                                        value={userDepartement}
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label={t("departementOrestablishement")}
                                        inputprops={{readOnly: props.disabled}}
                                        onChange={handleUserDepartementChange}
                                        inputProps={{ readOnly: props.disabled }}
                                    >
                                        <MenuItem value={'departement'}>{t("the_department")}</MenuItem>
                                        <MenuItem value={'etablissement'}>{t("the_establishment")}</MenuItem>
                                    </Select>
                                </FormControl>
                                {userDepartement==="departement" ? (
                                    <FormControl className='inputField' sx={{ width : 1/2 , paddingInlineEnd : 1 , marginY : 1 }} required disabled={isLoading}>
                                        <InputLabel id="demo-simple-select-label">{t("role")}</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label={t("role")}
                                            value={roles}
                                            inputprops={{readOnly: props.disabled}}
                                            onChange={handleRoleChange}
                                            inputProps={{ readOnly: props.disabled }}
                                        >
                                            <MenuItem value={'admin'}>Admin</MenuItem>
                                            <MenuItem value={'chefDep'}>Chef département</MenuItem>
                                        </Select>
                                    </FormControl>
                                ):null}
                                <TextField id="outlined-basic" defaultValue={props.props.doti} name='doti' sx={{ width : 1/2 , paddingInlineEnd : 1 , marginY : 1 }} className='inputField' label={t("doti")} variant="outlined" required disabled={isLoading} inputProps={{ readOnly: props?.disabled }}/>
                                { userDepartement === "departement" ? (
                                    <FormControl className='inputField' sx={{ width : 1/2 , marginY : 1 }} required disabled={isLoading}>
                                        <InputLabel id="demo-simple-select-label">{t("department")}</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label={t("department")}
                                            inputprops={{readOnly: props.disabled}}
                                            name="idDepartement"
                                            style={{ textAlign : "start" }}
                                            inputProps={{ readOnly: props.disabled }}
                                            defaultValue={props.props?.departement?.id}
                                        >
                                        { departments.map( dep => 
                                            <MenuItem key={dep.id} value={dep.id} selected={true}>{i18next.language === "fr" ? (dep.nomLa):(dep.nomAr)}</MenuItem>
                                        )}
                                        </Select>
                                    </FormControl>
                                ) : userDepartement === "etablissement" ? (
                                    <TextField id="outlined-basic" defaultValue={props.props?.etablissement?.codegresa} name={"codegresa"} sx={{ width : 1/2 , paddingInlineEnd : 1 , marginY : 1 }} label={t("codeGresa")} variant="outlined" required disabled={isLoading} InputProps={{ readOnly: props.disabled }}/>
                                ) : null}
                            </Box>
                            <Box sx={{display:'flex',justifyContent: 'flex-end',alignItems: 'center',paddingTop:2}}>
                                { isLoading ? (
                                    <LoadingButton 
                                        loading 
                                        variant="contained"
                                    >
                                        Submit
                                    </LoadingButton>
                                ) : (
                                    <Button variant='outlined' type='submit' startIcon={<Save />} autoFocus>
                                        {t("save")}
                                    </Button>
                                )}
                            </Box>
                        </form>
                    )}
                </Paper>
            </BootstrapDialog>
        </>
    )
}
export default EditUser