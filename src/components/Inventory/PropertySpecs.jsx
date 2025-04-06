import { useState } from "react";
import PropTypes from "prop-types";
import "../../styles/PropertySpecs.css";

import Alert from "../Alert";

const PropertySpecs = ({
  setProductStock,
  productStock,
  setProductPrice,
  productPrice,
}) => {
  const [isStockEmpty, setIsStockEmpty] = useState(false);
  const [isPriceEmpty, setIsPriceEmpty] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "", visible: false });

  // Handler para el stock
  const handleStockChange = (event) => {
    const value = event.target.value.trim();

    if (value === "") {
      setIsStockEmpty(true);
      setProductStock("");
      return;
    }

    // Aceptar solo enteros positivos
    if (!/^\d+$/.test(value)) {
      setAlert({
        message: "El stock debe ser un número entero positivo",
        type: "warning",
        visible: true,
      });
      return;
    }

    const numericValue = parseInt(value, 10);
    setProductStock(numericValue);
    setIsStockEmpty(false);
  };

  // Handler para el precio
  const handlePriceChange = (event) => {
    const rawValue = event.target.value.replace(",", ".").trim();

    if (rawValue === "") {
      setIsPriceEmpty(true);
      setProductPrice("");
      return;
    }

    if (!/^\d*\.?\d{0,2}$/.test(rawValue)) {
      setAlert({
        message: "El precio debe ser un número positivo con hasta 2 decimales",
        type: "warning",
        visible: true,
      });
      return;
    }

    const numberValue = Number(rawValue);
    if (isNaN(numberValue) || numberValue < 0) {
      setAlert({
        message: "El precio no puede ser negativo",
        type: "warning",
        visible: true,
      });
      return;
    }

    setProductPrice(numberValue);
    setIsPriceEmpty(false);
  };

  return (
    <div className="w-full flex flex-row justify-center items-center p-3 m-auto gap-4">
      {alert.visible && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ ...alert, visible: false })}
        />
      )}

      <div className="flex flex-col w-24 justify-center items-center">
        <label className="text-center" htmlFor="productStock">
          Stock inicial
        </label>
        <input
          className="custom-input-appearance w-10 border-1 border-solid border-black rounded-md p-2 shadow-inner shadow-slate-700"
          onChange={handleStockChange}
          type="number"
          value={isStockEmpty ? "" : productStock}
        />
      </div>
      <div className="flex flex-col w-24 justify-center items-center">
        <label className="text-center" htmlFor="productPrice">
          Precio
        </label>
        <input
          className="custom-input-appearance w-10 border-1 border-solid border-black rounded-md p-2 shadow-inner shadow-slate-700 text-right"
          onChange={handlePriceChange}
          type="number"
          step="0.01"
          min="0"
          value={isPriceEmpty ? "" : productPrice}
        />
      </div>
    </div>
  );
};

PropertySpecs.propTypes = {
  setProductStock: PropTypes.func.isRequired,
  productStock: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  setProductPrice: PropTypes.func.isRequired,
  productPrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
};

export default PropertySpecs;
