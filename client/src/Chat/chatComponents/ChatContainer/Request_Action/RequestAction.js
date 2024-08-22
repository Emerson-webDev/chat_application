import { Typography } from "@mui/material";
// import Button from "@mui/material/Button";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ButtonGroup from "@mui/material/ButtonGroup";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
// import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import React, { useContext, useRef, useState } from "react";
import { AuthContext } from "../../../../useContext/AuthContext";
import { ChatUserContext } from "../../../../useContext/ChatUserContext";
import {
  Button,
  CancelRequestIcon,
  MenuItem,
  OptionItems,
  Popper,
  RejectIcon,
  RequestActionBox,
} from "../Theme/Theme";
import API from "../../../../API/API";

const currentUser_options = ["Pending", "Cancel"];
const dataUser_options = ["Confirm", "Reject"];
const friends_options = ["Friend", "Unfriend"];

export default function RequestAction({
  dataChatId,
  requestBy,
  requestTo,
  requestStatus,
  friendRequestHandler,
}) {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatUserContext);

  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const anchorRef = useRef(null);


  const handleMenuItemClick = async (event, index, option) => {
    setSelectedIndex(index);
    setOpen(false);
    try {
      option === "Confirm"
        ? await API.post(`/accept_request/${currentUser.uid}`, {
                ids: [data.user.uid, data.chatId, currentUser.displayName || currentUser.reloadUserInfo.screenName,currentUser.photoURL],
              })
        : await API.delete(
            `/reject_request/${currentUser.uid}`,{
              params: {
                datauserId: data.user.uid,
                dataChatId: data.chatId
              }      
            } 
          );
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };
// console.log(requestStatus);

  return (
    <RequestActionBox>
      <ButtonGroup
        variant="contained"
        ref={anchorRef}
        aria-label="split button"
      >
        <Typography p={1}>
          {dataChatId === data.chatId &&
          requestBy === currentUser.uid &&
          requestStatus === "pending" ? (
            <>
              <OptionItems>
                <PendingActionsIcon fontSize="small" />
                {currentUser_options[selectedIndex]}
              </OptionItems>
            </>
          ) : dataChatId === data.chatId &&
            requestTo === currentUser.uid &&
            requestStatus === "pending" ? (
            <>
              <OptionItems onClick={(event) => handleMenuItemClick(event, selectedIndex, dataUser_options[selectedIndex])}>
                <ThumbUpAltIcon fontSize="small" />
                {dataUser_options[selectedIndex]}
              </OptionItems>
            </>
          ) : (
            <>
              <OptionItems>
                <PeopleAltIcon fontSize="small" />
                {friends_options[selectedIndex]}
              </OptionItems>
            </>
          )}
        </Typography>

        <Button
          size="small"
          aria-controls={open ? "split-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {dataChatId === data.chatId &&
                  requestBy === currentUser.uid &&
                  requestStatus === "pending"
                    ? currentUser_options
                        .filter((options, index) => index !== selectedIndex)
                        .map((option, index) => (
                          <MenuItem
                            key={option}
                            selected={index === selectedIndex}
                            onClick={(event) =>
                              handleMenuItemClick(event, index, option)
                            }
                          >
                            <CancelRequestIcon fontSize="small" />
                            {option}
                          </MenuItem>
                        ))
                    : dataChatId === data.chatId &&
                      requestTo === currentUser.uid &&
                      requestStatus === "pending"
                    ? dataUser_options
                        .filter((options, index) => index !== selectedIndex)
                        .map((option, index) => (
                          <MenuItem
                            key={option}
                            selected={index === selectedIndex}
                            onClick={(event) =>
                              handleMenuItemClick(event, index, option)
                            }
                          >
                            <RejectIcon fontSize="small" />
                            {option}
                          </MenuItem>
                        ))
                    : friends_options
                        .filter((options, index) => index !== selectedIndex)
                        .map((option, index) => (
                          <MenuItem
                            key={option}
                            selected={index === selectedIndex}
                            onClick={(event) =>
                              handleMenuItemClick(event, index, option)
                            }
                          >
                            <PersonRemoveIcon fontSize="small" />
                            {option}
                          </MenuItem>
                        ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </RequestActionBox>
  );
}
