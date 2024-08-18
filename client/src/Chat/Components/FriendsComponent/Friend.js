import React, { useContext } from "react";
import FriendList from "./FriendList";
import { FriendBox } from "../../chatComponents/ChatContainer/Theme/Theme";
import { ChatUserContext } from "../../../useContext/ChatUserContext";

export default function Friend() {
  const { data } = useContext(ChatUserContext)

  return (
    <FriendBox open={data.chatId === null}>
      <FriendList />
    </FriendBox>
  );
}
