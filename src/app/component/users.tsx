"use client";
import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { User } from "./UserInput";

const Users = ({ users }: any) => {
  return (
    <Box width={"100%"}>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Point</th>
            <th>Multiplier</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any, index: number) => (
            <tr key={index}>
              <td>{user?.name}</td>
              <td>{user.point}</td>
              <td>{user.multiplier}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
};

export default Users;
