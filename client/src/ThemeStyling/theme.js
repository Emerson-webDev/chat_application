import { blueGrey, cyan, green, grey, red } from "@mui/material/colors";

export const getCustomTheme = (mode) => ({
  typography: {
    fontFamily: ['"Nunito"', "sans-serif"].join(","),
  },
  palette: {
    mode: mode,
    maincolor: {
      ...(mode === "light"
        ? {
            primary: cyan[500],
            secondary: grey[300],
            mainwhite: grey[50],
            buttoncolor:
              "linear-gradient(303deg, rgba(34,54,69,1) 0%, rgba(1,182,197,1) 69%)",
            success: green[600],
            danger: red[600],
            light_success: green[300],
            light_danger: red[300],
          }
        : {
            primary: cyan[500],
            secondary: grey[300],
            mainwhite: grey[50],
            buttoncolor:
              "linear-gradient(303deg, rgba(34,54,69,1) 0%, rgba(1,182,197,1) 69%)",
            success: green[600],
            danger: red[600],
            light_success: green[300],
            light_danger: red[300],
          }),
    },
    default: {
      primary: blueGrey[800],
      senderbackground: cyan[500],
      receiverbackground: cyan[50],
      unActive: red[600],
      active: green[600],
      blur: grey[400],
    },
    icon: {
      primary: blueGrey[800],
      secondary: grey[50],
      background: cyan[500],
      danger: red[600],
      success: green[600],
      blur: grey[400],
    },
    outlined: {
      primary: cyan[500],
      secondary: blueGrey[300],
      whiteoutlined: grey[50],
      blurredoutlined: blueGrey[400],
      error: red[600],
    },
    text: {
      ...(mode === "light"
        ? {
            primary: blueGrey[900],
            secondary: blueGrey[300],
            current: blueGrey[900],
            text: cyan[500],
            white: grey[500],
            sender: grey[50],
            receiver: blueGrey[900],
            error: red[600],
            blur: grey[400],
          }
        : {
            primary: blueGrey[50],
            secondary: blueGrey[300],
            current: blueGrey[900],
            text: cyan[500],
            white: grey[50],
            sender: grey[50],
            receiver: blueGrey[900],
            error: red[600],
            blur: grey[400],
          }),
    },
    background: {
      ...(mode === "light"
        ? {
            paper: grey[50],
            default: grey[50],
          }
        : {
            paper: blueGrey[900],
            default: blueGrey[900],
          }),
    },
  },

  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1240,
      xl: 1536,
    },
  },
});
