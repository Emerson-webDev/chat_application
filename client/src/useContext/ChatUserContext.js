import React, { createContext, useReducer } from "react";

export const ChatUserContext = createContext();

export const ChatUserContextProvider = ({ children }) => {
  const INITIAL_STATE = {
    chatId: null,
    user: {},
    message: [],
  };

  const ChatUserReducer = (state, action) => {
    switch (action.type) {
      case "SET_CHAT_ID":
        return {
          ...state,
          chatId: action.payload.joinedUserId,
          user: action.payload.user,
        };
      case "SET_CHAT_MESSAGE":
        return {
          ...state,
          message: action.payload.message,
        };

      case "RESET_STATE":
        return INITIAL_STATE;

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(ChatUserReducer, INITIAL_STATE);

  return (
    <ChatUserContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatUserContext.Provider>
  );
};
