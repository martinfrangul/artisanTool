/* eslint-disable react/prop-types */
import { createContext, useState } from "react";
// import app from '../../firebase/firebaseConfig'
// import {getDatabase, ref, set, push} from "firebase/database";

const InventoryContext = createContext();

const InventoryContextProvider = ({ children }) => {
    const [data, setData] = useState({})
    const [input1, setInput1] = useState("")
    const [input2, setInput2] = useState("")




  return (
    <InventoryContext.Provider value={{ data, setData, input1, setInput1, input2, setInput2 }}>
      {children}
    </InventoryContext.Provider>
  );
};

export { InventoryContext, InventoryContextProvider };
