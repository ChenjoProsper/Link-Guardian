// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react'; // 1. Importer useEffect
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const AuthContext = createContext( );

export const AuthProvider = ({ children }) => {
  // 2. Initialiser le token en lisant depuis le localStorage
    const [token, setToken] = useState(localStorage.getItem('authToken'));

    // 3. NOUVEAU : Un useEffect pour synchroniser l'état avec le localStorage
    useEffect(() => {
        if (token) {
        // Si on a un token, on le stocke
        localStorage.setItem('authToken', token);
        } else {
        // Sinon (à la déconnexion), on le supprime
        localStorage.removeItem('authToken');
        }
    }, [token]); // Cet effet se déclenche à chaque fois que le token change

    const login = async (email, password) => {
        try {
        const userCredentials = { email, password };
        const response = await axios.post(`${API_URL}/login`, userCredentials);
        const newToken = response.data.access_token;
        
        // En mettant à jour l'état, on déclenche le useEffect qui va sauvegarder
        setToken(newToken); 
        console.log("Connexion réussie, token sauvegardé dans localStorage !");

        } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        // Réinitialiser le token en cas d'échec pour être sûr
        setToken(null); 
        }
    };

    const logout = () => {
        // En mettant le token à null, on déclenche le useEffect qui va nettoyer
        setToken(null); 
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
};
