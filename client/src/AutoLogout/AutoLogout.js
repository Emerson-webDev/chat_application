import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AuthContext } from "../useContext/AuthContext";

export default function AutoLogout({ children }) {
  const { signOut } = useContext(AuthContext);
  const [isInactive, setIsInactive] = useState(false);
  const inactivityLimit = 3 * 60 * 60 * 1000; // Set inactivity time to 3hrs (3 * 60 * 60 * 1000 ms)
  const inactivityTimeout = useRef(null);

  // Logout function
  const handleLogout = useCallback(() => {
    setIsInactive(true);
    signOut();
  }, [signOut]);

  const handleBeforeUnloaded = useCallback(
    (event) => {
      signOut();
    },
    [signOut]
  );

  // Reset inactivity timer
  const resetInactivityTimeout = useCallback(() => {
    if (isInactive) setIsInactive(false);
    clearTimeout(inactivityTimeout.current);
    inactivityTimeout.current = setTimeout(handleLogout, inactivityLimit);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleLogout, isInactive]);

  // Set up activity listeners
  useEffect(() => {
    // Activity events to listen to
    const events = ["mousemove", "keydown", "click", "scroll"];

    // Reset timer on any activity
    const handleActivity = () => resetInactivityTimeout();

    // Attach event listeners
    events.forEach((event) => window.addEventListener(event, handleActivity));
    window.addEventListener("beforeunload", handleBeforeUnloaded);

    // Start the inactivity timer
    resetInactivityTimeout();

    // Clean up
    return () => {
      clearTimeout(inactivityTimeout);
      events.forEach((event) =>
        window.removeEventListener(event, handleActivity)
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetInactivityTimeout, inactivityTimeout]);

  return <>{children}</>;
}
