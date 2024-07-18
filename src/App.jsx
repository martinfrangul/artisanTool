//COMPONENTS
import Login from "./components/Login";
import Home from "./components/Home";
import Register from "./components/Register";
import Inventory from "./components/Inventory";
import ProtectedRoutes from "./ProtectedRoutes";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import "./App.css";
import CreateInventory from "./components/CreateInventory";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoutes>
                <Home></Home>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/create-inventory"
            element={
              <ProtectedRoutes>
                <CreateInventory />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRoutes>
                <Inventory />
              </ProtectedRoutes>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
