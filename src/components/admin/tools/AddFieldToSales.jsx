import { useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { database } from "../../../../firebase/firebaseConfig";
import { useAuth } from "../../../hooks/useAuth";

const AddFieldToSales = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleAddField = async () => {
    if (!user?.uid) return;

    setLoading(true);
    setMessage(null);

    try {
      const salesRef = collection(database, `users/${user.uid}/sales`);
      const snapshot = await getDocs(salesRef);

      const updates = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();

        if (!data.dateString && data.date?.toDate) {
          const date = data.date.toDate();
          const dateString = `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

          updates.push(
            updateDoc(doc(database, `users/${user.uid}/sales`, docSnap.id), {
              dateString,
            })
          );
        }
      });

      await Promise.all(updates);

      setMessage(`✅ ${updates.length} documentos actualizados con dateString.`);
    } catch (error) {
      console.error("Error actualizando documentos:", error);
      setMessage("⚠️ Error al actualizar los documentos. Ver consola.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-4 border-t pt-4 w-full">
      <h3 className="text-md font-semibold">Agregar campo dateString</h3>
      <button
        onClick={handleAddField}
        className="px-4 py-2 rounded-xl border border-black shadow-lg shadow-gray-500 font-light text-md transition w-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Actualizando..." : "📅 Agregar dateString a ventas antiguas"}
      </button>
      {message && <p className="text-sm text-center text-gray-700">{message}</p>}
    </div>
  );
};

export default AddFieldToSales;