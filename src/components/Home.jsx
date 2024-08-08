import { NavLink } from "react-router-dom";
import createInventoryImage from "../assets/createInventoryImage.jpeg";
import inventoryImage from "../assets/inventoryImage.jpeg";
import salesImage from "../assets/salesImage.jpeg";
import salesRegistryImage from "../assets/salesRegistryImage.jpeg";
import salesChartImage from "../assets/salesChartImage.jpeg";
import expensesImage from "../assets/expensesImage.jpeg";

const Home = () => {
  return (
      <div className=" w-11/12 mx-auto pt-4 flex flex-wrap justify-between pb-28">
          <NavLink
            className="w-1/2 flex flex-col justify-end items-center my-3"
            to="/create-inventory"
          >
            <div className="text-md text-center pb-3 font-thin">Crear inventario</div>
            <div className="w-20">
              <img
                className="rounded-xl border-[1px] border-solid border-black"
                src={createInventoryImage}
                alt="creat-inventory-seccion"
              />
            </div>
          </NavLink>
          <NavLink
            className="w-1/2 flex flex-col justify-end items-center my-3"
            to="/inventory"
          >
            <div className="text-md text-center pb-3 font-thin">Inventario</div>
            <div className="w-20">
              <img
                className="rounded-xl border-[1px] border-solid border-gray-600"
                src={inventoryImage}
                alt="creat-inventory-seccion"
              />
            </div>
          </NavLink>
        <NavLink
          className="w-1/2 flex flex-col justify-end items-center my-3"
          to="/sales-manager"
        >
          <div className="text-md text-center pb-3 font-thin">Vender</div>
          <div className="w-20">
            <img
              className="rounded-xl border-[1px] border-solid border-black"
              src={salesRegistryImage}
              alt="creat-inventory-seccion"
            />
          </div>
        </NavLink>
        <NavLink
          className="w-1/2 flex flex-col justify-end items-center my-3"
          to="/sales-registry"
        >
          <div className="text-md pb-3 text-center font-thin">Registro de ventas</div>
          <div className="w-20">
            <img
              className="rounded-xl border-[1px] border-solid border-gray-600"
              src={salesImage}
              alt="creat-inventory-seccion"
            />
          </div>
        </NavLink>
        <NavLink
          className="w-1/2 flex flex-col justify-end items-center my-3"
          to="/sales-charts"
        >
          <div className="text-md pb-3 text-center font-thin">Gráficos y estadísticas</div>
          <div className="w-20">
            <img
              className="rounded-xl border-[1px] border-solid border-gray-600"
              src={salesChartImage}
              alt="creat-inventory-seccion"
            />
          </div>
        </NavLink>
        <NavLink
          className="w-1/2 flex flex-col justify-end items-center my-3"
          to="/expenses"
        >
          <div className="text-md text-center pb-3 font-thin">Gastos</div>
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
