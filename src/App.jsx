import React, { useEffect, useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import ListPage from './pages/ListPage'
import FormPage from './pages/FormPage'
import DetailsPage from './pages/DetailsPage'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'

const API = 'http://localhost:4000'

export const AuthContext = React.createContext()

export default function App(){
  const [user, setUser] = useState(()=>{
    const raw = sessionStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  })
  const navigate = useNavigate()

  useEffect(()=>{
    if(user) sessionStorage.setItem('user', JSON.stringify(user))
    else sessionStorage.removeItem('user')
  },[user])

  const logout = ()=>{ setUser(null); navigate('/') }

  return (
    <AuthContext.Provider value={{user,setUser}}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold">Mon Portfolio</Link>
            <nav className="flex gap-4 items-center">
              <Link to="/" className="hover:underline">Accueil</Link>
              <Link to="/list" className="hover:underline">Compétences & Projets</Link>
              {user ? (
                <>
                  {user.role === 'admin' && <Link to="/add" className="btn">Ajouter</Link>}
                  <button onClick={logout} className="text-sm text-red-600">Se déconnecter</button>
                </>
              ) : (
                <Link to="/login" className="text-sm">Se connecter</Link>
              )}
            </nav>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/list" element={<ListPage api={API} />} />
            <Route path="/details/:type/:id" element={<DetailsPage api={API} />} />

            <Route path="/login" element={<LoginPage api={API} />} />

            <Route path="/add" element={<ProtectedRoute allowedRoles={["admin"]}><FormPage api={API} /></ProtectedRoute>} />
            <Route path="/edit/:type/:id" element={<ProtectedRoute allowedRoles={["admin"]}><FormPage api={API} /></ProtectedRoute>} />

            <Route path="*" element={<NotFound/>} />
          </Routes>
        </main>

        <footer className="bg-white border-t mt-12">
          <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-500">© 2025 - Portfolio</div>
        </footer>
      </div>
    </AuthContext.Provider>
  )
}

function Home(){
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">Bienvenue sur mon portfolio</h1>
      <p>Exemple d'application React + Tailwind. Voir la liste des compétences et projets.</p>
    </div>
  )
}

function NotFound(){
  return <div>404 - Page non trouvée</div>
}

