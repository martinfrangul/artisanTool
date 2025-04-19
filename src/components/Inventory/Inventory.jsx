import { useState, useContext, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

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
import SortSelector from "../SortSelector";
import FilterWithTags from "../FilterWithTags";

const Inventory = () => {
  const context = useContext(DataContext);
  const { inventoryData, reloadData, propertyLabels } = context;
  const { user } = useAuth(); // Obtén el usuario actual

  const initialSortProperty =
    localStorage.getItem("sortProperty") || "productName";
  const initialSecondarySortProperty =
    localStorage.getItem("secondarySortProperty") || "productName";
  const [sortProperty, setSortProperty] = useState(initialSortProperty);
  const [secondarySortProperty, setSecondarySortProperty] = useState(
    initialSecondarySortProperty
  );
  const [filteredData, setFilteredData] = useState([]); // Filtramos los datos
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalSummaryVisible, setIsModalSummaryVisible] = useState(false);
  const [idForEdit, setIdForEdit] = useState("");
  const [alert, setAlert] = useState({ message: "", type: "", visible: false });
  const [isConfirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [confirmationPopupMessage, setConfirmationPopupMessage] = useState("");
  const [tempToDo, setTempToDo] = useState({}); // Estado para manejar el valor temporal del input
  const [filters, setFilters] = useState({
    tags: [],
    toDoOnlyChecked: false,
    sortProperty: initialSortProperty,
    secondarySortProperty: initialSecondarySortProperty,
  });
  // Estados para manejar el estado de guardado y error de los inputs
  const [savedStatus, setSavedStatus] = useState({});
  const [errorStatus, setErrorStatus] = useState({});

  // Utilitarios para mejoras en la UX de los inputs de toDo
  const [userTypedZero, setUserTypedZero] = useState({});
  const [hideZeroUntilBlur, setHideZeroUntilBlur] = useState({});
  const [inputHasFocus, setInputHasFocus] = useState({});

  //Ref para manejar los timeouts de guardado de los inputs
  const saveTimeouts = useRef({});

  useEffect(() => {
    // Filtrar los datos según los filtros actuales
    const filterByTags = (data, tags) => {
      return data.filter((item) =>
        tags.every((tag) => {
          const cleanedTag = tag.trim().toLowerCase();
          return Object.values(item).some((value) =>
            value.toString().toLowerCase().includes(cleanedTag)
          );
        })
      );
    };

    let dataToDisplay = inventoryData;

    // Primero, aplicamos el filtro por tags si hay tags seleccionados
    if (filters.tags.length > 0) {
      dataToDisplay = filterByTags(dataToDisplay, filters.tags);
    }

    // Luego, aplicamos el filtro `toDoOnly` si está activado
    if (filters.toDoOnlyChecked) {
      dataToDisplay = dataToDisplay.filter((item) => item.toDo > 0);
    }

    // Ordenar los productos después de aplicar ambos filtros
    dataToDisplay = dataToDisplay.slice().sort((a, b) => {
      const aPrimary =
        a[filters.sortProperty] !== undefined ? a[filters.sortProperty] : "";
      const bPrimary =
        b[filters.sortProperty] !== undefined ? b[filters.sortProperty] : "";
      const aSecondary =
        a[filters.secondarySortProperty] !== undefined
          ? a[filters.secondarySortProperty]
          : "";
      const bSecondary =
        b[filters.secondarySortProperty] !== undefined
          ? b[filters.secondarySortProperty]
          : "";

      let primaryComparison;
      // Si no tienen valor en el campo de orden, deben ir al final
      if (aPrimary === "" && bPrimary !== "") return 1; // Mover a al final
      if (bPrimary === "" && aPrimary !== "") return -1; // Mover b al final

      if (typeof aPrimary === "string" && typeof bPrimary === "string") {
        primaryComparison = aPrimary.localeCompare(bPrimary);
      } else {
        primaryComparison =
          aPrimary < bPrimary ? -1 : aPrimary > bPrimary ? 1 : 0;
      }
      if (primaryComparison !== 0) return primaryComparison;

      // Comparar los valores del criterio secundario
      if (aSecondary === "" && bSecondary !== "") return 1; // Mover a al final
      if (bSecondary === "" && aSecondary !== "") return -1; // Mover b al final
      return aSecondary < bSecondary ? -1 : aSecondary > bSecondary ? 1 : 0;
    });

    setFilteredData(dataToDisplay); // Actualizamos el estado de los productos filtrados
  }, [inventoryData, filters]); // Dependencias: inventoryData y los filtros

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

  //Limpia los timeouts al desmontar el componente
  useEffect(() => {

    const timeouts = saveTimeouts.current;

    return () => {
      Object.values(timeouts).forEach(clearTimeout);
    };
  }, []);

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

  const handleToDoOnlyCheckboxChange = () => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      toDoOnlyChecked: !prevFilters.toDoOnlyChecked,
    }));
  };

  const handleModalToggle = (closeModal) => {
    setModalVisible(closeModal);
  };

  const openEditModal = (id) => {
    setIdForEdit(id);
    setModalVisible(true);
  };

  // Actualiza el TODO en la base de datos
  const saveToDo = async (id, value, options = {}) => {
    const { userTypedZero = false, hasFocus = false } = options;

    if (!user) return;

    const originalItem = inventoryData.find((item) => item.id === id);
    if (!originalItem) return;

    const currentToDo = originalItem.toDo;

    // Evitamos guardar si no hubo cambios
    if (value === currentToDo) return;

    try {
      const docRef = doc(database, `users/${user.uid}/products`, id);
      await updateDoc(docRef, { toDo: value });

      reloadData();

      /**
       *  Mostrar "✓ Guardado" solo si:
       *
       * - Se guardó un número distinto de 0        (valor !== 0)
       * - O el usuario escribió el 0 a mano        (userTypedZero)
       * - O el input ya perdió el foco             (!hasFocus)
       *
       * Esto evita mostrar el mensaje si se guarda un 0 automático
       * mientras el usuario aún está pensando o editando.
       */
      const shouldShowSavedMessage = value !== 0 || userTypedZero || !hasFocus;

      if (shouldShowSavedMessage) {
        setSavedStatus((prev) => ({ ...prev, [id]: true }));
        setTimeout(() => {
          setSavedStatus((prev) => ({ ...prev, [id]: false }));
        }, 1500);
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      setErrorStatus((prev) => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setErrorStatus((prev) => ({ ...prev, [id]: false }));
      }, 1500);
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
    if (!user || inventoryData.length === 0) return;

    // 1. Cancelar cualquier timeout pendiente de guardado automático
    if (saveTimeouts.current[id]) {
      clearTimeout(saveTimeouts.current[id]);
      saveTimeouts.current[id] = null;
    }

    // 2. Obtener el valor más reciente del input (sin esperar guardado en Firebase)
    const latestToDoRaw = tempToDo[id];
    if (latestToDoRaw === undefined) return;

    const latestToDo = parseInt(latestToDoRaw);
    if (isNaN(latestToDo) || latestToDo <= 0) return;

    // 3. Obtener el producto actual desde el inventario
    const selectedItem = inventoryData.find((item) => item.id === id);
    if (!selectedItem) return;

    try {
      // 4. Crear el nuevo objeto con el stock actualizado y toDo en 0
      const updatedItem = {
        productStock: selectedItem.productStock + latestToDo,
        toDo: 0,
      };

      const docRef = doc(database, `users/${user.uid}/products`, id);
      await updateDoc(docRef, updatedItem);

      // 5. Actualizar el estado local del input para reflejar el cambio
      setTempToDo((prev) => ({
        ...prev,
        [id]: 0,
      }));

      // 6. Limpiar cualquier cartel de guardado/error
      setSavedStatus((prev) => ({ ...prev, [id]: false }));
      setErrorStatus((prev) => ({ ...prev, [id]: false }));

      // 7. Recargar los datos
      reloadData();
    } catch (error) {
      console.error("Error al resolver ToDo:", error);
    }
  };

  const handleSummaryModal = () => {
    setIsModalSummaryVisible(true);
  };

  const isDataLoaded =
    inventoryData.length > 0 && Object.keys(tempToDo).length > 0;

  if (!isDataLoaded) {
    return (
      <div className="flex justify-center w-full h-screen items-center">
        <span className="loading loading-dots loading-md"></span>
      </div>
    );
  }

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
      <div className="flex flex-row justify-center items-center mt-3 border-b-[1px] border-solid border-black pb-3">
        {/* <div className="flex w-1/12 md:w-0"></div> */}
        <SortSelector
          sortProperty={sortProperty}
          setSortProperty={setSortProperty}
          secondarySortProperty={secondarySortProperty}
          setSecondarySortProperty={setSecondarySortProperty}
          availableProperties={availableProperties}
          propertyLabels={propertyLabels}
          filters={filters}
          setFilters={setFilters}
        />
        <button
          onClick={() => handleSummaryModal()}
          className="flex justify-center p-1 text-sm items-center bg-banner border-[1px] border-solid border-black rounded-md shadow-lg shadow-gray-500"
        >
          Resumen
        </button>
      </div>
      <div className="flex justify-between w-full gap-5 p-2 border-b-[1px] border-solid border-black bg-white bg-opacity-35">
        {/* Filtro de productos */}
        <FilterWithTags
          inventoryData={inventoryData}
          setFilteredData={setFilteredData}
          filters={filters}
          setFilters={setFilters}
        />
        <div className="flex flex-col items-center justify-start gap-3">
          <div className="flex flex-row items-center justify-center gap-1 text-center">
            <h3 className="text-xs font-semibold">ToDo only:</h3>
            <CustomCheckbox
              checked={filters.toDoOnlyChecked} // Estado controlado externamente
              onChange={handleToDoOnlyCheckboxChange} // Llama a la función para cambiar el estado
            />
          </div>
          <button
            className="flex w-full justify-end items-center"
            onClick={confirmResolveAllTodos}
          >
            <img className="w-8" src={checkAllIcon} alt="check-all-icon" />
          </button>
        </div>
      </div>

      {/* Mostrar productos filtrados */}
      {filteredData.length > 0 ? (
        filteredData.map((item) => (
          <div
            key={item.id}
            className="flex flex-row justify-between items-start px-2 pt-2 border-b-[1px] border-solid border-black"
          >
            <div className="flex flex-col justify-start items-start pb-5">
              {renderProductDetails(item)}
            </div>

            <div className="flex flex-row gap-2 items-center">
              <div className="min-w-24 flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-semibold">
                    {propertyLabels.productStock}:{" "}
                    <strong>{item.productStock}</strong>
                  </h3>
                  <h3 className="text-sm font-semibold">
                    {propertyLabels.productPrice}:{" "}
                    <strong>€{item.productPrice}</strong>
                  </h3>
                </div>
                <div className="relative flex flex-col items-start gap-1">
                  <div className="flex flex-row gap-3">
                    <label htmlFor={`to-do-${item.id}`}>Hacer:</label>
                    <input
                      id={`to-do-${item.id}`}
                      type="number"
                      onClick={(e) => e.target.select()}
                      onFocus={() => {
                        setHideZeroUntilBlur((prev) => ({
                          ...prev,
                          [item.id]: false,
                        }));
                        setInputHasFocus((prev) => ({
                          ...prev,
                          [item.id]: true,
                        }));
                      }}
                      onBlur={(e) => {
                        setHideZeroUntilBlur((prev) => ({
                          ...prev,
                          [item.id]: false,
                        }));
                        setInputHasFocus((prev) => ({
                          ...prev,
                          [item.id]: false,
                        }));
                        const value = e.target.value;
                        const finalValue = value === "" ? 0 : parseInt(value);

                        if (saveTimeouts.current[item.id]) {
                          clearTimeout(saveTimeouts.current[item.id]);
                          saveTimeouts.current[item.id] = null;
                        }

                        setTempToDo((prev) => ({
                          ...prev,
                          [item.id]: finalValue,
                        }));
                        saveToDo(item.id, finalValue);
                      }}
                      onChange={(e) => {
                        const value = e.target.value;

                        if (value === "0") {
                          setUserTypedZero((prev) => ({
                            ...prev,
                            [item.id]: true,
                          }));
                        } else {
                          setUserTypedZero((prev) => ({
                            ...prev,
                            [item.id]: false,
                          }));
                        }

                        if (value === "" || parseInt(value) >= 0) {
                          setTempToDo((prev) => ({
                            ...prev,
                            [item.id]: value,
                          }));

                          if (saveTimeouts.current[item.id]) {
                            clearTimeout(saveTimeouts.current[item.id]);
                          }

                          saveTimeouts.current[item.id] = setTimeout(() => {
                            const finalValue =
                              value === "" ? 0 : parseInt(value);
                            saveToDo(item.id, finalValue, {
                              userTypedZero: value === "0",
                              hasFocus: inputHasFocus[item.id],
                            });

                            if (value === "") {
                              setUserTypedZero((prev) => ({
                                ...prev,
                                [item.id]: false,
                              }));
                              setHideZeroUntilBlur((prev) => ({
                                ...prev,
                                [item.id]: true,
                              }));
                            }
                          }, 3000);
                        }
                      }}
                      onWheel={(e) => e.target.blur()}
                      min="0"
                      className={`w-8 rounded-md text-center bg-slate-100 ring-1 focus:ring-2 focus:outline-0 custom-input-appearance transition-all duration-300
                        ${
                          errorStatus[item.id]
                            ? "ring-red-500"
                            : savedStatus[item.id]
                            ? "ring-green-500"
                            : "ring-black"
                        }`}
                      value={
                        tempToDo?.[item.id] === 0 &&
                        hideZeroUntilBlur?.[item.id] &&
                        !userTypedZero?.[item.id]
                          ? ""
                          : tempToDo?.[item.id] !== undefined
                          ? tempToDo[item.id]
                          : item.toDo
                      }
                    />
                  </div>
                  {/* Mensajes */}
                  {/* Guardado */}
                  <AnimatePresence mode="wait">
                    {savedStatus[item.id] && (
                      <motion.span
                        key="saved"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.4 }}
                        className="absolute left-0 -bottom-6 text-green-600 text-sm px-2 py-[1px] bg-white bg-opacity-90 rounded shadow whitespace-nowrap"
                      >
                        ✓ Guardado
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Error */}
                  <AnimatePresence mode="wait">
                    {errorStatus[item.id] && (
                      <motion.span
                        key="error"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.4 }}
                        className="absolute left-0 -bottom-6 text-red-600 text-sm px-2 py-[1px] bg-white bg-opacity-90 rounded shadow whitespace-nowrap"
                      >
                        ✗ Error al guardar
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <div className="flex flex-col justify-end items-center gap-2">
                <div className="flex flex-col justify-end items-center gap-2 pb-3">
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
                    <img
                      className="w-3"
                      src={deleteItemIcon}
                      alt="delete-icon"
                    />
                  </button>
                  <button
                    onClick={() => resolveToDo(item.id)}
                    className="flex justify-center items-center bg-success w-8 h-8 rounded-full border-[1px] border-solid border-black shadow-lg shadow-gray-500"
                  >
                    <img className="w-3" src={acceptIcon} alt="edit-icon" />
                  </button>
                </div>
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
