import type { Estudio, Caso } from '@/pages/casos/route'

export const CASOS_PAGE_CASOS: Caso[] = [
  {
    id: '1',
    numeroExpediente: 'EXP-2024-001',
    cliente: 'María González',
    descripcion: 'Caso de divorcio contencioso con división de bienes',
    fechaInicio: '2024-01-15',
    estado: 'activo',
    estudioId: '1',
    audiencias: [
      {
        id: '1',
        titulo: 'Audiencia Preliminar',
        fecha: '2024-02-15',
        hora: '10:00',
        lugar: 'Juzgado Civil N°3',
        descripcion: 'Primera audiencia para establecer medidas cautelares',
        casoId: '1',
        transcripciones: [
          {
            id: '1',
            nombre: 'Audiencia Preliminar - Parte 1',
            tipo: 'en_vivo',
            fecha: '2024-02-15',
            duracion: '45:30',
            estado: 'procesado',
            casoId: '1',
            audienciaId: '1',
          },
          {
            id: '2',
            nombre: 'Declaración Cliente',
            tipo: 'audio',
            fecha: '2024-02-15',
            duracion: '12:45',
            estado: 'procesado',
            casoId: '1',
            audienciaId: '1',
            archivo: 'declaracion_cliente.mp3',
          },
        ],
      },
    ],
  },
  {
    id: '2',
    numeroExpediente: 'EXP-2024-002',
    cliente: 'Constructora ABC S.A.',
    descripcion: 'Demanda por incumplimiento contractual',
    fechaInicio: '2024-02-01',
    estado: 'activo',
    estudioId: '1',
    audiencias: [],
  },
]

export const ESTUDIOS_PAGE_CASOS: Estudio[] = [
  { id: '1', nombre: 'Estudio Jurídico Martínez & Asociados', direccion: 'Av. Corrientes 1234' },
  { id: '2', nombre: 'Bufete Legal Rodríguez', direccion: 'San Martín 567' },
]
