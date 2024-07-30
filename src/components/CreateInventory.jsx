import { useState, useContext } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth"; // Importa el hook personalizado
import { InventoryContext } from "../context/InventoryContext"; // Importa el contexto
import addIcon from "../assets/addIcon.png";
import PropertyInput from "./PropertyInput";
import PropertySpecs from "./PropertySpecs";

const CreateInventory = () => {
  const [productName, setProductName] = useState("");
  const [productStock, setProductStock] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [properties, setProperties] = useState([{ property: "", option: "" }]);

  const { user } = useAuth(); // Obtén el usuario actual
  const { reloadData } = useContext(InventoryContext); // Obtén la función reloadData del contexto
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

  const saveData = async () => {
    if (!user) {
      alert("User is not authenticated");
      return;
    }

    if (!productName || isNaN(!productPrice) || isNaN(!productStock)) {
      alert("Nombre, precio y stock son obligatorios");
      return;
    }

    const inputsObject = properties.reduce((acc, input) => {
      acc[input.property] = input.option;
      return acc;
    }, {});

    const productData = {
      productName,
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
      await addDoc(collection(db, `users/${user.uid}/products`), filteredProductData);
      alert("Guardado correctamente");
      setProductName("");
      setProductStock("");
      setProductPrice("");
      setProperties([{ property: "", option: "" }]);
      reloadData(); // Llama a reloadData para recargar el inventario
    } catch (error) {
      alert("Error: " + error);
    }
  };

  return (
    <div className="flex flex-col pb-28">
      <div className="flex-grow overflow-y-auto">
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
          />
        ))}
        <div className="w-full flex justify-start items-start px-3">
          <button
            className="w-8 h-8 text-white rounded"
            onClick={createInput}
          >
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
