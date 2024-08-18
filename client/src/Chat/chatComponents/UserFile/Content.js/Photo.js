import React, { useContext, useEffect, useState } from "react";
import { ChatUserContext } from "../../../../useContext/ChatUserContext";
import { doc, onSnapshot } from "firebase/firestore";
import { chatCollectionRef } from "../../../../firebase_config/firebase_config";
import { ImageListItem } from "@mui/material";
import { AttachmentBox } from "../../ChatContainer/Theme/Theme";
import { isImageType } from "../../ChatContainer/FileUtilities/fileUtils";

export default function Photo() {
  const { data } = useContext(ChatUserContext);
  const [photos, setPhotos] = useState([]);


  //fetching all the messages containing images
  useEffect(() => {
    const getPhoto = () => {
      onSnapshot(doc(chatCollectionRef, data.chatId), (docSnap) => {
        try {
          if (docSnap.exists()) {
            const photoData = Object.values(docSnap.data());
            const filteredPhotos = photoData
              ?.filter((photo) => photo.file)
              ?.flatMap((photo) => photo.file);
            setPhotos(filteredPhotos);
          }
        } catch (error) {
          console.log(error)
        }
      });
    };
    getPhoto();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // function for separate image viewing
  const handleDownloadImage = (imgUrl) => {
    const imgLink = document.createElement("a");
    imgLink.href = imgUrl;
    imgLink.download = imgUrl.name;
    imgLink.target = "_blank";
    imgLink.rel = "noopener noreferrer";
    imgLink.click();
  };

  const displayPhotos = photos?.flat().map((photo, index) => {
    return (
      isImageType(photo.type) && (
        <ImageListItem key={index}>
          <img
            src={photo.url}
            alt="Images"
            loading="lazy"
            onClick={() => handleDownloadImage(photo.url)}
          />
        </ImageListItem>
      )
    );
  });

  return (
    <>
      <AttachmentBox
        cols={3}
        rowHeight={80}
      >
        {displayPhotos}
      </AttachmentBox>
      {/* <Modal
        open={openImage}
        onClose={handleCloseImage}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Card sx={{ maxWidth: "inherit" }}>
            <CardActionArea sx={{ height: "100vh" }}>
              <CardMedia
                component="img"
                image={selectImage}
                alt="receiver"
                sx={{
                  height: "inherit",
                  width: "fit-content",
                }}
              />
            </CardActionArea>
          </Card>
        </Box>
      </Modal> */}

      {/* {console.log(photos)} */}
    </>
  );
}
