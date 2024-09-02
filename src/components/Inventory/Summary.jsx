import { useState, useContext } from "react";
import { DataContext } from "../../context/DataContext";
import PropTypes from "prop-types";
import Select from "react-select";

const Summary = ({ setIsModalSummaryVisible }) => {
  const [selectedXOption, setSelectedXOption] = useState(null);
  const [selectedYOption, setSelectedYOption] = useState(null);

  const context = useContext(DataContext);
  const { inventoryData, options } = context;

  const isSelectionValid = selectedXOption && selectedYOption;

  const xAxisKeys = isSelectionValid
    ? [...new Set(inventoryData
        .map(item => item[selectedXOption.value])
        .filter(xKey => xKey !== undefined && xKey !== null))]
    : [];

  const yAxisKeys = isSelectionValid
    ? [...new Set(inventoryData
        .map(item => item[selectedYOption.value])
        .filter(yKey => yKey !== undefined && yKey !== null))]
    : [];

  const tableData = isSelectionValid
    ? xAxisKeys.reduce((acc, xKey) => {
        acc[xKey] = yAxisKeys.reduce((yAcc, yKey) => {
          const matchingItems = inventoryData.filter(
            item =>
              item[selectedXOption.value] === xKey &&
              item[selectedYOption.value] === yKey
          );

          const totalStock = matchingItems.reduce((sum, item) => sum + item.productStock, 0);
          const totalToDo = matchingItems.reduce((sum, item) => sum + item.toDo, 0);

          yAcc[yKey] = { stock: totalStock, toDo: totalToDo };
          return yAcc;
        }, {});
        return acc;
      }, {})
    : {};

  const totalStock = isSelectionValid
    ? Object.values(tableData).reduce((acc, yValues) => {
        return acc + Object.values(yValues).reduce((sum, { stock }) => sum + stock, 0);
      }, 0)
    : 0;

  const totalToDo = isSelectionValid
    ? Object.values(tableData).reduce((acc, yValues) => {
        return acc + Object.values(yValues).reduce((sum, { toDo }) => sum + toDo, 0);
      }, 0)
    : 0;

  const handleModalToggle = (closeModal) => {
    setIsModalSummaryVisible(closeModal);
  };

  const handleSelectXChange = (option) => {
    setSelectedXOption(option);
  };

  const handleSelectYChange = (option) => {
    setSelectedYOption(option);
  };

  return (
    <div
      id="summary-modal"
      tabIndex="-1"
      className="fixed inset-0 z-50 flex justify-center items-center w-full h-full overflow-auto backdrop-blur-sm"
    >
      <div className="relative p-4 w-full max-w-md sm:max-w-2xl max-h-[90vh] min-h-[50vh] bg-gray-100 rounded-lg border border-gray-700 overflow-auto">
        <div className="flex justify-end">
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
            onClick={() => handleModalToggle(false)}
          >
            <svg
              className="w-3 h-3"
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
            <span className="sr-only">Cerrar modal</span>
          </button>
        </div>

        <div className="mb-4">
          <Select
            inputId={"option-X"}
            options={options.map((option) => ({
              label: option.label,
              value: option.value,
            }))}
            onChange={handleSelectXChange}
            value={selectedXOption}
            className="w-full py-2"
          />
        </div>
        <div className="mb-4">
          <Select
            inputId={"option-Y"}
            options={options.map((option) => ({
              label: option.label,
              value: option.value,
            }))}
            onChange={handleSelectYChange}
            value={selectedYOption}
            className="w-full py-2"
          />
        </div>

        {isSelectionValid && (
          <div className="mb-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700">
              Resumen Total
            </h3>
            <p className="text-sm text-gray-600">Stock en total: {totalStock}</p>
            <p className="text-sm text-gray-600">Hacer en total: {totalToDo}</p>
          </div>
        )}

        {isSelectionValid ? (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {/* Casillero vacío */}
                  </th>
                  {yAxisKeys.map((yKey) => (
                    <th
                      key={yKey}
                      className="px-4 py-2 border-b bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {yKey}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(tableData).map(([xKey, yValues]) => (
                  <tr key={xKey}>
                    <td className="px-4 py-2 border-b text-sm font-medium text-gray-700">
                      {xKey || "-"}
                    </td>
                    {Object.entries(yValues).map(
                      ([yKey, { stock, toDo }]) => (
                        <td
                          key={yKey}
                          className="px-4 py-2 border-b text-sm text-gray-500 whitespace-nowrap"
                        >
                          <div className="flex flex-col items-start">
                            <span>Stock: {stock}</span>
                            <span>Hacer: {toDo}</span>
                          </div>
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-4 text-center text-gray-500">
            Por favor, selecciona ambos criterios para generar la tabla.
          </div>
        )}
      </div>
    </div>
  );
};

Summary.propTypes = {
  setIsModalSummaryVisible: PropTypes.func.isRequired,
};

export default Summary;
