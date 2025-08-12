import type { Estudio } from '@/pages/estudios/route'

export const ESTUDIOS_DATA: Estudio[] = [
  {
    id: '1',
    nombre: 'Estudio Jurídico González & Asociados',
    direccion: 'Av. Corrientes 1234, CABA',
    telefono: '+54 11 2222-3333',
    equipos: [
      {
        id: '1',
        nombre: 'Derecho Civil',
        descripcion: 'Equipo especializado en derecho civil y comercial',
        usuarios: [
          {
            id: '1',
            nombre: 'María',
            apellido: 'González',
            correo: 'maria.gonzalez@estudio.com',
            rol: 'admin',
          },
          {
            id: '2',
            nombre: 'Carlos',
            apellido: 'Rodríguez',
            correo: 'carlos.rodriguez@estudio.com',
            rol: 'miembro',
          },
        ],
        fechaCreacion: new Date('2024-01-15'),
      },
    ],
    fechaCreacion: new Date('2023-06-01'),
  },
  {
    id: '2',
    nombre: 'Estudio Legal Pérez',
    direccion: 'Calle Falsa 456, CABA',
    telefono: '+54 11 4444-5555',
    equipos: [
      {
        id: '2',
        nombre: 'Derecho Penal',
        descripcion: 'Equipo especializado en derecho penal y procesal penal',
        usuarios: [
          {
            id: '3',
            nombre: 'Laura',
            apellido: 'Pérez',
            correo: 'lperez@estudio.com',
            rol: 'admin',
          },
          {
            id: '4',
            nombre: 'Juan',
            apellido: 'Martínez',
            correo: 'jmartinez@estudio.com',
            rol: 'miembro',
          },
        ],
        fechaCreacion: new Date('2024-02-10'),
      },
    ],
    fechaCreacion: new Date('2023-07-20'),
  },
  {
    id: '3',
    nombre: 'Estudio Jurídico Fernández',
    direccion: 'Av. Libertador 789, CABA',
    telefono: '+54 11 6666-7777',
    equipos: [],
    fechaCreacion: new Date('2023-08-05'),
  },
]
