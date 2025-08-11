import { createContext, useContext, useReducer, useEffect, useMemo } from 'react'
import type { ReactNode } from 'react'
import type { User, AuthState, LoginCredentials, RegisterData } from '@/models/authModels'
import * as authService from '@/services/api/authService'

interface AuthContextType {
  authState: AuthState
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  register: (data: RegisterData) => Promise<void>
  updateUser: (user: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      }
    case 'LOGOUT':
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      }
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      }
    default:
      return state
  }
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, dispatch] = useReducer(authReducer, initialState)

  // Verificar si hay un token guardado al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.validateToken()
        if (user) {
          dispatch({ type: 'LOGIN_SUCCESS', payload: user })
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error)
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    checkAuth()
  }, [])

  // Sincronización entre pestañas/ventanas
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      // Solo reaccionar a cambios en las claves de autenticación
      if (event.key === 'auth_token' || event.key === 'user_data') {
        const token = localStorage.getItem('auth_token')
        const userData = localStorage.getItem('user_data')

        if (!token || !userData) {
          // Si se eliminaron los datos de autenticación, hacer logout
          dispatch({ type: 'LOGOUT' })
        } else {
          // Si se agregaron/actualizaron los datos, hacer login
          try {
            const user = JSON.parse(userData)
            dispatch({ type: 'LOGIN_SUCCESS', payload: user })
          } catch (error) {
            console.error('Error al parsear datos de usuario:', error)
            dispatch({ type: 'LOGOUT' })
          }
        }
      }
    }

    // Agregar el listener para cambios en localStorage
    window.addEventListener('storage', handleStorageChange)

    // Cleanup: remover el listener al desmontar
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // Función auxiliar para notificar cambios de autenticación a otras pestañas
  const notifyAuthChange = (type: 'login' | 'logout', payload?: User) => {
    // Disparar evento personalizado (para la misma pestaña, si es necesario)
    const event = new CustomEvent('authChange', {
      detail: { type, payload }
    })
    window.dispatchEvent(event)
  }

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      // dispatch({ type: 'SET_LOADING', payload: true })

      const user = await authService.login(credentials)

      // Guardar en localStorage
      localStorage.setItem('auth_token', user.token)
      localStorage.setItem('user_data', JSON.stringify(user))

      dispatch({ type: 'LOGIN_SUCCESS', payload: user })
      notifyAuthChange('login', user)
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false })
      throw error
    }
  }

  const logout = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      await authService.logout()
      dispatch({ type: 'LOGOUT' })
      notifyAuthChange('logout')
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false })
      throw error
    }
  }

  const register = async (data: RegisterData): Promise<void> => {
    try {
      // dispatch({ type: 'SET_LOADING', payload: true })

      const user = await authService.register(data)

      // Guardar en localStorage
      localStorage.setItem('auth_token', user.token)
      localStorage.setItem('user_data', JSON.stringify(user))

      dispatch({ type: 'LOGIN_SUCCESS', payload: user })
      notifyAuthChange('login', user)
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false })
      throw error
    }
  }

  const updateUser = (userData: Partial<User>): void => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...userData }
      localStorage.setItem('user_data', JSON.stringify(updatedUser))
      dispatch({ type: 'UPDATE_USER', payload: userData })
    }
  }

  const contextValue = useMemo(
    () => ({
      authState,
      login,
      logout,
      register,
      updateUser,
    }),
    [authState]
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}
