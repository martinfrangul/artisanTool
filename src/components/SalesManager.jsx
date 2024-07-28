import { useContext, useState } from "react";
import { InventoryContext } from "../context/InventoryContext";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";
import PropTypes from "prop-types";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";

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
      alert("Usuario no autenticado");
      return;
    }

    const selectedDate = selectedDates[id] || new Date(); // Usa la fecha seleccionada o la fecha actual por defecto
    let selectedItem = data.find((item) => item.id === id);
    selectedItem = { ...selectedItem, date: selectedDate.toLocaleDateString() };

    if (selectedItem) {
      try {
        await addDoc(collection(db, `users/${user.uid}/sales`), selectedItem);
        alert("Venta agregada correctamente");
        reloadData();
        setTags([]);
        setEnteredData("");
        setSelectedDates({})
      } catch (error) {
        alert("Error: " + error.message);
      }
    }
  };

  const handleDateChange = (date, id) => {
    setSelectedDates((prevDates) => ({
      ...prevDates,
      [id]: date,
    }));
    setOpenPickerId(null);
  };

  const renderProductDetails = (item) => {
    const filteredProperties = Object.entries(item)
      .filter(
        ([key]) =>
          !["productName", "productStock", "productPrice", "id"].includes(key)
      )
      .sort(
        ([a], [b]) =>
          Object.keys(propertyLabels).indexOf(a) -
          Object.keys(propertyLabels).indexOf(b)
      );

    return (
      <div className="flex flex-col justify-start items-start">
        <h1 className="text-xl font-bold text-logo">{item.productName}</h1>
        {filteredProperties.map(
          ([key, value]) =>
            value && (
              <h1 key={key}>
                <strong>{propertyLabels[key] || key}: </strong>
                {value}
              </h1>
            )
        )}
      </div>
    );
  };

  return (
    <div>
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
              aria-hidden="true"
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

        <div>
          {filteredData.map((item) => (
            <div
              key={item.id}
              className="border-b-[1px] border-solid border-black"
            >
              <div className="flex flex-row w-full justify-between items-start pt-3">
                <div className="w-1/2 flex flex-col justify-center items-start">
                  {renderProductDetails(item)}
                </div>
                <div className="flex flex-col items-end">
                  <h3 className="text-md font-semibold">
                    {propertyLabels.productPrice}:{" "}
                    <strong>€{item.productPrice}</strong>
                  </h3>
                  <button
                    onClick={() => handleSell(item.id)}
                    className="bg-success bg-opacity-75 px-2 py-1 rounded-md text-white font-semibold"
                  >
                    Vender
                  </button>
                </div>
              </div>
              <div className="flex flex-row items-center justify-between w-full pb-3">
                <div className="w-1/2 flex justify-start">
                  {selectedDates[item.id] && (
                    <h3 className="text-md font-semibold mt-2">
                      Fecha seleccionada:{" "}
                      {selectedDates[item.id].toLocaleDateString()}
                    </h3>
                  )}
                </div>
                <div className="flex justify-end relative mt-2">
                  <FaCalendarAlt
                    className="text-gray-600 cursor-pointer"
                    onClick={() => setOpenPickerId(item.id)}
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
