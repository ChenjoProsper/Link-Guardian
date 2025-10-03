// src/components/AddLinkForm.jsx
import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';

const API_URL = 'http://localhost:8000';

// onAdd est une fonction que le parent (LinkList ) nous passera
// pour nous dire de rafraîchir la liste.
function AddLinkForm({ onAdd }) {
    const [url, setUrl] = useState('');
    const [description, setDescription] = useState('');
    const { token } = useContext(AuthContext);

    const handleSubmit = async (event) => {
    event.preventDefault();
    if (!token) return;

    try {
        const newLink = { url, description };
        const config = {
        headers: { Authorization: `Bearer ${token}` }
        };
        await axios.post(`${API_URL}/links/`, newLink, config);

      // Réinitialiser le formulaire
        setUrl('');
        setDescription('');

      // Appeler la fonction du parent pour rafraîchir
        onAdd(); 
    } catch (error) {
        console.error("Erreur lors de l'ajout du lien:", error);
        alert("Impossible d'ajouter le lien.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Ajouter un nouveau lien</h3>
            <div>
                <input
                type="url"
                placeholder="https://exemple.com"
                value={url}
                onChange={(e ) => setUrl(e.target.value)}
                required
                />
            </div>
            <div>
                <input
                type="text"
                placeholder="Description (optionnel)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <button type="submit">Ajouter</button>
        </form>
    );
}

export default AddLinkForm;
