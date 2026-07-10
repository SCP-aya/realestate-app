// 家賃を「¥123,000」のような表示形式に整形する
function formatRent(rent) {
  return `¥${rent.toLocaleString()}`
}

// 物件一覧に表示する1件分のカード
export function PropertyCard({ property, onEdit, onDelete }) {
  return (
    <div className="property-card">
      <h2>{property.name}</h2>
      <p className="property-rent">{formatRent(property.rent)} / 月</p>
      <p className="property-area">
        {property.area}・{property.layout}
      </p>

      <div className="property-card-actions">
        <button type="button" onClick={() => onEdit(property)}>
          編集
        </button>
        <button type="button" className="danger" onClick={() => onDelete(property)}>
          削除
        </button>
      </div>
    </div>
  )
}
