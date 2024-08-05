import { useState, useContext } from "react";
import { InventoryContext } from "../../context/InventoryContext";
import deleteItemIcon from "../../assets/deleteItemIcon.png";
import editIcon from "../../assets/editIcon.png";
import checkAllIcon from "../../assets/checkAllIcon.png";
import acceptIcon from "../../assets/acceptIcon.png";
import { doc, deleteDoc, updateDoc, writeBatch } from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth";
import { database } from "../../../firebase/firebaseConfig";
import EditProduct from "./EditProduct";
import Alert from "../Alert";

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
};

const Inventory = () => {
  const context = useContext(InventoryContext);
  const { data, reloadData } = context;
  const { user } = useAuth(); // Obtén el usuario actual

  // STATES
  const [sortProperty, setSortProperty] = useState("productName");
  const [isModalVisible, setModalVisible] = useState(false);
  const [idForEdit, setIdForEdit] = useState("");
  const [alert, setAlert] = useState({ message: "", type: "", visible: false });
  const [isConfirmationModalVisible, setConfirmationModalVisible] = useState(false);


  const capitalizeFirstLetter = (string) => {
    if (typeof string !== 'string') {
      return string; // O devuelve el valor por defecto que prefieras
    }
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  // Get the available properties
  const getAvailableProperties = () => {
    const properties = new Set();
    data.forEach((item) => {
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

  // Get properties
  const availableProperties = [
    "productName",
    "productStock",
    "productPrice",
    ...getAvailableProperties(),
  ];

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
        <h1 className="text-xl font-bold text-logo">{capitalizeFirstLetter(item.productName)}</h1>
        
        {orderedProperties.map(([key, value]) =>
          value ? (
            <h1 key={key}>
              <strong>{propertyLabels[key] || capitalizeFirstLetter(key)}: </strong>
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

  // Ordenar los items según la propiedad seleccionada
  const sortedData = data.slice().sort((a, b) => {
    // Si alguno de los items no tiene el valor de la propiedad seleccionada
    if (a[sortProperty] === undefined) return 1;
    if (b[sortProperty] === undefined) return -1;

    // Comparar los valores de la propiedad seleccionada
    if (a[sortProperty] < b[sortProperty]) {
      return -1;
    }
    if (a[sortProperty] > b[sortProperty]) {
      return 1;
    }
    return 0;
  });

  // Maneja el cambio en la propiedad de orden
  const handleSortChange = (event) => {
    setSortProperty(event.target.value);
  };

  // Actualiza el TODO en la base de datos
  const saveToDo = async (event, id) => {
    const newToDoValue = event.target.value;
    if (!user) return;
    try {
      const docRef = doc(database, `users/${user.uid}/products`, id);
      await updateDoc(docRef, {
        toDo: newToDoValue === "" ? 0 : parseInt(newToDoValue),
      });
      reloadData();
    } catch (error) {
      console.error("Error al editar el to-do del producto: ", error);
    }
  };

  const confirmResolveAllTodos = () => {
    setConfirmationModalVisible(true);
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

    // Creamos una transacción para actualizar todos los documentos
    const batch = writeBatch(database);

    try {
      // Actualizar el stock en Firestore
      data.forEach((item) => {
        if (item.toDo > 0) {
          const docRef = doc(database, `users/${user.uid}/products`, item.id);
          const updatedStock = item.productStock + item.toDo;
          // Actualiza el documento con el nuevo stock y toDo a 0
          batch.update(docRef, { productStock: updatedStock, toDo: 0 });
        }
      });

      // Commit de la transacción
      await batch.commit();
      reloadData();
      setAlert({
        message: "Todos los productos agregados correctamente al stock",
        type: "success",
        visible: true,
      });
      setConfirmationModalVisible(false);
    } catch (error) {
      console.error("Error al resolver todos los productos: ", error);
      setAlert({
        message: "Error al resolver los productos",
        type: "error",
        visible: true,
      });
      setConfirmationModalVisible(false);
    }
  };

  const handleConfirmation = (confirmed) => {
    if (confirmed) {
      resolveAllTodos();
    } else {
      setConfirmationModalVisible(false);
    }
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

    let selectedItem = data.find((item) => item.id === id);

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

  return (
    <div className="w-11/12 m-auto pb-28">
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
            <p>¿Estás seguro de que deseas agregar todos los productos al stock?</p>
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
      {/* Dropdown para seleccionar la propiedad de orden */}
      <div className="flex flex-row justify-end items-center my-3 border-b-[1px] border-solid border-black pb-3">
        <div className="flex w-2/12"></div>
        <div className="w-8/12 flex flex-row justify-center">
          <label className="p-3" htmlFor="sort-property">
            Ordenar por:
          </label>
          <select
            className="p-1 rounded-md shadow-md shadow-gray-500"
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
          <button className="flex w-2/12 justify-end" onClick={confirmResolveAllTodos}>
            <div className="rounded-full bg-success w-12 h-12 flex justify-center items-center">
              <img className="w-8" src={checkAllIcon} alt="check-all-icon" />
            </div>
          </button>
      </div>

      {sortedData.length > 0 ? (
        sortedData.map((item) => (
          <div
            key={item.id}
            className="flex flex-row justify-between items-start pb-5 px-2 pt-2 border-b-[1px] border-solid border-black"
          >
            <div className="flex flex-col justify-start items-start">
              {renderProductDetails(item)}
            </div>

            <div className="flex flex-row gap-6 items-center">
              <div className="flex flex-col gap-3">
                <h3 className="text-md font-semibold">
                  {propertyLabels.productStock}:{" "}
                  <strong>{item.productStock}</strong>
                </h3>
                <h3 className="text-md font-semibold">
                  {propertyLabels.productPrice}:{" "}
                  <strong>€{item.productPrice}</strong>
                </h3>
                <div className="flex flex-row gap-1">
                  <label htmlFor="to-do">Hacer:</label>
                  <input
                    onChange={(e) => saveToDo(e, item.id)}
                    className="w-8 rounded-md text-center bg-slate-100 ring-1 ring-black focus:ring-1 focus:outline-0"
                    id="to-do"
                    type="number"
                    value={item.toDo ?? ""}
                  ></input>
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
                  onClick={() => handleDelete(item.id)}
                  className="flex justify-center items-center bg-danger w-8 h-8 rounded-full border-[0.5px] border-solid border-black shadow-lg shadow-gray-500"
                >
                  <img className="w-3" src={deleteItemIcon} alt="delete-icon" />
                </button>
              </div>

              {isModalVisible && (
                <EditProduct
                  productIdForEdit={idForEdit}
                  handleModalToggle={handleModalToggle}
                />
              )}
            </div>
          </div>
        ))
      ) : (
        <p>No hay datos</p>
      )}
    </div>
  );
};

export default Inventory;
