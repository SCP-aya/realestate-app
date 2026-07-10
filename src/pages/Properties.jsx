import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  createProperty,
  deleteProperty,
  fetchProperties,
  updateProperty,
} from '../lib/properties'
import { PropertyCard } from '../components/PropertyCard'
import { PropertyForm } from '../components/PropertyForm'

// 物件一覧画面（ログイン後に表示される）
export function Properties() {
  const { user, signOut } = useAuth()

  const [properties, setProperties] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  // フォームの表示状態（null: 非表示, 'create': 新規登録, 物件オブジェクト: 編集）
  const [formTarget, setFormTarget] = useState(null)

  // 初回表示時に物件一覧を取得する
  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const data = await fetchProperties()
      setProperties(data)
    } catch {
      setErrorMessage('物件一覧の取得に失敗しました。')
    } finally {
      setIsLoading(false)
    }
  }

  // 新規登録・編集フォームの送信処理
  const handleFormSubmit = async (values) => {
    if (formTarget === 'create') {
      const created = await createProperty(values)
      setProperties((prev) => [created, ...prev])
    } else {
      const updated = await updateProperty(formTarget.id, values)
      setProperties((prev) =>
        prev.map((property) => (property.id === updated.id ? updated : property))
      )
    }

    setFormTarget(null)
  }

  // 削除処理（確認ダイアログを挟む）
  const handleDelete = async (property) => {
    const isConfirmed = window.confirm(`「${property.name}」を削除しますか？`)
    if (!isConfirmed) {
      return
    }

    try {
      await deleteProperty(property.id)
      setProperties((prev) => prev.filter((item) => item.id !== property.id))
    } catch {
      setErrorMessage('物件の削除に失敗しました。')
    }
  }

  return (
    <div className="properties-page">
      <header className="properties-header">
        <div>
          <h1>物件一覧</h1>
          <p className="user-email">{user?.email} でログイン中</p>
        </div>
        <div className="properties-header-actions">
          <button type="button" onClick={() => setFormTarget('create')}>
            新規登録
          </button>
          <button type="button" className="secondary" onClick={() => signOut()}>
            ログアウト
          </button>
        </div>
      </header>

      {formTarget && (
        <PropertyForm
          // 編集モードのときのみ既存の値を渡す
          initialValues={formTarget !== 'create' ? formTarget : undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormTarget(null)}
        />
      )}

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {isLoading ? (
        <p className="loading-text">読み込み中...</p>
      ) : properties.length === 0 ? (
        <p className="empty-text">登録されている物件がありません。</p>
      ) : (
        <div className="property-grid">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onEdit={setFormTarget}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
