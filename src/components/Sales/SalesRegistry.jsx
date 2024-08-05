import { useState, useContext, useEffect } from "react";
import { SellContext } from "../../context/SellContext.jsx";
import deleteItemIcon from "../../assets/deleteItemIcon.png";
import { doc, deleteDoc } from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth";
import { database } from "../../../firebase/firebaseConfig";
import Alert from "../Alert";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Timestamp } from "firebase/firestore";
import "../../styles/SalesRegistry.css"

// Map of readable names
const propertyLabels = {
  design: "Diseño",
  size: "Tamaño",
  color: "Color",
  type: "Tipo",
  model: "Modelo",
  productName: "Producto",
  productStock: "Stock",
  productPrice: "Precio",
  date: "Fecha",
  quantity: "Cantidad",
};

const SalesRegistry = () => {
  const context = useContext(SellContext);
  const { sellData, reloadData } = context;
  const { user } = useAuth(); // Obtén el usuario actual

  // STATES
  const [alert, setAlert] = useState({ message: "", type: "", visible: false });
  const [isConfirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [filteredSellData, setFilteredSellData] = useState([]);
  // const [sortedFilteredSellData, setSortedFilteredSellData] = useState([]);

  ////// UTILITIES ///////

  const capitalizeFirstLetter = (string) => {
    if (typeof string !== "string") {
      return string;
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

  ////////////////////////

  useEffect(() => {
    const newFilteredSellData = sellData.filter((item) => {
      const itemDate = formatDate(item.date);
      return (
        itemDate >= formatDate(startDate) && itemDate <= formatDate(endDate)
      );
    });

    newFilteredSellData.sort((a, b) => a.date.toDate() - b.date.toDate());
    
    setFilteredSellData(newFilteredSellData);
  }, [sellData, startDate, endDate]);



  useEffect(() => {
    // Añadir o quitar la clase no-scroll en el body
    if (isConfirmationModalVisible) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    // Limpiar la clase al desmontar el componente
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isConfirmationModalVisible]);

  const handleDelete = async (id) => {
    if (!user) return;

    try {
      const docRef = doc(database, `users/${user.uid}/sales`, id);
      await deleteDoc(docRef);
      reloadData(); // Recarga los datos después de eliminar
      setAlert({
        message: "Producto eliminado correctamente",
        type: "success",
        visible: true,
      });
      setConfirmationModalVisible(false);
    } catch (error) {
      console.error("Error al eliminar la venta: ", error);
    }
    setConfirmationModalVisible(false);
  };

  const renderProductDetails = (item) => {
    // Filtrar las propiedades para excluir 'productName', 'productStock', 'productPrice', 'id' y 'toDo'
    const filteredProperties = Object.entries(item).filter(
      ([key]) =>
        ![
          "productName",
          "productStock",
          "productPrice",
          "id",
          "toDo",
          "date",
          "quantity",
        ].includes(key)
    );

    const orderedProperties = filteredProperties.sort(([keyA], [keyB]) => {
      const indexA = Object.keys(propertyLabels).indexOf(keyA);
      const indexB = Object.keys(propertyLabels).indexOf(keyB);
      return indexA - indexB;
    });

    return (
      <div className="flex flex-col w-1/2 justify-start gap-1 items-start border-r-[1px] border-solid border-black">
        <div className="flex flex-wrap gap-x-4">
          {orderedProperties.map(([key, value]) =>
            value ? (
              <h4 className="text-md flex flex-row gap-1" key={key}>
                <strong>
                  {propertyLabels[key] || capitalizeFirstLetter(key)}:
                </strong>
                <div className="break-all">{capitalizeFirstLetter(value)}</div>
              </h4>
            ) : null
          )}
        </div>
      </div>
    );
  };

  const confirmDeleteItem = () => {
    setConfirmationModalVisible(true);
  };

  const handleConfirmation = (confirmed, id) => {
    if (confirmed) {
      handleDelete(id);
    } else {
      setConfirmationModalVisible(false);
    }
  };

  return (
    <div className="pb-28">
      {alert.visible && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ ...alert, visible: false })}
        />
      )}
      {isConfirmationModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-5 rounded-md shadow-lg w-[90%]">
            <h2 className="text-lg font-bold">Confirmación</h2>
            <p>¿Estás seguro de que deseas eliminar el producto?</p>
            <div className="mt-4 flex gap-4">
              <button
                onClick={() => handleConfirmation(true)}
                className="btn btn-success"
              >
                Aceptar
              </button>
              <button
                onClick={() => handleConfirmation(false)}
                className="btn btn-danger"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col justify-center items-center my-3 pb-3 gap-4">
        <div className="flex flex-row items-center gap-3">
          <div className="w-full">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="dd/MM/yyyy"
              className="p-2 rounded-md shadow-md shadow-gray-500 w-24 text-sm font-semibold text-gray-700 bg-banner"
            />
          </div>
          <div className="w-full">
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              dateFormat="dd/MM/yyyy"
              className="p-2 rounded-md shadow-md shadow-gray-500 w-24 text-sm font-semibold text-gray-700 bg-banner" 
            />
          </div>
        </div>
        {filteredSellData.length > 0 ? (
          filteredSellData.map((item, index) => (
            <div
              key={item.id || index}
              className="w-[95%] flex flex-row justify-between items-start pb-5 p-2 border-[1px] border-solid border-black rounded-xl shadow-lg shadow-gray-500 bg-opacity-45 bg-white"
            >
              <div className="flex flex-col items-start w-full">
                <div className="flex w-full items-end justify-between border-b-[1px] border-solid border-black">
                  <h1 className="text-xl text-wrap font-bold text-logo">
                    {capitalizeFirstLetter(item.productName)}
                  </h1>
                  <div className="flex items-center py-2">
                    <button
                      onClick={confirmDeleteItem}
                      className="flex justify-center items-center bg-danger w-7 h-7 rounded-full border-[0.5px] border-solid border-black shadow-lg shadow-gray-500"
                    >
                      <img
                        className="w-3"
                        src={deleteItemIcon}
                        alt="delete-icon"
                      />
                    </button>
                  </div>
                </div>
                <div className="w-full flex flex-row p-1">
                  {renderProductDetails(item)}
                  <div className="flex flex-col w-1/2 gap-2 p-1">
                    <div className="flex flex-col">
                      <h3 className="text-sm font-semibold">
                        {propertyLabels.date}:{" "}
                        <strong>{formatDate(item.date)}</strong>
                      </h3>
                    </div>
                    <div className="flex flex-col gap-3">
                      <h3 className="text-sm font-semibold">
                        {propertyLabels.productPrice}:{" "}
                        <strong>€{item.productPrice}</strong>
                      </h3>
                    </div>
                    <div className="flex flex-col gap-3">
                      <h3 className="text-sm font-semibold">
                        {propertyLabels.quantity}:{" "}
                        <strong>{item.quantity}</strong>
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No hay datos</p>
        )}
      </div>
    </div>
  );
};

export default SalesRegistry;
