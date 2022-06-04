import React,{useEffect, useState , useRef } from 'react';
import { DataGrid , frFR , arSD , GridToolbar } from "@mui/x-data-grid";
import {LockReset, Delete} from "@mui/icons-material";
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import { Button, DialogContent, IconButton,Tooltip,CircularProgress,Paper } from "@mui/material";
import PropTypes from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { TextField } from "@mui/material";
import './Users.css';
import {useDeleteUserMutation, useGetAllUsersQuery, useResetPasswordMutation } from "../../store/api/userApi";
import { Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { t } from 'i18next';
import { AddCircle } from "@mui/icons-material";
import i18next from 'i18next';
import ViewUser from './ViewUser';
import { Box } from '@mui/system';
import { useDispatch , useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import EditUser from './EditUser';
import InputAdornment from '@mui/material/InputAdornment';
import Search from '@mui/icons-material/Search';
import Clear from '@mui/icons-material/Clear';



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
function DeleteUser(props){
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
      setOpen(false);
  };
  const [deleteUser, {data,isLoading,error,isError,isSuccess}] = useDeleteUserMutation();
  const handleResetClick = () =>{
    deleteUser(props.params.id)
    setOpen(false);
  }
  useEffect(()=>{
    if(isError)
      enqueueSnackbar(t("user_delete_error"),  { variant: "error" });
    if(isSuccess){
      enqueueSnackbar(t("user_delete_success"),  { variant: "success" });
      props.refetch();
    }
  },[data,error])
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
          maxWidth="md" 
        >
          <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
            {t("deleteUser")}
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <Typography>
               {t("confirm_delete_message")} <strong>{i18next.language==="fr" ? props.params.fullnamela : props.params.fullnamear}</strong>
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
function ResetUserPassword({params}){

  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
      setOpen(false);
  };
  const [resetPassword, {data,isLoading,error,isError,isSuccess}] = useResetPasswordMutation()
  const handleResetClick = () =>{
    resetPassword({doti: params.doti,cin: params.cin})
    setOpen(false);
  }
  useEffect(()=>{
    if(isError)
      enqueueSnackbar(t('reset_password_error'),  { variant: "error" });
    if(isSuccess)
      enqueueSnackbar(t('reset_password_success'),  { variant: "success" });
  },[data,error])
  return(
      <div>
        <Tooltip title={t("reset_password_tip")}>
          <IconButton aria-label="delete" size="large" onClick={handleClickOpen}> 
                <LockReset color="red" />
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
            {t("reset_password_tip")}
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <Typography>
               {t("confirm_reset_message")} <strong>{i18next.language==="fr" ? params.fullnamela : params.fullnamear}</strong>
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" startIcon={<LockReset />} autoFocus onClick={handleResetClick}>
              {t("confirm")}
            </Button>
          </DialogActions>
        </BootstrapDialog>
      </div>
  );
}
export default function Users(){
  const { data, isLoading , refetch } = useGetAllUsersQuery(); 
  const user = useSelector( state => state.auth.user );
  const [rows,setRows] = React.useState([]); 
  const dispatch = useDispatch();
  const history = useHistory();
  const searchRef = useRef();

  if(user && user.role === "directeur")
      history.push("/app/forbidden");
      
  useEffect(() => {
    dispatch({ type : "checkLogin" , history : history , route : "/auth/"});
    if(data){
        setRows(data.data.filter(row=>row.doti!==user.doti));
      }
  },[data]);
  const columns = [
    {field: "doti",headerName: t("doti"), flex: 1 ,headerAlign : 'center',align: 'center',renderCell : (params)=>(
      <Box>{params.row.doti}</Box>
    )},
    {field: "nom",headerName: t("name"), flex: 1 ,headerAlign : 'center',align: 'center',renderCell : (params)=>{
     return(
      <Box>{i18next.language==="fr" ? params.row.fullnamela : params.row.fullnamear}</Box>
     )
    },valueGetter: (params)=>i18next.language==="fr" ? params.row.fullnamela : params.row.fullnamear},
    {field: "nameEtab",headerName: t("departement"), flex: 1 ,headerAlign : 'center',align: 'center',renderCell:(params)=>{
     return(
      <Box>{i18next.language==="fr" ? params.row.departement?.nomLa : params.row.departement?.nomAr}{i18next.language==="fr"?params.row.etablissement?.nomla:params.row.etablissement?.nomar}</Box>
     )
    },valueGetter: (params) =>i18next.language==="fr" ? params.row.departement?.nomLa : params.row.departement?.nomAr},
    {field: "actions",headerName: t("actions"), flex: 1 ,headerAlign : 'center',align: 'center',renderCell:(params)=>(
      <div style={{display:'flex',flexDirection: 'row'}}>
        <ViewUser params={params.row}/>
        <EditUser props={params.row} refetch={refetch} />
        <ResetUserPassword params={params.row}/>
        <DeleteUser params={params.row} refetch={refetch} disabled={false}/>
      </div>
    )},
  ]
  function FilterInputSearch(inputValue){
    let filtered = data.data.filter((row)=>(
      row.fullnamela.toLowerCase().includes(inputValue.toLowerCase()) || row.fullnamear.includes(inputValue)
    ));
    if(filtered){
      setRows(filtered);
    }
  }
  function FilterSelect(event){
    if(event.target.value!=='eta' && event.target.value!=='dep' && event.target.value!=="all"){
      let filtered = data?.data.filter((row)=>(
        row.etablissement?.type===event.target.value
      ));
      setRows(filtered)
    }else if(event.target.value==='eta'){
      let filtered = data?.data.filter((row)=>(
        row.etablissement?.codegresa
      ));
      setRows(filtered)
    }else if(event.target.value==='dep'){
      let filtered = data?.data.filter((row)=>(
        row.departement?.id && row.doti !== user.doti
      ));
      setRows(filtered)
    }else{
      setRows(data?.data?.filter(row=>row.doti!==user.doti));
    }
  }
  const clearSearch = () => {
    setRows(data.data);
    searchRef.current.value = "";
  }
  return (
    <React.Fragment>
      <Box sx={{display: 'flex',flexDirection: 'row',justifyContent: 'flex-start',paddingBottom:2,alignItems:"center"}}>
          <Typography variant='h6' sx={{fontSize:25 , fontWeight:"bold" }}>{t("listUsers")}</Typography>
      </Box>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <Box className='searchBar'>
            <TextField 
              id="outlined-basic" 
              className='inputField' 
              inputRef={searchRef}
              style={i18next.language==="fr" ? {marginRight:'1%',width: '49%'}: {marginLeft:'1%',width: '49%'}} 
              onChange={(text)=>FilterInputSearch(text.target.value)} 
              label={t("name_search")} variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
        
                endAdornment: (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={clearSearch}
                  ><Clear/></IconButton>
                )
              }}
            />
            <FormControl fullWidth className='inputField' style={i18next.language==="fr" ? {marginLeft:'1%',width: '49%'}: {marginRight:'1%',width: '49%'}}>
                <InputLabel id="demo-simple-select-label">{t("type_search")}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label={t("type_search")}
                    onChange={FilterSelect}
                    style={{ textAlign : "start" }}
                    defaultValue={'all'}
                >
                    <MenuItem value={'all'}>{t("all")}</MenuItem>
                    <MenuItem value={'dep'}>{t("all_department")}</MenuItem>
                    <MenuItem value={'eta'}>{t("all_etablishment")}</MenuItem>
                    <MenuItem value={'primaire'}>{t("eta_primaire")}</MenuItem>
                    <MenuItem value={'college'}>{t("eta_college")}</MenuItem>
                    <MenuItem value={'lycee'}>{t("eta_lycee")}</MenuItem>
                </Select>
            </FormControl>
        </Box>
        {isLoading ?(
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
        ) : (
            <Box sx={{ height: 'fit-content', width: '100%' , textAlign: "center" , marginY : 2 }}>
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
                rowsPerPageOptions={[5]}
                pageSize={5}
                disableSelectionOnClick
              />
            </Box>
        )}
        <div className='addUserSection'>
          <Link to="/app/adduser" style={{textDecoration: 'none'}}>
            <Button variant="outlined" startIcon={<AddCircle />}>
              {t("addUser")}
            </Button>
          </Link>
        </div>
      </Paper>
    </React.Fragment>
  );
}