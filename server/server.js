const {
  collection,
  getDocs,
  query,
  updateDoc,
  deleteField,
  doc,
  serverTimestamp,
  Timestamp,
} = require("firebase/firestore");

const {
  db,
  userCollectionRef,
  friendRequestCollectionRef,
  userFriendsCollectionRef,
  userNotificationsCollectionRef,
} = require("./firebase_config/firebase_config");

const { v4: uuid } = require("uuid");

// const http = require("http");
const { Server } = require("socket.io");

// const fs = require("fs");
// const path = require("path");
// const { ExpressPeerServer } = require("peer")

const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// this is the path where the key and cert located in client folder
// const keyPath = path.join(__dirname, "../client/certs/cert.key");
// const certPath = path.join(__dirname, "../client/certs/cert.crt");

// const server = https.createServer(
//   {
//     //we use this key and cert to allow https in our localhost when we use the video call in othe device.
//     key: fs.readFileSync(keyPath),
//     cert: fs.readFileSync(certPath),
//   },
//   app
// );

// const server = http.createServer(app)

const server = app.listen(process.env.PORT || 3001, () => {
  console.log("Server listening on port: " + (process.env.PORT || 3001));
});

const io = new Server(server, {
  cors: {
    origin: "https://chatapp-4e8dd.web.app", //https://you_app.web.app or ["https://your_app.firebaseapp.com", "https://your_app.web.app"], this url given by your hosting service firebase
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

const users = {};

io.on("connection", (socket) => {
  socket.on("connecting", (userPeerID, currentId) => {
    !Object.keys(users).includes(currentId)
      ? ((users[currentId] = userPeerID),
        socket.emit("currentPeerID", userPeerID))
      : (users[currentId] = userPeerID),
      socket.emit("currentPeerID", userPeerID),
      // console.log(users);

    io.sockets.emit("allPeerData", users);
  });

  socket.on("user-disconnect", (currentId) => {
    if (users[currentId]) {
      delete users[currentId];
      // delete users[remoteUserPeerId]
      io.sockets.emit("allPeerData", users); // Emitting updated users to all clients
      // console.log(`User ${currentId} disconnected`);
      // console.log(users);
    }
  });
});

// Search user
app.get("/search_user", async (req, res) => {
  const { name } = req.query;
  const searchTerm = name.toLocaleLowerCase();
  try {
    const querySnapshot = await getDocs(query(collection(db, "users")));

    // Update the search results
    const results = querySnapshot.docs
      .map((doc) => doc.data())
      .filter((user) => user.displayName.toLowerCase().includes(searchTerm));

    res.send(results);
    // console.log(results);
  } catch (error) {
    console.error("Error searching for users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// update account userprofile
app.put("/update_account/:id", async (req, res) => {
  try {
    const data = req.body;
    const id = req.params.id;

    await updateDoc(doc(userCollectionRef, id), {
      displayName: data.displayName,
    });

    res.send({ displayName: data.displayName });
  } catch (error) {
    // res.send(error)
    console.log(error);
  }
});

// reject request / cancel request
// unfriend once accept friend request
app.delete("/reject_request/:id", async (req, res) => {
  try {
    const currentId = req.params.id;
    const { datauserId, dataChatId } = req.query;
    await Promise.all([
      // this is for the friends/other users
      updateDoc(doc(friendRequestCollectionRef, datauserId), {
        [dataChatId]: deleteField(),
      }),

      updateDoc(doc(userFriendsCollectionRef, datauserId), {
        [dataChatId]: deleteField(),
      }),

      // this is for the currentUser
      updateDoc(doc(friendRequestCollectionRef, currentId), {
        [dataChatId]: deleteField(),
      }),
      updateDoc(doc(userFriendsCollectionRef, currentId), {
        [dataChatId]: deleteField(),
      }),
    ]);

    res.send("success");
  } catch (error) {
    console.log(error);
  }
});

// accept request
app.post("/accept_request/:id", async (req, res) => {
  const { ids } = req.body;
  const currentId = req.params.id;

  console.log(ids);
  await Promise.all([
    updateDoc(doc(friendRequestCollectionRef, ids[0]), {
      [ids[1]]: {
        request_state: "friend",
        date_request: serverTimestamp(),
        requestUID_to: currentId,
        requestUID_by: ids[0],
      },
    }),

    updateDoc(doc(friendRequestCollectionRef, currentId), {
      [ids[1]]: {
        request_state: "friend",
        date_request: serverTimestamp(),
        requestUID_to: currentId,
        requestUID_by: ids[0],
      },
    }),

    updateDoc(doc(userNotificationsCollectionRef, ids[0]), {
      [uuid()]: {
        date: Timestamp.now(),
        uid: currentId,
        notification_content: `${ids[2]} accept your friend request.`,
        photoUrl: `${ids[3]}`,
      },
    }),

    updateDoc(doc(userFriendsCollectionRef, currentId), {
      [ids[1]]: {
        request_state: "friend",
        date_request: serverTimestamp(),
        requestUID: ids[0],
      },
    }),

    updateDoc(doc(userFriendsCollectionRef, ids[0]), {
      [ids[1]]: {
        request_state: "friend",
        date_request: serverTimestamp(),
        requestUID: currentId,
      },
    }),
  ]);
});

app.get("/", async (req, res) => {
  res.json({ message: "hello world" });
});
