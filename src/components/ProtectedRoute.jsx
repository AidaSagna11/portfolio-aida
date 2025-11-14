import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../App'

export default function ProtectedRoute({ children, allowedRoles=[] }){
  const { user } = useContext(AuthContext)
  if(!user) return <Navigate to="/login" />
  if(allowedRoles.length && !allowedRoles.includes(user.role)) return <div>Accès refusé</div>
  return children
}
