import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getPath } from '@/data/paths.data'
import { Scale, Home, FileX } from 'lucide-react'
import { Link } from 'react-router'

export default function PageNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardContent className="pt-8 pb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Scale className="h-16 w-16 text-slate-400" />
              <FileX className="h-8 w-8 text-red-400 absolute -top-1 -right-1" />
            </div>
          </div>

          <h1 className="text-6xl font-bold text-slate-800 mb-2">404</h1>

          <h2 className="text-xl font-semibold text-slate-700 mb-3">Página No Encontrada</h2>

          <p className="text-slate-600 mb-6 leading-relaxed">
            La página que busca no se encuentra en nuestros archivos. Puede que haya sido movida, eliminada o la URL sea
            incorrecta.
          </p>

          <div className="space-y-3">
            <Link to={getPath('inicio').url}>
              <Button className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Volver al Inicio
              </Button>
            </Link>

            <p className="text-sm text-slate-500">Si necesita asistencia, contacte al administrador del sistema</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
