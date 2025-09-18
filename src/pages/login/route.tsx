import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLogin } from '@/hooks/useLogin'
import { getPath } from '@/data/paths.data'
import type { LoginCredentials } from '@/models/authModels'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    contraseña: ''
  })
  const [error, setError] = useState<string | undefined>(undefined)

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Usar el hook de login con React Query
  const loginMutation = useLogin({
    onSuccess: () => {      
      // Redirigir a la página desde donde vino o al inicio
      const from = searchParams.get('from') || getPath('inicio').url
      navigate(from, { replace: true })
    },
    onError: (error) => {
      setError(error.message)
    }
  })

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      setError('El email es requerido')
      return false
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('El formato del email no es válido')
      return false
    }

    if (!formData.contraseña) {
      setError('La contraseña es requerida')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(undefined)

    if (!validateForm()) {
      return
    }

    // Preparar credenciales para el login
    const credentials: LoginCredentials = {
      email: formData.email.trim().toLowerCase(),
      contraseña: formData.contraseña
    }

    // Ejecutar mutación de login
    loginMutation.mutate(credentials)
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="mb-4">
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>Ingresa tu email para iniciar sesión en tu cuenta</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="usuario@ejemplo.com"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    required
                    disabled={loginMutation.isPending}
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Contraseña</Label>
                    <Link to="/" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={formData.contraseña}
                    onChange={handleInputChange('contraseña')}
                    required
                    disabled={loginMutation.isPending}
                  />
                </div>

                {error !== undefined && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? 'Ingresando...' : 'Ingresar'}
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                ¿No tenes una cuenta? {''}
                <Link to={getPath('registro').url} className="underline underline-offset-4">
                  Registrarse
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage
