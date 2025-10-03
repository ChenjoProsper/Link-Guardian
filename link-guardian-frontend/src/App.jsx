import LinkList from "./components/LinkList.jsx";
import Login from "./components/Login";
import { useContext} from "react";
import { AuthContext } from "./context/AuthContext.jsx";


function App(){

  const {token,logout} = useContext(AuthContext)

  return (
    <div>
      <h1>Link Guardian</h1>
      {token ? (
        <div>
          <button onClick={logout}>Se deconnecter</button>
          <LinkList/>
        </div>
      ) : (
          <Login/>
      )}
    </div>
  );
}

export default App;