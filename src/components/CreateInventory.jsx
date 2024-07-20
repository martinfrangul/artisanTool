import { useState, useEffect } from "react";
import app from "../../firebase/firebaseConfig";
import { getDatabase, ref, set, push } from "firebase/database";
import logoSimple from "../assets/Artisan Tool MERGED sin sombra (logo 1).png";
import addIcon from "../assets/addIcon.png"
import "../styles/CreateInventory.css";
import Navbar from "./Navbar";
import { motion } from "framer-motion";

const CreateInventory = () => {
  // USESTATE
  const [productName, setProductName] = useState("");
  const [productStock, setProductStock] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [properties, setProperties] = useState([{ property: "", option: "" }]);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // Aquí asumimos que si la altura de la ventana se reduce significativamente, el teclado está abierto
      if (window.innerHeight < 500) {
        setIsKeyboardOpen(true);
      } else {
        setIsKeyboardOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // SUBMIT DATA
  const saveData = () => {
    const db = getDatabase(app);
    const productsRef = ref(db, "products");
    const newProductRef = push(productsRef); // Crear un nuevo ID único para cada producto

    // Transformar los inputs a un objeto con propiedades dinámicas
    const inputsObject = properties.reduce((acc, input) => {
      acc[input.property] = input.option;
      return acc;
    }, {});

    const productData = {
      productName: productName,
      productPrice: productPrice,
      productStock: productStock,
      ...inputsObject,
    };

    set(newProductRef, productData)
      .then(() => {
        alert("Guardado correctamente");
        // RESET
        // LIMPIO LOS INPUTS Y DEJO SÓLO PRODUCTO Y UN PAR DE PROPIEDAD Y OPCIÓN
        setProductName("");
        setProductStock("");
        setProductPrice("");
        setProperties([{ property: "", option: "" }]);
      })
      .catch((error) => {
        alert("Error: " + error);
      });
  };

  const createInputs = () => {
    setProperties((prev) => [...prev, { property: "", option: "" }]);
  };

  const handleInputChange = (index, field, value) => {
    setProperties((prev) =>
      prev.map((input, i) =>
        i === index ? { ...input, [field]: value } : input
      )
    );
  };

  return (
    <div className="h-screen w-full">
      <div className="flex justify-center w-full bg-banner rounded-t-2xl">
        <img
          className="flex justify-center w-44 items-center"
          src={logoSimple}
          alt="logo-artisan-tool"
        />
      </div>
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
        <div
          className="flex flex-row gap-4 p-2 justify-center items-center"
          key={index}
        >
          <div className="flex flex-col justify-center items-center p-3 gap-2 w-1/2">
            <label htmlFor="property">Property</label>
            <input
              id="property"
              className="border-1 border-solid border-black rounded-md shadow-inner p-2 shadow-slate-700"
              onChange={(event) =>
                handleInputChange(index, "property", event.target.value)
              }
              type="text"
              value={input.property}
            />
          </div>
          <div className="flex flex-col justify-center items-center p-3 gap-2 w-1/2">
            <label htmlFor="option">Option</label>
            <input
              id="option"
              className="border-1 border-solid border-black rounded-md shadow-inner p-2 shadow-slate-700"
              onChange={(event) =>
                handleInputChange(index, "option", event.target.value)
              }
              type="text"
              value={input.option}
            />
          </div>
        </div>
      ))}
          <button
            className="p-2 w-10 h-10 text-white rounded"
            onClick={createInputs}
          >
            <img src={addIcon} alt="add-inputs" />
          </button>
      <hr className="bg-black h-[2px] w-3/4 m-auto mt-5" />
      <div className="w-1/2 flex flex-row justify-center items-center p-3 m-auto">
        <div className="flex flex-col justify-center items-center">
          <label htmlFor="product">Initial stock</label>
          <input
            className="w-1/2 border-1 border-solid border-black rounded-md shadow-inner shadow-slate-700"
            onChange={(event) => setProductStock(event.target.value)}
            type="number"
            value={productStock}
          />
        </div>
        <div className="flex flex-col justify-center items-center">
          <label htmlFor="product">Price</label>
          <input
            className=" w-1/2 border-1 border-solid border-black rounded-md shadow-inner shadow-slate-700"
            onChange={(event) => setProductPrice(event.target.value)}
            type="number"
            value={productPrice}
          />
        </div>
      </div>

<div className="flex w-full justify-center">
          <button
            className="m-2 p-2 bg-success text-white rounded"
            onClick={saveData}
          >
            Create
          </button>
    
</div>
      {!isKeyboardOpen && (
        <motion.div
          className="fixed bottom-0 left-1/2 w-[90%] rounded-xl shadow-xl shadow-slate-700 mb-5 bg-gray-800 text-white p-3 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Navbar></Navbar>
        </motion.div>
      )}
    </div>
  );
};

export default CreateInventory;
