import { useContext, useEffect, useState } from "react";
import { InventoryContext } from "../context/InventoryContext";

const Sells = () => {
  const context = useContext(InventoryContext);
  const { data } = context;
  console.log(data);

  const [filteredData, setFilteredData] = useState([]);
  const [enteredData, setEnteredData] = useState("");

  const handleSearchData = (event) => {
    setEnteredData(event.target.value);
  };

//   FILTER FOR SEARCH ITEMS

  useEffect(() => {
    const newList = data.filter((item) => {
      const rest = Object.entries(item).filter(([key]) => key !== "id");
      return rest.some(([, value]) =>
        value.toString().toLowerCase().includes(enteredData.toLowerCase())
      );
    });
    setFilteredData(newList);
  }, [enteredData, data]);

  return (
    <form className="max-w-md mt-5 mx-auto w-4/5">
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
      >
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
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
          className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Escribe algo aquí..."
          value={enteredData}
          onChange={(event) => handleSearchData(event)}
          required
        />
      </div>
    </form>
  );
};

export default Sells;
