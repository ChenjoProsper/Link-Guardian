// src/components/LinkList.jsx
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import AddLinkForm from './AddLinkForm.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function LinkList( ) {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useContext(AuthContext);

    const fetchLinks = async () => {
        if (!token) {
        setLoading(false);
        return;
        }
        try {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${API_URL}/links/`, config);
        setLinks(response.data);
        } catch (err) {
        setError('Impossible de charger les liens.');
        console.error("Erreur détaillée:", err);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchLinks();
    }, [token]);

    // 1. NOUVELLE FONCTION : Gérer la suppression
    const handleDelete = async (linkId) => {
        if (!token) return;

        // On demande une confirmation pour éviter les erreurs
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce lien ?")) {
        return;
        }

        try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        // On appelle l'endpoint DELETE de notre API
        await axios.delete(`${API_URL}/links/${linkId}`, config);
        
        // On rafraîchit la liste des liens pour que la suppression soit visible
        fetchLinks(); 
        } catch (error) {
        console.error("Erreur lors de la suppression du lien:", error);
        alert("Impossible de supprimer le lien.");
        }
    };

    if (loading) return <div>Chargement...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div>
        <AddLinkForm onAdd={fetchLinks} />
        <hr />
        <h2>Mes Liens</h2>
        {links.length === 0 ? (
            <p>Aucun lien à afficher pour le moment.</p>
        ) : (
            <ul>
            {links.map(link => (
                <li key={link.id} style={{ marginBottom: '10px' }}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.description || link.url}
                </a>
                <p style={{ margin: '5px 0' }}>
                    Ajouté le: {new Date(link.date_ajout).toLocaleDateString()}
                </p>
                {/* 2. NOUVEAU BOUTON : Le bouton de suppression */}
                <button onClick={() => handleDelete(link.id)}>
                    Supprimer
                </button>
                </li>
            ))}
            </ul>
        )}
        </div>
    );
}

export default LinkList;
