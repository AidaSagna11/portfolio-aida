import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../App'

export default function LoginPage({api}){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const { setUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async e =>{
    e.preventDefault()
    setError(null)
    try{
      const res = await fetch(`${api}/users?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`)
      const data = await res.json()
      if(data.length){
        setUser({ username: data[0].username, role: data[0].role })
        navigate('/list')
      }else{
        setError('Identifiants incorrects')
      }
    }catch(err){ setError('Erreur de connexion') }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Connexion</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block text-sm">Nom d'utilisateur</label>
          <input value={username} onChange={e=>setUsername(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div className="mb-3">
          <label className="block text-sm">Mot de passe</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        {error && <div className="text-red-600 mb-3">{error}</div>}
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Se connecter</button>
      </form>
    </div>
  )
}

