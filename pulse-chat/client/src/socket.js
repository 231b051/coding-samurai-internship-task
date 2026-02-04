import { io } from "socket.io-client";

export const socket = io(
  "https://coding-samurai-internship-task-e99h.onrender.com",
  {
    autoConnect: false,
  }
);

export const connectSocket = (token) => {
  socket.auth = { token };
  socket.connect();
};






