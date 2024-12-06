import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Reserve from "./components/Reserve";

const App = () => {
  return (
    <div>
      <h1>Welcome to Cloud Project</h1>
      <nav>
        <Link to="/login">Login</Link>
        <br />
        <Link to="/register">Register</Link>
        <br />
        <Link to="/reserve">Reserve</Link>
      </nav>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reserve" element={<Reserve />} />
      </Routes>
    </div>
  );
};

export default App;
