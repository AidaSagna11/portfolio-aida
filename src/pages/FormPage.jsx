import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function FormPage({ api = "http://localhost:4000" }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isProject, setIsProject] = useState(false);
  const [form, setForm] = useState({
    libelle: '',
    niveau: '',
    image: '',
    description: '',
    titre: '',
    lien: '',
    techno: []
  });

  // Charger l’élément en mode édition
  useEffect(() => {
    if (window.location.pathname.includes('/edit')) {
      const splits = window.location.pathname.split('/');
      const t = splits[2];
      const i = splits[3];
      loadItem(t, i);
    }
  }, []);

  const loadItem = async (t, i) => {
    try {
      const res = await fetch(`${api}/${t}/${i}`);
      const data = await res.json();
      setForm({ ...data, techno: data.techno || [] });
      setIsProject(t === 'projets');
    } catch (err) {
      console.error('Erreur chargement:', err);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const endpoint = isProject ? 'projets' : 'competences';

    const payload = isProject
      ? {
          titre: form.titre,
          description: form.description,
          image: form.image,
          lien: form.lien,
          techno: typeof form.techno === 'string'
            ? form.techno.split(',').map(s => s.trim())
            : form.techno
        }
      : {
          libelle: form.libelle,
          niveau: form.niveau,
          image: form.image,
          description: form.description
        };

    try {
      const res = await fetch(`${api}/${endpoint}${form.id ? '/' + form.id : ''}`, {
        method: form.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(await res.text());

      navigate('/list');
    } catch (err) {
      console.error('Erreur submit:', err);
      alert('Erreur lors de l’enregistrement.');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center 
    bg-gradient-to-br from-[#eef2ff] via-[#e0e7ff] to-[#f8fafc] px-4 py-10">

      <div className="w-full max-w-3xl backdrop-blur-xl bg-white/30 border border-white/40 
      shadow-2xl rounded-3xl p-10">

        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {form.id ? 'Modifier' : 'Ajouter'}{" "}
          <span className="text-indigo-600">
            {isProject ? 'un Projet' : 'une Compétence'}
          </span>
        </h2>

        {/* Sélecteur type */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            Type
          </label>
          <select
            onChange={e => setIsProject(e.target.value === 'projets')}
            defaultValue={isProject ? 'projets' : 'competences'}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white shadow-sm 
            focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800"
          >
            <option value="competences">Compétence</option>
            <option value="projets">Projet</option>
          </select>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {isProject ? (
            <>
              <Input label="Titre" name="titre" value={form.titre} onChange={handleChange} />
              <Textarea label="Description" name="description" value={form.description} onChange={handleChange} />
              <Input label="Image (URL)" name="image" value={form.image} onChange={handleChange} />
              <Input
                label="Technologies (séparées par des virgules)"
                name="techno"
                value={Array.isArray(form.techno) ? form.techno.join(', ') : form.techno || ''}
                onChange={handleChange}
              />
              <Input label="Lien du projet" name="lien" value={form.lien} onChange={handleChange} />
            </>
          ) : (
            <>
              <Input label="Libellé" name="libelle" value={form.libelle} onChange={handleChange} />
              <Input label="Niveau" name="niveau" value={form.niveau} onChange={handleChange} />
              <Input label="Image (URL)" name="image" value={form.image} onChange={handleChange} />
              <Textarea label="Description" name="description" value={form.description} onChange={handleChange} />
            </>
          )}

          <button
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-lg rounded-xl
            shadow-lg font-semibold transition-all"
          >
            Enregistrer
          </button>

        </form>
      </div>
    </div>
  );
}


/* --- Composants réutilisables --- */
const Input = ({ label, ...props }) => (
  <div>
    <label className="block mb-1 text-sm font-semibold text-gray-700">{label}</label>
    <input
      {...props}
      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 
      shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none placeholder-gray-400"
    />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="block mb-1 text-sm font-semibold text-gray-700">{label}</label>
    <textarea
      {...props}
      rows="4"
      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 
      shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none placeholder-gray-400"
    />
  </div>
);
