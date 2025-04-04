import { useState } from "react";
import { collection, getDocs, doc, setDoc, Timestamp } from "firebase/firestore";
import { database } from "../../../../firebase/firebaseConfig";
import { useAuth } from "../../../hooks/useAuth";

const BackupRestoreSales = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const downloadBackup = async () => {
    if (!user?.uid) return;
    setLoading(true);
    setMessage(null);

    try {
      const salesRef = collection(database, `users/${user.uid}/sales`);
      const snapshot = await getDocs(salesRef);
      const backupData = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "sales-backup.json";
      a.click();
      URL.revokeObjectURL(url);

      setMessage("Backup descargado correctamente.");
    } catch (error) {
      console.error("Error al generar backup:", error);
      setMessage("Error al generar backup. Ver consola.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !user?.uid) return;

    setLoading(true);
    setMessage(null);

    try {
      const text = await file.text();
      const backupData = JSON.parse(text);

      for (const item of backupData) {
        let dateField = item.date;

        if (
          typeof dateField === "object" &&
          typeof dateField.seconds === "number" &&
          typeof dateField.nanoseconds === "number"
        ) {
          dateField = new Timestamp(dateField.seconds, dateField.nanoseconds);
        } else {
          dateField = Timestamp.fromDate(new Date(dateField));
        }

        const restoredData = {
          ...item,
          date: dateField,
        };

        await setDoc(doc(database, `users/${user.uid}/sales`, item.id), restoredData);
      }

      setMessage("Ventas restauradas correctamente.");
    } catch (error) {
      console.error("Error al restaurar ventas:", error);
      setMessage("Error al restaurar ventas. Ver consola.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={downloadBackup}
        className="px-4 py-2 rounded-xl border border-black shadow-lg shadow-gray-500 font-light text-md transition w-full bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Procesando..." : "📥 Descargar Backup"}
      </button>

      <div className="w-full text-left">
        <label className="text-sm font-medium block mb-1">📤 Restaurar desde archivo .json</label>
        <input
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          disabled={loading}
          className="w-full border border-gray-300 p-2 rounded shadow-sm text-sm"
        />
      </div>

      {message && (
        <p className="text-sm text-center text-gray-700 border-t border-gray-300 pt-2 w-full">
          {message}
        </p>
      )}
    </div>
  );
};

export default BackupRestoreSales;
