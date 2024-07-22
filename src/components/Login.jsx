import "../styles/Login.css";
import logo from "../assets/logo.png";
import googleLogin from "../assets/Captura de pantalla 2024-07-14 a las 17.12.17.png";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { NavLink } from "react-router-dom";

const Login = () => {
  const context = useContext(AuthContext);

  const { googleLogIn } = context;

  const handleGoogleLogin = async () => {
    await googleLogIn();

  };

  return (
    <div className="login-container bg-no-repeat bg-cover h-screen w-full flex flex-col justify-center items-center">
      <div className="landscape:md:h-2/4 landscape:sm:flex-row landscape:md:w-3/4 md:w-2/4 w-3/4 h-[23rem] bg-opacity-70 backdrop-blur-sm bg-white rounded-lg flex flex-col md:justify-center justify-evenly items-center md:mb-0">
        <div
          id="logo-container"
          className="flex justify-center w-44 items-center"
        >
          <img src={logo} alt="logo-artisan-tool" />
        </div>
        <form className="flex flex-col justify-center items-center h-1/3">
          <input
            className="rounded my-1 w-full border-solid border-black border-[0.5px] p-2"
            placeholder="email"
            type="text"
          />
          <input
            className="rounded my-1 w-full border-solid border-black border-[0.5px] p-2"
            placeholder="password"
            type="text"
          />
        </form>
        <div className="flex flex-col justify-evenly items-center h-1/3">
          <div>
            <h3 className="text-sm">
              {`¿Don't have an account? `}
              <NavLink className="font-bold"
              to="/register">Register</NavLink>
            </h3>
          </div>
          <div className="flex justify-center text-sm">
            <h5>or</h5>
          </div>
          <div className="w-32">
            <img
              onClick={handleGoogleLogin}
              src={googleLogin}
              alt="google-login"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
