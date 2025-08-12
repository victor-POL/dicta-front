import type { CasoJudicial, Transcripcion } from '@/pages/transcribir/route'

export const CASOS_JUDICIALES: CasoJudicial[] = [
  {
    id: '1',
    nombre: 'Divorcio Martínez vs Martínez',
    numero: 'CV-2024-001',
    cliente: 'Ana Martínez',
    estado: 'activo',
    fechaCreacion: new Date('2024-01-10'),
    estudioId: 'est1',
    estudioNombre: 'García & Asociados',
  },
  {
    id: '2',
    nombre: 'Demanda Laboral - Pérez',
    numero: 'LAB-2024-005',
    cliente: 'Carlos Pérez',
    estado: 'activo',
    fechaCreacion: new Date('2024-01-08'),
    estudioId: 'est2',
    estudioNombre: 'Rodríguez Legal',
  },
  {
    id: '3',
    nombre: 'Contrato Comercial - TechCorp',
    numero: 'COM-2024-012',
    cliente: 'TechCorp S.A.',
    estado: 'cerrado',
    fechaCreacion: new Date('2023-12-15'),
    estudioId: 'est1',
    estudioNombre: 'García & Asociados',
  },
]

export const TRANSCRIPCIONES: Transcripcion[] = [
  {
    id: '1',
    tipo: 'audio',
    nombre: 'Audiencia Civil - Caso Martinez.mp3',
    duracion: '45:32',
    estado: 'completada',
    fechaCreacion: new Date('2024-01-15'),
    fechaCompletada: new Date('2024-01-15'),
    textoTranscrito: 'Transcripción completa disponible...',
    casoId: '1', // Vinculado al caso Martínez
  },
  {
    id: '2',
    tipo: 'youtube',
    nombre: 'Conferencia Derecho Laboral 2024',
    url: 'https://youtube.com/watch?v=example',
    duracion: '1:23:45',
    estado: 'procesando',
    fechaCreacion: new Date('2024-01-14'),
    casoId: '2', // Vinculado al caso Pérez
  },
  {
    id: '3',
    tipo: 'audio',
    nombre: 'Declaración Testigo - Caso Pérez.wav',
    duracion: '28:15',
    estado: 'error',
    fechaCreacion: new Date('2024-01-13'),
    casoId: '2', // Vinculado al caso Pérez
  },
  {
    id: '4',
    tipo: 'audio',
    nombre: 'Reunión Equipo Legal.mp3',
    duracion: '32:18',
    estado: 'completada',
    fechaCreacion: new Date('2024-01-12'),
    fechaCompletada: new Date('2024-01-12'),
    textoTranscrito: 'Transcripción de reunión interna disponible...',
  },
]
