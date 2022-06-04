import React from 'react'
import { t } from 'i18next';
import {FileIcon,defaultStyles} from 'react-file-icon';
import { Typography } from '@mui/material';
import {DialogContent, IconButton, Tooltip , TextField , Button , Box } from "@mui/material";
import {Visibility } from '@mui/icons-material'; 
import moment from 'moment';
import PropTypes from 'prop-types';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import i18next from 'i18next'
import ModalImage from "react-modal-image";


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
export default function ViewImportation({params}){
  
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
      setOpen(true);
    };
    const date = moment(params.mail.created_at).format('DD-MM-YYYY HH:mm');
    const achevelentDate = moment(params.mail.achevementdate).format('DD-MM-YYYY');
    const handleClose = () => {
        setOpen(false);
    };
    return(
        <div>
            <Tooltip title={t("see_exportation")}>
                <IconButton aria-label="delete" size="large" onClick={handleClickOpen}> 
                    <Visibility sx={{ color: '#7BE929'}} color="red" />
                </IconButton>
            </Tooltip>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                fullWidth
                maxWidth="lg"
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    {t("see_exportation")}
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <TextField sx={{ width : 1/4 , marginY : 1 , paddingInlineEnd : 1 }} id="outlined-basic" fullWidth label={t("correspondance_number")} variant="filled" rows={4} value={params.mail.number} inputProps={{ readOnly: true }}/>
                    <TextField sx={{ width : 1/4 , marginY : 1 , paddingInlineEnd : 1 }} id="outlined-basic" fullWidth label={t("sender")} variant="filled" value={i18next.language === "fr" ? (`${params.mail.sender?.departement ? params.mail.sender?.departement.nomLa : params.mail.sender?.etablissement.nomla}(${params.mail.sender.fullnamela})`) : (`${params.mail.sender?.departement ? params.mail.sender?.departement.nomAr : params.mail.sender?.etablissement.nomar}(${params.mail.sender.fullnamear})`)} inputProps={{ readOnly: true }}/>                                      
                    <TextField sx={{ width : 1/4 , marginY : 1 , paddingInlineEnd : 1 }} id="outlined-basic" fullWidth multiline label={t("sending_date")} variant="filled" value={date} inputProps={{ readOnly: true }}/>
                    <TextField sx={{ width : 1/4 , marginY : 1 }} id="outlined-basic" fullWidth label={t("achevement_date")} variant="filled" value={achevelentDate} inputProps={{ readOnly: true }}/>
                    <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth multiline label={t("subject_message")} variant="filled" value={params.mail.title} inputProps={{ readOnly: true }}/>
                    {params.mail.message!==null && <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth multiline label={t("message")} variant="filled" rows={4} value={params.mail.message} inputProps={{ readOnly: true }}/>}
                    {params.mail.concerned!==null && <TextField sx={{ marginY : 1 , paddingInlineEnd : 1 }} id="outlined-basic" fullWidth multiline rows={2} label={t("concerned")} variant="filled" value={params.mail.concerned} inputProps={{ readOnly: true }}/>}
                    {params.mail.notes!==null && <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth multiline rows={2} label={t("notes")} variant="filled" value={params.mail.notes} inputProps={{ readOnly: true }}/>}
                    {params.mail.references!==null &&<TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth multiline label={t("references")}variant="filled" rows={4} value={params.mail.references} inputProps={{ readOnly: true }}/>}
                    {["png","jpg","jpeg"].includes(params.mail.type) ? (
                        <Button variant="text" color="inherit" href="" fullWidth sx={{ p: 2, display: 'flex', flexDirection : "row" , justifyContent: 'flex-start' , marginY : 2 , backgroundColor : "#E8E8E8",textTransform: 'none'}}>
                            <Box sx={{width:'4em',height: '4em',display:'flex',justifyContent: 'flex-start',alignItems: 'center',marginInlineEnd:2 }}>
                                <ModalImage
                                    className="modal-image"
                                    small={`/api/`+params.mail.attachement+'/'+params.mail.filename}
                                    large={`/api/`+params.mail.attachement+'/'+params.mail.filename}
                                    alt={params.mail.filename}
                                />
                            </Box>
                            <Box sx={{ textAlign : "start" }}>
                                <Typography sx={{textTransform: 'uppercase'}}>{params.mail.type}</Typography>
                                <Typography style={{marginTop: 10}} dir="ltr">{params.mail.filename}</Typography>
                            </Box>
                        </Button>
                    ):(
                        <Button variant="text" href={`/api/`+params.mail.attachement+'/'+params.mail.filename} sx={{ p: 2, display: 'flex', flexDirection : "row" , justifyContent: 'flex-start' , marginY : 2 , backgroundColor : "#E8E8E8",textTransform: 'none'}} color="inherit" >
                            <Box sx={{width:'4em',height: '4em',display:'flex',justifyContent: 'flex-start',alignItems: 'center',marginInlineEnd:2 }}>
                                <FileIcon extension={params.mail.type} {...defaultStyles[params.mail.type]}/>
                            </Box>
                            <Box>
                                <Typography sx={{textTransform: 'uppercase'}}>{params.mail.type}</Typography>
                                <Typography style={{marginTop: 10}} dir="ltr">{params.mail.filename}</Typography>
                            </Box>
                        </Button>
                    )}
                </DialogContent>
            </BootstrapDialog>
        </div>
    );
}