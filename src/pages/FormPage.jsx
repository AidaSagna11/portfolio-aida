import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function FormPage({ api = "http://localhost:4000" }) {
  const { id } = useParams()
  const navigate = useNavigate()

  const [isProject, setIsProject] = useState(false)
  const [form, setForm] = useState({
    libelle: '',
    niveau: '',
    image: '',
    description: '',
    titre: '',
    lien: '',
    techno: []
  })

  // Charger un projet/compétence pour modification
  useEffect(() => {
    if (window.location.pathname.includes('/edit')) {
      const splits = window.location.pathname.split('/')
      const t = splits[2]
      const i = splits[3]
      loadItem(t, i)
    }
  }, [])

  const loadItem = async (t, i) => {
    try {
      const res = await fetch(`${api}/${t}/${i}`)
      const data = await res.json()
      setForm({ ...data, techno: data.techno || [] })
      setIsProject(t === 'projets')
    } catch (err) {
      console.error('Erreur chargement:', err)
    }
  }

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    const endpoint = isProject ? 'projets' : 'competences'

    // Création du payload
    const payload = isProject
      ? {
          titre: form.titre,
          description: form.description,
          image: form.image,
          lien: form.lien,
          techno:
            typeof form.techno === 'string'
              ? form.techno.split(',').map(s => s.trim())
              : form.techno
        }
      : {
          libelle: form.libelle,
          niveau: form.niveau,
          image: form.image,
          description: form.description
        }

    console.log('Payload envoyé:', payload)

    try {
      const res = await fetch(`${api}/${endpoint}${form.id ? '/' + form.id : ''}`, {
        method: form.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Erreur serveur: ${res.status} - ${text}`)
      }

      const data = await res.json()
      console.log('Réponse serveur:', data)
      navigate('/list')
    } catch (err) {
      console.error('Erreur fetch:', err)
      alert('Erreur lors de l’enregistrement. Voir console.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8 border border-gray-200">

        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {form.id ? 'Modifier' : 'Ajouter'}{' '}
          <span className="text-blue-600">{isProject ? 'un Projet' : 'une Compétence'}</span>
        </h2>

        {/* Sélecteur type */}
        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium">Type</label>
          <select
            onChange={e => setIsProject(e.target.value === 'projets')}
            defaultValue={isProject ? 'projets' : 'competences'}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="competences">Compétence</option>
            <option value="projets">Projet</option>
          </select>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {isProject ? (
            <>
              <Input label="Titre" name="titre" value={form.titre} onChange={handleChange} />
              <Textarea label="Description" name="description" value={form.description} onChange={handleChange} />
              <Input label="Image (URL)" name="image" value={form.image} onChange={handleChange} />
              <Input
                label="Technos (séparées par des virgules)"
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

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl shadow-md font-semibold transition">
            Enregistrer
          </button>
        </form>
      </div>
    </div>
  )
}

/* --- Composants réutilisables --- */
const Input = ({ label, ...props }) => (
  <div>
    <label className="block mb-1 text-sm font-medium">{label}</label>
    <input
      {...props}
      className="w-full border rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
    />
  </div>
)

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="block mb-1 text-sm font-medium">{label}</label>
    <textarea
      {...props}
      rows="4"
      className="w-full border rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
    />
  </div>
)
