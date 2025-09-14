export interface CasoRequest {
  numero: string;
  cliente: string;
  fecha_inicio: string; // YYYY-MM-DD format
  descripcion?: string | null;
}

export interface Caso {
  id: number;
  numero: string;
  cliente: string;
  fecha_inicio: string;
  descripcion?: string | null;
  estudio_id: number;
}

// Validaciones
export const isValidCaso = (data: CasoRequest): boolean => {
  return Boolean(
    data.numero &&
    data.numero.trim().length > 0 &&
    data.numero.trim().length <= 50 &&
    data.cliente &&
    data.cliente.trim().length > 0 &&
    data.cliente.trim().length <= 200 &&
    data.fecha_inicio &&
    isValidDate(data.fecha_inicio)
  );
};

export const isValidEquipoForCase = (equipo: string): boolean => {
  return Boolean(
    equipo &&
    equipo.trim().length > 0
  );
};

// Helper para validar formato de fecha
const isValidDate = (dateString: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  return date instanceof Date && !Number.isNaN(date.getTime());
};