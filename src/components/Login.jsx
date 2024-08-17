import "../styles/Login.css";
import logo from "../assets/logo.png";
import googleLogin from "../assets/googleLoginButton.png";
import { AuthContext } from "../context/AuthContext";
import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Alert from "./Alert";

const Login = () => {
  const context = useContext(AuthContext);
  const { googleLogIn } = context;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({ message: "", type: "", visible: false });

  const auth = getAuth();
  const navigate = useNavigate();
  const { user } = context;

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//         if (user) {
//             navigate("/");
//         }
//     });
//     return () => unsubscribe();
// }, [auth, navigate]);




  const handleGoogleLogin = async () => {
    await googleLogIn();
    if (user) navigate("/")
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setAlert({
      message: "",
      visible: false,
    });

    if (email === "" || password === "") {
      setAlert({
        message: "Ningún campo puede estar vacío.",
        type: "error",
        visible: true,
      });
      return;
    }

    if (!isValidEmail(email)) {
      setAlert({
        message: "Por favor ingresa un email válido.",
        type: "error",
        visible: true,
      });
      return;
    }

    try {
      // Intentar iniciar sesión
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        setAlert({
          message: "Contraseña incorrecta.",
          type: "error",
          visible: true,
        });
      } else if (error.code === "auth/user-not-found") {
        setAlert({
          message: "No se ha encontrado un usuario con este email.",
          type: "error",
          visible: true,
        });
      } else if (error.code === "auth/network-request-failed") {
        setAlert({
          message: "Error de red. Por favor, verifica tu conexión a Internet.",
          type: "error",
          visible: true,
        });
      } else {
        setAlert({
          message: "Algo ha fallado. Inténtalo nuevamente más tarde.",
          type: "error",
          visible: true,
        });
      }
    }
  };

  return (
    <div className="login-container bg-no-repeat bg-cover h-screen w-full flex flex-col justify-center items-center">
      {alert.visible && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ ...alert, visible: false })}
        />
      )}
      <div className="w-3/4 md:w-2/4 lg:w-1/4 h-[23rem] md:h-[28rem] bg-opacity-70 backdrop-blur-sm bg-white rounded-lg flex flex-col md:justify-center justify-evenly items-center md:mb-0">
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
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="rounded my-1 w-full border-solid border-black border-[0.5px] p-2"
            placeholder="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="bg-logo text-white p-2 rounded m-2 text-xs"
            type="submit"
            onClick={handleLogin}
          >
            Login
          </button>
        </form>
        <div className="flex flex-col justify-evenly items-center h-1/3">
          <div>
            <h3 className="text-sm">
              {`¿Don't have an account? `}
              <NavLink className="font-bold" to="/register">
                Register
              </NavLink>
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
