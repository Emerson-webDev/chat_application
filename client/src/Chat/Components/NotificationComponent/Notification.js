import React, { useContext } from "react";
import NotificationList from "./NotificationList";
import { NotificationBox } from "../../chatComponents/ChatContainer/Theme/Theme";
import { ChatUserContext } from "../../../useContext/ChatUserContext";

export default function Notification() {
  const { data } = useContext(ChatUserContext)
  return (
    <NotificationBox open={data.chatId === null}>
      <NotificationList />
    </NotificationBox>
  );
}
