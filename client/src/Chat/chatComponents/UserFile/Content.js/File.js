import React, { useContext, useEffect, useState } from "react";
import { chatCollectionRef } from "../../../../firebase_config/firebase_config";
import { doc, onSnapshot } from "firebase/firestore";
import { ChatUserContext } from "../../../../useContext/ChatUserContext";

import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import {
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { isFileType } from "../../ChatContainer/FileUtilities/fileUtils";
import { FileBox } from "../../ChatContainer/Theme/Theme";

export default function File() {
  const { data } = useContext(ChatUserContext);
  const [file, setFile] = useState([]);

  useEffect(() => {
    const getFile = () => {
      onSnapshot(doc(chatCollectionRef, data.chatId), (docSnap) => {
        const fileData = Object.values(docSnap.data());
        const filterFiles = fileData
          ?.filter((files) => files.file)
          .flatMap((files) => files.file);
        setFile(filterFiles);
      });
    };
    getFile();
  }, []);

  // handle for downloading the file
  const handleDownload = (fileUrl, fileName) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    link.click();
  };

  const displayFiles = file?.flat().map((file, index) => {
    return (
      isFileType(file.type) && (
        <ListItem
          key={index}
          secondaryAction={
            <IconButton
              edge="end"
              aria-label="download"
              onClick={() => handleDownload(file.url, file.name)}
            >
              <FileDownloadOutlinedIcon />
            </IconButton>
          }
        >
          <ListItemIcon>
            <InsertDriveFileOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary={file.name} />
        </ListItem>
      )
    );
  });
  return (
    <FileBox sx={{ height: "calc(100vh - 310px)", overflow: "auto" }}>
      <List>{displayFiles}</List>
    </FileBox>
  );
}
