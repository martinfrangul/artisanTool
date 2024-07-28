import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { InventoryContext } from "../context/InventoryContext";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { database } from "../../firebase/firebaseConfig";
import PropTypes from "prop-types";

const EditProduct = ({ handleModalToggle, productIdForEdit }) => {
  // STATES
  const [itemData, setItemData] = useState({});
  const [errors, setErrors] = useState({});
  const customOrder = [
    "productName",
    "design",
    "size",
    "type",
    "color",
    "model",
    "productPrice",
    "productStock",
  ];
  const propertyLabels = {
    design: "Diseño",
    size: "Tamaño",
    color: "Color",
    type: "Tipo",
    model: "Modelo",
    productName: "Producto",
    productStock: "Stock",
    productPrice: "Precio",
  };

  const Authcontext = useContext(AuthContext);
  const Inventorycontext = useContext(InventoryContext);

  const { user } = Authcontext;
  const { reloadData } = Inventorycontext;

  useEffect(() => {
    const fetchProductData = async () => {
      if (!user || !productIdForEdit) return;
      const docRef = doc(
        database,
        `users/${user.uid}/products`,
        productIdForEdit
      );
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setItemData(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };
    fetchProductData();
  }, [user, productIdForEdit]);

  const handleInputChange = (key, value) => {
    setItemData((prevItemData) => ({
      ...prevItemData,
      [key]: value,
    }));
    // Clear the error for the field if it's being modified
    setErrors((prevErrors) => ({
      ...prevErrors,
      [key]: "",
    }));
  };

  const validateFields = () => {
    let isValid = true;
    let validationErrors = {};

    Object.entries(itemData).forEach(([key, value]) => {
      // Solo llamar a trim si value es una cadena
      if (typeof value === "string" && !value.trim()) {
        validationErrors[key] = "Este campo no puede estar vacío";
        isValid = false;
      } else if (typeof value !== "string" && !value) {
        // Maneja el caso donde el valor no es una cadena pero es falsy (ej., null o undefined)
        validationErrors[key] = "Este campo no puede estar vacío";
        isValid = false;
      }
    });

    setErrors(validationErrors);
    return isValid;
  };

  const submitEditProduct = async () => {
    if (!user || !productIdForEdit) return;
    if (!validateFields()) return;

    try {
      const docRef = doc(
        database,
        `users/${user.uid}/products`,
        productIdForEdit
      );
      await updateDoc(docRef, itemData);
      reloadData();
      alert("Producto editado correctamente");
      handleModalToggle(false);
    } catch (error) {
      console.error("Error al editar producto: ", error);
    }
  };

  return (
    <div
      id="default-modal"
      tabIndex="-1"
      aria-hidden="true"
      className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full backdrop-blur-sm"
    >
      <div className="relative p-4 w-11/12 max-w-2xl max-h-full bg-white rounded-lg border-solid border-[1px] border-gray-700">
        <div className="w-full flex justify-center border-b items-center">
          <div className="w-1/4">{/* DIV ESTRUCTURAL PARA DIVIDIR EN 3 */}</div>
          <div className="w-2/4 text-center font-semibold">EDITA EL PRODUCTO</div>
            <div className="w-1/4 flex items-center justify-end py-2 md:p-5 rounded-t">
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                onClick={() => handleModalToggle(false)}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
        </div>

        <div className="p-4 md:p-5 space-y-4">
          {Object.entries(itemData)
            .sort(([keyA], [keyB]) => {
              const indexA = customOrder.indexOf(keyA);
              const indexB = customOrder.indexOf(keyB);
              if (indexA === -1 && indexB === -1) return 0; // Ambos no están en el array
              if (indexA === -1) return 1; // keyA no está en el array, keyB sí
              if (indexB === -1) return -1; // keyB no está en el array, keyA sí
              return indexA - indexB; // Ambos están en el array
            })
            .map(([key, value]) => (
              <div key={key} className="space-y-2">
                <label
                  className="block text-sm font-semibold text-gray-700"
                  htmlFor={key}
                >
                  {propertyLabels[key] || key} {/* Usa la etiqueta amigable */}
                </label>

                <input
                  className={`input input-bordered w-full max-w-xs ${
                    errors[key] ? "border-red-500" : "border-gray-300"
                  }`}
                  id={key}
                  value={value}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  type="text"
                />
                {errors[key] && (
                  <p className="text-red-500 text-sm">{errors[key]}</p>
                )}
              </div>
            ))}
        </div>
        <div className="flex justify-center items-center p-4 md:p-5 border-t border-gray-200 rounded-b">
          <button
            type="button"
            className="text-white bg-success focus:ring-2 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 text-center"
            onClick={submitEditProduct}
          >
            Save
          </button>
          <button
            type="button"
            className="py-2 px-4 ms-3 text-sm font-medium text-white focus:outline-none bg-marron rounded-lg focus:z-10"
            onClick={() => handleModalToggle(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

EditProduct.propTypes = {
  handleModalToggle: PropTypes.func.isRequired,
  productIdForEdit: PropTypes.string.isRequired,
};

export default EditProduct;
