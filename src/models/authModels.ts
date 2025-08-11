export interface User {
  nombre: string
  apellido: string
  correo: string
  perfil: string
  urlFotoPerfil?: string
  token: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginCredentials {
  correo: string
  password: string
}

export interface RegisterData {
  nombre: string
  apellido: string
  correo: string
  password: string
  perfil: string
}
