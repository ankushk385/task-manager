import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Tasks from "./components/Tasks";
import "./App.css";
export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [view, setView] = useState("login");

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  return (
    <div className="app-container">
      <header>
        <h2>Task Management</h2>
      </header>
      {!token ? (
        <>
          {view === "login" ? (
            <Login
              onLogin={(t) => {
                setToken(t);
              }}
            />
          ) : (
            <Register
              onRegister={(t) => {
                setToken(t);
              }}
            />
          )}
          <p>
            {view === "login" ? (
              <button onClick={() => setView("register")}>
                Go to Register
              </button>
            ) : (
              <button onClick={() => setView("login")}>Go to Login</button>
            )}
          </p>
        </>
      ) : (
        <>
          <button
            className="logout-btn"
            onClick={() => {
              setToken(null);
            }}
          >
            Logout
          </button>
          <Tasks
            token={token}
            apiUrl={process.env.REACT_APP_API_URL || "http://localhost:5000"}
          />
        </>
      )}
    </div>
  );
}
