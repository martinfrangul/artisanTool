import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "./Navbar";
import Banner from "./Banner";



const Layout = ({showInstallButton, handleInstallClick}) => {


  


  const { user } = useContext(AuthContext);

  return (
    <div className="flex flex-col min-h-screen">
      {user && <Banner showInstallButton={showInstallButton}
                        handleInstallClick={handleInstallClick} />}
      <div className="flex-grow">
        <Outlet /> {/* Renderiza las rutas hijas */}
      </div>
      {user && <Navbar />}
    </div>
  );
};

export default Layout;
