//COMPONENTS
import Login from "./components/Login";
import Home from "./components/Home";
import Register from "./components/Register";
import Inventory from "./components/Inventory";
import CreateInventory from "./components/CreateInventory";

// UTILS
import ProtectedRoutes from "./ProtectedRoutes";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// CONTEXT
import { AuthProvider } from "./context/AuthContext";

// STYLES
import "./App.css";

function App() {
  return (
    <div className="background ">
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
    </div>
  );
}

export default App;
