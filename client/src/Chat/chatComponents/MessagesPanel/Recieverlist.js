import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../useContext/AuthContext";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import {
  chatCollectionRef,
  userChatCollectionRef,
  userCollectionRef,
} from "../../../firebase_config/firebase_config";
import { ChatUserContext } from "../../../useContext/ChatUserContext";
import { Box, List, ListItem, ListItemAvatar, Typography } from "@mui/material";
import StorageIcon from "@mui/icons-material/Storage";
import {
  ContactName,
  ListItemText,
  MessageList,
  StyledBadge,
} from "./Theme/Theme";
import {
  Avatar,
  EmptyChat,
  UnreadTypography,
} from "../ChatContainer/Theme/Theme";

export default function Recieverlist() {
  const [chat, setChat] = useState([]);
  const [user, setUser] = useState([]);
  const [userId, setUserId] = useState([]);
  const [timestamp, setTimestamps] = useState({});

  const [unreadMessages, setUnreadMessages] = useState({});

  const { currentUser } = useContext(AuthContext);
  const { data, dispatch } = useContext(ChatUserContext);

  // const [currentlyOpenChatId, setCurrentlyOpenChatId] = useState(null);

  const minute = 60 * 1000;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;

  useEffect(() => {
    const fetchMessage = () => {
      try {
        const updatedUnreadMessages = {};

        Object.keys(chat).forEach((key) => {
          onSnapshot(doc(chatCollectionRef, key), (docSnap) => {
            if (docSnap.exists()) {
              const fetchedMessages = docSnap.data();
              // console.log(Object.values(fetchedMessages).filter( fm => fm.receiver_id.isRead === false).length);
              const unReadMessages = Object.values(fetchedMessages).filter(
                (countUnread) => {
                  return (
                    countUnread.receiver_id.receiver_id === currentUser.uid &&
                    !countUnread.receiver_id.isRead
                  );
                }
              ).length;
              updatedUnreadMessages[key] = unReadMessages;
              setUnreadMessages((prevUnreadMessages) => ({
                ...prevUnreadMessages,
                ...updatedUnreadMessages,
              }));
              // console.log((prevUnreadMessages => ({ ...prevUnreadMessages, ...updatedUnreadMessages }))(unreadMessages));
            }
          });
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchMessage();
  }, [chat, currentUser.uid]);

  useEffect(() => {
    try {
      Promise.all(
        Object.keys(chat).map((key) => {
          if (chat[key] !== null && key === data.chatId) {
            return new Promise((resolve, reject) => {
              const unsubScribe = onSnapshot(
                doc(chatCollectionRef, key),
                (docSnap) => {
                  try {
                    if (docSnap.exists()) {
                      const fetchedMessages = docSnap.data();
                      // console.log(fetchedMessages)
                      const sortedMessagesArray = Object.entries(
                        fetchedMessages
                      )
                        .sort(
                          ([, a], [, b]) =>
                            a.date.toMillis() - b.date.toMillis()
                        )
                        .map(([msgkey, msg]) => ({ [msgkey]: msg }));

                      resolve(sortedMessagesArray);
                    }
                  } catch (error) {
                    reject(error);
                  }
                }
              );

              return () => unsubScribe();
            });
          }
          return null;
        })
      ).then((result) => {
        // Flatten the array of arrays into a single array of messages
        const filteredResult = result.filter((item) => item !== null);
        const flattenedResult = filteredResult.flat();

        // dispatch the message
        dispatch({
          type: "SET_CHAT_MESSAGE",
          payload: { message: flattenedResult },
        });
      });
    } catch (error) {
      console.log(error);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat, data.chatId, dispatch]);

  // console.log(unreadMessages);
  useEffect(() => {
    const getChat = () => {
      const fetchUserChat = onSnapshot(
        doc(userChatCollectionRef, currentUser.uid),
        (docSnap) => {
          try {
            if (docSnap.exists()) {
              setChat(docSnap.data());
            }
          } catch (error) {
            console.log(error);
          }
        }
      );

      return () => fetchUserChat();
    };
    currentUser.uid && getChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //get the user for users that currentUser had or has conversation with.
  useEffect(() => {
    const getUsers = () => {
      try {
        const fetchAllUser = onSnapshot(userCollectionRef, (docSnap) => {
          if (!docSnap.empty) {
            const usersData = docSnap.docs.map((doc) => ({
              ...doc.data(),
            }));
            setUser(usersData);
          }
        });
        return () => fetchAllUser();
      } catch (error) {}
    };
    getUsers();
  }, []);

  useEffect(() => {
    const userData = user.map((user) => ({
      uid: user.uid,
      photoURL: user.photoURL,
      status: user.status.state,
    }));
    setUserId(userData);
  }, [user]);

  // updating userChatCollectionRef and chatCollectionRef is_Read to true for specific data.chatId.
  useEffect(() => {
    const unsubscribeLastMessage = async () => {
      if (data.chatId !== null) {
        // update is_Read status for the read Last message in userChatCollectionRef if mounted
        await updateDoc(doc(userChatCollectionRef, currentUser.uid), {
          [data.chatId + ".is_Read"]: true,
        });
      }
    };

    unsubscribeLastMessage();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat,data.chatId]);

  useEffect( () => {
    if (data.chatId !== null) {
      const unsubScribe = onSnapshot(
        doc(chatCollectionRef, data.chatId),
        async (docSnap) => {
          try {
            if (docSnap.exists()) {
              const unReadMessages = docSnap.data();
              const updates = [];

              Object.keys(unReadMessages).forEach((key) => {
                const message = unReadMessages[key];

                if (
                  message.receiver_id.receiver_id === currentUser.uid &&
                  message.receiver_id.isRead === false
                ) {
                  const messagePath = `${key}.receiver_id.isRead`;
                  const updatePromise = updateDoc(
                    doc(chatCollectionRef, data.chatId),
                    {
                      [messagePath]: true,
                    }
                  );
                  updates.push(updatePromise);
                }
              });

              await Promise.all(updates);
            }
          } catch (error) {
            console.log(error);
          }
        }
      );
      return () => unsubScribe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[chat,data.chatId])

  //we use this for localestring, once the message was past a month, it will display the date when it was sent/received
  const monthOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  //this for display how much time that the message received pass
  useEffect(() => {
    // Update timestamps every minute
    const updatedTimestamps = {};
    Object.entries(chat)?.forEach(([key, value]) => {
      const formatDate = (recentTimestamp) => {
        if (recentTimestamp) {
          const now = new Date();
          const messageTime = recentTimestamp.toDate();
          const timeDifference = now - messageTime;

          return timeDifference < minute
            ? "Just now"
            : timeDifference < hour
            ? `${Math.floor(timeDifference / minute)} min${
                Math.floor(timeDifference / minute) !== 1 ? "s" : ""
              } ago`
            : timeDifference < day
            ? `${Math.floor(timeDifference / hour)} hr${
                Math.floor(timeDifference / hour) !== 1 ? "s" : ""
              } ago`
            : timeDifference < month
            ? `${Math.floor(timeDifference / day)} day${
                Math.floor(timeDifference / day) !== 1 ? "s" : ""
              } ago`
            : messageTime.toLocaleString("en-US", monthOptions); // Format as a full date a
        }
      };
      updatedTimestamps[key] = formatDate(value.date);
      
    });

    setTimestamps(updatedTimestamps);

    const intervalId = setInterval(() => {
      const updatedTimestamps = {};
      Object.entries(chat).forEach(([key, value]) => {
        const formatDate = (recentTimestamp) => {
          if (recentTimestamp) {
            const now = new Date();
            const messageTime = recentTimestamp.toDate();
            const timeDifference = now - messageTime;

            return timeDifference < minute
              ? "Just now"
              : timeDifference < hour
              ? `${Math.floor(timeDifference / minute)} min${
                  Math.floor(timeDifference / minute) !== 1 ? "s" : ""
                } ago`
              : timeDifference < day
              ? `${Math.floor(timeDifference / hour)} hr${
                  Math.floor(timeDifference / hour) !== 1 ? "s" : ""
                } ago`
              : timeDifference < month
              ? `${Math.floor(timeDifference / day)} day${
                  Math.floor(timeDifference / day) !== 1 ? "s" : ""
                } ago`
              : messageTime.toLocaleString("en-US", monthOptions); // Format as a full date a
          }
        };
        updatedTimestamps[key] = formatDate(value.date);
        
      });
      setTimestamps(updatedTimestamps);
    }, minute);

    // Clear the interval when the component is unmounted or dependencies change
    return () => clearInterval(intervalId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat]);

  return (
    <MessageList
      isempty={Object.entries(chat)?.length === 0 ? "true" : "false"}
    >
      {Object.entries(chat)?.length === 0 ? (
        <EmptyChat>
          <StorageIcon />
        </EmptyChat>
      ) : (
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          {Object.entries(chat)
            ?.sort((a, b) => b[1].date - a[1].date)
            .map(([key, value]) =>
              value.last_message || value.last_message === "" ? (
                <ListItem
                  alignItems="flex-start"
                  key={key}
                  onClick={() => {
                    dispatch({
                      type: "SET_CHAT_ID",
                      payload: { user: value.user_info, joinedUserId: key },
                    });
                  }}
                  sx={{
                    gap: ".25rem",
                    alignItems: "center",
                    bgcolor: data.chatId === key ? "#b5b5b5" : "",
                  }}
                >
                  <ListItemAvatar>
                    {userId.find(
                      (user) => user.uid === value.user_info.uid
                    ) && (
                      <StyledBadge
                        overlap="circular"
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        variant="dot"
                        status={
                          userId.find(
                            (user) => user.uid === value.user_info.uid
                          )?.status
                        }
                      >
                        <Avatar
                          alt={value.user_info.displayName}
                          src={
                            userId.find(
                              (user) => user.uid === value.user_info.uid
                            )?.photoURL
                          }
                        />
                      </StyledBadge>
                    )}
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box alignItems={"center"}>
                        <ContactName>
                          <Typography noWrap sx={{ width: "240px" }}>
                            {value.user_info.displayName}
                          </Typography>
                          {!value.is_read && unreadMessages[key] ? (
                            <UnreadTypography>
                              {unreadMessages[key]}
                            </UnreadTypography>
                          ) : (
                            ""
                          )}
                        </ContactName>
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography
                          variant="em"
                          noWrap
                          color="text.white"
                          fontSize="14px"
                          fontWeight={value.is_Read ? "100" : "900"}
                          sx={{ width: "120px" }}
                        >
                          {value.last_message}
                        </Typography>

                        <Typography
                          variant="em"
                          fontSize="14px"
                          color={data.chatId === key ? "white" : "#adb5bd"}
                          textAlign={"end"}
                        >
                          {timestamp[key]}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ) : (
                <Box key={key}></Box>
              )
            )}
        </List>
      )}
    </MessageList>
  );
}
