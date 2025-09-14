import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRegister } from '@/hooks/useRegister'
import { getPath } from '@/data/paths.data'
import type { RegisterData } from '@/models/authModels'

const RegistroPage = () => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    contraseña: '',
    confirmPassword: '',
  })
  const [error, setError] = useState<string | undefined>(undefined)

  const navigate = useNavigate()

  // Usar el hook de registro con React Query
  const registerMutation = useRegister({
    onSuccess: () => {
      // Redirigir al inicio después del registro exitoso
      navigate(getPath('inicio').url, { replace: true })
    },
    onError: (error) => {
      setError(error.message)
    }
  })

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const validateForm = () => {
    if (!formData.nombres.trim()) {
      setError('El nombre es requerido')
      return false
    }
    if (!formData.apellidos.trim()) {
      setError('El apellido es requerido')
      return false
    }
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
    if (formData.contraseña.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return false
    }
    if (formData.contraseña !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
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

    // Preparar datos para el registro
    const registerData: RegisterData = {
      nombres: formData.nombres.trim(),
      apellidos: formData.apellidos.trim(),
      email: formData.email.trim().toLowerCase(),
      contraseña: formData.contraseña,
    }

    // Ejecutar mutación de registro
    registerMutation.mutate(registerData)
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="mb-4">
            <CardTitle>Registro</CardTitle>
            <CardDescription>Completa la siguiente información para poder utilizar nuestra aplicación</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                {/* Nombres */}
                <div className="grid gap-3">
                  <Label htmlFor="register_form-nombres">Nombres</Label>
                  <Input
                    id="register_form-nombres"
                    type="text"
                    value={formData.nombres}
                    onChange={handleInputChange('nombres')}
                    required
                    disabled={registerMutation.isPending}
                  />
                </div>

                {/* Apellidos */}
                <div className="grid gap-3">
                  <Label htmlFor="register_form-apellidos">Apellidos</Label>
                  <Input
                    id="register_form-apellidos"
                    type="text"
                    value={formData.apellidos}
                    onChange={handleInputChange('apellidos')}
                    required
                    disabled={registerMutation.isPending}
                  />
                </div>

                {/* Email */}
                <div className="grid gap-3">
                  <Label htmlFor="register_form-email">Email</Label>
                  <Input
                    id="register_form-email"
                    type="email"
                    placeholder="usuario@ejemplo.com"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    required
                    disabled={registerMutation.isPending}
                  />
                </div>

                {/* Contraseña */}
                <div className="grid gap-3">
                  <Label htmlFor="register_form-contraseña">Contraseña</Label>
                  <Input
                    id="register_form-contraseña"
                    type="password"
                    value={formData.contraseña}
                    onChange={handleInputChange('contraseña')}
                    required
                    disabled={registerMutation.isPending}
                    placeholder="Mínimo 8 caracteres"
                  />
                </div>

                {/* Confirmar Contraseña */}
                <div className="grid gap-3">
                  <Label htmlFor="register_form-confirmar_contraseña">Confirmar Contraseña</Label>
                  <Input
                    id="register_form-confirmar_contraseña"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange('confirmPassword')}
                    required
                    disabled={registerMutation.isPending}
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
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? 'Registrando...' : 'Registrarse'}
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                ¿Ya tienes una cuenta? {''}
                <Link to={getPath('login').url} className="underline underline-offset-4">
                  Iniciar Sesión
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default RegistroPage
