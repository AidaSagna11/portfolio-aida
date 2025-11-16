import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../App'

export default function LoginPage({ api }) {
  
  // --- USER ADMIN FICTIF ---
  const fakeAdmin = {
    username: "admin",
    password: "admin123",
    role: "admin"
  };

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const { setUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setError(null)

    // ----- 1) Vérification du user fictif ADMIN -----
    if (username === fakeAdmin.username && password === fakeAdmin.password) {
      setUser({ username: fakeAdmin.username, role: fakeAdmin.role })
      return navigate('/list')
    }

    // ----- 2) Sinon on interroge l'API -----
    try {
      const res = await fetch(
        `${api}/users?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
      )
      const data = await res.json()

      if (data.length) {
        setUser({ username: data[0].username, role: data[0].role })
        navigate('/list')
      } else {
        setError('Identifiants incorrects')
      }
    } catch (err) {
      setError('Erreur de connexion au serveur')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-10">

      <h2 className="text-xl font-semibold mb-4 text-center">Connexion</h2>

      <form onSubmit={handleSubmit}>
        
        <div className="mb-3">
          <label className="block text-sm mb-1">Nom d'utilisateur</label>
          <input 
            className="w-full border p-2 rounded"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Entrer votre nom"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm mb-1">Mot de passe</label>
          <input 
            type="password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="********"
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm mb-3">{error}</div>
        )}

        <button 
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Se connecter
        </button>

        <p className="text-xs text-gray-500 mt-3">
          Admin fictif : <strong>admin / admin123</strong>
        </p>

      </form>
    </div>
  )
}
