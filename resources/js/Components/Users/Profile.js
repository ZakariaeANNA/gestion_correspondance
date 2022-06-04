import React, { useEffect } from 'react'
import { Paper } from "@mui/material";
import { Box } from '@mui/system';
import { Typography,CircularProgress } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { decodeToken } from 'react-jwt';
import { useGetCurrentUserQuery } from '../../store/api/userApi';
import { t } from 'i18next';
import i18next from 'i18next';
import { useDispatch , useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import EditUser from './EditUser';

const Profile = () =>{
    const user = useSelector( state => state.auth.user );
    const {refetch,data,isLoading} = useGetCurrentUserQuery(user.doti);
    const [userInfo,setUserInfo] = React.useState([]);
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(()=>{
        dispatch({ type : "checkLogin" , history : history , route : "/auth/"});
        if(data){
            setUserInfo(data[0]);
        }
    },[data])
    return(
        <React.Fragment>
            <Box sx={{display: 'grid',justifyItems: 'center'}}>
                <Box sx={{display: 'flex',flexDirection: 'row',width: 2/3,justifyContent: 'flex-start',paddingBottom:2,alignItems:"center"}}>
                    <Typography variant='h6' sx={{fontSize:25 , fontWeight:"bold" }}>{t("welcome")} {i18next.language=== "fr" ? user.fullnamela : user.fullnamear}</Typography>
                </Box>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column',width: 2/3}}>
                    <Box sx={{display: "flex",justifyContent: "flex-start",p:1.6,bgcolor: "#EAEEF4",borderRadius: 2,marginY: 1}}>
                        <Typography variant='h5'>{t("personal_data")}</Typography>
                    </Box>
                    { isLoading ? 
                    (
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
                    ): (
                        <Box>
                            <TableContainer component={Box} sx={{px:2}}>
                                <Table sx={{ minWidth: '60%' }} aria-label="simple table">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell style={{ fontWeight : "bold" }}>{t("doti")}</TableCell>
                                            <TableCell component="th" scope="row">
                                                {userInfo?.doti}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{ fontWeight : "bold" }}>{t("cin")}</TableCell>
                                            <TableCell component="th" scope="row">
                                                {userInfo?.cin}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{ fontWeight : "bold" }}>{t("email")}</TableCell>
                                            <TableCell component="th" scope="row">
                                                {userInfo?.email}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{ fontWeight : "bold" }}>{t("phone")}</TableCell>
                                            <TableCell component="th" scope="row">
                                                {userInfo?.phone}
                                            </TableCell>
                                        </TableRow>
                                        {userInfo?.etablissement==null ? (<><TableRow>
                                            <TableCell style={{ fontWeight : "bold" }}>{t("departementName")}</TableCell>
                                            <TableCell component="th" scope="row">
                                                {i18next.language === "fr" ? (userInfo?.departement?.nomLa) : (userInfo?.departement?.nomAr)}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{ fontWeight : "bold" }}>{t("departementType")}</TableCell>
                                            <TableCell component="th" scope="row">
                                                {t(userInfo?.departement?.type)}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{ fontWeight : "bold" }}>{t("delegation")}</TableCell>
                                            <TableCell component="th" scope="row">
                                                {userInfo?.departement?.delegation}
                                            </TableCell>
                                        </TableRow>
                                        </>):(
                                            <>
                                        <TableRow>
                                            <TableCell style={{ fontWeight : "bold" }}>{t("establishementName")}</TableCell>
                                            <TableCell component="th" scope="row">
                                                {i18next.language === "fr" ? (userInfo?.etablissement?.nomla) : (userInfo?.etablissement?.nomar)} 
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{ fontWeight : "bold" }}>{t('establishementName')}</TableCell>
                                            <TableCell component="th" scope="row">
                                                {userInfo?.etablissement?.type}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{ fontWeight : "bold" }}>{t('delegation')}</TableCell>
                                            <TableCell component="th" scope="row">
                                                {userInfo?.etablissement?.delegation}
                                            </TableCell>
                                        </TableRow>
                                        </>)}
                                    </TableBody>
                                </Table>        
                            </TableContainer>
                            <Box sx={{display: 'flex',justifyContent: 'flex-end'}}>
                                <EditUser props={userInfo} refetch={refetch} disabled={true}/>
                            </Box>
                        </Box>
                    )}
                </Paper>
            </Box>
        </React.Fragment>
    )
}
export default Profile