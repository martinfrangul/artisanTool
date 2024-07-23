/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";
import { database } from "../../firebase/firebaseConfig";
import { ref, onValue } from "firebase/database";

const InventoryContext = createContext();

const InventoryContextProvider = ({ children }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    const dataRef = ref(database, "products");

    onValue(
      dataRef,
      (snapshot) => {
        const data = snapshot.val();
        const dataArray = data
          ? Object.keys(data).map((key) => ({
              id: key,
              ...data[key],
            }))
          : [];
        setData(dataArray);
      },
      (error) => {
        console.error("Error al leer los datos: ", error);
      }
    );
  }, []);

  return (
    <InventoryContext.Provider value={{ data }}>
      {children}
    </InventoryContext.Provider>
  );
};

export { InventoryContext, InventoryContextProvider };
