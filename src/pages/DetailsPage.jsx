import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function DetailsPage({api}){
  const { type, id } = useParams()
  const [item, setItem] = useState(null)

  useEffect(()=>{ if(id) fetchItem() },[id])
  const fetchItem = async ()=>{
    const res = await fetch(`${api}/${type}/${id}`)
    setItem(await res.json())
  }

  if(!item) return <div>Chargement...</div>
  return (
    <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto">
      <img src={item.image} className="w-full h-64 object-cover rounded mb-4" />
      <h2 className="text-2xl font-bold mb-2">{item.libelle || item.titre}</h2>
      <p className="mb-2">{item.description}</p>
      {item.niveau && <p className="mb-2"><strong>Niveau:</strong> {item.niveau}</p>}
      {item.techno && <p className="mb-2"><strong>Technos:</strong> {item.techno.join(', ')}</p>}
      {item.lien && <a href={item.lien} target="_blank" rel="noreferrer" className="underline">Voir le projet</a>}
    </div>
  )
}
