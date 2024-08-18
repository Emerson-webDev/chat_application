import React, { useContext, useState } from "react";
import Recieverlist from "./Recieverlist";
import { Box, Typography } from "@mui/material";
import SearchUser from "./SearchUser";
import { ReceivelistBox } from "../ChatContainer/Theme/Theme";
import { ChatUserContext } from "../../../useContext/ChatUserContext";

export default function MessagesPanel() {
  const [open, setOpen] = useState(false);;

  const {data} = useContext(ChatUserContext)

  return (
    <ReceivelistBox open={data.chatId === null}>
      <Box p="1rem" width="inherit">
        <Typography variant="h4" fontWeight={800} display="block" >Chats</Typography>
        <Typography variant="subtitle1" display="block" gutterBottom color="text.secondary">Messages from your friends</Typography>
      </Box>
      <SearchUser setOpen={setOpen} open={open}/>
      {!open && <Recieverlist />}
    </ReceivelistBox>
  );
}
