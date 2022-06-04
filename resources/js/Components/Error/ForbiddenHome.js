import React from 'react';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import { t } from 'i18next';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';


const ForbiddenHome = () =>{
    return(
        <React.Fragment>
            <Paper
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Typography variant="h2" component="h2">
                   {t("403home")} 
                </Typography>
                <Typography variant="h5" component="h5" sx={{ paddingY : 3 }}>
                   {t("403homemsg")} 
                </Typography>
                <Button variant="contained" sx={{ marginX : 10 }} component={Link} to={"/app/"}>{t("homepage")}</Button>
            </Paper>
        </React.Fragment>
    )
}
export default ForbiddenHome;