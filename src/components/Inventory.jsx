import { useContext } from "react";
import { InventoryContext } from "../context/InventoryContext";

const Inventory = () => {
  const context = useContext(InventoryContext);
  const { data } = context;

  console.log(data);

  return (
    <div>
      {data.length > 0 ? (
        data.map((item) => <h1 key={item.id}>{item.productName}</h1>)
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default Inventory;
