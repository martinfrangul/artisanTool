import { useState } from "react";

const FilterWithTags = ({ filters, setFilters }) => {
  const [enteredData, setEnteredData] = useState(""); // Para la entrada de tags

  // Función para manejar la adición de un tag
  const handleAddTag = (event) => {
    event.preventDefault();
    if (enteredData && !filters.tags.includes(enteredData)) {
      const updatedTags = [...filters.tags, enteredData];
      setFilters((prevFilters) => ({ ...prevFilters, tags: updatedTags })); // Usa handleTagChange
      setEnteredData(""); // Limpiar el campo de búsqueda
    }
  };

  // Función para manejar la eliminación de un tag
  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = filters.tags.filter((tag) => tag !== tagToRemove);
    setFilters((prevFilters) => ({ ...prevFilters, tags: updatedTags })); // Usa handleTagChange
  };

  return (
    <div className="flex flex-col w-full gap-2">
      {/* Barra de búsqueda de tags */}
      <form
        onSubmit={handleAddTag}
        className="max-w-md mt-2 mx-auto w-4/5 mb-2"
      >
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only"
        >
          Buscar por Tags
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-gray-900 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-khaki focus:border-khaki"
            placeholder="Ingresa algún tag..."
            value={enteredData}
            onChange={(e) => setEnteredData(e.target.value)} // Actualizamos el valor de la entrada
            required
          />
        </div>
        {/* Agregar un botón pequeño para limpiar todos los tags sólo si hay tags*/}
        {filters.tags.length > 0 && (
          <div className="flex justify-start mt-2">
            <button
              type="button"
              onClick={() =>
                setFilters((prevFilters) => ({ ...prevFilters, tags: [] }))
              } // Limpiar todos los tags
              className="text-sm text-danger font-semibold"
            >
              Limpiar tags
            </button>
          </div>
        )}
      </form>

      {/* Muestra los tags añadidos */}
      {filters.tags.length > 0 && (
        <div className="w-11/12 mx-auto">
          <div className="flex flex-wrap items-start justify-start gap-2 mb-2 w-full">
            {filters.tags.map((tag, index) => (
              <div
                key={index}
                className="bg-banner text-gray-800 font-medium rounded-lg flex items-center gap-2 px-3 py-1.5 group"
              >
                <span className="text-sm">{tag}</span>
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 hover:bg-danger hover:text-white transition-all"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterWithTags;
