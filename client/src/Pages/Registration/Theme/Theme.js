import { Box, Button, TextField, Typography, styled } from "@mui/material";

import MuiGrid from "@mui/material/Grid";
import MuiBox from "@mui/material/Box";
import { Link } from "react-router-dom";

export const WelcomeInterface = styled(MuiGrid)(({ theme }) => ({
  background:
    "linear-gradient(303deg, rgba(34,54,69,1) 0%, rgba(1,182,197,1) 69%)",
  display: "grid",
  "& .MuiBox-root": {
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    justifyContent: "start",
    "& .MuiAvatar-root": {
      width: 250,
      height: 250,
      padding: 2,
    },
    "& .MuiTypography-subtitle1": {
      fontSize: "1.2rem",
      fontWeight: "bold",
      color: theme.palette.text.primary,
    },
  },
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

//right side part of the sign in in which is the form
export const AppLogo = styled(MuiBox)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    display: "flex",
    justifyContent: "space-around",
    "& .MuiAvatar-root": {
      width: "100px",
      height: "100px",
    },
  },
  [theme.breakpoints.between("md", "xl")]: {
    display: "none",
  },
}));

export const CustomTypographyH5 = styled(Typography)(({ theme }) => ({
  fontSize: "2rem",
  textAlign: "center",
  color: theme.palette.default.primary,
  [theme.breakpoints.down("sm")]: {
    fontSize: "1rem",
  },
  [theme.breakpoints.between("sm", "md")]: {
    fontSize: "1.5rem",
  },
  [theme.breakpoints.down("md")]: {
    fontSize: "1.5rem",
  },
}));

export const CustomTypographySubtitle1 = styled(Typography)(({ theme }) => ({
  fontSize: 16,
  marginTop: 2,
  marginBottom: "1.5rem",
  textAlign: "center",
  color: theme.palette.default.blur,
   [theme.breakpoints.down("md")]: {
    fontSize: 16,
  },
  [theme.breakpoints.between("md", "lg")]: {
    fontSize: "1.25rem",
  },
}));

export const SignInForm = styled(MuiBox)(({ theme }) => ({
  height: "100%",
  "& .MuiContainer-root": {
    height: "inherit",
    width: "100%",
    [theme.breakpoints.between("sm", "md")]: {
      margin: "auto",
      padding: "1rem 5rem",
      display: "flex",
    },
    [theme.breakpoints.between("md", "lg")]: {
      padding: "1.5rem 4rem",
    },
    [theme.breakpoints.up("lg")]: {
      padding: "1.5rem 6rem",
    },
    [theme.breakpoints.between("xs", "sm")]: {
      padding: "1rem 2rem",
      display: "flex",
    },
    "&  .MuiStack-root": {
      width: "inherit",
      [theme.breakpoints.between("sm", "md")]: {
        margin: "auto",
        padding: "none",
      },
      [theme.breakpoints.down("md")]: {
        padding: "none",
      },

      "&  .MuiStack-root": {
        [theme.breakpoints.between("sm", "md")]: {
          margin: "auto",
          padding: "none",
        },
        [theme.breakpoints.down("md")]: {
          width: "100%",
          padding: "none",
        },
      },
    },
  },
}));

export const LogInLink = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  fontWeight: "bold",
  color: theme.palette.text.text,
}));

export const RegistrationButtonBox = styled(Box)( ({theme}) => ({
  marginTop: 32,
  [theme.breakpoints.down("sm")] : {
    marginTop: 24
  }
}))

export const RegistrationButton = styled(Button)(({theme}) => ({
  color: theme.palette.maincolor.mainwhite,
  "&.MuiButtonBase-root": {
    "&.MuiButtonBase-root": {
      background:
        "linear-gradient(303deg, rgba(34,54,69,1) 0%, rgba(1,182,197,1) 69%)",
    },
  },
}));

export const GoogleButton = styled(Button)(({theme}) => ({
  color: theme.palette.maincolor.mainwhite,
  backgroundImage:
    "linear-gradient( 305deg,hsl(5deg 69% 54%) 8%, hsl(7deg 75% 62%) 83%,hsl(9deg 81% 70%) 95%,hsl(9deg 88% 78%) 99%,hsl(10deg 96% 86%) 101%,hsl(10deg 100% 93%) 101%,hsl(0deg 0% 100%) 100%)",
  justifyContent: "none",
}));

export const GitHubButton = styled(Button)(({theme}) => ({
  color: theme.palette.maincolor.mainwhite,
  backgroundImage:
    "linear-gradient(322deg, rgba(24,24,24,1) 69%, rgba(91,91,91,1) 90%, rgba(129,129,129,1) 96%, rgba(135,135,135,1) 100%)",
}));

export const InputTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.default.blur,
  },

  "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.outlined.primary,
  },

  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.outlined.primary,
  },

  "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline": {
    borderColor: "#ff5252",
  },

  "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-input": {
    color: "#ff5252",
  },

  "& .MuiOutlinedInput-root": {
    color: "#2e745e",
  },

  "& .MuiInputLabel-outlined": {
    color: "#b3b3b3",
  },

  "&:hover .MuiInputLabel-outlined": {
    color: theme.palette.text.text,
  },

  "& .MuiInputLabel-outlined.Mui-focused.Mui-error": {
    color: theme.palette.text.error,
  },

  "& .MuiInputLabel-outlined.Mui-focused": {
    color: theme.palette.outlined.primary,
  },
}));
