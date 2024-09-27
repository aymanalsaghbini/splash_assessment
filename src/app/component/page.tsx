"use client";
import React from "react";
import UserInput from "./UserInput";
import { Container } from "@mui/system";
import { Grid2 } from "@mui/material";
import ProgressiveLineChart from "./progressiveLineChart";
import Chat from "./chat";

const MainPage = ({ socket, userName, roomId }: any) => {
  return (
    <Container maxWidth="xl">
      <Grid2 container direction="row" spacing={2}>
        <Grid2 size={6}>
          <h1>User Points Tracker</h1>
          <hr />
          <UserInput socket={socket} userName={userName} />
        </Grid2>
        <Grid2 size={6} container direction="column" spacing={6}>
          <Grid2>
            <h1>Line Chart</h1>
            <hr />
            <ProgressiveLineChart />
          </Grid2>
          <Grid2>
            <div>
            <h1>Chat</h1>
            <hr />
              <Chat socket={socket} userName={userName} roomId={roomId}></Chat>
            </div>
          </Grid2>
        </Grid2>
      </Grid2>
    </Container>
  );
};

export default MainPage;
