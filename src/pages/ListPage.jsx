import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../App'

export default function ListPage({api}){
  const [comps, setComps] = useState([])
  const [projs, setProjs] = useState([])
  const { user } = useContext(AuthContext)

  useEffect(()=>{ fetchAll() },[])

  const fetchAll = async ()=>{
    const [cRes, pRes] = await Promise.all([fetch(`${api}/competences`), fetch(`${api}/projets`)])
    setComps(await cRes.json())
    setProjs(await pRes.json())
  }

  const handleDelete = async (type,id)=>{
    if(!user || user.role !== 'admin') return alert('Accès refusé')
    if(!confirm('Supprimer cet élément ?')) return
    await fetch(`${api}/${type}/${id}`, { method: 'DELETE' })
    fetchAll()
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <section>
        <h2 className="text-xl font-semibold mb-4">Compétences</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {comps.map(c=> (
            <div key={c.id} className="bg-white p-4 rounded shadow">
              <img src={c.image} alt="" className="w-full h-32 object-cover rounded mb-2" />
              <h3 className="font-bold"><Link to={`/details/competences/${c.id}`}>{c.libelle}</Link></h3>
              <div className="flex gap-2 mt-2">
                {user && user.role === 'admin' && (
                  <>
                    <Link to={`/edit/competences/${c.id}`} className="text-sm underline">Modifier</Link>
                    <button onClick={()=>handleDelete('competences', c.id)} className="text-sm text-red-600">Supprimer</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Projets</h2>
        <div className="grid sm:grid-cols-1 gap-4">
          {projs.map(p=> (
            <div key={p.id} className="bg-white p-4 rounded shadow">
              <img src={p.image} alt="" className="w-full h-40 object-cover rounded mb-2" />
              <h3 className="font-bold"><Link to={`/details/projets/${p.id}`}>{p.titre}</Link></h3>
              <div className="flex gap-2 mt-2">
                {user && user.role === 'admin' && (
                  <>
                    <Link to={`/edit/projets/${p.id}`} className="text-sm underline">Modifier</Link>
                    <button onClick={()=>handleDelete('projets', p.id)} className="text-sm text-red-600">Supprimer</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
