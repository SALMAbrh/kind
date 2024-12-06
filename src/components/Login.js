import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      if (typeof onLoginSuccess === "function") {
        onLoginSuccess(); // Notify App about successful login
      }
      navigate("/reserve"); // Redirect to Reserve after login
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      alert(`Welcome, ${user.displayName || user.email}! Google login successful.`);
      if (typeof onLoginSuccess === "function") {
        onLoginSuccess(user.email); // Notify App with the authenticated user's email
      }
      navigate("/reserve"); // Redirect to Reserve after Google login
    } catch (error) {
      alert(`Google login failed: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleGoogleLogin} style={{ padding: "0.5rem 1rem" }}>
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
