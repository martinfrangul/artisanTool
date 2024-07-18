import { AuthContext } from "../context/AuthContext";
import {useContext, useState } from "react";
import app from "../../firebase/firebaseConfig";
import { getDatabase, ref, set, push } from "firebase/database";

const CreateInventory = () => {
  const AuthContextCall = useContext(AuthContext);

  const [productName, setProductName] = useState('')

  const { logOut } = AuthContextCall;

  const [input1, setInput1] = useState("")
  const [input2, setInput2] = useState("")

  const saveData = () => {
    const db = getDatabase(app);
    const newDocRef = push(ref(db, `products/${productName}`));
    set(newDocRef, {
      property: input1,
      option: input2,
    })
      .then(() => {
        alert("Guardado correctamente");
      })
      .catch((error) => {
        alert("Error: ", error);
      });
      

  };

  return (
    <div>
      <h1>CreateInventory</h1>
      <input
        className=" border-2 rounded border-solid border-black"
        onChange={(event) => setProductName(event.target.value)}
        type="text"
        value={productName}
      />
       <input
        className=" border-2 rounded border-solid border-black"
        onChange={(event) => setInput1(event.target.value)}
        type="text"
        value={input1}
      />
       <input
        className=" border-2 rounded border-solid border-black"
        onChange={(event) => setInput2(event.target.value)}
        type="text"
        value={input2}
      />
      <button onClick={saveData}>SUBMIT</button>

      <button onClick={logOut}>Logout</button>
    </div>
  );
};

export default CreateInventory;
