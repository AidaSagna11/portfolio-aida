import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function FormPage({api}){
  const { id, type } = useParams()
  const navigate = useNavigate()
  const [isProject, setIsProject] = useState(false)
  const [form, setForm] = useState({ libelle: '', niveau: '', image: '', description: '', titre: '', lien:'', techno:[] })

  useEffect(()=>{
    if(window.location.pathname.includes('/edit')){
      const splits = window.location.pathname.split('/')
      const t = splits[2] // edit/:type/:id
      const i = splits[3]
      loadItem(t,i)
    }
  },[])

  const loadItem = async (t,i)=>{
    const res = await fetch(`${api}/${t}/${i}`)
    const data = await res.json()
    setForm(data)
    setIsProject(t==='projets')
  }

  const handleChange = e =>{
    const { name, value } = e.target
    setForm(prev=>({ ...prev, [name]: value }))
  }

  const handleSubmit = async e =>{
    e.preventDefault()
    const endpoint = isProject ? 'projets' : 'competences'
    const payload = isProject ? { titre: form.titre, description: form.description, image: form.image, lien: form.lien, techno: form.techno ? form.techno.split(',').map(s=>s.trim()) : [] } : { libelle: form.libelle, niveau: form.niveau, image: form.image, description: form.description }

    try{
      if(form.id){
        await fetch(`${api}/${endpoint}/${form.id}`, { method: 'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
      }else{
        await fetch(`${api}/${endpoint}`, { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
      }
      navigate('/list')
    }catch(err){ alert('Erreur lors de l enregistrement') }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">{form.id ? 'Modifier' : 'Ajouter'} {isProject ? 'Projet' : 'Compétence'}</h2>

      <div className="mb-4">
        <label className="block text-sm">Type</label>
        <select onChange={e=>setIsProject(e.target.value==='projets')} defaultValue={isProject ? 'projets' : 'competences'} className="border p-2 rounded">
          <option value="competences">Compétence</option>
          <option value="projets">Projet</option>
        </select>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {isProject ? (
          <>
            <div>
              <label className="block text-sm">Titre</label>
              <input name="titre" value={form.titre||''} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm">Description</label>
              <textarea name="description" value={form.description||''} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm">Image (URL)</label>
              <input name="image" value={form.image||''} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm">Technos (séparées par des virgules)</label>
              <input name="techno" value={form.techno||''} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm">Lien du projet</label>
              <input name="lien" value={form.lien||''} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm">Libellé</label>
              <input name="libelle" value={form.libelle||''} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm">Niveau</label>
              <input name="niveau" value={form.niveau||''} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm">Image (URL)</label>
              <input name="image" value={form.image||''} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm">Description</label>
              <textarea name="description" value={form.description||''} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
          </>
        )}

        <div>
          <button className="px-4 py-2 bg-green-600 text-white rounded">Enregistrer</button>
        </div>
      </form>
    </div>
  )
}
