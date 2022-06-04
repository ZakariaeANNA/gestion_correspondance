import React from 'react'
import { Link } from 'react-router-dom';
import {t} from 'i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';


const NotFound =  () =>{
    return(
        <div>
            <Box sx={{display: 'flex',justifyContent: 'center',alignItems: 'center'}}>
                <Box sx={{marginTop: '30vh'}}>
                    <h1 style={{ color: "red", fontSize: 100 }}>404</h1>
                    <h3>{t('notFound')}</h3>
                    <p>
                        <Button variant="text" component={Link} to={"/app/"}>{t("ReturnToPage")}</Button>
                    </p>
                </Box>
            </Box>
        </div>    
    )
}
export default NotFound;