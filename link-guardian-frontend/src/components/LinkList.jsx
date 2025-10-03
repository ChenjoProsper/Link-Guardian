// src/components/LinkList.jsx
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import AddLinkForm from './AddLinkForm.jsx';
import LinkItem from './LinkItem.jsx'; // On importe notre nouveau composant

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function LinkList( ) {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchLinks = async () => {
        // ... (la fonction fetchLinks ne change pas) ...
        if (!token) { setLoading(false); return; }
        try {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${API_URL}/links/`, config);
        setLinks(response.data);
        } catch (err) {
        setError('Impossible de charger les liens.');
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchLinks();
    }, [token]);

    const handleDelete = async (linkId) => {
        // ... (la fonction handleDelete ne change pas) ...
        if (!token) return;
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce lien ?")) return;
        try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(`${API_URL}/links/${linkId}`, config);
        fetchLinks(); 
        } catch (error) {
        alert("Impossible de supprimer le lien.");
        }
    };

    const filteredLinks = links.filter(link => 
        (link.description && link.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        link.url.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div>Chargement...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div>
        <AddLinkForm onAdd={fetchLinks} />
        <hr />
        <h2>Mes Liens</h2>
        <div style={{ margin: '20px 0' }}>
            <input
            type="text"
            placeholder="Rechercher dans les liens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box' }}
            />
        </div>
        {filteredLinks.length === 0 ? (
            <p>{links.length === 0 ? "Aucun lien à afficher." : "Aucun lien ne correspond à votre recherche."}</p>
        ) : (
            <ul>
            {/* On utilise le composant LinkItem ici */}
            {filteredLinks.map(link => (
                <LinkItem 
                key={link.id} 
                link={link} 
                onDelete={handleDelete} 
                onUpdate={fetchLinks} // On rafraîchit toute la liste après une mise à jour
                />
            ))}
            </ul>
        )}
        </div>
    );
}

export default LinkList;
