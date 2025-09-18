/* ----------------------------------- UI ----------------------------------- */
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Plus,
  Search,
  Calendar,
  FileText,
  ChevronDown,
  ChevronRight,
  Mic,
  Youtube,
  Radio,
  Clock,
  User,
  Building,
  Loader2,
  Trash2,
} from 'lucide-react'
/* ---------------------------------- HOOKS --------------------------------- */
import { useState } from 'react'
import { useEstudios } from '@/hooks/useEstudios'
import { useCrearCaso, useCasos, useEliminarCaso } from '@/hooks/useCasos'
import { useCrearAudiencia, useEliminarAudiencia } from '@/hooks/useAudiencias'
/* --------------------------------- MODELS --------------------------------- */
import type { AudienciaRequest, CasoRequest } from 'server/models/casoModels'


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

  // React Query hooks
  const { data: estudiosDisponiblesFiltrado, isFetching: cargandoEstudiosDisponiblesFiltrado } = useEstudios({
    autoFetch: true
  })
  const { data: casos, isFetching: cargandoCasos } = useCasos()

  const crearCasoMutation = useCrearCaso()
  const crearAudienciaMutation = useCrearAudiencia()

  const eliminarCasoMutation = useEliminarCaso()
  const eliminarAudienciaMutation = useEliminarAudiencia()

  // Estados locales para UI
  const [casosExpandidos, setCasosExpandidos] = useState<Set<number>>(new Set([]))
  const [audienciasExpandidas, setAudienciasExpandidas] = useState<Set<number>>(new Set([]))

  // Estados para modales
  const [modalCrearCasoAbierto, setModalCrearCasoAbierto] = useState(false)
  const [modalCrearAudienciaAbierto, setModalCrearAudienciaAbierto] = useState(false)

  const { data: estudiosDisponiblesCreacion, isFetching: cargandoEstudiosDisponiblesCreacion } = useEstudios({
    autoFetch: modalCrearCasoAbierto
  })

  const [modalConfirmacionAbierto, setModalConfirmacionAbierto] = useState(false)

  // Estados para confirmación
  const [accionConfirmacion, setAccionConfirmacion] = useState<{
    tipo: 'caso' | 'audiencia';
    titulo: string;
    mensaje: string;
    onConfirmar: () => void;
  } | null>(null)

  // Estados para formularios
  const [nuevoCaso, setNuevoCaso] = useState(INITIAL_CASO_FORM)
  const [nuevaAudiencia, setNuevaAudiencia] = useState(INITIAL_AUDIENCIA_FORM)

  // Estados para errores de formulario
  const [errorCrearCaso, setErrorCrearCaso] = useState<string>('')
  const [errorCrearAudiencia, setErrorCrearAudiencia] = useState<string>('')

  const [errorEliminarCaso, setErrorEliminarCaso] = useState<string>('')
  const [errorEliminarAudiencia, setErrorEliminarAudiencia] = useState<string>('')

  // Filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEstudio, setSelectedEstudio] = useState<string>('all')

  // Toggles para expandir/collapse
  const toggleCaso = (casoId: number) => {
    const nuevosExpandidos = new Set(casosExpandidos)
    if (nuevosExpandidos.has(casoId)) {
      nuevosExpandidos.delete(casoId)
    } else {
      nuevosExpandidos.add(casoId)
    }
    setCasosExpandidos(nuevosExpandidos)
  }

  const toggleAudiencia = (audienciaId: number) => {
    const nuevosExpandidos = new Set(audienciasExpandidas)
    if (nuevosExpandidos.has(audienciaId)) {
      nuevosExpandidos.delete(audienciaId)
    } else {
      nuevosExpandidos.add(audienciaId)
    }
    setAudienciasExpandidas(nuevosExpandidos)
  }

  // Crear
  const crearCaso = () => {
    if (!nuevoCaso.numero_expediente.trim()) {
      setErrorCrearCaso('El número de expediente es obligatorio')
      return
    }

    if (!nuevoCaso.cliente.trim()) {
      setErrorCrearCaso('El nombre del cliente es obligatorio')
      return
    }

    if (!nuevoCaso.estudioId) {
      setErrorCrearCaso('Debe seleccionar un estudio')
      return
    }

    if (!nuevoCaso.fecha_inicio) {
      setErrorCrearCaso('La fecha de inicio es obligatoria')
      return
    }

    // Limpiar error previo
    setErrorCrearCaso('')

    const casoRequest: CasoRequest = {
      numero: nuevoCaso.numero_expediente.trim(),
      cliente: nuevoCaso.cliente.trim(),
      fecha_inicio: nuevoCaso.fecha_inicio,
      descripcion: nuevoCaso.descripcion?.trim() || null
    }

    crearCasoMutation.mutate(
      { estudioId: parseInt(nuevoCaso.estudioId), casoData: casoRequest },
      {
        onSuccess: () => {
          resetFormularioCaso()
          setModalCrearCasoAbierto(false)
        },
        onError: (error: any) => {
          const errorMessage = error.response?.data?.error || error.message || 'Error al crear el caso'
          setErrorCrearCaso(errorMessage)
        }
      }
    )
  }

  const crearAudiencia = (expedienteId: number) => {
    if (!expedienteId) {
      setErrorCrearAudiencia('No se ha seleccionado un expediente válido')
      return
    }

    if (!nuevaAudiencia.titulo.trim()) {
      setErrorCrearAudiencia('El título es obligatorio')
      return
    }

    if (!nuevaAudiencia.fecha) {
      setErrorCrearAudiencia('La fecha es obligatoria')
      return
    }

    if (!nuevaAudiencia.hora) {
      setErrorCrearAudiencia('La hora es obligatoria')
      return
    }

    // Limpiar error previo
    setErrorCrearAudiencia('')

    const audienciaRequest: AudienciaRequest = {
      titulo: nuevaAudiencia.titulo.trim(),
      fecha_hora: new Date(`${nuevaAudiencia.fecha}T${nuevaAudiencia.hora}`).toISOString(),
      lugar: nuevaAudiencia.lugar?.trim() || null,
      descripcion: nuevaAudiencia.descripcion?.trim() || null
    }

    crearAudienciaMutation.mutate(
      { expedienteId: expedienteId, audienciaData: audienciaRequest },
      {
        onSuccess: () => {
          resetFormularioAudiencia()
          setModalCrearAudienciaAbierto(false)
        },
        onError: (error: any) => {
          const errorMessage = error.response?.data?.error || error.message || 'Error al crear la audiencia'
          setErrorCrearAudiencia(errorMessage)
        }
      }
    )
  }

  // Eliminar
  const eliminarCaso = (casoId: number) => {
    const caso = casos?.find(e => e.id === casoId)
    setAccionConfirmacion({
      tipo: 'caso',
      titulo: 'Eliminar Caso',
      mensaje: `¿Estás seguro de que deseas eliminar el caso con numero de expediente "${caso?.numero_expediente}"? Esta acción eliminará también todas las audiencias y transcripciones asociadas y no se puede deshacer.`,
      onConfirmar: () => {
        setErrorEliminarCaso('')
        eliminarCasoMutation.mutate(casoId, {
          onSuccess: () => {
            setModalConfirmacionAbierto(false)
            setAccionConfirmacion(null)
            setErrorEliminarCaso('')
          },
          onError: (error: any) => {
            const errorMessage = error.response?.data?.error || error.message || 'Error al eliminar el caso'
            setErrorEliminarCaso(errorMessage)
          }
        })
      }
    })
    setErrorEliminarCaso('')
    setModalConfirmacionAbierto(true)
  }

  const eliminarAudiencia = (audienciaId: number) => {
    const audiencia = casos?.flatMap(caso => caso.audiencias).find(a => a.id === audienciaId)
    setAccionConfirmacion({
      tipo: 'audiencia',
      titulo: 'Eliminar Audiencia',
      mensaje: `¿Estás seguro de que deseas eliminar la audiencia titulada "${audiencia?.titulo}"? Esta acción eliminará también todas las transcripciones asociadas y no se puede deshacer.`,
      onConfirmar: () => {
        setErrorEliminarAudiencia('')
        eliminarAudienciaMutation.mutate(audienciaId, {
          onSuccess: () => {
            setModalConfirmacionAbierto(false)
            setAccionConfirmacion(null)
            setErrorEliminarAudiencia('')
          },
          onError: (error: any) => {
            const errorMessage = error.response?.data?.error || error.message || 'Error al eliminar la audiencia'
            setErrorEliminarAudiencia(errorMessage)
          }
        })
      }
    })
    setErrorEliminarAudiencia('')
    setModalConfirmacionAbierto(true)
  }

  // Funciones para resetear formularios
  const resetFormularioCaso = () => {
    setNuevoCaso(INITIAL_CASO_FORM)
    setErrorCrearCaso('')
  }

  const resetFormularioAudiencia = () => {
    setNuevaAudiencia(INITIAL_AUDIENCIA_FORM)
    setErrorCrearAudiencia('')
  }

  // Manejadores para abrir/cerrar modales con reset
  const handleOpenModalCaso = () => {
    resetFormularioCaso()
    setModalCrearCasoAbierto(true)
  }

  const handleCloseModalCaso = (open: boolean) => {
    if (!open) {
      resetFormularioCaso()
    }
    setModalCrearCasoAbierto(open)
  }

  const handleOpenModalAudiencia = () => {
    resetFormularioAudiencia()
    setModalCrearAudienciaAbierto(true)
  }

  const handleCloseModalAudiencia = (open: boolean) => {
    if (!open) {
      resetFormularioAudiencia()
    }
    setModalCrearAudienciaAbierto(open)
  }

  // Utiles
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

  const filteredCasos = casos?.filter((caso) => {
    const matchesSearch =
      caso.numero_expediente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caso.cliente.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEstudio = selectedEstudio === 'all' || caso.estudio_id === Number(selectedEstudio)
    return matchesSearch && matchesEstudio
  })

  if (cargandoCasos)
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


  if (casos === undefined)
    return <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="text-red-500">Error al cargar los casos. Intente nuevamente más tarde.</span>
      </div>
    </div>

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header operacion */}
      <div className="flex justify-between items-center mb-6">
        {/* Descripcion operacion */}
        <div>
          <p className="text-gray-600 mt-1">Gestiona tus casos, audiencias y transcripciones</p>
        </div>

        {/* Modal para crear caso */}
        <Dialog open={modalCrearCasoAbierto} onOpenChange={handleCloseModalCaso}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2" onClick={handleOpenModalCaso}>
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
                <Label htmlFor="numero_expediente" className="text-sm font-medium my-2">
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
                <Label htmlFor="cliente" className="text-sm font-medium my-2">
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
                <Label htmlFor="estudio" className="text-sm font-medium my-2">
                  Estudio *
                </Label>
                <Select
                  value={nuevoCaso.estudioId}
                  onValueChange={(value) => setNuevoCaso({ ...nuevoCaso, estudioId: value })}
                >
                  <SelectTrigger className="w-full mt-1" disabled={cargandoEstudiosDisponiblesCreacion || estudiosDisponiblesCreacion === undefined || estudiosDisponiblesCreacion.length === 0}>
                    <SelectValue placeholder={cargandoEstudiosDisponiblesCreacion ? "Cargando estudios..." : estudiosDisponiblesCreacion === undefined ? "Error al cargar estudios" : estudiosDisponiblesCreacion.length === 0 ? "No se encontraron estudios" : "Seleccione un estudio"} />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      estudiosDisponiblesCreacion?.map((estudio) => (
                        <SelectItem key={estudio.id} value={estudio.id.toString()}>
                          {estudio.nombre}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="fecha_inicio" className="text-sm font-medium my-2">
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
                <Label htmlFor="descripcion" className="text-sm font-medium my-2">
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
              {errorCrearCaso && (
                <p className="text-sm text-red-600 mt-1">{errorCrearCaso}</p>
              )}
            </div>
            <DialogFooter className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => handleCloseModalCaso(false)} className="flex-1">
                Cancelar
              </Button>
              <Button
                onClick={crearCaso}
                disabled={crearCasoMutation.isPending}
                className="flex-1"
              >
                {crearCasoMutation.isPending ? (
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
              <SelectTrigger className="w-full" disabled={cargandoEstudiosDisponiblesFiltrado || estudiosDisponiblesFiltrado === undefined || estudiosDisponiblesFiltrado.length === 0}>
                <SelectValue placeholder="Todos los estudios" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estudios</SelectItem>
                {
                  estudiosDisponiblesFiltrado?.map((estudio) => (
                    <SelectItem key={estudio.id} value={estudio.id.toString()}>
                      {estudio.nombre}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Listado */}
      <div className="space-y-4">
        {
          filteredCasos?.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <FileText className="h-16 w-16 mx-auto mb-6 opacity-50" />
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-700">No se encontraron casos</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {searchTerm || selectedEstudio !== 'all'
                    ? 'Intenta ajustar los filtros de búsqueda'
                    : 'Crea tu primer caso para comenzar'}
                </p>
              </div>
            </div>
          ) :
            filteredCasos?.map((caso) => (
              <Card key={caso.id} className="overflow-hidden">
                {/* Card Header */}
                <CardHeader className="pb-3">
                  <div className="flex flex-col space-y-3 md:space-y-0">
                    {/* Titulo primera fila */}
                    <div className="flex items-start justify-between gap-3">
                      {/* Toogle - Titulo - Estado */}
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <Button variant="ghost" size="sm" onClick={() => toggleCaso(caso.id)} className="p-1">
                          {casosExpandidos.has(caso.id) ? (
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

                      {/* Cantidad - Botones */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant="outline" className="text-xs">
                          {`${caso.audiencias.length} audiencia${caso.audiencias.length !== 1 ? 's' : ''}`}
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={() => eliminarCaso(caso.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>

                    {/* Titulo segunda fila  */}
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

                </CardHeader>

                {/* Card Content */}
                {casosExpandidos.has(caso.id) && (
                  <CardContent className="pt-0">
                    {caso.descripcion && <p className="text-gray-600 text-sm ml-10 md:ml-12">{caso.descripcion}</p>}
                    <Separator className="mb-4" />

                    {/* Content primera fila */}
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-gray-900">Audiencias</h4>
                      {/* Modal para crear audiencia */}
                      <Dialog open={modalCrearAudienciaAbierto} onOpenChange={handleCloseModalAudiencia}>
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
                              <Label htmlFor="titulo" className="text-sm font-medium my-2">
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
                                <Label htmlFor="fecha" className="text-sm font-medium my-2">
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
                                <Label htmlFor="hora" className="text-sm font-medium my-2">
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
                              <Label htmlFor="lugar" className="text-sm font-medium my-2">
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
                              <Label htmlFor="descripcionAud" className="text-sm font-medium my-2">
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
                            {errorCrearAudiencia && (
                              <p className="text-sm text-red-600 mt-1">{errorCrearAudiencia}</p>
                            )}
                          </div>
                          <DialogFooter className="flex gap-2 pt-4">
                            <Button variant="outline" onClick={() => handleCloseModalAudiencia(false)} className="flex-1">
                              Cancelar
                            </Button>
                            <Button
                              onClick={() => crearAudiencia(caso.id)}
                              className="flex-1"
                              disabled={crearAudienciaMutation.isPending}
                            >
                              {crearAudienciaMutation.isPending ? (
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

                    {/* Content segunda fila */}
                    {caso.audiencias.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No hay audiencias registradas</p>
                        <p className="text-sm">Crea la primera audiencia para este caso</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {caso.audiencias.map((audiencia) => (
                          <Card key={audiencia.id} className="border-l-4 border-l-blue-500 bg-gray-50">
                            {/* Card Header */}
                            <CardHeader className="pb-2">
                              {/* Titulo primera fila */}
                              <div className="flex items-start justify-between gap-3">
                                {/* Toogle - Titulo */}
                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleAudiencia(audiencia.id)}
                                    className="p-1 flex-shrink-0"
                                  >
                                    {audienciasExpandidas.has(audiencia.id) ? (
                                      <ChevronDown className="h-3 w-3" />
                                    ) : (
                                      <ChevronRight className="h-3 w-3" />
                                    )}
                                  </Button>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                      <h3 className="text-lg truncate">{audiencia.titulo}</h3>
                                    </div>
                                  </div>
                                </div>

                                {/* Cantidad - Botones */}
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">
                                    {audiencia.transcripciones.length} transcripcion{audiencia.transcripciones.length !== 1 ? 'es' : ''}
                                  </Badge>
                                  <Button variant="ghost" size="sm" onClick={() => eliminarAudiencia(audiencia.id)}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </div>

                              {/* Titulo segunda fila  */}
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 ml-10 md:ml-12 text-sm text-gray-600">
                                <div className="flex items-center gap-1 truncate">
                                  <Clock className="h-4 w-4 flex-shrink-0" />
                                  <span className="truncate">{audiencia.fecha_hora}</span>
                                </div>
                                <div className="flex items-center gap-1 truncate">
                                  <Building className="h-4 w-4 flex-shrink-0" />
                                  <span className="truncate">{audiencia.lugar ?? "-"}</span>
                                </div>
                              </div>

                            </CardHeader>

                            {/* Card Content */}
                            {audienciasExpandidas.has(audiencia.id) && (
                              <CardContent className="pt-0">
                                {/* Descripcion */}
                                {audiencia.descripcion && <p className="text-gray-600 text-sm mt-3 ml-10 md:ml-12">{audiencia.descripcion}</p>}

                                {/* Listado */}
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-700">Transcripciones</span>
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
                                              {transcripcion.tipo === 'en_vivo'
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
                              </CardContent>
                            )}
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
      </div>

      { }

      {/* Modal de confirmación para eliminar */}
      <Dialog open={modalConfirmacionAbierto} onOpenChange={setModalConfirmacionAbierto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              {accionConfirmacion?.titulo}
            </DialogTitle>
            <DialogDescription className="text-gray-700 leading-relaxed">
              {accionConfirmacion?.mensaje}
            </DialogDescription>
          </DialogHeader>
          {/* Mostrar errores de eliminación */}
          {(() => {
            const errorMessage = accionConfirmacion?.tipo === 'caso' ? errorEliminarCaso :
              accionConfirmacion?.tipo === 'audiencia' ? errorEliminarAudiencia :
                '';

            return errorMessage ? (
              <div className="px-6 py-2">
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                  {errorMessage}
                </p>
              </div>
            ) : null;
          })()}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setModalConfirmacionAbierto(false)
                setAccionConfirmacion(null)
                setErrorEliminarCaso('')
                setErrorEliminarAudiencia('')
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => accionConfirmacion?.onConfirmar()}
              disabled={(() => {
                switch (accionConfirmacion?.tipo) {
                  case 'caso': return eliminarCasoMutation.isPending;
                  case 'audiencia': return eliminarAudienciaMutation.isPending;
                  default: return false;
                }
              })()}
            >
              {(() => {
                const isPending = (() => {
                  switch (accionConfirmacion?.tipo) {
                    case 'caso': return eliminarCasoMutation.isPending;
                    case 'audiencia': return eliminarAudienciaMutation.isPending;
                    default: return false;
                  }
                })();

                return isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Eliminando...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </>
                )
              })()}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
