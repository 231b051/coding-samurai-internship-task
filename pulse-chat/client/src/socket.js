import { io } from "socket.io-client";

export const socket = io(
  "https://coding-samurai-internship-task-mp20.onrender.com",
  {
    autoConnect: false,
  }
);

export const connectSocket = (token) => {
  if (!token) return;

  socket.auth = { token };
  socket.connect();
};
