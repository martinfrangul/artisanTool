import { useContext, useEffect, useState } from "react";
import deleteItemIconRed from "/assets/deleteItemIconRed.png";
import PropTypes from "prop-types";

// CONTEXT
import { AuthContext } from "../../context/AuthContext";
import { DataContext } from "../../context/DataContext";

// FIREBASE
import {
  doc,
  updateDoc,
  getDoc,
  deleteField,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { database } from "../../../firebase/firebaseConfig";

// COMPONENTS
import Alert from "../Alert";

const EditProduct = ({ handleModalToggle, productIdForEdit }) => {
  const [itemData, setItemData] = useState({});
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ message: "", type: "", visible: false });
  const [availableProperties, setAvailableProperties] = useState([]);
  
  const Authcontext = useContext(AuthContext);
  const Datacontext = useContext(DataContext);

  const { user } = Authcontext;
  const { reloadData, propertyLabels } = Datacontext;

  const customOrder = [
    "productName",
    "design",
    "size",
    "type",
    "color",
    "model",
    "productPrice",
    "productStock",
    "binding"
  ];

  // Mapa de nombre de propiedes mejorado

  const nonDeletableProperties = [
    "productName",
    "productStock",
    "productPrice",
  ];
  const allProperties = Object.keys(propertyLabels);


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
        const data = docSnap.data();
        setItemData(data);
        // Propiedades usadas y propiedades disponibles
        const usedProperties = Object.keys(data);
        const available = allProperties.filter(
          (prop) => !usedProperties.includes(prop)
        );
        setAvailableProperties(available);
      } else {
        console.log("No existe el documento");
      }
    };
    fetchProductData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, productIdForEdit]);

  const handleInputChange = (key, value) => {

    if (typeof value === "string") {
      value = value.toLowerCase().trim();
    }


    if ((key === "productStock" || key === "productPrice") && value !== "") {
      if (!isNaN(value)) {
        value = parseInt(value);
      } else {
        value = "";
      }
    }

    setItemData((prevItemData) => ({
      ...prevItemData,
      [key]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [key]: "",
    }));
  };

  const handleDeleteProperty = (key) => {
    // eslint-disable-next-line no-unused-vars
    const { [key]: _, ...rest } = itemData;
    setItemData(rest);
    setAvailableProperties([...availableProperties, key]);
  };

  const handleAddProperty = (key) => {
    setItemData((prevItemData) => ({
      ...prevItemData,
      [key]: "",
    }));
    setAvailableProperties(availableProperties.filter((prop) => prop !== key));
  };

  const validateFields = () => {
    let isValid = true;
    let validationErrors = {};

    Object.entries(itemData).forEach(([key, value]) => {
      if (typeof value === "string" && !value.trim()) {
        validationErrors[key] = "Este campo no puede estar vacío";
        isValid = false;
      } else if (typeof value !== "string" && value === null) {
        validationErrors[key] = "Este campo no puede estar vacío";
        isValid = false;
      }
    });

    setErrors(validationErrors);
    return isValid;
  };

  const checkIfProductExists = async (excludeId) => {
    if (!user || !itemData.productName) return false;

    try {
      const productQuery = collection(database, `users/${user.uid}/products`);
      const baseQuery = query(
        productQuery,
        where("productName", "==", itemData.productName),
        // Excluir el producto que se está editando
        excludeId
          ? where("__name__", "!=", excludeId)
          : where("__name__", "!=", "")
      );

      const baseQuerySnapshot = await getDocs(baseQuery);
      const existingProducts = baseQuerySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      // Comparar propiedades
      return existingProducts.some((product) => {
        // Excluir propiedades no comparables
        const productProperties = Object.keys(product).filter(
          (key) => !["id", "productPrice", "productStock", "toDo"].includes(key)
        );

        const formProperties = Object.entries(itemData).reduce(
          (acc, [key, value]) => {
            if (!["id", "productPrice", "productStock", "toDo"].includes(key)) {
              acc[key] = value;
            }
            return acc;
          },
          {}
        );

        const hasSameProperties =
          productProperties.every((p) => formProperties[p] === product[p]) &&
          Object.keys(formProperties).length === productProperties.length;

        return hasSameProperties;
      });
    } catch (error) {
      console.error("Error checking product existence:", error);
      return false;
    }
  };

  const submitEditProduct = async () => {
    if (!user || !productIdForEdit) return;
    if (!validateFields()) return;

    // Verificar si el producto ya existe, excluyendo el producto en edición
    const productExists = await checkIfProductExists(productIdForEdit);

    if (productExists) {
      setAlert({
        message:
          "El producto con el mismo nombre y propiedades ya existe en la base de datos.",
        type: "error",
        visible: true,
      });
      return;
    }

    const updates = { ...itemData };

    // Revisar las propiedades que faltan en itemData y eliminarlas en Firebase
    const docRef = doc(
      database,
      `users/${user.uid}/products`,
      productIdForEdit
    );

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const existingData = docSnap.data();
      const fieldsToDelete = {};

      // Identificar campos que no están en itemData pero que existen en Firebase
      Object.keys(existingData).forEach((key) => {
        if (!(key in updates)) {
          fieldsToDelete[key] = deleteField();
        }
      });

      // Combinar los campos a eliminar con los campos a actualizar
      const finalUpdate = { ...updates, ...fieldsToDelete };

      try {
        await updateDoc(docRef, finalUpdate);
        setAlert({
          message: "Producto editado correctamente",
          type: "success",
          visible: true,
        });
        reloadData();
      } catch (error) {
        console.error("Error al editar producto: ", error);
      }
    } else {
      console.log("No existe el documento");
    }
  };

  useEffect(() => {
    // Bloquear el desplazamiento del fondo cuando el modal está abierto
    document.body.style.overflow = productIdForEdit ? "hidden" : "auto";

    // Restaurar el desplazamiento del fondo cuando el modal se cierra
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [productIdForEdit]);

  return (
    <div
      id="default-modal"
      tabIndex="-1"
      className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full overflow-auto backdrop-blur-sm"
    >
      {alert.visible && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => [
            setAlert({ ...alert, visible: false }),
            handleModalToggle(false),
          ]}
        />
      )}

      <div className="relative p-4 w-11/12 max-w-2xl max-h-[90vh] bg-gray-100 rounded-lg border-solid border-[1px] border-gray-700 overflow-auto">
        <div className="w-full flex justify-center border-b items-center">
          <div className="w-1/4">{/* DIV ESTRUCTURAL PARA DIVIDIR EN 3 */}</div>
          <div className="w-2/4 text-center font-semibold">
            EDITA EL PRODUCTO
          </div>
          <div className="w-1/4 flex items-center justify-end py-2 md:p-5 rounded-t">
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              onClick={() => handleModalToggle(false)}
            >
              <svg
                className="w-3 h-3"
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
              <span className="sr-only">Cerrar modal</span>
            </button>
          </div>
        </div>
        <div className="p-4 md:p-5 space-y-4">
          {Object.entries(itemData)
            .filter(([key]) => key !== "id" && key !== "toDo")
            .sort(([keyA], [keyB]) => {
              const indexA = customOrder.indexOf(keyA);
              const indexB = customOrder.indexOf(keyB);
              if (indexA === -1 && indexB === -1) return 0; // Ambos no están en el array
              if (indexA === -1) return 1; // keyA no está en el array, keyB sí
              if (indexB === -1) return -1; // keyB no está en el array, keyA sí
              return indexA - indexB; // Ambos están en el array
            })
            .map(([key, value]) => (
              <div key={key} className="flex flex-col justify-start gap-3">
                <label
                  className="block text-sm font-bold text-gray-700"
                  htmlFor={key}
                >
                  {propertyLabels[key] || key}
                </label>
                <div className="w-full flex justify-center items-center">
                  <input
                    className={`input input-bordered w-full max-w-xs ${
                      errors[key] ? "border-red-500" : "border-black"
                    }`}
                    id={key}
                    value={value}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    type="text"
                    onClick={(e) => e.target.select()}
                  />
                  {!nonDeletableProperties.includes(key) ? (
                    <button
                      type="button"
                      className="ml-2"
                      onClick={() => handleDeleteProperty(key)}
                    >
                      <img
                        className="w-6"
                        src={deleteItemIconRed}
                        alt="delete-icon"
                      />
                    </button>
                  ) : (
                    <div className="ml-2 w-6"></div>
                  )}
                </div>
                {errors[key] && (
                  <p className="text-red-500 text-sm">{errors[key]}</p>
                )}
              </div>
            ))}
        </div>
        <div className="flex flex-col justify-center items-center p-4 md:p-5 border-t border-gray-200 rounded-b">
          {availableProperties.length > 0 && (
            <div className="flex items-center mb-4">
              <select
                id="addProperty"
                className="input input-bordered w-full max-w-xs bg-[#DEEAFF]"
                onChange={(e) => handleAddProperty(e.target.value)}
                value=""
              >
                <option value="" disabled>
                  Agregar propiedad
                </option>
                {availableProperties.map((prop) => (
                  <option key={prop} value={prop}>
                    {propertyLabels[prop] || prop}
                  </option>
                ))}
              </select>
            </div>
          )}
          <button className="btn bg-success" onClick={submitEditProduct}>
            Guardar Cambios
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
