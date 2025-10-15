import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import {
  Upload,
  Link,
  FileAudio,
  Play,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Calendar,
  Mic,
  Loader2,
} from 'lucide-react'
import { getPath } from '@/data/paths.data'
import { useEstudios } from '@/hooks/useEstudios'
import { useCasosPorEstudio } from '@/hooks/useCasos'
import { useAudienciasPorCaso } from '@/hooks/useAudiencias'
import { useCrearTranscripcionAudio, useCrearTranscripcionYoutube, useEliminarTranscripcion, useTranscripciones, useVincularTranscripcion } from '@/hooks/useTranscripciones'
import { formatBackendDateTime } from '@/lib/datetime'

import type { TranscripcionHistorial, VinculacionTranscripcionRequest } from 'server/models/transcripcionModel'
import { DialogTrigger } from '@radix-ui/react-dialog'
import socketService from '@/services/socketService'
import { useSocketSubscription } from '@/contexts/SocketContext'
import { type ResultadoVinculacion, type AudioTranscribeSuccessPayload, type YoutubeTranscribeCompletePayload } from '@/models/transcripcionModels'
import { useTranscripcionProgress } from '@/contexts/TranscripcionProgressContext'
import { actualizarEstadoTranscripcion } from '@/services/api/transcripcionService'

export default function TranscripcionesPage() {
  const navigate = useNavigate()
  
  // Contexto de progreso de transcripciones
  const { 
    agregarTranscripcionEnProgreso, 
    actualizarProgresoTranscripcion, 
    completarTranscripcion, 
    estaSubiendoTranscripcion 
  } = useTranscripcionProgress()

  /* ------------------------ HISTORIAL TRANSCRIPCIONES ----------------------- */
  // React query hook - Solo necesitamos transcripciones con información anidada
  const { data: transcripciones, isFetching: cargandoTranscripciones } = useTranscripciones()

  // Filtros para el historial de transcripciones
  const [historialSearchTerm, setHistorialSearchTerm] = useState('')
  const [historialFiltroTipo, setHistorialFiltroTipo] = useState('all')
  const [historialFiltroEstado, setHistorialFiltroEstado] = useState('all')
  const [historialFiltroVinculacion, setHistorialFiltroVinculacion] = useState('all')

  // Filtros adicionales para historial (similar a vinculacion)
  const [historialFiltroEstudio, setHistorialFiltroEstudio] = useState('all')
  const [historialFiltroCaso, setHistorialFiltroCaso] = useState('all')
  const [historialFiltroAudiencia, setHistorialFiltroAudiencia] = useState('all')

  // Resetear filtro de caso del historial cuando cambie el estudio del historial
  useEffect(() => {
    setHistorialFiltroCaso('all')
  }, [historialFiltroEstudio])

  // Reiniciar filtro de audiencia cuando cambie el caso
  useEffect(() => {
    setHistorialFiltroAudiencia('all')
  }, [historialFiltroCaso])

  // Reiniciar filtros de estudio, caso y audiencia cuando se seleccione "sin_vincular"
  useEffect(() => {
    if (historialFiltroVinculacion === 'sin_vincular') {
      setHistorialFiltroEstudio('all')
      setHistorialFiltroCaso('all')
      setHistorialFiltroAudiencia('all')
    }
  }, [historialFiltroVinculacion])

  // Obtener datos para filtros de historial
  const { data: estudiosDisponiblesHistorial, isFetching: cargandoEstudiosDisponiblesHistorial } = useEstudios()

  const historialEstudioSeleccionadoId = historialFiltroEstudio && historialFiltroEstudio !== 'all' ? parseInt(historialFiltroEstudio) : undefined
  const { data: casosDisponiblesHistorial = [], isFetching: cargandoCasosHistorial } = useCasosPorEstudio(historialEstudioSeleccionadoId)

  const historialCasoSeleccionadoId = historialFiltroCaso && historialFiltroCaso !== 'all' ? parseInt(historialFiltroCaso) : undefined
  const { data: audienciasDisponiblesHistorial = [], isFetching: cargandoAudienciasHistorial } = useAudienciasPorCaso(historialCasoSeleccionadoId)
  /* ------------------------------ HERRAMIENTAS ------------------------------ */
  // Audio
  const crearTranscripcionAudioMutation = useCrearTranscripcionAudio()

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Youtube
  const crearTranscripcionYoutubeMutation = useCrearTranscripcionYoutube()

  const [youtubeUrl, setYoutubeUrl] = useState('')

  /* ------------------------ Estados para confirmación ----------------------- */
  const [accionConfirmacion, setAccionConfirmacion] = useState<{
    tipo: 'transcripcion_eliminar';
    titulo: string;
    mensaje: string;
    onConfirmar: () => void;
  } | null>(null)

  // Estados para modales
  const [modalConfirmacionAbierto, setModalConfirmacionAbierto] = useState(false)
  const [modalVincularAbierto, setModalVincularAbierto] = useState(false)
  const [transcripcionParaVincular, setTranscripcionParaVincular] = useState<TranscripcionHistorial | null>(null)

  // Estados para errores de formulario
  const [errorEliminarTranscripcion, setErrorEliminarTranscripcion] = useState('')
  const [errorVinculacion, setErrorVinculacion] = useState('')
  const [errorCrearTranscripcionYoutube, setErrorCrearTranscripcionYoutube] = useState('')
  const [errorCrearTranscripcionAudio, setErrorCrearTranscripcionAudio] = useState('')

  // Estado para mantener el audio que está a la espera de recibir el evento de transcripción exitosa
  const [pendingAudio, setPendingAudio] = useState<{
    nombreArchivo: string;
    hash: string;
    duration: number;
    progressId?: string;
  } | null>(null)
  
  // Estado para YouTube pendiente
  const [pendingYoutube, setPendingYoutube] = useState<{
    url: string;
    progressId: string;
  } | null>(null)

  // Suscripción al evento de socket (hook debe estar a nivel superior, no dentro de handlers)
  useSocketSubscription<AudioTranscribeSuccessPayload>(
    'audio_transcribe_success',
    (data) => {
      // Solo procesar si tenemos un audio pendiente y (si el evento incluye hash) coincide
      if (!pendingAudio) return
      if ((data as any)?.hash && (data as any).hash !== pendingAudio.hash) return

      console.log('📝 Evento audio_transcribe_success recibido:', data)
      
      // Actualizar progreso antes de la mutación
      if (pendingAudio.progressId) {
        actualizarProgresoTranscripcion(pendingAudio.progressId, 90)
      }
      
      crearTranscripcionAudioMutation.mutate(
        { nombreaArchivo: pendingAudio.nombreArchivo, hash: data.audio_hash, duracion: pendingAudio.duration },
        {
          onSuccess: async () => {
            // Completar progreso y actualizar estado en backend
            if (pendingAudio.progressId) {
              actualizarProgresoTranscripcion(pendingAudio.progressId, 100)
              
              try {
                await actualizarEstadoTranscripcion(data.audio_hash, 'procesado')
              } catch (error) {
                console.error('Error actualizando estado:', error)
              }
              
              setTimeout(() => {
                completarTranscripcion(pendingAudio.progressId!)
              }, 1000) // Esperar 1 segundo para que se vea el 100%
            }
            
            if (fileInputRef.current) {
              fileInputRef.current.value = ''
            }
            setPendingAudio(null)
          },
          onError: (error: any) => {
            const errorMessage = error.response?.data?.error || error.message || 'Error al generar la transcripción desde audio'
            setErrorCrearTranscripcionAudio(errorMessage)
            
            if (pendingAudio.progressId) {
              completarTranscripcion(pendingAudio.progressId)
            }
            setPendingAudio(null)
          }
        }
      )
    },
    [pendingAudio, crearTranscripcionAudioMutation, actualizarProgresoTranscripcion, completarTranscripcion]
  )

  useSocketSubscription<YoutubeTranscribeCompletePayload>(
    'youtube_transcribe_complete',
    (data) => {
      // Solo procesar si tenemos un YouTube pendiente y la URL coincide
      if (!pendingYoutube || pendingYoutube.url !== data.url) return
      
      console.log('📝 Evento youtube_transcribe_complete recibido:', data)
      
      // Actualizar progreso
      actualizarProgresoTranscripcion(pendingYoutube.progressId, 90)
      
      crearTranscripcionYoutubeMutation.mutate(
        { urlYoutube: data.url, hash: data.audio_hash, duracion: data.duration },
        {
          onSuccess: async () => {
            // Completar progreso y actualizar estado en backend
            actualizarProgresoTranscripcion(pendingYoutube.progressId, 100)
            
            try {
              await actualizarEstadoTranscripcion(data.audio_hash, 'procesado')
            } catch (error) {
              console.error('Error actualizando estado:', error)
            }
            
            setTimeout(() => {
              completarTranscripcion(pendingYoutube.progressId)
            }, 1000) // Esperar 1 segundo para que se vea el 100%
            
            setYoutubeUrl('')
            setPendingYoutube(null)
          },
          onError: (error: any) => {
            const errorMessage = error.response?.data?.error || error.message || 'Error al generar la transcripción desde YouTube'
            setErrorCrearTranscripcionYoutube(errorMessage)
            completarTranscripcion(pendingYoutube.progressId)
            setPendingYoutube(null)
          }
        }
      )
    },
    [pendingYoutube, crearTranscripcionYoutubeMutation, actualizarProgresoTranscripcion, completarTranscripcion]
  )

  useSocketSubscription<ResultadoVinculacion>(
    'ai_link_case_success',
    (data) => {
      console.log('📝 Evento ai_link_case_success recibido:', data)
      if (data.success) {
        // Manejar éxito de la vinculación
        console.log('Vinculación exitosa para el caso:', data.case_name)
      } else {
        // Manejar error de la vinculación
        console.error('Error en la vinculación del caso:', data)
      }
    }
  )

  /* ------------------------------- VINCULACION ------------------------------ */
  // Filtros vinculacion
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroEstudio, setFiltroEstudio] = useState('')
  const [filtroCaso, setFiltroCaso] = useState('')

  // Obtener casos por estudio seleccionado
  const estudioSeleccionadoId = filtroEstudio && filtroEstudio !== '' ? parseInt(filtroEstudio) : undefined
  const { data: casosDisponiblesVinculacion = [], isFetching: cargandoCasosVinculacion } = useCasosPorEstudio(estudioSeleccionadoId)

  // Obtener audiencias del caso seleccionado
  const casoSeleccionadoId = filtroCaso && filtroCaso !== '' ? parseInt(filtroCaso) : undefined
  const { data: audienciasDisponibles = [], isFetching: cargandoAudiencias } = useAudienciasPorCaso(casoSeleccionadoId)

  const [audienciaVinculando, setAudienciaVinculando] = useState<number | null>(null)

  // Resetear filtro de caso cuando cambie el estudio
  useEffect(() => {
    setFiltroCaso('')
  }, [estudioSeleccionadoId])

  const { data: estudiosDisponiblesVinculacion, isFetching: cargandoEstudiosDisponiblesVinculacion } = useEstudios(
    { autoFetch: modalVincularAbierto }
  )

  const vincularTranscripcionMutation = useVincularTranscripcion()

  const vincularTranscripcionAudiencia = (audienciaId: number) => {
    if (!transcripcionParaVincular) {
      setErrorVinculacion('No hay transcripción seleccionada para vincular')
      return
    }

    if (!audienciaId) {
      setErrorVinculacion('Debe seleccionar una audiencia válida')
      return
    }

    // Limpiar error previo y establecer audiencia que se está vinculando
    setErrorVinculacion('')
    setAudienciaVinculando(audienciaId)

    const vinculacionRequest: VinculacionTranscripcionRequest = {
      transcripcionId: transcripcionParaVincular.id,
      audienciaId: audienciaId
    }

    socketService.vincularTranscripcion(transcripcionParaVincular.hash.toString(), audienciaId.toString())

    vincularTranscripcionMutation.mutate(
      { vinculacionData: vinculacionRequest },
      {
        onSuccess: () => {
          resetFormularioVinculacion()
          setModalVincularAbierto(false)
          setAudienciaVinculando(null)
        },
        onError: (error: any) => {
          const errorMessage = error.response?.data?.error || error.message || 'Error al vincular transcripción'
          setErrorVinculacion(errorMessage)
          setAudienciaVinculando(null)
        }
      }
    )
  }

  /* ------------------------------ ELIMINACIÓN ------------------------------- */
  // Hook de React Query para eliminar transcripción
  const eliminarTranscripcionMutation = useEliminarTranscripcion()

  /* -------------------------------- HANDLERS -------------------------------- */
  const crearTranscripcionAudio = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      setErrorCrearTranscripcionAudio('No se seleccionó ningún archivo')
      return
    }

    if (pendingAudio) {
      setErrorCrearTranscripcionAudio('Ya hay un archivo en proceso. Espere a que finalice.')
      return
    }

    const allowedTypes = ['audio/mp3', 'audio/wav', 'audio/m4a', 'audio/ogg', 'audio/mpeg']
    if (!allowedTypes.includes(file.type)) {
      setErrorCrearTranscripcionAudio('Tipo de archivo no soportado. Solo se permiten MP3, WAV, M4A, OGG, MPEG.')
      return
    }

    if (file.size > 6 * 1024 * 1024 * 1024) {
      setErrorCrearTranscripcionAudio('El archivo excede el tamaño máximo permitido de 6GB.')
      return
    }

    setErrorCrearTranscripcionAudio('')

    const nombreArchivo = file.name
    const formData = new FormData()
    formData.append('audio', file)

    console.log('📤 Uploading file via HTTP POST:', {
      filename: file.name,
      fileSize: file.size,
      mimeType: file.type,
    })

    // Agregar transcripción al contexto de progreso
    const transcripcionId = `audio_${Date.now()}`
    agregarTranscripcionEnProgreso({
      id: transcripcionId,
      nombre: nombreArchivo,
      tipo: 'audio',
      progreso: 0
    })

    // Obtener la duración del audio de forma asíncrona antes de subir (o en paralelo si se quisiera optimizar)
    const duration = await new Promise<number>((resolve) => {
      const audioEl = document.createElement('audio')
      audioEl.preload = 'metadata'
      audioEl.onloadedmetadata = () => {
        const d = audioEl.duration || 0
        console.log('⏱️ Duración del audio:', d, 'segundos')
        resolve(isFinite(d) ? d : 0)
        URL.revokeObjectURL(audioEl.src)
      }
      audioEl.onerror = () => {
        console.warn('No se pudo obtener la duración del audio, se usará 0')
        resolve(0)
      }
      audioEl.src = URL.createObjectURL(file)
    })

    // Simular progreso de subida
    actualizarProgresoTranscripcion(transcripcionId, 25)

    try {
      // En lugar de subir a un servidor externo, simulamos el proceso
      // y usamos un hash mock para desarrollo
      const hash = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Simular tiempo de upload
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      actualizarProgresoTranscripcion(transcripcionId, 50)

      // Crear transcripción usando el hook de React Query
      try {
        await crearTranscripcionAudioMutation.mutateAsync({ 
          nombreaArchivo: nombreArchivo, 
          hash: hash, 
          duracion: duration 
        })
        
        actualizarProgresoTranscripcion(transcripcionId, 75)

        // Guardamos el audio pendiente con el ID de progreso para poder completarlo después
        setPendingAudio({ nombreArchivo, hash, duration, progressId: transcripcionId })

        // Solicitar al backend que procese/transcriba el archivo
        socketService.getTranscripcion(hash)
      } catch (error: any) {
        completarTranscripcion(transcripcionId)
        const errorMessage = error.response?.data?.error || error.message || 'Error al crear la transcripción'
        setErrorCrearTranscripcionAudio(errorMessage)
      }
    } catch (error) {
      completarTranscripcion(transcripcionId)
      setErrorCrearTranscripcionAudio('Error al procesar el archivo de audio')
    }
  }

  const crearTranscripcionYoutube = () => {
    if (!youtubeUrl.trim()) {
      return
    }

    setErrorCrearTranscripcionYoutube('')
    
    // Crear un ID único para este progreso
    const progressId = `youtube_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Agregar transcripción al contexto de progreso
    agregarTranscripcionEnProgreso({
      id: progressId,
      nombre: `YouTube: ${youtubeUrl}`,
      tipo: 'youtube',
      progreso: 0
    })
    
    // Guardar el estado pendiente de YouTube
    setPendingYoutube({
      url: youtubeUrl.trim(),
      progressId: progressId
    })
    
    // Progreso inicial
    actualizarProgresoTranscripcion(progressId, 10)
    
    // Usar socketService para emitir evento
    socketService.getYoutubeAudio(youtubeUrl.trim())
  }

  // Eliminar
  const eliminarTranscripcion = (transcripcionId: number) => {
    setAccionConfirmacion({
      tipo: 'transcripcion_eliminar',
      titulo: 'Eliminar Transcripcion',
      mensaje: `¿Estás seguro de que deseas eliminar la transcripción?.`,
      onConfirmar: () => {
        setErrorEliminarTranscripcion('')
        eliminarTranscripcionMutation.mutate(transcripcionId, {
          onSuccess: () => {
            setModalConfirmacionAbierto(false)
            setAccionConfirmacion(null)
            setErrorEliminarTranscripcion('')
          },
          onError: (error: any) => {
            const errorMessage = error.response?.data?.error || error.message || 'Error al eliminar la transcripcion'
            setErrorEliminarTranscripcion(errorMessage)
          }
        })
      }
    })
    setErrorEliminarTranscripcion('')
    setModalConfirmacionAbierto(true)
  }

  // Funciones para resetear formularios
  const resetFormularioVinculacion = () => {
    setSearchTerm('')
    setFiltroEstudio('')
    setFiltroCaso('')
    setErrorVinculacion('')
    setAudienciaVinculando(null)
  }

  // Manejadores para abrir/cerrar modales con reset
  const handleOpenModalVinculacion = (transcripcion: TranscripcionHistorial) => {
    resetFormularioVinculacion()
    setTranscripcionParaVincular(transcripcion)
    setModalVincularAbierto(true)
  }

  const handleCloseModalVinculacion = (open: boolean) => {
    if (!open) {
      resetFormularioVinculacion()
      setTranscripcionParaVincular(null)
    }
    setModalVincularAbierto(open)
  }


  /* --------------------------------- UTILES --------------------------------- */
  const getEstadoIcon = (estado: TranscripcionHistorial['estado']) => {
    switch (estado) {
      case 'procesado':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'pendiente':
        return <Clock className="h-4 w-4 text-blue-600 animate-spin" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />
    }
  }

  const getEstadoBadge = (estado: TranscripcionHistorial['estado']) => {
    switch (estado) {
      case 'procesado':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 w-24 justify-center">
            Procesado
          </Badge>
        )
      case 'pendiente':
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 w-28 justify-center animate-pulse">
            Procesando...
          </Badge>
        )
      case 'error':
        return (
          <Badge variant="default" className="bg-red-100 text-red-800 w-24 justify-center">
            Error
          </Badge>
        )
    }
  }

  const getTipoIcon = (tipo: TranscripcionHistorial['tipo']) => {
    switch (tipo) {
      case 'audio':
        return <FileAudio className="h-5 w-5 text-primary-600" />
      case 'youtube':
        return <Play className="h-5 w-5 text-primary-600" />
      case 'en_vivo':
        return <Mic className="h-5 w-5 text-green-600" />
    }
  }

  const transcripcionesFiltradas = transcripciones?.filter((transcripcion) => {
    // Obtener la información de audiencia y caso desde las propiedades anidadas
    const audiencia = transcripcion.audiencia_vinculada?.[0]
    const caso = transcripcion.expediente_vinculado?.[0]

    const matchesSearch = historialSearchTerm === '' ||
      transcripcion.nombre?.toLowerCase().includes(historialSearchTerm.toLowerCase()) ||
      audiencia?.titulo?.toLowerCase().includes(historialSearchTerm.toLowerCase()) ||
      caso?.numero_expediente?.toLowerCase().includes(historialSearchTerm.toLowerCase()) ||
      caso?.cliente?.toLowerCase().includes(historialSearchTerm.toLowerCase()) ||
      caso?.estudio_nombre?.toLowerCase().includes(historialSearchTerm.toLowerCase())

    const matchesTipo = historialFiltroTipo === 'all' || transcripcion.tipo === historialFiltroTipo
    const matchesEstado = historialFiltroEstado === 'all' || transcripcion.estado === historialFiltroEstado
    const matchesVinculacion =
      historialFiltroVinculacion === 'all' ||
      (historialFiltroVinculacion === 'vinculadas' && audiencia) ||
      (historialFiltroVinculacion === 'sin_vincular' && !audiencia)

    // Nuevos filtros por estudio, caso y audiencia
    const matchesEstudio = historialFiltroEstudio === 'all' ||
      (caso?.estudio_id && caso.estudio_id.toString() === historialFiltroEstudio)

    const matchesCaso = historialFiltroCaso === 'all' ||
      (caso?.id && caso.id.toString() === historialFiltroCaso)

    const matchesAudiencia = historialFiltroAudiencia === 'all' ||
      (audiencia?.id && audiencia.id.toString() === historialFiltroAudiencia)

    return matchesSearch && matchesTipo && matchesEstado && matchesVinculacion && matchesEstudio && matchesCaso && matchesAudiencia
  })

  if (cargandoTranscripciones)
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Cargando transcripciones...</span>
          </div>
        </div>
      </div>
    )


  if (transcripciones === undefined)
    return <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="text-red-500">Error al cargar las transcripciones. Intente nuevamente más tarde.</span>
      </div>
    </div>

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div>
        <p className="text-gray-600 mt-1">
          Sube archivos de audio o agrega URLs de YouTube para generar transcripciones automáticas de audiencias y casos
          judiciales
        </p>
      </div>

      <Tabs defaultValue="audio" className="mb-1">
        <TabsList className="w-full flex flex-col sm:flex-row h-auto">
          <TabsTrigger value="audio" className="flex items-center justify-center gap-2 w-full sm:flex-1" disabled={crearTranscripcionYoutubeMutation.isPending || crearTranscripcionAudioMutation.isPending}>
            <FileAudio className="h-4 w-4 flex-shrink-0" />
            <span>Subir Audio</span>
          </TabsTrigger>
          <TabsTrigger value="youtube" className="flex items-center justify-center gap-2 w-full sm:flex-1" disabled={crearTranscripcionYoutubeMutation.isPending || crearTranscripcionAudioMutation.isPending}>
            <Play className="h-4 w-4 flex-shrink-0" />
            <span>YouTube</span>
          </TabsTrigger>
          <TabsTrigger value="en_vivo" className="flex items-center justify-center gap-2 w-full sm:flex-1" disabled={crearTranscripcionYoutubeMutation.isPending || crearTranscripcionAudioMutation.isPending}>
            <Mic className="h-4 w-4 flex-shrink-0" />
            <span>En Vivo</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="audio" className="mb-3">
          <Card>
            <CardHeader className="mb-4">
              <CardTitle className="flex items-center gap-2">
                <FileAudio className="h-5 w-5 text-primary-600" />
                Subir Archivo de Audio
              </CardTitle>
              <CardDescription>Formatos soportados: MP3, WAV, M4A, OGG. Tamaño máximo: 6GB</CardDescription>
              {errorCrearTranscripcionAudio && (
                <div className="mt-2">
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
                    {errorCrearTranscripcionAudio}
                  </p>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={crearTranscripcionAudio}
                  className="hidden"
                  disabled={crearTranscripcionAudioMutation.isPending || estaSubiendoTranscripcion}
                />
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Haz clic para seleccionar
                </p>
                <p className="text-sm text-gray-500 mb-4">Archivos de audio hasta 6GB</p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={crearTranscripcionAudioMutation.isPending || estaSubiendoTranscripcion}
                >
                  {crearTranscripcionAudioMutation.isPending || estaSubiendoTranscripcion ? 'Procesando...' : 'Seleccionar Archivo'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="youtube" className="mb-3">
          <Card>
            <CardHeader className="mb-4">
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5 text-primary-600" />
                Transcribir desde YouTube
              </CardTitle>
              <CardDescription>Ingresa la URL de un video de YouTube para generar su transcripción</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <div>
                  <Label htmlFor="youtube-url">URL de YouTube</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="youtube-url"
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      disabled={crearTranscripcionYoutubeMutation.isPending || estaSubiendoTranscripcion}
                    />
                    <Button
                      onClick={crearTranscripcionYoutube}
                      disabled={crearTranscripcionYoutubeMutation.isPending || !youtubeUrl.trim() || estaSubiendoTranscripcion}
                    >
                      {crearTranscripcionYoutubeMutation.isPending || estaSubiendoTranscripcion ? 'Procesando...' : 'Transcribir'}
                    </Button>
                  </div>
                </div>
                {errorCrearTranscripcionYoutube && (
                  <div className="mt-2">
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
                      {errorCrearTranscripcionYoutube}
                    </p>
                  </div>
                )}
                <p className="text-sm text-gray-500">Nota: Solo videos públicos de YouTube son soportados</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="en_vivo" className="mb-3">
          <Card>
            <CardHeader className="mb-4">
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5 text-primary-600" />
                Transcripción en Tiempo Real
              </CardTitle>
              <CardDescription>Inicia una sesión de transcripción en vivo para audiencias en curso</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-green-400 transition-colors">
                <Mic className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">Transcripción en Tiempo Real</p>
                <p className="text-sm text-gray-500 mb-4">Captura y transcribe audio en vivo durante audiencias</p>
                <Button
                  onClick={() => {
                    navigate(getPath('transcripcion_en_vivo').url, { state: { hash: `live_${crypto.randomUUID()}` } })
                  }}
                >
                  Iniciar Transcripción en Vivo
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
                    <SelectItem value="procesado">Procesado</SelectItem>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
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

              <div>
                <Label className="mb-1" htmlFor="historial-estudio">
                  Estudio
                </Label>
                <Select value={historialFiltroEstudio} onValueChange={setHistorialFiltroEstudio}>
                  <SelectTrigger className="w-full" disabled={historialFiltroVinculacion === 'sin_vincular' || cargandoEstudiosDisponiblesHistorial || estudiosDisponiblesHistorial === undefined || estudiosDisponiblesHistorial.length === 0}>
                    <SelectValue placeholder={
                      historialFiltroVinculacion === 'sin_vincular'
                        ? "No disponible para transcripciones sin vincular"
                        : cargandoEstudiosDisponiblesHistorial
                          ? "Cargando estudios..."
                          : estudiosDisponiblesHistorial === undefined
                            ? "Error al cargar estudios"
                            : estudiosDisponiblesHistorial.length === 0
                              ? "No se encontraron estudios"
                              : "Todos los estudios"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estudios</SelectItem>
                    {estudiosDisponiblesHistorial?.map((estudio) => (
                      <SelectItem key={estudio.id} value={estudio.id.toString()}>
                        {estudio.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-1" htmlFor="historial-caso">
                  Caso
                </Label>
                <Select value={historialFiltroCaso} onValueChange={setHistorialFiltroCaso}>
                  <SelectTrigger className="w-full" disabled={historialFiltroVinculacion === 'sin_vincular' || cargandoCasosHistorial || historialEstudioSeleccionadoId === undefined || casosDisponiblesHistorial.length === 0}>
                    <SelectValue placeholder={
                      historialFiltroVinculacion === 'sin_vincular'
                        ? "No disponible para transcripciones sin vincular"
                        : historialEstudioSeleccionadoId === undefined
                          ? "Selecciona un estudio primero"
                          : cargandoCasosHistorial
                            ? "Cargando casos..."
                            : casosDisponiblesHistorial.length === 0
                              ? "No hay casos disponibles"
                              : "Todos los casos"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los casos</SelectItem>
                    {casosDisponiblesHistorial.map((caso) => (
                      <SelectItem key={caso.id} value={caso.id.toString()}>
                        {caso.numero_expediente}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por audiencia */}
              <div className="space-y-2">
                <Label className="mb-1" htmlFor="historial-audiencia">
                  Audiencia
                </Label>
                <Select value={historialFiltroAudiencia} onValueChange={setHistorialFiltroAudiencia}>
                  <SelectTrigger className="w-full" disabled={historialFiltroVinculacion === 'sin_vincular' || cargandoAudienciasHistorial || historialCasoSeleccionadoId === undefined || audienciasDisponiblesHistorial.length === 0}>
                    <SelectValue placeholder={
                      historialFiltroVinculacion === 'sin_vincular'
                        ? "No disponible para transcripciones sin vincular"
                        : historialCasoSeleccionadoId === undefined
                          ? "Selecciona un caso primero"
                          : cargandoAudienciasHistorial
                            ? "Cargando audiencias..."
                            : audienciasDisponiblesHistorial.length === 0
                              ? "No hay audiencias disponibles"
                              : "Todas las audiencias"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las audiencias</SelectItem>
                    {audienciasDisponiblesHistorial.map((audiencia) => (
                      <SelectItem key={audiencia.id} value={audiencia.id.toString()}>
                        {audiencia.titulo || `Audiencia ${audiencia.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {(historialSearchTerm ||
              historialFiltroTipo !== 'all' ||
              historialFiltroEstado !== 'all' ||
              historialFiltroVinculacion !== 'all' ||
              historialFiltroEstudio !== 'all' ||
              historialFiltroCaso !== 'all' ||
              historialFiltroAudiencia !== 'all') && (
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setHistorialSearchTerm('')
                      setHistorialFiltroTipo('all')
                      setHistorialFiltroEstado('all')
                      setHistorialFiltroVinculacion('all')
                      setHistorialFiltroEstudio('all')
                      setHistorialFiltroCaso('all')
                      setHistorialFiltroAudiencia('all')
                    }}
                  >
                    Limpiar filtros
                  </Button>
                </div>
              )}
          </div>

          {transcripcionesFiltradas?.length === 0 ? (
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
                  Mostrando {transcripcionesFiltradas?.length} de {transcripciones.length} transcripciones
                </span>
              </div>

              {transcripcionesFiltradas?.map((transcripcion, index) => {
                // Obtener información desde las propiedades anidadas
                const audiencia = transcripcion.audiencia_vinculada?.[0]
                const caso = transcripcion.expediente_vinculado?.[0]
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
                            <h3
                              className="font-medium text-gray-900 truncate cursor-pointer hover:underline"
                              onClick={() => {navigate(getPath('transcripcion_en_vivo').url, { state: { hash: transcripcion.hash, audienciaId: audiencia?.id } })}}
                            >
                              {transcripcion.nombre}
                            </h3>
                          </div>
                        </div>
                        {/* Estado badge - móvil abajo, desktop a la derecha */}
                        <div className="hidden sm:flex items-center">{getEstadoBadge(transcripcion.estado)}</div>
                      </div>

                      {/* Estado en móviles */}
                      <div className="sm:hidden mb-3">{getEstadoBadge(transcripcion.estado)}</div>

                      {/* Información de duración y fecha_hora */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mb-3">
                        <span>Duración: {transcripcion.duracion}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{transcripcion.fecha_creacion}</span>
                        {transcripcion.url && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <a
                              href={transcripcion.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline break-all"
                            >
                              Link
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
                                {audiencia.titulo}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {caso.numero_expediente}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {caso.estudio_nombre}
                              </Badge>
                            </div>

                            {/* Botones a la derecha */}
                            <div className="flex gap-2">
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
                              <Dialog open={modalVincularAbierto} onOpenChange={handleCloseModalVinculacion}>
                                <DialogTrigger asChild>
                                  {transcripcion.estado === 'procesado' && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleOpenModalVinculacion(transcripcion)}
                                    >
                                      <Link className="h-4 w-4 mr-1" />
                                      <span className="hidden sm:inline">Vincular</span>
                                    </Button>
                                  )}
                                </DialogTrigger>
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
                                        <Label htmlFor="search" className="text-sm font-medium my-2">
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
                                        <Label htmlFor="filtro-estudio" className="text-sm font-medium my-2">
                                          Estudio
                                        </Label>
                                        <Select value={filtroEstudio} onValueChange={setFiltroEstudio}>
                                          <SelectTrigger className="w-full mt-1" disabled={cargandoEstudiosDisponiblesVinculacion || estudiosDisponiblesVinculacion === undefined || estudiosDisponiblesVinculacion.length === 0}>
                                            <SelectValue placeholder={cargandoEstudiosDisponiblesVinculacion ? "Cargando estudios..." : estudiosDisponiblesVinculacion === undefined ? "Error al cargar estudios" : estudiosDisponiblesVinculacion.length === 0 ? "No se encontraron estudios" : "Seleccione un estudio"} />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {estudiosDisponiblesVinculacion?.map((estudio) => (
                                              <SelectItem key={estudio.id} value={estudio.id.toString()}>
                                                {estudio.nombre}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      <div>
                                        <Label htmlFor="filtro-caso" className="text-sm font-medium my-2">
                                          Caso
                                        </Label>
                                        <Select value={filtroCaso} onValueChange={setFiltroCaso}>
                                          <SelectTrigger className="w-full mt-1" disabled={cargandoCasosVinculacion || estudioSeleccionadoId === undefined || casosDisponiblesVinculacion.length === 0}>
                                            <SelectValue placeholder={
                                              estudioSeleccionadoId === undefined
                                                ? "Selecciona un estudio primero"
                                                : cargandoCasosVinculacion
                                                  ? "Cargando casos..."
                                                  : casosDisponiblesVinculacion.length === 0
                                                    ? "No hay casos disponibles"
                                                    : "Seleccione un caso"
                                            } />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {casosDisponiblesVinculacion.map((caso) => (
                                              <SelectItem key={caso.id} value={caso.id.toString()}>
                                                {caso.numero_expediente}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>

                                    <div className="border rounded-lg max-h-96 overflow-y-auto">
                                      {audienciasDisponibles.length === 0 ? (
                                        <div className="p-8 text-center text-gray-500">
                                          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                          <p>
                                            {!estudioSeleccionadoId
                                              ? "Selecciona un estudio para ver los casos disponibles"
                                              : !casoSeleccionadoId
                                                ? "Selecciona un caso para ver sus audiencias"
                                                : cargandoAudiencias
                                                  ? "Cargando audiencias..."
                                                  : "No se encontraron audiencias para el caso seleccionado"}
                                          </p>
                                        </div>
                                      ) : (
                                        <div className="divide-y">
                                          {audienciasDisponibles.map((audiencia) => {
                                            return (
                                              <div
                                                key={audiencia.id}
                                                className="w-full p-4 hover:bg-gray-50 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                                              >
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                  <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-gray-900 truncate">{audiencia.titulo}</h4>
                                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
                                                      <span>{formatBackendDateTime(audiencia.fecha_hora)}</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                      <Badge variant="secondary" className="text-xs">
                                                        {audiencia.numero_expediente}
                                                      </Badge>
                                                    </div>
                                                    {/* Mostrar error de vinculación solo para esta audiencia específica */}
                                                    {errorVinculacion && audienciaVinculando === audiencia.id && (
                                                      <div className="mt-2">
                                                        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
                                                          {errorVinculacion}
                                                        </p>
                                                      </div>
                                                    )}
                                                  </div>
                                                  <Button
                                                    type='button'
                                                    variant="ghost"
                                                    size="sm"
                                                    className="self-start sm:self-center"
                                                    onClick={() => vincularTranscripcionAudiencia(audiencia.id)}
                                                    disabled={vincularTranscripcionMutation.isPending}
                                                  >
                                                    <Link className="h-4 w-4" />
                                                    {audienciaVinculando === audiencia.id ? ' Vinculando...' : ''}
                                                  </Button>
                                                </div>
                                              </div>
                                            )
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
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

      {/* Modal de confirmación */}
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
            const errorMessage = accionConfirmacion?.tipo === 'transcripcion_eliminar' ? errorEliminarTranscripcion :
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
                setErrorEliminarTranscripcion('')
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => accionConfirmacion?.onConfirmar()}
              disabled={(() => {
                switch (accionConfirmacion?.tipo) {
                  case 'transcripcion_eliminar': return eliminarTranscripcionMutation.isPending;
                  default: return false;
                }
              })()}
            >
              {(() => {
                const isPending = (() => {
                  switch (accionConfirmacion?.tipo) {
                    case 'transcripcion_eliminar': return eliminarTranscripcionMutation.isPending;
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
