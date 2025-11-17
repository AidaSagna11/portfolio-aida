import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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

  if (!item)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 text-xl">
        Chargement...
      </div>
    );

  return (
    <div
      className="
      min-h-screen 
      flex items-center justify-center 
      p-6 
      bg-gradient-to-br from-[#E0EAFC] to-[#CFDEF3]
    "
    >
      <div
        className="
        w-full max-w-3xl 
        backdrop-blur-xl 
        bg-white/70 
        shadow-xl 
        rounded-3xl 
        p-8 
        border border-white/40
        animate-[fadeIn_0.5s_ease-in-out]
      "
      >
        {/* Image */}
        <div className="w-full h-64 rounded-2xl overflow-hidden shadow-md mb-6">
          <img
            src={item.image || 'https://via.placeholder.com/300x200'}
            alt={item.libelle || item.titre}
            className="
              w-full h-full object-cover 
              transition-transform duration-500 
              hover:scale-110
            "
          />
        </div>

        {/* Titre */}
        <h2 className="text-3xl font-bold mb-3 text-gray-900 tracking-wide">
          {item.libelle || item.titre}
        </h2>

        {/* Description */}
        <p className="text-gray-700 mb-4 leading-relaxed">
          {item.description}
        </p>

        {item.niveau && (
          <p className="text-gray-600 mb-2">
            <strong>Niveau : </strong> {item.niveau}
          </p>
        )}

        {item.techno && item.techno.length > 0 && (
          <p className="text-gray-600 mb-6">
            <strong>Technos : </strong>
            {item.techno.join(", ")}
          </p>
        )}

        {/* Bouton */}
        {item.lien && item.lien.trim() !== "" && (
          <a
            href={item.lien}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-block w-full text-center 
              bg-gradient-to-r from-blue-500 to-indigo-500 
              hover:from-blue-600 hover:to-indigo-600 
              text-white font-semibold 
              py-3 rounded-xl 
              shadow-lg 
              transition transform hover:scale-105
            "
          >
            Voir le projet
          </a>
        )}
      </div>
    </div>
  );
}
