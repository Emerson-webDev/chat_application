import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../../useContext/AuthContext";
import { ChatUserContext } from "../../../useContext/ChatUserContext";
import {
  Timestamp,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { v4 as uuid } from "uuid";

import {
  friendRequestCollectionRef,
  userChatCollectionRef,
  userCollectionRef,
  userFriendsCollectionRef,
  userNotificationsCollectionRef,
} from "../../../firebase_config/firebase_config";

import Appbar from "./Appbar";
import Chatbox from "./Chatbox";
import Chatcomposer from "./Chatcomposer";
import { Box, Grid } from "@mui/material";
import { MessageContainer } from "./Theme/Theme";
import SkeletonBox from "./Skeleton/SkeletonBox";

export default function ChatContainer({ onCancel, allPeerData, createCall }) {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatUserContext);
  const [userData, setUserData] = useState({});
  const [dataUser, setDataUser] = useState("");
  const [openProfile, setOpenProfile] = useState(false);

  const [loading, setLoading] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const openList = Boolean(anchorEl);

  // const [message, setMessage] = useState([]);
  const [currentlyOpenChatId, setCurrentlyOpenChatId] = useState(null);
  const messageContainerRef = useRef(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // this useffect if component mount or still mount, to update is_Read status for the read Last message in userChatCollectionRef
  useEffect(() => {
    const unsubscribeLastMessage = async () => {
      try {
        // Update is_Read field in the userChatCollectionRef only if the current chat is open
        if (data.chatId === currentlyOpenChatId) {
          await updateDoc(doc(userChatCollectionRef, currentUser.uid), {
            [data.chatId + ".is_Read"]: true,
          });

          // data.message.lenghth === 0 ? setLoading(true) : setLoading(true)
        }
      } catch (error) {
        console.log(error);
      }
    };

    unsubscribeLastMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.chatId, currentlyOpenChatId]);


  // scroll down to bottom when opening or new message received
  useEffect(() => {
    try {
      data.message.lenghth === 0 ? setLoading(true) : setLoading(false);

      const messageContainer = messageContainerRef.current;
      // I use setItemout for the timing.
      // Because the autoscroll triggered first when the messages is loaded.
      const delayScroll = setTimeout(() => {
        messageContainer.scrollTop = messageContainer.scrollHeight;
      }, 100);

      // Clear the timeout
      return () => clearTimeout(delayScroll);
    } catch (error) {
      console.log(error);
    }
  }, [data.message, currentlyOpenChatId]);

  //
  useEffect(() => {
    const getStatus = async () => {
      const unsubscribeStatus = onSnapshot(
        doc(userCollectionRef, data.user.uid),
        (docSnap) => {
          try {
            if (docSnap.exists()) {
              const dataStatus = docSnap.data();
              setDataUser(dataStatus);
            }
          } catch (error) {
            console.log(error);
          }
        }
      );

      const unsubscribeUser = onSnapshot(
        doc(userChatCollectionRef, currentUser.uid),
        (docSnap) => {
          const dataUser = docSnap.data();
          try {
            Object.keys(dataUser).map((key) => {
              if (key === data.activeKey) {
                setUserData(dataUser[key].user_info);
                setCurrentlyOpenChatId(key);
              }
              return null;
            });
          } catch (error) {
            console.log(error);
          }
        }
      );

      return () => {
        unsubscribeUser();
        unsubscribeStatus();
      };
    };
    getStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.uid, data.chatId, data.user.uid]);

  // setting document in firestore once sending a friend request
  const friendRequestHandler = async () => {
    try {
      await Promise.all([
        setDoc(
          doc(friendRequestCollectionRef, data.user.uid),
          {
            [data.chatId]: {
              displayName: currentUser.displayName || currentUser.reloadUserInfo.screenName,
              photoURL: currentUser.photoURL,
              requestUID_to: data.user.uid,
              requestUID_by: currentUser.uid,
              date_request: serverTimestamp(),
              request_state: "pending",
            },
          },
          { merge: true }
        ),

        setDoc(
          doc(friendRequestCollectionRef, currentUser.uid),
          {
            [data.chatId]: {
              displayName: currentUser.displayName || currentUser.reloadUserInfo.screenName,
              photoURL: currentUser.photoURL,
              requestUID_to: data.user.uid,
              requestUID_by: currentUser.uid,
              date_request: serverTimestamp(),
              request_state: "pending",
            },
          },
          { merge: true }
        ),

        updateDoc(doc(userFriendsCollectionRef, currentUser.uid), {
          [data.chatId]: {
            request_state: "pending",
            date_request: serverTimestamp(),
          },
        }),

        updateDoc(doc(userFriendsCollectionRef, data.user.uid), {
          [data.chatId]: {
            request_state: "pending",
            date_request: serverTimestamp(),
          },
        }),

        setDoc(
          doc(userNotificationsCollectionRef, currentUser.uid),
          {},
          { merge: "true" }
        ),

        setDoc(
          doc(userNotificationsCollectionRef, data.user.uid),
          {
            [uuid()]: {
              date: Timestamp.now(),
              uid: currentUser.uid,
              photoURL: currentUser.photoURL,
              notification_content: `${currentUser.displayName || currentUser.reloadUserInfo.screenName} sent you a friend request.`,
              is_Read: false,
            },
          },
          { merge: "true" }
        ),
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const profileInfoHandler = () => {
    setOpenProfile(true);
  };

  return (
    <>
      <Grid
        container
        direction="column"
        sx={{ height: "100%", flexGrow: 1, flexWrap: "nowrap" }}
      >
        <Grid item>
          <Box>
            <Appbar
              handleClick={handleClick}
              anchorEl={anchorEl}
              openList={openList}
              handleClose={handleClose}
              dataUser={dataUser}
              userData={userData}
              onCancel={onCancel}
              createCall={createCall}
              allPeerData={allPeerData}
              friendRequestHandler={friendRequestHandler}
              profileInfoHandler={profileInfoHandler}
            />
          </Box>
        </Grid>
        <MessageContainer
          ref={messageContainerRef}
          item
          px="20px"
          sx={{ flexGrow: 1, overflowY: "auto", height: "100%" }}
        >
          {loading ? (
            <SkeletonBox />
          ) : (
            dataUser.status && (
              <Chatbox
                onCancel={onCancel}
                status={dataUser.status.state}
                message={data.message}
                currentlyOpenChatId={currentlyOpenChatId}
                loading={loading}
              />
            )
          )}
        </MessageContainer>
        <Grid item>
          <Chatcomposer openProfile={openProfile} />
        </Grid>
      </Grid>
    </>
  );
}
