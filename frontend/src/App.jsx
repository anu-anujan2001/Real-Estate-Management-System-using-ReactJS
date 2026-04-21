import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Nabar from './components/Navbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import useAuthStore from './store/useAuthStore'
import {Loader} from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log('Authenticated User:', authUser);

  if (isCheckingAuth) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className='animate-spin' size={48} />
      </div>
    );
  }

  return (
    <div>
      <Nabar/>
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path='/login' element={ !authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path='/signup' element={ !authUser ? <SignupPage /> : <Navigate to="/" />} />
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App