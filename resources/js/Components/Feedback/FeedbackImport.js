import React,{ useState,useEffect,useCallback } from 'react'
import Paper from '@mui/material/Paper';
import { Button, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import { useAddFeedbackMutation,useConfirmMailByReceiverMutation,useGetFeedbackBymailAndBysenderAndByreceivercloneQuery, useUpdateFeedbackStatusMutation ,useGetReceiverByMailIdAndDotiQuery} from "../../store/api/feedbackApi";
import moment from 'moment';
import { Tooltip } from '@material-ui/core';
import { DialogContent, IconButton} from "@mui/material";
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';
import MUIRichTextEditor from 'mui-rte';
import {FileIcon,defaultStyles} from 'react-file-icon';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import { stringToColor } from "../../Util/stringToAvatar";
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import { convertToRaw } from 'draft-js';
import { useSnackbar } from 'notistack';
import { createTheme } from '@mui/material/styles';
import { t } from 'i18next';
import i18next from 'i18next';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Email from '@mui/icons-material/Email';
import DropFileInput from '../drop-file-input/DropFileInput';
import "./Feedback.css";
import 'moment/locale/ar-ma';
import 'moment/locale/fr';
import CircularProgress from '@mui/material/CircularProgress';
import LoadingButton from '@mui/lab/LoadingButton';
import { useRefreshMutation } from "../../store/api/authApi";
import Skeleton from '@mui/material/Skeleton';
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

const defaultTheme = createTheme({
    overrides: {
        MUIRichTextEditor: {
            root: {
            },
            editor: {
            },
            container: { 
            },
        }
    }
})



function SendFeedback(props){
    const [open, setOpen] = React.useState(false);
    const [value,setValue] = React.useState('')
    const [ refresh ] = useRefreshMutation();
    const [addFeedback, { data, isLoading, error, isError, isSuccess }] = useAddFeedbackMutation();
    const [files,setFiles] = useState([]);
    const [radioValue,setRadioValue] = useState('');
    const [plainTextValue,setPlainTextValue] = useState();
    const [onUpdateConfirmationByReceiver] = useConfirmMailByReceiverMutation();
    const { enqueueSnackbar } = useSnackbar();
    const [isConfirmation,setIsConfirmation] = useState(0);
    

    const handleClickOpen = () => {
      setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };
    
    const handleDataChange = (event)=>{
        setPlainTextValue(event.getCurrentContent().getPlainText()) // for plain text
        const rteContent = convertToRaw(event.getCurrentContent()) // for rte content with text formating
        rteContent && setValue(JSON.stringify(rteContent)) // store your rteContent to state
    }
        
    const handleRadioChange = (event) =>{
        setRadioValue(event.target.value);
        setIsConfirmation(1)
    }

    const onAddFeedback = async() => {
        const formData = new FormData();
        var index = 0;
        formData.append('mail_id', props.mailID);
        formData.append('idSender',props.sender);
        formData.append('idReceiver',props.receiver);
        formData.append('file', files);
        formData.append('direction','import');
        if(isConfirmation) formData.append('isConfirmation',isConfirmation);
        if(plainTextValue) formData.append('message',value);
        files.map( file => {
            formData.append('file['+index+']', file);        
            index++;    
        });
        try{
            await addFeedback(formData).unwrap();
        }catch(error){
            if(error.status === 401){
                await refresh({ token : localStorage.getItem("token") }).unwrap().then( data => {
                    localStorage.setItem( "token" , data );
                    addFeedback(formData);
                });
            }
        }
        setValue(''); setFiles([]);
    }


    useEffect(()=>{
        if(isSuccess){
            props.handleChange(data);
            if( radioValue != null && radioValue != undefined && radioValue){
                console.log(radioValue)
                onUpdateConfirmationByReceiver({idReceiver: props.sender,mail_id: props.mailID,state: radioValue});
                setRadioValue()
                setIsConfirmation(0)
                props.setConfirmReceiver(radioValue);   
            }
            enqueueSnackbar( t('add_feedback_succes') , { variant: "success" });
        }
        if(isError){
            if(error.data === "create_feedback/error_input"){
                enqueueSnackbar(t("correspondence_informations_incorrects"), { variant: "error" });
            }else if(error.data === "create_feedback/fields_required"){
                enqueueSnackbar(t("credentials_empty"), { variant: "error" });
            }
        }
    },[data,error]);
  
    return(
        <>
            <Button variant="text" onClick={handleClickOpen} startIcon={<Email />}>
                {t("add_feedback")}
            </Button>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                fullWidth
                maxWidth="md" 
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    {t("add_feedback")}
                </BootstrapDialogTitle>
                <DialogContent dividers>
                   {((props.senderConfirm==="approved" && props.receiverConfirm==="finished") || props.receiverConfirm==="finished") ? (null) :  
                        (<Box sx={{marginY: 1}}>
                            <FormControl variant='outlined' fullWidth sx={{border: "1px solid #d6d8da",padding: "4px 14px 4px 14px",borderRadius: "6px"}}>
                                <FormLabel id="demo-row-radio-buttons-group-label">{t("achevement_state")}</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    onChange={handleRadioChange}
                                >
                                    <FormControlLabel value="finished" control={<Radio />} label={t("finished")} />
                                    <FormControlLabel value="unfinished" control={<Radio />} label={t("unfinished")} />
                                </RadioGroup>
                            </FormControl>
                        </Box>)
                    }
                    <Box sx={{ padding: 1 , border : 1 , borderRadius : "6px" , borderColor : "#d6d8da" ,paddingBottom: 6 , marginBottom : 2}}>
                        <MUIRichTextEditor label="Start typing..." inlineStyle={{ marginY : 2 }} onChange={handleDataChange} />
                    </Box>
                    <DropFileInput
                        files={files}
                        setFiles={setFiles}
                        multiple={true}
                    />
                </DialogContent>
                <DialogActions>
                    { isLoading ? (
                        <LoadingButton 
                            loading 
                            variant="outlined"
                        >
                            Submit
                        </LoadingButton>
                    ) : (
                        <Button variant="outlined" endIcon={<SendIcon />} autoFocus onClick={onAddFeedback}>
                            {t("send")}
                        </Button>
                    )}
                </DialogActions>
            </BootstrapDialog>
        </>
    );
}

  
export default function FeedbackImport(props){
    const senderStored = JSON.parse(localStorage.getItem('sender'));
    const sender = Array.isArray(senderStored) ? senderStored[0] : senderStored;
    const [ message , setMessage ] = useState([]);
    const {data: dataReceiver , isLoading: isLoadingReceiver , 
        isError : isErrorReceiver , isSuccess : isSuccessReceiver } = useGetReceiverByMailIdAndDotiQuery({receiver: props.auth.doti ,mail_id : props.idemail});
    const { refetch,data , isLoading , 
            isError , isSuccess } = useGetFeedbackBymailAndBysenderAndByreceivercloneQuery({ mail : props.idemail , receiver : props.auth.doti , sender : sender?.doti});
    const [onUpdateStatus] = useUpdateFeedbackStatusMutation();
    const [confirmSender,setConfirmSender] = useState('pending');
    const [confirmReceiver,setConfirmReceiver] = useState('pending');
    moment.locale(i18next.language == "ar" ? ("ar-ma"):("fr"));
    
    const measuredRef = useCallback(node => {
        if (node !== null) {
            node.scrollIntoView({ behavior: 'smooth' });
        }
    }, [message]);

    useEffect(()=>{
        if(isSuccessReceiver){
            setConfirmSender(dataReceiver.data[0].senderConfirmation);
            setConfirmReceiver(dataReceiver.data[0].receiverConfirmation);
        }
        if(isSuccess){
            if(data.filter(item => item.status === 0 && item.idReceiver === props.auth.doti)?.length > 0){
                onUpdateStatus({idReceiver: props.auth.doti,mail_id: props.idemail});                  
            }
            setMessage(data);
        }
    },[isSuccess,isSuccessReceiver,dataReceiver]);

    const isJson = (str) => {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    const handleChange = (data) => {
        setMessage((prev) => [...prev , data[0]]);
    }

    return(
        <React.Fragment>
            <Paper
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 'fit-content'
                }}
            >
                <Box sx={{ display:"flex"}}>    
                    <Box sx={{ paddingX : 2 , width : "100%" }}>
                        <Box sx={{display: 'flex',flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    width: 'fit-content',
                                    border: (theme) => `1px solid ${theme.palette.divider}`,
                                    borderRadius: 1,
                                    bgcolor: 'background.paper',
                                    color: 'text.secondary',
                                    '& svg': {
                                        m: 1.5,
                                    },
                                    '& hr': {
                                        mx: 0.5,
                                    },
                                }}
                            >
                                <SendFeedback mailID={props.idemail} sender={props.auth.doti} receiver={sender?.doti} senderConfirm={confirmSender} receiverConfirm={confirmReceiver} setConfirmReceiver={setConfirmReceiver} handleChange={handleChange}/>
                                <Divider orientation="vertical" flexItem />
                                <Box sx={{display: 'flex',flexDirection: 'row', justifyContent: 'space-between',marginY: 1,marginX: 1,alignItems: 'center'}}>
                                    <Typography>{t("approval_achevement")}</Typography>
                                    { isLoading ? ( 
                                        <Skeleton animation="wave" height={40} width={40} style={{ marginLeft : 5 }} />
                                    ):(
                                        <Chip label={t(confirmSender)} color={confirmSender==="approved" ? 'success': confirmSender==="pending" ? 'warning' : 'error'} sx={{marginX: 1} } />
                                    )}
                                </Box>
                                <Divider orientation="vertical" flexItem />
                                <Box sx={{display: 'flex',flexDirection: 'row',justifyContent: 'space-between',marginY: 1,marginX: 1,alignItems: 'center'}}>
                                    <Typography>{t("achevement_state")}</Typography>
                                    { isLoading ? (
                                        <Skeleton animation="wave" height={40} width={40} style={{ marginLeft : 5 }} />
                                    ):(
                                        <Chip label={t(confirmReceiver)} color={confirmReceiver==="finished"? 'success': confirmReceiver==="pending" ? 'warning' : 'error'} sx={{marginX: 1} } />                                   
                                    )}
                                </Box> 
                            </Box>
                        </Box>
                        {
                            isLoading ? (
                                <Box sx={{ display: 'flex' , p : 4 , position : "relative" , left : "50%" }}>
                                    <CircularProgress />
                                </Box>
                            ):(
                                <React.Fragment>
                                    {   message?.length > 0 ? (
                                            <Box sx={{maxHeight: '75vh' ,overflow : "auto" , marginY : 2 }} className="scrollable" >
                                                { message && message.map( message => (
                                                    <Card sx={message.idSender===props.auth.doti ? { textAlign:"left" , marginY : 1,backgroundColor: '#1976d2' , color :"white" , boxShadow : 3 }:{ textAlign:"left" , marginY : 1  , boxShadow : 3}} key={message.id} >
                                                        <CardHeader
                                                            avatar={ message.idSender === props.auth.doti ? (
                                                                <Avatar alt={props.auth.fullnamela} sx={{ bgcolor : stringToColor(props.auth.fullnamela) }} src="/static/images/avatar/1.jpg" />
                                                            ):(
                                                                <Avatar alt={sender?.fullnamela} sx={{ bgcolor : stringToColor(sender?.fullnamela) }} src="/static/images/avatar/1.jpg" />
                                                            )}
                                                            title={ message.idSender === props.auth.doti && i18next.language === "fr" ? (props.auth.fullnamela) 
                                                                : message.idSender === props.auth.doti && i18next.language === "ar" ? (props.auth.fullnamear) 
                                                                : sender?.doti === message.idSender && i18next.language === "fr" ? (sender?.etablissement?.nomla || sender?.departement?.nomLa) 
                                                                : (sender?.etablissement?.nomar || sender?.departement?.nomAr) }
                                                            subheader={<Box sx={message.idSender===props.auth.doti ? { color : "white"} : {}}>{moment(message.created_at).format('MMMM Do YYYY, HH:mm')}</Box>}
                                                            action={
                                                            (message.idSender===props.auth.doti && message.status) ? 
                                                                (<Chip sx={{ color : "white" , marginX : 1 }} label={`${t("seen")} : ${moment(message.update_at).format('DD-MM-YYYY HH:mm')}`} />) : (null)
                                                            }
                                                        />
                                                            <CardContent>
                                                                {isJson(message.message) &&                                                           
                                                                    <MUIRichTextEditor value={message.message} readOnly={true} toolbar={false} />
                                                                }
                                                                { message.isConfirmation ? (<Box sx={{display: 'flex',justifyContent: 'flex-end', alignItems: 'center'}}>
                                                                    <Chip sx={message.idSender===props.auth.doti ? {color: "white",marginX: 1} : {color: "black",marginX: 1}} label={t('is_confirmation')}/>
                                                                    </Box>) : null
                                                                }
                                                            </CardContent>
                                                        { message.attachement.length != 0 ? <Divider /> : null }
                                                        <CardActions disableSpacing>
                                                        {
                                                            message.attachement.map(attach=>(
                                                                <Tooltip title={attach.filename} arrow key={attach.id}>
                                                                    { ["png","jpg","jpeg"].includes(attach.type) ? (
                                                                        <ModalImage
                                                                            className="modal-image"
                                                                            small={`/api/`+attach.attachement+'/'+attach.filename}
                                                                            large={`/api/`+attach.attachement+'/'+attach.filename}
                                                                            alt={attach.filename}
                                                                        />
                                                                    ):(
                                                                        <a href={`/api/`+attach.attachement+'/'+attach.filename} style={{textDecoration: 'none'}}>
                                                                            <Box sx={{display: 'flex',justifyContent: 'center',alignContent: 'center',height: '3.5em',width: '3.5em'}}>
                                                                                <FileIcon extension={attach.type} {...defaultStyles[attach.type]}/>
                                                                            </Box>
                                                                        </a>
                                                                    )}  
                                                                </Tooltip>
                                                            ))
                                                        }
                                                        </CardActions>
                                                    </Card>
                                                ))}
                                                <div ref={measuredRef} />
                                            </Box>
                                        ):(
                                            <Box
                                                sx={{
                                                    maxHeight : 400 , 
                                                    width : "auto",
                                                    overflow : "hidden",
                                                    p:3
                                                }}
                                            >
                                                <img src="/images/785_generated.jpg" style={{ marginX : "auto"}} height="300px"/>
                                                <Typography sx={{ fontWeight : "bold" , fontSize : "20px"}}>{t('empty_message')}</Typography>
                                            </Box>
                                        ) 
                                    }
                                </React.Fragment>
                            )
                        }
                    </Box>
                </Box>    
            </Paper>
        </React.Fragment>
    )
}