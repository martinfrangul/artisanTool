import { useState, useContext } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc
} from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth";
import { DataContext } from "../../context/DataContext";
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
  const { reloadData } = useContext(DataContext);
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

    try {
      const productQuery = collection(db, `users/${user.uid}/products`);
      
      // Consulta para obtener productos con el mismo nombre
      const baseQuery = query(
        productQuery,
        where("productName", "==", normalizeString(productName))
      );

      const baseQuerySnapshot = await getDocs(baseQuery);
      const existingProducts = baseQuerySnapshot.docs.map(doc => doc.data());

      // Si no hay productos con el mismo nombre, el producto no existe
      if (existingProducts.length === 0) {
        return false;
      }

      // Verifica si hay un producto con el mismo nombre y propiedades opcionales
      const hasSameNameAndProperties = existingProducts.some(product => {
        const productProperties = Object.keys(product).filter(key => key !== "productName" && key !== "productPrice" && key !== "productStock" && key !== "toDo");
        const formProperties = properties.reduce((acc, p) => {
          if (p.property) {
            acc[p.property] = normalizeString(p.option);
          }
          return acc;
        }, {});

        // Compara el nombre del producto
        const hasSameName = product.productName === normalizeString(productName);

        // Compara las propiedades opcionales
        const hasSameProperties = productProperties.every(p => formProperties[p] === product[p]) && Object.keys(formProperties).length === productProperties.length;

        return hasSameName && hasSameProperties;
      });

      return hasSameNameAndProperties;

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
  
    if (!productName || productStock === "" || !productPrice) {
      setAlert({
        message: "El nombre del producto, stock y precio son obligatorios",
        type: "error",
        visible: true,
      });
      return;
    }
  
    // Si `productStock` es una cadena vacía, conviértelo en 0
    const stock = productStock === "" ? 0 : parseInt(productStock, 10);
    
    // Asegúrate de que `stock` es un número y no un NaN
    if (isNaN(stock)) {
      setAlert({
        message: "Stock debe ser un número válido",
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
      productStock: stock,
      toDo: 0,
      ...inputsObject,
    };
  
    const filteredProductData = Object.fromEntries(
      Object.entries(productData).filter(
        ([, value]) => value !== "" && value !== undefined && value !== null
      )
    );
  
    try {
      // Añadir el producto a Firestore
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/products`),
        filteredProductData
      );

      // Obtener el ID del documento y actualizar el documento con el ID
      await updateDoc(doc(db, `users/${user.uid}/products`, docRef.id), {
        id: docRef.id
      });
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
            className="m-2 p-2 bg-success text-black rounded"
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
