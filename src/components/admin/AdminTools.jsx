import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { database } from "../../../firebase/firebaseConfig";
import { useAuth } from "../../hooks/useAuth";
import BackupRestoreTool from "./tools/BackupRestoreTool";
import AddFieldToSales from "./tools/AddFieldToSales";

const AdminTools = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkIfAdmin = async () => {
      if (!user) return;
      try {
        const docRef = doc(database, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setIsAdmin(userData.admin === true);
        }
      } catch (error) {
        console.error("Error verificando permisos de admin:", error);
      }
    };

    checkIfAdmin();
  }, [user]);

  if (!isAdmin) return null;

  return (
    <div className="w-11/12 md:w-6/12 lg:w-4/12 mx-auto mt-10 p-6 bg-white bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-400 shadow-lg shadow-gray-500 flex flex-col items-center text-center gap-6">
      <h2 className="text-2xl font-thin text-logo">Herramientas de Admin</h2>
      <p className="text-sm text-gray-700 font-light">
        Desde aquí puedes ejecutar tareas especiales de mantenimiento.
      </p>

      {/* Script para agregar campo a ventas antiguas */}
      <AddFieldToSales />

      {/* Backup y restauración */}
      <div className="w-full border-t border-gray-300 pt-4">
        <h3 className="text-md font-semibold mb-2">Respaldo de ventas</h3>
        <BackupRestoreTool />
      </div>
    </div>
  );
};

export default AdminTools;
