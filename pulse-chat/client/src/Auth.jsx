import { useState } from "react";

function Auth({ onAuthSuccess }) {
  const API_BASE = "https://coding-samurai-internship-task-e99h.onrender.com";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");

   const url = isLogin
  ? `${API_BASE}/auth/login`
  : `${API_BASE}/auth/register`;


    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      if (isLogin) {
        localStorage.setItem("token", data.token);
        onAuthSuccess();
      } else {
        setIsLogin(true);
      }
    } catch {
      setError("Server not reachable");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>
          {isLogin ? "Welcome ! 🙂" : "Create account"}
        </h2>

        <input
          style={styles.input}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={submit}>
          {isLogin ? "Login" : "Register"}
        </button>

        <p
          style={styles.switch}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Create account" : "Already have an account?"}
        </p>

        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

export default Auth;

/* ================= STYLES ================= */

const styles = {
  page: {
    height: "100vh",
    width: "100vw",
    background:
      "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1518837695005-2083093ee35b')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  card: {
    width: "320px",
    background: "#121212",
    padding: "30px",
    borderRadius: "14px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
    display: "flex",
    flexDirection: "column",
    gap: "14px"
  },

  title: {
    color: "#fffc00",
    marginBottom: "10px",
    textAlign: "center"
  },

  input: {
    padding: "10px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    background: "#2a2a2a",
    color: "#fff"
  },

  button: {
    marginTop: "10px",
    padding: "10px",
    borderRadius: "20px",
    border: "none",
    background: "#fffc00",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer"
  },

  switch: {
    color: "#999",
    fontSize: "13px",
    textAlign: "center",
    cursor: "pointer"
  },

  error: {
    color: "#ff6b6b",
    fontSize: "13px",
    textAlign: "center"
  }
};
