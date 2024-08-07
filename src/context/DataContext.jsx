import { createContext, useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";
import PropTypes from "prop-types";

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

  return (
    <DataContext.Provider value={{ sellData, setSellData, inventoryData, setInventoryData, reloadData }}>
      {children}
    </DataContext.Provider>
  );
};

DataContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { DataContext, DataContextProvider };
