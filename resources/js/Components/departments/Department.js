import React,{useEffect, useState , useRef} from 'react';
import { DataGrid , frFR , arSD , GridToolbar  } from "@mui/x-data-grid";
import { CircularProgress,Paper } from "@mui/material";
import { TextField , Button } from "@mui/material";
import { useGetDepartmentsQuery } from "../../store/api/departmentApi";
import { Typography } from '@mui/material';
import { t } from 'i18next';
import i18next from 'i18next';
import { Box } from '@mui/system';
import { useDispatch , useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import UpdateDepartment from './UpdateDepartment';
import RemoveDepartment from './RemoveDepartment';
import AddDepartment from './AddDepartment';
import Modal from '@mui/material/Modal';
import { AddCircle, PropaneSharp } from "@mui/icons-material";
import Divider from '@mui/material/Divider';
import { useSnackbar } from 'notistack';
import { DialogContent } from "@mui/material";
import { styled } from '@mui/material/styles';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PropTypes from 'prop-types';
import { IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import DialogActions from '@mui/material/DialogActions';
import { useAddDepartmentMutation } from "../../store/api/departmentApi";
import InputAdornment from '@mui/material/InputAdornment';
import Search from '@mui/icons-material/Search';
import Clear from '@mui/icons-material/Clear';
import Alert from '@mui/material/Alert';

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

function ConfirmationFile(props){
    const { enqueueSnackbar } = useSnackbar();
    const [addDepartment,{data,error,isLoading,isError,isSuccess}] = useAddDepartmentMutation();
    const handleClickOpen = () => {
        props.setOpen(true);
    };
    const handleClose = () => {
        props.setOpen(false);
    };
  
    const handleResetClick = () =>{
      const formData = new FormData();
      formData.append("file",props.file);
      addDepartment(formData);
      handleClose();
    }
  
    useEffect(()=>{
      if(isError){
        if(error.data === "add_department_file/fields_required")
          enqueueSnackbar(t("credentials_empty_file"),  { variant: "error" });
        else if(error.data === "add_department_file/already_exist")
          enqueueSnackbar(t("department_file_already_exist"),  { variant: "error" });
      }
      if(isSuccess){
          enqueueSnackbar(t("add_department_success"),  { variant: "success" });
          props.refetch();
      }
    },[data,error]);
  
    return(
        <>
          <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={props.open}
            fullWidth
            maxWidth="sm"
          >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
              {t("confirmationfile")}
            </BootstrapDialogTitle>
            <DialogContent dividers>
              <Typography>
                 {t("confirm_send_file" , { name : props.file.name })}
              </Typography>
            </DialogContent>
            <DialogActions> 
              <Button variant="outlined" color='error' type='submit' autoFocus onClick={handleResetClick}>
                {t("send")}
              </Button>
            </DialogActions>
          </BootstrapDialog>
        </>
    );
}

export default function Departement(){
  const { data, isLoading , refetch } = useGetDepartmentsQuery(); 
  const user = useSelector( state => state.auth.user );
  const [rows,setRows] = React.useState([]); 
  const dispatch = useDispatch();
  const [ openConfirmation , setOpenConfirmation ] = useState(false);
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const hiddenFileInput = React.useRef(null);
  const [ file , setFile ] = useState([]);
  const searchRef = useRef();

  if(user && user.role === "directeur")
    history.push("/app/forbidden");

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    justifyContent : "center",
    alignContent : "center"
  };

  useEffect(() => {
    dispatch({ type : "checkLogin" , history : history , route : "/auth/"});
    if(data){
        setRows(data.data);
    }
  },[data]);
  
  const columns = [
    {field: "name",headerName: t("nomDepartement"), flex: 2 ,headerAlign : 'center',align: 'center',renderCell : (params)=>{
     return(
      <Box>{i18next.language==="fr" ? params.row.nomLa : params.row.nomAr}</Box>
     )
    },valueGetter: (params)=>i18next.language==="fr" ? params.row.nomLa : params.row.nomAr},
    {field: "delegation",headerName: t("delegation"), flex: 2 ,headerAlign : 'center',align: 'center',renderCell : (params)=>{
     return(
      <Box>{params.row.delegation}</Box>
     )
    },valueGetter: (params) => params.row.delegation},
    {field: "type",headerName: t("type"), flex: 2 ,headerAlign : 'center',align: 'center',renderCell:(params)=>{
     return(
      <Box>{params.row.type}</Box>
     )
    },valueGetter: (params)=>params.row.type},
    {field: "action" ,headerName : "" , flex: 1 ,headerAlign : 'center',align: 'center',renderCell:(params)=>(
      <div style={{display:'flex',flexDirection: 'row'}}>
        <UpdateDepartment department={params.row} refetch={refetch} />
        <RemoveDepartment department={params.row} refetch={refetch} />
      </div>
    )},
  ]
  function FilterInputSearch(inputValue){
    let filtered = data.data.filter((row)=>(
      row.nomLa.toLowerCase().includes(inputValue.toLowerCase()) || row.nomAr.includes(inputValue)
    ));
    if(filtered){
      setRows(filtered);
    }
  }

  const handleClick = event => {
    hiddenFileInput.current.click();
  };

  const handleChange = event => {
    const fileUploaded = event.target.files[0];
    setFile(fileUploaded);
    setOpenConfirmation(true);
  };

  const clearSearch = () => {
    setRows(data.data);
    searchRef.current.value = "";
  }

  return (
    <React.Fragment>
      <Box sx={{display: 'flex',flexDirection: 'row',justifyContent: 'flex-start',paddingBottom:2,alignItems:"center"}}>
          <Typography variant='h6' sx={{fontSize:25 , fontWeight:"bold" }}>{t("department_list")}</Typography>
      </Box>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <Box className='searchBar'>
            <TextField 
              id="outlined-basic" 
              className='inputField' 
              margin="normal" 
              fullWidth onChange={(text)=>FilterInputSearch(text.target.value)} 
              label={t("name_search_dep")} 
              inputRef={searchRef}
              variant="outlined"
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
          <Button variant="outlined" startIcon={<AddCircle />} onClick={handleOpen}>
            {t("addDep")}
          </Button>
          <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
                <AddDepartment refetch={refetch} />
                <Divider sx={{ paddingY : 1 , color : "black"}}>{t("or")}</Divider>
                <Button variant="outlined" onClick={handleClick} fullWidth>
                    {t("addDepswithfile")}
                </Button>
                <input
                    type="file"
                    ref={hiddenFileInput}
                    onChange={handleChange}
                    style={{display: 'none'}}
                    accept=".csv, .xls, .xlsx, text/csv, application/csv,
                    text/comma-separated-values, application/csv, application/excel,
                    application/vnd.msexcel, text/anytext, application/vnd. ms-excel,
                    application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                /> 
                <Alert severity="info" sx={{ fontSize : 12 , marginY : 1 }} >{t("add_dep_file_message")}</Alert>
                <Button variant="outlined" fullWidth>
                  <a href="/storage/save_dep.xlsx" style={{ textDecoration: 'none',color: 'inherit' }}>{t("download_file")}</a>
                </Button>
                <ConfirmationFile setOpen={setOpenConfirmation} open={openConfirmation} file={file} refetch={refetch} />
            </Box>
          </Modal>
        </div>
      </Paper>
    </React.Fragment>
  );
}