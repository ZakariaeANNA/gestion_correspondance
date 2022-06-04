import React , { useEffect , useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from '../Title/Title';
import {  useGetUserLastRecordsQuery } from "../../store/api/importationApi";
import { useGetUserLatestExportRecordsQuery } from "../../store/api/exportationApi";
import moment from 'moment';
import { useGetUserLatestFeedBackQuery } from '../../store/api/feedbackApi';
import {Calendar,momentLocalizer} from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { TableHead } from '@mui/material';
import {t} from "i18next";
import i18next from 'i18next';
import {Box,Typography} from '@mui/material';
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Style } from "@mui/icons-material";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import { Button } from "@mui/material";
import { useHistory } from 'react-router-dom';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);
///
///
///
const MyCalendar = props => {
  return(
    <div>
      <DnDCalendar
            events={props.event}
            defaultDate={moment().toDate()}
            defaultView="month"
            localizer={localizer}
            resizable
            style={{ height: "50vh" }}
            messages={{
              month: t('month'),
              day: t('day'),
              today: t('today'),
              agenda: t('agenda'),
              next: t('next'),
              week: t('week'),
              previous: t('back'),
              today: t('today')
            }}
        />
    </div>
  ) 
}
export default function Chart() {
  const [latestExportations,setLatestExportations] = useState([]);
  const [latestImportations,setLatestImportations] = useState([]);
  const [latestFeedback,setLatestFeedback] = useState([]);
  const [event,setEvent] = React.useState([])
  const headerLatestImportations = ["correspondance_number","sender","sending_date"];
  const headerLatestExportations = ["correspondance_number","sender","achevement_date"];
  const {data : ImportData,isError : isErrorImportData,isSuccess : isSuccessImportData,isLoading:isLoadingImportData} = useGetUserLastRecordsQuery();
  const {data : ExportData,isError : isErrorExportData,isSuccess: isSuccessExportData,isLoading:isLoadingExportData} = useGetUserLatestExportRecordsQuery();
  const {data:FeedbackData,isError: isErrorFeedback,isSuccess: isSuccessFeedback,isLoading:isLoadingFeedback} = useGetUserLatestFeedBackQuery()
  const history = useHistory();

  useEffect(()=>{
    if(isSuccessExportData){
      console.log(ExportData.data);
      setLatestExportations(ExportData.data);
    }
    if(isSuccessFeedback){
      setLatestFeedback(FeedbackData.data);
    }
  },[FeedbackData,ExportData]);

  useEffect(()=>{
    if(isSuccessImportData){
      setLatestImportations(ImportData.data);
      ImportData.data.forEach((data)=>{
        if(new Date(data.achevementdate).getTime() > new Date().getTime()){
          setEvent((prev) => [...prev , { start: moment(data.achevementdate, 'YYYY-MM-DD').toDate() 
                                          ,end: moment(data.achevementdate, 'YYYY-MM-DD').toDate() 
                                          ,title: data.title }])
        }
      })
    }
  },[ImportData]);

  return (
    <Grid container spacing={3} justify="space-between" alignItems="stretch">
      <Grid item xs={12} md={8} lg={8}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: "100%"
          }}
        >
          <DnDCalendar
            events={event}
            defaultDate={moment().toDate()}
            defaultView="month"
            localizer={localizer}
            resizable
            style={{ height: "50vh" }}
            messages={{
              month: t('month'),
              day: t('day'),
              today: t('today'),
              agenda: t('agenda'),
              next: t('next'),
              week: t('week'),
              previous: t('back'),
              today: t('today'),
              event: t('event'),
              date: t('date'),
              time: t('time')
            }}
          />
        </Paper>
      </Grid>
      {/* Recent Deposits */}
      <Grid item xs={12} md={4} lg={4}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: "100%",
          }}
        >
          <Title>{t("latestFeedback")}</Title>
          <Table size="small">
            <TableBody>
              {
                latestFeedback.length > 0 || !isLoadingFeedback ?
                  latestFeedback.map((record,index)=>(
                    <TableRow key={index}>
                      <TableCell>
                        <Typography>{record.Mail?.number}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box>{i18next.language=== "fr" ? (record.receiver[0].etablissement?.nomla || record.receiver[0].departement?.nomLa) : (record.receiver[0].etablissement?.nomar || record.receiver[0].departement?.nomAr)}</Box> 
                      </TableCell>
                      <TableCell>
                        <Chip label={t(record.receiverConfirmation)} color={record.receiverConfirmation === "finished" ? "success" : "error"}  />
                      </TableCell>
                    </TableRow>
                  ))
                : null
              }
            </TableBody>
          </Table>
          { isLoadingFeedback ? 
              <Box sx={{ paddingY : 4 }}> <CircularProgress /> </Box>
            : latestFeedback.length <= 0 ?
              <Box sx={{ textAlign : "center" , paddingY : 2 }}>{t("noFeedback")}</Box> 
            : null
          }
        </Paper>
      </Grid>
      {/* Chart */}
      
      {/* Recent Orders */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p : 1 , display: 'flex', flexDirection: 'column' , height: "100%" }}>
          <Title>{t("latestExportations")}</Title>
          <Table size="small">
            <TableHead>
              <TableRow>
                { headerLatestExportations.map( name=> <TableCell key={name}>{t(name)}</TableCell> ) }
              </TableRow>
            </TableHead>
            <TableBody>
              {
                latestExportations.length > 0 || !isLoadingExportData ?
                  latestExportations.map((record,index)=>(
                    <TableRow key={index}>
                      <TableCell>
                        <Typography>{record.number}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box>{i18next.language=== "fr" ? (record?.sender?.etablissement?.nomla || record?.sender?.departement?.nomLa) : (record?.sender?.etablissement?.nomar || record?.sender?.departement?.nomAr)}</Box> 
                      </TableCell>
                      <TableCell>
                        {moment(record.achevementdate).format('DD-MM-YYYY')}
                      </TableCell>
                      <TableCell>
                        <Button size="small" variant="text" startIcon={<Style />} onClick={() => { localStorage.setItem("path","export"); history.push("/app/feedback/"+record?.id)}}>{t('correspondence_follow')}</Button>
                      </TableCell>
                    </TableRow>
                ))
                : null 
              }
            </TableBody>
          </Table>
          { isLoadingExportData ? 
              <Box sx={{ paddingY : 1 }} > <CircularProgress /> </Box>
            : latestExportations.length <= 0 ?
              <Box sx={{ textAlign : "center" , paddingY : 2 }}>{t("noCorrespondence")}</Box> 
            : null
          }
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p : 1 , display: 'flex', flexDirection: 'column' , height: "100%" }}>
          <Title>{t("latestImportations")}</Title>
          <Table size="small">
            <TableHead>
              <TableRow>
                { headerLatestImportations.map( name=> <TableCell key={name}>{t(name)}</TableCell> ) }
              </TableRow>
            </TableHead>
            <TableBody>
              {
                latestImportations.length > 0 || !isLoadingImportData ? 
                  latestImportations.map((record,index)=>(
                    <TableRow key={index}>
                      <TableCell>
                        <Typography>{record.number}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box>{i18next.language=== "fr" ? (record?.sender?.etablissement?.nomla || record?.sender?.departement?.nomLa) : (record?.sender?.etablissement?.nomar || record?.sender?.departement?.nomAr)}</Box> 
                      </TableCell>
                      <TableCell>
                        {moment(record.created_at).format('DD-MM-YYYY')}
                      </TableCell>
                      <TableCell>
                        <Button size="small" variant="text" startIcon={<Style />} onClick={() => { localStorage.setItem("sender",JSON.stringify(record?.sender)); localStorage.setItem("path","import"); history.push("/app/feedback/"+record?.id);}}>{t('correspondence_follow')}</Button>
                      </TableCell>
                    </TableRow>
                  ))
                : null    
              }
            </TableBody>
          </Table>
          { isLoadingImportData  ?
              <Box sx={{ paddingY : 1 }} > <CircularProgress /> </Box> 
            : latestImportations.length <= 0 ? 
              <Box sx={{ textAlign : "center" , paddingY : 2 }}>{t("noCorrespondence")}</Box>
            : null
          }
        </Paper>
      </Grid>
    </Grid>
  );
}
