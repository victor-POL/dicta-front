import {
  IconCalendarWeek,
  IconHome,
  IconLogin,
  IconMoodPlus,
  IconMicrophoneFilled,
  IconGavel,
  IconMusic,
  IconHelp,
  IconBrandYoutube,
  IconSettings,
  IconUsers,
  type Icon,
  IconUserCircle,
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
  equipo: {
    url: '/equipo',
    title: 'Equipo',
    icon: IconUsers,
  },
  transcribirAudio: {
    url: '/transcribir-audio',
    title: 'Transcribir Audio',
    icon: IconMusic,
  },
  transcribirVideoYoutube: {
    url: '/transcribir-video-youtube',
    title: 'Transcribir Youtube',
    icon: IconBrandYoutube,
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
  navMain: getPaths(['inicio', 'calendario', 'casos', 'equipo']),
  navSecondary: getPaths(['configuracion', 'ayuda']),
  herramientas: getPaths(['transcribirAudio', 'transcribirVideoYoutube']),
  mainOperation: getPath('transcripcion'),
}

// Exportar también como array para compatibilidad
export const PATHS_ARRAY: Path[] = Object.values(PATHS)
