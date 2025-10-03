import { useState, useEffect } from "react";
import axios from "axios";


// const API_URL = "https://link-guardian-8hqk.onrender.com";

const API_URL = "http://localhost:8000";


const LinkList = () => {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
    const fetchLinks = async () => {
        try {
            const response = await axios.get(`${API_URL}/links/`);
            setLinks(response.data);
        } catch (err) {
            setError(err.message);
            console.error("Error fetching links:", err);
        } finally {
            setLoading(false);
        }
    };

    fetchLinks();
    }, []);

    if (loading) return <div>Loading links...</div>;
    if (error) return <div style={{color:'red'}}>Error loading links: {error}</div>;

    return (
        <div>
            <h2>Mes Links</h2>
            {links.length === 0 ? (
                <p>Pas de liens pour le moment</p>
            ) : (
                <ul>
                    {links.map((link) => (
                        <li key={link.id}>
                            <a href={link.url} target="_blank" rel="noopener noreferrer">
                                {link.description || link.url}
                            </a>
                            <p>Ajouter le: {new Date(link.date_ajout).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LinkList;