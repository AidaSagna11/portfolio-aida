import React, { useEffect, useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import ListPage from './pages/ListPage'
import FormPage from './pages/FormPage'
import DetailsPage from './pages/DetailsPage'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'
import profilImg from './assets/profil.jpeg';

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
      <div className="h-screen grid grid-rows-[auto_1fr_auto] bg-gray-950 text-white">
        <header className="fixed top-0 left-0 w-full bg-gray-900/90 backdrop-blur-md shadow z-50">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-white">Mon Portfolio</Link>

            <nav className="flex gap-6 items-center text-gray-300">
              <Link to="/" className="hover:text-white transition">Accueil</Link>
              <Link to="/list" className="hover:text-white transition">Compétences & Projets</Link>

              {user ? (
                <>
                  {user.role === "admin" && (
                    <Link to="/add" className="hover:text-white transition">Ajouter</Link>
                  )}
                  <button onClick={logout} className="text-red-400 hover:text-red-600 transition">
                    Se déconnecter
                  </button>
                </>
              ) : (
                <Link to="/login" className="hover:text-white transition">Se connecter</Link>
              )}
            </nav>
          </div>
        </header>


        <main className="pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/list" element={<ListPage api={API} />} />
            <Route path="/details/:type/:id" element={<DetailsPage api={API} />} />
            <Route path="/login" element={<LoginPage api={API} />} />

            <Route 
              path="/add"
              element={<ProtectedRoute allowedRoles={["admin"]}><FormPage api={API} /></ProtectedRoute>}
            />

            <Route 
              path="/edit/:type/:id"
              element={<ProtectedRoute allowedRoles={["admin"]}><FormPage api={API} /></ProtectedRoute>}
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <footer className="bg-gray-900/90 backdrop-blur-md border-t border-gray-800">
          <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-400">
            © 2025 - Portfolio
          </div>
        </footer>

      </div>
    </AuthContext.Provider>
  )
}

function Home() {
  return (
    <div className="w-full h-full flex items-center bg-gray-950 text-white">

      {/* Image à gauche */}
      <div className="hidden md:block w-1/2 h-full">
        <img
          src={profilImg}
          alt="Profil"
          className="w-full h-[75%] object-cover opacity-80"
        />
      </div>

      {/* Texte à droite */}
      <div className="w-full md:w-1/2 px-8 md:px-16">
        <h1 className="text-6xl font-bold mb-4">
          My <span className="text-blue-400">Portfolio</span>
        </h1>

        <p className="text-gray-300 max-w-md">
          Étudiante en ingénierie des systèmes d’information, passionnée par le
          développement, la data et la création d’interfaces modernes.
        </p>
      </div>

    </div>
  );
}





function NotFound(){
  return <div>404 - Page non trouvée</div>
}

