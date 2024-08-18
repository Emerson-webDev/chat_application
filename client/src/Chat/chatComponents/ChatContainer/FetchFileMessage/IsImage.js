import { ImageListItem } from "@mui/material";
import React from "react";
import { isImageType } from "../FileUtilities/fileUtils";
import { ImageMessageList } from "../Theme/Theme";

export default function IsImage({ message, handleDownloadImage }) {
  return (
    <ImageMessageList cols={Math.min(3, message.file.length)}>
      {message.file?.map(
        (msgfile, index) =>
          isImageType(msgfile.type) && (
            <ImageListItem key={index} sx={{ borderRadius: ".5rem" }}>
              <img
                src={msgfile.url}
                alt="receiver"
                loading="lazy"
                onClick={() => handleDownloadImage(msgfile.url)}
                style={{ borderRadius: ".5rem" }}
              />
            </ImageListItem>
          )
      )}
    </ImageMessageList>
  );
}
