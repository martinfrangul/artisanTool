// COMPONENTS
import Login from "./components/Login";
import Home from "./components/Home";
import Register from "./components/Register";
import Inventory from "./components/Inventory";
import CreateInventory from "./components/CreateInventory";
import Navbar from "./components/Navbar";
import SalesManager from "./components/SalesManager";
import SalesRegistry from "./components/SalesRegistry";

// UTILS
import ProtectedRoutes from "./ProtectedRoutes";
import PublicRoute from "./PublicRoutes";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// CONTEXT
import { AuthProvider } from "./context/AuthContext";
import { InventoryContextProvider } from "./context/InventoryContext";

// STYLES
import "./App.css";
import Banner from "./components/Banner";

function App() {
  return (
    <div className="background min-h-screen flex flex-col">
      <Router>
        <AuthProvider>
          <InventoryContextProvider>
            <div className="flex-grow pb-28">
              <ProtectedRoutes>
                <Banner />
              </ProtectedRoutes>

              <Routes>
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicRoute>
                      <Register />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/"
                  element={
                    <ProtectedRoutes>
                      <Home />
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
                <Route
                  path="/sales-manager"
                  element={
                    <ProtectedRoutes>
                      <SalesManager />
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="/sales-registry"
                  element={
                    <ProtectedRoutes>
                      <SalesRegistry />
                    </ProtectedRoutes>
                  }
                />
              </Routes>
            </div>
            <ProtectedRoutes>
               <Navbar />
            </ProtectedRoutes>
          </InventoryContextProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
