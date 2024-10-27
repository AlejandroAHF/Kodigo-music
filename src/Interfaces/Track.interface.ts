// /Interfaces/Tracks.interface.ts
export interface Track {
    id: string;
    name: string;
    duration_ms: number;
    artists: { name: string }[]; // Según el esquema de datos de tu API
  }
  