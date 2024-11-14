import { useContext, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Timestamp } from "firebase/firestore";
import { motion } from "framer-motion";

// FIREBASE
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  runTransaction,
} from "firebase/firestore";

// CONTEXT
import { DataContext } from "../../context/DataContext";

// UTILITIES
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import "../../styles/SalesManager.css";

// ICONS
import editIcon from "/assets/editIcon.png";
import sellIcon from "/assets/sellIcon.svg";
import sellIconGray from "/assets/sellIconGray.svg";
import cancelIcon from "/assets/cancelIcon.png";
import editPriceIcon from "/assets/price-tag-euro.png";

// COMPONENTS
import Alert from "../Alert";
import Loading from "../Loading";

const SalesManager = () => {
  const context = useContext(DataContext);
  const { reloadData, inventoryData } = context;

  const { user } = useAuth();
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

  const fadeInOutVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  // STATES

  const [enteredData, setEnteredData] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedDates, setSelectedDates] = useState({});
  const [openPickerId, setOpenPickerId] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);
  const [prices, setPrices] = useState({});
  const [originalPrices, setOriginalPrices] = useState({});
  const [alert, setAlert] = useState({
    message: "",
    subMessage: "",
    type: "",
    visible: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [quantity, setQuantity] = useState(1); // Estado para la cantidad
  const [isLoading, setIsLoading] = useState(false);

  ///////////// UTILITIES ////////////////////

  const capitalizeFirstLetter = (string) =>
    typeof string === "string"
      ? string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
      : string;

  const formatDate = (date) => {
    const d = date instanceof Timestamp ? date.toDate() : new Date(date);

    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0"); // Los meses son 0-indexados
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
  };

  ////////////////////////////////////////////

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

  const filteredData = filterData(inventoryData, tags);

  const handleSell = async (id) => {
    setIsLoading(true);

    if (quantity < 1) {
      setAlert({
        message: "La cantidad no puede ser inferior a 1",
        type: "warning",
        visible: true,
      });
      setIsLoading(false);
      setQuantity(1);
      return;
    }

    if (!user) {
      setAlert({
        message: "Usuario no autenticado",
        type: "error",
        visible: true,
      });
      setIsLoading(false);
      return;
    }

    let selectedItem = inventoryData.find((item) => item.id === id);

    if (!selectedItem) {
      setAlert({
        message: "Producto no encontrado",
        type: "warning",
        visible: true,
      });
      setIsLoading(false);
      return;
    }

    if (selectedItem.productStock < quantity) {
      const subMessage =
        selectedItem.productStock === 0
          ? "No hay stock"
          : `Solo quedan ${selectedItem.productStock} unidades en stock.`;

      setAlert({
        message: "Stock insuficiente.",
        subMessage,
        type: "error",
        visible: true,
      });
      setIsLoading(false);
      setQuantity(1);
      return;
    }

    const saleDate = selectedDates[id] || new Date();
    const saleDateTimestamp = Timestamp.fromDate(saleDate);
    const salePrice = parseInt(prices[id]) || selectedItem.productPrice;

    try {
      await runTransaction(db, async (transaction) => {
        // Referencia al documento de producto en Firestore
        const productDocRef = doc(db, `users/${user.uid}/products`, id);

        // Obtener el documento de producto actual dentro de la transacción
        const productDoc = await transaction.get(productDocRef);
        if (!productDoc.exists()) {
          throw new Error("El producto no existe");
        }

        // Reducir el stock
        const newStock = productDoc.data().productStock - quantity;
        if (newStock < 0) {
          setIsLoading(false);
          throw new Error("Stock insuficiente para completar la venta");
          setQuantity(1);
        }
        transaction.update(productDocRef, { productStock: newStock });

        // Crear múltiples documentos de venta dentro de la transacción
        for (let i = 0; i < quantity; i++) {
          const saleDocRef = await addDoc(
            collection(db, `users/${user.uid}/sales`),
            {
              ...Object.fromEntries(
                Object.entries(selectedItem).filter(
                  ([key]) => key !== "productStock" && key !== "toDo"
                )
              ),
              date: saleDateTimestamp,
              productPrice: salePrice,
            }
          );

          // Actualizar el campo `id` en cada documento de venta
          transaction.update(saleDocRef, { id: saleDocRef.id });
        }
      });

      setAlert({
        message: "Ventas agregadas correctamente",
        type: "success",
        visible: true,
      });

      // Resetear los estados después de la venta
      setTags([]);
      setEnteredData("");
      setIsEditing(false);
      setSelectedDates({});
      setEditingItemId(null);
      setPrices({});
      setOriginalPrices({});
      setQuantity(1); // Restablecer cantidad a 1
      reloadData();
    } catch (error) {
      console.error("Error al procesar la venta:", error);
      setAlert({
        message: "Error al procesar la venta",
        type: "error",
        visible: true,
      });
    } finally {
      setIsLoading(false);
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
    // Cancelar la edición previa si hay uno que se está editando
    if (editingItemId !== null && editingItemId !== id) {
      handleCancelClick(editingItemId);
    }

    setEditingItemId(id);
    const selectedItem = inventoryData.find((item) => item.id === id);
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

  const handleEditProperties = () => {
    setIsEditing(!isEditing);
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
        <h1 className="text-xl font-bold text-logo">
          {capitalizeFirstLetter(item.productName)}
        </h1>
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
    <div className="pb-28 md:pb-36">
      <Loading isLoading={isLoading} />
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

      <div className="w-11/12 md:w-6/12 lg:w-5/12 xl:w-4/12 m-auto">
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
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div
                key={item.id}
                className="border-[1px] border-solid border-black rounded-xl shadow-lg shadow-gray-500 bg-opacity-45 bg-white px-3"
              >
                <div className="flex flex-row w-full justify-between items-start pt-3">
                  <div className="w-1/2 flex flex-col justify-center items-start">
                    {renderProductDetails(item)}
                  </div>
                  <div className="flex flex-col items-end w-1/2">
                    <div className="flex flex-row gap-2" id="priceAndEditIcon">
                      <div className="flex flex-row items-start gap-2 border-b-[0.5px] border-r-[0.5px] border-gray-500 border-solid p-[3px] shadow-gray-700 shadow-sm rounded-md">
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
                                className="w-5 lg:w-10"
                                src={cancelIcon}
                                alt="cancel-icon"
                              />
                            </button>
                          </div>
                        ) : (
                          <strong>
                            €{prices[item.id] || item.productPrice}
                          </strong>
                        )}
                      </div>
                      <button>
                        <img
                          onClick={handleEditProperties}
                          src={editIcon}
                          alt="edit-icon"
                          className="w-5 lg:w-5"
                        />
                      </button>
                    </div>
                    <h3 className="font-semibold text-sm text-gray-500">
                      Stock: <strong> {item.productStock}</strong>
                    </h3>
                    <div className="flex flex-col">
                      <div className="flex justify-end">
                        {item.productStock < 1 ? (
                          <button
                            onClick={() => handleSell(item.id)}
                            className="bg-opacity-75 rounded-sm text-black font-semibold"
                          >
                            <img
                              className="w-10"
                              src={sellIconGray}
                              alt="sell-icon-grey"
                            />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSell(item.id)}
                            className="bg-opacity-75 rounded-sm text-black font-semibold"
                          >
                            <img
                              className="w-10"
                              src={sellIcon}
                              alt="sell-icon"
                            />
                          </button>
                        )}
                      </div>
                      {isEditing && (
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={fadeInOutVariants}
                          transition={{ duration: 0.3 }}
                          className="flex justify-end relative items-center gap-3"
                        >
                          <div className="flex flex-row gap-2 justify-center items-center">
                            <label className="text-xs" htmlFor="quantity">
                              Cantidad:
                            </label>
                            <input
                              id="quantity"
                              value={quantity}
                              type="number"
                              placeholder="1"
                              onChange={(e) =>
                                setQuantity(parseInt(e.target.value))
                              }
                              className="w-8 border-[0.5px] border-black border-solid rounded-md text-center custom-input-appearance"
                            />
                          </div>
                          <button
                            onClick={() => handlePriceInput(item.id)}
                            className="py-2"
                          >
                            <img
                              className="w-5"
                              src={editPriceIcon}
                              alt="edit-icon"
                            />
                          </button>
                          <FaCalendarAlt
                            className="text-gray-600 cursor-pointer"
                            onClick={() => toggleDatePicker(item.id)}
                          />
                          {openPickerId === item.id && (
                            <div className="absolute top-8 right-0 z-10 bg-white p-2 shadow-lg">
                              <DatePicker
                                selected={selectedDates[item.id] || new Date()} // Usa la fecha actual por defecto
                                onChange={(date) =>
                                  handleDateChange(date, item.id)
                                }
                                inline
                              />
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-between w-full pb-2">
                  <div className="w-1/2 flex justify-start">
                    {selectedDates[item.id] && (
                      <h3 className="text-md font-semibold mt-2">
                        Fecha seleccionada: {formatDate(selectedDates[item.id])}
                      </h3>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full flex justify-center">
              <p>No hay datos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesManager;
