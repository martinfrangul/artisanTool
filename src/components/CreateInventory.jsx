import { AuthContext } from "../context/AuthContext";
import { useContext, useState } from "react";
import app from "../../firebase/firebaseConfig";
import { getDatabase, ref, set, push } from "firebase/database";

const CreateInventory = () => {
    // CONTEXT
  const AuthContextCall = useContext(AuthContext);
  const { logOut } = AuthContextCall;
  
    //USESTATE
  const [productName, setProductName] = useState('');
  const [inputs, setInputs] = useState([{ property: '', option: '' }]);

    //SUBMIT DATA
  const saveData = () => {
    const db = getDatabase(app);
    const productRef = ref(db, `products/${productName}`);
    
    // Transformar el array de inputs a un objetos
    const inputsObject = inputs.reduce((acc, input, index) => {
      acc[`property${index + 1}`] = input.property;
      acc[`option${index + 1}`] = input.option;
      return acc;
    }, {});

    const newDocRef = push(productRef);
    set(newDocRef, inputsObject)
      .then(() => {
        alert("Guardado correctamente");
        // LIMPIO LOS INPUTS Y DEJO SÓLO PRODUCTO Y UN PAR DE PROPIEDAD Y OPCIÓN
        setProductName('')
        setInputs([{ property: '', option: '' }])
      })
      .catch((error) => {
        alert("Error: " + error);
      });
  };


  const createInputs = () => {
    setInputs(prev => [
      ...prev,
      { property: '', option: '' }
    ]);
  };

  const handleInputChange = (index, field, value) => {
    const newInputs = [...inputs];
    newInputs[index][field] = value;
    setInputs(newInputs);
  };

  return (
    <div>
      <h1>CreateInventory</h1>
      <input
        className="border-2 rounded border-solid border-black"
        onChange={(event) => setProductName(event.target.value)}
        type="text"
        value={productName}
      />
      {inputs.map((input, index) => (
        <div key={index}>
          <input
            className="border-2 rounded border-solid border-black"
            onChange={(event) => handleInputChange(index, 'property', event.target.value)}
            type="text"
            value={input.property}
          />
          <input
            className="border-2 rounded border-solid border-black"
            onChange={(event) => handleInputChange(index, 'option', event.target.value)}
            type="text"
            value={input.option}
          />
        </div>
      ))}
      <button onClick={createInputs}>
        CREATE INPUTS
      </button>
      <button onClick={saveData}>SUBMIT</button>
      <button onClick={logOut}>Logout</button>
    </div>
  );
};

export default CreateInventory;
