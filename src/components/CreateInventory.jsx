import { useState } from "react";
import app from "../../firebase/firebaseConfig";
import '../styles/CreateInventory.css'
import { getDatabase, ref, set, push } from "firebase/database";
import addIcon from "../assets/addIcon.png";
import Navbar from "./Navbar";
import Banner from "./Banner";
import PropertyInput from "./PropertyInput";
import PropertySpecs from "./PropertySpecs";

const CreateInventory = () => {
  // USESTATE
  const [productName, setProductName] = useState("");
  const [productStock, setProductStock] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [properties, setProperties] = useState([{ property: "", option: "" }]);

  // SUBMIT DATA
  const saveData = () => {

    // CHECK INPUT VALIDITY


    if (!productName) {
      alert("El nombre del producto es obligatorio.");
      return;
    }

    if (!productPrice) {
      alert("El precio inicial es obligatorio.");
      return;
    }

    if (!productStock) {
      alert("El stock inicial es obligatorio.");
      return;
    }

    // POST IN DB

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
  console.log(properties);

  const createInput = () => {
    setProperties((prev) => [...prev, { property: "", option: "" }]);
  };

  const deleteInput = (index) => {
    if (properties.length > 1) {
      setProperties((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleInputChange = (index, field, value) => {
    setProperties((prev) =>
      prev.map((input, i) =>
        i === index ? { ...input, [field]: value } : input
      )
    );
  };

  return (
    <div className="min-h-screen w-full flex flex-col">
      <div className="flex-grow overflow-y-auto">
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
          <PropertyInput
            key={index}
            index={index}
            input={input}
            handleInputChange={handleInputChange}
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


        ></PropertySpecs>
        
        {/* Línea divisoria */}

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

      {/* <div className="mt-auto "> */}
      <div className="flex-shrink-0 bg-gray-800 text-white p-3 mx-auto w-[90%] rounded-xl shadow-xl shadow-slate-700 my-4">
        <Navbar></Navbar>
      </div>
    </div>
  );
};

export default CreateInventory;
