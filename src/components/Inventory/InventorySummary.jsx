import { useState, useContext, useMemo, useEffect } from "react";
import { DataContext } from "../../context/DataContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Select from "react-select";

const InventorySummary = () => {
  const { inventoryData, propertyLabels, options } = useContext(DataContext);
  const navigate = useNavigate();

  const [selectedXOption, setSelectedXOption] = useState(null);
  const [selectedYOption, setSelectedYOption] = useState(null);
  const [unselectedProducts, setUnselectedProducts] = useState(() => {
    const saved = localStorage.getItem("unselectedSummaryProducts");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("unselectedSummaryProducts", JSON.stringify(unselectedProducts));
  }, [unselectedProducts]);

  // Lista única de productos
  const uniqueProducts = useMemo(() => {
    return [...new Set(inventoryData.map(item => item.productName))].filter(Boolean).sort();
  }, [inventoryData]);

  const handleCheckboxChange = (productName) => {
    setUnselectedProducts(prev => 
      prev.includes(productName)
        ? prev.filter(p => p !== productName)
        : [...prev, productName]
    );
  };

  // Datos filtrados por checkbox
  const filteredInventoryData = useMemo(() => {
    return inventoryData.filter(item => !unselectedProducts.includes(item.productName));
  }, [inventoryData, unselectedProducts]);

  const capitalizeFirstLetter = (string) => {
    if (typeof string !== "string") return string;
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  // Calcular KPIs Totales basados en datos filtrados
  const totalItemsEnStock = filteredInventoryData.reduce(
    (acc, item) => acc + (parseInt(item.productStock) || 0),
    0
  );
  
  const totalItemsParaHacer = filteredInventoryData.reduce(
    (acc, item) => acc + (parseInt(item.toDo) || 0),
    0
  );

  const valorEstimadoStock = filteredInventoryData.reduce(
    (acc, item) => acc + ((parseInt(item.productStock) || 0) * (parseFloat(item.productPrice) || 0)),
    0
  );

  ///////////// MATRIX LOGIC ////////////////////
  const toNumber = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  };

  const isSelectionValid = selectedXOption && selectedYOption;

  const xAxisKeys = isSelectionValid
    ? [
        ...new Set(
          filteredInventoryData
            .map((item) => item[selectedXOption.value])
            .filter((xKey) => xKey !== undefined && xKey !== null)
        ),
      ]
    : [];

  const yAxisKeys = isSelectionValid
    ? [
        ...new Set(
          filteredInventoryData
            .map((item) => item[selectedYOption.value])
            .filter((yKey) => yKey !== undefined && yKey !== null)
        ),
      ]
    : [];

  const tableData = isSelectionValid
    ? xAxisKeys.reduce((acc, xKey) => {
        acc[xKey] = yAxisKeys.reduce((yAcc, yKey) => {
          const matchingItems = filteredInventoryData.filter(
            (item) =>
              item[selectedXOption.value] === xKey &&
              item[selectedYOption.value] === yKey
          );

          const totalStock = matchingItems.reduce(
            (sum, item) => sum + toNumber(item.productStock),
            0
          );
          const totalToDo = matchingItems.reduce(
            (sum, item) => sum + toNumber(item.toDo),
            0
          );

          yAcc[yKey] = { stock: totalStock, toDo: totalToDo };
          return yAcc;
        }, {});
        return acc;
      }, {})
    : {};

  const filteredStock = isSelectionValid
    ? Object.values(tableData).reduce((acc, yValues) => {
        return (
          acc +
          Object.values(yValues).reduce(
            (sum, { stock }) => sum + toNumber(stock),
            0
          )
        );
      }, 0)
    : 0;

  const filteredToDo = isSelectionValid
    ? Object.values(tableData).reduce((acc, yValues) => {
        return (
          acc +
          Object.values(yValues).reduce(
            (sum, { toDo }) => sum + toNumber(toDo),
            0
          )
        );
      }, 0)
    : 0;

  /////////////////////////////////

  const handleSelectXChange = (option) => {
    setSelectedXOption(option);
  };

  const handleSelectYChange = (option) => {
    setSelectedYOption(option);
  };

  // Filter options to avoid selecting the same for X and Y
  const getOptionsForX = () => {
    return options
      .map((option) => ({ label: option.label, value: option.value }))
      .filter((opt) => opt.value !== selectedYOption?.value);
  };

  const getOptionsForY = () => {
    return options
      .map((option) => ({ label: option.label, value: option.value }))
      .filter((opt) => opt.value !== selectedXOption?.value);
  };





  return (
    <div className="w-11/12 xl:w-10/12 max-w-7xl mt-4 md:mt-8 m-auto relative flex flex-col gap-6 animate-fade-in pb-32">
      <div className="flex flex-col flex-wrap md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Resumen de Inventario</h1>
          <p className="text-gray-500">Vista detallada de todos los productos y variaciones</p>
        </div>
        <button
          onClick={() => navigate("/inventory")}
          className="btn btn-sm bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 shadow-sm"
        >
          Volver a Inventario
        </button>
      </div>

      {/* Product Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-wrap gap-2 items-center">
        <span className="text-sm font-semibold text-gray-700 mr-2">Filtrar Totales por Productos:</span>
        {uniqueProducts.map(productName => (
          <label key={productName} className="flex items-center gap-2 cursor-pointer bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <input 
              type="checkbox" 
              className="checkbox checkbox-xs" 
              checked={!unselectedProducts.includes(productName)}
              onChange={() => handleCheckboxChange(productName)}
            />
            <span className="text-sm text-gray-700 font-medium leading-none">{capitalizeFirstLetter(productName)}</span>
          </label>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col gap-2 relative overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full opacity-50 z-0 pointer-events-none"></div>
          <h3 className="text-gray-500 font-medium z-10 w-fit">Total en Stock</h3>
          <p className="text-4xl font-bold text-gray-800 z-10">{totalItemsEnStock}</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col gap-2 relative overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-50 rounded-full opacity-50 z-0 pointer-events-none"></div>
          <h3 className="text-gray-500 font-medium z-10 w-fit">Total por Hacer (ToDo)</h3>
          <p className="text-4xl font-bold text-orange-600 z-10">{totalItemsParaHacer}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col gap-2 relative overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-50 rounded-full opacity-50 z-0 pointer-events-none"></div>
          <h3 className="text-gray-500 font-medium z-10 w-fit">Valor Estimado</h3>
          <p className="text-4xl font-bold text-success z-10">€{valorEstimadoStock.toFixed(2)}</p>
        </motion.div>
      </div>

      {/* Selectors for Axes */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 relative z-20">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Configurar Matriz de Resumen</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Eje Vertical (Filas)</label>
            <Select
              inputId="option-X"
              options={getOptionsForX()}
              onChange={handleSelectXChange}
              value={selectedXOption}
              placeholder="Selecciona el criterio para las filas..."
              className="w-full"
              menuPortalTarget={document.body}
              styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Eje Horizontal (Columnas)</label>
            <Select
              inputId="option-Y"
              options={getOptionsForY()}
              onChange={handleSelectYChange}
              value={selectedYOption}
              placeholder="Selecciona el criterio para las columnas..."
              className="w-full"
              menuPortalTarget={document.body}
              styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col relative z-0">
        {/* Table header with filtered stats */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="font-semibold text-gray-700">
            {isSelectionValid ? `Matriz: ${selectedXOption.label} vs ${selectedYOption.label}` : "Selecciona ambos criterios para ver la matriz"}
          </div>
          {isSelectionValid && (
            <div className="flex gap-4 text-sm">
              <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full font-medium">Stock Filtrado: {filteredStock}</span>
              <span className="bg-orange-100 text-orange-800 py-1 px-3 rounded-full font-medium">ToDo Filtrado: {filteredToDo}</span>
            </div>
          )}
        </div>

        {/* The data table */}
        <div className="overflow-x-auto w-full">
          {isSelectionValid ? (
            <table className="table w-full text-sm">
              <thead>
                <tr className="bg-gray-100/50 text-gray-600">
                  <th className="font-semibold rounded-none py-4 border-r border-gray-200 w-32 bg-gray-100 z-10 sticky left-0 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                    {/* Celda vacía en la esquina */}
                  </th>
                  {yAxisKeys.map((yKey) => (
                    <th key={yKey} className="font-semibold py-4 text-center min-w-[120px] whitespace-nowrap">
                      {yKey}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(tableData).map(([xKey, yValues]) => (
                  <tr key={xKey} className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-none">
                    <td className="font-bold text-gray-800 whitespace-nowrap py-3 pr-6 border-r border-gray-200 bg-white sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      {xKey || "-"}
                    </td>
                    {Object.entries(yValues).map(([yKey, { stock, toDo }]) => (
                      <td key={yKey} className="text-gray-600 whitespace-nowrap py-3 text-center border-r border-gray-50 last:border-none">
                         <div className="flex flex-col items-center justify-center gap-1">
                          <span className="font-medium">
                            <span className="text-gray-400 text-xs mr-1">T:</span> 
                            {stock}
                          </span>
                          <span className={`font-semibold ${toDo > 0 ? "text-orange-600" : "text-gray-300"}`}>
                            <span className="text-gray-400 text-xs mr-1 font-normal">H:</span> 
                            {toDo > 0 ? toDo : "-"}
                          </span>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
             <div className="p-12 text-center text-gray-500">
               <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
               </svg>
               <h3 className="mt-2 text-sm font-semibold text-gray-900">No hay matriz seleccionada</h3>
               <p className="mt-1 text-sm text-gray-500">Escoge un criterio para las filas y columnas en los campos superiores.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventorySummary;
