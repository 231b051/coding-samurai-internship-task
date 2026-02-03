io("https://pulse-backend-dxo6.onrender.com", {
  autoConnect: false
});


export const connectSocket = () => {
  const token = localStorage.getItem("token");

  socket.auth = {
    token
  };

  socket.connect();
};
