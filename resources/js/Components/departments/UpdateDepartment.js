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
import { useUpdateDepartmentMutation } from "../../store/api/departmentApi";
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

const UpdateDepartment = (props) =>{
    const [open, setOpen] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [ refresh ] = useRefreshMutation();
    const [ updateDepartment , { data,error,isLoading,isError,isSuccess } ] = useUpdateDepartmentMutation();
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    
    const onUpdateDepartment = async(event)=>{
        event.preventDefault();
        const formdata = new FormData(event.currentTarget);
        const body = {
            nomLa: formdata.get("nomLa"),
            nomAr: formdata.get("nomAr"),
            type: formdata.get("type"),
            delegation: formdata.get("delegation"),
        }
        try{
            await updateDepartment({body: body ,id: props.department.id}).unwrap();
        }catch(error){
            if(error.status === 401){
                await refresh({ token : localStorage.getItem("token") }).unwrap().then( data => {
                    localStorage.setItem( "token" , data );
                    updateDepartment({body: body ,id: props.department.id});
                });
            }
        }
    }
    useEffect(()=>{
        if(isError){
            if(error.data === "edit_department/fields_required")
                enqueueSnackbar(t("credentials_empty"),  { variant: "error" });
            else if(error.data === "edit_department/department_already_exist")
                enqueueSnackbar(t("department_already_exist"),  { variant: "error" });
        }
        if(isSuccess){
            enqueueSnackbar(t("edit_department_success"),  { variant: "success" });
            props.refetch();
        }
    },[data,error]);

    return(
        <>
            <Tooltip title={t("edit_dep")}>
                <IconButton aria-label="delete" size="large" onClick={handleClickOpen}> 
                    <ModeEditIcon sx={{ color: 'blue' }}/>
                </IconButton>
            </Tooltip>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                fullWidth
                maxWidth="sm" 
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    {t("edit_dep")}
                </BootstrapDialogTitle>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <form className="p" onSubmit={onUpdateDepartment}>
                        <Box>
                            <TextField defaultValue={props.department.nomLa} fullWidth name='nomLa' margin="normal" label={t("nomdepla")} variant="outlined" required disabled={isLoading}/>
                            <TextField defaultValue={props.department.nomAr} fullWidth name='nomAr' margin="normal" label={t("nomdepar")} variant="outlined" required disabled={isLoading}/>
                            <TextField defaultValue={props.department.type} fullWidth name='type' margin="normal" label={t("type")} variant="outlined" required disabled={isLoading}/>
                            <TextField defaultValue={props.department.delegation} fullWidth name='delegation' margin="normal" label={t("delegation")} variant="outlined" required disabled={isLoading}/>
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
export default UpdateDepartment;