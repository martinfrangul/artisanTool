import "../styles/Login.css"; // Utiliza el mismo CSS que para Login
import logo from "../assets/logo.png";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import Alert from "./Alert";

const Register = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alert, setAlert] = useState({ message: "", type: "", visible: false });

  const auth = getAuth();
  const navigate = useNavigate();

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setAlert({
      message: "",
      visible: false,
    });

    if (email === "" || password === "" || confirmPassword === "") {
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

    if (password !== confirmPassword) {
      setAlert({
        message: "Las contraseñas no coinciden.",
        type: "error",
        visible: true,
      });
      return;
    }

    try {
      // Crear el usuario con email y contraseña
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      // Manejo de errores
      if (error.code === "auth/email-already-in-use") {
        setAlert({
          message: "El email ya está en uso. Por favor, utiliza otro email o inicia sesión.",
          type: "error",
          visible: true,
        });
      } else if (error.code === "auth/weak-password") {
        setAlert({
          message: "La contraseña debe tener al menos 6 caracteres.",
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
      <div className="w-3/4 md:w-2/4 h-[25rem] md:h-[26rem] bg-opacity-70 backdrop-blur-sm bg-white rounded-lg flex flex-col justify-evenly items-center">
        <div
          id="logo-container"
          className="flex justify-center w-44 h-1/4 items-center"
        >
          <img src={logo} alt="logo-artisan-tool" />
        </div>
        <form className="flex flex-col justify-center items-center h-2/4">
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
          <input
            className="rounded my-1 w-full border-solid border-black border-[0.5px] p-2"
            placeholder="confirm password"
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            className="bg-logo text-white p-2 rounded m-2 text-xs"
            type="submit"
            onClick={handleRegister}
          >
            Register
          </button>
        </form>
        <div className="flex flex-col justify-evenly items-center">
          <div>
            <h3 className="text-sm">
              {`Already have an account? `}
              <NavLink className="font-bold" to="/login">
                Login
              </NavLink>
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
