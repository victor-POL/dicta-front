import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthActions } from '@/hooks/useAuth'
import { getPath } from '@/data/paths.data'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  const { login } = useAuthActions()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(undefined)
    setIsLoading(true)

    try {
      await login({ correo: email, password })

      // Redirigir a la página desde donde vino o al inicio
      const from = searchParams.get('from') || getPath('inicio').url
      navigate(from, { replace: true })
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
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
                  <Label className="" htmlFor="email">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                {error !== undefined && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>
                )}
                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Ingresando...' : 'Ingresar'}
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
