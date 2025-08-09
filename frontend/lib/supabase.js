import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://yalatnihrujfdofdqder.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhbGF0bmlocnVqZmRvZmRxZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NjkyOTksImV4cCI6MjA3MDA0NTI5OX0.C3nbqpwqM1k4l2xoDijETnevis9NyXS9nZ9vgqTEr8Q'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
