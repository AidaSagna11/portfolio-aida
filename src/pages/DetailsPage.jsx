import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function DetailsPage({ api }) {
  const { type, id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    if (id) fetchItem();
  }, [id]);

  const fetchItem = async () => {
    const res = await fetch(`${api}/${type}/${id}`);
    setItem(await res.json());
  };

  if (!item) return <div className="text-center mt-10">Chargement...</div>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg max-w-2xl mx-auto mt-8 border border-gray-200 transition hover:shadow-2xl">
      
      {/* Image */}
      <div className="w-full h-64 overflow-hidden rounded-xl mb-4">
        <img
          src={item.image || 'https://via.placeholder.com/300x200'}
          alt={item.libelle || item.titre}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Titre */}
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{item.libelle || item.titre}</h2>

      {/* Description */}
      <p className="text-gray-600 mb-2">{item.description}</p>
      {item.niveau && <p className="text-gray-600 mb-2"><strong>Niveau:</strong> {item.niveau}</p>}
      {item.techno && <p className="text-gray-600 mb-4"><strong>Technos:</strong> {item.techno.join(', ')}</p>}

      {/* Bouton Voir le projet */}
      {item.lien && item.lien.trim() !== '' && (
        <a
          href={item.lien}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-4 py-2 rounded-lg shadow-lg transition transform hover:scale-105"
        >
          Voir le projet
        </a>
      )}
    </div>
  );
}
