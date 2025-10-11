const dateTimeFormatter = new Intl.DateTimeFormat('es-ES', {
  dateStyle: 'short',
  timeStyle: 'short',
})

/**
 * Normaliza una fecha proveniente del backend (ISO o formatos comunes)
 * y la convierte en un texto legible para el usuario.
 */
export const formatBackendDateTime = (value?: string | null) => {
  if (!value) {
    return '-'
  }

  const normalized = value.includes(' ') && !value.includes('T') ? value.replace(' ', 'T') : value
  const parsed = new Date(normalized)

  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return dateTimeFormatter.format(parsed)
}

