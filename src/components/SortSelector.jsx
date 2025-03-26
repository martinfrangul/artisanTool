// Par de selectores para ordenar una lista por dos criterios

const SortSelector = ({
  sortProperty,
  setSortProperty,
  secondarySortProperty,
  setSecondarySortProperty,
  availableProperties,
  propertyLabels
}) => {


  // Maneja el cambio en la propiedad de orden y la agrega al localStorage para que perdure

  const handleSortChange = (event) => {
    const newSortProperty = event.target.value;
    setSortProperty(newSortProperty);
    localStorage.setItem("sortProperty", newSortProperty);
  };

  const handleSecondarySortChange = (event) => {
    const newSecondarySortProperty = event.target.value;
    setSecondarySortProperty(newSecondarySortProperty);
    localStorage.setItem("secondarySortProperty", newSecondarySortProperty);
  };

  return (
    <div className="w-full flex justify-center mt-2 mb-1">
      <div className="w-11/12 md:w-10/12 flex flex-row items-center justify-center">
        
        <div className="flex flex-col md:flex-row items-center justify-end w-full gap-3">
          <label htmlFor="sort-property" className="text-gray-600 font-medium text-xs md:text-sm">
            Ordenar por:
          </label>
          <select
            id="sort-property"
            value={sortProperty}
            onChange={handleSortChange}
            className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs md:text-sm"
          >
            {availableProperties.map((property) => (
              <option key={property} value={property}>
                {propertyLabels[property] || property}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-end w-full gap-3">
          <label htmlFor="secondary-sort-property" className="text-gray-600 font-medium text-xs md:text-sm">
            Luego por:
          </label>
          <select
            id="secondary-sort-property"
            value={secondarySortProperty}
            onChange={handleSecondarySortChange}
            className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs md:text-sm"
          >
            {availableProperties.map((property) => (
              <option key={property} value={property}>
                {propertyLabels[property] || property}
              </option>
            ))}
          </select>
        </div>
        
      </div>
    </div>
  );
};

export default SortSelector;
