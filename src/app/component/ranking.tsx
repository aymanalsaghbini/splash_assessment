"use client";
import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { User } from "./UserInput";

const mockUsersResult: User[] = [
  { name: "Alice", point: 0, multiplier: 0, points: 0 },
  { name: "Bob", point: 0, multiplier: 0, points: 0 },
  { name: "Charlie", point: 0, multiplier: 0, points: 0 },
  { name: "David", point: 0, multiplier: 0, points: 0 },
];

const Ranking = ({ socket }: any) => {
  const [usersResult, setUsersResult] = useState<User[]>(mockUsersResult);

  useEffect(() => {
    socket.on("getUpdateResultList", (data: User[]) => {
      setUsersResult(data);
    });
  }, [socket]);

  return (
    <Box width={'100%'}>
      <div>
        <h3>Ranking</h3>
      </div>

      <table width={'100%'}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Point</th>
            <th>Multiplier</th>
            <th>Score</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {usersResult.map((user, index) => (
            <tr
              key={index}
              style={{
                color:
                  user.status === "lost"
                    ? "red"
                    : user.status === "winner"
                    ? "green"
                    : "black",
              }}
            >
              <td>{user.name}</td>
              <td>{user.point}</td>
              <td>{user.multiplier}</td>
              <td>{user.points}</td>
              <td>{user.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
};

export default Ranking;
