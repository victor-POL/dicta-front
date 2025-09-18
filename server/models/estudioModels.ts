export interface EstudioRequest {
  nombre: string;
  direccion?: string | null;
  telefono?: string | null;
}

export interface EquipoRequest {
  nombre: string;
  descripcion?: string | null;
}

export interface UsuarioEquipo {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  rol: 'propietario' | 'miembro';
}

export interface Equipo {
  id: number;
  nombre: string;
  descripcion: string;
  usuarios: UsuarioEquipo[];
  fechaCreacion: string;
}

export interface Estudio {
  id: number;
  nombre: string;
  direccion?: string | null;
  telefono?: string | null;
  propietario_id: number;
  fecha_creacion: string;
  rol: string;
  propietario: {
    nombres: string;
    apellidos: string;
    email: string;
  };
  equipos: Equipo[];
}

// Validaciones
export const isValidEstudio = (data: EstudioRequest): boolean => {
  return Boolean(
    data.nombre &&
    data.nombre.trim().length > 0 &&
    data.nombre.trim().length <= 200
  );
};

export const isValidDireccion = (direccion?: string | null): boolean => {
  if (!direccion) return true; // Es opcional
  return direccion.trim().length <= 500;
};

export const isValidTelefono = (telefono?: string | null): boolean => {
  if (!telefono) return true; // Es opcional
  const phoneRegex = /^[\d\s\-+()]{7,20}$/;
  return phoneRegex.test(telefono.trim());
};

export const isValidNombreEquipo = (nombre: string): boolean => {
  return Boolean(nombre && nombre.trim().length > 0 && nombre.trim().length <= 200);
};

export const isValidDescripcionEquipo = (descripcion?: string | null): boolean => {
  if (!descripcion) return true; // Es opcional
  return descripcion.trim().length <= 500;
};