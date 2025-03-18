import { useState, useContext, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";

// CONTEXT
import { DataContext } from "../../context/DataContext";

// ICONOS
import deleteItemIcon from "/assets/deleteItemIcon.png";
import editIcon from "/assets/editIcon.png";
import checkAllIcon from "/assets/checkAllIcon.png";
import acceptIcon from "/assets/acceptIcon.png";

// FIREBASE
import { doc, deleteDoc, updateDoc, writeBatch } from "firebase/firestore";
import { database } from "../../../firebase/firebaseConfig";

// COMPONENTS
import EditProduct from "./EditProduct";
import Alert from "../Alert";
import ConfirmationPopup from "../ConfirmationPopup";
import Summary from "./Summary";
import CustomCheckbox from "../CustomCheckbox";

const Inventory = () => {
  const context = useContext(DataContext);
  const { inventoryData, reloadData, propertyLabels} = context;
  const { user } = useAuth(); // Obtén el usuario actual

  const initialSortProperty =
    localStorage.getItem("sortProperty") || "productName";
  const initialSecondarySortProperty =
    localStorage.getItem("secondarySortProperty") || "productName";
  const [sortProperty, setSortProperty] = useState(initialSortProperty);
  const [secondarySortProperty, setSecondarySortProperty] = useState(
    initialSecondarySortProperty
  );
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalSummaryVisible, setIsModalSummaryVisible] = useState(false);
  const [idForEdit, setIdForEdit] = useState("");
  const [alert, setAlert] = useState({ message: "", type: "", visible: false });
  const [isConfirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [confirmationPopupMessage, setConfirmationPopupMessage] = useState("");
  const [tempToDo, setTempToDo] = useState({}); // Estado para manejar el valor temporal del input
  const [toDoOnlyChecked, setToDoOnlyChecked] = useState(false);

 useEffect(() => {
    // Añadir o quitar la clase no-scroll en el body
    if (isConfirmationModalVisible || isModalSummaryVisible) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    // Limpiar la clase al desmontar el componente
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isConfirmationModalVisible, isModalSummaryVisible]);

  // Sincronizar el estado `tempToDo` con `inventoryData`
  useEffect(() => {
    const updatedToDo = {};
    inventoryData.forEach((item) => {
      updatedToDo[item.id] = item.toDo;
    });
    setTempToDo(updatedToDo);
  }, [inventoryData]);

  // Coge las propiedades disponibles
  const getAvailableProperties = () => {
    const properties = new Set();
    inventoryData.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (
          key !== "id" &&
          key !== "productName" &&
          key !== "productStock" &&
          key !== "productPrice" &&
          key !== "toDo"
        ) {
          properties.add(key);
        }
      });
    });
    return Array.from(properties);
  };

  // Coge las propiedades
  const availableProperties = [
    "productName",
    "productStock",
    "productPrice",
    ...getAvailableProperties(),
  ];

  const capitalizeFirstLetter = (string) => {
    if (typeof string !== "string") {
      return string;
    }
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const handleDelete = async (id) => {
    if (!user) return;

    try {
      const docRef = doc(database, `users/${user.uid}/products`, id);
      await deleteDoc(docRef);
      reloadData(); // Recarga los datos después de eliminar
      setAlert({
        message: "Producto eliminado correctamente",
        type: "success",
        visible: true,
      });
    } catch (error) {
      console.error("Error al eliminar el producto: ", error);
    }
  };

  const renderProductDetails = (item) => {
    // Filtrar las propiedades para excluir 'productName', 'productStock' y 'productPrice'
    const filteredProperties = Object.entries(item).filter(
      ([key]) =>
        key !== "productName" &&
        key !== "productStock" &&
        key !== "productPrice" &&
        key !== "id" &&
        key !== "toDo"
    );

    const orderedProperties = filteredProperties.sort(([keyA], [keyB]) => {
      const indexA = Object.keys(propertyLabels).indexOf(keyA);
      const indexB = Object.keys(propertyLabels).indexOf(keyB);
      return indexA - indexB;
    });

    return (
      <div className="flex flex-col justify-start items-start">
        <h1 className="text-xl font-bold text-logo">
          {capitalizeFirstLetter(item.productName)}
        </h1>

        {orderedProperties.map(([key, value]) =>
          value ? (
            <h1 key={key}>
              <strong>
                {propertyLabels[key] || capitalizeFirstLetter(key)}:{" "}
              </strong>
              {capitalizeFirstLetter(value)}
            </h1>
          ) : null
        )}
      </div>
    );
  };

  const handleModalToggle = (closeModal) => {
    setModalVisible(closeModal);
  };

  const openEditModal = (id) => {
    setIdForEdit(id);
    setModalVisible(true);
  };

  const handleToDoOnlyCheckboxChange = () => {
    setToDoOnlyChecked((prev) => !prev);
  };

  // MÉTODO SORT QUE ORDENA SEGÚN UN CRITERIO PRIMARIO Y UNO SECUNDARIO TENIENDO EN CUENTA TILDES
  // Y LLEVANDO AL FONDO DE CADA CRITERIO SI NO TIENE LA PROPIEDAD A FILTRAR

  const sortedData = inventoryData.slice().sort((a, b) => {
    // Obtén los valores para los criterios primarios y secundarios
    const aPrimary = a[sortProperty] !== undefined ? a[sortProperty] : "";
    const bPrimary = b[sortProperty] !== undefined ? b[sortProperty] : "";
    const aSecondary =
      a[secondarySortProperty] !== undefined ? a[secondarySortProperty] : "";
    const bSecondary =
      b[secondarySortProperty] !== undefined ? b[secondarySortProperty] : "";

    // Comparar los valores del criterio primario
    if (aPrimary === "" && bPrimary !== "") {
      return 1; // Mueve los elementos sin valor del criterio primario al final
    } else if (bPrimary === "" && aPrimary !== "") {
      return -1; // Mueve los elementos sin valor del criterio primario al final
    } else {
      let primaryComparison;
      if (typeof aPrimary === "string" && typeof bPrimary === "string") {
        primaryComparison = aPrimary.localeCompare(bPrimary);
      } else {
        primaryComparison =
          aPrimary < bPrimary ? -1 : aPrimary > bPrimary ? 1 : 0;
      }
      if (primaryComparison !== 0) return primaryComparison;
    }

    // Comparar los valores del criterio secundario
    if (aSecondary === "" && bSecondary !== "") {
      return 1; // Mueve los elementos sin valor del criterio secundario al final
    } else if (bSecondary === "" && aSecondary !== "") {
      return -1; // Mueve los elementos sin valor del criterio secundario al final
    } else {
      if (typeof aSecondary === "string" && typeof bSecondary === "string") {
        return aSecondary.localeCompare(bSecondary);
      } else {
        return aSecondary < bSecondary ? -1 : aSecondary > bSecondary ? 1 : 0;
      }
    }
  });

   // Filtrar los productos que tienen un to-do mayor que 0
   const toDoOnly = sortedData.filter((item) => item.toDo > 0);

   // Datos a renderizar. Si `toDoOnlyChecked` es verdadero, renderiza solo los productos con to-do mayor que 0. Si no, renderiza los datos ordenados sin filtro.
   const dataToRender = toDoOnlyChecked ? toDoOnly : sortedData;
   

  // Maneja el cambio en la propiedad de orden y la agrega al localStorage para que perdure
  const handleSortChange = (event) => {
    const newSortProperty = event.target.value;
    setSortProperty(newSortProperty);
    localStorage.setItem("sortProperty", newSortProperty);
  };

  const handleSecondarySortChange = (event) => {
    const newSecondarySortProperty = event.target.value;
    setSecondarySortProperty(newSecondarySortProperty);
    localStorage.setItem("secondarySortProperty", newSecondarySortProperty);
  };

  // Actualiza el TODO en la base de datos
  const saveToDo = async (id, value) => {
    if (!user) return;
    try {
      const docRef = doc(database, `users/${user.uid}/products`, id);
      await updateDoc(docRef, {
        toDo: value === "" ? 0 : parseInt(value),
      });
      reloadData();
    } catch (error) {
      console.error("Error al editar el to-do del producto: ", error);
    }
  };

  const confirmResolveAllTodos = () => {
    setConfirmationModalVisible(true);
    setConfirmationPopupMessage(
      "¿Estás seguro que deseas agregar todos los productos al stock?"
    );
    setPendingAction(() => resolveAllTodos);
  };

  const confirmDeleteItem = (id) => {
    setConfirmationModalVisible(true);
    setConfirmationPopupMessage(
      "¿Estás seguro que deseas eliminar el producto?"
    );
    setPendingAction(() => () => handleDelete(id));
  };

  const resolveAllTodos = async () => {
    if (!user) {
      setAlert({
        message: "Usuario no autenticado",
        type: "error",
        visible: true,
      });

      return;
    }

    // Crear una transacción para actualizar todos los documentos
    const batch = writeBatch(database);

    try {
      // Actualizar el stock en Firestore
      inventoryData.forEach((item) => {
        if (item.toDo > 0) {
          const docRef = doc(database, `users/${user.uid}/products`, item.id);
          batch.update(docRef, {
            productStock: item.productStock + item.toDo,
            toDo: 0,
          });
        }
      });

      await batch.commit();
      reloadData();
    } catch (error) {
      setAlert({
        message: "Error al resolver los productos",
        type: "error",
        visible: true,
      });
    }
  };

  const handleConfirmation = (confirmed) => {
    if (confirmed && pendingAction) {
      pendingAction();
    }
    setConfirmationModalVisible(false);
    setPendingAction(null);
    setConfirmationPopupMessage("");
  };

  const resolveToDo = async (id) => {
    if (!user) {
      setAlert({
        message: "Usuario no autenticado",
        type: "error",
        visible: true,
      });

      return;
    }

    let selectedItem = inventoryData.find((item) => item.id === id);

    if (!selectedItem) {
      setAlert({
        message: "Producto no encontrado",
        type: "error",
        visible: true,
      });

      return;
    }

    const updatedItem = {
      ...selectedItem,
      productStock: selectedItem.productStock + selectedItem.toDo,
      toDo: 0,
    };

    try {
      // Actualizar el stock en Firestore
      const docRef = doc(database, `users/${user.uid}/products`, id);
      await updateDoc(docRef, updatedItem);
      reloadData();
    } catch (error) {
      setAlert({
        message: "Error al editar el item",
        type: "error",
        visible: true,
      });
    }
  };

  const handleInputChange = async (id, value) => {
    if (value === "") return;

    // Actualiza el estado local
    setTempToDo((prev) => ({ ...prev, [id]: value }));

    // Guarda el valor en la base de datos de inmediato
    await saveToDo(id, value);
  };

  const handleSummaryModal = () => {
    setIsModalSummaryVisible(true);
  };

  return (
    <div className="w-11/12 md:w-7/12 lg:w-6/12 xl:w-5/12 m-auto pb-28 md:pb-36">
      {alert.visible && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ ...alert, visible: false })}
        />
      )}
      {isModalVisible && (
        <EditProduct
          productIdForEdit={idForEdit}
          handleModalToggle={handleModalToggle}
        />
      )}
      {isModalSummaryVisible && (
        <Summary setIsModalSummaryVisible={setIsModalSummaryVisible} />
      )}
      {isConfirmationModalVisible && (
        <ConfirmationPopup
          handleConfirmation={handleConfirmation}
          confirmationPopupMessage={confirmationPopupMessage}
        />
      )}
      {/* Dropdown para seleccionar la propiedad de orden */}
      <div className="flex flex-row justify-end items-center mt-3 border-b-[1px] border-solid border-black pb-3">
        <div className="flex w-1/12 md:w-0"></div>
        <div className="w-8/12 md:w-9/12 lg:w-11/12 flex justify-center">
          <div className="w-full flex flex-col md:flex-row justify-center gap-3">
            <div className="flex flex-row items-center justify-end h-fit">
              <label className="px-3" htmlFor="sort-property">
                Ordenar por:
              </label>
              <select
                className="p-1 rounded-md shadow-md shadow-gray-500 h-fit"
                id="sort-property"
                onChange={handleSortChange}
                value={sortProperty}
              >
                {availableProperties.map((property) => (
                  <option key={property} value={property}>
                    {propertyLabels[property] || property}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-row items-center justify-end h-fit">
              <label className="px-3" htmlFor="secondary-sort-property">
                Luego por:
              </label>
              <select
                className="p-1 rounded-md shadow-md shadow-gray-500 h-fit"
                id="secondary-sort-property"
                onChange={handleSecondarySortChange}
                value={secondarySortProperty}
              >
                {availableProperties.map((property) => (
                  <option key={property} value={property}>
                    {propertyLabels[property] || property}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          className="flex w-3/12 md:w-2/12 lg:w-1/12 justify-end"
          onClick={confirmResolveAllTodos}
        >
          <div className="rounded-full bg-success w-12 h-12 flex justify-center items-center">
            <img className="w-8" src={checkAllIcon} alt="check-all-icon" />
          </div>
        </button>
      </div>
      <div className="flex justify-center w-full gap-5 p-2 border-b-[1px] border-solid border-black bg-white bg-opacity-35">
        <div className="flex flex-row items-center justify-center gap-2 text-center">
          <h3 className="text-sm font-semibold">To-do only:</h3>
          <CustomCheckbox
            checked={toDoOnlyChecked} // Estado manejado externamente
            onChange={handleToDoOnlyCheckboxChange}
          />
        </div>
        <button
          onClick={() => handleSummaryModal()}
          className="flex justify-center p-1 text-sm items-center bg-banner border-[1px] border-solid border-black rounded-md shadow-lg shadow-gray-500"
        >
          Resumen
        </button>
      </div>

      {dataToRender.length > 0 ? (
        dataToRender.map((item) => (
          <div
            key={item.id}
            className="flex flex-row justify-between items-start pb-5 px-2 pt-2 border-b-[1px] border-solid border-black"
          >
            <div className="flex flex-col justify-start items-start">
              {renderProductDetails(item)}
            </div>

            <div className="flex flex-row gap-6 items-center">
              <div className="min-w-24 flex flex-col gap-3">
                <h3 className="text-md font-semibold">
                  {propertyLabels.productStock}:{" "}
                  <strong>{item.productStock}</strong>
                </h3>
                <h3 className="text-md font-semibold">
                  {propertyLabels.productPrice}:{" "}
                  <strong>€{item.productPrice}</strong>
                </h3>
                <div className="flex flex-row gap-1">
                  <label htmlFor={`to-do-${item.id}`}>Hacer:</label>
                  <input
                    onClick={(e) => e.target.select()}
                    onChange={(e) => handleInputChange(item.id, e.target.value)}
                    className="w-8 rounded-md text-center bg-slate-100 ring-1 ring-black focus:ring-1 focus:outline-0 custom-input-appearance"
                    id={`to-do-${item.id}`}
                    type="number"
                    value={
                      tempToDo[item.id] !== undefined
                        ? tempToDo[item.id]
                        : item.toDo
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col justify-end items-center gap-2">
                <button
                  onClick={() => resolveToDo(item.id)}
                  className="flex justify-center items-center bg-success w-8 h-8 rounded-full border-[1px] border-solid border-black shadow-lg shadow-gray-500"
                >
                  <img className="w-3" src={acceptIcon} alt="edit-icon" />
                </button>
                <button
                  onClick={() => openEditModal(item.id)}
                  className="flex justify-center items-center bg-banner w-8 h-8 rounded-full border-[1px] border-solid border-black shadow-lg shadow-gray-500"
                >
                  <img className="w-3" src={editIcon} alt="edit-icon" />
                </button>
                <button
                  onClick={() => confirmDeleteItem(item.id)}
                  className="flex justify-center items-center bg-danger w-8 h-8 rounded-full border-[0.5px] border-solid border-black shadow-lg shadow-gray-500"
                >
                  <img className="w-3" src={deleteItemIcon} alt="delete-icon" />
                </button>
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
  );
};

export default Inventory;
