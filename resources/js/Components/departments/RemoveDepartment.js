import React,{useEffect, useState} from "react";
import PropTypes from 'prop-types';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { Button, IconButton ,Tooltip, TextField , CircularProgress , DialogContent } from "@mui/material";
import { t } from 'i18next';
import i18next from 'i18next'
import { Delete } from "@mui/icons-material";
import { useSnackbar } from 'notistack';
import { useDeleteDepartmentMutation } from "../../store/api/departmentApi";
import { Typography } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';



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

function RemoveDepartment(props){
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
      setOpen(false);
  };
  const [deleteDepartment, {data,isLoading,error,isError,isSuccess}] = useDeleteDepartmentMutation();

  const handleResetClick = () =>{
    deleteDepartment(props.department.id)
    setOpen(false);
  }

  useEffect(()=>{
    if(isError)
      enqueueSnackbar(t("department_delete_error"),  { variant: "error" });
    if(isSuccess){
      enqueueSnackbar(t("department_delete_success"),  { variant: "success" });
      props.refetch();
    }
  },[data,error]);

  return(
      <>
        <Tooltip title={t("deleteUser")}>
          <IconButton aria-label="delete" size="large" onClick={handleClickOpen}> 
                <Delete sx={{color: 'red'}}/>
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
            {t("deleteUser")}
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <Typography>
               {t("confirm_delete_message")} <strong>{i18next.language==="fr" ? props.department.nomLa : props.department.nomAr}</strong>
            </Typography>
          </DialogContent>
          <DialogActions> 
            <Button variant="outlined" color='error' type='submit' startIcon={<Delete />} autoFocus onClick={handleResetClick}>
              {t("delete")}
            </Button>
          </DialogActions>
        </BootstrapDialog>
      </>
  );
}

export default RemoveDepartment