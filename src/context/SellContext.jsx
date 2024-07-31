import { createContext, useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";
import PropTypes from "prop-types";


const SellContext = createContext();

const SellContextProvider = ({ children }) => {
  const [sellData, setSellData] = useState([]);
  const [reload, setReload] = useState(false); // Estado para controlar la recarga
  const { user, loading: authLoading } = useAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return; // No hacer nada si el usuario no está autenticado

      try {
        const querySnapshot = await getDocs(
          collection(db, `users/${user.uid}/sales`)
        );
        const dataArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSellData(dataArray);
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
    <SellContext.Provider value={{ sellData, reloadData }}>
      {children}
    </SellContext.Provider>
  );
};

SellContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { SellContext, SellContextProvider };
