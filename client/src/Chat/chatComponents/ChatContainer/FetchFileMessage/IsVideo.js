import { Box, Card, CardActionArea, CardMedia } from "@mui/material";
import React from "react";

export default function IsVideo({ message }) {
  return (
    <Box>
      <Card >
        {message.file?.map((msgfile, index) => (
          <CardActionArea key={index} sx={{ width: 250,display: "flex", flexDirection: "column", gap: 2}}>
            <CardMedia
              component="video"
              height= "250"
              src={msgfile.url}
              alt="receiver"
              controls
            />
          </CardActionArea>
        ))}
      </Card>
    </Box>
  );
}
