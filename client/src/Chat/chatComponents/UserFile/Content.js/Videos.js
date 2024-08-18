import React, { useContext, useEffect, useState } from "react";
import { ChatUserContext } from "../../../../useContext/ChatUserContext";
import { doc, onSnapshot } from "firebase/firestore";
import { chatCollectionRef } from "../../../../firebase_config/firebase_config";
import { isVideo } from "../../ChatContainer/FileUtilities/fileUtils";
import { Box, Card, CardMedia, Grid } from "@mui/material";

export default function Videos() {
  const { data } = useContext(ChatUserContext);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const getVideos = () => {
      onSnapshot(doc(chatCollectionRef, data.chatId), (docSnap) => {
        if (docSnap.exists()) {
          const videoData = Object.values(docSnap.data());
          const filterVideos = videoData
            .filter((video) => video.file)
            .flatMap((video) => video.file);
          setVideos(filterVideos);
        }
      });
    };
    getVideos();
  }, []);

  const displayVideos = videos?.flat().map((video, index) => {
    return (
      isVideo(video.type) && (
        <Grid item xs={6} key={index}>
          <Card sx={{ width: "inherit", margin: 1 }}>
            <CardMedia
              component="video"
              height="194"
              src={video.url}
              controls
              alt="videos"
            />
          </Card>
        </Grid>
      )
    );
  });
  return (
    <Box sx={{ height: "calc(100vh - 310px)", overflow: "auto" }}>
      <Grid container>{displayVideos}</Grid>
    </Box>
  );
}
