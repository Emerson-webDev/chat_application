import React from "react";
import ActiveCall from "./CallModal/ActiveCall/ActiveCall";
import { Box } from "@mui/material";

export default function VideoChat({
  open,
  onCancel,
  cancelCall,
  front,
  switchCamera,
  isMicOn,
  setIsMicOn,
  videoCamActive,
  setVideoCamActive,
  localVideoRef,
  remoteVideoRef,
  hangUpCall,
  socket,
  remoteStream,
  setRemoteStream,
  currentPeerId,
  firstHangUpCall,
  secondHangUpCall,
}) {

  return (
    <Box>
      {localVideoRef && <ActiveCall
        front={front}
        switchCamera={switchCamera}
        isMicOn={isMicOn}
        setIsMicOn={setIsMicOn}
        videoCamActive={videoCamActive}
        setVideoCamActive={setVideoCamActive}
        socket={socket}
        open={open}
        cancelCall={cancelCall}
        onCancel={onCancel}
        hangUpCall={hangUpCall}
        localVideoRef={localVideoRef}
        remoteVideoRef={remoteVideoRef}
        remoteStream={remoteStream}
        currentPeerId={currentPeerId}
        setRemoteStream={setRemoteStream}
        firstHangUpCall={firstHangUpCall}
        secondHangUpCall={secondHangUpCall}
      />}
    </Box>
  );
}
