import React, { useContext, useEffect, useState } from "react";
import { ChatUserContext } from "../../../useContext/ChatUserContext";
import { doc, onSnapshot } from "firebase/firestore";
import { userCollectionRef } from "../../../firebase_config/firebase_config";
// import { AuthContext } from "../../../useContext/AuthContext";
import Photo from "./Content.js/Photo";
import File from "./Content.js/File";
import Videos from "./Content.js/Videos";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Tab,
  Typography,
} from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import { Tabs, UserFileContainer } from "../ChatContainer/Theme/Theme";

export default function UserFile({ closeProfile, openProfile }) {
  const [userData, setUserData] = useState({});
  const [content, setContent] = useState("photo");
  const { data } = useContext(ChatUserContext);
  // const { currentUser } = useContext(AuthContext);

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(userCollectionRef, data.user.uid),
      (snapshot) => {
        const dataUser = snapshot.data();
        setUserData(dataUser);
      }
    );
    return () => unsubscribe();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contentHandler = (select) => {
    setContent(select);
  };

  const activeContentComponent = () => {
    switch (content) {
      case "photo":
        return <Photo />;
      case "videos":
        return <Videos />;
      case "file":
        return <File />;
      default:
        return null;
    }
  };

  // console.log(content);
  return (
    <UserFileContainer open={openProfile ? 1 : 0}>
      <Box
        mb={2}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "end", width: "100%" }}>
          <IconButton onClick={closeProfile}>
            <CloseOutlinedIcon />
          </IconButton>
        </Box>
        <Avatar
          src={userData.photoURL}
          alt={userData.displayName}
          sx={{ width: 96, height: 96, fontSize: "2rem" }}
        />
        <Typography variant="h5">{userData.displayName}</Typography>
      </Box>
      <Divider />
      <Box sx={{ display: "flex", margin: "1rem .5rem 0" }}>
        <AttachFileOutlinedIcon />
        <Typography variant="subtitle1" fontWeight={700}>
          Attachments
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: "1",  overflow: "hidden"  }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Photos" onClick={() => contentHandler("photo")} />
          <Tab label="Videos" onClick={() => contentHandler("videos")} />
          <Tab label="File" onClick={() => contentHandler("file")} />
        </Tabs>
        {/* <Box margin="0 8px" sx={{ flexGrow: "1", overflowY: "auto", margin: "0 8px" }}> */}
          {activeContentComponent()}
        {/* </Box> */}
      </Box>
    </UserFileContainer>
  );
}
