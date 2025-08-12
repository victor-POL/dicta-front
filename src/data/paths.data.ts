import {
  IconCalendarWeek,
  IconHome,
  IconLogin,
  IconMoodPlus,
  IconMicrophoneFilled,
  IconGavel,
  IconHelp,
  IconSettings,
  type Icon,
  IconUserCircle,
  IconBuildings,
  IconFileStack,
} from '@tabler/icons-react'

interface Path {
  url: string
  title: string
  description?: string
  icon: Icon
}

export const PATHS = {
  inicio: {
    url: '/',
    title: 'Inicio',
    icon: IconHome,
  },
  login: {
    url: '/login',
    title: 'Iniciar Sesión',
    icon: IconLogin,
  },
  registro: {
    url: '/registro',
    title: 'Registrarse',
    icon: IconMoodPlus,
  },
  transcripcion: {
    url: '/transcripcion',
    title: 'Iniciar Transcripción',
    icon: IconMicrophoneFilled,
  },
  calendario: {
    url: '/calendario',
    title: 'Calendario',
    icon: IconCalendarWeek,
  },
  casos: {
    url: '/casos',
    title: 'Casos',
    icon: IconGavel,
  },
  mis_estudios: {
    url: '/estudios',
    title: 'Mis Estudios',
    icon: IconBuildings,
  },
  transcripciones: {
    url: '/transcripciones',
    title: 'Transcripciones',
    icon: IconFileStack,
  },
  configuracion: {
    url: '/configuracion',
    title: 'Configuración',
    icon: IconSettings,
  },
  ayuda: {
    url: '/ayuda',
    title: 'Ayuda',
    icon: IconHelp,
  },
  perfil: {
    url: '/perfil',
    title: 'Perfil',
    icon: IconUserCircle,
  },
} as const

// Helper functions para trabajar con las rutas
export const getPath = (key: keyof typeof PATHS) => PATHS[key]
export const getPaths = (keys: (keyof typeof PATHS)[]) => keys.map((key) => PATHS[key])
export const getPathByUrl = (url: string) => PATHS_ARRAY.find((path) => path.url === url)
export type PathKey = keyof typeof PATHS

// Configuración del menú del sidebar usando claves para mayor claridad
export const SIDEBAR_CONFIG = {
  navMain: getPaths(['inicio', 'calendario', 'casos', 'mis_estudios', 'transcripciones']),
  navSecondary: getPaths(['configuracion', 'ayuda']),
  herramientas: getPaths(['transcripciones']),
  mainOperation: getPath('transcripcion'),
}

// Exportar también como array para compatibilidad
export const PATHS_ARRAY: Path[] = Object.values(PATHS)
