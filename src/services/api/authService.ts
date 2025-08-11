import type { LoginCredentials, RegisterData, User } from '@/models/authModels'

// Función para generar token mock
function generateMockToken(email: string) {
  const timestamp = Date.now()
  return `mock_token_${btoa(email)}_${timestamp}`
}

function createMockUser(credentials: LoginCredentials): User {
  return {
    nombre: 'Carlos',
    apellido: 'Ugarte',
    correo: credentials.correo,
    perfil: 'user',
    urlFotoPerfil: `https://picsum.photos/id/${Math.floor(Math.random() * 1000) + 1}/200/300`,
    token: generateMockToken(credentials.correo),
  }
}

function createMockUserRegister(data: RegisterData): User {
  return {
    nombre: data.nombre,
    apellido: data.apellido,
    correo: data.correo,
    perfil: 'user',
    urlFotoPerfil: `https://picsum.photos/id/${Math.floor(Math.random() * 1000) + 1}/200/300`,
    token: generateMockToken(data.correo),
  }
}

// Función para simular delay de red
const simulateNetworkDelay = (ms: number = 1500) => new Promise((resolve) => setTimeout(resolve, ms))

export const login = async (credentials: LoginCredentials): Promise<User> => {
  // Simular delay de red
  await simulateNetworkDelay(2000)

  return createMockUser(credentials)
}

export const register = async (data: RegisterData): Promise<User> => {
  // Simular delay de red
  await simulateNetworkDelay(2000)

  return createMockUserRegister(data)
}

export const logout = async (): Promise<void> => {
  // Simular delay de red
  await simulateNetworkDelay(2000)

  // Siempre limpiar el almacenamiento local
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user_data')
}

export const refreshToken = async (): Promise<User> => {
  // Simular delay de red
  await simulateNetworkDelay(800)

  const token = localStorage.getItem('auth_token')
  const userData = localStorage.getItem('user_data')

  if (!token || !userData) {
    throw new Error('No hay token disponible')
  }

  try {
    const user = JSON.parse(userData)
    const newToken = generateMockToken(user.correo)

    return {
      ...user,
      token: newToken,
    }
  } catch {
    // Si falla el parsing, limpiar datos
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    throw new Error('Error al renovar token')
  }
}

export const validateToken = async (): Promise<User | null> => {
  // Simular delay de red más corto para validación
  await simulateNetworkDelay(300)

  const token = localStorage.getItem('auth_token')
  const userData = localStorage.getItem('user_data')

  if (!token || !userData) {
    return null
  }

  try {
    // Verificar que el token no sea muy viejo (simulación de expiración)
    const tokenParts = token.split('_')
    const timestamp = parseInt(tokenParts[tokenParts.length - 1])
    const hoursSinceCreation = (Date.now() - timestamp) / (1000 * 60 * 60)

    // Simular que el token expira después de 24 horas
    if (hoursSinceCreation > 24) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      return null
    }

    return JSON.parse(userData)
  } catch {
    // En caso de error, limpiar datos
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    return null
  }
}
