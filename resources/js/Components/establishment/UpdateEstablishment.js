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
import { useUpdateEstablishmentMutation } from "../../store/api/establishementApi";
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

const UpdateEstablishment = (props) =>{
    const [open, setOpen] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [ refresh ] = useRefreshMutation();
    const [ updateEstablishment , { data,error,isLoading,isError,isSuccess } ] = useUpdateEstablishmentMutation();
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    
    const onUpdateUser = async(event)=>{
        event.preventDefault();
        const formdata = new FormData(event.currentTarget);
        const body = {
            codegresa: formdata.get("codegresa"),
            nomla: formdata.get("nomla"),
            nomar: formdata.get("nomar"),
            type: formdata.get("type"),
            delegation: formdata.get("delegation"),
        }
        try{
            await updateEstablishment({body: body ,id: props.establishment.id}).unwrap();
        }catch(error){
            if(error.status === 401){
                await refresh({ token : localStorage.getItem("token") }).unwrap().then( data => {
                    localStorage.setItem( "token" , data );
                    updateEstablishment({body: body ,id: props.establishment.id});
                });
            }
        }
    }
    useEffect(()=>{
        if(isError){
            if(error.data === "edit_establishment/fields_required")
                enqueueSnackbar(t("credentials_empty"),  { variant: "error" });
            else if(error.data === "edit_establishment/establishment_already_exist")
                enqueueSnackbar(t("establishment_already_exist"),  { variant: "error" });
        }
        if(isSuccess){
            enqueueSnackbar(t("edit_establishment_success"),  { variant: "success" });
            props.refetch();
        }
    },[data,error]);

    return(
        <>
            <Tooltip title={t("edit_eta")}>
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
                    {t("edit_eta")}
                </BootstrapDialogTitle>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <form className="p" onSubmit={onUpdateUser}>
                        <Box>
                            <TextField fullWidth defaultValue={props.establishment.codegresa} name='codegresa' margin="normal" label={t("codegresa")} variant="outlined" required disabled={isLoading}/>
                            <TextField defaultValue={props.establishment.nomla} fullWidth name='nomla' margin="normal" label={t("nomdepla")} variant="outlined" required disabled={isLoading}/>
                            <TextField defaultValue={props.establishment.nomar} fullWidth name='nomar' margin="normal" label={t("nomdepar")} variant="outlined" required disabled={isLoading}/>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="demo-simple-select-label">{t("type")}</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label={t("type")}
                                    name="type"
                                    required
                                    defaultValue={props.establishment.type}
                                    disabled={isLoading}
                                >
                                    <MenuItem value={"primaire"}>{t("primaire")}</MenuItem>
                                    <MenuItem value={"college"}>{t("college")}</MenuItem>
                                    <MenuItem value={"lycee"}>{t("lycee")}</MenuItem>
                                </Select>
                            </FormControl>                            
                            <TextField defaultValue={props.establishment.delegation} fullWidth name='delegation' margin="normal" label={t("delegation")} variant="outlined" required disabled={isLoading}/>
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
export default UpdateEstablishment;