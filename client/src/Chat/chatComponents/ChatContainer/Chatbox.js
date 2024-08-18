import React, { useContext } from "react";
import ChatMessages from "./ChatMessages";

// import { io } from "socket.io-client";

import { Box } from "@mui/material";
import { ChatUserContext } from "../../../useContext/ChatUserContext";

export default function Chatbox({message, loading}) {

  const {data} = useContext(ChatUserContext)

  return (
    <Box style={{flexGrow: 1, overflow: "auto"}}>
      <Box style={{ display: "flex", flexDirection: "column" }}>

        {data.user.uid && <ChatMessages message={message} loading={loading} />}
      </Box>
    </Box>
  );
}
