import { useState, useContext, useEffect } from "react";
import { DataContext } from "../../context/DataContext.jsx";
import deleteItemIcon from "/assets/deleteItemIcon.png";
import { useAuth } from "../../hooks/useAuth";
import Alert from "../Alert";
import CustomDatePicker from "../CustomDatePicker.jsx";
import "../../styles/SalesRegistry.css";
import ConfirmationPopup from "../ConfirmationPopup.jsx";
import DeleteQuantityPopup from "./DeleteQuantityPopup.jsx";

// FIREBASE
import {
  doc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { database } from "../../../firebase/firebaseConfig";
import { Timestamp } from "firebase/firestore";

const SalesRegistry = () => {
  const context = useContext(DataContext);
  const { sellData, reloadData, propertyLabels } = context;
  const { user } = useAuth();

  // STATES
  const [alert, setAlert] = useState({ message: "", type: "", visible: false });
  const [isConfirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [filteredSellData, setFilteredSellData] = useState([]);
  const [confirmationPopupMessage, setConfirmationPopupMessage] = useState("");
  const [pendingAction, setPendingAction] = useState(null);
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);
  const [selectedItemForDelete, setSelectedItemForDelete] = useState(null);
  const [singleDeleteConfirmationVisible, setSingleDeleteConfirmationVisible] =
    useState(false);
  const [singleDeleteDocId, setSingleDeleteDocId] = useState(null);

  const salesRegistryPropertyLabels = {
    ...propertyLabels,
    date: "Fecha",
    quantity: "Cantidad",
  };
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
  /// HOOKS /////////////
  // useEffect para filtrar los datos de ventas según el rango de fechas
  // y agruparlos por propiedades
  useEffect(() => {
    const startDateObj =
      startDate instanceof Date ? new Date(startDate) : new Date(startDate);
    const endDateObj =
      endDate instanceof Date ? new Date(endDate) : new Date(endDate);

    // Ajustar `startDate` al inicio del día
    startDateObj.setHours(0, 0, 0, 0);

    // Ajustar `endDate` para incluir todo el día
    endDateObj.setHours(23, 59, 59, 999);

    // Filtrar los datos basados en el rango de fechas
    const filteredData = sellData.filter((item) => {
      const itemDate =
        item.date instanceof Timestamp
          ? item.date.toDate()
          : new Date(item.date);
      return itemDate >= startDateObj && itemDate <= endDateObj;
    });

    // Agrupar los datos filtrados
    const groupedData = filteredData.reduce((accumulator, current) => {
      if (typeof current.quantity === "undefined") {
        current.quantity = 1;
      }

      const properties = Object.keys(salesRegistryPropertyLabels)
        .filter(
          (key) => key !== "date" && key !== "productStock" && key !== "id"
        )
        .map((key) => current[key])
        .join("-");

      const key = `${current.productName}-${formatDate(current.date)}-${
        current.productPrice
      }-${properties}`;

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

  // useEffect para manejar la clase no-scroll en el body
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

  // Función para eliminar múltiples ventas
  const handleDeleteConfirmed = async (quantityToDelete) => {
    if (!user || !selectedItemForDelete) return;

    try {
      const docsToDelete = selectedItemForDelete.matchingDocs.slice(
        0,
        quantityToDelete
      );

      const deletePromises = docsToDelete.map((docSnap) =>
        deleteDoc(doc(database, `users/${user.uid}/sales`, docSnap.id))
      );

      await Promise.all(deletePromises);

      setAlert({
        message: "Ventas eliminadas correctamente",
        type: "success",
        visible: true,
      });

      reloadData();
    } catch (err) {
      console.error(err);
      setAlert({
        message: "Error al eliminar las ventas",
        type: "danger",
        visible: true,
      });
    } finally {
      setDeletePopupVisible(false);
      setSelectedItemForDelete(null);
    }
  };

  // Función para renderizar los detalles específicos del producto
  const renderProductDetails = (item) => {
    const includedKeys = Object.keys(salesRegistryPropertyLabels).filter(
      (key) =>
        !["productName", "productPrice", "quantity", "date"].includes(key)
    );
  
    const orderedProperties = includedKeys
      .map((key) => [key, item[key]])
      .filter(([_, value]) => value) // eliminamos valores falsy (null, undefined, etc.)
      .sort(([keyA], [keyB]) => {
        const indexA = Object.keys(salesRegistryPropertyLabels).indexOf(keyA);
        const indexB = Object.keys(salesRegistryPropertyLabels).indexOf(keyB);
        return indexA - indexB;
      });
  
    return (
      <div className="flex flex-col w-8/12 justify-start gap-1 items-start border-r-[1px] border-solid border-black p-2">
        <div className="flex flex-col flex-wrap gap-x-4">
          {orderedProperties.map(([key, value]) => (
            <h4 className="text-md flex flex-row gap-1" key={key}>
              <strong>{salesRegistryPropertyLabels[key] || capitalizeFirstLetter(key)}:</strong>
              <div className="break-all">{capitalizeFirstLetter(value)}</div>
            </h4>
          ))}
        </div>
      </div>
    );
  };

  
  // Función para mostrar el popup de confirmación de eliminación
  // y buscar los documentos coincidentes en Firestore
  const confirmDeleteItem = async (item) => {
    if (!user) return;

    const salesRef = collection(database, `users/${user.uid}/sales`);
    let allMatchingDocs = [];

    // Paso 1: query por los campos básicos
    let q;

    if (item.dateString) {
      q = query(
        salesRef,
        where("productName", "==", item.productName),
        where("productPrice", "==", item.productPrice),
        where("dateString", "==", item.dateString)
      );
    } else {
      q = query(
        salesRef,
        where("productName", "==", item.productName),
        where("productPrice", "==", item.productPrice)
      );
    }

    const snapshot = await getDocs(q);

    // Paso 2: normalizar la fecha para comparación manual
    const itemDate =
      item.date instanceof Timestamp ? item.date.toDate() : new Date(item.date);

    // Paso 3: filtrar por igualdad total (día exacto y propiedades iguales)
    allMatchingDocs = snapshot.docs.filter((docSnap) => {
      const docData = docSnap.data();
      const docDate = docData.date.toDate();

      const sameDay =
        docDate.getFullYear() === itemDate.getFullYear() &&
        docDate.getMonth() === itemDate.getMonth() &&
        docDate.getDate() === itemDate.getDate();

      // Comparar todas las propiedades (excepto las que cambian)
      const sameProps = Object.keys(item).every((key) => {
        if (["id", "quantity", "date", "dateString"].includes(key)) return true;
        return item[key] === docData[key];
      });

      return sameDay && sameProps;
    });

    // Mostrar el popup adecuado
    if (allMatchingDocs.length === 1) {
      setSingleDeleteDocId(allMatchingDocs[0].id);
      setSingleDeleteConfirmationVisible(true);
    } else if (allMatchingDocs.length > 1) {
      setSelectedItemForDelete({ ...item, matchingDocs: allMatchingDocs });
      setDeletePopupVisible(true);
    } else {
      setAlert({
        message: "No se encontraron ventas coincidentes",
        type: "warning",
        visible: true,
      });
    }
  };

  // Función para confirmar la eliminación de una sola venta
  const handleSingleDeleteConfirmed = async (confirmed) => {
    if (!confirmed || !singleDeleteDocId) {
      setSingleDeleteConfirmationVisible(false);
      setSingleDeleteDocId(null);
      return;
    }

    try {
      await deleteDoc(
        doc(database, `users/${user.uid}/sales`, singleDeleteDocId)
      );
      setAlert({
        message: "Venta eliminada correctamente",
        type: "success",
        visible: true,
      });
      reloadData();
    } catch (err) {
      console.error("Error al eliminar:", err);
      setAlert({
        message: "Error al eliminar la venta",
        type: "danger",
        visible: true,
      });
    }

    setSingleDeleteConfirmationVisible(false);
    setSingleDeleteDocId(null);
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

      {deletePopupVisible && selectedItemForDelete && (
        <DeleteQuantityPopup
          maxQuantity={selectedItemForDelete.quantity}
          onCancel={() => {
            setDeletePopupVisible(false);
            setSelectedItemForDelete(null);
          }}
          onConfirm={handleDeleteConfirmed}
        />
      )}

      {singleDeleteConfirmationVisible && (
        <ConfirmationPopup
          confirmationPopupMessage="¿Estás segure que deseas eliminar la venta?"
          handleConfirmation={handleSingleDeleteConfirmed}
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
                      onClick={() => confirmDeleteItem(item)}
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
                        {salesRegistryPropertyLabels.date}:{" "}
                        <strong>{formatDate(item.date)}</strong>
                      </h3>
                    </div>
                    <div className="flex flex-col gap-3">
                      <h3 className="text-sm font-semibold">
                        {salesRegistryPropertyLabels.productPrice}:{" "}
                        <strong>€{item.productPrice}</strong>
                      </h3>
                    </div>
                    <div className="flex flex-col gap-3">
                      <h3 className="text-sm font-semibold">
                        {salesRegistryPropertyLabels.quantity}:{" "}
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
