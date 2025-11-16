import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';

export default function ListPage({ api }) {
  const [comps, setComps] = useState([]);
  const [projs, setProjs] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => { fetchAll() }, []);

  const fetchAll = async () => {
    const [cRes, pRes] = await Promise.all([
      fetch(`${api}/competences`),
      fetch(`${api}/projets`)
    ]);
    setComps(await cRes.json());
    setProjs(await pRes.json());
  }

  const handleDelete = async (type, id) => {
    if (!user || user.role !== 'admin') return alert('Accès refusé');
    if (!confirm('Supprimer cet élément ?')) return;
    await fetch(`${api}/${type}/${id}`, { method: 'DELETE' });
    fetchAll();
  }

  const AdminButtons = ({ type, id }) => (
    <div className="flex gap-2 mt-auto">
      <Link
        to={`/edit/${type}/${id}`}
        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow text-sm transition"
      >
        Modifier
      </Link>
      <button
        onClick={() => handleDelete(type, id)}
        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow text-sm transition"
      >
        Supprimer
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Mes Compétences et Projets</h1>

      {/* Section Compétences */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">Compétences</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {comps.map(c => (
            <div
              key={c.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 flex flex-col"
            >
              <div className="w-full h-32 overflow-hidden rounded-xl mb-3">
                <img
                  src={c.image || 'https://via.placeholder.com/150'}
                  alt={c.libelle}
                  className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                />
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                <Link to={`/details/competences/${c.id}`} className="hover:text-blue-600 transition">
                  {c.libelle}
                </Link>
              </h3>
              <p className="text-gray-600 text-sm mb-3">{c.niveau}</p>
              {user && user.role === 'admin' && <AdminButtons type="competences" id={c.id} />}
            </div>
          ))}
        </div>
      </section>

      {/* Section Projets */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">Projets</h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projs.map(p => (
            <div
              key={p.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 flex flex-col"
            >
              <div className="w-full h-40 overflow-hidden rounded-xl mb-3">
                <img
                  src={p.image || 'https://via.placeholder.com/300x200'}
                  alt={p.titre}
                  className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                />
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                <Link to={`/details/projets/${p.id}`} className="hover:text-blue-600 transition">
                  {p.titre}
                </Link>
              </h3>
              <p className="text-gray-600 text-sm mb-3">{p.description}</p>
              {user && user.role === 'admin' && <AdminButtons type="projets" id={p.id} />}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
