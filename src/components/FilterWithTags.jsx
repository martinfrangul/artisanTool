import { useState } from "react";

const FilterWithTags = ({ inventoryData, setFilteredData }) => {
  const [enteredData, setEnteredData] = useState(""); // Para la entrada de tags
  const [tags, setTags] = useState([]); // Los tags que se añadirán

  // Función para manejar la adición de un tag
  const handleAddTag = (event) => {
    event.preventDefault();
    if (enteredData && !tags.includes(enteredData)) {
      const updatedTags = [...tags, enteredData];
      setTags(updatedTags);
      setEnteredData(""); // Limpiar el campo de búsqueda
      updateFilteredData(updatedTags); // Actualizamos los datos filtrados
    }
  };

  // Función para manejar la eliminación de un tag
  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
    updateFilteredData(updatedTags); // Actualizamos los datos filtrados
  };

  // Función para actualizar los datos filtrados según los tags
  const updateFilteredData = (tags) => {
    let filteredData = inventoryData;

    // Filtrar los productos que coinciden con todos los tags
    if (tags.length > 0) {
      filteredData = filteredData.filter((item) =>
        tags.every((tag) =>
          Object.values(item).some((value) =>
            value.toString().toLowerCase().includes(tag.toLowerCase())
          )
        )
      );
    }

    setFilteredData(filteredData); // Pasamos los datos filtrados al componente principal
  };

  return (
    <div className="filters-container">
      {/* Barra de búsqueda de tags */}
      <form onSubmit={handleAddTag} className="max-w-md mt-5 mx-auto w-4/5 mb-5">
        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">
          Buscar por Tags
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
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
      </form>

      {/* Muestra los tags añadidos */}
      <div className="w-11/12 md:w-6/12 lg:w-5/12 xl:w-4/12 m-auto">
        <div className="flex flex-row gap-3 mb-3">
          {tags.map((tag, index) => (
            <div className="bg-black text-navbar font-semibold rounded-md w-fit p-2 bg-opacity-10" key={index}>
              <h3>
                {tag} <button onClick={() => handleRemoveTag(tag)}>x</button>
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterWithTags;
