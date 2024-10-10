import React, { useContext, useEffect, useRef, useState } from "react";
import Messages from "./Components/Messages";
import Friend from "./Components/FriendsComponent/Friend";
import Notification from "./Components/NotificationComponent/Notification";
import Profile from "./Components/ProfileComponents/Profile";
import NavigationBar from "./chatComponents/NavigationBar/NavigationBar";
import Container from "./chatComponents/ChatContainer/Container";
import { useMediaQuery, useTheme } from "@mui/material";

import { Peer } from "peerjs";
import { io } from "socket.io-client";
import { AuthContext } from "../useContext/AuthContext";
import {
  userCollectionRef,
  videoCallCollectionRef,
} from "../firebase_config/firebase_config";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { ChatUserContext } from "../useContext/ChatUserContext";
import ReceivingCallModal from "./chatComponents/ChatContainer/CallModal/ReceivingCallModal";
import VideoChat from "./chatComponents/ChatContainer/VideoChat";
import NavigationBottomBar from "./chatComponents/NavigationBar/NavigationBottomBar/NavigationBottomBar";
import { MainChatContainer } from "./chatComponents/ChatContainer/Theme/Theme";
import { baseURL } from "../API/API";
import { ActiveComponentContext } from "../useContext/ActiveComponentContext";

export default function Chat() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down(880));

  // const [activeComponent, setActiveComponent] = useState("Chat");

  const { currentUser } = useContext(AuthContext);
  const { data, dispatch } = useContext(ChatUserContext);
  const { activeComponent } = useContext(ActiveComponentContext);

  const [open, setOpen] = useState(false);

  const [receivingCall, setReceivingCall] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [callActiveState, setCallActiveState] = useState({});
  const [currentPeerId, setCurrentPeerId] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [allPeerData, setAllPeerData] = useState({});

  //set camera facing. switch front or back camera
  const [front, setFront] = useState(true);

  // set screen sharing

  const [screenSharing, setScreenSharing] = useState(false);

  // this for muting the audio or unmuting
  const [isMicOn, setIsMicOn] = useState(true);
  // this for open or close camera
  const [videoCamActive, setVideoCamActive] = useState(true);

  const socket = useRef();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const incomingCallRef = useRef(null);

  const socketURL = baseURL.startsWith("https")
      ? baseURL.replace("https", "wss")
      : baseURL.replace("http", "ws");

  useEffect(() => {
    Peer.debug = true;
    const peer = new Peer();

    socket.current = io(socketURL, { transports: ["websocket"] });

    try {
      peer.on("open", function (id) {
        socket.current.emit("connecting", id, currentUser.uid);
      });

      socket.current.on("currentPeerID", (id) => {
        setCurrentPeerId(id);
      });

      socket.current.on("allPeerData", (users) => {
        setAllPeerData(users);
      });

      // this is for answering the call
      peer.on("call", (call) => {
        incomingCallHandler(call);
      });

      peerRef.current = peer;
    } catch (error) {
      console.log(error);
    }

    return () => {
      // Disconnect socket and destroy peer on component unmount
      socket.current.disconnect();
      peerRef.current.destroy();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const videoCall = async () => {
      const unsubScribe = onSnapshot(
        doc(videoCallCollectionRef, currentUser.uid),
        (docSnap) => {
          if (docSnap.exists()) {
            const docData = docSnap.data();
            const dataChatId = Object.keys(docData).map((key) => {
              return key;
            });
            setCallActiveState(docData[dataChatId]);
            // console.log(docData);
          }
        }
      );

      return () => {
        // Cleanup and remove the event listener when the component is unmounted
        unsubScribe();
      };
    };

    videoCall();
  }, [data.chatId, currentUser.uid, open]);

  const createNewPeer = () => {
    // Initialize a new Peer connection
    //  we need to initialiaze new connection because everytime we end up the call
    // the id for each user deleted or disconnect in server.
    const newPeer = new Peer();
    newPeer.on("open", function (id) {
      socket.current.emit("connecting", id, currentUser.uid);
    });

    newPeer.on("call", (call) => {
      incomingCallHandler(call);
    });

    peerRef.current = newPeer;
  };

  const createCall = async (remoteUserId) => {
    setCallActive(true);
    setOpen(true);
    try {
      if (remoteUserId) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        localVideoRef.current.srcObject = stream;
        const call = peerRef.current.call(remoteUserId, stream);

        call.on("stream", (remotestream) => {
          remoteVideoRef.current.srcObject = remotestream;
          setCallAccepted(true);
        });

        setRemoteStream(stream);

        await Promise.all([
          // Update Firestore to indicate that the caller is in a call
          updateDoc(doc(userCollectionRef, currentUser.uid), {
            "status.video_call_state": "active",
          }),

          // Update the doc fields for currentUser or who is the caller
          updateDoc(doc(videoCallCollectionRef, currentUser.uid), {
            [data.chatId + ".callActiveState"]: true,
            [data.chatId + ".caller_uid"]: currentUser.uid,
            [data.chatId + ".callee_uid"]: data.user.uid,
          }),

          // Update the doc fields for dataUser or who is the callee
          updateDoc(doc(videoCallCollectionRef, data.user.uid), {
            [data.chatId + ".callActiveState"]: true,
            [data.chatId + ".caller_uid"]: currentUser.uid,
            [data.chatId + ".callee_uid"]: data.user.uid,
          }),
        ]);
      }
    } catch (error) {
      console.log("Error handling creating call:", error);
    }
  };

  //this function execute or process in callee side or the datauser whose
  //the caller/currentuser are calling
  const incomingCallHandler = async (call) => {
    try {
      if (call) {
        incomingCallRef.current = call;
        setReceivingCall(true);
        setOpen(true);
        // Update Firestore to indicate that the callee is in a call
        await updateDoc(doc(userCollectionRef, currentUser.uid), {
          "status.video_call_state": "active",
        });
        // console.log(call)
      } else {
        console.log("Received call is null or undefined");
      }
    } catch (error) {
      console.log("Error handling incoming call:", error);
    }
  };

  //this is initiate for the callee side
  const answerCall = async () => {
    setReceivingCall(false);
    setCallAccepted(true);
    setCallActive(true);
    setOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localVideoRef.current.srcObject = stream;
      incomingCallRef.current.answer(stream);
      setRemoteStream(stream);

      incomingCallRef.current.on("stream", (remotestream) => {
        remoteVideoRef.current.srcObject = remotestream;
      });
    } catch (error) {
      console.log(error);
    }
  };

  //this function is for ending the call or video conversation
  //also this function are for the user who end up the call first
  const firstHangUpCall = async (dataChatkey, dataUserId) => {
    try {
      if (peerRef.current) {
        // Stop local media tracks
        const localStream = localVideoRef.current.srcObject;
        const tracks = localStream.getTracks();
        tracks.forEach((track) => track.stop());

        // Clear the video streams
        localVideoRef.current.srcObject = null;
        remoteVideoRef.current.srcObject = null;

        // Update the call status
        setCallAccepted(false);
        setCallActive(false);
        setOpen(false);
        setVideoCamActive(true);
        setIsMicOn(true);
        setFront(true);
        setScreenSharing(false);
        setRemoteStream(null);

        //disconnect the peerId in server then create new
        socket.current.emit("user-disconnect", currentUser.uid);

        // Close the Peer connection for both sides
        peerRef.current.destroy();

        //this will initialize new peer
        createNewPeer();
      }
      await Promise.all([
        updateDoc(doc(userCollectionRef, currentUser.uid), {
          "status.video_call_state": null,
        }),
        updateDoc(doc(userCollectionRef, dataUserId), {
          "status.video_call_state": false,
        }),
        updateDoc(doc(videoCallCollectionRef, currentUser.uid), {
          [dataChatkey + ".callActiveState"]: false,
          [dataChatkey + ".caller_uid"]: null,
          [dataChatkey + ".callee_uid"]: null,
        }),
      ]);
    } catch (error) {
      console.log("Error handling hang up call:", error);
    }
  };

  //this function is for ending the call or video conversation too
  //this function are for the user who end up the call first
  const secondHangUpCall = async (dataChatkey) => {
    try {
      if (peerRef.current) {
        // Stop local media tracks
        const localStream = localVideoRef.current.srcObject;
        const tracks = localStream.getTracks();
        tracks.forEach((track) => track.stop());

        // Clear the video streams
        localVideoRef.current.srcObject = null;
        remoteVideoRef.current.srcObject = null;

        // Update the call status
        setCallAccepted(false);
        setCallActive(false);
        setOpen(false);
        setVideoCamActive(true);
        setIsMicOn(true);
        setFront(true);
        setScreenSharing(false);
        setRemoteStream(null);

        //disconnect the peerId in server then create new
        socket.current.emit("user-disconnect", currentUser.uid);

        // Close the Peer connection for both sides
        peerRef.current.destroy();

        //this will initialize new peer
        createNewPeer();
      }

      await Promise.all([
        updateDoc(doc(userCollectionRef, currentUser.uid), {
          "status.video_call_state": null,
        }),
        updateDoc(doc(videoCallCollectionRef, currentUser.uid), {
          [dataChatkey + ".callActiveState"]: false,
          [dataChatkey + ".caller_uid"]: null,
          [dataChatkey + ".callee_uid"]: null,
        }),
      ]);
    } catch (error) {
      console.log("Error handling hang up call:", error);
    }
  };

  const rejectCall = async (chatId, callerDataUserId) => {
    if (peerRef.current) {
      // Update the call status
      setReceivingCall(false);
      setCallAccepted(false);
      setCallActive(false);
      setOpen(false);
      setVideoCamActive(true);
      setIsMicOn(true);
      setFront(true);
      setRemoteStream(null);

      incomingCallRef.current.close();

      //disconnect the peerId in server then create new
      socket.current.emit("user-disconnect", currentUser.uid);

      // Close the Peer connection for both sides
      peerRef.current.destroy();

      //this will initialize new peer
      createNewPeer();
    }

    await Promise.all([
      updateDoc(doc(userCollectionRef, currentUser.uid), {
        "status.video_call_state": null,
      }),

      updateDoc(doc(userCollectionRef, callerDataUserId), {
        "status.video_call_state": false,
      }),

      updateDoc(doc(videoCallCollectionRef, currentUser.uid), {
        [chatId + ".callActiveState"]: false,
        [chatId + ".caller_uid"]: null,
        [chatId + ".callee_uid"]: null,
      }),
    ]);
  };

  const cancelCall = async (chatId, dataUserId) => {
    setCallAccepted(false);
    setCallActive(false);

    if (peerRef.current) {
      // Stop local media tracks
      const localStream = localVideoRef.current.srcObject;
      const tracks = localStream.getTracks();
      tracks.forEach((track) => track.stop());

      // Clear the video streams
      localVideoRef.current.srcObject = null;
      remoteVideoRef.current.srcObject = null;

      // Update the call status
      setCallAccepted(false);
      setCallActive(false);
      setOpen(false);
      setVideoCamActive(true);
      setIsMicOn(true);
      setFront(true);
      setScreenSharing(false);
      setRemoteStream(null);

      //disconnect the peerId in server then create new
      socket.current.emit("user-disconnect", currentUser.uid);

      // Close the Peer connection for both sides
      peerRef.current.destroy();

      //this will initialize new peer
      createNewPeer();
    }

    await Promise.all([
      updateDoc(doc(userCollectionRef, currentUser.uid), {
        "status.video_call_state": null,
      }),

      updateDoc(doc(userCollectionRef, dataUserId), {
        "status.video_call_state": null,
      }),

      updateDoc(doc(videoCallCollectionRef, dataUserId), {
        [chatId + ".callActiveState"]: "cancelled",
        [chatId + ".caller_uid"]: null,
        [chatId + ".callee_uid"]: null,
      }),
    ]);

    // Add a short delay before setting the callActiveState to false
    setTimeout(async () => {
      await updateDoc(doc(videoCallCollectionRef, dataUserId), {
        [chatId + ".callActiveState"]: false,
      });
    }, 1000);
  };

  // we need to check the camera availability of the device input like in laptop or desktop for switching facemode
  const cameraAvailability = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasCamera = devices.some((device) => device.kind === "videoinput");
      return hasCamera;
    } catch (error) {
      console.error("Error checking camera availability:", error);
      return false;
    }
  };

  // switch facemode
  const switchCamera = async () => {
    try {
      const cameraAvailable = await cameraAvailability();
      if (!cameraAvailable) {
        alert("No camera found on this device.");
        return;
      }
      // Stop the current video tracks to free up resources
      const stream = localVideoRef.current.srcObject;
      const audioTrack = stream.getAudioTracks()[0];

      stream.getVideoTracks().forEach((track) => track.stop());

      // Toggle the facing mode
      const newFacingMode = front ? "environment" : "user";
      setFront((prev) => !prev);

      // Request a new stream with the updated facingMode
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: newFacingMode },
      });

      newStream.addTrack(audioTrack);

      setRemoteStream(newStream);

      // Apply the new stream to localVideoRef
      localVideoRef.current.srcObject = newStream;

      const userConnectionId = Object.keys(peerRef.current.connections)[0];

      // Replace tracks on the existing PeerJS call with new stream tracks
      const sender = peerRef.current?.connections[
        userConnectionId
      ][0]?.peerConnection
        .getSenders()
        .find((sender) => sender.track.kind === "video");
      if (sender) {
        sender.replaceTrack(newStream.getVideoTracks()[0]);
      }
    } catch (error) {
      console.error("Error toggling camera facing mode:", error);
    }
  };

  const screenShare = async () => {
    try {
      // Check for screen sharing support
      if (!navigator.mediaDevices.getDisplayMedia) {
        alert("Screen sharing is not supported on this device.");
        return;
      }

      // Get the current stream to stop the existing video tracks
      const currentStream = localVideoRef.current.srcObject;

      // Stop existing video tracks
      if (currentStream) {
        currentStream.getVideoTracks().forEach((track) => track.stop());
      }

      // Start screen sharing
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true, // Include if you want to share audio
      });

      const userConnectionId = Object.keys(peerRef.current.connections)[0];

      // Access the Peer connection
      const peerConnection =
        peerRef.current?.connections[userConnectionId][0]?.peerConnection;

      if (!peerConnection) {
        console.error("Peer connection not found");
        return;
      }

      // Replace the current video track with the screen sharing track
      const videoSender = peerConnection
        .getSenders()
        .find((sender) => sender.track.kind === "video");

      if (videoSender) {
        videoSender.replaceTrack(screenStream.getVideoTracks()[0]);
      } else {
        console.error("No video sender found.");
      }

      // Update the local video element to reflect screen sharing
      localVideoRef.current.srcObject = screenStream;

      // Listen for when the screen sharing ends
      screenStream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };

      setScreenSharing(true);
    } catch (error) {
      console.error("Error starting screen sharing:", error);
    }
  };

  const stopScreenShare = async () => {
    try {
      // Revert to the camera
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: front ? "user" : "environment" },
        audio: true,
      });

      const videoSender = peerRef.current?.connections[
        Object.keys(peerRef.current.connections)[0]
      ][0].peerConnection
        .getSenders()
        .find((sender) => sender.track.kind === "video");

      if (videoSender) {
        videoSender.replaceTrack(cameraStream.getVideoTracks()[0]);
      }

      setRemoteStream(cameraStream);

      // Update the local video element to reflect the camera feed again
      localVideoRef.current.srcObject = cameraStream;

      setScreenSharing(false);
    } catch (error) {
      console.error("Error stopping screen sharing:", error);
    }
  };

  //icon will be active once it clicked
  const iconClickedHandler = (iconclicked) => {
    // setActiveComponent(iconclicked);
    //check if the media query is match for the smaller device for responsiveness
    if (matches) {
      dispatch({ type: "RESET_STATE" });
    }
  };

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "Chat":
        return <Messages />;
      case "Friend":
        return <Friend />;
      case "Notification":
        return <Notification />;
      case "Profile":
        return <Profile />;
      default:
        return null;
    }
  };
  return (
    <MainChatContainer>
      <NavigationBar
        iconClickedHandler={iconClickedHandler}
        activeComponent={activeComponent}
        currentPeerId={currentPeerId}
      />
      {renderActiveComponent()}

      {activeComponent !== "Profile" && (
        <Container allPeerData={allPeerData} createCall={createCall} />
      )}

      {receivingCall && !callAccepted ? (
        <ReceivingCallModal
          open={open}
          answerCall={answerCall}
          rejectCall={rejectCall}
          setReceivingCall={setReceivingCall}
          setOpen={setOpen}
        />
      ) : null}

      {callActive ? ( // Render ActiveCall component if call is active and there is an active call user
        <VideoChat
          open={open}
          cancelCall={cancelCall}
          front={front}
          switchCamera={switchCamera}
          screenSharing={screenSharing}
          screenShare={screenShare}
          isMicOn={isMicOn}
          setIsMicOn={setIsMicOn}
          videoCamActive={videoCamActive}
          setVideoCamActive={setVideoCamActive}
          firstHangUpCall={firstHangUpCall}
          secondHangUpCall={secondHangUpCall}
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
          socket={socket}
          callActiveState={callActiveState}
          currentPeerId={currentPeerId}
          remoteStream={remoteStream}
          setRemoteStream={setRemoteStream}
        />
      ) : null}

      {data.chatId === null && (
        <NavigationBottomBar
          iconClickedHandler={iconClickedHandler}
          activeComponent={activeComponent}
          currentPeerId={currentPeerId}
        />
      )}
    </MainChatContainer>
  );
}
