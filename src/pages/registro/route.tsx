import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuthActions } from '@/hooks/useAuth'
import { getPath } from '@/data/paths.data'

const RegistroPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    password: '',
    confirmPassword: '',
    perfil: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  const { register } = useAuthActions()
  const navigate = useNavigate()

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handlePerfilChange = (value: string) => {
    setFormData((prev) => ({ ...prev, perfil: value }))
  }

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      setError('El nombre es requerido')
      return false
    }
    if (!formData.apellido.trim()) {
      setError('El apellido es requerido')
      return false
    }
    if (!formData.correo.trim()) {
      setError('El correo es requerido')
      return false
    }
    if (!formData.password) {
      setError('La contraseña es requerida')
      return false
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return false
    }
    if (!formData.perfil) {
      setError('Debes seleccionar un perfil')
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

    setIsLoading(true)

    try {
      await register({
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        correo: formData.correo.trim(),
        password: formData.password,
        perfil: formData.perfil,
      })

      // Redirigir al inicio después del registro exitoso
      navigate(getPath('inicio').url, { replace: true })
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al registrar usuario')
    } finally {
      setIsLoading(false)
    }
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
                {/* Nombre/s */}
                <div className="grid gap-3">
                  <Label htmlFor="register_form-nombre">Nombre/s</Label>
                  <Input
                    id="register_form-nombre"
                    type="text"
                    value={formData.nombre}
                    onChange={handleInputChange('nombre')}
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Apellido/s */}
                <div className="grid gap-3">
                  <Label htmlFor="register_form-apellido">Apellido/s</Label>
                  <Input
                    id="register_form-apellido"
                    type="text"
                    value={formData.apellido}
                    onChange={handleInputChange('apellido')}
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Email */}
                <div className="grid gap-3">
                  <Label htmlFor="register_form-email">Email</Label>
                  <Input
                    id="register_form-email"
                    type="email"
                    placeholder="m@ejemplo.com"
                    value={formData.correo}
                    onChange={handleInputChange('correo')}
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Perfil */}
                <div className="grid gap-3">
                  <Label htmlFor="register_form-perfil">Perfil</Label>
                  <Select onValueChange={handlePerfilChange} disabled={isLoading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu perfil" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Visualizador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Contraseña */}
                <div className="grid gap-3">
                  <Label htmlFor="register_form-clave">Contraseña</Label>
                  <Input
                    id="register_form-clave"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Confirmar Contraseña */}
                <div className="grid gap-3">
                  <Label htmlFor="register_form-confirmar_clave">Confirmar Contraseña</Label>
                  <Input
                    id="register_form-confirmar_clave"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange('confirmPassword')}
                    required
                    disabled={isLoading}
                  />
                </div>

                {error !== undefined && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>
                )}

                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Registrando...' : 'Registrarse'}
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
