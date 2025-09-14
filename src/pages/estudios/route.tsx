import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Building2, Users, Plus, Mail, Trash2, UserPlus, ChevronDown, ChevronRight, Loader2 } from 'lucide-react'
import type { EstudioRequest, EquipoRequest } from '../../../server/models/estudioModels'
import {
  useEstudios,
  useCrearEstudio,
  useCrearEquipo,
  useEliminarEstudio,
  useEliminarEquipo,
  useInvitarMiembro,
  useEliminarMiembro
} from '@/hooks/useEstudios'


// Interfaces adaptadas para el frontend

const EstudiosPage = () => {
  // React Query hooks
  const { data: estudios, isFetching: cargandoEstudios } = useEstudios()
  const crearEstudioMutation = useCrearEstudio()
  const crearEquipoMutation = useCrearEquipo()
  const eliminarEstudioMutation = useEliminarEstudio()
  const eliminarEquipoMutation = useEliminarEquipo()
  const invitarMiembroMutation = useInvitarMiembro()
  const eliminarMiembroMutation = useEliminarMiembro()

  // Estados locales para UI
  const [estudiosExpandidos, setEstudiosExpandidos] = useState<Set<number>>(new Set([]))
  const [equiposExpandidos, setEquiposExpandidos] = useState<Set<number>>(new Set([]))

  // Estados para modales
  const [modalEstudioAbierto, setModalEstudioAbierto] = useState(false)
  const [modalEquipoAbierto, setModalEquipoAbierto] = useState(false)
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
  const [nuevoEstudio, setNuevoEstudio] = useState({ nombre: '', direccion: '', telefono: '' })
  const [nuevoEquipo, setNuevoEquipo] = useState({ nombre: '', descripcion: '', estudioId: 0 })
  const [invitacion, setInvitacion] = useState({ correo: '', equipoId: 0, estudioId: 0 })

  // Estados para errores de formulario
  const [errorInvitacion, setErrorInvitacion] = useState<string>('')
  const [errorEquipo, setErrorEquipo] = useState<string>('')
  const [errorEstudio, setErrorEstudio] = useState<string>('')
  const [errorEliminarEstudio, setErrorEliminarEstudio] = useState<string>('')
  const [errorEliminarEquipo, setErrorEliminarEquipo] = useState<string>('')
  const [errorEliminarMiembro, setErrorEliminarMiembro] = useState<string>('')

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

  const crearEstudio = () => {
    if (!nuevoEstudio.nombre.trim()) {
      setErrorEstudio('El nombre del estudio es obligatorio')
      return
    }

    const estudioRequest: EstudioRequest = {
      nombre: nuevoEstudio.nombre,
      direccion: nuevoEstudio.direccion || undefined,
      telefono: nuevoEstudio.telefono || undefined
    }

    crearEstudioMutation.mutate(estudioRequest, {
      onSuccess: () => {
        setNuevoEstudio({ nombre: '', direccion: '', telefono: '' })
        setModalEstudioAbierto(false)
      }
    })
  }

  const crearEquipo = () => {
    if (!nuevoEquipo.nombre.trim()) {
      setErrorEquipo('El nombre del equipo es obligatorio')
      return
    }

    if (!nuevoEquipo.estudioId) {
      setErrorEquipo('No se ha seleccionado un estudio válido')
      return
    }

    // Limpiar error previo
    setErrorEquipo('')

    const equipoRequest: EquipoRequest = {
      nombre: nuevoEquipo.nombre,
      descripcion: nuevoEquipo.descripcion || undefined
    }

    crearEquipoMutation.mutate({
      estudioId: nuevoEquipo.estudioId,
      equipo: equipoRequest
    }, {
      onSuccess: () => {
        setNuevoEquipo({ nombre: '', descripcion: '', estudioId: 0 })
        setModalEquipoAbierto(false)
        setErrorEquipo('')
      },
      onError: (error: any) => {
        // Extraer mensaje de error del backend
        const errorMessage = error.response?.data?.error || error.message || 'Error al crear el equipo'
        setErrorEquipo(errorMessage)
      }
    })
  }

  const enviarInvitacion = () => {
    if (!invitacion.correo.trim()) {
      setErrorInvitacion('El correo es obligatorio')
      return
    }

    if (!invitacion.equipoId) {
      setErrorInvitacion('No se ha seleccionado un equipo válido')
      return
    }

    // Limpiar error previo
    setErrorInvitacion('')

    invitarMiembroMutation.mutate({
      equipoId: invitacion.equipoId,
      correo: invitacion.correo
    }, {
      onSuccess: () => {
        setInvitacion({ correo: '', equipoId: 0, estudioId: 0 })
        setModalInvitarAbierto(false)
        setErrorInvitacion('')
      },
      onError: (error: any) => {
        // Extraer mensaje de error del backend
        const errorMessage = error.response?.data?.error || error.message || 'Error al enviar la invitación'
        setErrorInvitacion(errorMessage)
      }
    })
  }

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

  const getInitials = (nombre: string, apellido: string) => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
  }

  if (cargandoEstudios) {
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
  }

  if (estudios === undefined)
    // informar error
    return <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="text-red-500">Error al cargar los estudios. Intente nuevamente más tarde.</span>
      </div>
    </div>


  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-600 mt-1">Gestiona tus estudios jurídicos, equipos y colaboradores</p>
        </div>

        <Dialog open={modalEstudioAbierto} onOpenChange={setModalEstudioAbierto}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Estudio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Estudio</DialogTitle>
              <DialogDescription>Ingresa los datos del nuevo estudio jurídico</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="my-2" htmlFor="nombre-estudio">
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
                <Label className="my-2" htmlFor="direccion-estudio">
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
                <Label className="my-2" htmlFor="telefono-estudio">
                  Teléfono
                </Label>
                <Input
                  id="telefono-estudio"
                  value={nuevoEstudio.telefono}
                  onChange={(e) => setNuevoEstudio({ ...nuevoEstudio, telefono: e.target.value })}
                  placeholder="Ej: +54 11 4567-8900"
                />
              </div>
              {errorEstudio && (
                <p className="text-sm text-red-600 mt-1">{errorEstudio}</p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setModalEstudioAbierto(false)}>
                Cancelar
              </Button>
              <Button
                onClick={crearEstudio}
                disabled={crearEstudioMutation.isPending}
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

      <div className="space-y-4">
        {estudios.map((estudio) => (
          <Card key={estudio.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" onClick={() => toggleEstudio(estudio.id)} className="p-1">
                    {estudiosExpandidos.has(estudio.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{estudio.nombre}</CardTitle>
                      <Badge
                        variant={estudio.rol === 'propietario' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {estudio.rol === 'propietario' ? 'Propietario' : 'Miembro'}
                      </Badge>
                    </div>
                    <CardDescription className="flex flex-col gap-1 mt-1">
                      <div className="flex items-center gap-4">
                        {estudio.direccion && <span>{estudio.direccion}</span>}
                        {estudio.telefono && <span>{estudio.telefono}</span>}
                      </div>
                      {estudio.rol !== 'propietario' && (
                        <div className="text-xs text-gray-500">
                          Propietario: {estudio.propietario.nombres} {estudio.propietario.apellidos}
                        </div>
                      )}
                    </CardDescription>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {estudio.equipos.length} equipo{estudio.equipos.length !== 1 ? 's' : ''}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setNuevoEquipo({ ...nuevoEquipo, estudioId: estudio.id })
                      setErrorEquipo('')
                      setModalEquipoAbierto(true)
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => eliminarEstudio(estudio.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {estudiosExpandidos.has(estudio.id) && (
              <CardContent className="pt-0">
                <Separator className="mb-4" />

                {estudio.equipos.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No hay equipos creados aún</p>
                    <Button
                      variant="outline"
                      className="mt-3 bg-transparent"
                      onClick={() => {
                        setNuevoEquipo({ ...nuevoEquipo, estudioId: estudio.id })
                        setErrorEquipo('')
                        setModalEquipoAbierto(true)
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Primer Equipo
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {estudio.equipos.map((equipo) => (
                      <Card key={equipo.id} className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Button variant="ghost" size="sm" onClick={() => toggleEquipo(equipo.id)} className="p-1">
                                {equiposExpandidos.has(equipo.id) ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </Button>
                              <Users className="h-4 w-4 text-blue-600" />
                              <div>
                                <CardTitle className="text-base">{equipo.nombre}</CardTitle>
                                {equipo.descripcion && (
                                  <CardDescription className="text-sm">{equipo.descripcion}</CardDescription>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                {equipo.usuarios.length} miembro{equipo.usuarios.length !== 1 ? 's' : ''}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setInvitacion({ ...invitacion, equipoId: equipo.id, estudioId: estudio.id })
                                  setErrorInvitacion('')
                                  setModalInvitarAbierto(true)
                                }}
                              >
                                <UserPlus className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => eliminarEquipo(estudio.id, equipo.id)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>

                        {equiposExpandidos.has(equipo.id) && (
                          <CardContent className="pt-0">
                            {equipo.usuarios.length === 0 ? (
                              <div className="text-center py-4 text-gray-500 ">
                                <p className="text-sm">No hay miembros en este equipo</p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mt-2 bg-transparent"
                                  onClick={() => {
                                    setInvitacion({ ...invitacion, equipoId: equipo.id, estudioId: estudio.id })
                                    setErrorInvitacion('')
                                    setModalInvitarAbierto(true)
                                  }}
                                >
                                  <Mail className="h-4 w-4 mr-2" />
                                  Invitar Miembro
                                </Button>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {equipo.usuarios.map((usuario) => (
                                  <div key={usuario.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <Avatar className="h-10 w-10">
                                      <AvatarImage src={'/placeholder.svg'} />
                                      <AvatarFallback className="bg-blue-100 text-blue-700">
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
                )}
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Modal para crear equipo */}
      <Dialog open={modalEquipoAbierto} onOpenChange={setModalEquipoAbierto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Equipo</DialogTitle>
            <DialogDescription>Crea un equipo dentro del estudio seleccionado</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="my-2" htmlFor="nombre-equipo">
                Nombre del Equipo *
              </Label>
              <Input
                id="nombre-equipo"
                value={nuevoEquipo.nombre}
                onChange={(e) => {
                  setNuevoEquipo({ ...nuevoEquipo, nombre: e.target.value })
                  // Limpiar error cuando el usuario empiece a escribir
                  if (errorEquipo) setErrorEquipo('')
                }}
                placeholder="Ej: Derecho Civil"
              />
            </div>
            <div>
              <Label className="my-2" htmlFor="descripcion-equipo">
                Descripción
              </Label>
              <Input
                id="descripcion-equipo"
                value={nuevoEquipo.descripcion}
                onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, descripcion: e.target.value })}
                placeholder="Ej: Equipo especializado en derecho civil y comercial"
              />
            </div>
            {errorEquipo && (
              <p className="text-sm text-red-600 mt-1">{errorEquipo}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setModalEquipoAbierto(false)
              setErrorEquipo('')
            }}>
              Cancelar
            </Button>
            <Button
              onClick={crearEquipo}
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

      {/* Modal para invitar usuario */}
      <Dialog open={modalInvitarAbierto} onOpenChange={setModalInvitarAbierto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invitar Miembro</DialogTitle>
            <DialogDescription>Envía una invitación por correo electrónico para unirse al equipo</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="my-2" htmlFor="correo-invitacion">
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
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setModalInvitarAbierto(false)
              setErrorInvitacion('')
            }}>
              Cancelar
            </Button>
            <Button
              onClick={enviarInvitacion}
              disabled={invitarMiembroMutation.isPending}
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
          <DialogFooter>
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
                switch(accionConfirmacion?.tipo) {
                  case 'estudio': return eliminarEstudioMutation.isPending;
                  case 'equipo': return eliminarEquipoMutation.isPending;
                  case 'miembro': return eliminarMiembroMutation.isPending;
                  default: return false;
                }
              })()}
            >
              {(() => {
                const isPending = (() => {
                  switch(accionConfirmacion?.tipo) {
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
