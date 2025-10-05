import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, Briefcase } from 'lucide-react'
import { useCasos } from '@/hooks/useCasos'
import { useEstudios } from '@/hooks/useEstudios'
import { cn } from '@/lib/utils'

type CalendarEvent = {
  id: number
  title: string
  date: Date
  caseId: number
  caseNumber: string
  estudioId: number
  estudioNombre: string
  location?: string | null
  description?: string | null
  type: 'audiencia' | 'caso'
  hasTime: boolean
}

const DAY_LABELS = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']

const formatDayKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getMonthStart = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1)

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())

const addMonths = (date: Date, amount: number) => {
  return getMonthStart(new Date(date.getFullYear(), date.getMonth() + amount, 1))
}

const startOfCalendar = (date: Date) => {
  const firstOfMonth = getMonthStart(date)
  const day = firstOfMonth.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const start = new Date(firstOfMonth)
  start.setDate(firstOfMonth.getDate() + diff)
  return start
}

const generateCalendarDays = (date: Date) => {
  const start = startOfCalendar(date)
  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start)
    day.setDate(start.getDate() + index)
    return day
  })
}

const getMonthLabel = (date: Date) => {
  const label = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(date)
  return label.charAt(0).toUpperCase() + label.slice(1)
}

const formatLongDate = (date: Date) =>
  new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)

const formatShortDate = (date: Date) =>
  new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)

const formatTime = (date: Date) =>
  new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)

const EVENT_TYPE_META = {
  audiencia: {
    label: 'Audiencia',
    pill: 'bg-primary/10 text-primary',
    pillSelected: 'bg-white/20 text-primary-foreground',
    badge: 'border-primary/40 bg-primary/10 text-primary',
  },
  caso: {
    label: 'Caso',
    pill: 'bg-amber-100 text-amber-800',
    pillSelected: 'bg-white/20 text-primary-foreground',
    badge: 'border-amber-200 bg-amber-50 text-amber-700',
  },
} as const

const getEventPillClasses = (event: CalendarEvent, isSelected: boolean) =>
  isSelected ? EVENT_TYPE_META[event.type].pillSelected : EVENT_TYPE_META[event.type].pill

const getEventTypeLabel = (event: CalendarEvent) => EVENT_TYPE_META[event.type].label

const getEventTimeLabel = (event: CalendarEvent) =>
  event.hasTime ? formatTime(event.date) : 'Hora no definida'
const parseBackendDate = (value?: string | null): { date: Date | null; hasTime: boolean } => {
  if (!value) {
    return { date: null, hasTime: false }
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return { date: null, hasTime: false }
  }

  const dmyMatch = trimmed.match(
    /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/,
  )
  if (dmyMatch) {
    const [_, dayRaw, monthRaw, yearRaw, hourRaw, minuteRaw, secondRaw] = dmyMatch
    const day = Number.parseInt(dayRaw, 10)
    const month = Number.parseInt(monthRaw, 10)
    const year = Number.parseInt(yearRaw, 10)
    const hour = hourRaw ? Number.parseInt(hourRaw, 10) : 0
    const minute = minuteRaw ? Number.parseInt(minuteRaw, 10) : 0
    const second = secondRaw ? Number.parseInt(secondRaw, 10) : 0

    if (
      Number.isNaN(day) ||
      Number.isNaN(month) ||
      Number.isNaN(year) ||
      day < 1 ||
      day > 31 ||
      month < 1 ||
      month > 12
    ) {
      return { date: null, hasTime: false }
    }

    return {
      date: new Date(year, month - 1, day, hour, minute, second),
      hasTime: Boolean(hourRaw),
    }
  }

  const normalized = trimmed.includes(' ')
    ? trimmed.replace(' ', 'T')
    : trimmed

  const parsed = new Date(normalized)
  if (!Number.isNaN(parsed.getTime())) {
    return {
      date: parsed,
      hasTime: /[T\s]\d{1,2}:\d{2}/.test(trimmed),
    }
  }

  return { date: null, hasTime: false }
}

export default function CalendarioPage() {
  const { data: casos, isFetching: loadingCasos, error: casosError } = useCasos()
  const { data: estudios, isFetching: loadingEstudios, error: estudiosError } = useEstudios()
  const [currentMonth, setCurrentMonth] = useState(() => getMonthStart(new Date()))
  const [selectedDay, setSelectedDay] = useState(() => startOfDay(new Date()))
  const [selectedEstudio, setSelectedEstudio] = useState<string>('all')
  const [selectedCaso, setSelectedCaso] = useState<string>('all')

  useEffect(() => {
    if (
      selectedDay.getFullYear() !== currentMonth.getFullYear() ||
      selectedDay.getMonth() !== currentMonth.getMonth()
    ) {
      setSelectedDay(startOfDay(getMonthStart(currentMonth)))
    }
  }, [currentMonth, selectedDay])

  useEffect(() => {
    setSelectedCaso('all')
  }, [selectedEstudio])

  const selectedEstudioId = selectedEstudio === 'all' ? null : Number(selectedEstudio)
  const selectedCasoId = selectedCaso === 'all' ? null : Number(selectedCaso)

  const events = useMemo<CalendarEvent[]>(() => {
    if (!casos) {
      return []
    }

    const items: CalendarEvent[] = []

    casos.forEach((caso) => {
      const casoDateInfo = parseBackendDate(caso.fecha_inicio)
      if (casoDateInfo.date) {
        items.push({
          id: -caso.id,
          title: `Caso: ${caso.numero_expediente}`,
          date: casoDateInfo.date,
          caseId: caso.id,
          caseNumber: caso.numero_expediente,
          estudioId: caso.estudio_id,
          estudioNombre: caso.estudio_nombre,
          location: null,
          description: caso.descripcion,
          type: 'caso',
          hasTime: casoDateInfo.hasTime,
        })
      }

      caso.audiencias.forEach((audiencia) => {
        if (!audiencia.fecha_hora) return

        const audienciaDateInfo = parseBackendDate(audiencia.fecha_hora)
        if (!audienciaDateInfo.date) return

        items.push({
          id: audiencia.id,
          title: audiencia.titulo,
          date: audienciaDateInfo.date,
          caseId: caso.id,
          caseNumber: audiencia.numero_expediente ?? caso.numero_expediente,
          estudioId: caso.estudio_id,
          estudioNombre: caso.estudio_nombre,
          location: audiencia.lugar,
          description: audiencia.descripcion,
          type: 'audiencia',
          hasTime: audienciaDateInfo.hasTime,
        })
      })
    })

    return items.sort((a, b) => a.date.getTime() - b.date.getTime())
  }, [casos])

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (selectedEstudioId !== null && event.estudioId !== selectedEstudioId) return false
      if (selectedCasoId !== null && event.caseId !== selectedCasoId) return false
      return true
    })
  }, [events, selectedEstudioId, selectedCasoId])

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()

    filteredEvents.forEach((event) => {
      const key = formatDayKey(event.date)
      const dayEvents = map.get(key)
      if (dayEvents) {
        dayEvents.push(event)
        dayEvents.sort((a, b) => a.date.getTime() - b.date.getTime())
      } else {
        map.set(key, [event])
      }
    })

    return map
  }, [filteredEvents])

  const eventsForSelectedDay = useMemo(() => {
    return eventsByDay.get(formatDayKey(selectedDay)) ?? []
  }, [eventsByDay, selectedDay])

  const todaysKey = formatDayKey(new Date())
  const calendarDays = useMemo(() => generateCalendarDays(currentMonth), [currentMonth])
  const isLoading = loadingCasos || loadingEstudios
  const combinedError = casosError ?? estudiosError
  const errorMessage =
    combinedError instanceof Error
      ? combinedError.message
      : combinedError
        ? 'No se pudo cargar la informacion del calendario.'
        : null

  const filteredCasos = useMemo(() => {
    if (!casos) return []
    return casos.filter((caso) => {
      if (selectedEstudioId !== null) {
        return caso.estudio_id === selectedEstudioId
      }
      return true
    })
  }, [casos, selectedEstudioId])

  useEffect(() => {
    if (selectedCaso === 'all') return
    const currentSelectedId = Number(selectedCaso)
    if (!filteredCasos.some((caso) => caso.id === currentSelectedId)) {
      setSelectedCaso('all')
    }
  }, [filteredCasos, selectedCaso])

  const upcomingEvents = useMemo(() => {
    const now = new Date()
    const todayStart = startOfDay(now)

    return filteredEvents
      .filter((event) =>
        event.hasTime
          ? event.date.getTime() >= now.getTime()
          : startOfDay(event.date).getTime() >= todayStart.getTime(),
      )
      .slice(0, 5)
  }, [filteredEvents])

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, -1))
  }

  const handleNextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1))
  }

  const handleSelectDay = (day: Date) => {
    const normalizedDay = startOfDay(day)
    setSelectedDay(normalizedDay)

    if (
      normalizedDay.getFullYear() !== currentMonth.getFullYear() ||
      normalizedDay.getMonth() !== currentMonth.getMonth()
    ) {
      setCurrentMonth(getMonthStart(normalizedDay))
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">Calendario</h1>
        <p className="text-sm text-muted-foreground">
          Visualiza y organiza audiencias y compromisos segun tus estudios y casos.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <Card className="overflow-hidden">
          <CardHeader className="gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-primary/10 p-2 text-primary">
                    <CalendarIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <CardTitle>Vista mensual</CardTitle>
                    <CardDescription>Haz clic en cualquier dia para ver los detalles.</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={handlePrevMonth} aria-label="Mes anterior">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="text-sm font-medium uppercase text-muted-foreground">
                    {getMonthLabel(currentMonth)}
                  </div>
                  <Button variant="outline" size="icon" onClick={handleNextMonth} aria-label="Mes siguiente">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold uppercase text-muted-foreground">Estudio</span>
                  <Select value={selectedEstudio} onValueChange={setSelectedEstudio} disabled={loadingEstudios}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Todos los estudios" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estudios</SelectItem>
                      {(estudios ?? []).map((estudio) => (
                        <SelectItem key={estudio.id} value={String(estudio.id)}>
                          {estudio.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold uppercase text-muted-foreground">Caso</span>
                  <Select value={selectedCaso} onValueChange={setSelectedCaso} disabled={loadingCasos || filteredCasos.length === 0}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Todos los casos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los casos</SelectItem>
                      {filteredCasos.map((caso) => (
                        <SelectItem key={caso.id} value={String(caso.id)}>
                          {caso.numero_expediente}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {errorMessage && (
              <div className="flex items-start gap-3 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {isLoading ? (
              <div className="space-y-4">
                <div className="grid grid-cols-7 gap-2">
                  {DAY_LABELS.map((label) => (
                    <Skeleton key={label} className="h-6 rounded-md" />
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 42 }).map((_, index) => (
                    <Skeleton key={index} className="h-[110px] rounded-lg" />
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-7 gap-2 text-xs font-semibold uppercase text-muted-foreground">
                  {DAY_LABELS.map((label) => (
                    <div key={label} className="text-center tracking-wide">
                      {label}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((day) => {
                    const key = formatDayKey(day)
                    const isCurrentMonth = day.getMonth() === currentMonth.getMonth()
                    const isSelected = key === formatDayKey(selectedDay)
                    const isToday = key === todaysKey
                    const dayEvents = eventsByDay.get(key) ?? []

                    return (
                      <button
                        key={`${key}-${day.getMonth()}`}
                        type="button"
                        onClick={() => handleSelectDay(day)}
                        className={cn(
                          'flex h-[120px] flex-col gap-2 rounded-lg border p-2 text-left transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-1 overflow-hidden',
                          {
                            'bg-primary text-primary-foreground shadow-sm': isSelected,
                            'bg-muted/60 text-muted-foreground': !isSelected && !isCurrentMonth,
                            'ring-1 ring-primary': isToday && !isSelected,
                          },
                        )}
                      >
                        <div className="flex items-center justify-between gap-2 text-sm font-semibold">
                          <span>{day.getDate()}</span>
                          {dayEvents.length > 0 && (
                            <span
                              className={cn(
                                'text-xs font-medium',
                                isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground',
                              )}
                            >
                              {dayEvents.length} {dayEvents.length === 1 ? 'evento' : 'eventos'}
                            </span>
                          )}
                        </div>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map((event) => (
                            <div
                              key={`${event.type}-${event.id}-${event.caseId}`}
                              className={cn(
                                'truncate rounded-md px-2 py-1 text-xs font-medium',
                                getEventPillClasses(event, isSelected),
                              )}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div
                              className={cn(
                                'text-[11px] font-medium',
                                isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground',
                              )}
                            >
                              +{dayEvents.length - 2} mas
                            </div>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          

          <Card>
            <CardHeader>
              <CardTitle>Detalle del dia</CardTitle>
              <CardDescription>{formatLongDate(selectedDay)}</CardDescription>
            </CardHeader>
            <CardContent className="mt-2 space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <Skeleton key={index} className="h-[90px] rounded-lg" />
                  ))}
                </div>
              ) : eventsForSelectedDay.length === 0 ? (
                <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                  No hay eventos programados para este dia.
                </div>
              ) : (
                eventsForSelectedDay.map((event) => (
                  <div key={`${event.type}-${event.id}-${event.caseId}`} className="flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{event.estudioNombre}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                          <Clock className="h-3.5 w-3.5" />
                          {getEventTimeLabel(event)}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={cn('text-[11px] font-medium', EVENT_TYPE_META[event.type].badge)}
                        >
                          {getEventTypeLabel(event)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5" />
                        {event.caseNumber}
                      </span>
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {event.location}
                        </span>
                      )}
                    </div>
                    {event.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed">{event.description}</p>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Proximas actividades</CardTitle>
              <CardDescription >Resumen de los eventos filtrados a partir de hoy.</CardDescription>
            </CardHeader>
            <CardContent className="mt-2 space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-[80px] rounded-lg" />
                  ))}
                </div>
              ) : upcomingEvents.length === 0 ? (
                <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                  No hay proximas actividades registradas.
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={`${event.type}-${event.id}-${event.caseId}`} className="flex flex-col gap-3 rounded-lg border bg-card p-3 shadow-sm">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-foreground">{event.title}</p>
                          <p className="text-xs text-muted-foreground">{formatShortDate(event.date)}</p>
                          <Badge
                            variant="outline"
                            className={cn('text-[11px] font-medium', EVENT_TYPE_META[event.type].badge)}
                          >
                            {getEventTypeLabel(event)}
                          </Badge>
                        </div>
                        <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                          <Clock className="h-3.5 w-3.5" />
                          {getEventTimeLabel(event)}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3.5 w-3.5" />
                          {event.caseNumber}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {event.location ?? 'Sin ubicacion'}
                        </span>
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="h-3.5 w-3.5" />
                          {event.estudioNombre}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}























