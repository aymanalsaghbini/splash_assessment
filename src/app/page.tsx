"use client";
import styles from "./page.module.css";
import { io } from "socket.io-client";
import { useState } from "react";
import { Button, TextField } from "@mui/material";
import MainPage from "./component/page";

export default function Home() {
  const [showChat, setShowChat] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [showSpinner, setShowSpinner] = useState(false);
  const [roomId, setroomId] = useState("");

  let socket: any;
  socket = io(process.env.NEXT_PUBLIC_SERVER_URL);

  const handleJoin = () => {
    if (userName !== "" && roomId !== "") {
      socket.emit("join_room", roomId);
      setShowSpinner(true);
      setTimeout(() => {
        setShowChat(true);
        setShowSpinner(false);
      }, 1000);
    } else {
      alert("Please fill in Username and Room Id");
    }
  };

  return (
    <div>
      <div
        className={styles.main_div}
        style={{ display: showChat ? "none" : "" }}
      >
        <h1>Splash Software</h1>
        <br />
        <TextField
          id="outlined-multiline-flexible-point-username"
          label="Username"
          onChange={(e) => setUserName(e.target.value)}
          size="small"
          disabled={showSpinner}
        />

        <TextField
          id="outlined-multiline-flexible-point-room"
          label="Room ID"
          onChange={(e) => setroomId(e.target.value)}
          size="small"
          disabled={showSpinner}
        />

        <Button variant="contained" onClick={() => handleJoin()}>
          {!showSpinner ? (
            "Join"
          ) : (
            <div className={styles.loading_spinner}></div>
          )}
        </Button>
      </div>
      <div style={{ display: !showChat ? "none" : "" }}>
        <MainPage socket={socket} roomId={roomId} userName={userName} />
      </div>
    </div>
  );
}
