// COMPONENTS
import Login from "./components/Login";
import Home from "./components/Home";
import Register from "./components/Register";
import Inventory from "./components/Inventory/Inventory";
import CreateInventory from "./components/Inventory/CreateInventory";
import Navbar from "./components/Navbar";
import SalesManager from "./components/Sales/SalesManager";
import SalesRegistryRender from "./components/Sales/SalesRegistryRender";

// UTILS
import ProtectedRoutes from "./ProtectedRoutes";
import PublicRoute from "./PublicRoutes";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// CONTEXT
import { AuthProvider } from "./context/AuthContext";
import { InventoryContextProvider } from "./context/InventoryContext";
import { SellContextProvider } from "./context/SellContext";

// STYLES
import "./App.css";
import Banner from "./components/Banner";

function App() {

  return (
    <div className="background min-h-screen flex flex-col">
      <Router>
        <AuthProvider>
          <InventoryContextProvider>
            <SellContextProvider>
              <div className="flex-grow">
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
                        <SalesRegistryRender />
                      </ProtectedRoutes>
                    }
                  />
                </Routes>
              </div>
              <ProtectedRoutes>
                <Navbar />
              </ProtectedRoutes>
            </SellContextProvider>
          </InventoryContextProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
