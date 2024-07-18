import { NavLink } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <NavLink className="font-bold" to="/create-inventory">
        Create Inventory
      </NavLink>
      <NavLink className="font-bold" to="/inventory">
        Inventory
      </NavLink>
    </div>
  );
};

export default Home;
