import { createContext, useState, useEffect } from "react";
import { database } from "../../firebase/firebaseConfig";
import { collection, getDocs, onSnapshot } from "firebase/firestore";

const InventoryContext = createContext();

const InventoryContextProvider = ({ children }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(database, "products"));
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


      // Configuración de suscripción a cambios en tiempo real
      const unsubscribe = onSnapshot(collection(database, "products"), (snapshot) => {
        const dataArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(dataArray);
      }, (error) => {
        console.error("Error al leer los datos en tiempo real: ", error);
      });
  
      // Limpiar suscripción al desmontar el componente
      return () => unsubscribe();



  }, []);
  

  return (
    <InventoryContext.Provider value={{ data }}>
      {children}
    </InventoryContext.Provider>
  );
};

export { InventoryContext, InventoryContextProvider };
