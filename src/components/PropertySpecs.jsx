import PropTypes from "prop-types";
import '../styles/PropertySpecs.css';
import { useState } from 'react';

const PropertySpecs = ({
  setProductStock,
  productStock,
  setProductPrice,
  productPrice,
}) => {
  const [isStockEmpty, setIsStockEmpty] = useState(false);
  const [isPriceEmpty, setIsPriceEmpty] = useState(false);

  // Handler para el stock
  const handleStockChange = (event) => {
    const value = event.target.value;

    // Verifica si el campo está vacío
    if (value === "") {
      setIsStockEmpty(true);
      setProductStock(""); // Permite que el campo quede vacío
      return;
    }

    const numericValue = Number(value);

    if (numericValue < 0) {
      alert("El stock no puede ser negativo.");
      setProductStock(""); // Restablece el valor a cadena vacía
      setIsStockEmpty(false); // Asegúrate de que el campo vacío no se mantenga
      return;
    }

    setProductStock(numericValue); // Actualiza el estado solo si el valor es válido
    setIsStockEmpty(false);
  };

  // Handler para el precio
  const handlePriceChange = (event) => {
    const value = event.target.value;

    // Verifica si el campo está vacío
    if (value === "") {
      setIsPriceEmpty(true);
      setProductPrice(""); // Permite que el campo quede vacío
      return;
    }

    const numericValue = Number(value);

    if (numericValue < 0) {
      alert("El precio no puede ser negativo.");
      setProductPrice(""); // Restablece el valor a cadena vacía
      setIsPriceEmpty(false); // Asegúrate de que el campo vacío no se mantenga
      return;
    }

    setProductPrice(numericValue); // Actualiza el estado solo si el valor es válido
    setIsPriceEmpty(false);
  };

  return (
    <div className="w-full flex flex-row justify-center items-center p-3 m-auto gap-4">
      <div className="flex flex-col w-24 justify-center items-center">
        <label className="text-center" htmlFor="productStock">Stock inicial</label>
        <input
          className="custom-input-appearance w-10 border-1 border-solid border-black rounded-md p-2 shadow-inner shadow-slate-700"
          onChange={handleStockChange}
          type="number"
          value={isStockEmpty ? "" : productStock}
        />
      </div>
      <div className="flex flex-col w-24 justify-center items-center">
        <label className="text-center" htmlFor="productPrice">Precio</label>
        <input
          className="custom-input-appearance w-10 border-1 border-solid border-black rounded-md p-2 shadow-inner shadow-slate-700"
          onChange={handlePriceChange}
          type="number"
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
