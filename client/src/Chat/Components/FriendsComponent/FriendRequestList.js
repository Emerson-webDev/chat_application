import React, { useContext, useEffect, useState } from "react";
import {
  doc,
  // deleteDoc,
  // doc,
  // getDocs,
  onSnapshot,
  // setDoc,
  // updateDoc,
} from "firebase/firestore";

import StorageIcon from "@mui/icons-material/Storage";

import { friendRequestCollectionRef } from "../../../firebase_config/firebase_config";
import { AuthContext } from "../../../useContext/AuthContext";

import {
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  circularProgressClasses,
  useTheme,
} from "@mui/material";
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import CheckIcon from '@mui/icons-material/Check';

import {
  Avatar,
  ButtonGroup,
  EmptyRequest,
  RequestBox,
} from "../../chatComponents/ChatContainer/Theme/Theme";
import API from "../../../API/API";

export default function FriendRequestList() {
  const theme = useTheme();
  const { currentUser } = useContext(AuthContext);
  const [fetchRequest, setFetchRequest] = useState(null);
  const [isloading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribeReq = () => {
      onSnapshot(doc(friendRequestCollectionRef,currentUser.uid), (docSnap) => {
        try {
          const data = docSnap.data();
          if(docSnap.exists()){    
            if (Object.keys(data).length !== 0) {
              setFetchRequest(data);
              setIsLoading(false);
              console.log(data);
            }
          }
          
        } catch (error) {
          console.log(error);
        }finally{
          setIsLoading(false);
        }
      });
    };
    unsubscribeReq();
    // eslint-disable-next-line
  }, []);

  console.log()

  // const isMobileDevice = () => {
  //   return /Mobi|Android|iPhone|iPad|iPod|Windows Phone|KFAPWI/i.test(
  //     navigator.userAgent
  //   );
  // };

  // const getRejectRequestURL = (currentId) => {
  //   if (isMobileDevice()) {
  //     // Replace 'your_laptop_ip' with the actual IP address of your laptop running the server
  //     return `http://192.168.1.13:3001/reject_request/${currentId}`;
  //   } else {
  //     return `http://localhost:3001/reject_request/${currentId}`;
  //   }
  // };

  const acceptRequestHandler = async (currentId, requested_by, key) => {
    try {
      // const deleteRequestUrl = getRejectRequestURL(key)
      await API.post(`accept_request/${currentId}`, {
        ids: [requested_by, key, currentUser.displayName],
      });
      // });
    } catch (error) {
      console.log(error);
    }
  };

  //rejecting request
  const rejectRequestHandler = async (dataUserId,chatId) => {
    // await deleteDoc(doc(friendRequestCollectionRef,requestId))
    await API.delete(`/reject_request/${currentUser.uid}`,{
      params: {
        datauserId: dataUserId,
        dataChatId: chatId
      }      
    } );

    setFetchRequest((prevRequests) => {
      const updatedRequests = { ...prevRequests };
      delete updatedRequests[chatId];
      return updatedRequests;
    });
  };

  const fetchReq = fetchRequest !== null ? Object.keys(fetchRequest)?.map((key,index) => {
    return (
      fetchRequest[key].requestUID_to === currentUser.uid &&
      fetchRequest[key].request_state === "pending" && (
        <ListItem key={index}>
          <ListItemAvatar>
            <Avatar src={fetchRequest[key].photoURL} alt={fetchRequest[key].displayName} />
          </ListItemAvatar>
          <ListItemText>
            <Typography sx={{ fontWeight: "bold" }}>
              {fetchRequest[key].displayName}
            </Typography>
          </ListItemText>
          <ButtonGroup
            disableElevation
            variant="contained"
            aria-label="Disabled elevation buttons"
          >
            <Button
              sx={{
                backgroundColor: theme.palette.maincolor.light_danger,
                borderRight: "0px solid black",
                "&:hover": {
                  backgroundColor: theme.palette.maincolor.danger,
                },
              }}
              onClick={() => rejectRequestHandler(fetchRequest[key].requestUID_by,key)}
            >
              <ThumbDownOffAltIcon />
            </Button>
            <Button
              onClick={() =>
                acceptRequestHandler(
                  currentUser.uid,
                  fetchRequest[key].requestUID_by,
                  key
                )
              }
              sx={{
                backgroundColor: theme.palette.maincolor.light_success,
                "&:hover": {
                  backgroundColor: theme.palette.maincolor.success,
                },
              }}
            >
              <CheckIcon />
            </Button>
          </ButtonGroup>
        </ListItem>
      )
    );
  }) : null //im using flatMap() here to avoid returning an array of array

  // console.log(fetchReq);
  return (
    <RequestBox >
      {isloading ? (
        <Box sx={{ display: "grid", placeItems: "center", height: "inherit" }}>
          <CircularProgress
            variant="indeterminate"
            disableShrink
            sx={{
              color: theme.palette.outlined.primary,
              animationDuration: "850ms",
              position: "absolute",
              [`& .${circularProgressClasses.circle}`]: {
                strokeLinecap: "round",
              },
            }}
            size={50}
            thickness={2}
          />
        </Box>
      ) : fetchReq === null ? (
        <EmptyRequest>
          <StorageIcon />
        </EmptyRequest>
      ) : (
        <List>{fetchReq}</List>
      )}
    </RequestBox>
  );
}
