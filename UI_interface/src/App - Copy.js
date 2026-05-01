import React, { useState } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return token ? (
    <Dashboard token={token} logout={logout} />
  ) : (
    <Login setToken={setToken} />
  );
}

export default App;