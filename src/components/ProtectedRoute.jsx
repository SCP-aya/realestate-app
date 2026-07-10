import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// 未ログインの場合はログイン画面にリダイレクトするラッパーコンポーネント
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <p className="loading-text">読み込み中...</p>
  }

  if (!user) {
    // ログイン後に元のページへ戻れるよう、遷移元のパスを渡す
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return children
}
