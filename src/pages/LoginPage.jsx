import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

export default function LoginPage({ api }) {
  
  const fakeAdmin = {
    username: "admin",
    password: "admin123",
    role: "admin"
  };

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);

    if (username === fakeAdmin.username && password === fakeAdmin.password) {
      setUser({ username: fakeAdmin.username, role: fakeAdmin.role });
      return navigate('/list');
    }

    try {
      const res = await fetch(
        `${api}/users?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
      );
      const data = await res.json();

      if (data.length) {
        setUser({ username: data[0].username, role: data[0].role });
        navigate('/list');
      } else {
        setError('Identifiants incorrects');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#eef2ff] via-[#e0e7ff] to-[#f8fafc] px-4">

      <div className="w-full max-w-md backdrop-blur-xl bg-white/30 border border-white/40 shadow-xl rounded-3xl p-8">
        
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Connexion
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom d'utilisateur
            </label>
            <input
              className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 
              focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-400"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Entrer votre nom"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 
              focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-400"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="********"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <button
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md text-base font-medium transition-all"
          >
            Se connecter
          </button>

          <p className="text-xs text-gray-600 text-center mt-2">
            Admin fictif : <strong>admin / admin123</strong>
          </p>

        </form>
      </div>

    </div>
  );
}
