import { io } from "socket.io-client";

const URL = "https://pulse-backend-dxo6.onrender.com";

const socket = io(URL, {
  autoConnect: false,
});

const connectSocket = (token) => {
  socket.auth = { token };
  socket.connect();
};

export default socket;
export { connectSocket };
