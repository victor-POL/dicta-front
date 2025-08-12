'use client'

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
import { Building2, Users, Plus, Mail, Trash2, UserPlus, ChevronDown, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { ESTUDIOS_DATA } from '@/data/estudios.data'

export interface Usuario {
  id: string
  nombre: string
  apellido: string
  correo: string
  urlFotoPerfil?: string
  rol: 'admin' | 'miembro'
}

export interface Equipo {
  id: string
  nombre: string
  descripcion: string
  usuarios: Usuario[]
  fechaCreacion: Date
}

export interface Estudio {
  id: string
  nombre: string
  direccion: string
  telefono: string
  equipos: Equipo[]
  fechaCreacion: Date
}

const EstudiosPage = () => {
  const [estudios, setEstudios] = useState<Estudio[]>(ESTUDIOS_DATA)

  const [estudiosExpandidos, setEstudiosExpandidos] = useState<Set<string>>(new Set(['1']))
  const [equiposExpandidos, setEquiposExpandidos] = useState<Set<string>>(new Set(['1']))

  // Estados para modales
  const [modalEstudioAbierto, setModalEstudioAbierto] = useState(false)
  const [modalEquipoAbierto, setModalEquipoAbierto] = useState(false)
  const [modalInvitarAbierto, setModalInvitarAbierto] = useState(false)

  // Estados para formularios
  const [nuevoEstudio, setNuevoEstudio] = useState({ nombre: '', direccion: '', telefono: '' })
  const [nuevoEquipo, setNuevoEquipo] = useState({ nombre: '', descripcion: '', estudioId: '' })
  const [invitacion, setInvitacion] = useState({ correo: '', equipoId: '', estudioId: '' })

  const toggleEstudio = (estudioId: string) => {
    const nuevosExpandidos = new Set(estudiosExpandidos)
    if (nuevosExpandidos.has(estudioId)) {
      nuevosExpandidos.delete(estudioId)
    } else {
      nuevosExpandidos.add(estudioId)
    }
    setEstudiosExpandidos(nuevosExpandidos)
  }

  const toggleEquipo = (equipoId: string) => {
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
      toast.error('El nombre del estudio es obligatorio')
      return
    }

    const estudio: Estudio = {
      id: Date.now().toString(),
      nombre: nuevoEstudio.nombre,
      direccion: nuevoEstudio.direccion,
      telefono: nuevoEstudio.telefono,
      equipos: [],
      fechaCreacion: new Date(),
    }

    setEstudios([...estudios, estudio])
    setNuevoEstudio({ nombre: '', direccion: '', telefono: '' })
    setModalEstudioAbierto(false)
    toast.success('Estudio creado exitosamente')
  }

  const crearEquipo = () => {
    if (!nuevoEquipo.nombre.trim() || !nuevoEquipo.estudioId) {
      toast.error('Complete todos los campos obligatorios')
      return
    }

    const equipo: Equipo = {
      id: Date.now().toString(),
      nombre: nuevoEquipo.nombre,
      descripcion: nuevoEquipo.descripcion,
      usuarios: [],
      fechaCreacion: new Date(),
    }

    setEstudios(
      estudios.map((estudio) =>
        estudio.id === nuevoEquipo.estudioId ? { ...estudio, equipos: [...estudio.equipos, equipo] } : estudio
      )
    )

    setNuevoEquipo({ nombre: '', descripcion: '', estudioId: '' })
    setModalEquipoAbierto(false)
    toast.success('Equipo creado exitosamente')
  }

  const enviarInvitacion = () => {
    if (!invitacion.correo.trim() || !invitacion.equipoId || !invitacion.estudioId) {
      toast.error('Complete todos los campos')
      return
    }

    // Aquí iría la lógica para enviar la invitación por email
    toast.success(`Invitación enviada a ${invitacion.correo}`)
    setInvitacion({ correo: '', equipoId: '', estudioId: '' })
    setModalInvitarAbierto(false)
  }

  const eliminarEstudio = (estudioId: string) => {
    setEstudios(estudios.filter((e) => e.id !== estudioId))
    toast.success('Estudio eliminado')
  }

  const eliminarEquipo = (estudioId: string, equipoId: string) => {
    setEstudios(
      estudios.map((estudio) =>
        estudio.id === estudioId ? { ...estudio, equipos: estudio.equipos.filter((e) => e.id !== equipoId) } : estudio
      )
    )
    toast.success('Equipo eliminado')
  }

  const getInitials = (nombre: string, apellido: string) => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
  }

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
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setModalEstudioAbierto(false)}>
                Cancelar
              </Button>
              <Button onClick={crearEstudio}>Crear Estudio</Button>
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
                    <CardTitle className="text-lg">{estudio.nombre}</CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      {estudio.direccion && <span>{estudio.direccion}</span>}
                      {estudio.telefono && <span>{estudio.telefono}</span>}
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
                                      <AvatarImage src={usuario.urlFotoPerfil || '/placeholder.svg'} />
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
                                    <Badge
                                      variant={usuario.rol === 'admin' ? 'default' : 'secondary'}
                                      className="text-xs"
                                    >
                                      {usuario.rol === 'admin' ? 'Admin' : 'Miembro'}
                                    </Badge>
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
                onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, nombre: e.target.value })}
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalEquipoAbierto(false)}>
              Cancelar
            </Button>
            <Button onClick={crearEquipo}>Crear Equipo</Button>
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
                onChange={(e) => setInvitacion({ ...invitacion, correo: e.target.value })}
                placeholder="ejemplo@correo.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalInvitarAbierto(false)}>
              Cancelar
            </Button>
            <Button onClick={enviarInvitacion}>
              <Mail className="h-4 w-4 mr-2" />
              Enviar Invitación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EstudiosPage
