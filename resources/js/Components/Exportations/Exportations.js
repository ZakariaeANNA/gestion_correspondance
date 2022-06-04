import React,{ useState,useEffect } from 'react'
import { DataGrid , frFR , arSD , GridToolbar } from '@mui/x-data-grid';
import { Button, DialogContent, IconButton, CircularProgress} from "@mui/material";
import PropTypes from 'prop-types';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import { Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@mui/system';
import {Delete} from "@mui/icons-material";
import { Tooltip } from '@material-ui/core';
import Paper from '@mui/material/Paper';
import { Style  } from "@mui/icons-material";
import { Send} from "@mui/icons-material";
import { useSelector,useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {useDeleteExportationMutation, useGetExportationBycodeGRESAQuery } from "../../store/api/exportationApi";
import "./Exportations.css";
import { useSnackbar } from 'notistack';
import moment from 'moment';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import ViewExportation from './ViewExportation';
import { t } from 'i18next';

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

function DeleteExportation(props){

    const { enqueueSnackbar } = useSnackbar();
    const [deleteExportation,{data,isLoading,error,isError,isSuccess}] = useDeleteExportationMutation()
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleConfirmDeleteButton = () =>{
        deleteExportation(props.params.id);
        setOpen(false)
    }
    useEffect(()=>{
        if(isError){
            if(error.data==="correspondance_delete/notFound"){
                enqueueSnackbar(t("correspondance_notFound"), { variant: "error" });
            }else{
                enqueueSnackbar(t("correspondance_delete_error"), { variant: "error" });
            }
        }
        if(isSuccess){
            enqueueSnackbar(t("correspondance_delete_success"),  { variant: "success" });
            props.refetch();
        }
    },[data,error])
    return(
        <>
            <Tooltip title={t("delete_correspondance")}>
                <IconButton aria-label="delete" size="large" onClick={handleClickOpen}> 
                        <Delete sx={{ color: 'red' }} color="red" />
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
                    {t("delete_correspondance")}
                </BootstrapDialogTitle>
                <DialogContent dividers>
                <Typography>
                    {t("correspondance_confirm_message")}
                </Typography>
                </DialogContent>
                <DialogActions>
                <Button variant="outlined" color='error' startIcon={<Delete />} autoFocus onClick={handleConfirmDeleteButton}>
                    {t("confirm")}
                </Button>
                </DialogActions>
            </BootstrapDialog>
        </>
    );
}

export default function Exportation(){
    const auth = useSelector( state => state.auth.user );
    const doti = auth.doti
    const [ page , setPage ] = useState(1);
    const [ loading , setLoading ] = useState(false);
    const [rows,setRows] = React.useState([]);
    const {refetch , data, isLoading } = useGetExportationBycodeGRESAQuery({doti:doti,page:page});
    const dispatch = useDispatch();
    const history = useHistory();
    const { t } = useTranslation();
    useEffect(() => {
        dispatch({ type : "checkLogin" , history : history , route : "/auth/"});
        if(data){
            setPage(data.meta.current_page);
            setLoading(false);
            setRows(data.data);
            refetch();
        }
    },[data]);
    const handlePageChange = (newPage) => {
        setPage(newPage + 1);
        setLoading(true);
        refetch();
    }
    const columns = [
        {field: "number",headerName: t('correspondance_number'), flex: 1 ,headerAlign : 'center',align:'center',fontWeight:"bold",renderCell : (params)=>{
            return(
                <Typography>{params.row.number}</Typography>
            )
        }},
        {field: "created_at",headerName: t('sending_date'), flex: 1 ,headerAlign : 'center',align:'center',renderCell : (params)=>{
            const date = moment(params.row.created_at).format('DD-MM-YYYY');
            return(
                <Typography>{date}</Typography>
            );
        }},
        {field: "title",headerName: t('subject_message'), flex: 3 ,headerAlign : 'center',align:'center'},
        {field: "achevementdate",headerName: t('achevement_date'), flex: 1 ,headerAlign : 'center',align:'center',renderCell : (params)=>{
            const date = moment(params.row.achevementdate).format('DD-MM-YYYY');
            return(
                <Typography>{date}</Typography>
            );
        }},
        {field: "Actions1",headerName: t('actions'), flex: 1 ,headerAlign : 'center',align:'center',renderCell : (params)=>(
            <Box sx={{display: 'flex',flexDirection: 'row',textAlign:"center"}}>
                <ViewExportation params={params.row}/>
                <DeleteExportation params={params.row} refetch={refetch} />
            </Box>
        )}, 
        {field: "Actions",headerName: "", flex: 2 ,headerAlign : 'center',align:'center',renderCell : (params)=>(
            <Button variant="text" startIcon={<Style />} sx={{ mt: 3, mb: 2 }} onClick={() => { localStorage.setItem("path","export"); history.push({pathname: "/app/feedback/"+params.row.id , appState: { receivers : params.row.receiver } })}}>{t('correspondence_follow')}</Button>
        )},        
    ]
    return(
        <React.Fragment>
            <Box sx={{display: 'flex',flexDirection: 'row',justifyContent: 'flex-start',paddingBottom:2,alignItems:"center"}}>
                <Typography variant='h6' sx={{fontSize:25 , fontWeight:"bold" }}>{t("listExportations")}</Typography>
            </Box>
            {   isLoading ? (
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
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    {   rows.length > 0 ? (
                        <div style={{ height: 'fit-content', width: '100%' , textAlign: "center",marginTop: '0.5em' }}>
                            <DataGrid
                                components={{
                                    Toolbar: GridToolbar,
                                }}
                                localeText={ 
                                    i18next.language === "fr" ?
                                    frFR.components.MuiDataGrid.defaultProps.localeText
                                    : arSD.components.MuiDataGrid.defaultProps.localeText
                                }
                                autoHeight
                                rows={rows}
                                columns={columns}
                                pagination
                                pageSize={data?.meta.per_page}
                                rowsPerPageOptions={[5]}
                                rowCount={data?.meta.total}
                                paginationMode="server"
                                onPageChange={handlePageChange}
                                page={(page - 1)}
                                loading={loading}
                            />
                        </div>
                    ):(
                        <Box
                            sx={{
                                maxHeight : 500,
                                width : "auto",
                                overflow : "hidden"
                            }}
                        >
                            <img src="/images/StudyingConceptIllustration.jpg" style={{ marginX : "auto"}} height="35%" width="35%" alt="" />
                            <Typography sx={{ fontWeight : "bold" , fontSize : "20px"}}>{t('empty_exportation')}</Typography>
                        </Box>
                    )}
                    <Box sx={{display : "flex" , justifyContent : "flex-end"}}>
                        <Link to={'/app/addexportation'} style={{textDecoration: 'none',color: 'black'}}>
                            <Button variant="outlined" endIcon={<Send />} sx={{ marginTop : 1 }} >
                                {t("sendExportation")}
                            </Button>
                        </Link>
                    </Box>
                </Paper>
            )}
        </React.Fragment>
    )
}