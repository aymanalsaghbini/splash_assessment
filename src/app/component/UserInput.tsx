"use client";

import { Button, Grid2, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Ranking from "./ranking";
import Users from "./users";

export interface User {
  name: string;
  point: number;
  multiplier: number;
  points: number;
  status?: string;
}

const mockUsers: User[] = [
  { name: "Alice", point: 100, multiplier: 9.75, points: 100 },
  { name: "Bob", point: 100, multiplier: 7.53, points: 100 },
  { name: "Charlie", point: 100, multiplier: 1.27, points: 100 },
  { name: "David", point: 100, multiplier: 3.84, points: 100 },
];

let socket: any;
socket = io(process.env.NEXT_PUBLIC_SERVER_URL);

const UserInput = ({ userName }: any) => {
  useEffect(() => {
    socket.on("updateUserList", (newUser: User) => {
      setUsers((prev) => [...prev, newUser]);
    });
  }, [socket]);
  useEffect(() => {
    socket.on("getUpdateChart", (newData: any, rand: number) => {
      if (rand !== 0) {
        setRandomIncrementValue(rand);
      }
    });
  }, [socket]);

  const [users, setUsers] = useState<User[]>(mockUsers);
  const [name, setName] = useState("");
  const [point, setPoint] = useState(0);
  const [multiplier, setMultiplier] = useState(1);

  const [randomIncrementValue, setRandomIncrementValue] = useState(0);

  const [newUser, setNewUser] = useState<User>({
    name: userName,
    point: 100,
    multiplier: 0,
    points: 1000,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newUser = { name, point, multiplier };
    newUser.name = userName;

    if (newUser) {
      await socket.emit("sendUserData", newUser);
    }
    setName("");
    setPoint(0);
    setMultiplier(1);
  };

  const startGame = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    const increments: [{ x: number; y: number }] = [{ x: 0, y: 0 }];
    await socket.emit("updateChart", increments, 0);
    function generateRandomIncrements() {
      let prev = 80;
      for (let i = 0; i < 400; i++) {
        prev += Math.floor(Math.random() * 10);
        increments.push({ x: i, y: prev });
      }
      return increments;
    }

    const randomIncrements = generateRandomIncrements();

    const randomIncrementValue =
      randomIncrements[randomIncrements.length - 1].y /
      (Math.floor(Math.random() * (900 - 400 + 1)) + 400);
    await socket.emit("updateChart", randomIncrements, randomIncrementValue);

    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    await delay(1000);
    const result = evaluateUsers(users, randomIncrementValue);

    //  Sort winner users by multiplier if less than randomIncrementValue
    const winnerUsers = result.filter((user) => user.status === "winner");
    const lostUsers = result.filter((user) => user.status === "lost");

    // Calculate points for winner users
    const updatedwinnerUsers = winnerUsers
      .map((user) => ({
        ...user,
        points: user.status === "lost" ? 0 : user.point * user.multiplier,
      }))
      .sort((a, b) => {
        return b.points - a.points;
      });

    const sortedLostUsers = lostUsers.sort((a, b) => {
      const aLessThanRandom =
        a.multiplier < randomIncrementValue ? a.multiplier : Infinity;
      const bLessThanRandom =
        b.multiplier < randomIncrementValue ? b.multiplier : Infinity;
      return aLessThanRandom - bLessThanRandom; // Ascending order
    });

    // Sort lost users (points will be 0)
    const updatedLostUsers = sortedLostUsers.map((user) => ({
      ...user,
      points: 0,
      point: 0,
      // Lost users get 0 points
    }));
    // Combine sorted winner users and lost users
    const sortedUsers = [...updatedwinnerUsers, ...updatedLostUsers];

    //update current user

    const userResult = sortedUsers.find((result) => result.name === userName);

    if (userResult) {
      newUser.points = newUser.points + userResult.points;
      newUser.point = userResult.point;
      newUser.multiplier = userResult.multiplier;
    }

    setNewUser(newUser);
    await socket.emit("updateResultList", sortedUsers);
  };

  function evaluateUsers(users: User[], randomValue: number): User[] {
    return users
      .map((user: any) => {
        if (user.multiplier > randomValue) {
          return { ...user, points: 0, status: "lost" }; // Set points to 0 and mark as lost
        } else {
          return { ...user, status: "winner" }; // Mark as winner
        }
      })
      .sort((a, b) => {
        // Sort winner users based on the difference from the randomValue
        if (a.status === "winner" && b.status === "winner") {
          return a.multiplier - b.multiplier;
        }
        return 0; // Maintain order for lost users
      });
  }

  return (
    <Grid2
      container
      direction="row"
      sx={{
        marginTop: 5,
        justifyContent: "flex-start",
        alignItems: "center",
      }}
      spacing={2}
    >
      <h2>name:{userName}</h2>
      <h2>points:{newUser.points}</h2>

      <form onSubmit={(e) => handleSubmit(e)}>
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
            id="outlined-multiline-flexible-name"
            label="Points"
            onChange={(e) => setPoint(Number(e.target.value))}
            type="number"
            size="small"
          />

          <TextField
            id="outlined-multiline-flexible-point"
            label="multiplier"
            onChange={(e) => setMultiplier(Number(e.target.value))}
            type="number"
            size="small"
          />

          <Button variant="contained" type="submit">
            Add User
          </Button>
        </Grid2>
      </form>

      <Users users={users} />
      <Stack direction={"column"} spacing={2}>
        <Stack direction={"row"} spacing={4} alignItems={"center"}>
          <Button variant="contained" onClick={(e) => startGame(e)}>
            Start Game
          </Button>
          <p> Random Target Value :{randomIncrementValue.toFixed(2)}</p>
        </Stack>
      </Stack>
      <Ranking socket={socket} />
    </Grid2>
  );
};

export default UserInput;
