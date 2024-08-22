import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../useContext/AuthContext";
import { ChatUserContext } from "../../../useContext/ChatUserContext";
import {
  isImageType,
  isVideo,
  messageCurrentUserStatus,
  messageDataUserStatus,
} from "./FileUtilities/fileUtils";
import {
  chatCollectionRef,
  storage,
  userChatCollectionRef,
  // userChatCollectionRef,
  userCollectionRef,
} from "../../../firebase_config/firebase_config";
import { deleteField, doc, onSnapshot, updateDoc } from "firebase/firestore";
import {
  Alert,
  Avatar,
  Box,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Snackbar,
  Typography,
} from "@mui/material";
import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import {
  DeleteIcon,
  PaperRecieverMessage,
  PaperSenderMessage,
  RecieverCardContent,
  RecieverMessageBox,
  SenderCardContent,
  SenderMessageBox,
  StyledMenu,
} from "./Theme/Theme";
import { deleteObject, listAll, ref } from "firebase/storage";
import IsImage from "./FetchFileMessage/IsImage";
import IsVideo from "./FetchFileMessage/IsVideo";
import IsFile from "./FetchFileMessage/IsApplication";

export default function FetchChatMessage({
  chatMessage,
  msgkey,
}) {
  const [dataUser, setDataUser] = useState("");
  const [copy, setCopy] = useState(false);

  const [isImage, setIsImage] = useState([]);
  const [isVideoFile, setIsVideo] = useState([]);
  const [isFile, setIsFile] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatUserContext);

  const [formattedTimestamp, setFormattedTimestamp] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleClosed = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setCopy(false);
  };


  useEffect(() => {
    const getUser = () => {
      try {
        const unsubscribeStatus = onSnapshot(
          doc(userCollectionRef, data.user.uid),
          (docSnap) => {
            if (docSnap.exists()) {
              const dataStatus = docSnap.data();
              setDataUser(dataStatus);
            }
          }
        );
        return () => unsubscribeStatus();
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [data.user.uid]);

  // console.log(chatMessage);

  useEffect(() => {
    const img = [];
    const vid = [];
    const app = [];
    chatMessage.file?.forEach((msgfile) => {
      isImageType(msgfile.type)
        ? img.push(msgfile)
        : isVideo(msgfile.type)
        ? vid.push(msgfile)
        : app.push(msgfile);
    });
    setIsImage(img);
    setIsVideo(vid);
    setIsFile(app);
  }, [chatMessage.file]);

  // convert timestamp to specific format
  useEffect(() => {
    const minute = 60 * 1000;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const month = day * 30;

    const formatDate = (timestamp) => {
      const now = new Date();
      const messageTime = timestamp.toDate();
      const timeDifference = now - messageTime;

      // this is date for a message that sent a month or more than a month ago
      const monthOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      };

      // this is date for a message that sent less than or a week ago
      const weekOptions = {
        weekday: "short",
        hour: "numeric",
        minute: "numeric",
      };

      // Define the time intervals in milliseconds
      return timeDifference < minute
        ? "Just now"
        : timeDifference < hour
        ? `${Math.floor(timeDifference / minute)} minute${
            Math.floor(timeDifference / minute) !== 1 ? "s" : ""
          } ago`
        : timeDifference < day
        ? `${Math.floor(timeDifference / hour)} hour${
            Math.floor(timeDifference / hour) !== 1 ? "s" : ""
          } ago`
        : timeDifference <= week
        ? messageTime.toLocaleString("en-US", weekOptions)
        : timeDifference < month
        ? messageTime.toLocaleString("en-US", monthOptions)
        : messageTime.toLocaleString("en-US", monthOptions); // Format as a full date a
    };

    // Call the formatTimestamp function with the Firestore timestamp
    setFormattedTimestamp(formatDate(chatMessage.date));

    // Set up an interval to update the timestamp every minute
    // if I did not create interval, the useEffect will take only during sending message
    const intervalMin = setInterval(() => {
      setFormattedTimestamp(formatDate(chatMessage.date));
    }, minute);

    return () => clearInterval(intervalMin);
  }, [chatMessage.date]); //Im just putting this dependency, it is ok even without this, i put this because i use ESlint vscode extension

  // download function for the file message
  const handleDownload = (dataURL) => {
    const link = document.createElement("a");
    link.href = dataURL.url;
    link.download = dataURL.name; // Set the downloaded file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // function for separate image viewing
  const handleDownloadImage = (imgURL) => {
    const imgLink = document.createElement("a");
    imgLink.href = imgURL;
    imgLink.download = imgURL.name;
    imgLink.target = "_blank";
    imgLink.rel = "noopener noreferrer";
    imgLink.click();
    console.log(imgURL)
  };

  useEffect(() => {
    const unsubScribe = onSnapshot(
      doc(chatCollectionRef, data.chatId),
      (docSnap) => {
        try {
          if (docSnap.exists()) {
            const fetchedMessages = docSnap.data();
            // console.log(fetchedMessages)
            const sortedMessagesArray = Object.entries(fetchedMessages)
              .sort(([, a], [, b]) => a.date.toMillis() - b.date.toMillis())
              .map(([msgkey, msg]) => ({ [msgkey]: msg }));

            Object.entries(
              sortedMessagesArray[sortedMessagesArray.length - 1]
            ).map(async ([key, value]) => {
              //we need to check if the message is a file for
              //the proper message to display for a file
              //message text always display what is text is, in file we assign a text for
              //example: if it is image it will define as a photo, if video, it will define a video, or docs. like that

              if (value.receiver_id.receiver_id === data.user.uid) {
                if (value.hasOwnProperty("file")) {
                  await updateDoc(doc(userChatCollectionRef, data.user.uid), {
                    [data.chatId + ".last_message"]: messageDataUserStatus(
                      data.user,
                      value.file
                    ),
                    [data.chatId + ".is_Read"]: value.receiver_id.receiver_id,
                    [data.chatId + ".date"]: value.date,
                  });
                } else {
                  await updateDoc(doc(userChatCollectionRef, data.user.uid), {
                    [data.chatId + ".user_info"]: {
                      uid: currentUser.uid,
                      displayName: currentUser.displayName || currentUser.reloadUserInfo.screenName,
                      photoURL: currentUser.photoURL,
                    },
                    [data.chatId + ".last_message"]: value.message,
                    [data.chatId + ".is_Read"]: value.receiver_id.isRead,
                    [data.chatId + ".date"]: value.date,
                  });
                }
              }
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
    );

    return () => unsubScribe();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // in this use function we need to get the data of last message when there is a message deleted in the array to save the data to
  //userChatCollectionRef to display this data or message again in receiverlist.
  const updateLastMessage = () => {
    Object.entries(data.message[data.message.length - 2]).map(
      async ([key, value]) => {
        //we need to check if the message is a file for
        //the proper message to display for a file
        //message text always display what is text is, in file we assign a text for
        //example: if it is image it will define as a photo, if video, it will define a video, or docs. like that
        if (value.hasOwnProperty("file")) {
          await updateDoc(doc(userChatCollectionRef, currentUser.uid), {
            [data.chatId + ".last_message"]: messageCurrentUserStatus(
              currentUser,
              value.file
            ),
            [data.chatId + ".is_Read"]: value.sender_id.isRead,
            [data.chatId + ".date"]: value.date,
          });
        } else {
          await updateDoc(doc(userChatCollectionRef, currentUser.uid), {
            [data.chatId + ".user_info"]: {
              uid: data.user.uid,
              displayName: data.user.displayName,
              photoURL: data.user.photoURL,
            },
            [data.chatId + ".last_message"]: value.message,
            [data.chatId + ".is_Read"]: value.sender_id.isRead,
            [data.chatId + ".date"]: value.date,
          });
        }
      }
    );
  };

  //delete message function
  const deleteMessageHandler = async (msg, msgkey) => {
    try {
      // delete the specific message
      await updateDoc(doc(chatCollectionRef, data.chatId), {
        [msgkey]: deleteField(),
      });

      // this action is for deleting files into our fireStorage
      const galleryRef = ref(storage, "Gallery");
      const galleryList = await listAll(galleryRef);

      galleryList.prefixes.map(async (prefix) => {
        const subdirectory = prefix.name.split("/").pop(); // Get the subdirectory name this will be the name of the subfolder
        const subdirectoryRef = ref(storage, prefix.fullPath);

        const subdirectoryList = await listAll(subdirectoryRef);

        for (const item of subdirectoryList.items) {
          const objectName = subdirectory;
          if (objectName === msgkey.toString()) {
            console.log(`Deleting object: ${objectName}`);
            await deleteObject(item);
          }
        }
      });

      //call the function to execute the update
      updateLastMessage();

      // console.log(msgkey)
    } catch (error) {
      console.log(error);
    }
    handleClose();
  };

  // copying message
  const handleCopy = (message) => {
    setCopy(true);
    navigator.clipboard.writeText(message);
    handleClose();
  };

  return (
    <Box>
      {chatMessage.sender_id.sender_id === currentUser.uid && (
        <Grid item sx={{ paddingTop: "1rem" }}>
          <SenderMessageBox>
            <Grid container>
              <Grid item md={2} lg={2}></Grid>
              <Grid item xs={12} sm={12} md={10} lg={10}>
                <Box>
                  <IconButton
                    id="demo-customized-button"
                    aria-controls={open ? "demo-customized-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    variant="contained"
                    onClick={handleClick}
                    sx={(theme) => ({color: theme.palette.default.primary})}
                  >
                    <MoreVertOutlinedIcon fontSize="small" />
                  </IconButton>
                  <StyledMenu
                    id="demo-customized-menu"
                    MenuListProps={{
                      "aria-labelledby": "demo-customized-button",
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleClose} disableRipple>
                      <FileCopyIcon />
                      Copy
                    </MenuItem>
                    <MenuItem
                      onClick={() => deleteMessageHandler(chatMessage, msgkey)}
                      disableRipple
                    >
                      <DeleteIcon />
                      Delete
                    </MenuItem>
                  </StyledMenu>

                  <PaperSenderMessage elevation={2}>
                    <SenderCardContent
                      sx={{
                        flexDirection:
                          isImage.length > 0 ||
                          isVideoFile.length > 0 ||
                          isFile.length > 0
                            ? "column"
                            : "none",
                      }}
                    >
                      {chatMessage.message && (
                        <Typography variant="body1" sx={(theme) => ({
                          color: `${theme.palette.text.sender} !important`,
                        })}>
                          {chatMessage.message}
                        </Typography>
                      )}

                      {/*images*/}
                      {isImage.length > 0 && (
                        <IsImage
                          message={chatMessage}
                          handleDownloadImage={handleDownloadImage}
                        />
                      )}

                      {/*videos*/}
                      {isVideoFile.length > 0 && (
                        <IsVideo message={chatMessage} />
                      )}

                      {/*documents*/}
                      {isFile.length > 0 && (
                        <IsFile
                          message={chatMessage}
                          handleDownload={handleDownload}
                        />
                      )}
                      
                    </SenderCardContent>
                  </PaperSenderMessage>
                </Box>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Typography variant="subtitle2">
                  {formattedTimestamp}
                </Typography>
              </Grid>
            </Grid>

            <Box>
              <Avatar
                alt={currentUser.displayName || currentUser.reloadUserInfo.screenName}
                src={currentUser.photoURL}
                sx={{
                  width: 35,
                  height: 35,
                  fontSize: "1rem",
                  borderRadius: "35%",
                }}
              />
            </Box>
          </SenderMessageBox>
        </Grid>
      )}

      {chatMessage.sender_id.sender_id === data.user.uid && (
        <Grid item sx={{ paddingTop: "1rem" }}>
          <RecieverMessageBox>
            <Box>
              <Avatar
                alt={dataUser.displayName}
                src={dataUser.photoURL}
                sx={{ width: 35, height: 35, borderRadius: "35%" }}
              />
            </Box>
            <Grid container>
              <Grid item xs={12} sm={12} md={10} lg={10}>
                <Box>
                  <PaperRecieverMessage elevation={2}>
                    <RecieverCardContent sx={{
                    flexDirection: isImage.length > 0 || isVideoFile.length > 0 || isFile.length > 0 ? "column" : "none",
                  }}>
                      {chatMessage.message && (
                        <Typography variant="body1" sx={(theme) => ({
                          color: `${theme.palette.text.receiver} !important`,
                        })}>
                          {chatMessage.message}
                        </Typography>
                      )}
                      {isImage.length > 0 && (
                        <IsImage
                          message={chatMessage}
                          handleDownloadImage={handleDownloadImage}
                        />
                      )}
                      {isVideoFile.length > 0 && (
                        <IsVideo message={chatMessage} />
                      )}
                      {isFile.length > 0 && <IsFile message={chatMessage} />}
                    </RecieverCardContent>
                  </PaperRecieverMessage>

                  <IconButton
                    id="demo-customized-button"
                    aria-controls={open ? "demo-customized-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    variant="contained"
                    onClick={handleClick}
                    sx={(theme) => ({color: theme.palette.default.primary})}
                    
                  >
                    <MoreVertOutlinedIcon fontSize="small" />
                  </IconButton>
                  <StyledMenu
                    id="demo-customized-menu"
                    MenuListProps={{
                      "aria-labelledby": "demo-customized-button",
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleClose} disableRipple>
                      <ReplyOutlinedIcon />
                      Reply
                    </MenuItem>
                    {/* <MenuItem onClick={handleClose} disableRipple>
                      <FastForwardOutlinedIcon />
                      Forward
                    </MenuItem> */}
                    <Divider sx={{ my: 0.5 }} />
                    <MenuItem
                      onClick={() => handleCopy(chatMessage.message)}
                      disableRipple
                    >
                      <FileCopyIcon />
                      Copy
                    </MenuItem>
                    {/* <MenuItem onClick={handleClose} disableRipple>
                      <DeleteIcon />
                      Delete
                    </MenuItem> */}
                  </StyledMenu>
                </Box>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Typography variant="subtitle2">
                  {formattedTimestamp}
                </Typography>
              </Grid>
            </Grid>
          </RecieverMessageBox>
        </Grid>
      )}
      <Snackbar open={copy} autoHideDuration={3000} onClose={handleClosed}>
        <Alert
          onClose={handleClosed}
          severity="success"
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled"
        >
          Message copied!
        </Alert>
      </Snackbar>
    </Box>
  );
}
