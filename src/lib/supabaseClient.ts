import { createClient } from '@supabase/supabase-js'

// Alamat Supabase Kong lokal Anda
const supabaseUrl = 'http://localhost:8000'
// Ganti dengan 'anon' key publik Anda
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzUyNTEyNDAwLCJleHAiOjE5MTAyNzg4MDB9.NBhY-maiZma4g4Y40h4D7hQsyHYQa76IPCN6ife--_E'

// Inisialisasi dan ekspor klien Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)