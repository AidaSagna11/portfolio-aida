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
  };

  const handleDelete = async (type, id) => {
    if (!user || user.role !== 'admin') return alert('Accès refusé');
    if (!confirm('Supprimer cet élément ?')) return;
    await fetch(`${api}/${type}/${id}`, { method: 'DELETE' });
    fetchAll();
  };

  const AdminButtons = ({ type, id }) => (
    <div className="flex gap-3 mt-auto">
      <Link
        to={`/edit/${type}/${id}`}
        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md text-sm transition-all"
      >
        Modifier
      </Link>
      <button
        onClick={() => handleDelete(type, id)}
        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md text-sm transition-all"
      >
        Supprimer
      </button>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#f8fafc] via-[#eef2ff] to-[#e0e7ff] py-16 px-6 pt-28">

      {/* Title */}
      <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-12 tracking-tight">
        Tableau de bord — Compétences & Projets
      </h1>

      {/* ======= COMPÉTENCES ======= */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Compétences</h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {comps.map(c => (
            <div
              key={c.id}
              className="backdrop-blur-xl bg-white/30 shadow-lg hover:shadow-2xl transition-all rounded-3xl p-5 flex flex-col border border-white/40"
            >
              <div className="w-full h-36 overflow-hidden rounded-xl mb-4">
                <img
                  src={c.image || 'https://via.placeholder.com/150'}
                  alt={c.libelle}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              <h3 className="font-bold text-lg text-gray-900 mb-1">
                <Link 
                  to={`/details/competences/${c.id}`}
                  className="hover:text-indigo-600 transition"
                >
                  {c.libelle}
                </Link>
              </h3>

              <p className="text-gray-700 text-sm mb-4">{c.niveau}</p>

              {user && user.role === 'admin' && <AdminButtons type="competences" id={c.id} />}
            </div>
          ))}
        </div>
      </section>

      {/* ======= PROJETS ======= */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Projets</h2>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projs.map(p => (
            <div
              key={p.id}
              className="backdrop-blur-xl bg-white/30 shadow-lg hover:shadow-2xl transition-all rounded-3xl p-5 flex flex-col border border-white/40"
            >
              <div className="w-full h-40 overflow-hidden rounded-xl mb-4">
                <img
                  src={p.image || 'https://via.placeholder.com/300x200'}
                  alt={p.titre}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              <h3 className="font-bold text-lg text-gray-900 mb-1">
                <Link 
                  to={`/details/projets/${p.id}`} 
                  className="hover:text-indigo-600 transition"
                >
                  {p.titre}
                </Link>
              </h3>

              <p className="text-gray-700 text-sm mb-4">{p.description}</p>

              {user && user.role === 'admin' && <AdminButtons type="projets" id={p.id} />}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
