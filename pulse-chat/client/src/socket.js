import { io } from "socket.io-client";

const socket = io("https://pulse-backend-dxo6.onrender.com", {
  autoConnect: false,
});

export default socket;
