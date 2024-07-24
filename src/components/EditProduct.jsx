import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { InventoryContext } from "../context/InventoryContext";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { database } from "../../firebase/firebaseConfig";
import PropTypes from "prop-types";


const EditProduct = ({ handleModalToggle, productIdForEdit }) => {
  // STATES
  const [itemData, setItemData] = useState({});

  const Authcontext = useContext(AuthContext);
  const Inventorycontext = useContext(InventoryContext);

  const { user } = Authcontext;
  const { reloadData } = Inventorycontext;

  useEffect(() => {
    const fetchProductData = async () => {
      if (!user || !productIdForEdit) return;
      const docRef = doc(
        database,
        `users/${user.uid}/products`,
        productIdForEdit
      );
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setItemData(docSnap.data());
      }
    };
    fetchProductData();
  }, [user, productIdForEdit]);

  const handleInputChange = (key, value) => {
    setItemData((prevItemData) => ({
      ...prevItemData,
      [key]: value,
    }));
  };

  const entriesArray = Object.entries(itemData);


  console.log(entriesArray);

  const submitEditProduct = async () => {
    if (!user || !productIdForEdit) return; 
    try {
      const docRef = doc(
        database,
        `users/${user.uid}/products`,
        productIdForEdit
      );
      await updateDoc(docRef, itemData);
      reloadData();
      alert("Producto editado correctamente");
      handleModalToggle(false);
    } catch (error) {
      console.error("Error al editar producto: ", error);
    }
  };

  return (
    <div
      id="default-modal"
      tabIndex="-1"
      aria-hidden="true"
      className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-gray-800 bg-opacity-50"
    >
      <div className="relative p-4 w-full max-w-2xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={() => handleModalToggle(false)}
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        <div className="p-4 md:p-5 space-y-4">
          {Object.entries(itemData).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400" htmlFor={key}>
                {key}
              </label>
              <input
                className="block w-full text-black border-2 border-solid border-black rounded-md"
                id={key}
                value={value}
                onChange={(e) => handleInputChange(key, e.target.value)}
                type="text"
              />
            </div>
          ))}
        </div>
        <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={submitEditProduct}
          >
            I accept
          </button>
          <button
            type="button"
            className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            onClick={() => handleModalToggle(false)}
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

EditProduct.propTypes = {
    handleModalToggle: PropTypes.bool.isRequired,
    productIdForEdit: PropTypes.string.isRequired,
  };

export default EditProduct;
