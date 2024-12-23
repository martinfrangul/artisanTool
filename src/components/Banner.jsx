import { useLocation } from "react-router-dom";
import logo from "/assets/logo-shadow.png";
import logoSinLetras from "/assets/logo-sin-letras.png";

const Banner = ({ showInstallButton, handleInstallClick }) => {
  const location = useLocation();
  let content;

  switch (location.pathname) {
    case "/create-inventory":
      content = (
        <div className="flex flex-col justify-center items-center p-3 lg:p-0">
          <div className="hidden lg:block">
            <img
              className="w-[4.7rem] md:w-28 flex justify-center px-3 pt-3 items-center"
              src={logoSinLetras}
              alt="logo-artisan-tool"
            />
          </div>
          <h1 className="mb-2 text-logo text-xl md:text-2xl font-bold pt-2 md:py-2">
            Crear inventario
          </h1>
        </div>
      );
      break;
    case "/inventory":
      content = (
        <div className="flex flex-col justify-center items-center p-3 lg:p-0">
          <div className="hidden lg:block">
            <img
              className="w-[4.7rem] md:w-28 flex justify-center px-3 pt-3 items-center"
              src={logoSinLetras}
              alt="logo-artisan-tool"
            />
          </div>
          <h1 className="mb-2 text-logo text-xl md:text-2xl font-bold pt-2 md:py-2">
            Inventario
          </h1>
        </div>
      );
      break;
    case "/sales-manager":
      content = (
        <div className="flex flex-col justify-center items-center p-3 lg:p-0">
          <div className="hidden lg:block">
            <img
              className="w-[4.7rem] md:w-28 flex justify-center px-3 pt-3 items-center"
              src={logoSinLetras}
              alt="logo-artisan-tool"
            />
          </div>
          <h1 className="mb-2 text-logo text-xl md:text-2xl font-bold pt-2 md:py-2">
            Vender
          </h1>
        </div>
      );
      break;
    case "/sales-registry":
      content = (
        <div className="flex flex-col justify-center items-center p-3 lg:p-0">
          <div className="hidden lg:block">
            <img
              className="w-[4.7rem] md:w-28 flex justify-center px-3 pt-3 items-center"
              src={logoSinLetras}
              alt="logo-artisan-tool"
            />
          </div>

          <h1 className="mb-2 text-logo text-xl md:text-2xl font-bold pt-2 md:py-2 text-center">
            Registro de ventas
          </h1>
        </div>
      );
      break;
    case "/sales-charts":
      content = (
        <div className="flex flex-col justify-center items-center p-3 lg:p-0">
          <div className="hidden lg:block">
            <img
              className="w-[4.7rem] md:w-28 flex justify-center px-3 pt-3 items-center"
              src={logoSinLetras}
              alt="logo-artisan-tool"
            />
          </div>

          <h1 className="mb-2 text-logo text-xl md:text-2xl font-bold pt-2 md:py-2">
            Gráficos y estadísiticas
          </h1>
        </div>
      );
      break;
    default:
      content = (
        <img
          className="flex justify-center w-36 md:w-52 p-3 md:py-5 items-center"
          src={logo}
          alt="logo-artisan-tool"
        />
      );
  }

  return (
    <div className="flex justify-center w-full bg-banner shadow-md">
      <div className="w-1/4"></div>
      <div className="flex justify-center w-2/4">{content}</div>
      {/* Botón de instalación visible solo cuando el prompt esté disponible */}
      {showInstallButton ? (
        <div className="flex justify-end w-1/4 p-3">
          <button
            onClick={handleInstallClick}
            className="btn btn-xs bg-logo text-white rounded-lg text-xs hover:text-black justify-end items-center flex"
          >
            Instalar
          </button>
        </div>
      ) : 
      <div className="w-1/4">
      </div>
      }
    </div>
  );
};

export default Banner;
