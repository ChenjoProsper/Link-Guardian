import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

function Login(){

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const {login} = useContext(AuthContext);

    const handleSubmit = async (event) =>{

        event.preventDefault();
        await login(email,password);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Connexion</h2>
            <div>
                <label htmlFor="email">Email:</label>
                <input 
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div>
                <label htmlFor="password">password:</label>
                <input 
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Se connecter</button>
        </form>
    );
}


export default Login;