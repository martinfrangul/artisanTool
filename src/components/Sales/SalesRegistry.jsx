import { useState, useContext, useEffect } from "react";
import { DataContext } from "../../context/DataContext.jsx";
import deleteItemIcon from "../../assets/deleteItemIcon.png";
import { useAuth } from "../../hooks/useAuth";
import Alert from "../Alert";
import CustomDatePicker from "../CustomDatePicker.jsx";
import "../../styles/SalesRegistry.css";

// FIREBASE
import { doc, deleteDoc } from "firebase/firestore";
import { database } from "../../../firebase/firebaseConfig";
import { Timestamp } from "firebase/firestore";

// Mapa de nombre de propiedes mejorado
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
  const context = useContext(DataContext);
  const { sellData, reloadData } = context;
  const { user } = useAuth(); // Obtén el usuario actual

  // STATES
  const [alert, setAlert] = useState({ message: "", type: "", visible: false });
  const [isConfirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [filteredSellData, setFilteredSellData] = useState([]);
  const [confirmationId, setConfirmationId] = useState(null); // Estado para el ID del ítem a eliminar

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
    // Filtrar las ventas dentro del rango de fechas
    const filteredData = sellData.filter((item) => {
      const itemDate = formatDate(item.date);
      return (
        itemDate >= formatDate(startDate) && itemDate <= formatDate(endDate)
      );
    });

    // Agrupar datos por combinación de fecha y precio, y acumular cantidades
    const groupedData = filteredData.reduce((accumulator, current) => {
      // Asegurar que el objeto actual tiene una propiedad quantity
      if (typeof current.quantity === "undefined") {
        current.quantity = 1; // Asignamos 1 si no tiene quantity
      }

      // Crear una clave única para el agrupamiento
      // Aquí usamos una combinación de id, fecha y precio para la clave
      const key = `${current.productName}-${formatDate(current.date)}-${
        current.productPrice
      }`;

      if (!accumulator[key]) {
        // Si no existe la clave, inicializar el objeto
        accumulator[key] = {
          ...current,
          quantity: Number(current.quantity),
        };
      } else {
        // Si ya existe, acumular la cantidad
        accumulator[key].quantity += Number(current.quantity);
      }

      return accumulator;
    }, {});

    // Convertir el objeto agrupado en un array
    const groupedDataArray = Object.values(groupedData);

    // Ordenar los datos por fecha
    groupedDataArray.sort((a, b) => a.date.toDate() - b.date.toDate());

    setFilteredSellData(groupedDataArray);
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
      setConfirmationId(null); // Resetear el ID de confirmación
      setConfirmationModalVisible(false);
      reloadData();
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

  const confirmDeleteItem = (id) => {
    setConfirmationId(id); // Establecer el ID del ítem a eliminar
    setConfirmationModalVisible(true);
  };

  const handleConfirmation = (confirmed) => {
    if (confirmed && confirmationId) {
      handleDelete(confirmationId); // Pasar el ID almacenado
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
              className="w-[95%] flex flex-row justify-between items-start pb-5 p-2 border-[1px] border-solid border-black rounded-xl shadow-lg shadow-gray-500 bg-opacity-45 bg-white"
            >
              {isConfirmationModalVisible && confirmationId === item.id && (
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
