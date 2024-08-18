import { Badge, Box, InputBase, alpha, styled } from "@mui/material";
import MuiListItemText from "@mui/material/ListItemText";

export const SearchBox = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    padding: "1rem",
  },
}));

export const StyledBadge = styled(Badge)(({ theme, status }) => ({
  "& .MuiBadge-badge": {
    ...(status === "online"
      ? { backgroundColor: "#44b700", color: "#44b700" }
      : {
          backgroundColor: theme.palette.icon.danger,
          color: theme.palette.icon.danger,
        }),
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

export const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  border: "1px solid #d6d6d6de",
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    border: `1px solid ${theme.palette.outlined.primary}`,
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(2),
    width: "auto",
  },
}));

export const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "25ch",
    },
  },
}));

export const MessageList = styled(Box)((isempty) => ({
  overflowY: isempty === "true" ? "none" : "auto",
  height: "100%",
  boxSizing: "border-box",
  "&::-webkit-scrollbar": {
    display: "none",
  },
}));

export const ContactName = styled(Box)(({ theme }) => ({
  alignItems: "center",
  display: "flex",
  [theme.breakpoints.down("md")]: {
    justifyContent: "space-between",
  },
}));

export const ListItemText = styled(MuiListItemText)(() => ({
  "& p.MuiListItemText-secondary": {
    display: "flex",
    justifyContent: "space-between",
  },
}));
