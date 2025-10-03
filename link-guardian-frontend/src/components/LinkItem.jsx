// src/components/LinkItem.jsx
import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function LinkItem({ link, onDelete, onUpdate } ) {
    const { token } = useContext(AuthContext);
    
    // Nouvel état pour savoir si on est en mode édition
    const [isEditing, setIsEditing] = useState(false);
    // Nouveaux états pour stocker les valeurs du formulaire de modification
    const [editedUrl, setEditedUrl] = useState(link.url);
    const [editedDescription, setEditedDescription] = useState(link.description);

    const handleDelete = () => {
        onDelete(link.id);
    };

// Dans src/components/LinkItem.jsx

    const handleUpdate = async (event) => {
    event.preventDefault();
    if (!token) return;

    // --- DÉBUT DES LOGS DE DÉBOGAGE ---
    console.log("--- Début de la mise à jour ---");
    console.log("ID du lien:", link.id);
    
    const updatedLink = { url: editedUrl, description: editedDescription };
    console.log("Données envoyées:", updatedLink);

    const config = { headers: { Authorization: `Bearer ${token}` } };
    console.log("Configuration Axios:", config);
    // --- FIN DES LOGS DE DÉBOGAGE ---

    try {
        await axios.put(`${API_URL}/links/${link.id}`, updatedLink, config);
        
        setIsEditing(false);
        onUpdate();
    } catch (error) {
        // On logue l'erreur complète pour avoir tous les détails
        console.error("Erreur détaillée lors de la mise à jour:", error);
        alert("Impossible de mettre à jour le lien.");
    }
    };


    if (isEditing) {
        // Vue en mode ÉDITION
        return (
        <li style={{ backgroundColor: '#eef' }}>
            <form onSubmit={handleUpdate}>
            <input
                type="url"
                value={editedUrl}
                onChange={(e) => setEditedUrl(e.target.value)}
                required
            />
            <input
                type="text"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit">Enregistrer</button>
                <button type="button" onClick={() => setIsEditing(false)}>Annuler</button>
            </div>
            </form>
        </li>
        );
    }

    // Vue par DÉFAUT
    return (
        <li style={{ marginBottom: '10px' }}>
        <a href={link.url} target="_blank" rel="noopener noreferrer">
            {link.description || link.url}
        </a>
        <p style={{ margin: '5px 0' }}>
            Ajouté le: {new Date(link.date_ajout).toLocaleDateString()}
        </p>
        <div style={{ display: 'flex', gap: '10px', alignSelf: 'flex-end' }}>
            <button onClick={() => setIsEditing(true)}>Modifier</button>
            <button onClick={handleDelete} style={{ backgroundColor: '#dc3545' }}>
            Supprimer
            </button>
        </div>
        </li>
    );
}

export default LinkItem;
