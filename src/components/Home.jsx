import { NavLink } from "react-router-dom";
import createInventoryImage from "../assets/createInventoryImage.jpeg";
import inventoryImage from "../assets/inventoryImage.jpeg";
import sellsImage from "../assets/sellsImage.jpeg";
import historyImage from "../assets/historyImage.jpeg";
import expensesImage from "../assets/expensesImage.jpeg";

const Home = () => {
  return (
      <div className=" w-4/5 mx-auto flex flex-wrap justify-between">
        <NavLink
          className="w-1/2 flex flex-col justify-center items-center my-3"
          to="/create-inventory"
        >
          <div className="text-md p-3 font-thin">Create Inventory</div>
          <div className="w-20">
            <img
              className="rounded-xl border-[1px] border-solid border-black"
              src={createInventoryImage}
              alt="creat-inventory-seccion"
            />
          </div>
        </NavLink>
        <NavLink
          className="w-1/2 flex flex-col justify-center items-center my-3"
          to="/inventory"
        >
          <div className="text-md p-3 font-thin">Inventory</div>
          <div className="w-20">
            <img
              className="rounded-xl border-[1px] border-solid border-gray-600"
              src={inventoryImage}
              alt="creat-inventory-seccion"
            />
          </div>
        </NavLink>
        <NavLink
          className="w-1/2 flex flex-col justify-center items-center my-3"
          to="/sells"
        >
          <div className="text-md p-3 font-thin">Sells</div>
          <div className="w-20">
            <img
              className="rounded-xl border-[1px] border-solid border-black"
              src={sellsImage}
              alt="creat-inventory-seccion"
            />
          </div>
        </NavLink>
        <NavLink
          className="w-1/2 flex flex-col justify-center items-center my-3"
          to="/history"
        >
          <div className="text-md p-3 font-thin">History</div>
          <div className="w-20">
            <img
              className="rounded-xl border-[1px] border-solid border-gray-600"
              src={historyImage}
              alt="creat-inventory-seccion"
            />
          </div>
        </NavLink>
        <NavLink
          className="w-full flex flex-col justify-center items-center my-3"
          to="/expenses"
        >
          <div className="text-md p-3 font-thin">Expenses</div>
          <div className="w-20">
            <img
              className="rounded-xl border-[1px] border-solid border-gray-600"
              src={expensesImage}
              alt="creat-inventory-seccion"
            />
          </div>
        </NavLink>
      </div>
  );
};

export default Home;
