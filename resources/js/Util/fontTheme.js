import { createTheme } from '@mui/material/styles';

const fontTheme = createTheme({
    typography: {
      allVariants: {
        fontFamily: `'Source Sans Pro' , 'Noto Kufi Arabic' , sans-serif;`,
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500
      },
    },
    
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          @font-face {
            font-family: 'Source Sans Pro' , 'Noto Kufi Arabic' , sans-serif;
            font-style: normal;
          }
        `,
      },
    },
});

export default fontTheme;