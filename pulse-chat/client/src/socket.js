import { io } from "socket.io-client";

export const socket = io("http://localhost:5000", {
  autoConnect: false
});

export const connectSocket = () => {
  const token = localStorage.getItem("token");

  socket.auth = {
    token
  };

  socket.connect();
};
