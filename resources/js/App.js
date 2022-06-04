import React, { useEffect } from 'react'
import Login from './Components/Login/Login';
import Home from "./Home";
import './App.css';
import { BrowserRouter as Router , Route , Switch , Redirect } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import cookies from 'js-cookie';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import fontTheme from "./Util/fontTheme";
import NotFound from './Components/Error/NotFound';
import UnAuthorized from './Components/Error/UnAuthorized';
import Forbidden from './Components/Error/Forbidden';

const languages = [
  {
    code: 'fr',
    name: 'Français',
    country_code: 'fr',
  },
  {
    code: 'ar',
    name: 'العربية',
    dir: 'rtl',
    country_code: 'sa',
  },
]


function App() {

  const currentLanguageCode = cookies.get('i18next') || 'ar'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation();
  useEffect(() => {
    document.body.dir = currentLanguage.dir || 'ltr'
    document.title = t('project_title')
    document.body.setAttribute("dir", currentLanguageCode === "ar" ? "rtl" : "ltr");
  }, [currentLanguage, t])
  

  return (
    <ThemeProvider theme={fontTheme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Switch>
            <Redirect exact from="/" to="/app/"/>
            <Route exact path="/auth" >
              <Login />
            </Route>
            <Route path="/app/*">
              <Home />
            </Route>
            <Route exact path="/403">
              <Forbidden />
            </Route>
            <Route exact path="/401">
              <UnAuthorized />
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </div>        
      </Router>
    </ThemeProvider>
  );
}

export default App;
