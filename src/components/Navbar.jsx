import { AuthContext } from "../context/AuthContext";
import { useContext} from "react";
import logoutIcon from "../assets/logoutIcon.png";
import sellsIcon from "../assets/sellsIcon.png";
import homeIcon from "../assets/homeIcon.png";
import historyIcon from "../assets/historyIcon.png";
import { NavLink } from "react-router-dom";


const Navbar = () => {
  const AuthContextCall = useContext(AuthContext);
  const { logOut } = AuthContextCall;
  
  return (
    <>
        <div className="flex flex-row justify-around items-center">
          {/* BUTTON 1 - Home */}

          <div className="p-3 rounded-full bg-orange-300 w-10 h-10 flex justify-center items-center">
            <NavLink to="/">
              <img src={homeIcon} className="w-5 h-5" alt="home-icon" />
            </NavLink>
          </div>

          {/* BUTTON 2 - Sells */}
          <div className="p-3 rounded-full bg-orange-300 w-10 h-10 flex justify-center items-center">
            <NavLink to="/sells">
              <img src={sellsIcon} className="w-5 h-5" alt="sells-icon" />
            </NavLink>
          </div>
          {/* BUTTON 3 - Registry*/}
          <div className="p-3 rounded-full bg-orange-300 w-10 h-10 flex justify-center items-center">
            <NavLink to="/history">
              <img src={historyIcon} className="w-5 h-5" alt="register-icon" />
            </NavLink>
          </div>

          {/* BUTTON 4 - Logout */}
          <div className="p-3 rounded-full bg-orange-300 w-10 h-10 flex justify-center items-center">
            <button onClick={logOut}>
              <img src={logoutIcon} className="w-5 h-5" alt="logout-icon" />
            </button>
          </div>
        </div>
    </>
  );
};

export default Navbar;
