/* ----------------------------------- UI ----------------------------------- */
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Building2, Users, Plus, Mail, Trash2, UserPlus, ChevronDown, ChevronRight, Loader2, Phone, Building, User } from 'lucide-react'
/* ---------------------------------- HOOKS --------------------------------- */
import { useState } from 'react'
import {
  useEstudios,
  useCrearEstudio,
  useCrearEquipo,
  useEliminarEstudio,
  useEliminarEquipo,
  useInvitarMiembro,
  useEliminarMiembro
} from '@/hooks/useEstudios'
import { useAuthUser } from '@/hooks/useAuth'
/* --------------------------------- MODELS --------------------------------- */
import type { EstudioRequest, EquipoRequest, Estudio, Equipo, UsuarioEquipo } from 'server/models/estudioModels'


// Interfaces adaptadas para el frontend

const EstudiosPage = () => {
  // Auth hook para obtener usuario actual
  const { user } = useAuthUser()

  // Valores iniciales para formularios
  const INITIAL_ESTUDIO_FORM = { nombre: '', direccion: '', telefono: '' }

  const INITIAL_EQUIPO_FORM = { nombre: '', descripcion: '', estudioId: 0 }

  const INITIAL_INVITACION_FORM = { correo: '' }

  // React Query hooks
  const { data: estudios, isFetching: cargandoEstudios } = useEstudios()

  const crearEstudioMutation = useCrearEstudio()
  const crearEquipoMutation = useCrearEquipo()
  const invitarMiembroMutation = useInvitarMiembro()

  const eliminarEstudioMutation = useEliminarEstudio()
  const eliminarEquipoMutation = useEliminarEquipo()
  const eliminarMiembroMutation = useEliminarMiembro()

  // Estados locales para UI
  const [estudiosExpandidos, setEstudiosExpandidos] = useState<Set<number>>(new Set([]))
  const [equiposExpandidos, setEquiposExpandidos] = useState<Set<number>>(new Set([]))

  // Estados para modales
  const [modalCrearEstudioAbierto, setModalCrearEstudioAbierto] = useState(false)
  const [modalCrearEquipoAbierto, setModalCrearEquipoAbierto] = useState(false)
  const [modalInvitarAbierto, setModalInvitarAbierto] = useState(false)

  const [modalConfirmacionAbierto, setModalConfirmacionAbierto] = useState(false)

  // Estados para confirmación
  const [accionConfirmacion, setAccionConfirmacion] = useState<{
    tipo: 'estudio' | 'equipo' | 'miembro';
    titulo: string;
    mensaje: string;
    onConfirmar: () => void;
  } | null>(null)

  // Estados para formularios
  const [nuevoEstudio, setNuevoEstudio] = useState(INITIAL_ESTUDIO_FORM)
  const [nuevoEquipo, setNuevoEquipo] = useState(INITIAL_EQUIPO_FORM)
  const [invitacion, setInvitacion] = useState(INITIAL_INVITACION_FORM)

  // Estados para errores de formulario
  const [errorCrearEstudio, setErrorCrearEstudio] = useState<string>('')
  const [errorCrearEquipo, setErrorCrearEquipo] = useState<string>('')
  const [errorInvitacion, setErrorInvitacion] = useState<string>('')

  const [errorEliminarEstudio, setErrorEliminarEstudio] = useState<string>('')
  const [errorEliminarEquipo, setErrorEliminarEquipo] = useState<string>('')
  const [errorEliminarMiembro, setErrorEliminarMiembro] = useState<string>('')

  // Toggles para expandir/collapse
  const toggleEstudio = (estudioId: number) => {
    const nuevosExpandidos = new Set(estudiosExpandidos)
    if (nuevosExpandidos.has(estudioId)) {
      nuevosExpandidos.delete(estudioId)
    } else {
      nuevosExpandidos.add(estudioId)
    }
    setEstudiosExpandidos(nuevosExpandidos)
  }

  const toggleEquipo = (equipoId: number) => {
    const nuevosExpandidos = new Set(equiposExpandidos)
    if (nuevosExpandidos.has(equipoId)) {
      nuevosExpandidos.delete(equipoId)
    } else {
      nuevosExpandidos.add(equipoId)
    }
    setEquiposExpandidos(nuevosExpandidos)
  }

  // Crear
  const crearEstudio = () => {
    if (!nuevoEstudio.nombre.trim()) {
      setErrorCrearEstudio('El nombre del estudio es obligatorio')
      return
    }

    // Limpiar error previo
    setErrorCrearEstudio('')

    const estudioRequest: EstudioRequest = {
      nombre: nuevoEstudio.nombre,
      direccion: nuevoEstudio.direccion || undefined,
      telefono: nuevoEstudio.telefono || undefined
    }

    crearEstudioMutation.mutate(estudioRequest, {
      onSuccess: () => {
        resetFormularioEstudio()
        setModalCrearEstudioAbierto(false)
      },
      onError: (error: any) => {
        const errorMessage = error.response?.data?.error || error.message || 'Error al crear el estudio'
        setErrorCrearEstudio(errorMessage)
      }
    })
  }


  const crearEquipo = (estudioId: number) => {
    if (!estudioId) {
      setErrorCrearEquipo('No se ha seleccionado un estudio válido')
      return
    }

    if (!nuevoEquipo.nombre.trim()) {
      setErrorCrearEquipo('El nombre del equipo es obligatorio')
      return
    }

    // Limpiar error previo
    setErrorCrearEquipo('')

    const equipoRequest: EquipoRequest = {
      nombre: nuevoEquipo.nombre,
      descripcion: nuevoEquipo.descripcion || undefined
    }

    crearEquipoMutation.mutate({
      estudioId: estudioId,
      equipo: equipoRequest
    }, {
      onSuccess: () => {
        resetFormularioEquipo()
        setModalCrearEquipoAbierto(false)
      },
      onError: (error: any) => {
        const errorMessage = error.response?.data?.error || error.message || 'Error al crear el equipo'
        setErrorCrearEquipo(errorMessage)
      }
    })
  }

  const enviarInvitacion = (equipoId: number) => {
    if (!invitacion.correo.trim()) {
      setErrorInvitacion('El correo es obligatorio')
      return
    }

    if (!equipoId) {
      setErrorInvitacion('No se ha seleccionado un equipo válido')
      return
    }

    // Limpiar error previo
    setErrorInvitacion('')

    invitarMiembroMutation.mutate({
      equipoId: equipoId,
      correo: invitacion.correo
    }, {
      onSuccess: () => {
        resetFormularioInvitacion()
        setModalInvitarAbierto(false)
      },
      onError: (error: any) => {
        const errorMessage = error.response?.data?.error || error.message || 'Error al enviar la invitación'
        setErrorInvitacion(errorMessage)
      }
    })
  }

  // Eliminar
  const eliminarEstudio = (estudioId: number) => {
    const estudio = estudios?.find(e => e.id === estudioId)
    setAccionConfirmacion({
      tipo: 'estudio',
      titulo: 'Eliminar Estudio',
      mensaje: `¿Estás seguro de que deseas eliminar el estudio "${estudio?.nombre}"? Esta acción eliminará también todos los equipos y miembros asociados y no se puede deshacer.`,
      onConfirmar: () => {
        setErrorEliminarEstudio('')
        eliminarEstudioMutation.mutate(estudioId, {
          onSuccess: () => {
            setModalConfirmacionAbierto(false)
            setAccionConfirmacion(null)
            setErrorEliminarEstudio('')
          },
          onError: (error: any) => {
            const errorMessage = error.response?.data?.error || error.message || 'Error al eliminar el estudio'
            setErrorEliminarEstudio(errorMessage)
          }
        })
      }
    })
    setErrorEliminarEstudio('')
    setModalConfirmacionAbierto(true)
  }

  const eliminarEquipo = (estudioId: number, equipoId: number) => {
    const estudio = estudios?.find(e => e.id === estudioId)
    const equipo = estudio?.equipos.find(eq => eq.id === equipoId)
    setAccionConfirmacion({
      tipo: 'equipo',
      titulo: 'Eliminar Equipo',
      mensaje: `¿Estás seguro de que deseas eliminar el equipo "${equipo?.nombre}"? Esta acción eliminará también todos los miembros del equipo y no se puede deshacer.`,
      onConfirmar: () => {
        setErrorEliminarEquipo('')
        eliminarEquipoMutation.mutate({ estudioId, equipoId }, {
          onSuccess: () => {
            setModalConfirmacionAbierto(false)
            setAccionConfirmacion(null)
            setErrorEliminarEquipo('')
          },
          onError: (error: any) => {
            const errorMessage = error.response?.data?.error || error.message || 'Error al eliminar el equipo'
            setErrorEliminarEquipo(errorMessage)
          }
        })
      }
    })
    setErrorEliminarEquipo('')
    setModalConfirmacionAbierto(true)
  }

  const eliminarMiembro = (estudioId: number, equipoId: number, usuarioId: number, nombreCompleto: string) => {
    const estudio = estudios?.find(e => e.id === estudioId)
    const equipo = estudio?.equipos.find(eq => eq.id === equipoId)

    setAccionConfirmacion({
      tipo: 'miembro',
      titulo: 'Eliminar Miembro',
      mensaje: `¿Estás seguro de que deseas eliminar a "${nombreCompleto}" del equipo "${equipo?.nombre}"? Esta acción no se puede deshacer.`,
      onConfirmar: () => {
        setErrorEliminarMiembro('')
        eliminarMiembroMutation.mutate({ equipoId, usuarioId }, {
          onSuccess: () => {
            setModalConfirmacionAbierto(false)
            setAccionConfirmacion(null)
            setErrorEliminarMiembro('')
          },
          onError: (error: any) => {
            const errorMessage = error.response?.data?.error || error.message || 'Error al eliminar miembro'
            setErrorEliminarMiembro(errorMessage)
          }
        })
      }
    })
    setErrorEliminarMiembro('')
    setModalConfirmacionAbierto(true)
  }

  // Funciones para resetear formularios
  const resetFormularioEstudio = () => {
    setNuevoEstudio(INITIAL_ESTUDIO_FORM)
    setErrorCrearEstudio('')
  }

  const resetFormularioEquipo = () => {
    setNuevoEquipo(INITIAL_EQUIPO_FORM)
    setErrorCrearEquipo('')
  }

  const resetFormularioInvitacion = () => {
    setInvitacion(INITIAL_INVITACION_FORM)
    setErrorInvitacion('')
  }

  // Manejadores para abrir/cerrar modales con reset
  const handleOpenModalEstudio = () => {
    resetFormularioEstudio()
    setModalCrearEstudioAbierto(true)
  }

  const handleCloseModalEstudio = (open: boolean) => {
    if (!open) {
      resetFormularioEstudio()
    }
    setModalCrearEstudioAbierto(open)
  }

  const handleOpenModalEquipo = () => {
    resetFormularioEquipo()
    setModalCrearEquipoAbierto(true)
  }

  const handleCloseModalEquipo = (open: boolean) => {
    if (!open) {
      resetFormularioEquipo()
    }
    setModalCrearEquipoAbierto(open)
  }

  const handleOpenModalInvitacion = () => {
    resetFormularioInvitacion()
    setModalInvitarAbierto(true)
  }

  const handleCloseModalInvitacion = (open: boolean) => {
    if (!open) {
      resetFormularioInvitacion()
    }
    setModalInvitarAbierto(open)
  }

  // Utiles
  const getEquiposFiltrados = (estudio: Estudio) => {
    return estudio.equipos.filter((equipo: Equipo) => {
      if (estudio.rol === 'propietario') return true
      return equipo.usuarios.some((usuario: UsuarioEquipo) => usuario.id === user?.id)
    })
  }

  const getInitials = (nombre: string, apellido: string) => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
  }

  if (cargandoEstudios)
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Cargando estudios...</span>
          </div>
        </div>
      </div>
    )


  if (estudios === undefined)
    return <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="text-red-500">Error al cargar los estudios. Intente nuevamente más tarde.</span>
      </div>
    </div>


  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header operacion */}
      <div className="flex justify-between items-center mb-6">
        {/* Descripcion operacion */}
        <div>
          <p className="text-gray-600 mt-1">Gestiona tus estudios jurídicos, equipos y colaboradores</p>
        </div>

        {/* Modal para crear estudio */}
        <Dialog open={modalCrearEstudioAbierto} onOpenChange={handleCloseModalEstudio}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2" onClick={handleOpenModalEstudio}>
              <Plus className="h-4 w-4" />
              Nuevo Estudio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nuevo Estudio</DialogTitle>
              <DialogDescription>
                Crea un nuevo estudio jurídico para gestionar casos y colaboradores.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nombre-estudio" className="text-sm font-medium my-2">
                  Nombre del Estudio *
                </Label>
                <Input
                  id="nombre-estudio"
                  value={nuevoEstudio.nombre}
                  onChange={(e) => setNuevoEstudio({ ...nuevoEstudio, nombre: e.target.value })}
                  placeholder="Ej: Estudio Jurídico González & Asociados"
                />
              </div>
              <div>
                <Label htmlFor="direccion-estudio" className="text-sm font-medium my-2">
                  Dirección
                </Label>
                <Input
                  id="direccion-estudio"
                  value={nuevoEstudio.direccion}
                  onChange={(e) => setNuevoEstudio({ ...nuevoEstudio, direccion: e.target.value })}
                  placeholder="Ej: Av. Corrientes 1234, CABA"
                />
              </div>
              <div>
                <Label htmlFor="telefono-estudio" className="text-sm font-medium my-2">
                  Teléfono
                </Label>
                <Input
                  id="telefono-estudio"
                  value={nuevoEstudio.telefono}
                  onChange={(e) => setNuevoEstudio({ ...nuevoEstudio, telefono: e.target.value })}
                  placeholder="Ej: +54 11 4567-8900"
                />
              </div>
              {errorCrearEstudio && (
                <p className="text-sm text-red-600 mt-1">{errorCrearEstudio}</p>
              )}
            </div>
            <DialogFooter className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => handleCloseModalEstudio(false)} className="flex-1">
                Cancelar
              </Button>
              <Button
                onClick={crearEstudio}
                disabled={crearEstudioMutation.isPending}
                className="flex-1"
              >
                {crearEstudioMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creando...
                  </>
                ) : (
                  'Crear Estudio'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Listado */}
      <div className="space-y-4">
        {estudios.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Building2 className="h-16 w-16 mx-auto mb-6 opacity-50" />
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-700">No tienes estudios jurídicos</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Aún no perteneces a ningún estudio jurídico o no has creado ninguno todavía.
                Crea tu primer estudio para comenzar a gestionar casos y equipos o espera a que te inviten a uno.
              </p>
            </div>
          </div>
        ) : (
          estudios.map((estudio) => (
            <Card key={estudio.id} className="overflow-hidden">
              {/* Card Header */}
              <CardHeader className="pb-3">
                <div className="flex flex-col space-y-3 md:space-y-0">
                  {/* Titulo primera fila */}
                  <div className="flex items-start justify-between gap-3">
                    {/* Toogle - Titulo - Estado */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <Button variant="ghost" size="sm" onClick={() => toggleEstudio(estudio.id)} className="p-1">
                        {estudiosExpandidos.has(estudio.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <h3 className="font-semibold text-lg truncate">{estudio.nombre}</h3>
                          <Badge
                            variant={estudio.rol === 'propietario' ? 'default' : 'secondary'}
                          >
                            {estudio.rol === 'propietario' ? 'Propietario' : 'Miembro'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Cantidad - Botones */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant="outline" className="text-xs">
                        {(() => {
                          const equiposFiltrados = getEquiposFiltrados(estudio)
                          return `${equiposFiltrados.length} equipo${equiposFiltrados.length !== 1 ? 's' : ''}`
                        })()}
                      </Badge>
                      {/* Solo mostrar botón eliminar si es propietario */}
                      {estudio.rol === 'propietario' && (
                        <Button variant="ghost" size="sm" onClick={() => eliminarEstudio(estudio.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Titulo segunda fila  */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 ml-10 md:ml-12 text-sm text-gray-600">
                    <div className="flex items-center gap-1 truncate">
                      <User className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{estudio.propietario.nombres} {estudio.propietario.apellidos}</span>
                    </div>
                    <div className="flex items-center gap-1 truncate">
                      <Building className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{estudio.direccion ?? "-"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4 flex-shrink-0" />
                      <span>{estudio.telefono ?? "-"}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              {/* Card Content */}
              {estudiosExpandidos.has(estudio.id) && (
                <CardContent className="pt-0">
                  <Separator className="mb-4" />

                  {/* Content primera fila */}
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900">Equipos</h4>
                    {/* Modal para crear equipo */}
                    <Dialog open={modalCrearEquipoAbierto} onOpenChange={handleCloseModalEquipo}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={handleOpenModalEquipo} disabled={estudio.rol !== 'propietario'}>
                          <Plus className="h-4 w-4 mr-1" />
                          Nuevo Equipo
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Nuevo Equipo</DialogTitle>
                          <DialogDescription>
                            Agrega un nuevo equipo de trabajo a este estudio jurídico.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="nombre-equipo" className="text-sm font-medium my-2">
                              Nombre del Equipo *
                            </Label>
                            <Input
                              id="nombre-equipo"
                              value={nuevoEquipo.nombre}
                              onChange={(e) => {
                                setNuevoEquipo({ ...nuevoEquipo, nombre: e.target.value })
                                // Limpiar error cuando el usuario empiece a escribir
                                if (errorCrearEquipo) setErrorCrearEquipo('')
                              }}
                              placeholder="Ej: Derecho Civil"
                            />
                          </div>
                          <div>
                            <Label htmlFor="descripcion-equipo" className="text-sm font-medium my-2">
                              Descripción
                            </Label>
                            <Input
                              id="descripcion-equipo"
                              value={nuevoEquipo.descripcion}
                              onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, descripcion: e.target.value })}
                              placeholder="Ej: Equipo especializado en derecho civil y comercial"
                            />
                          </div>
                          {errorCrearEquipo && (
                            <p className="text-sm text-red-600 mt-1">{errorCrearEquipo}</p>
                          )}
                        </div>
                        <DialogFooter className="flex gap-2 pt-4">
                          <Button variant="outline" onClick={() => handleCloseModalEquipo(false)} className="flex-1">
                            Cancelar
                          </Button>
                          <Button
                            onClick={() => crearEquipo(estudio.id)}
                            className="flex-1"
                            disabled={crearEquipoMutation.isPending}
                          >
                            {crearEquipoMutation.isPending ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Creando...
                              </>
                            ) : (
                              'Crear Equipo'
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Content segunda fila */}
                  {(() => {
                    const equiposFiltrados = getEquiposFiltrados(estudio)

                    return equiposFiltrados.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>{estudio.rol === 'propietario' ? 'No hay equipos creados aún' : 'No perteneces a ningún equipo'}</p>
                        <p className="text-sm">
                          {estudio.rol === 'propietario' ? 'Crea un equipo para comenzar a invitar miembros y gestionar casos en conjunto.' : 'Contacta al propietario para que te agregue a un equipo.'}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {equiposFiltrados.map((equipo: Equipo) => (
                          <Card key={equipo.id} className="border-l-4 border-l-primary bg-gray-50">
                            {/* Card Header */}
                            <CardHeader className="pb-2">
                              {/* Titulo primera fila */}
                              <div className="flex items-start justify-between gap-3">
                                {/* Toogle - Titulo */}
                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                  <Button variant="ghost" size="sm" onClick={() => toggleEquipo(equipo.id)} className="p-1">
                                    {equiposExpandidos.has(equipo.id) ? (
                                      <ChevronDown className="h-4 w-4" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4" />
                                    )}
                                  </Button>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                      <h3 className="text-lg truncate">{equipo.nombre}</h3>
                                    </div>
                                  </div>
                                </div>

                                {/* Cantidad - Botones */}
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">
                                    {equipo.usuarios.length} miembro{equipo.usuarios.length !== 1 ? 's' : ''}
                                  </Badge>
                                  {/* Solo mostrar botón invitar si es propietario */}
                                  {estudio.rol === 'propietario' && (

                                    <Dialog open={modalInvitarAbierto} onOpenChange={setModalInvitarAbierto}>
                                      <DialogTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={handleOpenModalInvitacion}
                                        >
                                          <UserPlus className="h-4 w-4" />
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>Invitar Miembro</DialogTitle>
                                          <DialogDescription>
                                            Envía una invitación por correo electrónico para agregar un nuevo miembro al equipo.
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                          <div>
                                            <Label htmlFor="correo-invitacion" className="text-sm font-medium my-2">
                                              Correo Electrónico *
                                            </Label>
                                            <Input
                                              id="correo-invitacion"
                                              type="email"
                                              value={invitacion.correo}
                                              onChange={(e) => {
                                                setInvitacion({ ...invitacion, correo: e.target.value })
                                                // Limpiar error cuando el usuario empiece a escribir
                                                if (errorInvitacion) setErrorInvitacion('')
                                              }}
                                              placeholder="ejemplo@correo.com"
                                            />
                                          </div>
                                          {errorInvitacion && (
                                            <p className="text-sm text-red-600 mt-1">{errorInvitacion}</p>
                                          )}
                                        </div>
                                        <DialogFooter className="flex gap-2 pt-4">
                                          <Button variant="outline" onClick={() => handleCloseModalInvitacion(false)} className="flex-1">
                                            Cancelar
                                          </Button>
                                          <Button
                                            onClick={() => enviarInvitacion(equipo.id)}
                                            disabled={invitarMiembroMutation.isPending}
                                            className="flex-1"
                                          >
                                            {invitarMiembroMutation.isPending ? (
                                              <>
                                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                Enviando...
                                              </>
                                            ) : (
                                              <>
                                                <Mail className="h-4 w-4 mr-2" />
                                                Enviar Invitación
                                              </>
                                            )}
                                          </Button>
                                        </DialogFooter>
                                      </DialogContent>
                                    </Dialog>
                                  )}
                                  {/* Solo mostrar botón eliminar si es propietario */}
                                  {estudio.rol === 'propietario' && (
                                    <Button variant="ghost" size="sm" onClick={() => eliminarEquipo(estudio.id, equipo.id)}>
                                      <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </CardHeader>

                            {/* Card Content */}
                            {equiposExpandidos.has(equipo.id) && (
                              <CardContent className="pt-0">
                                {/* Descripcion */}
                                {equipo.descripcion && <p className="text-gray-600 text-sm ml-10 md:ml-12">{equipo.descripcion}</p>}

                                {/* Listado */}
                                {equipo.usuarios.length === 0 ? (
                                  <div className="text-center py-4 text-gray-500 ">
                                    <p className="text-sm">No hay miembros en este equipo</p>
                                    {/* Modal para invitar usuario */}
                                    {/* Solo mostrar botón invitar si es propietario */}
                                    {estudio.rol === 'propietario' &&
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-2 bg-transparent"
                                        onClick={handleOpenModalInvitacion}
                                      >
                                        <Mail className="h-4 w-4 mr-2" />
                                        Invitar Miembro
                                      </Button>
                                    }
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {equipo.usuarios.map((usuario: UsuarioEquipo) => (
                                      <div key={usuario.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Avatar className="h-10 w-10">
                                          <AvatarImage src={'/placeholder.svg'} />
                                          <AvatarFallback className="bg-gray-100 text-primary-700">
                                            {getInitials(usuario.nombre, usuario.apellido)}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                          <p className="font-medium text-sm truncate">
                                            {usuario.nombre} {usuario.apellido}
                                          </p>
                                          <p className="text-xs text-gray-500 truncate">{usuario.correo}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Badge
                                            variant={usuario.rol === 'propietario' ? 'default' : 'secondary'}
                                            className="text-xs"
                                          >
                                            {usuario.rol === 'propietario' ? 'Propietario' : 'Miembro'}
                                          </Badge>
                                          {/* Solo mostrar botón eliminar si el usuario actual es propietario y el miembro no es el propietario */}
                                          {estudio.rol === 'propietario' && usuario.rol !== 'propietario' && (
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => eliminarMiembro(estudio.id, equipo.id, usuario.id, `${usuario.nombre} ${usuario.apellido}`)}
                                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </CardContent>
                            )}
                          </Card>
                        ))}
                      </div>
                    )
                  })()}
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>

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
            const errorMessage = accionConfirmacion?.tipo === 'estudio' ? errorEliminarEstudio :
              accionConfirmacion?.tipo === 'equipo' ? errorEliminarEquipo :
                accionConfirmacion?.tipo === 'miembro' ? errorEliminarMiembro : '';

            return errorMessage ? (
              <div className="px-6 py-2">
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                  {errorMessage}
                </p>
              </div>
            ) : null;
          })()}
          <DialogFooter className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setModalConfirmacionAbierto(false)
                setAccionConfirmacion(null)
                setErrorEliminarEstudio('')
                setErrorEliminarEquipo('')
                setErrorEliminarMiembro('')
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => accionConfirmacion?.onConfirmar()}
              disabled={(() => {
                switch (accionConfirmacion?.tipo) {
                  case 'estudio': return eliminarEstudioMutation.isPending;
                  case 'equipo': return eliminarEquipoMutation.isPending;
                  case 'miembro': return eliminarMiembroMutation.isPending;
                  default: return false;
                }
              })()}
            >
              {(() => {
                const isPending = (() => {
                  switch (accionConfirmacion?.tipo) {
                    case 'estudio': return eliminarEstudioMutation.isPending;
                    case 'equipo': return eliminarEquipoMutation.isPending;
                    case 'miembro': return eliminarMiembroMutation.isPending;
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

export default EstudiosPage
