
import { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthContext } from "./useContext/AuthContext";
import { ModeContext } from "./useContext/ModeContext";

import "./App.css";
import { Box, createTheme, ThemeProvider } from "@mui/material";
import { getCustomTheme } from "./ThemeStyling/theme";


import Registration from "./Pages/Registration/Registration";
import LogIn from "./Pages/LogIn/LogIn";
import Chat from "./Chat";
import NotFound from "./404/NotFound";

function App() {
  const { currentUser } = useContext(AuthContext);
  const { mode } = useContext(ModeContext)

  const theme = createTheme(getCustomTheme(mode));

  const ProtectedRoute = ({ children }) => {
    return currentUser ? children : <Navigate to="/log_in" />;
  };

   // console.log(navigator.userAgent)

  //  console.log(currentUser.uid)

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Box className="App">
          <header className="App-header">
            <Routes>
              <Route path="/registration" element={<Registration />} />
              <Route path="/log_in" element={<LogIn />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound/>} />
            </Routes>
          </header>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
