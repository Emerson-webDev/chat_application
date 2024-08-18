import { onAuthStateChanged } from "firebase/auth";
import React, { createContext, useEffect, useReducer } from "react";
import { auth, userCollectionRef } from "../firebase_config/firebase_config";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { Grid } from "@mui/material";
import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  // retrieve the mode from localstorage
  

  const INITIAL_STATE = {
    currentUser: null,
    status: "offline",
    isAuthResolved: false,
  };

  
  const CurrentUserReducer = (state, action) => {
    switch (action.type) {
      case "SET_CURRENT_USER":
        return {
          ...state,
          currentUser: action.payload,
        };

      case "SET_AUTH_RESOLVED":
        return {
          ...state,
          isAuthResolved: true,
        };
      
      case "RESET_STATE":
        return INITIAL_STATE;

      default:
        return state;
    }
  };

  const [state, dispatchUser] = useReducer(CurrentUserReducer, INITIAL_STATE);

  // this check for authentication
  useEffect(() => {
    const unsub = onAuthStateChanged(
      auth,
      async (current = state.currentUser) => {

        dispatchUser({
          type: "SET_CURRENT_USER",
          payload: current,
        });

        dispatchUser({
          type: "SET_AUTH_RESOLVED",
        });
      }
    );
    return () => {
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // handle for logging/signing out
  const signOut = async () => {
    try {
      await updateDoc(doc(userCollectionRef, state.currentUser.uid), {
        status: {
          state: "offline",
          last_changed: serverTimestamp(),
          video_call_state: false
        },
      });
      window.location.reload();
      await auth.signOut();
      dispatchUser({ type: "RESET_STATE" });
      dispatchUser({ type: "SET_AUTH_RESOLVED", payload: false });

      //clear localStorage
      localStorage.removeItem("mode")

    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!state.isAuthResolved) {
    return (
      <Grid
      container
      sx={{
        height: "100vh",
        overflow: "hidden", // Prevent overflow
        bgcolor: "background.paper"
      }}>
        <Grid item sx={{
          flex: 1,
          display: "grid",
          placeContent: "center",
        }}>
          <CircularProgress
            variant="indeterminate"
            disableShrink
            sx={{
              color: "#01b6c5",
              animationDuration: "550ms",
              position: "relative",
              left: 0,
              [`& .${circularProgressClasses.circle}`]: {
                strokeLinecap: "round",
              },
            }}
            size={100}
            thickness={4}
          />
        </Grid>
      </Grid>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        signOut,
        currentUser: state.currentUser,
        currentPeerId: state.currentPeerID,
        usersPeerId: state.usersPeerId,
        mode: state.mode,
        dispatchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
