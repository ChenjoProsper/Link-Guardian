import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function Signup({onSignupSucess}){
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [error,setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        try{

            const newUser = {email,password};

            await axios.post(`${API_URL}/sigin`,newUser);

            alert('Inscription reussite')
            onSignupSucess();


        }catch(err){

            if(err.reponse && err.reponse.data && err.reponse.data.detail ){
                setError(err.reponse.data.detail);
            }else{
                setError('Une erreur est survenue lors de l\'inscription')
            }
            console.error("Erreur d'inscription",err);

        }
    };
    return(
        <form onSubmit={handleSubmit}>
            <h2>Inscription</h2>
            {error && <p style={{color: 'red'}}>{error}</p> }
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
            <button type="submit">S'inscrire</button>
        </form>
    );
}

export default Signup;
