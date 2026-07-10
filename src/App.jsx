import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { Properties } from './pages/Properties'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/properties"
          element={
            <ProtectedRoute>
              <Properties />
            </ProtectedRoute>
          }
        />
        {/* それ以外のパスは物件一覧へ（未ログインならログイン画面にリダイレクトされる） */}
        <Route path="*" element={<Navigate to="/properties" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
