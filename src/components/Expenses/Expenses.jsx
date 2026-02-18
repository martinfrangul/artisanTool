import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { database } from "../../../firebase/firebaseConfig";
import { useAuth } from "../../hooks/useAuth";

const Expenses = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!user) return;
      try {
        const snapshot = await getDocs(collection(database, `users/${user.uid}/expenses`));
        const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const sorted = docs.sort((a, b) => b.date?.seconds - a.date?.seconds);
        setExpenses(sorted);
      } catch (error) {
        console.error("Error al obtener gastos:", error.message);
      }
    };

    fetchExpenses();
  }, [user]);

  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return "";
    const date = timestamp.toDate();
    return date.toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" });
  };

  return (
    <div className="p-4 w-full max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gastos</h1>

      {expenses.map((item) => (
        <div key={item.id} className="mb-4 p-4 bg-white border border-gray-300 rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-semibold text-lg">{item.concept}</h2>
              <p className="text-sm text-gray-600">{item.spec}</p>
              <p className="text-sm">Cantidad: {item.quantity}</p>
              <p className="text-sm">Precio: €{item.price}</p>
              <p className="text-sm">Fecha: {formatDate(item.date)}</p>
              <p className="text-sm font-medium">Total: €{(parseFloat(item.quantity) * parseFloat(item.price)).toFixed(2)}</p>
            </div>
          </div>
        </div>
      ))}

      {expenses.length === 0 && (
        <p className="text-gray-500 text-center">Aún no hay gastos registrados.</p>
      )}
    </div>
  );
};

export default Expenses;
