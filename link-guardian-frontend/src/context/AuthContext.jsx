import { Children, createContext, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000";

export const AuthContext = createContext();

export const AuthProvider = ({Children}) => {
    const [token,setToken] = useState(null);
    
    const login = async (email, password) => {
        try{
            const formData = new FormData();
            formData.append('username',email);
            formData.append('password',password);

            const response = await axios.post(`${API_URL}/login/`,formData,{
                headers:{'Content-Type':'multipart/form-data'},
            });

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
            {Children}
        </AuthContext.Provider>
    );

};


