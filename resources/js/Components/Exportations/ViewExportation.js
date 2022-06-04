import React from 'react'
import { t } from 'i18next';
import {FileIcon,defaultStyles} from 'react-file-icon';
import { Button, Typography } from '@mui/material';
import {DialogContent, IconButton, Tooltip , Paper , TextField, ListItemButton} from "@mui/material";
import {Visibility } from '@mui/icons-material'; 
import moment from 'moment';
import PropTypes from 'prop-types';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Avatar from '@mui/material/Avatar';
import { makeStyles } from "@material-ui/core/styles";
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { Box } from '@mui/system';
import i18next from 'i18next';
import { stringAvatar } from "../../Util/stringToAvatar";
import ModalImage from "react-modal-image";
import Chip from '@mui/material/Chip';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'fit-content',
    minWidth:450,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt:3
};  
const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
    demo: {
      backgroundColor: theme.palette.background.paper,
    },
    color:{
        backgroundColor: '#f0f0f0'
    }
}));
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

function ViewUserDetails({params}){
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
        <div>
            <IconButton onClick={handleOpen}>
                <Visibility />
            </IconButton>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <Box style={{display: 'flex',justifyContent: 'flex-start',flexDirection:'row',paddingLeft: '2em',paddingRight: '2em',marginBottom: 10}}>
                            <Avatar {...stringAvatar(params.fullnamela)} />
                            <Typography variant='h5' style={{marginTop : 3,marginLeft: 15,marginRight: 15}}>{params.fullnamela}</Typography>
                        </Box>
                        <TableContainer component={Paper} sx={{px:2}}>
                            <Table sx={{ minWidth: '60%' }} aria-label="simple table">
                                <TableBody>
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
                                    {params.etablissement==null ? (<><TableRow>
                                        <TableCell style={{ fontWeight : "bold" }}>{t("departementName")}</TableCell>
                                        <TableCell component="th" scope="row">
                                            {i18next.language === "fr" ? (params.departement.nomLa) : (params.departement.nomAr)}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ fontWeight : "bold" }}>{t("departementType")}</TableCell>
                                        <TableCell component="th" scope="row">
                                            {params.departement.type}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ fontWeight : "bold" }}>{t("delegation")}</TableCell>
                                        <TableCell component="th" scope="row">
                                            {params.departement.delegation}
                                        </TableCell>
                                    </TableRow>
                                    </>):(
                                        <>
                                    <TableRow>
                                        <TableCell style={{ fontWeight : "bold" }}>{t("establishementName")}</TableCell>
                                        <TableCell component="th" scope="row">
                                            {i18next.language === "fr" ? (params.etablissement.nomla) : (params.etablissement.nomar)} 
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ fontWeight : "bold" }}>{t('establishementType')}</TableCell>
                                        <TableCell component="th" scope="row">
                                            {t(params.etablissement.type)}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ fontWeight : "bold" }}>{t('delegation')}</TableCell>
                                        <TableCell component="th" scope="row">
                                            {params.etablissement.delegation}
                                        </TableCell>
                                    </TableRow>
                                    </>)}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}
export default function ViewExportation({params}){
  
    const [open, setOpen] = React.useState(false);
    const achevemetDate = moment(params.achevementdate).format('DD-MM-YYYY');
    const date = moment(params.created_at).format('DD-MM-YYYY HH:mm');
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const [display,setDisplay] = React.useState(false);
    const handleClick = () => {
        setDisplay(!display);
    };
    const classes = useStyles()
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
                    <TextField sx={{ width : 1/4 , marginY : 1 , paddingInlineEnd : 1 }} id="outlined-basic" fullWidth label={t("correspondance_number")} variant="filled" rows={4} value={params.number} inputProps={{ readOnly: true }}/>
                    <TextField sx={{ width : 1/4 , marginY : 1 , paddingInlineEnd : 1 }} id="outlined-basic" fullWidth label={t("sender")} variant="filled" value={i18next.language === "fr" ? ( `${params.sender?.departement ? params.sender.departement.nomLa : params.sender.etablissement.nomla}(${params.sender.fullnamela})` ) : (  `${params.sender?.departement ? params.sender.departement.nomAr : params.sender.etablissement.nomar}(${params.sender.fullnamear})` )} inputProps={{ readOnly: true }}/>                                      
                    <TextField sx={{ width : 1/4 , marginY : 1 , paddingInlineEnd : 1 }} id="outlined-basic" fullWidth label={t("sending_date")} variant="filled" value={date} inputProps={{ readOnly: true }}/>
                    <TextField sx={{ width : 1/4 , marginY : 1 }} id="outlined-basic" fullWidth label={t("achevement_date")} variant="filled" value={achevemetDate} inputProps={{ readOnly: true }}/>
                    <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth label={t("subject_message")} variant="filled" value={params.title} inputProps={{ readOnly: true }}/>
                    {params.message!==null && <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth multiline label={t("message")} variant="filled" rows={4} value={params.message===null ? '': params.message} inputProps={{ readOnly: true }}/>}
                    {params.concerned!==null && <TextField sx={{ marginY : 1 , paddingInlineEnd : 1 }} id="outlined-basic" multiline fullWidth rows={2} label={t("concerned")} variant="filled" value={params.concerned} inputProps={{ readOnly: true }}/>}
                    {params.notes!==null && <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth multiline rows={2} label={t("notes")} variant="filled" value={params.notes} inputProps={{ readOnly: true }}/>}
                    {params.references!==null && <TextField sx={{ marginY : 1 }} id="outlined-basic" fullWidth multiline label={t("references")} variant="filled" rows={4} value={params.references} inputProps={{ readOnly: true }}/>}
                    {/*show users content*/}
                    <List sx={{marginY : 1}} disablePadding component={'div'}>
                        <ListItemButton onClick={handleClick} className={classes.color}>
                            <ListItemText primary={t("receivers")} />
                            {display ? <ExpandLessIcon /> : <ExpandMoreIcon />} 
                        </ListItemButton>                                   
                        <Collapse in={display} timeout="auto" unmountOnExit >
                            <List disablePadding component={'div'}>
                                {
                                    params.receiver.map(email=>(
                                        email.receiver.map(receive=>(
                                            <ListItem key={receive.doti}> 
                                                <ListItemText
                                                    primary={<Typography>{i18next.language === "fr" ? ( `${receive?.departement ? receive?.departement?.nomLa : receive?.etablissement?.nomla}(${receive?.fullnamela})` ) : (  `${receive?.departement ? receive?.departement?.nomAr : receive?.etablissement?.nomar}(${receive?.fullnamear})` )}</Typography>}
                                                />
                                                <ListItemSecondaryAction sx={{ display : "flex" , alignItems : "center"}}>
                                                    {email.receiverConfirmation === "pending" ? (
                                                        <Chip variant="outlined" label={t('pending')}  color={'warning'}/>
                                                    ):(
                                                        <Chip variant="outlined" label={t(email.receiverConfirmation)} color={email.receiverConfirmation==="finished"? 'success': email.receiverConfirmation==="pending" ? "warning" :'error'} />
                                                    )}
                                                    <ViewUserDetails params={receive}/>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        )
                                    )))
                                }
                            </List>
                        </Collapse>
                    </List>
                    { ["png","jpg","jpeg"].includes(params.type) ? (
                        <Button variant="text" color="inherit" href="" fullWidth sx={{ p: 2, display: 'flex', flexDirection : "row" , justifyContent: 'flex-start' , marginY : 2 , backgroundColor : "#E8E8E8",textTransform: 'none'}}>
                            <Box sx={{width:'4em',height: '4em',display:'flex',justifyContent: 'flex-start',alignItems: 'center',marginInlineEnd:2 }}>
                                <ModalImage
                                    className="modal-image"
                                    small={`/api/`+params.attachement+'/'+params.filename}
                                    large={`/api/`+params.attachement+'/'+params.filename}
                                    alt={params.filename}
                                />
                            </Box>
                            <Box sx={{ textAlign : "start" }}>
                                <Typography sx={{textTransform: 'uppercase'}}>{params.type}</Typography>
                                <Typography style={{marginTop: 10}} dir="ltr">{params.filename}</Typography>
                            </Box>
                        </Button>
                    ):(
                        <Button variant="text" href={`/api/`+params.attachement+'/'+params.filename} sx={{ p: 2, display: 'flex', flexDirection : "row" , justifyContent: 'flex-start' , marginY : 2 , backgroundColor : "#E8E8E8",textTransform: 'none'}} color="inherit" >
                            <Box sx={{width:'4em',height: '4em',display:'flex',justifyContent: 'flex-start',alignItems: 'center',marginInlineEnd:2 }}>
                                <FileIcon extension={params.type} {...defaultStyles[params.type]}/>
                            </Box>
                            <Box>
                                <Typography sx={{textTransform: 'uppercase'}}>{params.type}</Typography>
                                <Typography style={{marginTop: 10}} dir="ltr">{params.filename}</Typography>
                            </Box>
                        </Button>
                    )}
                    {/*end user content section*/}
                </DialogContent>
            </BootstrapDialog>
        </div>
    );
}

