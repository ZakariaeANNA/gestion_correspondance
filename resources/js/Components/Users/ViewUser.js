import React from "react"
import {Visibility} from "@mui/icons-material";
import {DialogContent, IconButton, Tooltip } from "@mui/material";
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { t } from 'i18next';
import i18next from 'i18next'


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
export default function ViewUser({params}){
    const [open, setOpen] = React.useState(false);
  
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    return(
      <div>
          <Tooltip title={t("viewUser")}>
            <IconButton aria-label="delete" size="large" onClick={handleClickOpen}> 
              <Visibility sx={{ color: '#7BE929' }} color="red" />
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
            {t("viewUser")}
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <TableContainer>
              <Table sx={{ minWidth: '60%' }} aria-label="simple table">
                  <TableBody>
                      <TableRow>
                          <TableCell style={{ fontWeight : "bold" }}>{t("name")}</TableCell>
                          <TableCell component="th" scope="row">
                              {i18next.language==='fr'?params.fullnamela : params.fullnamear}
                          </TableCell>
                      </TableRow>
                      <TableRow>
                          <TableCell style={{ fontWeight : "bold" }}>{t("cin")}</TableCell>
                          <TableCell component="th" scope="row">
                              {params.cin}
                          </TableCell>
                      </TableRow>
                      <TableRow>
                          <TableCell style={{ fontWeight : "bold" }}>{t("doti")}</TableCell>
                          <TableCell component="th" scope="row">
                              {params.doti}
                          </TableCell>
                      </TableRow>
                      <TableRow>
                          <TableCell style={{ fontWeight : "bold" }}>{t("email")}</TableCell>
                          <TableCell component="th" scope="row">
                            {params.email}
                          </TableCell>
                      </TableRow>
                      <TableRow>
                          <TableCell style={{ fontWeight : "bold" }}>{t("phone")}</TableCell>
                          <TableCell component="th" scope="row">
                            {params.phone}
                          </TableCell>
                      </TableRow>
                      <TableRow>
                          <TableCell style={{ fontWeight : "bold" }}>{t("establishementName")}</TableCell>
                          <TableCell component="th" scope="row">
                              {i18next.language==='fr'?params.etablissement?.nomla:params.etablissement?.nomar}
                              {i18next.language==='fr'?params.departement?.nomLa : params.departement?.nomAr}
                          </TableCell>
                      </TableRow>
                      <TableRow>
                          <TableCell style={{ fontWeight : "bold" }}>{t("establishementType")}</TableCell>
                          <TableCell component="th" scope="row">
                              {t(params.etablissement?.type)}
                              {params.departement?.type}                              
                          </TableCell>
                      </TableRow>
                      <TableRow>
                          <TableCell style={{ fontWeight : "bold" }}>{t("delegation")}</TableCell>
                          <TableCell component="th" scope="row">
                              {params.departement?.delegation || params.etablissement?.delegation}
                          </TableCell>
                      </TableRow>
                  </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
        </BootstrapDialog>
      </div>
    )
  }