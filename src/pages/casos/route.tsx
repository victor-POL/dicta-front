import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Plus,
  Search,
  Calendar,
  FileText,
  ChevronDown,
  ChevronRight,
  Edit,
  Mic,
  Youtube,
  Radio,
  Clock,
  User,
  Building,
  Loader2,
} from 'lucide-react'
import { useEstudios } from '@/hooks/useEstudios'
import { useCrearCaso, useCasos } from '@/hooks/useCasos'
import { useCrearAudiencia } from '@/hooks/useAudiencias'


export default function AdministrarCasos() {
  // Valores iniciales para formularios
  const INITIAL_CASO_FORM = {
    estudioId: '',
    numero_expediente: '',
    cliente: '',
    descripcion: '',
    fecha_inicio: '',
  }

  const INITIAL_AUDIENCIA_FORM = {
    expediente_id: "",
    titulo: '',
    fecha: '',
    hora: '',
    lugar: '',
    descripcion: '',
  }

  // Hooks para datos reales
  const { data: estudiosReales } = useEstudios()
  const { data: casosReales, isFetching: cargandoCasos } = useCasos()

  const { mutate: crearCaso, isPending: creandoCaso } = useCrearCaso()
  const { mutate: crearAudiencia, isPending: creandoAudiencia } = useCrearAudiencia()

  const casos = casosReales || []
  const estudios = estudiosReales || []

  // Toogles
  const [expandedCasos, setExpandedCasos] = useState<Set<number>>(new Set([1]))
  const [expandedAudiencias, setExpandedAudiencias] = useState<Set<number>>(new Set([1]))

  // Filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEstudio, setSelectedEstudio] = useState<string>('all')

  // Estados para modales
  const [isOpenModalCrearCaso, setIsOpenModalCrearCaso] = useState(false)
  const [isOpenModalCrearAudiencia, setIsOpenModalCrearAudiencia] = useState(false)

  // Estados para formularios
  const [nuevoCaso, setNuevoCaso] = useState(INITIAL_CASO_FORM)
  const [nuevaAudiencia, setNuevaAudiencia] = useState(INITIAL_AUDIENCIA_FORM)

  // Estados para errores de formulario
  const [errorCaso, setErrorCaso] = useState<string>('')
  const [errorAudiencia, setErrorAudiencia] = useState<string>('')

  // Funciones para resetear formularios
  const resetFormularioCaso = () => {
    setNuevoCaso(INITIAL_CASO_FORM)
    setErrorCaso('')
  }

  const resetFormularioAudiencia = () => {
    setNuevaAudiencia(INITIAL_AUDIENCIA_FORM)
    setErrorAudiencia('')
  }

  // Manejadores para abrir/cerrar modales con reset
  const handleOpenModalCaso = () => {
    resetFormularioCaso()
    setIsOpenModalCrearCaso(true)
  }

  const handleCloseModalCaso = (open: boolean) => {
    if (!open) {
      resetFormularioCaso()
    }
    setIsOpenModalCrearCaso(open)
  }

  const handleOpenModalAudiencia = () => {
    resetFormularioAudiencia()
    setIsOpenModalCrearAudiencia(true)
  }

  const handleCloseModalAudiencia = (open: boolean) => {
    if (!open) {
      resetFormularioAudiencia()
    }
    setIsOpenModalCrearAudiencia(open)
  }

  const toggleCaso = (casoId: number) => {
    const newExpanded = new Set(expandedCasos)
    if (newExpanded.has(casoId)) {
      newExpanded.delete(casoId)
    } else {
      newExpanded.add(casoId)
    }
    setExpandedCasos(newExpanded)
  }

  const toggleAudiencia = (audienciaId: number) => {
    const newExpanded = new Set(expandedAudiencias)
    if (newExpanded.has(audienciaId)) {
      newExpanded.delete(audienciaId)
    } else {
      newExpanded.add(audienciaId)
    }
    setExpandedAudiencias(newExpanded)
  }

  const handleCrearCaso = () => {
    if (!nuevoCaso.numero_expediente.trim()) {
      setErrorCaso('El número de expediente es obligatorio')
      return
    }

    if (!nuevoCaso.cliente.trim()) {
      setErrorCaso('El nombre del cliente es obligatorio')
      return
    }

    if (!nuevoCaso.estudioId) {
      setErrorCaso('Debe seleccionar un estudio')
      return
    }

    if (!nuevoCaso.fecha_inicio) {
      setErrorCaso('La fecha de inicio es obligatoria')
      return
    }


    const casoData = {
      numero: nuevoCaso.numero_expediente.trim(),
      cliente: nuevoCaso.cliente.trim(),
      fecha_inicio: nuevoCaso.fecha_inicio,
      descripcion: nuevoCaso.descripcion?.trim() || null
    }

    crearCaso(
      { estudioId: parseInt(nuevoCaso.estudioId), casoData: casoData },
      {
        onSuccess: () => {
          resetFormularioCaso()
          setIsOpenModalCrearCaso(false)
        },
        onError: (error: any) => {
          const errorMessage = error.response?.data?.error || error.message || 'Error al crear el caso'
          setErrorCaso(errorMessage)
        }
      }
    )
  }

  const handleCrearAudiencia = (expedienteId: number) => {
    if (!nuevaAudiencia.titulo.trim()) {
      setErrorAudiencia('El título es obligatorio')
      return
    }

    if (!nuevaAudiencia.fecha) {
      setErrorAudiencia('La fecha es obligatoria')
      return
    }

    if (!nuevaAudiencia.hora) {
      setErrorAudiencia('La hora es obligatoria')
      return
    }

    const audienciaData = {
      titulo: nuevaAudiencia.titulo.trim(),
      fecha_hora: new Date(`${nuevaAudiencia.fecha}T${nuevaAudiencia.hora}`).toISOString(),
      lugar: nuevaAudiencia.lugar?.trim() || null,
      descripcion: nuevaAudiencia.descripcion?.trim() || null
    }

    crearAudiencia(
      { expedienteId: expedienteId, audienciaData },
      {
        onSuccess: () => {
          resetFormularioAudiencia()
          setIsOpenModalCrearAudiencia(false)
        },
        onError: (error: any) => {
          const errorMessage = error.response?.data?.error || error.message || 'Error al crear la audiencia'
          setErrorAudiencia(errorMessage)
        }
      }
    )
  }

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'activo':
        return 'bg-green-100 text-green-800'
      case 'cerrado':
        return 'bg-gray-100 text-gray-800'
      case 'suspendido':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTranscripcionIcon = (tipo: string) => {
    switch (tipo) {
      case 'audio':
        return <Mic className="h-4 w-4" />
      case 'youtube':
        return <Youtube className="h-4 w-4" />
      case 'en_vivo':
        return <Radio className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getTranscripcionColor = (tipo: string) => {
    switch (tipo) {
      case 'audio':
        return 'bg-blue-100 text-blue-800'
      case 'youtube':
        return 'bg-red-100 text-red-800'
      case 'en_vivo':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredCasos = casos.filter((caso) => {
    const matchesSearch =
      caso.numero_expediente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caso.cliente.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEstudio = selectedEstudio === 'all' || caso.estudio_id === Number(selectedEstudio)
    return matchesSearch && matchesEstudio
  })

  if (cargandoCasos) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Cargando casos...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-600 mt-1">Gestiona tus casos, audiencias y transcripciones</p>
        </div>

        <Dialog open={isOpenModalCrearCaso} onOpenChange={handleCloseModalCaso}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 shadow-md" onClick={handleOpenModalCaso}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Caso
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nuevo Caso</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="numero_expediente" className="text-sm font-medium">
                  Número de Expediente *
                </Label>
                <Input
                  id="numero_expediente"
                  value={nuevoCaso.numero_expediente}
                  onChange={(e) => setNuevoCaso({ ...nuevoCaso, numero_expediente: e.target.value })}
                  placeholder="EXP-2024-AR"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="cliente" className="text-sm font-medium">
                  Cliente *
                </Label>
                <Input
                  id="cliente"
                  value={nuevoCaso.cliente}
                  onChange={(e) => setNuevoCaso({ ...nuevoCaso, cliente: e.target.value })}
                  placeholder="Nombre del cliente"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="estudio" className="text-sm font-medium">
                  Estudio *
                </Label>
                <Select
                  value={nuevoCaso.estudioId}
                  onValueChange={(value) => setNuevoCaso({ ...nuevoCaso, estudioId: value })}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Seleccionar estudio" />
                  </SelectTrigger>
                  <SelectContent>
                    {estudios.map((estudio) => (
                      <SelectItem key={estudio.id} value={estudio.id.toString()}>
                        {estudio.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="fecha_inicio" className="text-sm font-medium">
                  Fecha de Inicio *
                </Label>
                <Input
                  id="fecha_inicio"
                  type="date"
                  value={nuevoCaso.fecha_inicio}
                  onChange={(e) => setNuevoCaso({ ...nuevoCaso, fecha_inicio: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="descripcion" className="text-sm font-medium">
                  Descripción
                </Label>
                <Textarea
                  id="descripcion"
                  value={nuevoCaso.descripcion}
                  onChange={(e) => setNuevoCaso({ ...nuevoCaso, descripcion: e.target.value })}
                  placeholder="Descripción del caso"
                  rows={3}
                  className="mt-1"
                />
              </div>
              {errorCaso && (
                <p className="text-sm text-red-600 mt-1">{errorCaso}</p>
              )}
            </div>
            <DialogFooter className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => handleCloseModalCaso(false)} className="flex-1">
                Cancelar
              </Button>
              <Button
                onClick={handleCrearCaso}
                disabled={creandoCaso}
                className="flex-1"
              >
                {creandoCaso ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creando...
                  </>
                ) : (
                  'Crear Caso'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por expediente o cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedEstudio} onValueChange={setSelectedEstudio}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos los estudios" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estudios</SelectItem>
                {estudios.map((estudio) => (
                  <SelectItem key={estudio.id} value={estudio.id.toString()}>
                    {estudio.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Casos */}
      <div className="space-y-4">
        {filteredCasos.map((caso) => (
          <Card key={caso.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex flex-col space-y-3 md:space-y-0">
                {/* Primera fila - Información principal */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <Button variant="ghost" size="sm" onClick={() => toggleCaso(caso.id)} className="p-1 mt-1">
                      {expandedCasos.has(caso.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <h3 className="font-semibold text-lg truncate">{caso.numero_expediente}</h3>
                        <Badge className={getEstadoBadgeColor(caso.estado)}>{caso.estado}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant="outline" className="text-xs">
                      {caso.audiencias.length} audiencias
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Segunda fila - Detalles */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 ml-10 md:ml-12 text-sm text-gray-600">
                  <div className="flex items-center gap-1 truncate">
                    <User className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{caso.cliente}</span>
                  </div>
                  <div className="flex items-center gap-1 truncate">
                    <Building className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{caso.estudio_nombre}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <span>{new Date(caso.fecha_inicio).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              {caso.descripcion && <p className="text-gray-600 text-sm mt-3 ml-10 md:ml-12">{caso.descripcion}</p>}
            </CardHeader>

            {expandedCasos.has(caso.id) && (
              <CardContent className="pt-0">
                <Separator className="mb-4" />

                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-900">Audiencias</h4>
                  <Dialog
                    open={isOpenModalCrearAudiencia}
                    onOpenChange={handleCloseModalAudiencia}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={handleOpenModalAudiencia}>
                        <Plus className="h-4 w-4 mr-1" />
                        Nueva Audiencia
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Nueva Audiencia</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="titulo" className="text-sm font-medium">
                            Título *
                          </Label>
                          <Input
                            id="titulo"
                            value={nuevaAudiencia.titulo}
                            onChange={(e) => setNuevaAudiencia({ ...nuevaAudiencia, titulo: e.target.value })}
                            placeholder="Audiencia Preliminar"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="fecha" className="text-sm font-medium">
                              Fecha *
                            </Label>
                            <Input
                              id="fecha"
                              type="date"
                              value={nuevaAudiencia.fecha}
                              onChange={(e) => setNuevaAudiencia({ ...nuevaAudiencia, fecha: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="hora" className="text-sm font-medium">
                              Hora *
                            </Label>
                            <Input
                              id="hora"
                              type="time"
                              value={nuevaAudiencia.hora}
                              onChange={(e) => setNuevaAudiencia({ ...nuevaAudiencia, hora: e.target.value })}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="lugar" className="text-sm font-medium">
                            Lugar
                          </Label>
                          <Input
                            id="lugar"
                            value={nuevaAudiencia.lugar}
                            onChange={(e) => setNuevaAudiencia({ ...nuevaAudiencia, lugar: e.target.value })}
                            placeholder="Juzgado Civil N°3"
                          />
                        </div>
                        <div>
                          <Label htmlFor="descripcionAud" className="text-sm font-medium">
                            Descripción
                          </Label>
                          <Textarea
                            id="descripcionAud"
                            value={nuevaAudiencia.descripcion}
                            onChange={(e) => setNuevaAudiencia({ ...nuevaAudiencia, descripcion: e.target.value })}
                            placeholder="Descripción de la audiencia"
                            rows={2}
                          />
                        </div>
                        {errorAudiencia && (
                          <p className="text-sm text-red-600 mt-1">{errorAudiencia}</p>
                        )}
                      </div>
                      <DialogFooter className="flex gap-2 pt-4">
                        <Button variant="outline" onClick={() => handleCloseModalAudiencia(false)} className="flex-1">
                          Cancelar
                        </Button>
                        <Button
                          onClick={() => handleCrearAudiencia(caso.id)}
                          className="flex-1"
                          disabled={creandoAudiencia}
                        >
                          {creandoAudiencia ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Creando...
                            </>
                          ) : (
                            'Crear Audiencia'
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {caso.audiencias.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No hay audiencias registradas</p>
                    <p className="text-sm">Crea la primera audiencia para este caso</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {caso.audiencias.map((audiencia) => (
                      <div key={audiencia.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleAudiencia(audiencia.id)}
                              className="p-1 flex-shrink-0"
                            >
                              {expandedAudiencias.has(audiencia.id) ? (
                                <ChevronDown className="h-3 w-3" />
                              ) : (
                                <ChevronRight className="h-3 w-3" />
                              )}
                            </Button>
                            <h5 className="font-medium truncate">{audiencia.titulo}</h5>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 ml-7 sm:ml-0">
                            <Clock className="h-4 w-4 flex-shrink-0" />
                            <span className="whitespace-nowrap">
                              {audiencia.fecha_hora}
                            </span>
                          </div>
                        </div>

                        {audiencia.lugar && <p className="text-sm text-gray-600 mb-2">{audiencia.lugar}</p>}

                        {expandedAudiencias.has(audiencia.id) && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            {audiencia.descripcion && (
                              <p className="text-sm text-gray-600 mb-3">{audiencia.descripcion}</p>
                            )}

                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-gray-700">Transcripciones</span>
                              <Badge variant="outline" className="text-xs">
                                {audiencia.transcripciones.length} transcripciones
                              </Badge>
                            </div>

                            {audiencia.transcripciones.length === 0 ? (
                              <p className="text-xs text-gray-500 italic">No hay transcripciones vinculadas</p>
                            ) : (
                              <div className="space-y-2">
                                {audiencia.transcripciones.map((transcripcion) => (
                                  <div
                                    key={transcripcion.id}
                                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-2 bg-white rounded border"
                                  >
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                      {getTranscripcionIcon(transcripcion.tipo)}
                                      <span className="text-sm truncate">{transcripcion.nombre}</span>
                                      <Badge
                                        className={`text-xs flex-shrink-0 ${getTranscripcionColor(transcripcion.tipo)}`}
                                      >
                                        {transcripcion.tipo === 'realtime'
                                          ? 'En Vivo'
                                          : transcripcion.tipo === 'youtube'
                                            ? 'YouTube'
                                            : 'Audio'}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 ml-6 sm:ml-0 flex-shrink-0">
                                      <span className="whitespace-nowrap">{transcripcion.duracion}</span>
                                      <Badge variant="outline" className="text-xs">
                                        {transcripcion.estado}
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {filteredCasos.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron casos</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedEstudio !== 'all'
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Crea tu primer caso para comenzar'}
          </p>
          {!searchTerm && selectedEstudio === 'all' && (
            <Button onClick={() => setIsOpenModalCrearCaso(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Primer Caso
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
