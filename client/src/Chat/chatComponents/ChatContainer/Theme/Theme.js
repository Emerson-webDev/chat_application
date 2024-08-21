import {
  Box,
  Grid,
  Menu,
  TextField,
  Tooltip,
  Typography,
  alpha,
  styled,
  tooltipClasses,
} from "@mui/material";
import MuiIconButton from "@mui/material/IconButton";
import MuiButton from "@mui/material/Button";
import MuiButtonGroup from "@mui/material/ButtonGroup";
import MuiAvatar from "@mui/material/Avatar";
import MuiPopper from "@mui/material/Popper";
import MuiMenuItem from "@mui/material/MenuItem";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import MuiCardContent from "@mui/material/CardContent";
import MuiBox from "@mui/material/Box";
import MuiList from "@mui/material/List";
import MuiPaper from "@mui/material/Paper";
import MuiGrid from "@mui/material/Grid";
import MuiBadge from "@mui/material/Badge";
import MuiTypography from "@mui/material/Typography";
import MuiTabs from "@mui/material/Tabs";
// import MuiImageListItem from "@mui/material/ImageListItem";
import MuiImageList from "@mui/material/ImageList";
import CancelIcon from "@mui/icons-material/Cancel";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

export const MainChatContainer = styled(Box)(({ theme }) => ({
  height: "inherit",
  display: "flex",
  // [theme.breakpoints.between("xs", "sm")]: {
  //   flexDirection: "column",
  // },
}));

export const ReceivelistBox = styled(Box)(({ theme, open }) => ({
  width: "auto",
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.down(880)]: {
    ...(!open && {
      // width: "auto",
      display: "none",
      // flexDirection: "column",
    }),
    ...(open && {
      width: "100%",
      display: "flex",
      flexDirection: "column",
    }),
  },
}));

export const EmptyContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  alignItems: "center",
  justifyContent: "center",
  [theme.breakpoints.down(880)]: {
    display: "none",
  },
}));

export const ChatBoxContainer = styled(Grid)(({ theme, open }) => ({
  height: "100vh",
  flexGrow: 1,
  flexWrap: "nowrap",
  backgroundColor: theme.palette.maincolor.mainwhite,
  [theme.breakpoints.down(880)]: {
    ...(open && {
      display: "none",
    }),
  },
}));

export const Paper = styled(MuiPaper)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  padding: "1rem",
  borderRadius: 0,
  [theme.breakpoints.between("xs", "md")]: {
    padding: ".5rem",
  },
}));

export const AppHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: 6,
  alignItems: "center",
  justifyContent: "center",
  "& .MuiTypography-h5": {
    marginBottom: 4,
    fontSize: "1rem",
    fontWeight: "600",
  },
  [theme.breakpoints.down("400")]: {
    marginLeft: 10,
    "& .MuiBox-root": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginRight: ".5rem",
      width: "10px",
    },
    "& .MuiTypography-h5": {
      fontSize: ".85rem",
    },
    "& .MuiAvatar-root": {
      width: 40,
      height: 40,
    },
  },
  [theme.breakpoints.between("sm", "md")]: {
    "& .MuiBox-root": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginRight: "1rem",
    },
  },
  [theme.breakpoints.up("880")]: {
    "& .MuiBox-root": {
      display: "none",
      "& [data-testid='ArrowBackIcon']": {
        display: "none",
      },
    },
  },
}));

export const RequestActionBox = styled(Box)(({ theme }) => ({
  "& .MuiButtonGroup-root": {
    "& .MuiTypography-root": {
      padding: 8,
      [theme.breakpoints.down("400")]: {
        fontSize: ".5rem",
        padding: 4,
      },
    },
    "& .MuiButtonBase-root": {
      padding: 4,
      [theme.breakpoints.down("400")]: {
        padding: 1,
      },
    },
  },
}));

export const CameraIcon = styled(CameraAltIcon)(({ theme }) => ({
  fill: theme.palette.default.primary,
  width: "15px",
}));

export const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const EmptyChat = styled(MuiBox)(({ theme }) => ({
  "& .MuiSvgIcon-root": {
    color: theme.palette.default.blur,
    width: 80,
    height: 80,
  },
  display: "grid",
  placeItems: "center",
  height: "inherit",
  [theme.breakpoints.up("880")]: {
    width: 338,
  },
}));

export const EmptyRequest = styled(MuiBox)(({ theme }) => ({
  "& .MuiSvgIcon-root": {
    color: theme.palette.default.blur,
    width: 80,
    height: 80,
  },
  display: "grid",
  placeItems: "center",
  height: "inherit",
  [theme.breakpoints.up("880")]: {
    width: 338,
  },
}));

export const EmptyNotification = styled(MuiBox)(({ theme }) => ({
  "& .MuiSvgIcon-root": {
    color: theme.palette.default.blur,
    width: 80,
    height: 80,
  },
  display: "grid",
  placeItems: "center",
  height: "inherit",
  [theme.breakpoints.up("880")]: {
    width: 338,
  },
}));

export const ButtonGroup = styled(MuiButtonGroup)(() => ({
  "& .MuiButton-root": {
    border: "none",
  },
}));

export const RequestBox = styled(MuiBox)(({ theme }) => ({
  overflowY: "auto",
  height: "100%",
  boxSizing: "border-box",
  "&::-webkit-scrollbar": {
    display: "none",
  },
  [theme.breakpoints.down(900)]: {
    width: "100%",
  },
  [theme.breakpoints.up("880")]: {
    width: 338,
  },
}));

export const FriendBox = styled(MuiBox)(({ theme, open }) => ({
  display: "flex",
  height: "100vh",
  flexGrow: 1,
  [theme.breakpoints.down(900)]: {
    ...(!open && {
      display: "none",
    }),
  },
}));

export const FriendListBox = styled(MuiBox)(({ theme }) => ({
  overflowY: "auto",
  height: "100%",
  boxSizing: "border-box",
  "&::-webkit-scrollbar": {
    display: "none",
  },
}));

export const FriendListContainer = styled(MuiBox)(({ theme }) => ({
  // display: "flex",
  width: "auto",
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.down(900)]: {
    width: "100%",
  },
}));

export const NotificationAvatar = styled(MuiAvatar)(() => ({
  width: "30px",
  height: "30px",
  borderRadius: "50%",
}));

export const NotificationBox = styled(MuiBox)(({ theme, open }) => ({
  display: "flex",
  height: "100vh",
  flexGrow: 1,
  [theme.breakpoints.down(880)]: {
    ...(!open && {
      display: "none",
    }),
  },
}));

export const NotificationListBox = styled(MuiBox)(({ theme }) => ({
  overflowY: "auto",
  height: "100%",
  boxSizing: "border-box",
  "&::-webkit-scrollbar": {
    display: "none",
  },
  [theme.breakpoints.down("880")]: {
    width: "100%",
  },
  [theme.breakpoints.up("880")]: {
    width: 338,
  },
}));

export const NotificationListContainer = styled(MuiBox)(({ theme, open }) => ({
  width: "auto",
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.down(880)]: {
    width: "100%",
    // padding: "0",
  },
}));

export const DeleteNotificationIcon = styled(MuiIconButton)(({ theme }) => ({
  backgroundColor: theme.palette.maincolor.light_danger,
  "& .MuiSvgIcon-root": {
    fill: theme.palette.maincolor.secondary,
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.25rem",
    },
  },
  "&:hover": {
    backgroundColor: theme.palette.icon.danger,
  },
}));

export const UnreadTypography = styled(Typography)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "50%",
  backgroundColor: theme.palette.maincolor.danger,
  width: "1.2rem",
  height: "1.2rem",
  fontSize: ".75rem",
  color: theme.palette.maincolor.mainwhite,
}));

export const Avatar = styled(MuiAvatar)(() => ({
  width: "50px",
  height: "50px",
  borderRadius: "35%",
}));

export const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 100,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      fontSize: 16,
      padding: "0 1rem",
      "& .MuiSvgIcon-root": {
        fontSize: 16,
        marginRight: theme.spacing(1.25),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

export const AppStyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 100,
    padding: "1rem",
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: 0,
    },
    "& .MuiMenuItem-root": {
      padding: "0",
      "& .MuiSvgIcon-root": {
        fontSize: 20,
        marginRight: theme.spacing(1.25),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
    // [theme.breakpoints.only("sm")]: {
    //   height: 100,
    //   display: "flex",
    //   justifyContent: "center",
    //   alignItems: "center",
    //   "& .MuiMenu-list": {
    //     padding: 0,
    //   },
    //   "& .MuiMenuItem-root": {
    //     fontWeight: 700,
    //     padding: "0",
    //     height: "20px",
    //     "& .MuiSvgIcon-root": {
    //       fontSize: 20,
    //       marginRight: theme.spacing(1.25),
    //     },
    //     "&:active": {
    //       backgroundColor: alpha(
    //         theme.palette.primary.main,
    //         theme.palette.action.selectedOpacity
    //       ),
    //     },
    //   },
    // },
    // [theme.breakpoints.only("xs")]: {
    // height: 100,
    // padding: ".5rem",
    // "& .MuiMenu-list": {
    //   padding: 0,
    // },
    // "& .MuiMenuItem-root": {
    //   fontWeight: 700,
    //   padding: "0",
    //   height: "10px !important",
    //   "& .MuiSvgIcon-root": {
    //     fontSize: 20,
    //     marginRight: theme.spacing(1.25),
    //   },
    //   "&:active": {
    //     backgroundColor: alpha(
    //       theme.palette.primary.main,
    //       theme.palette.action.selectedOpacity
    //     ),
    //   },
    // },
    // },
  },
}));

export const DeleteIcon = styled(DeleteOutlinedIcon)(({ theme }) => ({
  color: theme.palette.icon.danger,
}));

export const AccountIcon = styled(AccountCircleOutlinedIcon)(({ theme }) => ({
  color: theme.palette.icon.background,
}));

export const IconButton = styled(MuiIconButton)(({ theme }) => ({
  backgroundColor: theme.palette.maincolor.secondary,
  width: 40,
  height: 40,
  "& .MuiSvgIcon-root": {
    color: theme.palette.icon.primary,
  },
  "&:hover": {
    backgroundColor: theme.palette.icon.background, // Change the background color on hover
    "& .MuiSvgIcon-root": {
      fill: theme.palette.icon.secondary,
    },
  },
  [theme.breakpoints.down("sm")]: {
    width: 30,
    height: 30,
    "& .MuiSvgIcon-root": {
      width: 16,
      height: 16,
    },
  },
}));

export const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.default.primary,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.default.primary,
    fontSize: "14px",
  },
}));

export const PaperSenderSkeleton = styled(MuiPaper)(({ theme }) => ({
  borderRadius: "6px 0 6px 6px",
  // backgroundColor: theme.palette.default.senderbackground,
}));

export const PaperRecieverSkeleton = styled(MuiPaper)(({ theme }) => ({
  borderRadius: "0 6px 6px 6px",
  // backgroundColor: theme.palette.default.receiverbackground,
}));

export const PaperSenderMessage = styled(MuiPaper)(({ theme }) => ({
  borderRadius: "6px 0 6px 6px",
  backgroundColor: theme.palette.default.senderbackground,
}));

export const PaperRecieverMessage = styled(MuiPaper)(({ theme }) => ({
  borderRadius: "0 6px 6px 6px",
  backgroundColor: theme.palette.default.receiverbackground,
}));

export const SenderCardContent = styled(MuiCardContent)(({ theme }) => ({
  display: "flex",
  gap: 1,
  padding: 10,
  "&:last-child": {
    paddingBottom: 8,
  },
  "& .MuiTypography-root": {
    color: theme.palette.text.white,
    textAlign: "right",
  },
}));

export const RecieverCardContent = styled(MuiCardContent)(({ theme }) => ({
  padding: 10,
  "&:last-child": {
    paddingBottom: 8,
  },
  "& .MuiTypography-root": {
    color: theme.palette.text.primary,
    textAlign: "left",
  },
}));

export const SenderMessageBox = styled(MuiBox)(() => ({
  display: "flex",
  gap: "1rem",
  "& .MuiGrid-container": {
    "& .MuiGrid-item": {
      "& .MuiBox-root": {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        "& .MuiTypography-body1": {
          lineHeight: 1.57,
          fontSize: 16,
          fontWeight: 400,
        },
      },
      "& .MuiTypography-subtitle2": {
        textAlign: "right",
        fontSize: 12,
        color: "#0000008a",
        marginTop: ".5rem",
      },
    },
  },
}));

export const RecieverMessageBox = styled(MuiBox)(() => ({
  display: "flex",
  gap: "1rem",
  "& .MuiGrid-container": {
    "& .MuiGrid-item": {
      "& .MuiBox-root": {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        "& .MuiTypography-body1": {
          lineHeight: 1.57,
          fontSize: 16,
          fontWeight: 400,
        },
      },
      "& .MuiTypography-subtitle2": {
        textAlign: "left",
        fontSize: 12,
        color: "#0000008a",
        marginTop: ".5rem",
      },
    },
  },
}));

export const ImageMessageList = styled(MuiImageList)(({ theme }) => ({
  width: 300,
  height: "auto",
  borderRadius: ".5rem",
  "& .MuiImageListItem-root": {
    border: `1px solid ${theme.palette.outlined.secondary}`,
  },
  [theme.breakpoints.between("md", "lg")]: {
    width: 200,
    eight: "auto",
    borderRadius: ".5rem",
  },
  [theme.breakpoints.between("sm", "md")]: {
    width: 200,
    eight: "auto",
    borderRadius: ".5rem",
  },
  [theme.breakpoints.between("xs", "sm")]: {
    width: 150,
    eight: "auto",
    borderRadius: ".5rem",
  },
}));

export const MessageContainer = styled(MuiGrid)(({ theme }) => ({
  boxSizing: "border-box",
  "&::-webkit-scrollbar": {
    width: ".35rem",
  },
  // "&::-webkit-scrollbar-thumb": {
  //   backgroundColor: theme.palette.default.primary,
  //   borderRadius: ".2rem",
  //   display: "none",
  // },
  "&::-webkit-scrollbar-thumb": {
    display: "block",
    borderRadius: ".2rem",
    backgroundColor: theme.palette.default.primary,
  },
}));

export const EmojiBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: "18%",
  [theme.breakpoints.only("xs")]: {
    bottom: "10%",
  },
  [theme.breakpoints.only("sm")]: {
    bottom: "15%",
  },
}));

export const TypographyMessage = styled(MuiTypography)(({ theme }) => ({
  fontSize: 14,
  fontWeight: 700,
}));

export const TypographyActive = styled(MuiTypography)(({ theme }) => ({
  color: theme.palette.text.white,
  backgroundColor: theme.palette.default.active,
  borderRadius: "1rem",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: ".75rem",
  padding: ".25rem 0",
  width: "85px",
  [theme.breakpoints.down("400")]: {
    fontSize: ".5rem",
    width: "50px",
  },
}));

export const TypographyOffline = styled(MuiTypography)(({ theme }) => ({
  color: theme.palette.text.white,
  backgroundColor: theme.palette.default.unActive,
  borderRadius: "1rem",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: ".75rem",
  padding: ".25rem 0",
  width: "85px",
  [theme.breakpoints.down("sm")]: {
    fontSize: ".65rem",
    width: "50px",
  },
}));

export const ActiveCallActionBox = styled(MuiIconButton)(({ theme }) => ({
  width: 80,
  height: 80,
  "& .MuiSvgIcon-root": {
    fontSize: "1.25em",
    [theme.breakpoints.down("880")]: {
      fontSize: "1em",
    },
  },
  "& .MuiSvgIcon-root[data-testid='CallEndIcon']": {
    fill: theme.palette.icon.danger,
  },
  [theme.breakpoints.down("880")]: {
    width: 50,
    height: 50,
  },
}));

export const ComposerIconButton = styled(MuiIconButton)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? "#dcf7f4b0" : theme.palette.icon.blur,
  "& .MuiSvgIcon-root": {
    fill: theme.palette.mode === "light" ? theme.palette.outlined.primary : theme.palette.icon.primary,
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.25rem",
    },
  },
  "&:hover": {
    backgroundColor: theme.palette.mode === "light" ? "#acf7efb0" : theme.palette.icon.background, 
    "& .MuiSvgIcon-root": {
      fill: theme.palette.mode === "dark" && theme.palette.outlined.whiteoutlined
  },
  },
}));

export const SendIconButton = styled(MuiIconButton)(({ theme }) => ({
  backgroundColor: "#01b6c58f", //theme.palette.icon.background ,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transform: "rotate(-45deg)",
  padding: "8px 4px 8px 8px",
  width: 40,
  height: 40,
  [theme.breakpoints.down("sm")]: {
    width: 35,
    height: 35,
  },
  "&:hover": {
    backgroundColor: theme.palette.icon.background,
    "& .MuiSvgIcon-root": {
      fill: theme.palette.icon.secondary,
    },
  },
  "& .MuiSvgIcon-root": {
    top: -40,
    fill: theme.palette.icon.secondary,
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.25rem",
    },
  },
}));

export const List = styled(MuiList)(({ theme }) => ({
  display: "flex",
  overflowX: "auto",
  scrollBehavior: "smooth",
  marginBottom: 4,

  boxSizing: "border-box",
  "&::-webkit-scrollbar": {
    height: ".5rem",
  },
  "&::-webkit-scrollbar-thumb": {
    display: "block",
    borderRadius: ".2rem",
    backgroundColor: theme.palette.default.primary,
  },
  "& .MuiListItem-root": {
    display: "block",
  },
}));

export const FileMessageBox = styled(Box)(({ theme }) => ({
  width: "100%",
  overflowX: "auto",
  scrollBehavior: "smooth",
  marginBottom: 4,

  boxSizing: "border-box",
  "&::-webkit-scrollbar": {
    height: ".5rem",
  },
  "&::-webkit-scrollbar-thumb": {
    display: "block",
    borderRadius: ".2rem",
    backgroundColor: theme.palette.default.primary,
  },
}));

export const Badge = styled(MuiBadge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    height: "25px",
    color: theme.palette.icon.secondary,
    backgroundColor: theme.palette.icon.primary,
    borderRadius: "50%",
    "& .MuiSvgIcon-root": {
      fontSize: "14px",
    },
  },
}));

export const FriendRequestBadge = styled(MuiBadge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: "-8px",
    backgroundColor: theme.palette.icon.danger,
  },
}));

export const CustomWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} arrow />
))(({ theme }) => ({
  "& .MuiTooltip-tooltip": {
    backgroundColor: theme.palette.default.primary,
  },
  "& .MuiTooltip-arrow": {
    color: theme.palette.default.primary, // Use a color from the theme
  },
}));

export const ChatTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.default,
  },

  "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.outlined.primary,
  },

  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.outlined.primary,
  },

  "& .MuiInputLabel-outlined.Mui-focused": {
    color: theme.palette.outlined.primary,
    "& .MuiTouchRipple-root": {
      color: theme.palette.outlined.primary,
    },
  },
  "& .MuiInputBase-root": {
    [theme.breakpoints.down("sm")]: {
      fontSize: ".75rem",
    },
  },
}));

export const Tabs = styled(MuiTabs)(({ theme }) => ({
  "& .MuiTabs-scroller": {
    "& .MuiTabs-flexContainer": {
      "& .MuiButtonBase-root": {
        color: theme.palette.text.primary,
        "& .MuiTouchRipple-root": {
          color: theme.palette.maincolor.primary,
        },
      },
    },
    "& span.MuiTabs-indicator": {
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.maincolor.primary,
    },
  },
}));

export const UserFileContainer = styled(Box)(({ theme, open }) => ({
  ...(open === 1 && {
    width: "365px",
    height: "100vh",

    display: "flex",
    flexDirection: "column",
    padding: "1rem",
    transform: "translateX(0px)",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.standard,
    }),
  }),
  ...(!open === 0 && {
    width: 0,
    transform: "translateX(365px)",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.standard,
    }),
  }),
}));

export const AttachmentBox = styled(MuiImageList)(({ theme }) => ({
  width: "inherit",
  height: "inherit",
  scrollBehavior: "smooth",
  "&::-webkit-scrollbar": {
    height: ".5rem",
    width: ".25rem",
  },
  "&::-webkit-scrollbar-thumb": {
    display: "block",
    borderRadius: ".2rem",
    backgroundColor: theme.palette.default.primary,
  },
  "& .MuiImageListItem-root": {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    "& img": {
      width: "100%",
      height: "100%",
      objectFit: "contain",
    },
  },
}));

export const FileBox = styled(Box)(({ theme }) => ({
  scrollBehavior: "smooth",
  "&::-webkit-scrollbar": {
    height: ".5rem",
    width: ".25rem",
  },
  "&::-webkit-scrollbar-thumb": {
    display: "block",
    borderRadius: ".2rem",
    backgroundColor: theme.palette.default.primary,
  },
}));

export const Button = styled(MuiButton)(({ theme }) => ({
  backgroundColor: theme.palette.default.primary,
  "&:hover": {
    backgroundColor: theme.palette.icon.background,
  },
}));

export const Popper = styled(MuiPopper)(({ theme }) => ({
  "& .MuiPaper-root": {
    marginTop: "1rem",
  },
}));

export const MenuItem = styled(MuiMenuItem)(() => ({
  alignItems: "center",
  gap: ".5rem",
}));

export const CancelRequestIcon = styled(CancelIcon)(({ theme }) => ({
  color: theme.palette.icon.danger,
}));

export const RejectIcon = styled(ThumbDownIcon)(({ theme }) => ({
  color: theme.palette.icon.danger,
}));

export const OptionItems = styled("span")(() => ({
  display: "flex",
  alignItems: "center",
  gap: ".25rem",
  cursor: "pointer",
}));

export const CallIconButton = styled(MuiIconButton)(({ theme }) => ({
  backgroundColor: theme.palette.maincolor.danger,
  width: "40px",
  height: "40px",
  animation: "button 1.5s infinite alternate-reverse",
  "& .MuiSvgIcon-root": {
    color: theme.palette.icon.secondary,
  },
  "&:hover": {
    backgroundColor: theme.palette.maincolor.light_danger, // Change the background color on hover
  },
  "@keyframes button": {
    "0%": {
      transform: "scale(1)",
    },
    "100%": {
      transform: "scale(1.1)",
    },
  },
}));

export const AnswerCallIconButton = styled(MuiIconButton)(({ theme }) => ({
  backgroundColor: theme.palette.maincolor.success,
  width: "40px",
  height: "40px",
  animation: "button 1.5s infinite alternate-reverse",
  "& .MuiSvgIcon-root": {
    color: theme.palette.icon.secondary,
  },
  "&:hover": {
    backgroundColor: theme.palette.maincolor.light_success, // Change the background color on hover
  },
  "@keyframes button": {
    "0%": {
      transform: "scale(1)",
    },
    "100%": {
      transform: "scale(1.1)",
    },
  },
}));

export const AnswerCallRipple = styled(Box)(({ theme }) => ({
  position: "relative",
  "&::before": {
    position: "absolute",
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    backgroundColor: theme.palette.maincolor.success,
    borderRadius: "50%",
    animation: "ripple 1.25s infinite ease-in-out",
    border: `1px solid ${theme.palette.maincolor.success}`,
    content: '""',
    "@keyframes ripple": {
      "0%": {
        transform: "scale(0)",
        opacity: 1,
      },
      "100%": {
        transform: "scale(2.5)",
        opacity: 0,
      },
    },
  },
}));

export const CancelCallRipple = styled(Box)(({ theme }) => ({
  position: "relative",
  "&::before": {
    position: "absolute",
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    backgroundColor: theme.palette.maincolor.danger,
    borderRadius: "50%",
    animation: "ripple 1.25s infinite ease-in-out",
    border: `1px solid ${theme.palette.maincolor.danger}`,
    content: '""',
    "@keyframes ripple": {
      "0%": {
        transform: "scale(0)",
        opacity: 1,
      },
      "50%": {
        transform: "scale(1)",
        opacity: 1,
      },
      "100%": {
        transform: "scale(2.5)",
        opacity: 0,
      },
    },
  },
}));

export const LocalVideoBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.default.primary,
  width: "300px",
  height: "200px",
  position: "absolute",
  right: 0,
  top: 0,
  [theme.breakpoints.between("xs", "sm")]: {
    width: "150px",
    height: "250px",
  },
}));
