import { useState } from 'react'

// 新規登録・編集の両方で使うフォームの初期値
const emptyValues = { name: '', rent: '', area: '', layout: '' }

// 物件の新規登録・編集フォーム
// initialValues を渡すと編集モード、渡さなければ新規登録モードになる
export function PropertyForm({ initialValues, onSubmit, onCancel }) {
  const isEditMode = Boolean(initialValues)
  const [values, setValues] = useState(initialValues ?? emptyValues)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (field) => (event) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      await onSubmit({
        name: values.name,
        // 家賃は数値としてDBに保存する
        rent: Number(values.rent),
        area: values.area,
        layout: values.layout,
      })
    } catch {
      setErrorMessage('保存に失敗しました。入力内容をご確認ください。')
      setIsSubmitting(false)
      return
    }

    setIsSubmitting(false)
  }

  return (
    <form className="property-form" onSubmit={handleSubmit}>
      <h2>{isEditMode ? '物件を編集' : '物件を新規登録'}</h2>

      <label htmlFor="name">物件名</label>
      <input
        id="name"
        type="text"
        value={values.name}
        onChange={handleChange('name')}
        required
      />

      <label htmlFor="rent">家賃（円）</label>
      <input
        id="rent"
        type="number"
        min="0"
        value={values.rent}
        onChange={handleChange('rent')}
        required
      />

      <label htmlFor="area">エリア名</label>
      <input
        id="area"
        type="text"
        value={values.area}
        onChange={handleChange('area')}
        required
      />

      <label htmlFor="layout">間取り</label>
      <input
        id="layout"
        type="text"
        placeholder="例：1LDK"
        value={values.layout}
        onChange={handleChange('layout')}
        required
      />

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div className="property-form-actions">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '保存中...' : '保存'}
        </button>
        <button type="button" className="secondary" onClick={onCancel}>
          キャンセル
        </button>
      </div>
    </form>
  )
}
