import { useState, useContext } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth";
import { InventoryContext } from "../../context/InventoryContext";
import addIcon from "../../assets/addIcon.png";
import PropertyInput from "./PropertyInput";
import PropertySpecs from "./PropertySpecs";
import Alert from "../Alert";

const CreateInventory = () => {
  const [productName, setProductName] = useState("");
  const [productStock, setProductStock] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [properties, setProperties] = useState([{ property: "", option: "" }]);
  const [alert, setAlert] = useState({ message: "", type: "", visible: false });

  const { user } = useAuth();
  const { reloadData } = useContext(InventoryContext);
  const db = getFirestore();

  const updatePropertyField = (index, field, value) => {
      setProperties((prev) => {
        const newProperties = [...prev];
        newProperties[index] = { ...newProperties[index], [field]: value };
        return newProperties;
      });
  };

  const createInput = () => {
    setProperties((prev) => [...prev, { property: "", option: "" }]);
  };

  const deleteInput = (index) => {
    if (properties.length > 1) {
      setProperties((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const normalizeString = (str) => str.toLowerCase().trim();

  const checkIfProductExists = async () => {
    if (!user) return false;

    // Construir la consulta con nombre del producto y propiedades
    const productQuery = collection(db, `users/${user.uid}/products`);

    // Consulta por nombre del producto (en minúsculas)
    let productQueryRef = query(
      productQuery,
      where("productName", "==", normalizeString(productName))
    );

    // Agregar condiciones para propiedades
    properties.forEach((p) => {
      if (p.property && p.option) {
        productQueryRef = query(
          productQueryRef,
          where(p.property, "==", normalizeString(p.option))
        );
      }
    });

    try {
      const querySnapshot = await getDocs(productQueryRef);
      // Verificar si hay documentos que coincidan
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Error checking product existence:", error);
      return false;
    }
  };

  const saveData = async () => {
    if (!user) {
      setAlert({
        message: "Usuario no autenticado",
        type: "error",
        visible: true,
      });
      return;
    }

    if (!productName || !productStock || !productPrice) {
      setAlert({
        message: "El nombre del producto, stock y precio son obligatorios",
        type: "error",
        visible: true,
      });
      return;
    }

    // Comprobar si el producto ya existe
    const productExists = await checkIfProductExists();

    if (productExists) {
      setAlert({
        message: "El producto ya existe en el inventario",
        type: "error",
        visible: true,
      });
      return;
    }

    const inputsObject = properties.reduce((acc, input) => {
      acc[input.property] = normalizeString(input.option);
      return acc;
    }, {});

    const productData = {
      productName: normalizeString(productName),
      productPrice: parseFloat(productPrice),
      productStock: parseInt(productStock, 10),
      toDo: 0,
      ...inputsObject,
    };

    const filteredProductData = Object.fromEntries(
      Object.entries(productData).filter(
        ([, value]) => value !== "" && value !== undefined && value !== null
      )
    );

    try {
      await addDoc(
        collection(db, `users/${user.uid}/products`),
        filteredProductData
      );
      setAlert({
        message: "Guardado correctamente",
        type: "success",
        visible: true,
      });
      setProductName("");
      setProductStock("");
      setProductPrice("");
      setProperties([{ property: "", option: "" }]);
      reloadData();
    } catch (error) {
      setAlert({
        message: "Error: " + error.message,
        type: "error",
        visible: true,
      });
    }
  };

  return (
    <div className="flex flex-col pb-28">
      <div className="flex-grow overflow-y-auto">
        {alert.visible && (
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert({ ...alert, visible: false })}
          />
        )}
        <div className="flex flex-col justify-center items-center p-3 w-full">
          <label htmlFor="product">Producto</label>
          <input
            className="border-1 border-solid border-black rounded-md shadow-inner p-2 shadow-slate-700"
            onChange={(event) => setProductName(event.target.value)}
            type="text"
            value={productName}
          />
        </div>
        {properties.map((input, index) => (
          <PropertyInput
            key={index}
            index={index}
            input={input}
            updatePropertyField={updatePropertyField}
            deleteInput={deleteInput}
            properties={properties}
          />
        ))}
        <div className="w-full flex justify-start items-start px-3">
          <button className="w-8 h-8 text-white rounded" onClick={createInput}>
            <img src={addIcon} alt="add-inputs" />
          </button>
        </div>
        <PropertySpecs
          setProductStock={setProductStock}
          setProductPrice={setProductPrice}
          productPrice={productPrice}
          productStock={productStock}
        />
        <hr className="bg-black h-[2px] w-3/4 mx-auto mt-5" />
        <div className="flex w-full justify-center">
          <button
            className="m-2 p-2 bg-success text-white rounded"
            onClick={saveData}
          >
            Crear
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateInventory;
