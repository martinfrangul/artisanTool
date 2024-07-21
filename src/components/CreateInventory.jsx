import { useState } from "react";
import app from "../../firebase/firebaseConfig";
import { getDatabase, ref, set, push } from "firebase/database";
import addIcon from "../assets/addIcon.png";
import "../styles/CreateInventory.css";
import Navbar from "./Navbar";
import Banner from "./Banner";
import { motion } from "framer-motion";

const CreateInventory = () => {
  // USESTATE
  const [productName, setProductName] = useState("");
  const [productStock, setProductStock] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [properties, setProperties] = useState([{ property: "", option: "" }]);
  // const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  // useEffect(() => {
  //   const handleResize = () => {
  //     // Aquí asumimos que si la altura de la ventana se reduce significativamente, el teclado está abierto
  //     if (window.innerHeight < 500) {
  //       setIsKeyboardOpen(true);
  //     } else {
  //       setIsKeyboardOpen(false);
  //     }
  //   };

  //   window.addEventListener("resize", handleResize);

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);

  // SUBMIT DATA
  const saveData = () => {
    if (!productName) {
      alert("El nombre del producto es obligatorio.");
      return; // Salir de la función si productName está vacío
    }

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
      ...(productPrice && { productPrice }), // Incluye productPrice solo si no está vacío
      ...(productStock && { productStock }), // Incluye productStock solo si no está vacío
      ...inputsObject,
    };

    const filteredProductData = Object.fromEntries(
      Object.entries(productData).filter(
        ([key, value]) => key && value !== undefined && value !== ""
      )
    );
    console.log("Datos a guardar:", productData); // Imprime los datos para verificar

    set(newProductRef, filteredProductData)
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
    <div className="min-h-screen w-full flex flex-col justify-between">
      <div>
        <Banner></Banner>
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

        <div className="flex flex-col justify-around h-full">
          <div className="w-1/2 flex flex-row justify-center items-center p-3 m-auto">
            <div className="flex flex-col justify-center items-center">
              <label htmlFor="product">Initial stock</label>
              <input
                className="custom-input-appearance w-1/2 border-1 border-solid border-black rounded-md p-2 shadow-inner shadow-slate-700"
                onChange={(event) => setProductStock(event.target.value)}
                type="number"
                value={productStock}
              />
            </div>
            <div className="flex flex-col justify-center items-center">
              <label htmlFor="product">Price</label>
              <input
                className="custom-input-appearance w-1/2 border-1 border-solid border-black rounded-md p-2 shadow-inner shadow-slate-700"
                onChange={(event) => setProductPrice(event.target.value)}
                type="number"
                value={productPrice}
              />
            </div>
          </div>
        </div>
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
      {/* Línea divisoria */}

      <div className="mt-auto">
        {/* {!isKeyboardOpen && ( */}
        {/* <motion.div */}
        <div className="mx-auto mb-4 w-[90%] rounded-xl shadow-xl shadow-slate-700 bg-gray-800 text-white p-3">
          {/* initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }} */}
          {/* > */}
          <Navbar></Navbar>
          {/* </motion.div> */}
          {/* )} */}
        </div>
      </div>
    </div>
  );
};

export default CreateInventory;
