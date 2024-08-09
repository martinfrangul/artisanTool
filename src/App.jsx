// COMPONENTS
import Login from "./components/Login";
import Home from "./components/Home";
import Register from "./components/Register";
import Inventory from "./components/Inventory/Inventory";
import CreateInventory from "./components/Inventory/CreateInventory";
import Navbar from "./components/Navbar";
import SalesManager from "./components/Sales/SalesManager";
import SalesRegistry from "./components/Sales/SalesRegistry";
import SalesCharts from "./components/Sales/SalesCharts";

// UTILS
import ProtectedRoutes from "./ProtectedRoutes";
import PublicRoute from "./PublicRoutes";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// CONTEXT
import { AuthProvider } from "./context/AuthContext";
import { DataContextProvider } from "./context/DataContext";

// STYLES
import "./App.css";
import Banner from "./components/Banner";

function App() {
  return (
    <div className="background min-h-screen flex flex-col">
      <Router>
        <AuthProvider>
          <DataContextProvider>
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
                        <SalesRegistry />
                      </ProtectedRoutes>
                    }
                  />
                  <Route
                    path="/sales-charts"
                    element={
                      <ProtectedRoutes>
                        <SalesCharts />
                      </ProtectedRoutes>
                    }
                  />
                </Routes>
              </div>
              <ProtectedRoutes>
                <Navbar />
              </ProtectedRoutes>
          </DataContextProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
