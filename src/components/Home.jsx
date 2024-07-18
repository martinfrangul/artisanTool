import { AuthContext } from "../context/AuthContext";
import { InventoryContext } from "../context/InventoryContext";
import { useContext } from "react";


const Home = () => {

    const AuthContextCall = useContext(AuthContext);
    const InventoryContexCall = useContext(InventoryContext);

    const { logOut } = AuthContextCall
    const {input1, input2, setInput1, setInput2} = InventoryContexCall;


    console.log(input1);

    return (
        <div>
            <h1>HOME</h1>
            <input onChange={(event) => setInput1(event.target.value)} type="text" value={input1}/>
            <input onChange={(event) => setInput2(event.target.value)} type="text" value={input2}/>
            <button onClick={logOut}>
                Logout

            </button>
        </div>
    );
}
 
export default Home;