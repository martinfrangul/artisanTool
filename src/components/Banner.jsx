import { useLocation } from "react-router-dom";
import logo from "../assets/logo-shadow.png";
import logoSinLetras from "../assets/logo-sin-letras.png";

const Banner = () => {
  const location = useLocation();
  let content;

  switch (location.pathname) {
    case "/create-inventory":
      content = (
        <div className="flex flex-col justify-center items-center">
          <img
            className="flex justify-center w-[4.7rem] px-3 pt-3 items-center"
            src={logoSinLetras}
            alt="logo-artisan-tool"
          />
          <h1 className="mb-2 text-logo pt-1 text-xl font-bold">CREAR INVENTARIO</h1>
        </div>
      );
      break;
    case "/inventory":
      content = (
        <div className="flex flex-col justify-center items-center">
          <img
            className="flex justify-center w-[4.7rem] px-3 pt-3 items-center"
            src={logoSinLetras}
            alt="logo-artisan-tool"
          />
          <h1 className="mb-2 text-logo pt-1 text-xl font-bold">INVENTARIO</h1>
        </div>
      );
      break;
    case "/sales-manager":
      content = (
        <div className="flex flex-col justify-center items-center">
          <img
            className="flex justify-center w-[4.7rem] px-3 pt-3 items-center"
            src={logoSinLetras}
            alt="logo-artisan-tool"
          />
          <h1 className="mb-2 text-logo pt-1 text-xl font-bold">VENDER</h1>
        </div>
      );
      break;
      case "/sales-registry":
      content = (
        <div className="flex flex-col justify-center items-center">
          <img
            className="flex justify-center w-[4.7rem] px-3 pt-3 items-center"
            src={logoSinLetras}
            alt="logo-artisan-tool"
          />
          <h1 className="mb-2 text-logo pt-1 text-xl font-bold">REGISTRO DE VENTAS</h1>
        </div>
      );
      break;
      case "/sales-charts":
      content = (
        <div className="flex flex-col justify-center items-center">
          <img
            className="flex justify-center w-[4.7rem] px-3 pt-3 items-center"
            src={logoSinLetras}
            alt="logo-artisan-tool"
          />
          <h1 className="mb-2 text-logo pt-1 text-xl font-bold">GRÁFICOS Y ESTADÍSTICAS</h1>
        </div>
      );
      break;
    default:
      content = (
        <img
          className="flex justify-center w-36 p-3 items-center"
          src={logo}
          alt="logo-artisan-tool"
        />
      );
  }

  return (
    <div className="flex justify-center w-full bg-banner rounded-t-2xl">
      {content}
    </div>
  );
};

export default Banner;
