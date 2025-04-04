// components/DeleteQuantityPopup.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const DeleteQuantityPopup = ({ maxQuantity, onCancel, onConfirm }) => {
  const [quantityToDelete, setQuantityToDelete] = useState(1);

  useEffect(() => {
    if (maxQuantity < 1) {
      setQuantityToDelete(0);
    }
  }, [maxQuantity]);

  const handleRangeChange = (e) => {
    setQuantityToDelete(Number(e.target.value));
  };

  const handleSetAll = () => {
    setQuantityToDelete(maxQuantity);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white p-5 rounded-2xl shadow-xl text-center w-80"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <h2 className="text-lg font-bold mb-2">¿Cuántas unidades eliminar?</h2>

        <div className="flex items-center justify-center gap-2 mb-4">
          <input
            type="range"
            min="1"
            max={maxQuantity}
            value={quantityToDelete}
            onChange={handleRangeChange}
            className="w-full accent-red-500"
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleSetAll}
            className="text-sm bg-gray-200 px-3 py-1 rounded-md hover:bg-gray-300"
          >
            Todos
          </button>
          <input
            type="number"
            value={quantityToDelete}
            min="1"
            max={maxQuantity}
            onChange={(e) =>
              setQuantityToDelete(Math.min(maxQuantity, Math.max(1, Number(e.target.value))))
            }
            className="w-16 border border-gray-400 rounded-md text-center"
          />
          <span className="text-sm text-gray-500">/ {maxQuantity}</span>
        </div>

        <div className="flex justify-between">
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-1 rounded-md"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(quantityToDelete)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md"
          >
            Confirmar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DeleteQuantityPopup;