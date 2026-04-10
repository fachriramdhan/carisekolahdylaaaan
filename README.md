# 🎓 EduMap Transit: Jakarta School GIS & Transit Finder

**EduMap Transit** adalah aplikasi berbasis Web GIS (Geographic Information System) yang dirancang untuk membantu siswa dan orang tua di Jakarta menemukan lokasi SMA Negeri dan SMK Negeri dengan mudah. Aplikasi ini tidak hanya menampilkan peta, tetapi juga memberikan rekomendasi rute angkutan umum (seperti TransJakarta) untuk mempermudah akses ke sekolah tujuan.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-blue.svg)
![Vite](https://img.shields.io/badge/Vite-6-purple.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-4-teal.svg)

---

## ✨ Fitur Utama

-   **📍 Pemetaan Real-time**: Visualisasi lokasi sekolah SMA & SMK Negeri di seluruh wilayah Jakarta menggunakan OpenStreetMap.
-   **🔍 Pencarian Cerdas**: Cari sekolah berdasarkan nama dengan fitur *live search*.
-   **📏 Filter Radius**: Sesuaikan jangkauan pencarian dari lokasi Anda (1km hingga 20km).
-   **🚌 Informasi Transit**: Detail rute angkutan umum, halte terdekat, dan estimasi jarak jalan kaki untuk setiap sekolah.
-   **🗺️ Integrasi Navigasi**: Tombol langsung untuk membuka panduan rute di Google Maps.
-   **📱 Responsif & Modern**: Desain dashboard yang elegan, optimal untuk perangkat mobile maupun desktop (MacBook/Laptop).
-   **📡 Deteksi Lokasi Otomatis**: Menggunakan Geolocation API untuk menentukan titik awal pencarian Anda secara presisi.

---

## 🚀 Teknologi yang Digunakan

-   **Frontend**: [React 19](https://react.dev/) dengan [TypeScript](https://www.typescriptlang.org/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
-   **Peta**: [Leaflet](https://leafletjs.com/) & [React Leaflet](https://react-leaflet.js.org/)
-   **Animasi**: [Framer Motion](https://www.framer.com/motion/)
-   **Ikon**: [Lucide React](https://lucide.dev/)

---

## 🛠️ Instalasi Lokal

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di komputer Anda:

1.  **Clone Repository**
    ```bash
    git clone https://github.com/username/edumap-transit.git
    cd edumap-transit
    ```

2.  **Instal Dependensi**
    Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/).
    ```bash
    npm install
    ```

3.  **Jalankan Server Pengembangan**
    ```bash
    npm run dev
    ```

4.  **Akses Aplikasi**
    Buka browser dan kunjungi `http://localhost:3000`.

---

## 📂 Struktur Data

Data sekolah dikelola secara statis dalam format JSON di `src/data/schools.json`. Struktur datanya adalah sebagai berikut:

```json
{
  "id": "SMAN1",
  "nama": "SMA Negeri 1 Jakarta",
  "tipe": "SMA",
  "koordinat": { "lat": -6.1647, "lng": 106.8370 },
  "alamat": "Jl. Budi Utomo No.7, Sawah Besar",
  "angkutan_umum": [
    { 
      "line": "TransJakarta Koridor 1", 
      "halte_terdekat": "Halte Budi Utomo", 
      "jarak_ke_lokasi": "200m" 
    }
  ]
}
```

---

## 📸 Dokumentasi Tampilan

### Tampilan Desktop (MacBook Pro 13")
Aplikasi akan menampilkan layout **dua kolom**:
-   **Kiri**: Peta interaktif dengan marker sekolah.
-   **Kanan**: Daftar sekolah yang dapat di-scroll dengan detail transit.
-   **Atas**: Panel kontrol radius dan filter tipe sekolah.

### Tampilan Mobile
-   **Navigasi Bawah**: Tombol cepat untuk beralih antara tampilan Peta dan Daftar.
-   **Bottom Sheet**: Panel detail sekolah yang muncul dari bawah saat marker dipilih di peta.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **MIT License**. Bebas digunakan untuk keperluan edukasi maupun pengembangan lebih lanjut.

---

## 🤝 Kontribusi

Kontribusi selalu terbuka! Jika Anda memiliki ide untuk fitur baru atau menemukan bug, silakan buat *Issue* atau kirimkan *Pull Request*.

Dibuat dengan ❤️ untuk pendidikan Indonesia.
