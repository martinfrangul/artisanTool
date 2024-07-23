import { useState, useContext } from "react";
import { InventoryContext } from "../context/InventoryContext";

// Map of readable names
const propertyLabels = {
  design: "Diseño",
  size: "Tamaño",
  color: "Color",
  type: "Tipo",
  model: "Modelo",
  productName: "Nombre del Producto",
  productStock: "Stock",
  productPrice: "Precio",
};

const Inventory = () => {
  const context = useContext(InventoryContext);
  const { data } = context;

  // State of sort property
  const [sortProperty, setSortProperty] = useState("productName");

  // Get the available properties
  const getAvailableProperties = () => {
    const properties = new Set();
    data.forEach(item => {
      Object.keys(item).forEach(key => {
        if (key !== "id" && key !== "productName" && key !== "productStock" && key !== "productPrice") {
          properties.add(key);
        }
      });
    });
    return Array.from(properties);
  };

  // Get properties
  const availableProperties = ["productName", "productStock", "productPrice", ...getAvailableProperties()];

  // Ordenar los items según la propiedad seleccionada
  const sortedData = data.slice().sort((a, b) => {
    // Si alguno de los items no tiene el valor de la propiedad seleccionada
    if (a[sortProperty] === undefined) return 1;
    if (b[sortProperty] === undefined) return -1;

    // Comparar los valores de la propiedad seleccionada
    if (a[sortProperty] < b[sortProperty]) {
      return -1;
    }
    if (a[sortProperty] > b[sortProperty]) {
      return 1;
    }
    return 0;
  });

  // Maneja el cambio en la propiedad de orden
  const handleSortChange = (event) => {
    setSortProperty(event.target.value);
  };

  return (
    <div>
      {/* Dropdown para seleccionar la propiedad de orden */}
      <div className="flex flex-row justify-center items-center my-3">
        <label htmlFor="sort-property">Ordenar por:</label>
        <select
          id="sort-property"
          onChange={handleSortChange}
          value={sortProperty}
        >
          {availableProperties.map((property) => (
            <option key={property} value={property}>
              {propertyLabels[property] || property}
            </option>
          ))}
        </select>
      </div>

      {sortedData.length > 0 ? (
        sortedData.map((item) => (
          <div
            key={item.id}
            className="flex flex-row justify-between items-start pb-5 px-2 pt-2 border-b-[1px] border-solid border-black"
          >
            <div className="flex flex-col justify-start items-start">
              <h1 className="text-xl font-bold">{item.productName}</h1>
              {item.design && <h1><strong>{propertyLabels.design}: </strong>{item.design}</h1>}
              {item.size && <h1><strong>{propertyLabels.size}: </strong>{item.size}</h1>}
              {item.color && <h1><strong>{propertyLabels.color}: </strong>{item.color}</h1>}
              {item.type && <h1><strong>{propertyLabels.type}: </strong>{item.type}</h1>}
              {item.model && <h1><strong>{propertyLabels.model}: </strong>{item.model}</h1>}
            </div>

            <div className="flex flex-col">
              <h3 className="text-md font-semibold">
                {propertyLabels.productStock}: <strong>{item.productStock}</strong>
              </h3>
              <h3 className="text-md font-semibold">
                {propertyLabels.productPrice}: <strong>€{item.productPrice}</strong>
              </h3>
            </div>
          </div>
        ))
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default Inventory;
