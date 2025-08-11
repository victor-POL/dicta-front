'use client'

import type React from 'react'
import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Camera, Save, X, Edit, Users, Building2 } from 'lucide-react'
import { useAuthUser } from '@/hooks/useAuth'
import type { User } from '@/models/authModels'

const PerfilPage = () => {
  const { user } = useAuthUser()
  const loggedUser = user as User

  const [isEditing, setIsEditing] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(loggedUser.urlFotoPerfil || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    nombre: loggedUser.nombre,
    apellido: loggedUser.apellido,
    correo: loggedUser.correo,
    fotoPerfil: null as File | null,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isDirty, setIsDirty] = useState(false)
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  const handleSaveProfile = async (updatedUser: User) => {
    setIsSavingProfile(true)

    // Simular llamada a API
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Simular éxito o error
        if (Math.random() > 0.1) {
          console.log('Perfil actualizado:', updatedUser)
          resolve()
        } else {
          reject(new Error('Error simulado'))
        }
      }, 1500)
    }).finally(() => {
      setIsSavingProfile(false)
    })
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setIsDirty(true)

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor selecciona un archivo de imagen válido')
        return
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen debe ser menor a 5MB')
        return
      }

      setFormData((prev) => ({ ...prev, fotoPerfil: file }))
      setIsDirty(true)

      // Crear preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido'
    }

    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = 'El formato del correo no es válido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Por favor corrige los errores en el formulario')
      return
    }

    try {
      const updatedUser: User = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        correo: formData.correo.trim(),
        urlFotoPerfil: imagePreview || undefined,
        estudiosAbogados: loggedUser.estudiosAbogados,
        perfil: loggedUser.perfil,
        token: loggedUser.token,
      }

      await handleSaveProfile(updatedUser)

      setIsDirty(false)
      setIsEditing(false)
      toast.success('Perfil actualizado correctamente')
    } catch (error) {
      toast.error('Error al actualizar el perfil')
      console.error('Error updating profile:', error)
    }
  }

  const handleCancel = () => {
    if (isDirty) {
      const confirmCancel = window.confirm(
        '¿Estás seguro de que quieres cancelar? Se perderán los cambios no guardados.'
      )
      if (!confirmCancel) return
    }

    setFormData({
      nombre: loggedUser.nombre,
      apellido: loggedUser.apellido,
      correo: loggedUser.correo,
      fotoPerfil: null,
    })
    setImagePreview(loggedUser.urlFotoPerfil || null)
    setErrors({})
    setIsDirty(false)
    setIsEditing(false)
  }

  const getInitials = () => {
    return `${loggedUser.nombre.charAt(0)}${loggedUser.apellido.charAt(0)}`.toUpperCase()
  }

  const handleInitEditPerfil = () => {
    setFormData({
      nombre: loggedUser.nombre,
      apellido: loggedUser.apellido,
      correo: loggedUser.correo,
      fotoPerfil: null,
    })
    setImagePreview(loggedUser.urlFotoPerfil || null)
    setErrors({})
    setIsDirty(false)
    setIsEditing(true)
  }

  if (!isEditing) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Datos
                </CardTitle>
                <CardDescription>Información de tu cuenta y los estudiosAbogados asociados</CardDescription>
              </div>
              <Button onClick={handleInitEditPerfil} variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Editar Perfil
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Foto de perfil */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={loggedUser.urlFotoPerfil || '/placeholder.svg'}
                  alt={`${loggedUser.nombre} ${loggedUser.apellido}`}
                />
                <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-xl font-semibold">
                  {loggedUser.nombre} {loggedUser.apellido}
                </h3>
                <p className="text-muted-foreground">{loggedUser.correo}</p>
              </div>
            </div>

            <Separator />

            {/* Información personal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Nombre</Label>
                <p className="text-base">{loggedUser.nombre}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Apellido</Label>
                <p className="text-base">{loggedUser.apellido}</p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm font-medium text-muted-foreground">Correo electrónico</Label>
                <p className="text-base">{loggedUser.correo}</p>
              </div>
            </div>

            {/* Equipos/Estudios */}
            {loggedUser.estudiosAbogados && loggedUser.estudiosAbogados.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Estudios de Abogados
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {loggedUser.estudiosAbogados.map((equipo) => (
                      <Badge key={equipo} variant="secondary" className="px-3 py-1">
                        {equipo}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Editar Perfil
          </CardTitle>
          <CardDescription>
            Actualiza tu información personal. Los campos marcados con * son obligatorios.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Foto de perfil */}
            <div className="flex flex-col items-center space-y-4 w-full">
              <Avatar className="h-24 w-24">
                <AvatarImage src={imagePreview || '/placeholder.svg'} alt={`${formData.nombre} ${formData.apellido}`} />
                <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-center space-y-2 w-full">
                <div className="flex justify-center w-full">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 w-auto"
                  >
                    <Camera className="h-4 w-4" />
                    Cambiar foto
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center w-full">
                  Máximo 5MB. Formatos: JPG, PNG, GIF, WebP
                </p>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </div>

            <Separator />

            {/* Información personal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Tu nombre"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  className={errors.nombre ? 'border-red-500' : ''}
                  disabled={isSavingProfile}
                />
                {errors.nombre && <p className="text-sm text-red-500">{errors.nombre}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="apellido">Apellido *</Label>
                <Input
                  id="apellido"
                  type="text"
                  placeholder="Tu apellido"
                  value={formData.apellido}
                  onChange={(e) => handleInputChange('apellido', e.target.value)}
                  className={errors.apellido ? 'border-red-500' : ''}
                  disabled={isSavingProfile}
                />
                {errors.apellido && <p className="text-sm text-red-500">{errors.apellido}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="correo">Correo electrónico *</Label>
              <Input
                id="correo"
                type="email"
                placeholder="tu@email.com"
                value={formData.correo}
                onChange={(e) => handleInputChange('correo', e.target.value)}
                className={errors.correo ? 'border-red-500' : ''}
                disabled={isSavingProfile}
              />
              {errors.correo && <p className="text-sm text-red-500">{errors.correo}</p>}
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSavingProfile}
                className="flex-1 bg-transparent"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>

              <Button type="submit" disabled={isSavingProfile || !isDirty} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                {isSavingProfile ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </div>

            {isDirty && <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md">Tienes cambios sin guardar</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default PerfilPage
