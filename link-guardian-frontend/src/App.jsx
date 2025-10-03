import LinkList from "./components/LinkList.jsx";
import Login from "./components/Login";
import { useContext,useState} from "react";
import Signup from "./components/Signup.jsx"
import { AuthContext } from "./context/AuthContext.jsx";

function App(){

  const {token,logout} = useContext(AuthContext)

  const [isLoginView,setIsLoginView] = useState(true);

  if(token){
    
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
  
  return(
    <div>
      <h1>Link Guardian</h1>
      {isLoginView ?(
        <>
          <Login/>
          <p>
            Pas encore de compte ? {' '}
            <button onClick={()=> setIsLoginView(false)}>
              Inscrivez-vous
            </button>
          </p>
        </>
      ):(
        <>
          <Signup onSignupSucess={() => setIsLoginView(true)} />
          <p>
            Deja un compte ? {' '}
            <button onClick={()=>setIsLoginView(true)}>
              Connectez-vous
            </button>
          </p>
        </>
      )}
    </div>
  )
}

export default App;