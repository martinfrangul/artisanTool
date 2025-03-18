import { useState, useContext, useEffect } from "react";
import { DataContext } from "../../context/DataContext.jsx";
import deleteItemIcon from "/assets/deleteItemIcon.png";
import { useAuth } from "../../hooks/useAuth";
import Alert from "../Alert";
import CustomDatePicker from "../CustomDatePicker.jsx";
import "../../styles/SalesRegistry.css";
import ConfirmationPopup from "../ConfirmationPopup.jsx";

// FIREBASE
import { doc, deleteDoc } from "firebase/firestore";
import { database } from "../../../firebase/firebaseConfig";
import { Timestamp } from "firebase/firestore";


const SalesRegistry = () => {
  const context = useContext(DataContext);
  const { sellData, reloadData, propertyLabels } = context;
  const { user } = useAuth(); // Obtén el usuario actual

  // STATES
  const [alert, setAlert] = useState({ message: "", type: "", visible: false });
  const [isConfirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [filteredSellData, setFilteredSellData] = useState([]);
  const [confirmationPopupMessage, setConfirmationPopupMessage] = useState("");
  const [pendingAction, setPendingAction] = useState(null);


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
    const startDateObj = startDate instanceof Date ? new Date(startDate) : new Date(startDate);
    const endDateObj = endDate instanceof Date ? new Date(endDate) : new Date(endDate);
  
    // Ajustar `startDate` al inicio del día
    startDateObj.setHours(0, 0, 0, 0);
  
    // Ajustar `endDate` para incluir todo el día
    endDateObj.setHours(23, 59, 59, 999);
  
    // Filtrar los datos basados en el rango de fechas
    const filteredData = sellData.filter((item) => {
      const itemDate = item.date instanceof Timestamp ? item.date.toDate() : new Date(item.date);
      return itemDate >= startDateObj && itemDate <= endDateObj;
    });

  // Agrupar los datos filtrados
  const groupedData = filteredData.reduce((accumulator, current) => {
    if (typeof current.quantity === "undefined") {
      current.quantity = 1;
    }

    const properties = Object.keys(propertyLabels)
      .filter(key => key !== "date" && key !== "productStock" && key !== "id")
      .map(key => current[key])
      .join("-");

    const key = `${current.productName}-${formatDate(current.date)}-${current.productPrice}-${properties}`;

    if (!accumulator[key]) {
      accumulator[key] = {
        ...current,
        quantity: Number(current.quantity),
      };
    } else {
      accumulator[key].quantity += Number(current.quantity);
    }

    return accumulator;
  }, {});

  const groupedDataArray = Object.values(groupedData);

  // Ordenar los datos agrupados
  groupedDataArray.sort((a, b) => a.date.toDate() - b.date.toDate());

  setFilteredSellData(groupedDataArray);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [sellData, startDate, endDate]);


  useEffect(() => {
    // Añadir o quitar la clase no-scroll en el body
    if (isConfirmationModalVisible) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    // Limpiar la clase al desmontar el componente
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isConfirmationModalVisible]);

  const handleDelete = async (id) => {
    if (!user) return;

    try {
      const docRef = doc(database, `users/${user.uid}/sales`, id);
      await deleteDoc(docRef);
      setAlert({
        message: "Producto eliminado correctamente",
        type: "success",
        visible: true,
      });
      setConfirmationModalVisible(false);
      reloadData();
    } catch (error) {
      setAlert({
        message: "Error al eliminar la venta",
        type: "danger",
        visible: true,
      });
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
      <div className="flex flex-col w-8/12 justify-start gap-1 items-start border-r-[1px] border-solid border-black p-2">
        <div className="flex flex-col flex-wrap gap-x-4">
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

  const confirmDeleteItem = (id) => {
    setConfirmationModalVisible(true);
    setConfirmationPopupMessage(
      "¿Estás segure que deseas eliminar la venta?"
    );
    setPendingAction(() => () => handleDelete(id));
  };

  const handleConfirmation = (confirmed) => {
    if (confirmed && pendingAction) {
      pendingAction();
    }
    setConfirmationModalVisible(false);
    setPendingAction(null);
    setConfirmationPopupMessage("");
  };

  return (
    <div className="pb-28 md:pb-36">
      {alert.visible && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ ...alert, visible: false })}
        />
      )}

      <div className="flex flex-col justify-center items-center my-3 pb-3 gap-4">
        <div className="flex flex-row items-center gap-3">
          <div className="w-full">
            <CustomDatePicker
              selectedDate={startDate}
              onChange={(date) => {
                setStartDate(date);
                if (date > endDate) {
                  setEndDate(date);
                }
              }}
              startDate={startDate}
              endDate={endDate}
              selectsStart
              dateFormat="dd/MM/yyyy"
              showMonthYearPicker={false}
            />
          </div>
          <div className="w-full">
            <CustomDatePicker
              selectedDate={endDate}
              onChange={(date) => {
                if (date >= startDate) {
                  setEndDate(date);
                } else {
                  setEndDate(startDate);
                }
              }}
              startDate={startDate}
              endDate={endDate}
              selectsEnd
              minDate={startDate}
              dateFormat="dd/MM/yyyy"
              showMonthYearPicker={false}
            />
          </div>
        </div>
        {filteredSellData.length > 0 ? (
          filteredSellData.map((item) => (
            <div
              key={item.id}
              className="w-11/12 md:w-6/12 lg:w-4/12 flex flex-row justify-between items-start pb-5 p-2 border-[1px] border-solid border-black rounded-xl shadow-lg shadow-gray-500 bg-opacity-45 bg-white"
            >
              {isConfirmationModalVisible && (
                <ConfirmationPopup
                  handleConfirmation={handleConfirmation}
                  confirmationPopupMessage={confirmationPopupMessage}
                />
              )}
              <div className="flex flex-col items-start w-full">
                <div className="flex w-full items-end justify-between border-b-[1px] border-solid border-black">
                  <h1 className="text-xl text-wrap font-bold text-logo">
                    {capitalizeFirstLetter(item.productName)}
                  </h1>
                  <div className="flex items-center py-2">
                    <button
                      onClick={() => confirmDeleteItem(item.id)}
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
                <div className="w-full flex flex-row">
                  {renderProductDetails(item)}
                  <div className="flex flex-col w-4/12 gap-2 p-2">
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
