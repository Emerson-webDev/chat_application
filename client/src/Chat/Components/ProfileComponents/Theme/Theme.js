import { Box, TextField, styled } from "@mui/material";
import MuiButton from "@mui/material/Button";
import MuiAvatar from "@mui/material/Avatar";

export const ProfileBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexGrow: 1,
  [theme.breakpoints.between("xs", "md")]: {
    gap: "1rem",
    flexDirection: "column",
    height: "fit-content",
  },
  [theme.breakpoints.up("sm")]: {
    "& .MuiBottomNavigation-root": {
      display: "none",
    },
  },
  [theme.breakpoints.down("sm")]: {
    "& .MuiBottomNavigation-root": {
      "& .MuiButtonBase-root.MuiBottomNavigationAction-root": {
        "& .MuiSvgIcon-root": {
          fill: theme.palette.icon.primary,
        },
        span: {
          color: theme.palette.icon.primary,
        },
      },
      "& .MuiButtonBase-root.MuiBottomNavigationAction-root.Mui-selected": {
        "& .MuiSvgIcon-root": {
          fill: theme.palette.icon.background,
        },
        span: {
          color: theme.palette.icon.background,
        },
      },
    },
  },
}));

export const ProfileInfoSettingContainer = styled(Box)( ({theme}) => ({
  flexGrow: 1,
  padding: "1rem",
  [theme.breakpoints.between("xs","sm")] : {
    marginBottom: "60px"
  }
}))

export const PersonalInfoBox = styled(Box)( ({theme}) => ({
  display: "flex",
  width: "338px",
  [theme.breakpoints.down("md")] : {
    width: "auto"
  }
}))

export const ProfileInfoBox = styled(Box)(({ theme }) => ({
  padding: "4rem 2rem",
  display: "flex",
  gap: "5rem",
  [theme.breakpoints.between("md", "1200")]: {
    gap: "1rem",
    flexDirection: "column",
    padding: "2rem",
  },
  [theme.breakpoints.between("xs","md")]: {
    gap: "1rem",
    flexDirection: "column",
    padding: "2rem 0rem",
  }
}));

export const BackgroundBox = styled(Box)(({ theme }) => ({
  height: "160px",
  padding: "1rem",
  backgroundColor: theme.palette.default.blur,
  [theme.breakpoints.between("xs", "md")]: {
    height: "200px",
  },
}));

 export const ProfileHeader = styled(Box) ( ({theme}) => ({
  [theme.breakpoints.between("xs","sm")] : {
    display: "flex",
    justifyContent : "space-between",
    alignItems : "center"
  }
 }))

export const ProfileAvatar = styled(MuiAvatar)(({ theme }) => ({
  width: 90,
  height: 90,
  fontSize: "2rem",
  border: `2px solid ${theme.palette.maincolor.mainwhite}`,
  [theme.breakpoints.between("xs", "900")]: {
    width: 150,
    height: 150,
  },
}));

export const ProfileAvatarBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "inherit",
  position: "relative",
  marginTop: "-3rem",
  [theme.breakpoints.between("xs", "md")]: {
    marginTop: "-5rem",
  },
}));

export const ProfileSettingBox = styled(Box)(({ theme }) => ({
  padding: "2rem",
  display: "flex",
  gap: "5rem",
  [theme.breakpoints.between("xs", "1200")]: {
    gap: "1rem",
    flexDirection: "column",
  },
  [theme.breakpoints.between("xs","md")]: {
    gap: "1rem",
    flexDirection: "column",
    padding: "2rem 0rem",
  }
}));


export const ConfirmPasswordTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.default,
  },

  "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.outlined.primary,
  },

  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.outlined.primary,
  },

  "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.outlined.error,
  },

  "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-input": {
    color: theme.palette.outlined.error,
  },

  "& .MuiOutlinedInput-root": {
    color: theme.palette.text.text,
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

export const UpdatePasswordForm = styled("form")(({theme}) => ({
  display: "flex",
  flexDirection: "column",
  gap: 16,
  "& .MuiFormControl-root" : {
      flexDirection: "row",
      width: "100%",
      gap: 16,
      justifyContent: "space-between",
      [theme.breakpoints.down("md")]: {
        flexDirection: "column",
        gap: 16
      },
      [theme.breakpoints.up("md")]: {
        "& .MuiFormControl-root.MuiTextField-root": {
          width: "calc(100%/2)",
          gap: 16
        }
      },
    },
    [theme.breakpoints.up("md")]: {
      "& .MuiFormControl-root.MuiTextField-root": {
        flexDirection: "column",
      }
    },

  "& .MuiFormControl-root.MuiTextField-root": {
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.default,
  },

  "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.outlined.primary,
  },

  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.outlined.primary,
  },

  "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.outlined.error,
  },

  "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-input": {
    color: theme.palette.outlined.error,
  },

  "& .MuiOutlinedInput-root": {
    color: theme.palette.text.text,
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
  }
}));

export const UpdatePersonalForm = styled("form")(({theme}) => ({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  marginBottom: "1rem",
  "& .MuiFormControl-root.MuiTextField-root": {
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.default,
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
      color: theme.palette.text.text,
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
  }
}));

export const UpdateButton = styled(MuiButton)(({ theme }) => ({
  backgroundImage: theme.palette.maincolor.buttoncolor,
  color: theme.palette.maincolor.mainwhite,
}));
