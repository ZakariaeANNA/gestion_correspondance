import React,{ useEffect } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router-dom';
import { useSigninUserMutation } from "../../store/api/authApi";
import { useTranslation } from 'react-i18next';
import i18next from 'i18next'
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import fontTheme from "../../Util/fontTheme";
import Alert from '@mui/material/Alert';
import { useLocation } from "react-router-dom";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

const cacheLtr = createCache({
  key: "muiltr"
});

const cacheRtl = createCache({
  key: "muirtl",
  // prefixer is the only stylis plugin by default, so when
  // overriding the plugins you need to include it explicitly
  // if you want to retain the auto-prefixing behavior.
  stylisPlugins: [prefixer, rtlPlugin]
});


const ltrTheme = createTheme({ direction: "ltr" });
const rtlTheme = createTheme({ direction: "rtl" });

export default function Login() {
  const { enqueueSnackbar } = useSnackbar();
  const [signinUser, { data, isLoading, error, isError, isSuccess }] = useSigninUserMutation();
  const history = useHistory();
  const { t } = useTranslation();
  const { appState } = useLocation();
  const [values, setValues] = React.useState({
    password: '',
    showPassword: false,
  });
  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  useEffect(()=>{
    if (isSuccess) {
      localStorage.setItem( "token" , data );
      enqueueSnackbar( t('credentials_success') ,  { variant: "success" });
      history.push("/app/");
    }
    if (isError) {
      if( error.data === "credentials/false"){
        enqueueSnackbar( t('credentials_invalid') ,  { variant: "error" });
      }else if(error.data === "credentials/empty"){
        enqueueSnackbar( t('credentials_empty') ,  { variant: "error" });
      }
    }
  });
  
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const auth = new FormData(event.currentTarget);
    signinUser({ doti: auth.get('doti'), password: auth.get('password') });
  };


  return (
    <CacheProvider value={i18next.language === "ar" ? cacheRtl: cacheLtr}>
      <ThemeProvider theme={i18next.language === "ar" ? { rtlTheme , fontTheme } : { ltrTheme , fontTheme }}>
        <Grid container component="main" sx={{ height: '100vh' }}>
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage: 'url(/images/loginBackground.jpg)',
              backgroundRepeat: 'no-repeat',
              backgroundColor: (t) =>
                t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
              backgroundPosition: 'center',
              backgroundSize : "contain"
            }}
          />
          <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
            <Box
              sx={{
                my: 4,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Box sx={{paddingY : 2}}>
                <img src="/images/ministry-logo-ar.png" style={{ display: "block", height: "auto", maxWidth: "23.47rem" , width: "100%" }} />
              </Box> 
              <Typography component="h1" variant="h5" sx={{ fontSize : 35 , fontWeight : "bold" , color : "primary.main" }}>
                  {t('name_company')}
              </Typography>
              <Typography component="h3" variant="h5" sx={{ fontSize : 25 , fontWeight : "bold" }}>
                  {t('project_title')}
              </Typography>
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                { appState ? <Alert severity="warning">{t('session_terminated')}</Alert> : null }
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="doti"
                  label={t('doti')}
                  name="doti"
                  autoComplete="doti"
                  autoFocus
                  disabled={isLoading}
                />
                <FormControl fullWidth variant="outlined" margin="normal">
                  <InputLabel htmlFor="outlined-adornment-password">{t('password')}</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={values.showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {values.showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label={t('password')}
                    disabled={isLoading}
                  />
                </FormControl>
                { isLoading ? (
                  <LoadingButton 
                    fullWidth
                    loading 
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Submit
                  </LoadingButton>
                ) : (
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    {t('login')}
                  </Button>
                )}
              </Box>
              <Box sx={{ display : "flex" , flexDirection : "row" }}>
                <Button
                  variant="text"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={() => {
                    i18next.changeLanguage("fr");
                  }}
                >
                  {t('fr')}
                </Button>
                <Button
                  variant="text"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={() => {
                    i18next.changeLanguage("ar");
                  }}
                >
                  {t('ar')}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </CacheProvider>
  );
}