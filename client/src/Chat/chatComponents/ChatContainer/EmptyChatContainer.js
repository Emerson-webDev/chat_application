import React, { useContext } from "react";
import { AuthContext } from "../../../useContext/AuthContext";
import { Avatar, Box, Typography } from "@mui/material";
import { EmptyContainer } from "./Theme/Theme";

export default function EmptyChatContainer() {
  const { currentUser } = useContext(AuthContext);

  return (
    <EmptyContainer>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar
          src={currentUser.photoURL}
          alt={currentUser.displayName}
          sx={{width:100, height: 100, fontSize: 40}}
        />
        <Typography fontWeight={700} sx={ (theme) => ({ marginTop: 4, marginBottom: 0, fontSize: "1.25rem", color: theme.palette.text.current}) }>
          Welcome, {currentUser.displayName || currentUser.reloadUserInfo.screenName}
        </Typography>
        <Typography sx={{ marginTop: 1, marginBottom: 0, color: "#adb5bd" }}>
          Please search user to start messaging.
        </Typography>
      </Box>
    </EmptyContainer>
  );
}
