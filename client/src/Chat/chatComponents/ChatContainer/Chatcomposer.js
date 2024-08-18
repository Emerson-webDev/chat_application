import React, { useContext, useRef, useState } from "react";
import { ChatUserContext } from "../../../useContext/ChatUserContext";
import { AuthContext } from "../../../useContext/AuthContext";
import {
  Timestamp,
  doc,
  // onSnapshot,
  serverTimestamp,
  // setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  chatCollectionRef,
  storage,
  userChatCollectionRef,
} from "../../../firebase_config/firebase_config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

import { v4 as uuid } from "uuid";
import {
  isVideo,
  isFileSizeBelowLimit,
  isFileType,
  isImageType,
  messageCurrentUserStatus,
  messageDataUserStatus,
} from "./FileUtilities/fileUtils";

import {
  Box,
  Card,
  CardContent,
  CardMedia,
  FormControl,
  ImageList,
  ImageListItem,
  // IconButton,
  // ImageList,
  // ImageListItem,
  // ListItem,
  Paper,
  // TextField,
  Typography,
} from "@mui/material";
import InsertEmoticonOutlinedIcon from "@mui/icons-material/InsertEmoticonOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import ArticleIcon from "@mui/icons-material/Article";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import EmojiPicker from "emoji-picker-react";
import {
  Badge,
  ChatTextField,
  ComposerIconButton,
  EmojiBox,
  FileMessageBox,
  SendIconButton,
} from "./Theme/Theme";

export default function Chatcomposer() {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState([]);
  const [selected, setSelected] = useState(false);
  const [selectedFile, setSelectedFile] = useState([]);

  const [selectImage, setSelectImage] = useState(false);
  const [selectFile, setSelectFile] = useState(false);
  const [activeImage, setActiveImage] = useState(false);
  const [activeFile, setActiveFile] = useState(false);

  const [showPicker, setShowPicker] = useState(false);
  const formRef = useRef(null);

  const { data } = useContext(ChatUserContext);
  const { currentUser } = useContext(AuthContext);

  const messageID = uuid();

  const maxFileSizeInBytes = 25 * 1024 * 1024;

  const selectEmoji = (emojiData) => {
    const unifiedCodePoint = emojiData.unified;

    if (unifiedCodePoint) {
      const codePoints = unifiedCodePoint
        .split("-")
        .map((hexStr) => parseInt(hexStr, 16));
      const emojiChar = String.fromCodePoint(...codePoints);
      setMessage((prevMessage) => prevMessage + emojiChar);
    }
  };

  // console.log(file)
  const sendMessageHandler = async (e) => {
    e.preventDefault();

    setMessage("");
    setSelected(false);
    setSelectedFile([]);
    setShowPicker(false);

    setSelectFile(false);
    setSelectImage(false);
    setActiveImage(false);
    setActiveFile(false);
    formRef.current.reset();

    try {
      if (selected) {
        const uploadedFiles = [];

        file.map(async (files) => {
          const storageRef = ref(storage, `Gallery/${messageID}/${files.name}`);
          const uploadTask = uploadBytesResumable(storageRef, files);
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              // Observe state change events such as progress, pause, and resume
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + Math.floor(progress) + "% done");
              switch (snapshot.state) {
                case "paused":
                  console.log("Upload is paused");
                  break;
                case "running":
                  console.log("Upload is running");
                  break;

                default:
                  break;
              }
            },
            (error) => {
              // Handle unsuccessful uploads
              //   setShowError(true);
              console.log(error);
            },
            () => {
              if (file.length > 0) {
                getDownloadURL(uploadTask.snapshot.ref).then(
                  async (downloadURL) => {
                    // console.log("File available at", downloadURL);

                    uploadedFiles.push({
                      url: downloadURL,
                      type: files.type,
                      name: files.name,
                    });

                    if (uploadedFiles.length === file.length) {
                      await updateDoc(doc(chatCollectionRef, data.chatId), {
                        [messageID]: {
                          message,
                          sender_id: {
                            sender_id: currentUser.uid,
                            isRead: true,
                          },
                          receiver_id: {
                            receiver_id: data.user.uid,
                            isRead: false,
                          },
                          date: Timestamp.now(),
                          file: uploadedFiles,
                        },
                      });
                    }

                    if (downloadURL) {
                      await Promise.all([
                        updateDoc(doc(userChatCollectionRef, currentUser.uid), {
                          [data.chatId + ".last_message"]:
                            messageCurrentUserStatus(currentUser, file),
                          [data.chatId + ".is_Read"]: true,
                          [data.chatId + ".date"]: serverTimestamp(),
                        }),

                        updateDoc(doc(userChatCollectionRef, data.user.uid), {
                          [data.chatId + ".last_message"]:
                            messageDataUserStatus(data.user, file),
                          [data.chatId + ".is_Read"]: false,
                          [data.chatId + ".date"]: serverTimestamp(),
                        }),
                      ]);
                    }

                    setFile([]);
                  }
                );
              }
            }
          );
        });
      } else {
        if (data.chatId) {
          await Promise.all([
            updateDoc(doc(chatCollectionRef, data.chatId), {
              [messageID]: {
                message,
                sender_id: { sender_id: currentUser.uid, isRead: true },
                receiver_id: { receiver_id: data.user.uid, isRead: false },
                date: Timestamp.now(),
              },
            }),

            updateDoc(doc(userChatCollectionRef, currentUser.uid), {
              [data.chatId + ".user_info"]: {
                uid: data.user.uid,
                displayName: data.user.displayName,
                photoURL: data.user.photoURL,
              },
              [data.chatId + ".last_message"]: message,
              [data.chatId + ".is_Read"]: true,
              [data.chatId + ".date"]: serverTimestamp(),
            }),

            updateDoc(doc(userChatCollectionRef, data.user.uid), {
              [data.chatId + ".user_info"]: {
                uid: currentUser.uid,
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
              },
              [data.chatId + ".last_message"]: message,
              [data.chatId + ".is_Read"]: false,
              [data.chatId + ".date"]: serverTimestamp(),
            }),
          ]);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteSelectedFileHandler = (fileId) => {
    const newFileArray = file.filter((files, index) => index !== fileId);
    const newSelectedArray = selectedFile.filter(
      (selected, index) => index !== fileId
    );
    setFile(newFileArray);
    setSelectedFile(newSelectedArray);
    if (newSelectedArray.length === 0) {
      setSelected(false);
      setSelectedFile([]);
      formRef.current.reset();
      setSelectFile(false);
      setSelectImage(false);
      setActiveImage(false);
      setActiveFile(false);
    }
  };

  const selectImageHandler = () => {
    setActiveImage(true);
  };

  const selectFileHandler = () => {
    setActiveFile(true);
  };

  const handleFileChange = (e) => {
    const files = [...file, ...e.target.files];
    const fileArray = [];

    setFile(files);

    // if (files.length > 0) {
    //   setSelected(true);
    //   selectImageHandler()
    //   selectFileHandler()
    // }

    if (files.length > 0 && activeImage) {
      setSelected(true);
      setSelectFile(true);
    } else {
      setSelectFile(false);
      setActiveImage(false);
    }

    if (files.length > 0 && activeFile) {
      setSelected(true);
      setSelectImage(true);
    } else {
      setSelectImage(false);
      setActiveFile(false);
    }

    //I put setSelectedFile([]) here to clear the selected array to avoid the duplication of the first file.
    //Ex. you select one file, then forgot the other file to select.when you select or add another file it will avoid the duplication of first file.
    setSelectedFile([]);

    files.forEach((file, index) => {
      const reader = new FileReader();
      fileArray.push(reader);
      reader.onloadend = () => {
        const dataUrl = reader.result;
        setSelectedFile((prevSelectedFiles) => [
          ...prevSelectedFiles,
          { dataUrl, name: file.name, type: file.type }, // Store both dataUrl and name
        ]);
      };

      (isVideo(file.type) && isFileSizeBelowLimit(file, maxFileSizeInBytes)) ||
      isFileType(file.type) ||
      isImageType(file.type)
        ? reader.readAsDataURL(file)
        : console.log("a video file size exceeds the limit (25MB).");
    });
  };
  // console.log(file)
  return (
    <Box>
      <Paper sx={{ borderRadius: 0 }}>
        {showPicker && (
          <EmojiBox>
            <EmojiPicker height={400} width={350} onEmojiClick={selectEmoji} />
          </EmojiBox>
        )}
        <Box p=".75rem" sx={{ ...(selected && { paddingBottom: 0 }) }}>
          <form onSubmit={sendMessageHandler} action="" ref={formRef}>
            <Box sx={{ ...(!selected ? { display: "none" } : true) }}>
              <FormControl fullWidth>
                {selectedFile.length > 0 && (
                  <FileMessageBox>
                    <ImageList
                      cols={selectedFile.length}
                      sx={{
                        width: "100px",
                        overflowY: "unset",
                        gap: "15px !important",
                      }}
                    >
                      {selectedFile.map((selectedFile, index) =>
                        selectedFile.type.startsWith("image/") ? (
                          <ImageListItem key={index}>
                            <Badge
                              badgeContent={
                                <CloseOutlinedIcon
                                  onClick={() =>
                                    deleteSelectedFileHandler(index)
                                  }
                                />
                              }
                            >
                              <Card>
                                <CardMedia
                                  component="img"
                                  sx={{ width: 100, height: 100 }}
                                  image={selectedFile.dataUrl}
                                  alt={`file-preview-${index}`}
                                  loading="lazy"
                                />
                              </Card>
                            </Badge>
                          </ImageListItem>
                        ) : (
                          <ImageListItem key={index}>
                            <Badge
                              badgeContent={
                                <CloseOutlinedIcon
                                  onClick={() =>
                                    deleteSelectedFileHandler(index)
                                  }
                                />
                              }
                            >
                              <Card
                                sx={{
                                  display: "flex",
                                  width: "180px",
                                  height: "100px",
                                  backgroundColor: "maincolor.secondary",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      pl: 1,
                                      pb: 1,
                                    }}
                                  >
                                    <ArticleIcon fontSize="large" />
                                  </Box>
                                  <CardContent
                                    sx={{
                                      flex: "1 0 auto",
                                      width: "calc(100% - 43px)",
                                      padding: 0,
                                    }}
                                  >
                                    <Typography
                                      variant="subtitle1"
                                      sx={{ whiteSpace: "normal" }}
                                    >
                                      {selectedFile.name}
                                    </Typography>
                                  </CardContent>
                                </Box>
                              </Card>
                            </Badge>
                          </ImageListItem>
                        )
                      )}
                    </ImageList>
                  </FileMessageBox>
                )}
              </FormControl>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexGrow: 1,
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  ...(selected && {
                    display: "flex",
                    // height: "189px",
                    marginBottom: ".5rem",
                    alignItems: "end",
                    justifyContent: "center",
                  }),
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: ".5rem" }}
                >
                  <ComposerIconButton
                    onClick={() => setShowPicker((val) => !val)}
                  >
                    <InsertEmoticonOutlinedIcon />
                  </ComposerIconButton>

                  {/* for images */}
                  <ComposerIconButton
                    disabled={selectImage}
                    component="label"
                    onClick={selectImageHandler}
                  >
                    <ImageOutlinedIcon />
                    <input
                      name="file"
                      type="file"
                      accept="image/*"
                      hidden
                      multiple
                      onChange={handleFileChange}
                    />
                  </ComposerIconButton>

                  {/*like pdf,doc */}
                  <ComposerIconButton
                    disabled={selectFile}
                    component="label"
                    onClick={selectFileHandler}
                  >
                    <AttachFileOutlinedIcon />
                    <input
                      name="file"
                      type="file"
                      accept="application/*"
                      hidden
                      multiple
                      onChange={handleFileChange}
                    />
                  </ComposerIconButton>
                </Box>
              </Box>

              <Box sx={{ width: "100%" }}>
                <ChatTextField
                  placeholder="Message"
                  size="small"
                  name=""
                  value={message}
                  fullWidth
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                />
              </Box>

              <Box
                sx={{
                  ...(selected && {
                    display: "flex",
                    // height: "189px",
                    marginBottom: ".5rem",
                    alignItems: "end",
                    justifyContent: "center",
                  }),
                }}
              >
                <SendIconButton type="submit">
                  <SendOutlinedIcon />
                </SendIconButton>
              </Box>
            </Box>
          </form>
        </Box>
      </Paper>
    </Box>
  );
}
