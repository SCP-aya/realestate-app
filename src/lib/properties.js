import { supabase } from './supabaseClient'

// 物件一覧を取得する（RLSにより自分が登録した物件のみ取得される）
export async function fetchProperties() {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data
}

// 物件を新規登録する
// user_id はDB側のデフォルト値（auth.uid()）で自動的に設定される
export async function createProperty({ name, rent, area, layout }) {
  const { data, error } = await supabase
    .from('properties')
    .insert({ name, rent, area, layout })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// 物件情報を更新する
export async function updateProperty(id, { name, rent, area, layout }) {
  const { data, error } = await supabase
    .from('properties')
    .update({ name, rent, area, layout })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// 物件を削除する
export async function deleteProperty(id) {
  const { error } = await supabase.from('properties').delete().eq('id', id)

  if (error) {
    throw error
  }
}
