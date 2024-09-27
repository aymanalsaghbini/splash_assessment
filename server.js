const http = require("http");
const { Server } = require("socket.io");

const httpServer = http.createServer();
const host = "http://localhost:3000";
const PORT = process.env.PORT || 3005;
const io = new Server(httpServer, {
  cors: {
    origin: process.env.HOST || host,
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`user with id-${socket.id} joined room - ${roomId}`);
  });

  socket.on("send_msg", (data) => {
    //This will send a message to a specific room ID
    socket.to(data.roomId).emit("receive_msg", data);
  });

  socket.on("sendUserData", (data) => {
    io.emit("updateUserList", data);
  });

  socket.on("updateResultList", (data) => {
    io.emit("getUpdateResultList", data);
  });

  socket.on("updateChart", (data, rand) => {
    io.emit("getUpdateChart", data, rand);
  });

  socket.on("disconnect", () => {});
});

httpServer.listen(PORT, () => {
  console.log(`Socket.io server is running on port ${PORT}`);
});
