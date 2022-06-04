import React from 'react'
import { Link } from 'react-router-dom';
import { Box } from '@mui/system';
import {t} from 'i18next';
import Button from '@mui/material/Button';


const UnAuthorized = () =>{
    return(
        <div>
            <Box sx={{display: 'flex',justifyContent: 'center',alignItems: 'center'}}>
                <Box sx={{marginTop: '30vh'}}>
                    <h1 style={{ color: "red", fontSize: 100 }}>401</h1>
                    <h3>{t('unauthorized')}</h3>
                    <p>
                        <Button variant="text" component={Link} to={"/app/"}>{t("ReturnToPage")}</Button>
                    </p>
                </Box>
            </Box>
        </div>
    )
}
export default UnAuthorized;