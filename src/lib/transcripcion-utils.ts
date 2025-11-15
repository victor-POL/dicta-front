import type { TranscripcionHistorial } from 'server/models/transcripcionModel'

const hardcodedNames: Record<string, string> = {
  "https://www.youtube.com/watch?v=s1xTNqNCm9c": "Alegato Querella CFK",
  "https://www.youtube.com/watch?v=G29eRY_xuW0": "Alegato Fiscalía",
  "https://www.youtube.com/watch?v=y3jkKQirDjU": "Alegato Defensa Sabag Montiel",
  "https://www.youtube.com/watch?v=LuvUKJUtb5o": "Alegato Defensa Carrizo y Defensa Brenda Uliarte",
  "https://www.youtube.com/watch?v=alwL5ZxFnC4": "TOCF N°6 - Causa Sabag Montiel",
  "https://www.youtube.com/watch?v=alwL5ZxFnC4&list=PLOBlyC5cDroE_fNXbg2GiLUN8yn76_or5": "TOCF N°6 - Causa Sabag Montiel",
  "https://www.youtube.com/watch?v=f15Xu0d_6Lw": "Testimonio Cristina Fernández de Kirchner"
}

export function obtenerNombreHardcodead(transcripcionHistorial: TranscripcionHistorial): string {
  const url = transcripcionHistorial.url ?? undefined;
  console.log("Mapping URL ", url, " to hardcoded name ", url ? hardcodedNames[url] : "undefined");
  return (url && hardcodedNames[url]) || transcripcionHistorial.nombre || "";
}
