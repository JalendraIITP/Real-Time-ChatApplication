import http from 'http';
import cors from 'cors';
import express from 'express';
import { Server } from 'socket.io';
import connectDB from "./config/db.js";
import cookieParser from 'cookie-parser';
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import errorMiddleware from './middleware/errorMiddleware.js';
const { notFound, errorHandler } = errorMiddleware;

import { config } from 'dotenv';

config({
  path: "./.env"
});

connectDB().then(() => {
  const server = http.createServer(app);

  const PORT = process.env.PORT;
  server.listen(PORT, () => {
      console.log(`Server listening on port: ${PORT}`);
  });

  const io = new Server(server, {
      pingTimeout: 60000,
      cors: {
          origin: 'http://localhost:3000',
      }
  });

  io.on("connection", (socket) => {
    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
    });
    
    socket.on("join chat", (room) => {
      socket.join(room);
    });
  
    socket.on("typing", (room) => socket.in(room).emit("typing"));

    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  
    socket.on("new message", (newMessageRecieved) => {
      var chat = newMessageRecieved.chat;
      if (!chat.users) return console.log("chat.users not defined");
      chat.users.forEach((user) => {
        if (user._id == newMessageRecieved.sender._id) return;
  
        socket.in(user._id).emit("message recieved", newMessageRecieved);
      });
    });

    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      socket.leave(userData._id);
    });
  });
})
.catch((err) => {
  console.error("MongoDB Connection Failed:", err);
});

const app = express();

app.use(cors({
  origin: ["http://localhost:3000"],
    method: ["POST","GET"],
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("API Running...");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);
