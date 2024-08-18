import { Box, Grid } from "@mui/material";
import React, { useContext } from "react";
import { ChatUserContext } from "../../../useContext/ChatUserContext";
import EmptyChatContainer from "./EmptyChatContainer";
import ChatContainer from "./ChatContainer";
import { ChatBoxContainer } from "./Theme/Theme";

export default function Container({
  onClickVideoHandler,
  onCancel,
  allPeerData,
  createCall,
}) {
  const { data } = useContext(ChatUserContext);

  return (
    <ChatBoxContainer
      container
      open={data.chatId === null}
    >
      {data.chatId === null ? (
        <EmptyChatContainer />
      ) : (
        <ChatContainer
          onClickVideoHandler={onClickVideoHandler}
          onCancel={onCancel}
          allPeerData={allPeerData}
          createCall={createCall}
        />
      )}
    </ChatBoxContainer>
  );
}
