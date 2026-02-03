import { io } from "socket.io-client";

const URL = "https://pulse-backend-dxo6.onrender.com";

export const socket = io(URL, {
  autoConnect: false,
});

export const connectSocket = (token) => {
  socket.auth = { token };
  socket.connect();
};
