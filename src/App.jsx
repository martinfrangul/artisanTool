//COMPONENTS
import Login from "./components/Login";
import Home from "./components/Home";
import Register from "./components/Register";
import ProtectedRoutes from "./ProtectedRoutes";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { InventoryContextProvider } from "./context/InventoryContext";

import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <InventoryContextProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoutes>
                  <Home />
                </ProtectedRoutes>
              }
            />
          </Routes>
        </InventoryContextProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
