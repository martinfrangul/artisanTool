import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import logoutIcon from "/assets/logoutIcon.png";
import salesIcon from "/assets/salesIcon.png";
import homeIcon from "/assets/homeIcon.png";
import inventoryIcon from "/assets/inventoryIcon.png";
import salesRegistryIcon from "/assets/salesRegistryIcon.svg";
import { useNavigate, NavLink, useLocation } from "react-router-dom";

const Navbar = () => {
  const AuthContextCall = useContext(AuthContext);
  const { logOut } = AuthContextCall;

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logOut(); // Ejecuta el logout
      navigate("/login"); // Redirige al usuario a la página de login
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <nav className="fixed bottom-4 h-24 md:h-28 w-full md:w-full lg:w-1/2 lg:left-1/2 lg:transform lg:-translate-x-1/2 p-3">
      <div className="bg-gray-800 text-white w-[95%] mx-auto p-3 rounded-xl flex justify-around items-center shadow-xl shadow-slate-700">
        {/* BUTTON 1 - Home */}
        <NavLink to="/">
          <div
            className={`p-3 rounded-full w-12 h-12 md:w-16 md:h-16 flex justify-center items-center hover:scale-110 transition-transform duration-300 ${
              location.pathname === "/" ? "bg-[#93b2ce]" : "bg-banner"
            }`}
          >
            <img
              src={homeIcon}
              className="w-5 h-5 md:w-7 md:h-7"
              alt="home-icon"
            />
          </div>
        </NavLink>

        {/* BUTTON 2 - Inventory */}

        <NavLink to="/inventory">
          <div
            className={`p-3 rounded-full w-12 h-12 md:w-16 md:h-16 flex justify-center items-center hover:scale-110 transition-transform duration-300 ${
              location.pathname === "/inventory" ? "bg-[#93b2ce]" : "bg-banner"
            }`}
          >
            <img
              src={inventoryIcon}
              className="w-8 h-8 md:w-10 md:h-10"
              alt="register-icon"
            />
          </div>
        </NavLink>

        {/* BUTTON 3 - Sales */}
        <NavLink to="/sales-manager">
          <div
            className={`p-3 rounded-full w-12 h-12 md:w-16 md:h-16 flex justify-center items-center hover:scale-110 transition-transform duration-300 ${
              location.pathname === "/sales-manager"
                ? "bg-[#93b2ce]"
                : "bg-banner"
            }`}
          >
            <img
              src={salesIcon}
              className="w-5 h-5 md:w-7 md:h-7"
              alt="sales-icon"
            />
          </div>
        </NavLink>

        {/* BUTTON 4 - Sales registry */}
        <NavLink to="/sales-registry">
          <div
            className={`p-3 rounded-full w-12 h-12 md:w-16 md:h-16 flex justify-center items-center hover:scale-110 transition-transform duration-300 ${
              location.pathname === "/sales-registry"
                ? "bg-[#93b2ce]"
                : "bg-banner"
            }`}
          >
            <img
              src={salesRegistryIcon}
              className="w-8 h-8 md:w-10 md:h-10"
              alt="register-icon"
            />
          </div>
        </NavLink>

        {/* BUTTON 5 - Logout */}
        <button onClick={handleLogout}>
          <div className="p-3 rounded-full bg-banner w-12 h-12 md:w-16 md:h-16 flex justify-center items-center hover:scale-110 transition-transform duration-300">
            <img
              src={logoutIcon}
              className="w-5 h-5 md:w-7 md:h-7"
              alt="logout-icon"
            />
          </div>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
