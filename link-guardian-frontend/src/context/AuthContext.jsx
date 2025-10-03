import { createContext, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';


export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [token,setToken] = useState(null);
    
    const login = async (email, password) => {
        try{
            const userCredential = {
                email: email,
                password: password,
            }

            const response = await axios.post(`${API_URL}/login`,userCredential);

            const newToken = response.data.access_token;
            setToken(newToken);
            console.log("Connexion reussite, token obtenu !");
        }catch(error){
            console.log("Erreur lord de la connexion:",error);
        }
    };
    const logout = () =>{
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{token,login,logout}}>
            {children}
        </AuthContext.Provider>
    );

};


