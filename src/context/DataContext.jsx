import { createContext, useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";

const DataContext = createContext();

const DataContextProvider = ({ children }) => {
  const [sellData, setSellData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [reload, setReload] = useState(false); // Estado para controlar la recarga
  const { user, loading: authLoading } = useAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchSellData = async () => {
      if (!user) return;
      try {
        const querySnapshot = await getDocs(collection(db, `users/${user.uid}/sales`));
        const dataArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSellData(dataArray);
      } catch (error) {
        console.error("Error al leer los datos: ", error);
        setSellData([]);
      }
    };

    const fetchInventoryData = async () => {
      if (!user) return;
      try {
        const querySnapshot = await getDocs(collection(db, `users/${user.uid}/products`));
        const dataArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInventoryData(dataArray);
      } catch (error) {
        console.error("Error al leer los datos: ", error);
        setInventoryData([]);
      }
    };

    fetchSellData();
    fetchInventoryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, reload]);

  if (authLoading) {
    return (
      <div className="flex justify-center w-full h-screen items-center">
        <span className="loading loading-dots loading-md"></span>
      </div>
    );
  }

  const reloadData = () => {
    setReload((prev) => !prev);
  };

  const options = [
    { value: "", label: "(Opcional)", disabled: true },
    { value: "model", label: "Modelo" },
    { value: "size", label: "Tamaño" },
    { value: "design", label: "Diseño" },
    { value: "color", label: "Color" },
    { value: "type", label: "Tipo" },
    { value: "binding", label: "Cosido" },
  ];

  return (
    <DataContext.Provider value={{options, sellData, setSellData, inventoryData, setInventoryData, reloadData }}>
      {children}
    </DataContext.Provider>
  );
};


export { DataContext, DataContextProvider };
