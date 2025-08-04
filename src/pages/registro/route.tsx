import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const RegistroPage = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Registro</CardTitle>
            <CardDescription>Completa la siguiente información para poder utilizar nuestra aplicación</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                {/* Nombre/s */}
                <div className="grid gap-3">
                  <Label htmlFor="register_form-nombre">Nombre/s</Label>
                  <Input id="register_form-nombre" type="email" required />
                </div>
                {/* Apellido/s */}
                <div className="grid gap-3">
                  <Label htmlFor="register_form-apellido">Apellido/s</Label>
                  <Input id="register_form-apellido" type="text" required />
                </div>
                {/* Email */}
                <div className="grid gap-3">
                  <Label htmlFor="register_form-email">Email</Label>
                  <Input id="register_form-email" type="email" placeholder="m@ejemplo.com" required />
                </div>
                {/* Contraseña */}
                <div className="grid gap-3">
                  <Label htmlFor="register_form-clave">Contraseña</Label>
                  <Input id="register_form-clave" type="password" required />
                </div>
                {/* Confirmar Contraseña */}
                <div className="grid gap-3">
                  <Label htmlFor="register_form-confirmar_clave">Confirmar Contraseña</Label>
                  <Input id="register_form-confirmar_clave" type="password" required />
                </div>
                <div className="flex flex-col gap-3">
                  <Button type="button" className="w-full">
                    Registrarse
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default RegistroPage
