export interface Coordinate {
  lat: number;
  lng: number;
}

export interface TransitInfo {
  line: string;
  halte_terdekat?: string;
  jarak_ke_lokasi?: string;
  keterangan?: string;
}

export interface School {
  id: string;
  nama: string;
  tipe: 'SMK' | 'SMA' | 'MA' | 'SMU';
  koordinat: Coordinate;
  alamat: string;
  angkutan_umum: TransitInfo[];
}

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
}
