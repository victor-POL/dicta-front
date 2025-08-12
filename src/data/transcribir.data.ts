import type { Audiencia, CasoJudicial, Transcripcion } from '@/pages/transcribir/route'

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
    audienciaId: 'aud1', // Vinculado a audiencia
  },
  {
    id: '2',
    tipo: 'youtube',
    nombre: 'Conferencia Derecho Laboral 2024',
    url: 'https://youtube.com/watch?v=example',
    duracion: '1:23:45',
    estado: 'procesando',
    fechaCreacion: new Date('2024-01-14'),
    audienciaId: 'aud3', // Vinculado a audiencia
  },
  {
    id: '3',
    tipo: 'audio',
    nombre: 'Declaración Testigo - Caso Pérez.wav',
    duracion: '28:15',
    estado: 'error',
    fechaCreacion: new Date('2024-01-13'),
    audienciaId: 'aud2', // Vinculado a audiencia
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
  {
    id: '5',
    tipo: 'en_vivo',
    nombre: 'Transcripción en Vivo - Audiencia Preliminar',
    duracion: '1:15:30',
    estado: 'completada',
    fechaCreacion: new Date('2024-01-20'),
    fechaCompletada: new Date('2024-01-20'),
    textoTranscrito: 'Transcripción en tiempo real completada...',
    audienciaId: 'aud1',
  },
]

export const AUDIENCIAS: Audiencia[] = [
  {
    id: 'aud1',
    nombre: 'Audiencia Preliminar',
    fecha: new Date('2024-01-20'),
    hora: '10:00',
    tipo: 'Preliminar',
    estado: 'completada',
    casoId: '1',
    descripcion: 'Primera audiencia del caso',
  },
  {
    id: 'aud2',
    nombre: 'Declaración de Testigos',
    fecha: new Date('2024-01-25'),
    hora: '14:30',
    tipo: 'Testimonial',
    estado: 'completada',
    casoId: '1',
  },
  {
    id: 'aud3',
    nombre: 'Audiencia de Conciliación',
    fecha: new Date('2024-01-18'),
    hora: '09:00',
    tipo: 'Conciliación',
    estado: 'completada',
    casoId: '2',
  },
  {
    id: 'aud4',
    nombre: 'Audiencia Final',
    fecha: new Date('2024-02-05'),
    hora: '11:00',
    tipo: 'Final',
    estado: 'programada',
    casoId: '2',
  },
]
