import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./useContext/AuthContext";
import { ChatUserContextProvider } from "./useContext/ChatUserContext";
import { ModeContextProvider } from "./useContext/ModeContext";
import { ActiveComponentContextProvider } from "./useContext/ActiveComponentContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthContextProvider>
    <ModeContextProvider>
      <ActiveComponentContextProvider>
        <ChatUserContextProvider>
          {/* <React.StrictMode> */}
          <App />
          {/* </React.StrictMode> */}
        </ChatUserContextProvider>
      </ActiveComponentContextProvider>
    </ModeContextProvider>
  </AuthContextProvider>
);
