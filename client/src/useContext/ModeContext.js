import React, { createContext, useReducer } from "react";


export const ModeContext = createContext();

const ModeReducer = ( state, action ) => {
  switch (action.type) {
    case "SET_MODE":
      return action.payload;
    default:
      return state;
  }
};

export const ModeContextProvider = ({ children }) => {
  const storedMode = localStorage.getItem("mode") || "light";
  const [mode, dispatchMode] = useReducer(ModeReducer, storedMode);


  return (
    <ModeContext.Provider value={{ mode, dispatchMode }}>
      {children}
    </ModeContext.Provider>
  );
};
