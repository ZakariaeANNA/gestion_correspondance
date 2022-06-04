import React,{ useState,useEffect,useCallback} from 'react'
import Paper from '@mui/material/Paper';
import { Button, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import { useAddFeedbackMutation,useConfirmMailByReceiverMutation,useConfirmMailBySenderMutation,useGetFeedbackBymailAndBysenderAndByreceiverMutation, useUpdateFeedbackStatusMutation , useGetReceiverByMailQuery } from "../../store/api/feedbackApi";
import moment from 'moment';
import { Tooltip } from '@material-ui/core';
import { DialogContent, IconButton , ListItemButton  } from "@mui/material";
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';
import MUIRichTextEditor from 'mui-rte';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { convertToRaw } from 'draft-js';
import { useSnackbar } from 'notistack';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import i18next from 'i18next'
import { t } from 'i18next';
import {FileIcon,defaultStyles} from 'react-file-icon';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Email from '@mui/icons-material/Email';
import DropFileInput from '../drop-file-input/DropFileInput';
import { stringToColor } from "../../Util/stringToAvatar";
import "./Feedback.css";
import 'moment/locale/ar-ma' 
import 'moment/locale/fr' 
import CircularProgress from '@mui/material/CircularProgress';
import LoadingButton from '@mui/lab/LoadingButton';
import { useRefreshMutation } from "../../store/api/authApi";
import Skeleton from '@mui/material/Skeleton';
import ModalImage from "react-modal-image";
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

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
                padding : 3
            },
            editor: {
                padding : 3
            },
            container: { 
                padding : 3
            },
        }
    }
})



function SendFeedback(props){
    const [open, setOpen] = React.useState(false);
    const [plainTextValue,setPlainTextValue] = useState();
    const [isConfirmation,setIsConfirmation] = useState(0);
    const [value,setValue] = React.useState('');
    const [ approval , setApproval ] = useState();
    const [ refresh ] = useRefreshMutation();
    const [addFeedback, { data , isLoading, error, isError, isSuccess }] = useAddFeedbackMutation();
    const [confirmMailBySender] = useConfirmMailBySenderMutation();
    const [confirmMailByReceiever] = useConfirmMailByReceiverMutation();
    const [files,setFiles] = useState([]);
    const { enqueueSnackbar } = useSnackbar();

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
    
    const onAddFeedback = async() => {
        const formData = new FormData();
        var index = 0;
        formData.append('mail_id', props.mailID);
        formData.append('idSender',props.sender);
        formData.append('idReceiver',props.receiver.doti);
        formData.append('file', files);
        formData.append('direction','export');
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
        setValue(); setFiles([]);
    }

    useEffect(()=>{
        if(isSuccess){
            props.handleChange(data);
            if(approval != null){
                confirmMailBySender({ idReceiver : props.receiver.doti , mail_id : props.mailID , state : approval});
                if(approval==="notcomplet"){
                    confirmMailByReceiever({ idReceiver : props.receiver.doti , mail_id : props.mailID , state : "unfinished"});
                    props.setConfirmReceiver("unfinished");
                }
                props.setConfirmSender(approval);    
                setApproval();
                setIsConfirmation(0)
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
                    {  ((props.confirmReceiver==="finished" && props.confirmSender==="approved") || (props.confirmSender==="pending" && props.confirmReceiver==="pending") || (props.confirmSender==="notcomplet" && props.confirmReceiver==="unfinished") || (props.confirmReceiver==="unfinished")) ? (
                        null
                    ):(
                        <FormControl sx={{ border : "1px solid #d6d8da" , padding : "4px 14px 4px 14px" , borderRadius : "6px"}} fullWidth>
                            <FormLabel id="demo-row-radio-buttons-group-label">{t("approval_achevement")}</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                onChange={(event)=>{setApproval(event.target.value);setIsConfirmation(1)}}
                            >
                                <FormControlLabel value="notcomplet" control={<Radio />} label={t("notcomplet")} />
                                <FormControlLabel value="approved" control={<Radio />} label={t("approved")} />
                            </RadioGroup>
                        </FormControl>
                    )}
                    <Box sx={{ padding: 1 , border : 1 , borderRadius : "6px" , borderColor : "#d6d8da" ,paddingBottom: 6 , marginY : 2}}>
                        <MUIRichTextEditor label="Start typing..." inlineStyle={{ marginY : 2 }} onChange={handleDataChange} control
                        s={["title", "bold", "italic", "underline", "strikethrough", "highlight", "undo", "redo", "link", "numberList", "bulletList", "quote", "code", "clear"]} />
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

  
export default function FeedbackExport(props){
    const [ receiverDisplay , setReceiverDisplay ] = useState();
    const [ selected , setSelected ] = useState();
    const [ receivers , setReceivers ] = useState([]);
    const [ message , setMessage ] = useState([]);
    const [getFeedbackBymailAndBysenderAndByreceiver,
            {data , isLoading , 
              isSuccess }] = useGetFeedbackBymailAndBysenderAndByreceiverMutation();
    const { refetch , data : dataReceiver , isLoading : isLoadingReceiver
     , isSuccess : isSuccessReceiver } = useGetReceiverByMailQuery({ mail_id : props.idemail });
    moment.locale(i18next.language === "ar" ? ("ar-ma"):("fr"));
    const [onUpdateStatus,{}]= useUpdateFeedbackStatusMutation();
    const [confirmSender,setConfirmSender] = useState('pending');
    const [confirmReceiver,setConfirmReceiver] = useState('pending');
    
    const measuredRef = useCallback(node => {
        if (node !== null) {
            node.scrollIntoView({ behaviour : "smooth" , block: "nearest", inline: "nearest"});
        }
    }, [message]);

    useEffect(()=>{
        if(isSuccess){
            if(data.filter(item=>item.status===0 && item.idReceiver===props.auth.doti).length > 0){
                onUpdateStatus({idReceiver: props.auth.doti,mail_id: props.idemail}) 
            }
            setMessage(data);
        }
        if(isSuccessReceiver){
            setReceivers(dataReceiver.data);
        }
    },[isSuccess,isSuccessReceiver]);

    const handleConversation = (receiver,confirmationSender,confirmationReceiver) => {
        setSelected(receiver.doti);
        setConfirmSender(confirmationSender);
        setConfirmReceiver(confirmationReceiver);
        getFeedbackBymailAndBysenderAndByreceiver({ mail : props.idemail , receiver : props.auth.doti , sender : receiver.doti });
        setReceiverDisplay(receiver);
    }

    const handleChange = (data) => {
        setMessage((prev) => [...prev , data[0]]);
    }

    const handleSearch = (user) => {
        if(dataReceiver){
            let filtered = dataReceiver.data.filter((row)=>(
                row.receiver[0].etablissement?.nomla.toLowerCase().includes(user.toLowerCase()) || row.receiver[0].etablissement?.nomar.includes(user) || row.receiver[0].departement?.nomLa.toLowerCase().includes(user.toLowerCase()) || row.receiver[0].departement?.nomAr.includes(user)
            ));
            if(filtered){
                setReceivers(filtered);
            }
        }
    }

    function isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
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
                    {   isLoadingReceiver ? (
                        <List sx={{ width: '100%', maxWidth: 360, minWidth:"max-content" , bgcolor: 'background.paper',maxHeight:500 , overflow : "auto" }} className="scrollable" component="nav">
                            { [1, 2, 3, 4, 5, 6].map(loading => ( 
                                <ListItem key={loading} disablePadding>
                                    <ListItemButton role={undefined} dense >   
                                        <ListItemAvatar>
                                            <Skeleton animation="wave" variant="circular" width={40} height={40} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Skeleton animation="wave" height={10} width="auto" style={{ marginBottom: 6 }} />
                                            }
                                            secondary={
                                                <Skeleton animation="wave" height={10} width="50%" />
                                            }
                                        />
                                        <Divider variant="inset" component="div" />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    ):(
                        <List sx={{ width: '100%', maxWidth: 360, minWidth:"max-content" , bgcolor: 'background.paper',maxHeight:500 , overflow : "auto" }} className="scrollable" component="nav">
                            <FormControl fullWidth sx={{ marginBottom : 1 }} variant="standard">
                                <Input
                                    onChange={(e) => handleSearch(e.target.value)}
                                    endAdornment={<InputAdornment position="end"> <SearchIcon /> </InputAdornment>}
                                />
                            </FormControl>
                            { receivers.map( receiver =>{
                                return(
                                    <ListItem  
                                        key={receiver.receiver[0].doti}
                                        //secondaryAction={
                                        //    receiver.receiverConfirmation === "pending" ? (
                                        //        <Chip label={t('pending')}  color={'warning'}/>
                                        //    ):(
                                        //        <Chip label={t(receiver.receiverConfirmation)} color={receiver.receiverConfirmation==="finished"? 'success': receiver.receiverConfirmation==="pending" ? "warning" :'error'} />
                                        //    )
                                        //} 
                                        onClick={()=>handleConversation(receiver.receiver[0],receiver.senderConfirmation,receiver.receiverConfirmation)}
                                        disablePadding
                                    >
                                        <ListItemButton role={undefined} dense selected={selected === receiver.receiver[0].doti}>   
                                            <ListItemAvatar>
                                                <Avatar alt={receiver.receiver[0].fullnamela} sx={{ bgcolor : stringToColor(receiver.receiver[0].fullnamela) }} src="/static/images/avatar/1.jpg" />
                                            </ListItemAvatar>
                                            <ListItemText primary={ i18next.language === "fr" ? (receiver.receiver[0].etablissement?.nomla || receiver.receiver[0].departement?.nomLa) : (receiver.receiver[0].etablissement?.nomar || receiver.receiver[0].departement?.nomAr) }/>
                                            <Divider variant="inset" component="div" />
                                        </ListItemButton>
                                    </ListItem>
                                )})}
                        </List>
                    )}
                    {   receiverDisplay ? (
                        <Box sx={{ paddingX : 2 , width : "100%" , height: '75vh'}}>
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
                                    <SendFeedback mailID={props.idemail} sender={props.auth.doti} receiver={receiverDisplay} confirmReceiver={confirmReceiver} confirmSender={confirmSender} setConfirmSender={setConfirmSender} setConfirmReceiver={setConfirmReceiver} refetch={refetch} handleChange={handleChange} />
                                    <Divider orientation="vertical" flexItem />
                                    <Box sx={{display: 'flex',flexDirection: 'row', justifyContent: 'space-between',marginY: 1,marginX: 1 , alignItems:"center"}}>
                                        <Typography>{t("approval_achevement")}</Typography>
                                        <Chip label={t(confirmSender)} color={confirmSender==="approved" ? 'success': confirmSender==="pending" ? 'warning' : 'error'} sx={{marginX: 1} } />
                                    </Box>
                                    <Divider orientation="vertical" flexItem />
                                    <Box sx={{display: 'flex',flexDirection: 'row',justifyContent: 'space-between',marginY: 1,marginX: 1 , alignItems:"center"}}>
                                        <Typography>{t("achevement_state")}</Typography>
                                        <Chip label={t(confirmReceiver)} color={confirmReceiver==="finished"? 'success': confirmReceiver==="pending" ? 'warning' : 'error'} sx={{marginX: 1} } />                                   
                                    </Box> 
                                </Box>
                            </Box>
                            {   isLoading ? (
                                <Box sx={{ display: 'flex' , p : 4 , position : "relative" , left : "50%" }}>
                                    <CircularProgress />
                                </Box>
                            ):(
                                <>
                                    {   message.length > 0 ? (
                                        <Box sx={{ maxHeight: '68vh' , overflow : "scroll" , marginY : 2 }}>
                                            { message.map( message => (
                                                <Card sx={message.idSender===props.auth.doti ? { textAlign:"left", marginY : 1,backgroundColor:  '#1976d2' , color : "white"}:{ textAlign:"left" , marginY : 1}} key={message.id} >
                                                    <CardHeader
                                                        avatar={ message.idSender === props.auth.doti ? (
                                                            <Avatar alt={props.auth.fullnamela} sx={{ bgcolor : stringToColor(props.auth.fullnamela) }} src="/static/images/avatar/1.jpg" />
                                                        ):(
                                                            <Avatar alt={receiverDisplay.fullnamela} sx={{ bgcolor : stringToColor(receiverDisplay.fullnamela) }} src="/static/images/avatar/1.jpg" />
                                                        )}
                                                        title={ message.idSender === props.auth.doti && i18next.language === "fr" ? (props.auth.fullnamela) 
                                                            : message.idSender === props.auth.doti && i18next.language === "ar" ? (props.auth.fullnamear) 
                                                            : receiverDisplay.doti === message.idSender && i18next.language === "fr" ? (receiverDisplay.etablissement?.nomla || receiverDisplay.departement?.nomLa) 
                                                            : (receiverDisplay.etablissement?.nomar || receiverDisplay.departement?.nomAr) }
                                                        subheader={<Box sx={message.idSender===props.auth.doti ? { color : "white"} : {}}>{moment(message.created_at).format('MMMM Do YYYY, HH:mm')}</Box>}
                                                        action={
                                                            (message.idSender===props.auth.doti && message.status) ?
                                                            (<Chip sx={{ color : "white" , marginX : 1 }} label={`${t("seen")} : ${moment(message.updated_at).format('DD-MM-YYYY HH:mm')}`} />): (null)
                                                        }
                                                    />      
                                                        <CardContent>
                                                            { isJson(message.message) &&
                                                                <ThemeProvider theme={defaultTheme}>
                                                                    <MUIRichTextEditor value={message.message} readOnly={true} toolbar={false} />
                                                                </ThemeProvider>
                                                            }
                                                            { message.isConfirmation ? (<Box sx={{display: 'flex',justifyContent: 'flex-end', alignItems: 'center'}}>
                                                                <Chip sx={message.idSender===props.auth.doti ? {color: "white",marginX: 1} : {color: "black",marginX: 1}} label={t('is_confirmation')}/>
                                                                </Box>) : null
                                                            }
                                                        </CardContent>
                                                    { message.attachement.length != 0 ? <Divider /> : null }
                                                    <CardActions sx={{ p:2 }}>
                                                    {
                                                        message?.attachement?.map(attach=>(
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
                                            <div ref={measuredRef}/>
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
                                            <img src="/images/785_generated.jpg" style={{ marginX : "auto"}} height="300px" alt=""/>
                                            <Typography sx={{ fontWeight : "bold" , fontSize : "20px"}}>{t('empty_message')}</Typography>
                                        </Box>
                                    )}
                                </>
                            )}
                        </Box>
                    ):(
                        <Box
                            sx={{
                                maxHeight : 400,
                                width : "auto",
                                overflow : "hidden"
                            }}
                        >
                            <img src={require("../../StudyingConceptIllustration.jpg")} style={{ marginX : "auto"}} height="80%" alt="" />
                            <Typography sx={{ fontWeight : "bold" , fontSize : "20px"}}>{t("see_conversation")}</Typography>
                        </Box>
                    )}
                </Box>    
            </Paper>
        </React.Fragment>
    )
}