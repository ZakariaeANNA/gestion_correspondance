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
import { useAddDepartmentMutation } from "../../store/api/departmentApi";
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

const AddDepartment = (props) =>{
    const [open, setOpen] = useState(false);
    const [addDepartment,{data,error,isLoading,isError,isSuccess}] = useAddDepartmentMutation();
    const { enqueueSnackbar } = useSnackbar();
    const [ refresh ] = useRefreshMutation();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    
    const onAddDepartment = async(event)=>{
        event.preventDefault();
        const formdata = new FormData(event.currentTarget);
        const body = {
          nomLa: formdata.get("nomLa"),
          nomAr: formdata.get("nomAr"),
          type: formdata.get("type"),
          delegation: formdata.get("delegation"),
        }
        try{
            await addDepartment(body).unwrap();
        }catch(error){
            if(error.status === 401){
                await refresh({ token : localStorage.getItem("token") }).unwrap().then( data => {
                    localStorage.setItem( "token" , data );
                    addDepartment(body);
                });
            }
        }
    }
    useEffect(()=>{
        if(isError){
            if(error.data === "add_department/fields_required")
                enqueueSnackbar(t("credentials_empty"),  { variant: "error" });
            else if(error.data === "add_department/department_already_exist")
                enqueueSnackbar(t("department_already_exist"),  { variant: "error" });
            else if(error.data === "add_department_file/fields_required")
                enqueueSnackbar(t("credentials_empty_file"),  { variant: "error" });
            else if (error.data === "add_department_file/already_exist")
                enqueueSnackbar(t("department_file_already_exist"),  { variant: "error" });
        }
        if(isSuccess){
            enqueueSnackbar(t("add_department_success"),  { variant: "success" });
            props.refetch();
        }
    },[data,error]);

    return(
        <>
            <Button variant="outlined" onClick={handleClickOpen} fullWidth>
              {t("addDep")}
            </Button>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                fullWidth
                maxWidth="sm" 
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    {t("addDep")}
                </BootstrapDialogTitle>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <form className="p" onSubmit={onAddDepartment}>
                        <Box>
                            <TextField fullWidth name='nomLa' margin="normal" label={t("nomdepla")} variant="outlined" required disabled={isLoading}/>
                            <TextField fullWidth name='nomAr' margin="normal" label={t("nomdepar")} variant="outlined" required disabled={isLoading}/>
                            <TextField fullWidth name='type' margin="normal" label={t("type")} variant="outlined" required disabled={isLoading}/>
                            <TextField fullWidth name='delegation' margin="normal" label={t("delegation")} variant="outlined" required disabled={isLoading}/>
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
                </Paper>
            </BootstrapDialog>
        </>
    )
}
export default AddDepartment