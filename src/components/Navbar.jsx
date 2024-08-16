import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import logoutIcon from "../assets/logoutIcon.png";
import salesIcon from "../assets/salesIcon.png";
import homeIcon from "../assets/homeIcon.png";
import salesRegistryIcon from "../assets/salesRegistryIcon.svg";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const AuthContextCall = useContext(AuthContext);
  const { logOut } = AuthContextCall;

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut(); // Ejecuta el logout
      navigate("/login"); // Redirige al usuario a la página de login
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };
  

  return (
    <nav className="fixed bottom-4 h-24 md:h-28 w-full bg-transparent p-3">
      <div className="bg-gray-800 text-white w-[95%] mx-auto p-3 rounded-xl flex justify-around items-center shadow-xl shadow-slate-700">
        {/* BUTTON 1 - Home */}
        <div className="p-3 rounded-full bg-banner w-12 h-12 md:w-16 md:h-16 flex justify-center items-center">
          <NavLink to="/">
            <img src={homeIcon} className="w-5 h-5 md:w-7 md:h-7" alt="home-icon" />
          </NavLink>
        </div>

        {/* BUTTON 2 - Sales */}
        <div className="p-3 rounded-full bg-banner w-12 h-12 md:w-16 md:h-16 flex justify-center items-center">
          <NavLink to="/sales-manager">
            <img src={salesIcon} className="w-5 h-5 md:w-7 md:h-7" alt="sales-icon" />
          </NavLink>
        </div>

        {/* BUTTON 3 - Sales registry */}
        <div className="p-3 rounded-full bg-banner w-12 h-12 md:w-16 md:h-16 flex justify-center items-center">
          <NavLink to="/sales-registry">
            <img src={salesRegistryIcon} className="w-8 h-8 md:w-10 md:h-10" alt="register-icon" />
          </NavLink>
        </div>

        {/* BUTTON 4 - Logout */}
        <div className="p-3 rounded-full bg-banner w-12 h-12 md:w-16 md:h-16 flex justify-center items-center">
          <button onClick={handleLogout}>
            <img src={logoutIcon} className="w-5 h-5 md:w-7 md:h-7" alt="logout-icon" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
