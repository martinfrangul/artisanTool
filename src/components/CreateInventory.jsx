import { useState } from "react";
import { database } from "../../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import addIcon from "../assets/addIcon.png";
import PropertyInput from "./PropertyInput";
import PropertySpecs from "./PropertySpecs";

const CreateInventory = () => {
  const [productName, setProductName] = useState("");
  const [productStock, setProductStock] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [properties, setProperties] = useState([{ property: "", option: "" }]);

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
    if (!productName || !productPrice || !productStock) {
      alert("Nombre, precio y stock son obligatiorios");
      return;
    }

    const inputsObject = properties.reduce((acc, input) => {
      acc[input.property] = input.option;
      return acc;
    }, {});


    // Convertir productPrice y productStock a números
    const price = parseFloat(productPrice);
    const stock = parseInt(productStock, 10);

    if (isNaN(price) || isNaN(stock)) {
      alert("El precio y el stock deben ser números válidos");
      return;
    }

    const productData = {
      productName,
      productPrice: price,
      productStock: stock,
      ...inputsObject,
    };

    const filteredProductData = Object.fromEntries(
      Object.entries(productData).filter(
        ([, value]) => value !== "" && value !== undefined && value !== null
      )
    );


    try {
      await addDoc(collection(database, "products"), filteredProductData);
      alert("Guardado correctamente");
      setProductName("");
      setProductStock("");
      setProductPrice("");
      setProperties([{ property: "", option: "" }]);
    } catch (error) {
      alert("Error: " + error);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex-grow overflow-y-auto">
        <div className="flex flex-col justify-center items-center p-3 w-full">
          <label htmlFor="product">Product</label>
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
        <button
          className="p-2 w-10 h-10 text-white rounded"
          onClick={createInput}
        >
          <img src={addIcon} alt="add-inputs" />
        </button>
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
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateInventory;
