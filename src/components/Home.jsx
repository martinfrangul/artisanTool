import { NavLink } from "react-router-dom";

const Home = () => {
  return (
    <NavLink className="font-bold"
    to="/create-inventory">Create Inventory</NavLink>
  )
};

export default Home;
