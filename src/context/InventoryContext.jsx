import { createContext, useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";
import PropTypes from "prop-types";

const InventoryContext = createContext();

const InventoryContextProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [reload, setReload] = useState(false); // Estado para controlar la recarga
  const { user, loading: authLoading } = useAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return; // No hacer nada si el usuario no está autenticado

      try {
        const querySnapshot = await getDocs(
          collection(db, `users/${user.uid}/products`)
        );
        const dataArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(dataArray);
      } catch (error) {
        console.error("Error al leer los datos: ", error);
      }
    };

    fetchData();
  }, [user, db, reload]);

  if (authLoading) {
    return <span className="loading loading-dots loading-md"></span>;
  }

  // Función para recargar los datos
  const reloadData = () => {
    setReload((prev) => !prev);
  };

  return (
    <InventoryContext.Provider value={{ data, reloadData }}>
      {children}
    </InventoryContext.Provider>
  );
};

InventoryContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { InventoryContext, InventoryContextProvider };
