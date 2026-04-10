# Arsitektur Proyek: EduMap Transit

Dokumen ini menjelaskan struktur teknis dan keputusan desain yang diambil dalam pengembangan EduMap Transit.

## 🏗️ Struktur Folder

-   `src/components/`: Berisi komponen UI modular.
    -   `MapComponent.tsx`: Wrapper untuk integrasi Leaflet.
-   `src/data/`: Penyimpanan data statis.
    -   `schools.json`: Database utama sekolah dan rute transit.
-   `src/types.ts`: Definisi interface TypeScript untuk konsistensi data.
-   `src/utils.ts`: Fungsi pembantu (helper functions) seperti kalkulasi jarak Haversine.
-   `src/App.tsx`: Komponen utama yang mengatur state global (lokasi user, radius, filter).

## 🛠️ Keputusan Teknis

### 1. State Management
Aplikasi menggunakan React Hooks (`useState`, `useMemo`, `useEffect`) untuk manajemen state. Mengingat aplikasi ini bersifat read-only dan data tidak terlalu kompleks, penggunaan Redux atau Context API tidak diperlukan untuk menjaga performa tetap ringan.

### 2. Geolocation & Distance
Jarak antara pengguna dan sekolah dihitung menggunakan **Formula Haversine** di sisi klien. Ini memungkinkan filter radius bekerja secara instan tanpa perlu panggilan API backend.

### 3. Desain Responsif
Menggunakan pendekatan **Mobile-First** dengan Tailwind CSS. 
- Pada layar kecil, navigasi menggunakan *Bottom Bar* dan *Bottom Sheet*.
- Pada layar besar (>= 640px), aplikasi otomatis beralih ke tata letak *Dual-Column Dashboard*.

### 4. Rendering Peta
`react-leaflet` dipilih karena kemudahannya dalam integrasi dengan ekosistem React dan performanya yang baik untuk menampilkan banyak marker sekaligus.

## 📈 Rencana Pengembangan Masa Depan
- Integrasi API Real-time untuk jadwal bus TransJakarta.
- Fitur "Simpan Sekolah Favorit" menggunakan LocalStorage.
- Mode Gelap (Dark Mode).
- Pencarian rute jalan kaki yang lebih detail menggunakan API routing eksternal.
