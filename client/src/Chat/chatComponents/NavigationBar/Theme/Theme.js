import { Box, ListItemButton, ListItemIcon, styled } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Tooltip from "@mui/material/Tooltip";
import MuiDrawer from "@mui/material/Drawer";
import MuiPaper from "@mui/material/Paper";
import MuiBottomNavigation from "@mui/material/BottomNavigation";

const drawerWidth = 94;

export const NavBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

export const ListIcon = styled(ListItemIcon)(({ theme, active }) => ({
  ...(active === 1
    ? { color: theme.palette.icon.secondary }
    : { color: theme.palette.icon.blur }),
    "&:hover" : {
      color: active === 1 ? theme.palette.icon.secondary : theme.palette.icon.primary
    }
}));

export const ListitemButton = styled(ListItemButton)(({ theme, active }) => ({
  justifyContent: "center",
  borderRadius: "50%",
  width: "40px",
  height: "40px",
  backgroundColor: active === 1 ? theme.palette.icon.background : "transparent",
  transition: "background-color 0.3s", // Add a transition for smooth effect
  "&:hover": {
    backgroundColor: active === 1 ? theme.palette.icon.background : theme.palette.icon.blur, // Change the background color on hover
  },
}));

export const LogoutButton = styled(ExitToAppIcon)(({ theme }) => ({
  color: theme.palette.icon.blur,
}));

export const CustomWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} arrow />
))(({ theme }) => ({
  "& .MuiTooltip-tooltip": {
    backgroundColor: theme.palette.default.blur,
    borderRadius: "25px 25px 25px 25px",
    fontSize: "14px",
  },
  "& .MuiTooltip-arrow": {
    color: theme.palette.default.blur, // Use a color from the theme
  },
}));

export const Drawer = styled(MuiDrawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    boxSizing: "border-box",
    backgroundColor: theme.palette.default.primary,
    "&::-webkit-scrollbar": {
      width: ".25rem",
    },
    // "&::-webkit-scrollbar-thumb": {
    //   backgroundColor: "#d5f7eb",
    //   borderRadius: ".2rem",
    //   display: "none",
    // },
    "&::-webkit-scrollbar-thumb": {
      display: "block",
      borderRadius: ".2rem",
      backgroundColor: "#d5f7eb",
    },
  },
}));

export const Paper = styled(MuiPaper)(({ theme }) => ({
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  [theme.breakpoints.up("sm")]: {
    display: "none",
  },
  [theme.breakpoints.down("sm")]: {
    "& .MuiBottomNavigation-root": {
      backgroundColor: theme.palette.default.primary,
      "& .MuiButtonBase-root.MuiBottomNavigationAction-root": {
        "& .MuiSvgIcon-root": {
          fill: theme.palette.icon.blur,
        },
        span: {
          color: theme.palette.text.blur
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

export const BottomNavigation = styled(MuiBottomNavigation)(({ theme }) => ({
  [theme.breakpoints.between("xs", "sm")]: {
    "& .MuiButtonBase-root.MuiBottomNavigationAction-root": {
      minWidth: "70px",
      padding: 0,
    },
  },
}));
