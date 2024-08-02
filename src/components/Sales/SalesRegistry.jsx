import { useState, useContext, useEffect } from 'react';
import { SellContext } from '../../context/SellContext.jsx';
import deleteItemIcon from '../../assets/deleteItemIcon.png';
import { doc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';
import { database } from '../../../firebase/firebaseConfig';
import Alert from '../Alert';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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

const SalesRegistry = () => {
  const context = useContext(SellContext);
  const { sellData, reloadData } = context;
  const { user } = useAuth(); // Obtén el usuario actual

  // STATES
  const [alert, setAlert] = useState({ message: "", type: "", visible: false });
  const [isConfirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    // Carga inicial de datos
    const fetchData = async () => {
      await reloadData();
    };
    
    fetchData();
  }, []); // Dependencias vacías para ejecutar solo al montar el componente

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
      console.error("Error al eliminar el producto: ", error);
    }
    setConfirmationModalVisible(false);
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
        <h1 className="text-xl font-bold text-logo">{item.productName}</h1>
        {orderedProperties.map(([key, value]) =>
          value ? (
            <h1 key={key}>
              <strong>{propertyLabels[key] || key}: </strong>
              {value}
            </h1>
          ) : null
        )}
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
    <div className="w-full h-full">
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
      <div className="flex flex-col justify-end items-center my-3 border-b-[1px] border-solid border-black pb-3">
        {sellData.length > 0 ? (
          sellData.map((item, index) => (
            <div
              key={item.id || index}
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
                </div>
                <div className="flex flex-col justify-end items-center gap-2">
                  <button
                    onClick={confirmDeleteItem}
                    className="flex justify-center items-center bg-danger w-8 h-8 rounded-full border-[0.5px] border-solid border-black shadow-lg shadow-gray-500"
                  >
                    <img
                      className="w-3"
                      src={deleteItemIcon}
                      alt="delete-icon"
                    />
                  </button>

                  <div className="flex flex-col items-center gap-4">
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      className="p-1 rounded-md shadow-md shadow-gray-500"
                    />
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate}
                      className="p-1 rounded-md shadow-md shadow-gray-500"
                    />
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
