import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { database } from "../../../firebase/firebaseConfig";
import { useAuth } from "../../hooks/useAuth";

const ShopList = () => {
  const { user } = useAuth();
  const [newItem, setNewItem] = useState({
    concept: "",
    spec: "",
    quantity: "",
    price: "",
  });
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      if (!user) return;
      try {
        const snapshot = await getDocs(collection(database, `users/${user.uid}/toBuy`));
        const fetchedItems = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data(), editing: false }));
        setItems(fetchedItems);
      } catch (error) {
        console.error("Error al obtener compras:", error.message);
      }
    };
    fetchItems();
  }, [user]);

  const handleInputChange = (field, value) => {
    setNewItem((prev) => ({ ...prev, [field]: value }));
  };

  const addItem = async () => {
    if (!user) return;

    const quantity = parseFloat(newItem.quantity);
    const price = parseFloat(newItem.price);

    if (!newItem.concept || isNaN(quantity) || isNaN(price)) {
      console.warn("Datos inválidos:", newItem);
      return;
    }

    const itemToSave = {
      concept: newItem.concept.trim(),
      spec: newItem.spec.trim(),
      quantity,
      price,
      timestamp: Date.now(),
      bought: false,
    };

    console.log("Intentando guardar:", itemToSave);

    try {
      const docRef = await addDoc(collection(database, `users/${user.uid}/toBuy`), itemToSave);
      console.log("Documento guardado con ID:", docRef.id);
      setItems((prev) => [...prev, { ...itemToSave, id: docRef.id, editing: false }]);
      setNewItem({ concept: "", spec: "", quantity: "", price: "" });
    } catch (error) {
      console.error("Error al guardar en Firestore:", error.code, error.message);
    }
  };

  const deleteItem = async (id) => {
    if (!user) return;
    await deleteDoc(doc(database, `users/${user.uid}/toBuy`, id));
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const markAsBought = async (item) => {
    if (!user) return;

    const cleanedItem = { ...item };
    delete cleanedItem.id;
    delete cleanedItem.bought;
    delete cleanedItem.editing;
    delete cleanedItem.timestamp;

    const expenseToSave = {
      ...cleanedItem,
      date: Timestamp.now(),
    };

    try {
      await addDoc(collection(database, `users/${user.uid}/expenses`), expenseToSave);
      await deleteDoc(doc(database, `users/${user.uid}/toBuy`, item.id));
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (error) {
      console.error("Error al mover a expenses:", error.message);
    }
  };

  return (
    <div className="p-4 w-full max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gestor de Compras</h1>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          className="input input-bordered"
          placeholder="Concepto"
          value={newItem.concept}
          onChange={(e) => handleInputChange("concept", e.target.value)}
        />
        <input
          className="input input-bordered"
          placeholder="Especificación"
          value={newItem.spec}
          onChange={(e) => handleInputChange("spec", e.target.value)}
        />
        <input
          type="number"
          className="input input-bordered"
          placeholder="Cantidad"
          value={newItem.quantity}
          onChange={(e) => handleInputChange("quantity", e.target.value)}
        />
        <input
          type="number"
          step="0.01"
          className="input input-bordered"
          placeholder="Precio unitario"
          value={newItem.price}
          onChange={(e) => handleInputChange("price", e.target.value)}
        />
      </div>

      <button
        onClick={addItem}
        className="mb-8 px-4 py-2 bg-logo text-white rounded shadow"
      >
        + Agregar compra
      </button>

      {items.map((item) => (
        <div key={item.id} className="mb-4 p-4 bg-white border border-gray-300 rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-semibold text-lg">{item.concept}</h2>
              <p className="text-sm text-gray-600">{item.spec}</p>
              <p className="text-sm">Cantidad: {item.quantity}</p>
              <p className="text-sm">Precio: €{item.price}</p>
              <p className="text-sm font-medium">Total: €{(parseFloat(item.quantity) * parseFloat(item.price)).toFixed(2)}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => deleteItem(item.id)}
                className="px-2 py-1 bg-danger text-white text-xs rounded"
              >
                Eliminar
              </button>
              <button
                onClick={() => markAsBought(item)}
                className="px-2 py-1 bg-success text-white text-xs rounded"
              >
                ✓ Comprado
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShopList;