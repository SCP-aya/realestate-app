import { createClient } from '@supabase/supabase-js'

// .env で管理しているSupabaseの接続情報を読み込む
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    'Supabaseの接続情報が設定されていません。.envファイルを確認してください。'
  )
}

// アプリ全体で共有するSupabaseクライアント
export const supabase = createClient(supabaseUrl, supabasePublishableKey)
