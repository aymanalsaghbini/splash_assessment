"use client";
import React, { useEffect, useState } from "react";
import style from "./chat.module.css";
import { Button, Grid2, TextField } from "@mui/material";

interface IMsgDataTypes {
  roomId: String | number;
  user: String;
  msg: String;
  time: String;
}

const Chat = ({ socket, userName, roomId }: any) => {
  const [currentMsg, setCurrentMsg] = useState("");
  const [chat, setChat] = useState<IMsgDataTypes[]>([]);

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentMsg !== "") {
      const msgData: IMsgDataTypes = {
        roomId,
        user: userName,
        msg: currentMsg,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_msg", msgData);
      setCurrentMsg("");
    }
  };

  useEffect(() => {
    socket.on("receive_msg", (data: IMsgDataTypes) => {
      setChat((prev) => [...prev, data]);
    });
  }, [socket]);

  return (
    <div className={style.chat_border}>
      <div style={{ marginBottom: "1rem" }}>
        <p>
          Name: <b>{userName}</b> and Room Id: <b>{roomId}</b>
        </p>
      </div>
      <div>
        {chat.map(({ user, msg }, key) => (
          <div
            key={key}
            className={
              user === userName ? style.chatProfileRight : style.chatProfileLeft
            }
          >
            <span
              className={style.chatProfileSpan}
              style={{ textAlign: user === userName ? "right" : "left" }}
            >
              {user.charAt(0)}
            </span>
            <h3 style={{ textAlign: user === userName ? "right" : "left" }}>
              {msg}
            </h3>
          </div>
        ))}
      </div>
      <div>
        <form onSubmit={(e) => sendMessage(e)}>
          <Grid2
            container
            direction="row"
            sx={{
              justifyContent: "flex-start",
              alignItems: "center",
              mt: 2,
            }}
            spacing={2}
          >
            <TextField
              id="outlined-multiline-flexible-message"
              label="Type your message.."
              onChange={(e) => setCurrentMsg(e.target.value)}
              value={currentMsg}
              size="small"
            />
            <Button variant="contained" type="submit">
              Send
            </Button>
          </Grid2>
        </form>
      </div>
    </div>
  );
};

export default Chat;
