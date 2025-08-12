import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Upload,
  Link,
  FileAudio,
  Play,
  Download,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Calendar,
  Mic,
} from 'lucide-react'
import { toast } from 'sonner'
import { AUDIENCIAS, CASOS_JUDICIALES, TRANSCRIPCIONES } from '@/data/transcribir.data'

export interface CasoJudicial {
  id: string
  nombre: string
  numero: string
  cliente: string
  estado: 'activo' | 'cerrado' | 'suspendido'
  fechaCreacion: Date
  estudioId: string
  estudioNombre: string
}

export interface Audiencia {
  id: string
  nombre: string
  fecha: Date
  hora: string
  tipo: string
  estado: 'programada' | 'en_curso' | 'completada' | 'cancelada'
  casoId: string
  descripcion?: string
}

export interface Transcripcion {
  id: string
  tipo: 'audio' | 'youtube' | 'en_vivo'
  nombre: string
  url?: string
  duracion?: string
  estado: 'procesando' | 'completada' | 'error'
  fechaCreacion: Date
  fechaCompletada?: Date
  archivoOriginal?: string
  textoTranscrito?: string
  audienciaId?: string // Cambiado de casoId a audienciaId
}

export default function TranscripcionesPage() {
  const [casos, setCasos] = useState<CasoJudicial[]>(CASOS_JUDICIALES)

  const [audiencias, setAudiencias] = useState<Audiencia[]>(AUDIENCIAS)

  const [transcripciones, setTranscripciones] = useState<Transcripcion[]>(TRANSCRIPCIONES)

  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroEstudio, setFiltroEstudio] = useState('all')
  const [filtroCaso, setFiltroCaso] = useState('all')
  const [transcripcionAVincular, setTranscripcionAVincular] = useState<string | null>(null)
  const [showVincularDialog, setShowVincularDialog] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [historialSearchTerm, setHistorialSearchTerm] = useState('')
  const [historialFiltroTipo, setHistorialFiltroTipo] = useState('all')
  const [historialFiltroEstado, setHistorialFiltroEstado] = useState('all')
  const [historialFiltroVinculacion, setHistorialFiltroVinculacion] = useState('all')

  const vincularTranscripcion = (audienciaId: string) => {
    if (!transcripcionAVincular) return

    setTranscripciones((prev) => prev.map((t) => (t.id === transcripcionAVincular ? { ...t, audienciaId } : t)))

    const audiencia = audiencias.find((a) => a.id === audienciaId)
    const caso = casos.find((c) => c.id === audiencia?.casoId)
    toast.success(`Transcripción vinculada a ${audiencia?.nombre} del caso ${caso?.numero}`)
    setShowVincularDialog(false)
    setTranscripcionAVincular(null)
    setSearchTerm('')
    setFiltroEstudio('all')
    setFiltroCaso('all')
  }

  const getAudienciaYCasoPorId = (audienciaId?: string) => {
    const audiencia = audiencias.find((aud) => aud.id === audienciaId)
    const caso = audiencia ? casos.find((caso) => caso.id === audiencia.casoId) : undefined
    return { audiencia, caso }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const allowedTypes = ['audio/mp3', 'audio/wav', 'audio/m4a', 'audio/ogg']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Formato de archivo no soportado. Use MP3, WAV, M4A u OGG.')
      return
    }

    if (file.size > 100 * 1024 * 1024) {
      toast.error('El archivo es demasiado grande. Máximo 100MB.')
      return
    }

    setIsProcessing(true)

    setTimeout(() => {
      const nuevaTranscripcion: Transcripcion = {
        id: Date.now().toString(),
        tipo: 'audio',
        nombre: file.name,
        duracion: 'Calculando...',
        estado: 'procesando',
        fechaCreacion: new Date(),
        archivoOriginal: file.name,
      }

      setTranscripciones((prev) => [nuevaTranscripcion, ...prev])
      setIsProcessing(false)
      toast.success('Archivo subido correctamente. Iniciando transcripción...')

      setTimeout(() => {
        setTranscripciones((prev) =>
          prev.map((t) =>
            t.id === nuevaTranscripcion.id
              ? { ...t, estado: 'completada' as const, fechaCompletada: new Date(), duracion: '15:30' }
              : t
          )
        )
        toast.success('Transcripción completada')
      }, 3000)
    }, 2000)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleYoutubeSubmit = () => {
    if (!youtubeUrl.trim()) {
      toast.error('Por favor ingresa una URL de YouTube')
      return
    }

    setIsProcessing(true)

    setTimeout(() => {
      const nuevaTranscripcion: Transcripcion = {
        id: Date.now().toString(),
        tipo: 'youtube',
        nombre: `Video de YouTube - ${new Date().toLocaleDateString()}`,
        url: youtubeUrl,
        duracion: 'Calculando...',
        estado: 'procesando',
        fechaCreacion: new Date(),
      }

      setTranscripciones((prev) => [nuevaTranscripcion, ...prev])
      setYoutubeUrl('')
      setIsProcessing(false)
      toast.success('URL procesada correctamente. Iniciando transcripción...')

      setTimeout(() => {
        setTranscripciones((prev) =>
          prev.map((t) =>
            t.id === nuevaTranscripcion.id
              ? {
                  ...t,
                  estado: 'completada' as const,
                  fechaCompletada: new Date(),
                  duracion: '42:18',
                  nombre: 'Conferencia sobre Nuevas Reformas Legales',
                }
              : t
          )
        )
        toast.success('Transcripción de YouTube completada')
      }, 5000)
    }, 2000)
  }

  const eliminarTranscripcion = (id: string) => {
    setTranscripciones((prev) => prev.filter((t) => t.id !== id))
    toast.success('Transcripción eliminada')
  }

  const descargarTranscripcion = (transcripcion: Transcripcion) => {
    if (transcripcion.estado !== 'completada') {
      toast.error('La transcripción aún no está completada')
      return
    }

    toast.success('Descargando transcripción...')
  }

  const getEstadoIcon = (estado: Transcripcion['estado']) => {
    switch (estado) {
      case 'completada':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'procesando':
        return <Clock className="h-4 w-4 text-blue-600 animate-spin" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />
    }
  }

  const getEstadoBadge = (estado: Transcripcion['estado']) => {
    switch (estado) {
      case 'completada':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 w-24 justify-center">
            Completada
          </Badge>
        )
      case 'procesando':
        return (
          <Badge variant="secondary" className="w-24 justify-center">
            Procesando...
          </Badge>
        )
      case 'error':
        return (
          <Badge variant="destructive" className="w-24 justify-center">
            Error
          </Badge>
        )
    }
  }

  const getTipoIcon = (tipo: Transcripcion['tipo']) => {
    switch (tipo) {
      case 'audio':
        return <FileAudio className="h-5 w-5 text-blue-600" />
      case 'youtube':
        return <Play className="h-5 w-5 text-red-600" />
      case 'en_vivo':
        return <Mic className="h-5 w-5 text-green-600" />
    }
  }

  const audienciasFiltradas = audiencias.filter((audiencia) => {
    const caso = casos.find((c) => c.id === audiencia.casoId)
    if (!caso) return false

    const matchesSearch =
      audiencia.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caso.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caso.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caso.cliente.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesEstudio = filtroEstudio === 'all' || caso.estudioId === filtroEstudio
    const matchesCaso = filtroCaso === 'all' || audiencia.casoId === filtroCaso

    return matchesSearch && matchesEstudio && matchesCaso && caso.estado === 'activo'
  })

  const transcripcionesFiltradas = transcripciones.filter((transcripcion) => {
    const { audiencia, caso } = getAudienciaYCasoPorId(transcripcion.audienciaId)

    const matchesSearch =
      transcripcion.nombre.toLowerCase().includes(historialSearchTerm.toLowerCase()) ||
      audiencia?.nombre.toLowerCase().includes(historialSearchTerm.toLowerCase()) ||
      caso?.nombre.toLowerCase().includes(historialSearchTerm.toLowerCase()) ||
      caso?.numero.toLowerCase().includes(historialSearchTerm.toLowerCase()) ||
      caso?.cliente.toLowerCase().includes(historialSearchTerm.toLowerCase())

    const matchesTipo = historialFiltroTipo === 'all' || transcripcion.tipo === historialFiltroTipo
    const matchesEstado = historialFiltroEstado === 'all' || transcripcion.estado === historialFiltroEstado
    const matchesVinculacion =
      historialFiltroVinculacion === 'all' ||
      (historialFiltroVinculacion === 'vinculadas' && transcripcion.audienciaId) ||
      (historialFiltroVinculacion === 'sin_vincular' && !transcripcion.audienciaId)

    return matchesSearch && matchesTipo && matchesEstado && matchesVinculacion
  })

  // Crear estudios únicos correctamente
  const estudiosMap = new Map()
  casos.forEach((caso) => {
    if (!estudiosMap.has(caso.estudioId)) {
      estudiosMap.set(caso.estudioId, { id: caso.estudioId, nombre: caso.estudioNombre })
    }
  })
  const estudiosUnicos = Array.from(estudiosMap.values())
  const casosActivos = casos.filter((caso) => caso.estado === 'activo')

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div>
        <p className="text-gray-600 mt-1">
          Sube archivos de audio o agrega URLs de YouTube para generar transcripciones automáticas de audiencias y casos
          judiciales
        </p>
      </div>

      <Tabs defaultValue="audio" className="mb-1">
        <TabsList className="w-full">
          <TabsTrigger value="audio" className="flex items-center gap-2">
            <FileAudio className="h-4 w-4" />
            Subir Audio
          </TabsTrigger>
          <TabsTrigger value="youtube" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            YouTube
          </TabsTrigger>
          <TabsTrigger value="en_vivo" className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            En Vivo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="audio" className="mb-3">
          <Card>
            <CardHeader className="mb-4">
              <CardTitle className="flex items-center gap-2">
                <FileAudio className="h-5 w-5 text-blue-600" />
                Subir Archivo de Audio
              </CardTitle>
              <CardDescription>Formatos soportados: MP3, WAV, M4A, OGG. Tamaño máximo: 100MB</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isProcessing}
                />
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Arrastra tu archivo aquí o haz clic para seleccionar
                </p>
                <p className="text-sm text-gray-500 mb-4">Archivos de audio hasta 100MB</p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isProcessing ? 'Procesando...' : 'Seleccionar Archivo'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="youtube" className="mb-3">
          <Card>
            <CardHeader className="mb-4">
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5 text-red-600" />
                Transcribir desde YouTube
              </CardTitle>
              <CardDescription>Ingresa la URL de un video de YouTube para generar su transcripción</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="youtube-url">URL de YouTube</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="youtube-url"
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      disabled={isProcessing}
                    />
                    <Button
                      onClick={handleYoutubeSubmit}
                      disabled={isProcessing || !youtubeUrl.trim()}
                      className="bg-red-600 hover:bg-red-700 whitespace-nowrap"
                    >
                      {isProcessing ? 'Procesando...' : 'Transcribir'}
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-500">Nota: Solo videos públicos de YouTube son soportados</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="en_vivo" className="mb-3">
          <Card>
            <CardHeader className="mb-4">
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5 text-green-600" />
                Transcripción en Tiempo Real
              </CardTitle>
              <CardDescription>Inicia una sesión de transcripción en vivo para audiencias en curso</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-green-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
                <Mic className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">Transcripción en Tiempo Real</p>
                <p className="text-sm text-gray-500 mb-4">Captura y transcribe audio en vivo durante audiencias</p>
                <Button disabled={isProcessing} className="bg-green-600 hover:bg-green-700">
                  {isProcessing ? 'Iniciando...' : 'Iniciar Transcripción en Vivo'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader className="mb-4">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Historial de Transcripciones
          </CardTitle>
          <CardDescription>Administra y busca todas tus transcripciones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label className="mb-1" htmlFor="historial-search">
                  Buscar transcripción
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="historial-search"
                    placeholder="Nombre, caso, audiencia..."
                    value={historialSearchTerm}
                    onChange={(e) => setHistorialSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label className="mb-1" htmlFor="historial-tipo">
                  Tipo
                </Label>
                <Select value={historialFiltroTipo} onValueChange={setHistorialFiltroTipo}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="en_vivo">En Vivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-1" htmlFor="historial-estado">
                  Estado
                </Label>
                <Select value={historialFiltroEstado} onValueChange={setHistorialFiltroEstado}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="completada">Completada</SelectItem>
                    <SelectItem value="procesando">Procesando</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="sm:col-span-2 lg:col-span-1">
                <Label className="mb-1" htmlFor="historial-vinculacion">
                  Vinculación
                </Label>
                <Select value={historialFiltroVinculacion} onValueChange={setHistorialFiltroVinculacion}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="vinculadas">Vinculadas</SelectItem>
                    <SelectItem value="sin_vincular">Sin vincular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {(historialSearchTerm ||
              historialFiltroTipo !== 'all' ||
              historialFiltroEstado !== 'all' ||
              historialFiltroVinculacion !== 'all') && (
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setHistorialSearchTerm('')
                    setHistorialFiltroTipo('all')
                    setHistorialFiltroEstado('all')
                    setHistorialFiltroVinculacion('all')
                  }}
                >
                  Limpiar filtros
                </Button>
              </div>
            )}
          </div>

          {transcripcionesFiltradas.length === 0 ? (
            <div className="text-center py-8">
              <FileAudio className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              {transcripciones.length === 0 ? (
                <>
                  <p className="text-gray-500">No hay transcripciones aún</p>
                  <p className="text-sm text-gray-400">
                    Sube un archivo, agrega una URL de YouTube o inicia una transcripción en vivo
                  </p>
                </>
              ) : (
                <>
                  <p className="text-gray-500">No se encontraron transcripciones</p>
                  <p className="text-sm text-gray-400">Intenta ajustar los filtros de búsqueda</p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>
                  Mostrando {transcripcionesFiltradas.length} de {transcripciones.length} transcripciones
                </span>
              </div>

              {transcripcionesFiltradas.map((transcripcion, index) => {
                const { audiencia, caso } = getAudienciaYCasoPorId(transcripcion.audienciaId)
                return (
                  <div key={transcripcion.id}>
                    <div className="p-4 border rounded-lg hover:bg-gray-50">
                      {/* Encabezado con icono, título y estado */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {getTipoIcon(transcripcion.tipo)}
                            {getEstadoIcon(transcripcion.estado)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 truncate">{transcripcion.nombre}</h3>
                          </div>
                        </div>
                        {/* Estado badge - móvil abajo, desktop a la derecha */}
                        <div className="hidden sm:flex items-center">{getEstadoBadge(transcripcion.estado)}</div>
                      </div>

                      {/* Estado en móviles */}
                      <div className="sm:hidden mb-3">{getEstadoBadge(transcripcion.estado)}</div>

                      {/* Información de duración y fecha */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mb-3">
                        <span>Duración: {transcripcion.duracion}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{transcripcion.fechaCreacion.toLocaleDateString()}</span>
                        {transcripcion.url && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <a
                              href={transcripcion.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline break-all"
                            >
                              Ver original
                            </a>
                          </>
                        )}
                      </div>

                      {/* Información del caso/audiencia vinculado y botones */}
                      {audiencia && caso ? (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">Vinculado a:</span>
                          </div>
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline" className="text-xs">
                                {audiencia.nombre}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {caso.numero} - {caso.nombre}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {caso.estudioNombre}
                              </Badge>
                            </div>

                            {/* Botones a la derecha */}
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => descargarTranscripcion(transcripcion)}
                                disabled={transcripcion.estado !== 'completada'}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => eliminarTranscripcion(transcripcion.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-amber-500" />
                              <span className="text-sm text-amber-600">Sin vincular a audiencia</span>
                            </div>

                            {/* Botones a la derecha */}
                            <div className="flex gap-2">
                              {transcripcion.estado === 'completada' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setTranscripcionAVincular(transcripcion.id)
                                    setShowVincularDialog(true)
                                  }}
                                >
                                  <Link className="h-4 w-4 mr-1" />
                                  <span className="hidden sm:inline">Vincular</span>
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => descargarTranscripcion(transcripcion)}
                                disabled={transcripcion.estado !== 'completada'}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => eliminarTranscripcion(transcripcion.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    {index < transcripcionesFiltradas.length - 1 && <Separator className="my-2" />}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showVincularDialog} onOpenChange={setShowVincularDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Vincular a Audiencia</DialogTitle>
            <DialogDescription>
              Busca y selecciona la audiencia a la que deseas vincular esta transcripción
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label className="mb-1" htmlFor="search">
                  Buscar audiencia
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Audiencia, caso, número..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
              </div>

              <div>
                <Label className="mb-1" htmlFor="filtro-estudio">
                  Estudio
                </Label>
                <Select value={filtroEstudio} onValueChange={setFiltroEstudio}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todos los estudios" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estudios</SelectItem>
                    {estudiosUnicos.map((estudio) => (
                      <SelectItem key={estudio.id} value={estudio.id}>
                        {estudio.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-1" htmlFor="filtro-caso">
                  Caso
                </Label>
                <Select value={filtroCaso} onValueChange={setFiltroCaso}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todos los casos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los casos</SelectItem>
                    {casosActivos.map((caso) => (
                      <SelectItem key={caso.id} value={caso.id}>
                        {caso.numero} - {caso.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border rounded-lg max-h-96 overflow-y-auto">
              {audienciasFiltradas.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No se encontraron audiencias que coincidan con los filtros</p>
                </div>
              ) : (
                <div className="divide-y">
                  {audienciasFiltradas.map((audiencia) => {
                    const caso = casos.find((c) => c.id === audiencia.casoId)
                    return (
                      <button
                        key={audiencia.id}
                        type="button"
                        className="w-full p-4 hover:bg-gray-50 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                        onClick={() => vincularTranscripcion(audiencia.id)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">{audiencia.nombre}</h4>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
                              <span>{audiencia.fecha.toLocaleDateString()}</span>
                              <span className="hidden sm:inline">•</span>
                              <span>{audiencia.hora}</span>
                              <span className="hidden sm:inline">•</span>
                              <span>{audiencia.tipo}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                {caso?.numero} - {caso?.nombre}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {caso?.estudioNombre}
                              </Badge>
                              <Badge variant="outline" className="text-xs w-24 justify-center">
                                {audiencia.estado}
                              </Badge>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="self-start sm:self-center pointer-events-none">
                            <Link className="h-4 w-4" />
                          </Button>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
