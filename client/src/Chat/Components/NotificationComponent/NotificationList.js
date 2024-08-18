import React, { useContext, useEffect, useState } from "react";
import {
  deleteField,
  doc,
  // getDocs,
  onSnapshot,
  updateDoc,
  // serverTimestamp,
  // setDoc,
  // updateDoc,
} from "firebase/firestore";

import { userNotificationsCollectionRef } from "../../../firebase_config/firebase_config";
import { AuthContext } from "../../../useContext/AuthContext";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  Typography,
} from "@mui/material";
import {
  Avatar,
  DeleteNotificationIcon,
  EmptyNotification,
  NotificationListBox,
  NotificationListContainer,
} from "../../chatComponents/ChatContainer/Theme/Theme";
import StorageIcon from "@mui/icons-material/Storage";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export default function NotificationList() {

  const { currentUser } = useContext(AuthContext);
  const [notification, setNotification] = useState([]);

  const monthOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  useEffect(() => {
    const notificationList = () => {
      const unsubscribe = onSnapshot(
        doc(userNotificationsCollectionRef, currentUser.uid),
        (docSnap) => {
          try {
            if (docSnap.exists()) {
              const data = docSnap.data();
              setNotification([data]);
            }
          } catch (error) {
            console.log(error);
          }
        }
      );

      return () => unsubscribe();
    };
    notificationList();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Delete notification
  const DeleteNotification = async(notificationID) => {
    await updateDoc(doc(userNotificationsCollectionRef,currentUser.uid),{
      [notificationID] : deleteField()
    })
  }
  
  const fetchNotif = notification?.flatMap((item) => {
    const keys = Object.keys(item);
    return keys.map((key) => {
      if (item[key].notification_content) {
        return (
            <ListItem key={key}>
              <ListItemAvatar>
                <Avatar src={item[key].photoURL} alt="profilepic" />
              </ListItemAvatar>
              <Typography fontSize={14}>{item[key].notification_content} <span style={{fontSize: 12}}>{item[key].date.toDate().toLocaleString("en-US", monthOptions)}</span></Typography>
              <Box sx={{display: "flex",flexGrow: 1, justifyContent: "flex-end"}}>
                <DeleteNotificationIcon onClick={() => DeleteNotification(key)}><DeleteForeverIcon/></DeleteNotificationIcon>
              </Box>
            </ListItem>
        );
      }
      return null;
    });
  });

  return (
    <NotificationListContainer>
      <Box sx={{padding: "1rem",}}>
        <Typography variant="h4" fontWeight={800} display="block">
          Notification
        </Typography>
        <Typography
          variant="subtitle1"
          display="block"
          gutterBottom
          color="text.secondary"
        >
          List of notifications
        </Typography>
        <Divider />
      </Box>
      <NotificationListBox>
        {fetchNotif.length !== 0 ? (
          <List>
            {fetchNotif}
          </List>
        ) : (
          <EmptyNotification>
            <StorageIcon />
          </EmptyNotification>
        )}
      </NotificationListBox>

      {/* {console.log(fetchReq)} */}
    </NotificationListContainer>
  );
}
