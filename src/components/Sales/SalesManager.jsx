// Hooks
import { useContext, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { v4 as uuidv4 } from "uuid";
import { Timestamp } from "firebase/firestore";

// Firestore

import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  query,
  getDocs,
  where,
} from "firebase/firestore";

// Context
import { InventoryContext } from "../../context/InventoryContext";

// Utilities
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";

// Icons
import editIcon from "../../assets/editIcon.png";
import sellIcon from "../../assets/sellIcon.svg";
import sellIconGray from "../../assets/sellIconGray.svg";
import cancelIcon from "../../assets/cancelIcon.png";

// Components
import Alert from "../Alert";

const SalesManager = () => {
  const context = useContext(InventoryContext);
  const { data } = context;

  const { user } = useAuth();
  const { reloadData } = useContext(InventoryContext);
  const db = getFirestore();

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

  const [enteredData, setEnteredData] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedDates, setSelectedDates] = useState({});
  const [openPickerId, setOpenPickerId] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);
  const [prices, setPrices] = useState({}); // Store prices by item id
  const [originalPrices, setOriginalPrices] = useState({}); // Store original prices
  const [alert, setAlert] = useState({
    message: "",
    subMessage: "",
    type: "",
    visible: false,
  });


  // UTILITIES ////////////////////

  const capitalizeFirstLetter = (string) => {
    if (typeof string !== 'string') {
      return string; // O devuelve el valor por defecto que prefieras
    }
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };


  const formatDate = (date) => {
    const d = date instanceof Timestamp ? date.toDate() : new Date(date);

    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0"); // Los meses son 0-indexados
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
  };

  //////////////////////////////// 

  const handleAddTag = (event) => {
    event.preventDefault();
    if (enteredData && !tags.includes(enteredData)) {
      setTags([...tags, enteredData]);
      setEnteredData("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const filterData = (data, tags) => {
    if (tags.length === 0) return data;
    return data.filter((item) => {
      return tags.every((tag) => {
        return Object.values(item).some((value) =>
          value.toString().toLowerCase().includes(tag.toLowerCase())
        );
      });
    });
  };

  const filteredData = filterData(data, tags);

  const handleSell = async (id) => {
    if (!user) {
      setAlert({
        message: "Usuario no autenticado",
        type: "error",
        visible: true,
      });
      return;
    }
  
    let selectedItem = data.find((item) => item.id === id);
  
    if (!selectedItem) {
      setAlert({
        message: "Producto no encontrado",
        type: "warning",
        visible: true,
      });
      return;
    }
  
    if (selectedItem.productStock < 1) {
      setAlert({
        message: "Stock insuficiente.",
        subMessage: "No se puede vender este producto.",
        type: "error",
        visible: true,
      });
      return;
    }
  
    // Reducir el stock localmente
    const updatedItem = {
      ...selectedItem,
      productStock: selectedItem.productStock - 1,
    };

    const saleDate = selectedDates[id] || new Date();
    const selectedItemToSell = {
      ...Object.fromEntries(
        Object.entries(updatedItem).filter(([key]) => key !== "productStock")
      ),
      date: Timestamp.fromDate(saleDate),
      productPrice: parseInt(prices[id]) || selectedItem.productPrice,
    };
  
    try {
      // Actualizar el stock en Firestore
      const docRef = doc(db, `users/${user.uid}/products`, id);
      await updateDoc(docRef, { productStock: updatedItem.productStock });
  
      // Verificar si ya existe una venta para este producto en la misma fecha con el mismo precio
      const salesQuery = query(
        collection(db, `users/${user.uid}/sales`),
        where("productName", "==", selectedItem.productName),
        where("date", "==", selectedItemToSell.date),
        where("productPrice", "==", selectedItemToSell.productPrice)
      );
      const salesSnapshot = await getDocs(salesQuery);
  
      if (!salesSnapshot.empty) {
        // Si existe un documento, actualizar el documento con la nueva cantidad
        const saleDocRef = doc(
          db,
          `users/${user.uid}/sales`,
          salesSnapshot.docs[0].id
        );
        const existingSale = salesSnapshot.docs[0].data();
        await updateDoc(saleDocRef, {
          quantity: (existingSale.quantity || 0) + 1,
        });
      } else {
        // Crear un nuevo documento de venta con un ID único
        await addDoc(collection(db, `users/${user.uid}/sales`), {
          ...selectedItemToSell,
          quantity: 1, // Cantidad vendida
          id: uuidv4(), // Generar un ID único para el documento de venta
        });
      }
  
      setAlert({
        message: "Venta agregada correctamente",
        type: "success",
        visible: true,
      });
  
      setTags([]);
      setEnteredData("");
      setSelectedDates({});
      setEditingItemId(null); // Reset the active editor
      setPrices({});
      setOriginalPrices({});
      reloadData();
    } catch (error) {
      setAlert({
        message: "Error al procesar la venta",
        type: "error",
        visible: true,
      });
    }
  };
  
  

  const toggleDatePicker = (id) => {
    setOpenPickerId((prevId) => (prevId === id ? null : id));
  };

  const handleDateChange = (date, id) => {
    setSelectedDates((prevDates) => ({
      ...prevDates,
      [id]: date,
    }));
    setOpenPickerId(null);
  };

  const handlePriceInput = (id) => {
    // Cancel the previous editing if a new item is being edited
    if (editingItemId !== null && editingItemId !== id) {
      handleCancelClick(editingItemId);
    }

    setEditingItemId(id);
    const selectedItem = data.find((item) => item.id === id);
    if (!prices[id]) {
      setOriginalPrices((prev) => ({
        ...prev,
        [id]: selectedItem.productPrice,
      }));
    }
    setPrices((prev) => ({
      ...prev,
      [id]: prices[id] || selectedItem.productPrice,
    }));
  };

  const handleChangePriceValue = (e, id) => {
    setPrices((prev) => ({ ...prev, [id]: e.target.value }));
  };

  const handleCancelClick = (id) => {
    setPrices((prev) => ({ ...prev, [id]: originalPrices[id] || "" }));
    setEditingItemId(null);
  };

  const renderProductDetails = (item) => {
    const filteredProperties = Object.entries(item)
      .filter(
        ([key]) =>
          ![
            "productName",
            "productStock",
            "productPrice",
            "id",
            "toDo",
          ].includes(key)
      )
      .sort(
        ([a], [b]) =>
          Object.keys(propertyLabels).indexOf(a) -
          Object.keys(propertyLabels).indexOf(b)
      );

    return (
      <div className="flex flex-col justify-start items-start">
        <h1 className="text-xl font-bold text-logo">{capitalizeFirstLetter(item.productName)}</h1>
        {filteredProperties.map(
          ([key, value]) =>
            value && (
              <h1 key={key}>
                <strong>{propertyLabels[key] || key}: </strong>
                {capitalizeFirstLetter(value)}
              </h1>
            )
        )}
      </div>
    );
  };

  return (
    <div className="pb-28">
      {alert.visible && (
        <Alert
          message={alert.message}
          subMessage={alert.subMessage}
          type={alert.type}
          onClose={() => setAlert({ ...alert, visible: false })}
        />
      )}

      <form
        onSubmit={handleAddTag}
        className="max-w-md mt-5 mx-auto w-4/5 mb-5"
      >
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-gray-900 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-khaki focus:border-khaki"
            placeholder="Ingresa algún tag..."
            value={enteredData}
            onChange={(e) => setEnteredData(e.target.value)}
            required
          />
        </div>
      </form>

      <div className="w-11/12 m-auto">
        <div className="flex flex-row gap-3 mb-3">
          {tags.map((tag, index) => (
            <div
              className="bg-black text-navbar font-semibold rounded-md w-fit p-2 bg-opacity-10"
              key={index}
            >
              <h3>
                {tag} <button onClick={() => handleRemoveTag(tag)}>x</button>
              </h3>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {filteredData.map((item) => (
            <div
              key={item.id}
              className="border-[1px] border-solid border-black rounded-xl shadow-lg shadow-gray-500 bg-opacity-45 bg-white px-3"
            >
              <div className="flex flex-row w-full justify-between items-start pt-3">
                <div className="w-3/4 flex flex-col justify-center items-start">
                  {renderProductDetails(item)}
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex flex-row items-start gap-2 border-b-[0.5px] border-r-[0.5px] border-black border-solid pr-1">
                    <h3 className="text-md font-semibold">
                      {propertyLabels.productPrice}:{" "}
                    </h3>
                    {editingItemId === item.id ? (
                      <div className="flex flex-row gap-1">
                        <input
                          onChange={(event) =>
                            handleChangePriceValue(event, item.id)
                          }
                          value={prices[item.id] || ""}
                          className="w-10 rounded-md"
                          type="text"
                        />
                        <button
                          className="text-sm"
                          onClick={() => handleCancelClick(item.id)}
                        >
                          <img
                            className="w-4"
                            src={cancelIcon}
                            alt="cancel-icon"
                          />
                        </button>
                      </div>
                    ) : (
                      <strong>€{prices[item.id] || item.productPrice}</strong>
                    )}
                  </div>
                  <div className="flex justify-end relative items-center gap-3">
                    <button
                      onClick={() => handlePriceInput(item.id)}
                      className="py-2"
                    >
                      <img className="w-5" src={editIcon} alt="edit-icon" />
                    </button>
                    <FaCalendarAlt
                      className="text-gray-600 cursor-pointer"
                      onClick={() => toggleDatePicker(item.id)}
                    />
                    {openPickerId === item.id && (
                      <div className="absolute top-8 right-0 z-10 bg-white p-2 shadow-lg">
                        <DatePicker
                          selected={selectedDates[item.id] || new Date()} // Usa la fecha actual por defecto
                          onChange={(date) => handleDateChange(date, item.id)}
                          inline
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    {item.productStock < 1 ? (
                      <button
                        onClick={() => handleSell(item.id)}
                        className="bg-opacity-75 rounded-sm text-black font-semibold"
                      >
                        <img
                          className="w-10"
                          src={sellIconGray}
                          alt="edit-icon"
                        />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSell(item.id)}
                        className="bg-opacity-75 rounded-sm text-black font-semibold"
                      >
                        <img className="w-10" src={sellIcon} alt="edit-icon" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-row items-center justify-between w-full pb-2">
                <div className="w-1/2 flex justify-start">
                  {selectedDates[item.id] && (
                    <h3 className="text-md font-semibold mt-2">
                      Fecha seleccionada:{" "}
                      {formatDate(selectedDates[item.id])}
                    </h3>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

SalesManager.propTypes = {
  children: PropTypes.node,
};

export default SalesManager;