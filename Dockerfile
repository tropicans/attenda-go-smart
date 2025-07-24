# Tahap 1: Build Stage
# Menggunakan base image Node.js versi LTS (Long Term Support)
FROM node:18-alpine as build

# Menetapkan direktori kerja di dalam container
WORKDIR /app

# PERBAIKAN: Salin hanya package.json untuk memaksa instalasi ulang
COPY package.json ./

# PERBAIKAN: Gunakan 'npm install' bukan 'npm ci' untuk membangun ulang pohon dependensi
RUN npm install

# Salin sisa file proyek ke dalam container
# Ini termasuk kode sumber kita yang sudah benar
COPY . .

# --- LANGKAH DEBUGGING ---
# Tampilkan isi dari direktori components untuk verifikasi
RUN echo "--- Listing src/components: ---" && ls -l src/components
# Tampilkan isi file modal untuk memastikan perubahannya sudah masuk
RUN echo "--- Displaying GenerateQrModal.tsx content: ---" && cat src/components/GenerateQrModal.tsx && echo "\n--- End of file content ---"
# --- AKHIR LANGKAH DEBUGGING ---

# Bangun aplikasi untuk production menggunakan skrip dari package.json
RUN npm run build

# Tahap 2: Serve Stage
# Menggunakan base image Nginx yang ringan untuk menyajikan aplikasi
FROM nginx:stable-alpine
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Salin hasil build dari tahap sebelumnya ke direktori default Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Ekspos port 80, yang merupakan port default Nginx
EXPOSE 80

# Perintah untuk menjalankan Nginx saat container dimulai
CMD ["nginx", "-g", "daemon off;"]
