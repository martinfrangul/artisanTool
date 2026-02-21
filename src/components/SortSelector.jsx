const SortSelector = ({
    filters,
    setFilters,
    availableProperties,
    propertyLabels
  }) => {
  
    // Maneja el cambio en la propiedad de orden y la agrega al localStorage para que perdure
    const handleSortChange = (event) => {
      const newSortProperty = event.target.value;
      setFilters((prevFilters) => ({ ...prevFilters, sortProperty: newSortProperty }));
      localStorage.setItem("sortProperty", newSortProperty);
    };
  
    const handleSecondarySortChange = (event) => {
      const newSecondarySortProperty = event.target.value;
      setFilters((prevFilters) => ({ ...prevFilters, secondarySortProperty: newSecondarySortProperty }));
      localStorage.setItem("secondarySortProperty", newSecondarySortProperty);
    };

    const toggleSortOrder = () => {
      const newOrder = filters.sortOrder === "asc" ? "desc" : "asc";
      setFilters((prevFilters) => ({ ...prevFilters, sortOrder: newOrder }));
      localStorage.setItem("sortOrder", newOrder);
    };
  
    const toggleSecondarySortOrder = () => {
      const newOrder = filters.secondarySortOrder === "asc" ? "desc" : "asc";
      setFilters((prevFilters) => ({ ...prevFilters, secondarySortOrder: newOrder }));
      localStorage.setItem("secondarySortOrder", newOrder);
    };
  
    return (
      <div className="w-full flex justify-center mt-2 mb-1">
        <div className="w-11/12 md:w-10/12 flex flex-row items-center justify-center">
          <div className="flex flex-col md:flex-row items-center justify-end w-full gap-3">
            <label htmlFor="sort-property" className="text-gray-600 font-medium text-xs md:text-sm">
              Ordenar por:
            </label>
            <div className="flex items-center gap-1">
              <select
                id="sort-property"
                value={filters.sortProperty}
                onChange={handleSortChange}
                className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs md:text-sm"
              >
                {availableProperties.map((property) => (
                  <option key={property} value={property}>
                    {propertyLabels[property] || property}
                  </option>
                ))}
              </select>
              <button
                onClick={toggleSortOrder}
                className="p-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors text-xs md:text-sm font-bold w-8 flex justify-center"
              >
                {filters.sortOrder === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>
  
          <div className="flex flex-col md:flex-row items-center justify-end w-full gap-3">
            <label htmlFor="secondary-sort-property" className="text-gray-600 font-medium text-xs md:text-sm">
              Luego por:
            </label>
            <div className="flex items-center gap-1">
              <select
                id="secondary-sort-property"
                value={filters.secondarySortProperty}
                onChange={handleSecondarySortChange}
                className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs md:text-sm"
              >
                {availableProperties.map((property) => (
                  <option key={property} value={property}>
                    {propertyLabels[property] || property}
                  </option>
                ))}
              </select>
              <button
                onClick={toggleSecondarySortOrder}
                className="p-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors text-xs md:text-sm font-bold w-8 flex justify-center"
              >
                {filters.secondarySortOrder === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  
  export default SortSelector;
  