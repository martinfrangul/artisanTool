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
    <div className="background min-h-screen flex flex-col justify-between">
      <Router>
        <AuthProvider>
          <InventoryContextProvider>
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
                      <SalesManager/>
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="/sales-registry"
                  element={
                    <ProtectedRoutes>
                      <SalesRegistry/>
                    </ProtectedRoutes>
                  }
                />
              </Routes>
            </div>
            <ProtectedRoutes>
              <div className="bg-gray-800 text-white p-3 mx-auto w-[90%] rounded-xl shadow-xl shadow-slate-700 my-5">
                <Navbar />
              </div>
            </ProtectedRoutes>
          </InventoryContextProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
