import React,{ useEffect } from 'react'
import { DataGrid , frFR , arSD, GridToolbar } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import { Button, DialogContent, IconButton, Tooltip , Paper , CircularProgress  } from "@mui/material";
import PropTypes from 'prop-types';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import { Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@mui/system';
import {Delete} from "@mui/icons-material";
import { useDeleteImportationMutation, useGetImportationByCodeDotiQuery } from "../../store/api/importationApi";
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ViewImportation from './ViewImportation';
import { t } from 'i18next';
import i18next from 'i18next';
import {Style } from "@mui/icons-material";
import { useSnackbar } from 'notistack';


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
function DeleteImportation(props){
  
    const { enqueueSnackbar } = useSnackbar();
    const [deleteImportation,{data,error,isLoading,isError,isSuccess}] = useDeleteImportationMutation()
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleConfirmDeleteButton = () => {
        deleteImportation(props.params);
        setOpen(false)
    }
    useEffect(()=>{
        if(isError){
            enqueueSnackbar(t("correspondance_delete_error"),  { variant: "error" });
        }
        if(isSuccess){
            enqueueSnackbar(t("correspondance_delete_success"),  { variant: "success" });
            props.refetch()
        }
    },[data,error])
    return(
        <div>
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
        </div>
    );
}
export default function Importations(){
    const auth = useSelector( state => state.auth.user );
    const doti = auth.doti
    const [ page , setPage ] = React.useState(1);
    const [ loading , setLoading ] = React.useState(false);
    const {refetch,data, isLoading } = useGetImportationByCodeDotiQuery({doti:doti,page:page}); 
    const [rows,setRows] = React.useState([]); 
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const history = useHistory();
    useEffect(() => {
        dispatch({ type : "checkLogin" , history : history , route : "/auth/"});
        if(data){
            setPage(data.meta.current_page);
            setLoading(false);
            setRows(data.data.filter(row=>row.mail!==null && row.mail?.sender!==null));
        }
    },[data]);
    const handlePageChange = (newPage) => {
        setPage(newPage + 1);
        setLoading(true);
        refetch();
    }
    const columns = [
        {field: "mail.number",headerName: t('correspondance_number'), flex: 1 ,headerAlign : 'center',align:'center',fontWeight:"bold",renderCell : (params)=>{
            return(
                <Typography>{params.row.mail.number}</Typography>
            )
        } , valueGetter: (params) => params.row.mail.number },
        {field: "created_at",headerName: t("sending_date"), flex: 1 ,headerAlign : 'center',align:'center',renderCell : (params)=>{
            const date = moment(params.row.mail.created_at).format('DD-MM-YYYY');
            return(
                <Box>{date}</Box>
            );
        }, valueGetter: (params) => moment(params.row.mail.created_at).format('DD-MM-YYYY') },
        {field: "sender",headerName: t("sender"), flex: 1 ,headerAlign : 'center' ,align : "center",renderCell : (params)=>(
            <Box>{i18next.language=== "fr" ? (params.row.mail?.sender?.fullnamela) : (params.row.mail?.sender?.fullnamear)}</Box>
        ) , valueGetter: (params) => i18next.language=== "fr" ? (params.row.mail?.sender?.fullnamela) : (params.row.mail?.sender?.fullnamear) },
        {field: "title",headerName: t("subject_message"), flex: 1 ,headerAlign : 'center',align : "center",renderCell : (params)=>(
            <Box>{params.row?.mail?.title}</Box>
        ) , valueGetter: (params) => params.row?.mail?.title },
        {field: "departement",headerName: t("departement"), flex: 1 ,headerAlign : 'center',align : "center",renderCell: (params)=>{
            return(
                <Box>{i18next.language==="fr" ? (params.row.mail?.sender?.departement?.nomLa):(params.row.mail?.sender?.departement?.nomAr)}{i18next.language==="fr" ? (params.row?.mail?.sender?.etablissement?.nomla) : (params.row?.mail?.sender?.etablissement?.nomar)}</Box>
            )
        } , valueGetter: (params) => i18next.language==="fr" ? (params.row.mail?.sender?.departement?.nomLa || params.row?.mail?.sender?.etablissement?.nomla ):(params.row.mail?.sender?.departement?.nomAr || params.row?.mail?.sender?.etablissement?.nomar) },
        {field: "achevementdate",headerName: t("achevement_date"), flex: 1 ,headerAlign : 'center',align:'center',renderCell : (params)=>{
            const date = moment(params.row.mail.achevementdate).format('DD-MM-YYYY');
            return(
                <Box>{date}</Box>
            );
        } , valueGetter: (params) => moment(params.row.mail.achevementdate).format('DD-MM-YYYY') },
        {field: "Actions",headerName: t("actions"), flex: 1 ,headerAlign : 'center',align : "center",renderCell : (params)=>(
            <div style={{display: 'flex',flexDirection: 'row',alignContent:"center"}}>
                <ViewImportation params={params.row}/>
                <DeleteImportation params={params.row.id} refetch={refetch} />
            </div>
        )},  
        {field: "Aions",headerName: "", flex: 2 ,headerAlign : 'center',align:'center',renderCell : (params)=>(
            <Button variant="text" startIcon={<Style />} sx={{ mt: 3, mb: 2 }} onClick={() => { localStorage.setItem("sender",JSON.stringify(params.row.mail.sender)); localStorage.setItem("path","import"); history.push("/app/feedback/"+params.row.mail.id);}}>{t('correspondence_follow')}</Button>
        )},      
    ]
    return(
        <React.Fragment>
            <Box sx={{display: 'flex',flexDirection: 'row',justifyContent: 'flex-start',paddingBottom:2,alignItems:"center"}}>
                <Typography variant='h6' sx={{fontSize:25 , fontWeight:"bold" }}>{t("listImportations")}</Typography>
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
                    <Paper sx={{ 
                                p: 2, 
                                display: 'flex', 
                                flexDirection: 'column' 
                            }}>
                            {rows.length ? (
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
                        ) : (
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
                    </Paper>
                )}
        </React.Fragment>
    )
}