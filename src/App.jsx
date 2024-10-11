// COMPONENTS
import Login from "./components/Login";
import Home from "./components/Home";
import Register from "./components/Register";
import Inventory from "./components/Inventory/Inventory";
import CreateInventory from "./components/Inventory/CreateInventory";
import SalesManager from "./components/Sales/SalesManager";
import SalesRegistry from "./components/Sales/SalesRegistry";
import SalesCharts from "./components/Sales/SalesCharts";
import Layout from "./components/Layout";

// UTILS
import ProtectedRoutes from "./ProtectedRoutes";
import PublicRoutes from "./PublicRoutes";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// CONTEXT
import { AuthProvider } from "./context/AuthContext";
import { DataContextProvider } from "./context/DataContext";

// HOOKS
import { useState, useEffect } from "react";

function App() {
  // PARA INSTALAR LA APP (PWA)
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  // Manejar el evento beforeinstallprompt
  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault(); // Evita que el navegador muestre el prompt automáticamente
      setDeferredPrompt(e); // Guarda el evento para usarlo más tarde
      setShowInstallButton(true); // Muestra el botón para instalar la app
    });
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // Muestra el cuadro de diálogo de instalación
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("El usuario aceptó instalar la app");
        } else {
          console.log("El usuario rechazó la instalación");
        }
        setDeferredPrompt(null); // Resetea el evento
        setShowInstallButton(false); // Oculta el botón
      });
    }
  };

  return (
    <div className="bg-[#E9E4DB] min-h-screen flex flex-col">
      <Router>
        <AuthProvider>
          <DataContextProvider>
            <div className="flex-grow justify-center items-center">
              <Routes>
                <Route
                  path="/login"
                  element={
                    <PublicRoutes>
                      <Login />
                    </PublicRoutes>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicRoutes>
                      <Register />
                    </PublicRoutes>
                  }
                />
                <Route
                  path="/*"
                  element={
                    <ProtectedRoutes>
                      <Layout />
                    </ProtectedRoutes>
                  }
                >
                  {/* Rutas anidadas dentro del Layout */}
                  <Route
                    index
                    element={
                      <Home
                        showInstallButton={showInstallButton}
                        handleInstallClick={handleInstallClick}
                      />
                    }
                  />
                  <Route
                    path="create-inventory"
                    element={<CreateInventory />}
                  />
                  <Route path="inventory" element={<Inventory />} />
                  <Route path="sales-manager" element={<SalesManager />} />
                  <Route path="sales-registry" element={<SalesRegistry />} />
                  <Route path="sales-charts" element={<SalesCharts />} />
                </Route>
              </Routes>
            </div>
          </DataContextProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
