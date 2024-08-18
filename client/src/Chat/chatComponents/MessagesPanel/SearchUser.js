import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
// import { userCollectionRef } from "../../../firebase_config/firebase_config";
import { AuthContext } from "../../../useContext/AuthContext";
import {
  chatCollectionRef,
  userChatCollectionRef,
  videoCallCollectionRef,
} from "../../../firebase_config/firebase_config";
import { ChatUserContext } from "../../../useContext/ChatUserContext";
import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { Search, SearchIconWrapper, StyledInputBase, SearchBox } from "./Theme/Theme";
import SearchIcon from "@mui/icons-material/Search";

import API from "../../../API/API"

export default function SearchUser({ setOpen ,open }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [cancelToken, setCancelToken] = useState(null);
  const [noResults, setNoResults] = useState(null);

  const { currentUser } = useContext(AuthContext);

  const { dispatch } = useContext(ChatUserContext);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (searchTerm === "") {
          setUsers([]);
        } else {
          
          const newCancelToken = axios.CancelToken.source();
          setCancelToken(newCancelToken);

          const res = await API.get("/search_user", {
            params: {
              name: searchTerm,
            },

            cancelToken: newCancelToken.token,
          });
          
          if (searchTerm === "") {
            setNoResults(null)
          }
          res.data.length === 0 ? setNoResults(true) : setNoResults(null);
          setUsers(res.data);
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Previous request canceled");
        } else {
          console.log(error.message);
        }
      }
    };
    
    fetchUser();

    return () => {
      if (cancelToken) {
        cancelToken.cancel("Request canceled");
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const selectUserHandler = async (user) => {
    const joinedUserId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    // [currentUser.uid, user.uid].sort().join('')
    setOpen(false);

    try {
      // Check if the joinedUserId is already exists in the collection/chatCollectionRef
      const chatResData = await getDoc(doc(chatCollectionRef, joinedUserId));
      const vidResData = await getDoc(doc(videoCallCollectionRef, currentUser.uid))
      

      await setDoc(doc(userChatCollectionRef, user.uid), {}, { merge: true });
      
      if (vidResData.exists()) {
        await updateDoc(doc(videoCallCollectionRef, currentUser.uid), {
          [joinedUserId + ".callActiveState"]: false,
          [joinedUserId + ".caller_uid"]: null,
          [joinedUserId + ".callee_uid"]: null,
        });      
  
        await updateDoc(doc(videoCallCollectionRef, user.uid), {
          [joinedUserId + ".callActiveState"]: false,
          [joinedUserId + ".caller_uid"]: null,
          [joinedUserId + ".callee_uid"]: null,
        });
      }

      if (!chatResData.exists()) {
        await setDoc(doc(chatCollectionRef, joinedUserId), {}, { merge: true });

        dispatch({ type: "SET_CHAT_ID", payload: { user, joinedUserId } });
      } else {
        dispatch({ type: "SET_CHAT_ID", payload: { user, joinedUserId } });
      }
    } catch (error) {
      console.log(error);
    }
    // console.log(user)
  };

  const onChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <SearchBox>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          inputProps={{ "aria-label": "search" }}
          name="name"
          value={searchTerm}
          onChange={onChange}
          placeholder="Search..."
          onFocus={() => setOpen(true)}
          onBlur={() => {
            setTimeout(() => {
              setOpen(false);
              setSearchTerm("");
              setNoResults(null);
            }, 500);
          }}
        />
      </Search>
      
      <List sx={{ ...(open && {width: "100%", maxWidth: 360, bgcolor: "background.paper",marginTop: 2}) }}>
        {noResults ? (
          <Box pl={3} pr={3}>No results found for {searchTerm}</Box>
        ) : (
          users.map((user, i) => (
            <ListItem
            key={i}
              onClick={async () => {
                selectUserHandler(user);
                setSearchTerm("");
              }}
            >
              <ListItemAvatar>
                <Avatar alt={user.displayName} src={user.photoURL} />
              </ListItemAvatar>
              <ListItemText
                primary={<Typography sx={{ fontWeight: "bold" }}>{user.displayName}</Typography>}
              />
            </ListItem>
          ))
        )
        }
      </List>
    </SearchBox>
  );
}
