import React, { useContext, useEffect, useState } from "react";
import SearchFriend from "./SearchFriend";
import {
  friendRequestCollectionRef,
  userCollectionRef,
  userFriendsCollectionRef,
} from "../../../firebase_config/firebase_config";
import { AuthContext } from "../../../useContext/AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import FriendRequestList from "./FriendRequestList";
import {
  Box,
  Button,
  // CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  // circularProgressClasses,
  useTheme,
} from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Avatar,
  CustomWidthTooltip,
  EmptyRequest,
  FriendListBox,
  FriendListContainer,
  FriendRequestBadge,
} from "../../chatComponents/ChatContainer/Theme/Theme";
import StorageIcon from "@mui/icons-material/Storage";

export default function FriendList() {
  const theme = useTheme();
  const { currentUser } = useContext(AuthContext);
  // const { data } = useContext(ChatUserContext)
  const [friendList, setFriendList] = useState([]);
  const [userId, setUserId] = useState([]);
  const [openRequest, setOpenRequest] = useState(false);
  // const [isloading, setIsLoading] = useState(true);
  const [newRequestCount, setNewRequestCount] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const unsubscribeFriend = () => {
      try {
        const docRef = doc(userFriendsCollectionRef, currentUser.uid);
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            [docSnap.data()].map((item) => {
              const keys = Object.keys(item);
              return keys.map((key) => {
                if (item[key].request_state === "friend") {
                  setUserId((prevUserId) => [
                    ...prevUserId,
                    item[key].requestUID,
                  ]);
                }
                return null;
              });
            });
          }
        });
        return () => unsubscribe();
      } catch (error) {
        console.log(error);
      }
    };
    unsubscribeFriend();
  }, [currentUser.uid]);

  useEffect(() => {
    const fetchFriendRequest = () => {
      const unsubscribe = onSnapshot(
        doc(friendRequestCollectionRef, currentUser.uid),
        (docSnap) => {
          try {
            const requestCount = Object.values(docSnap.data())?.filter(
              (request) => request.request_state === "pending" && request.requestUID_by !== currentUser.uid
            ).length;
            setNewRequestCount(requestCount);
          } catch (error) {
            console.log(error);
          }
        }
      );
      return () => unsubscribe();
    };
    fetchFriendRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const userFriend = async () => {
      try {
        const unsubscribeFriendData = onSnapshot(
          userCollectionRef,
          (querySnapshot) => {
            const newFriendList = [];
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              if (userId.includes(doc.id)) {
                newFriendList.push(data);
              }
            });
            setFriendList(newFriendList);
            // setIsLoading(false);
          }
        );

        return () => unsubscribeFriendData();
      } catch (error) {
        console.log(error);
      }
    };
    userFriend();
  }, [userId]);

  // const addFriendsHandler = () => {};

  const onChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const friendListResult = friendList
    ?.filter((item) => {
      if (!searchTerm) return true; // If search term is empty, include all items
      return item.displayName.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .map((item, i) => (
      <ListItem key={i}>
        <ListItemAvatar>
          <Avatar src={item.photoURL} alt={item.displayName} />
        </ListItemAvatar>
        <ListItemText>
          <Typography sx={{ fontWeight: "bold" }}>
            {item.displayName}
          </Typography>
        </ListItemText>
      </ListItem>
    ));

  const requestHandler = () => {
    setOpenRequest(true);
  };

  const closeRequestHandler = () => {
    setOpenRequest(false);
  };


  return (
    <FriendListContainer>
      <Box p="1rem">
        <Typography variant="h4" fontWeight={800} display="block">
          Friends
        </Typography>
        <Typography
          variant="subtitle1"
          display="block"
          gutterBottom
          color="text.secondary"
        >
          Start chatting your friends
        </Typography>
      </Box>

      {openRequest ? (
        <Box onClick={closeRequestHandler} p="0 1rem 1rem 1rem">
          <CustomWidthTooltip title="Back" placement="right">
            <Button
              sx={{
                color: theme.palette.text.primary,
                display: "flex",
                gap: ".5rem",
              }}
            >
              <ArrowBackIcon />
              <PeopleAltIcon />
              <FriendRequestBadge color="secondary">
                <Typography>Friend Request</Typography>
              </FriendRequestBadge>
            </Button>
          </CustomWidthTooltip>
        </Box>
      ) : (
        <Box onClick={requestHandler} p="0 1rem 1rem 1rem">
          <CustomWidthTooltip title="See all friend request" placement="right">
            <Button
              sx={{
                color: theme.palette.text.primary,
                display: "flex",
                gap: ".5rem",
              }}
            >
              <PeopleAltIcon />
              <FriendRequestBadge
                color="secondary"
                badgeContent={newRequestCount}
              >
                <Typography>Friend Request</Typography>
              </FriendRequestBadge>
              <ArrowForwardIcon />
            </Button>
          </CustomWidthTooltip>
        </Box>
      )}

      {openRequest ? (
        <FriendRequestList />
      ) : (
        <>
          <SearchFriend onChange={onChange} searchTerm={searchTerm} />
          <FriendListBox>
            {friendList.length === 0 ? (
              <EmptyRequest>
                <StorageIcon />
              </EmptyRequest>
            ) : (
              <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                {friendListResult}
              </List>
            )}
          </FriendListBox>
        </>
      )}
    </FriendListContainer>
  );
}
