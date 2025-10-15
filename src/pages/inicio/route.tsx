import { useMemo } from 'react'
import { CalendarDays, Clock, MapPin, Briefcase } from 'lucide-react'
import { Link } from 'react-router'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useAuthUser } from '@/hooks/useAuth'
import { useCasos } from '@/hooks/useCasos'

type AudienciaResumen = {
  id: number
  titulo: string
  date: Date
  caseId: number
  caseNumber: string
  caseClient: string
  estudioNombre: string
  location?: string | null
  description?: string | null
}

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

const parseAudienciaDate = (value?: string | null) => {
  if (!value) {
    return null
  }

  // Prioriza ISO strings (contienen "T") para mantener soporte nativo
  if (value.includes('T')) {
    const isoDate = new Date(value)
    return Number.isNaN(isoDate.getTime()) ? null : isoDate
  }

  const match = value.match(
    /^(\d{2})[\/-](\d{2})[\/-](\d{4})(?:\s+(\d{2}):(\d{2}))?$/,
  )

  if (!match) {
    const fallback = new Date(value)
    return Number.isNaN(fallback.getTime()) ? null : fallback
  }

  const [, day, month, year, hour = '00', minute = '00'] = match
  const parsed = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
  )

  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const fullDateFormatter = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: '2-digit', month: 'long' })
const timeFormatter = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' })

const formatFullDate = (date: Date) => {
  const label = fullDateFormatter.format(date)
  return label.charAt(0).toUpperCase() + label.slice(1)
}

const formatTime = (date: Date) => timeFormatter.format(date)

export const InicioPage = () => {
  const { user } = useAuthUser()
  const { data: casos, isFetching, isError } = useCasos()

  const greetingName = useMemo(() => {
    const first = user?.nombres?.trim()?.split(/\s+/).filter(Boolean)[0]
    const last = user?.apellidos?.trim()?.split(/\s+/).filter(Boolean)[0]

    if (first && last) {
      return `${first} ${last}`
    }

    if (first) {
      return first
    }

    if (last) {
      return last
    }

    return 'Usuario'
  }, [user?.nombres, user?.apellidos])

  const startOfToday = useMemo(() => {
    const base = new Date()
    base.setHours(0, 0, 0, 0)
    return base
  }, [])

  const todayLabel = useMemo(() => formatFullDate(startOfToday), [startOfToday])

  const audiencias = useMemo(() => {
    if (!casos || casos.length === 0) {
      return [] as AudienciaResumen[]
    }

    const allAudiencias = casos.flatMap((caso) =>
      (caso.audiencias ?? []).map((audiencia) => {
        const parsedDate = parseAudienciaDate(audiencia.fecha_hora)
        if (!parsedDate) {
          return null
        }

        return {
          id: audiencia.id,
          titulo: audiencia.titulo,
          date: parsedDate,
          caseId: caso.id,
          caseNumber: caso.numero_expediente,
          caseClient: caso.cliente,
          estudioNombre: caso.estudio_nombre,
          location: audiencia.lugar,
          description: audiencia.descripcion,
        } as AudienciaResumen
      }),
    )

    return allAudiencias
      .filter((audiencia): audiencia is AudienciaResumen => audiencia !== null)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
  }, [casos])

  const todayEvents = useMemo(() => {
    if (audiencias.length === 0) {
      return [] as AudienciaResumen[]
    }

    return audiencias.filter((audiencia) => isSameDay(audiencia.date, startOfToday))
  }, [audiencias, startOfToday])

  const upcomingAudiencias = useMemo(() => {
    if (audiencias.length === 0) {
      return [] as AudienciaResumen[]
    }

    const future = audiencias.filter((audiencia) => audiencia.date >= startOfToday)
    if (future.length > 0) {
      return future.slice(0, 5)
    }

    const past = audiencias.filter((audiencia) => audiencia.date < startOfToday)
    return past.slice(-5).reverse()
  }, [audiencias, startOfToday])

  const isLoading = isFetching && (!casos || casos.length === 0)

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="rounded-xl border bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 px-6 py-8 shadow-sm">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-foreground">Buen día {greetingName}</h1>
          <p className="text-sm text-muted-foreground">
            Este es un resumen de tus audiencias recientes y actividades programadas para la semana.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <Card className="border-muted-foreground/15 shadow-sm">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="mb-2">Agenda de hoy</CardTitle>
              <CardDescription>{todayLabel}</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/calendario" className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Ver calendario completo
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="mt-2 space-y-4">
            {isLoading ? (
              <Skeleton className="h-[120px] w-full rounded-lg" />
            ) : todayEvents.length === 0 ? (
              <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                No hay actividades programadas para hoy.
              </div>
            ) : (
              todayEvents.map((event) => (
                <div key={event.id} className="flex flex-col gap-3 rounded-lg border bg-muted/40 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold leading-snug text-foreground">{event.titulo}</p>
                      <p className="text-xs text-muted-foreground">Cliente: {event.caseClient}</p>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1 text-xs">
                      <Clock className="h-3.5 w-3.5" />
                      {formatTime(event.date)}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5" />
                      {event.caseNumber}
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {event.estudioNombre}
                    </span>
                    {event.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {event.location}
                      </span>
                    )}
                  </div>
                  {event.description && (
                    <p className="text-xs leading-snug text-muted-foreground">{event.description}</p>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-muted-foreground/15 shadow-sm">
          <CardHeader>
            <CardTitle>Audiencias recientes</CardTitle>
            <CardDescription>
              {upcomingAudiencias.length > 0
                ? 'Tus proximas audiencias ordenadas por fecha.'
                : 'No hay audiencias registradas.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-2 space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-[96px] w-full rounded-lg" />
              ))
            ) : upcomingAudiencias.length === 0 ? (
              <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                No se encontraron audiencias para mostrar.
              </div>
            ) : (
              upcomingAudiencias.map((audiencia) => (
                <div key={audiencia.id} className="flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold leading-snug text-foreground">{audiencia.titulo}</p>
                      <p className="text-xs text-muted-foreground">{formatFullDate(audiencia.date)}</p>
                    </div>
                    <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                      <Clock className="h-3.5 w-3.5" />
                      {formatTime(audiencia.date)}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5" />
                      {audiencia.caseNumber}
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {audiencia.estudioNombre}
                    </span>
                    {audiencia.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {audiencia.location}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {isError && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          Hubo un problema al cargar la informacion. Intenta nuevamente mas tarde.
        </div>
      )}
    </div>
  )
}

export default InicioPage
