import { createContext, useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth"; // Importa el hook personalizado

const InventoryContext = createContext();

const InventoryContextProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [reload, setReload] = useState(false); // Estado para controlar la recarga
  const { user, loading: authLoading } = useAuth(); // Usa el hook de autenticación
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
    return <p>Loading...</p>;
  }

  // Función para recargar los datos
  const reloadData = () => {
    setReload((prev) => !prev); // Cambiar el estado para desencadenar la recarga
  };

  return (
    <InventoryContext.Provider value={{ data, reloadData }}>
      {children}
    </InventoryContext.Provider>
  );
};

export { InventoryContext, InventoryContextProvider };
