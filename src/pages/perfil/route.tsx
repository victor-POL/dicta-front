'use client'

import type React from 'react'
import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Camera, Save, X, Edit, Users, AlertTriangle } from 'lucide-react'
import { useAuthUser } from '@/hooks/useAuth'
import { useUpdateProfile } from '@/hooks/useUpdateProfile'
import type { User, UpdateProfileData } from '@/models/authModels'

const PerfilPage = () => {
  const { user } = useAuthUser()
  const loggedUser = user as User

  const [isEditing, setIsEditing] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(loggedUser.urlFotoPerfil || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    nombres: loggedUser.nombres,
    apellidos: loggedUser.apellidos,
    email: loggedUser.email,
    fotoPerfil: null as File | null,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isDirty, setIsDirty] = useState(false)

  // Hook para actualizar perfil
  const updateProfileMutation = useUpdateProfile({
    onSuccess: () => {
      setIsDirty(false)
      setIsEditing(false)
      toast.success('Perfil actualizado correctamente')
    },
    onError: (error) => {
      toast.error(`Error al actualizar el perfil: ${error.message}`)
    }
  })

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

    if (!formData.nombres.trim()) {
      newErrors.nombres = 'El nombre es requerido'
    }

    if (!formData.apellidos.trim()) {
      newErrors.apellidos = 'El apellido es requerido'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El formato del correo no es válido'
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
      const updateData: UpdateProfileData = {
        nombres: formData.nombres.trim(),
        apellidos: formData.apellidos.trim(),
        email: formData.email.trim(),
      }

      await updateProfileMutation.mutateAsync(updateData)
    } catch (error) {
      // El error ya es manejado por el hook
      console.error('Error updating profile:', error)
    }
  }

  const handleCancel = () => {
    if (isDirty) {
      setShowCancelDialog(true)
      return
    }

    resetForm()
  }

  const confirmCancel = () => {
    resetForm()
    setShowCancelDialog(false)
  }

  const resetForm = () => {
    setFormData({
      nombres: loggedUser.nombres,
      apellidos: loggedUser.apellidos,
      email: loggedUser.email,
      fotoPerfil: null,
    })
    setImagePreview(loggedUser.urlFotoPerfil || null)
    setErrors({})
    setIsDirty(false)
    setIsEditing(false)
  }

  const getInitials = () => {
    if(!loggedUser.nombres && !loggedUser.apellidos) return 'US'
    return `${loggedUser.nombres.charAt(0)}${loggedUser.apellidos.charAt(0)}`.toUpperCase()
  }

  const handleInitEditPerfil = () => {
    setFormData({
      nombres: loggedUser.nombres,
      apellidos: loggedUser.apellidos,
      email: loggedUser.email,
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
                  alt={`${loggedUser.nombres} ${loggedUser.apellidos}`}
                />
                <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-xl font-semibold">
                  {loggedUser.nombres} {loggedUser.apellidos}
                </h3>
                <p className="text-muted-foreground">{loggedUser.correo || loggedUser.email}</p>
              </div>
            </div>

            <Separator />

            {/* Información personal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Nombre</Label>
                <p className="text-base">{loggedUser.nombres}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Apellido</Label>
                <p className="text-base">{loggedUser.apellidos}</p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm font-medium text-muted-foreground">Correo electrónico</Label>
                <p className="text-base">{loggedUser.correo || loggedUser.email}</p>
              </div>
            </div>
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
                <AvatarImage src={imagePreview || '/placeholder.svg'} alt={`${formData.nombres} ${formData.apellidos}`} />
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
                <Label htmlFor="nombres">Nombre *</Label>
                <Input
                  id="nombres"
                  type="text"
                  placeholder="Tu nombre"
                  value={formData.nombres}
                  onChange={(e) => handleInputChange('nombres', e.target.value)}
                  className={errors.nombres ? 'border-red-500' : ''}
                  disabled={updateProfileMutation.isPending}
                />
                {errors.nombres && <p className="text-sm text-red-500">{errors.nombres}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="apellidos">Apellido *</Label>
                <Input
                  id="apellidos"
                  type="text"
                  placeholder="Tu apellido"
                  value={formData.apellidos}
                  onChange={(e) => handleInputChange('apellidos', e.target.value)}
                  className={errors.apellidos ? 'border-red-500' : ''}
                  disabled={updateProfileMutation.isPending}
                />
                {errors.apellidos && <p className="text-sm text-red-500">{errors.apellidos}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico *</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'border-red-500' : ''}
                disabled={updateProfileMutation.isPending}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Error de la mutación */}
            {updateProfileMutation.isError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                <strong>Error al actualizar:</strong> {updateProfileMutation.error?.message || 'Error desconocido'}
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={updateProfileMutation.isPending}
                className="flex-1 bg-transparent"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>

              <Button type="submit" disabled={updateProfileMutation.isPending || !isDirty} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                {updateProfileMutation.isPending ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </div>

            {isDirty && <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md">Tienes cambios sin guardar</p>}
          </form>
        </CardContent>
      </Card>

      {/* Modal de confirmación para cancelar */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Confirmar cancelación
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres cancelar? Se perderán todos los cambios no guardados.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
              className="w-full sm:w-auto"
            >
              Continuar editando
            </Button>
            <Button
              variant="destructive"
              onClick={confirmCancel}
              className="w-full sm:w-auto"
            >
              Sí, cancelar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PerfilPage
