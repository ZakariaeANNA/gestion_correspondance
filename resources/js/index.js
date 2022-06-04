import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SnackbarProvider } from 'notistack';
import { Provider } from "react-redux";
import { store } from "./store";
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpApi from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { CircularProgress , Box  } from "@mui/material";
import { TRANSLATIONS_ARAB } from "./locales/ar/translation";
import { TRANSLATIONS_FRENCH } from "./locales/fr/translation";
i18next
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['ar', 'fr'],
    fallbackLng: 'ar',
    debug: true,
    // Options for language detector
    detection: {
      order: ['path', 'cookie', 'htmlTag'],
      caches: ['cookie'],
    },
    interpolation: {
      escapeValue: false,
    },
    // react: { useSuspense: false },
    //backend: {
    //  loadPath: 'locales/{{lng}}/translation.json',
    //},
    resources: {
      fr: {
        translation: TRANSLATIONS_FRENCH
      },
      ar: {
        translation: TRANSLATIONS_ARAB
      },
    }
  })

const loadingMarkup = (
      <Box
          sx={{
              position : "absolute",
              top : "50%",
              right : "50%"
          }}
      >
          <CircularProgress/>
      </Box>
)

createRoot(document.getElementById('app')).render(
  <Suspense fallback={loadingMarkup}>
    <SnackbarProvider maxSnack={3}>
      <Provider store={store}>
          <App />
      </Provider>
    </SnackbarProvider>
  </Suspense>);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
