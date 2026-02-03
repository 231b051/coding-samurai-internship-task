import { useEffect, useRef, useState } from "react";
import socket from "./socket.js";




import Auth from "./Auth";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!loggedIn) return;

    connectSocket();
    socket.emit("joinRoom", "general");

    socket.on("chatHistory", (history) => {
      setMessages(history);
    });

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chatHistory");
      socket.off("receiveMessage");
      socket.disconnect();
    };
  }, [loggedIn]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!loggedIn) {
    return <Auth onAuthSuccess={() => setLoggedIn(true)} />;
  }

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("sendMessage", {
      room: "general",
      message
    });

    setMessage("");
  };

  return (
    <div style={styles.app}>
      {/* Header */}
      <div style={styles.header}>
        <h3>Pulse</h3>
        <p style={{ fontSize: "12px", opacity: 0.6 }}>
  Real-time chat
</p>

        <button
          style={styles.logout}
          onClick={() => {
            localStorage.removeItem("token");
            window.location.reload();
          }}
        >
          Logout
        </button>
      </div>

      {/* Messages */}
   <div style={styles.chatArea}>
  <div style={styles.chatContainer}>
    {messages.map((msg, i) => {
      const isMe =
        msg.sender ===
        JSON.parse(atob(localStorage.getItem("token").split(".")[1]))
          .username;

      return (
        <div
          key={i}
          style={{
            ...styles.messageBubble,
            alignSelf: isMe ? "flex-end" : "flex-start",
            background: isMe ? "#fffc00" : "#2f2f2f",
            color: isMe ? "#000" : "#fff"
          }}
        >
          {!isMe && (
            <div style={styles.sender}>{msg.sender}</div>
          )}
          {msg.text}
        </div>
      );
    })}
    <div ref={bottomRef} />
  </div>
</div>


      {/* Input */}
      <div style={styles.inputBar}>
        <input
          style={styles.input}
          placeholder="Send a chat"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button style={styles.sendBtn} onClick={sendMessage}>
          ➤
        </button>
      </div>
    </div>
  );
}

export default App;

/* ================= SNAPCHAT-STYLE UI ================= */

const styles = {
  
 app: {
  height: "100vh",
  width: "100vw",
  background: "#121212",
  color: "#fff",
  display: "flex",
  flexDirection: "column",
  overflowX: "hidden"

},


  header: {
    padding: "14px 20px",
    borderBottom: "1px solid #222",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  logout: {
    background: "transparent",
    color: "#fffc00",
    border: "none",
    cursor: "pointer",
    fontSize: "14px"
  },

chatArea: {
  flex: 1,
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  overflowY: "auto",
  overflowX: "hidden", // ✅ add this
  width: "100%",
  backgroundImage:
    "linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('https://images.unsplash.com/photo-1518837695005-2083093ee35b')",
  backgroundSize: "cover",
  backgroundPosition: "center"
},




  messageBubble: {
   backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)",
  maxWidth: "60%",
  padding: "10px 14px",
  borderRadius: "18px",
  fontSize: "14px",
  lineHeight: 1.4,
  wordBreak: "break-word"
},


  sender: {
    fontSize: "11px",
    opacity: 0.6,
    marginBottom: "3px"
  },

  inputBar: {
    display: "flex",
    padding: "12px",
    borderTop: "1px solid #222",
    background: "#181818"
  },

  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "20px",
    border: "none",
    outline: "none",
    background: "#2a2a2a",
    color: "#fff"
  },

  sendBtn: {
    marginLeft: "10px",
    padding: "0 18px",
    borderRadius: "50%",
    border: "none",
    background: "#fffc00",
    color: "#000",
    cursor: "pointer",
    fontSize: "18px"
  },

  chatContainer: {
  maxWidth: "720px",
  width: "100%",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  gap: "10px"
},

};
