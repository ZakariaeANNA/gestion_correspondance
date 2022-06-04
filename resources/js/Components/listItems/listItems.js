import React , { useEffect , useState } from 'react';
import "./listItems.css";
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PeopleIcon from '@mui/icons-material/People';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import School from '@mui/icons-material/School';
import CorporateFare from '@mui/icons-material/CorporateFare';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';



export const MainListItems = (props) => {
  const { t } = useTranslation();
  const [logoMedium , setLogoMedium] = useState(false);  
  let autoResize = () => {
    if( window.innerWidth < 600 )
      setLogoMedium(true);
    else
      setLogoMedium(false);
  }
  useEffect(() => {
      window.addEventListener('resize', autoResize)
      autoResize();  
  }, [])

  return (
    <React.Fragment>
      <Tooltip title={t('exportation')} placement="right">
        <ListItemButton
          component={NavLink} 
          to={'/app/exportations'} 
          activeClassName="Mui-selected"
          sx={{
            py : 2,
            "&.Mui-selected": {
              backgroundColor: "rgb(216, 234, 251 , 0.38)",
            }
          }}
        >
          <ListItemIcon>
            <ForwardToInboxIcon sx={{ color : "white" }} fontSize={props.open === false && !logoMedium ? 'large' : 'medium'} />
          </ListItemIcon>
          <ListItemText primary={t('exportation')} sx={{alignItems: "flex-start" , display : "inherit"}} />
        </ListItemButton>
      </Tooltip>
      <Tooltip title={t('importation')} placement="right">
        <ListItemButton 
          component={NavLink} 
          to={'/app/importations'} 
          activeClassName="Mui-selected"
          sx={{
            py : 2 ,
            "&.Mui-selected": {
              backgroundColor: "rgb(216, 234, 251 , 0.38)",
            }
          }}
        >
          <ListItemIcon>
            <MoveToInboxIcon sx={{ color : "white" }} fontSize={props.open === false && !logoMedium ? 'large' : 'medium'}  />
          </ListItemIcon>
          <ListItemText primary={t('importation')} sx={{ alignItems: "flex-start" , display : "inherit"}} />
        </ListItemButton>
      </Tooltip>
    </React.Fragment>
  );
} 

export const SecondaryListItems = (props) => {
  const { t } = useTranslation();
  const auth = useSelector( state => state.auth.user );
  const [logoMedium , setLogoMedium] = useState(false);  
  let autoResize = () => {
    if( window.innerWidth < 600 )
      setLogoMedium(true);
    else
      setLogoMedium(false);
  }
  useEffect(() => {
      window.addEventListener('resize', autoResize)
      autoResize();  
  }, [])
  return (
    <React.Fragment>
      { auth?.role === "admin" ? (
        <>
          <Tooltip title={t('users_management')} placement="right">
            <ListItemButton 
              component={NavLink} 
              to={'/app/users'} 
              activeClassName="Mui-selected"
              sx={{
                py : 2 ,
                "&.Mui-selected": {
                  backgroundColor: "rgb(216, 234, 251 , 0.38)",
                }
              }}
            >
              <ListItemIcon>
                <PeopleIcon sx={{ color : "white" }} fontSize={props.open === false && !logoMedium ? 'large' : 'medium'} />
              </ListItemIcon>
                <ListItemText primary={t('users_management')} sx={{ alignItems: "flex-start" , display : "inherit"}} />
            </ListItemButton>
          </Tooltip>
          <Tooltip title={t('dep_management')} placement="right">
            <ListItemButton 
              component={NavLink} 
              to={'/app/departement'} 
              activeClassName="Mui-selected"
              sx={{
                py : 2 ,
                "&.Mui-selected": {
                  backgroundColor: "rgb(216, 234, 251 , 0.38)",
                }
              }}
            >
              <ListItemIcon>
                <CorporateFare sx={{ color : "white" }} fontSize={props.open === false && !logoMedium ? 'large' : 'medium'}  />
              </ListItemIcon>
                <ListItemText primary={t('dep_management')} sx={{ alignItems: "flex-start" , display : "inherit"}} />
            </ListItemButton>
          </Tooltip>
          <Tooltip title={t('eta_management')} placement="right">
            <ListItemButton 
              component={NavLink} 
              to={'/app/etablissement'} 
              activeClassName="Mui-selected"
              sx={{
                py : 2 ,
                "&.Mui-selected": {
                  backgroundColor: "rgb(216, 234, 251 , 0.38)",
                }
              }}
            >
              <ListItemIcon>
                <School sx={{ color : "white" }} fontSize={props.open === false && !logoMedium ? 'large' : 'medium'} />
              </ListItemIcon>
                <ListItemText primary={t('eta_management')} sx={{ alignItems: "flex-start" , display : "inherit"}} />
            </ListItemButton>
          </Tooltip>
        </>
      ):null}
    </React.Fragment>
  );
}