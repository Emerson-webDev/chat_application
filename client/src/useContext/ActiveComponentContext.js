import React, { createContext, useReducer } from "react";

export const ActiveComponentContext = createContext()

const INITIAL_STATE = {
  active : "Chat"
}

const ActiveComponentReducer = (state, action) => {
  switch (action.type) {
    case "ACTIVE_COMPONENT" :
      return {active : action.payload}
    default:
      return
  }
}

export const ActiveComponentContextProvider = ({children}) => {
  const [state, dispatchActiveComponent] = useReducer(ActiveComponentReducer,INITIAL_STATE)

  return (
    <ActiveComponentContext.Provider value={{activeComponent : state.active, dispatchActiveComponent}}>
      {children}
    </ActiveComponentContext.Provider>
  )
}

