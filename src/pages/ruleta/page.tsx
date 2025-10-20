import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button_landing"
import { Card } from "@/components/ui/card_landing"
import { X } from "lucide-react"
import { Wheel } from "react-custom-roulette"
import "../landing/landing.css"

const prizes = [
  {
    option: "Contradicción",
    title: "Identificar contradicción",
    time: "30",
    description: "Se les da un párrafo y 30 segundos donde van a tener que identificar la contradicción",
    style: { backgroundColor: "#8b5cf6", textColor: "#ffffff" },
  },
  {
    option: "Preguntas",
    title: "Sugerir preguntas",
    time: "60",
    description:
      "Se les da un párrafo y 30 segundos donde van a tener que identificar la pregunta que mejor contexto agregue",
    style: { backgroundColor: "#ec4899", textColor: "#ffffff" },
  },
  {
    option: "Gracias por participar",
    title: "Gracias por participar",
    time: "0",
    description: "¡Gracias por participar en la ruleta de DICTA! Esperamos que hayas disfrutado de la experiencia.",
    style: { backgroundColor: "#1e40af", textColor: "#ffffff", fontSize: 14 },
  },
  {
    option: "Mapas",
    title: "Completar mapas conceptuales",
    time: "90",
    description: "Se les comparte un mapa incompleto y se le solicita al usuario indicar lo que falta",
    style: { backgroundColor: "#f59e0b", textColor: "#ffffff" },
  },
  {
    option: "Línea Tiempo",
    title: "Completar líneas de tiempo",
    time: "120",
    description: "Se les comparte una línea de tiempo y se le solicita al usuario indicar lo que falta",
    style: { backgroundColor: "#10b981", textColor: "#ffffff" },
  },
  {
    option: "Gracias por participar",
    title: "Gracias por participar",
    time: "0",
    description: "¡Gracias por participar en la ruleta de DICTA! Esperamos que hayas disfrutado de la experiencia.",
    style: { backgroundColor: "#1e40af", textColor: "#ffffff", fontSize: 14 },
  },
  {
    option: "Hablantes",
    title: "Identificar hablantes",
    time: "45",
    description: "Asigna quién dijo cada intervención según el contenido.",
    style: { backgroundColor: "#0ea5e9", textColor: "#ffffff" },
  },
  {
    option: "Sobre DICTA",
    title: "Preguntas de DICTA",
    time: "10",
    description: "Que hable del funcionamiento de DICTA, basándose en el folleto",
    style: { backgroundColor: "#6366f1", textColor: "#ffffff" },
  },
  {
    option: "Gracias por participar",
    title: "Gracias por participar",
    time: "0",
    description: "¡Gracias por participar en la ruleta de DICTA! Esperamos que hayas disfrutado de la experiencia.",
    style: { backgroundColor: "#1e40af", textColor: "#ffffff", fontSize: 14 },
  },
]

const dictaQuestions = [
  {
    question: "¿Qué hace DICTA?",
    answer: "Transcribe audiencias automáticamente."
  },
  {
    question: "¿Qué tipo de inteligencia usa DICTA?",
    answer: "Inteligencia Artificial."
  },
  {
    question: "¿DICTA entiende lo que dicen las personas?",
    answer: "Sí, analiza el significado de las palabras."
  },
  {
    question: "¿DICTA puede reconocer quién habla?",
    answer: "Sí, identifica a los hablantes."
  },
  {
    question: "¿DICTA necesita un humano para escribir todo?",
    answer: "No, lo hace de forma automática."
  },
  {
    question: "¿Dónde se usa principalmente DICTA?",
    answer: "En el ámbito judicial."
  },
  {
    question: "¿DICTA puede detectar emociones o tono de voz?",
    answer: "Sí, puede hacerlo."
  },
  {
    question: "¿DICTA genera informes al final de una audiencia?",
    answer: "Sí, crea resúmenes automáticos."
  },
  {
    question: "¿Para quién está pensada DICTA?",
    answer: "Para auxiliares de la justicia, jueces, abogados, estudiantes, etc"
  }
]

const timelineGames = [
  {
    title: "El accidente de la esquina",
    dialogues: `JUEZ: Vamos a comenzar la audiencia por el siniestro ocurrido en la intersección de Belgrano y Mitre. Señor Ramírez, ¿puede contar lo sucedido?

RAMÍREZ (conductor del auto): Yo iba por Belgrano con el semáforo en verde. De repente, la moto apareció de la nada y no tuve tiempo de frenar.

JUEZ: ¿A qué velocidad circulaba?

RAMÍREZ: Unos 45 kilómetros por hora, más o menos.

TESTIGO 1 (peatón): Yo cruzaba la calle Mitre. Vi que la moto venía rápido, y justo antes de llegar al cruce el semáforo cambió. El motociclista aceleró igual.

ABOGADA DE LA VÍCTIMA: Mi cliente sufrió fractura en una pierna y todavía está en rehabilitación. El señor Ramírez no detuvo su vehículo hasta después de impactar.

MOTOCICLISTA (víctima): Yo tenía luz amarilla, y pensé que alcanzaba a pasar. Cuando me di cuenta, el auto ya estaba encima mío.

TESTIGO 2 (comerciante): Escuché el golpe y salí del local. La moto estaba tirada a unos tres metros del auto. Llamamos a la ambulancia enseguida.

POLICÍA (perito vial): Los registros muestran huellas de frenado del automóvil de unos 4 metros. El semáforo de Belgrano estaba en verde en ese momento.

JUEZ: Queda cerrado el debate. El tribunal analizará las pruebas.`,
    timeline: [
      "El semáforo cambia a amarillo en la calle Mitre",
      "El auto de Ramírez avanza con luz verde por Belgrano",
      "La moto entra al cruce sin detenerse",
      "El auto impacta a la moto en la intersección",
      "La moto cae y el conductor resulta herido",
      "Los testigos y vecinos llaman a la ambulancia",
      "La policía llega y realiza las pericias"
    ]
  },
  {
    title: "El robo en la tienda de electrónica",
    dialogues: `JUEZ: Damos inicio a la audiencia por el robo ocurrido en la tienda "TecnoShop" el 14 de abril.

DUEÑO: Cuando llegué a la mañana, encontré la puerta forzada y el mostrador vacío.

JUEZ: ¿Llamó a la policía?

DUEÑO: Sí, inmediatamente, a las ocho menos cuarto.

POLICÍA: Cuando arribamos, el local estaba cerrado pero sin alarma activa. Relevamos huellas en la caja registradora y encontramos una mochila abandonada.

ABOGADO DEFENSOR: Mi cliente afirma que estaba afuera del local, no dentro.

ACUSADO: Yo pasé por la vereda, vi la puerta abierta y entré a mirar. No rompí nada.

TESTIGO 1 (vecino): Yo lo vi a él (señala al acusado) frente a la tienda como a las tres de la mañana, fumando. Después escuché un golpe fuerte.

TESTIGO 2 (repartidor): A las siete y media vi la persiana levantada a medias. Pensé que estaban abriendo, pero no vi a nadie.

POLICÍA: Las cámaras muestran al acusado empujando la persiana a las 3:12 y saliendo con una caja.

JUEZ: Se cierra la audiencia. Las pruebas quedarán bajo análisis.`,
    timeline: [
      "El acusado se encuentra frente al local alrededor de las 3:00 AM",
      "Se escucha un golpe fuerte: el acusado fuerza la persiana",
      "Robo: el acusado entra, toma una caja y se retira (3:12 AM)",
      "El repartidor pasa a las 7:30 y ve la persiana levantada",
      "El dueño llega cerca de las 8:00, ve la puerta forzada y llama a la policía",
      "La policía arriba, encuentra huellas y una mochila",
      "El acusado es detenido y declara que solo 'entró a mirar'"
    ]
  },
  {
    title: "La filtración del departamento",
    dialogues: `JUEZ: Damos inicio a la audiencia entre la señora Méndez y el consorcio del edificio por filtraciones de agua en su vivienda.

ABOGADA DE MÉNDEZ: Mi clienta sufrió daños en el techo de su habitación y en varios muebles debido a una pérdida proveniente del piso superior.

ADMINISTRADOR DEL CONSORCIO: Cuando me avisó, ya habían pasado varios días. Yo no soy plomero, llamé a uno al día siguiente.

VECINO DEL PISO SUPERIOR: Me enteré del problema porque vino el plomero. Después vi que la junta del caño principal estaba fisurada.

JUEZ: ¿Quién pagó la reparación?

ADMINISTRADOR: El consorcio, pero la señora exigió también una compensación por los muebles dañados.

TESTIGO (amiga de Méndez): Fui a su casa una tarde y el techo estaba completamente manchado. Ella me mostró fotos del agua cayendo desde la lámpara.

ABOGADA DEL CONSORCIO: La pérdida se originó en una cañería vieja del edificio, pero fue un daño accidental.

MÉNDEZ: Estuve una semana con baldes en el piso. Avisé al encargado el primer día que empezó la gotera y no vino nadie.

PERITO: El informe técnico indica humedad acumulada durante varios días antes de la reparación.

JUEZ: Se cierra la audiencia. El tribunal deliberará sobre los daños reclamados.`,
    timeline: [
      "Se fisura la junta del caño principal en el piso superior",
      "Comienzan las filtraciones en el techo del departamento de Méndez",
      "Méndez avisa al encargado y coloca baldes para contener el agua",
      "Pasan varios días sin respuesta del consorcio",
      "El administrador contrata a un plomero para reparar la pérdida",
      "El plomero repara la cañería y notifica al vecino",
      "Méndez reclama compensación por daños a sus muebles"
    ]
  }
]

const mapGames = [
  {
    title: "El choque del puente",
    text: `Una mañana de julio, una camioneta perdió el control al cruzar el puente de la avenida Costanera. El vehículo se desvió hacia el carril contrario e impactó contra un auto que venía de frente.
El conductor del auto, el señor Figueroa, sufrió heridas leves, mientras que la conductora de la camioneta, la señora Duarte, resultó ilesa.
Durante la audiencia, Duarte explicó que había intentado esquivar un perro que cruzó la calle repentinamente.
Sin embargo, el testigo que esperaba el colectivo afirmó que no había ningún animal, sino que la conductora estaba usando su celular al momento del accidente.
El perito vial confirmó que no se encontraron huellas de frenado y que el pavimento estaba seco.
Finalmente, el juez determinó que la distracción por el uso del celular fue la causa principal del siniestro y ordenó una multa y la suspensión de la licencia por seis meses.`,
    incompleteMap: "Accidente → (____) → Choque → (____) → Testimonios → (____) → Fallo del juez",
    completeMap: "Accidente → Distracción → Choque → Peritaje → Testimonios → Sanción → Fallo del juez"
  },
  {
    title: "El paquete extraviado",
    text: `La señora López compró un teléfono celular por internet y contrató el envío a su domicilio mediante una empresa de mensajería.
Pasaron diez días y el paquete nunca llegó. Al comunicarse con la empresa, le informaron que el envío figuraba como entregado, aunque ella nunca lo recibió.
Durante la audiencia, el repartidor declaró que había dejado el paquete "en la puerta", porque nadie respondió al timbre.
El portero del edificio, sin embargo, dijo que ese día el timbre no funcionaba y que no vio ningún paquete en el ingreso.
La empresa argumentó que su protocolo se había cumplido, pero el perito técnico revisó el sistema de cámaras y comprobó que el mensajero no había ingresado al edificio.
Finalmente, el juez determinó que hubo negligencia en la entrega y ordenó a la empresa reembolsar el valor del producto más una compensación por los inconvenientes causados.`,
    incompleteMap: "Compra → (____) → Paquete extraviado → (____) → Pruebas → (____) → Fallo del juez",
    completeMap: "Compra → Envío fallido → Paquete extraviado → Negligencia comprobada → Pruebas → Reembolso → Fallo del juez"
  },
  {
    title: "El robo en la panadería",
    text: `Una madrugada de agosto, una panadería del centro fue violentada: la puerta trasera estaba forzada y faltaba dinero de la caja.
La dueña, al llegar, encontró vidrios rotos y avisó de inmediato a la policía.
Durante la audiencia, el oficial a cargo explicó que la alarma del local nunca se activó porque el sensor estaba cubierto con cinta adhesiva.
El acusado, un ex empleado, negó haber estado allí, pero una cámara de seguridad del edificio vecino registró a una persona con su misma contextura ingresando por la parte trasera del local alrededor de las 3:20 a.m.
El perito en huellas digitales informó que se encontraron parciales coincidentes con el ex empleado en la puerta del depósito.
Además, la fiscalía presentó mensajes de texto donde el acusado reclamaba su pago atrasado el día anterior al robo.
El juez consideró que existía intención y premeditación, y dictó una pena de prisión en suspenso por robo simple.`,
    incompleteMap: "Conflicto laboral → (____) → Robo → (____) → Evidencias → (____) → Sentencia",
    completeMap: "Conflicto laboral → Despido y enojo → Robo → Investigación policial → Evidencias → Prueba concluyente → Sentencia"
  }
]

// Juego: Identificar Hablantes
const speakerGames = [
  {
    title: "Reclamo por ruido nocturno",
    speakers: ["JUEZ", "VECINA (Sosa)", "ADMINISTRADOR", "DENUNCIADO (Pablo)"],
    dialoguesAnon: `INTERVINIENTE: Buen día. Se abre la audiencia por ruidos molestos.
INTERVINIENTE: Desde hace tres meses hay música fuerte después de las 23. Tengo videos y el acta del portero.
INTERVINIENTE: Recibimos tres reclamos formales y dos notificaciones al propietario del dpto. 5B.
INTERVINIENTE: Los fines de semana hago reuniones, pero nunca después de medianoche. Una sola vez fue el cumpleaños de mi hermano.
INTERVINIENTE: En el video del 12/08 se escuchan decibeles altos a las 01:15. Coincide con el 5B.
INTERVINIENTE: Ese día yo no estaba en el departamento.`,
    dialoguesSolved: `JUEZ: Buen día. Se abre la audiencia por ruidos molestos.
VECINA (Sosa): Desde hace tres meses hay música fuerte después de las 23. Tengo videos y el acta del portero.
ADMINISTRADOR: Recibimos tres reclamos formales y dos notificaciones al propietario del dpto. 5B.
DENUNCIADO (Pablo): Los fines de semana hago reuniones, pero nunca después de medianoche. Una sola vez fue el cumpleaños de mi hermano.
ADMINISTRADOR: En el video del 12/08 se escuchan decibeles altos a las 01:15. Coincide con el 5B.
DENUNCIADO (Pablo): Ese día yo no estaba en el departamento.`
  },
  {
    title: "Disputa por alquiler",
    speakers: ["JUEZ", "PROPIETARIA (Gómez)", "INQUILINO (Rivero)", "ADMINISTRADOR"],
    dialoguesAnon: `INTERVINIENTE: Se abre la audiencia por reclamo de deuda locativa.
INTERVINIENTE: El inquilino adeuda dos meses y el pago de expensas; traigo los avisos enviados.
INTERVINIENTE: El depósito debía cubrir una parte y la inmobiliaria nunca lo imputó.
INTERVINIENTE: Consta en el sistema del consorcio que hubo dos intimaciones por expensas impagas.
INTERVINIENTE: La cláusula 7 prevé intereses por mora y actualización.
INTERVINIENTE: Yo envié un comprobante por mail; pido que lo verifiquen.`,
    dialoguesSolved: `JUEZ: Se abre la audiencia por reclamo de deuda locativa.
PROPIETARIA (Gómez): El inquilino adeuda dos meses y el pago de expensas; traigo los avisos enviados.
INQUILINO (Rivero): El depósito debía cubrir una parte y la inmobiliaria nunca lo imputó.
ADMINISTRADOR: Consta en el sistema del consorcio que hubo dos intimaciones por expensas impagas.
JUEZ: La cláusula 7 prevé intereses por mora y actualización.
INQUILINO (Rivero): Yo envié un comprobante por mail; pido que lo verifiquen.`
  },
  {
    title: "Colisión en avenida Santa Fe",
    speakers: ["JUEZ", "CONDUCTOR AUTO (Molina)", "MOTOCICLISTA (Rojas)", "PERITO VIAL"],
    dialoguesAnon: `INTERVINIENTE: Iniciamos la audiencia por colisión en la intersección de Santa Fe y Pueyrredón.
INTERVINIENTE: Yo iba por el carril derecho con luz verde; la moto se me cruzó.
INTERVINIENTE: El auto dobló sin señalizar; yo tenía paso.
INTERVINIENTE: El relevamiento muestra huellas de frenado del auto de 3 metros y pavimento seco.
INTERVINIENTE: ¿Hubo giro permitido en esa esquina a esa hora?
INTERVINIENTE: El giro a la izquierda está prohibido en horario pico.`,
    dialoguesSolved: `JUEZ: Iniciamos la audiencia por colisión en la intersección de Santa Fe y Pueyrredón.
CONDUCTOR AUTO (Molina): Yo iba por el carril derecho con luz verde; la moto se me cruzó.
MOTOCICLISTA (Rojas): El auto dobló sin señalizar; yo tenía paso.
PERITO VIAL: El relevamiento muestra huellas de frenado del auto de 3 metros y pavimento seco.
JUEZ: ¿Hubo giro permitido en esa esquina a esa hora?
PERITO VIAL: El giro a la izquierda está prohibido en horario pico.`
  }
]

const questionGames = [
  {
    title: "El contrato sin firma",
    text: `Durante la audiencia civil entre la empresa LogiTrans y el señor Romero, se discutió la validez de un contrato de prestación de servicios.
Romero aseguró haber trabajado durante seis meses realizando traslados para la empresa, pero sin haber firmado ningún documento.
El representante de LogiTrans reconoció que hubo una "propuesta informal", pero afirmó que no existía contrato escrito ni pago pendiente.
Romero presentó correos electrónicos donde se hablaba de "fechas de entrega" y "bonificaciones por cumplimiento", pero no se aclaró quién los envió ni si provenían de un directivo autorizado.
El juez señaló que los mensajes no especificaban montos ni plazos concretos, y que faltaba información clave para determinar la existencia de un acuerdo válido.`,
    options: [
      "¿Qué tipo de transporte realizaba el señor Romero durante esos seis meses?",
      "¿Quién fue la persona que envió los correos mencionados por Romero?",
      "¿En qué ciudad estaba ubicada la sede de LogiTrans?"
    ],
    correctAnswer: 1,
    explanation: "Esta pregunta agrega contexto relevante porque identificar al emisor de los correos ayudaría a determinar si existe autoridad y validez en la propuesta de contrato."
  },
  {
    title: "El accidente del cruce",
    text: `Durante la audiencia, se analizó la colisión entre una moto y un automóvil en el cruce de las calles Rivadavia y 9 de Julio.
El conductor del auto, el señor Álvarez, declaró que la moto se cruzó sin mirar, mientras que la motociclista, la señora Jiménez, afirmó que el semáforo estaba en verde para ella.
Un testigo que se encontraba en la vereda aseguró haber visto "las dos luces encendidas al mismo tiempo", pero no explicó a qué distancia estaba ni desde qué ángulo observó.
El informe policial mencionó condiciones de lluvia, pero no detalló la visibilidad ni si había marcas de frenado en el pavimento.
El juez interrumpió la audiencia al notar que faltaban datos técnicos para determinar quién tenía prioridad de paso.`,
    options: [
      "¿Cuánto tiempo hace que ambos conductores tienen licencia de conducir?",
      "¿Desde qué lugar exacto observó el testigo el accidente?",
      "¿De qué color era la moto de la señora Jiménez?"
    ],
    correctAnswer: 1,
    explanation: "Esta pregunta agrega contexto visual clave porque la ubicación y ángulo del testigo determina la credibilidad y validez de su testimonio sobre los semáforos."
  },
  {
    title: "El despido en la obra",
    text: `Durante la audiencia laboral, el señor Cáceres afirmó haber sido despedido sin causa de la empresa constructora UrbanEdil S.A., donde trabajó como albañil durante ocho meses.
Explicó que el capataz le comunicó "verbalmente" que no debía presentarse más, sin recibir indemnización ni carta documento.
La abogada de la empresa sostuvo que Cáceres era trabajador eventual y que su vínculo había terminado "por finalización de obra".
Sin embargo, no se presentaron documentos que acreditaran el contrato eventual, ni registros de finalización.
El testigo propuesto por Cáceres dijo que ambos trabajaban "todos los días, incluso los sábados", y que realizaban tareas idénticas a los empleados permanentes.
El juez advirtió que faltaban pruebas para determinar la modalidad real de contratación y solicitó más información antes de dictar sentencia.`,
    options: [
      "¿Qué tipo de herramientas utilizaban los albañiles durante la jornada?",
      "¿Quién pagaba el salario del señor Cáceres y cómo se registraban las horas trabajadas?",
      "¿Qué color tenían los cascos de seguridad en la obra?"
    ],
    correctAnswer: 1,
    explanation: "Esta pregunta aporta contexto sobre la relación laboral real, ya que la forma de pago y registro de horas ayuda a determinar si era empleado permanente o eventual."
  }
]

const contradictionGames = [
  {
    title: "El celular perdido",
    dialogues: `JUEZ: Vamos a escuchar las declaraciones sobre la pérdida del teléfono en la oficina.
SECRETARIA: El celular desapareció el lunes por la tarde, después de la reunión.
ACUSADO (Martín): Yo me fui antes de la reunión, a eso de las tres. No vi ningún celular en la mesa.
TESTIGO 1 (Laura): Martín estuvo en la reunión hasta las cuatro. Incluso usó su celular para mostrar un mensaje.
TESTIGO 2 (Carlos): Recuerdo que el teléfono de la secretaria estaba sobre la mesa, pero cuando todos se fueron, solo quedaba Martín ordenando unos papeles.
ACUSADO: No, yo no toqué nada. Además, ese día me fui en auto con Laura, ella puede decirlo.
LAURA: No, yo me fui caminando con Carlos; Martín se quedó cerrando la sala.
POLICÍA: El celular fue hallado al día siguiente en la mochila de Martín, junto con documentos de la reunión.
JUEZ: Bien, las declaraciones quedarán registradas para su análisis.`,
    contradictions: [
      "Martín afirma que se fue antes de la reunión (a las 3), pero Laura dice que estuvo hasta las 4 y mostró su celular.",
      "Martín dice que se fue en auto con Laura, pero Laura lo contradice y dice que se fue caminando con Carlos."
    ]
  },
  {
    title: "El florero roto",
    dialogues: `JUEZ: Estamos reunidos para esclarecer cómo se rompió el florero de la señora Torres durante la cena familiar.
SEÑORA TORRES: El florero estaba sobre la mesa del comedor. Escuché un golpe y lo vi en el piso, hecho pedazos.
HIJO (Lucas): Yo estaba en la cocina preparando postre cuando escuché el ruido. No vi nada.
SOBRINA (Ana): Lucas estaba en el living cuando el florero cayó. Estaba jugando con una pelota pequeña.
LUCAS: No, yo no tenía ninguna pelota. Además, el gato estaba sobre la mesa justo antes de que se rompiera.
ANA: El gato estaba en el sillón dormido, lo vi todo el tiempo.
VECINO: Desde mi ventana vi que el florero se cayó cuando alguien golpeó la mesa con el brazo.
JUEZ: Tomaremos nota de cada versión para el informe.`,
    contradictions: [
      "Lucas dice que estaba en la cocina, pero Ana asegura que estaba en el living jugando con una pelota.",
      "Lucas culpa al gato (\"estaba sobre la mesa\"), pero Ana dice que el gato estaba dormido en el sillón."
    ]
  },
  {
    title: "El robo del reloj",
    dialogues: `JUEZ: Iniciamos la audiencia sobre el robo del reloj del señor Pérez, ocurrido el jueves pasado en su oficina.
PÉREZ: Salí a almorzar a las 13:00 y dejé el reloj sobre mi escritorio. Cuando regresé, a las 14:00, ya no estaba.
ASISTENTE (Carla): Yo entré a la oficina a la una y cuarto para dejar unos documentos, y el reloj todavía estaba allí.
GUARDIA: Revisé las cámaras y vi a Carla entrar a las 12:50, no a la una y cuarto.
CARLA: Imposible, porque a las 12:50 yo estaba en la cafetería con Tomás.
TOMÁS: Sí, estuvimos tomando café, pero creo que era más cerca de la una y media.
GUARDIA: No, a esa hora ya la vi salir del edificio.
PÉREZ: Lo único que sé es que nadie más tiene llave de mi oficina.
JUEZ: Bien, quedarán registradas las declaraciones para el análisis.`,
    contradictions: [
      "Carla dice que entró a las 13:15, pero el guardia afirma que fue a las 12:50.",
      "Carla sostiene que estaba en la cafetería a las 12:50, mientras Tomás dice que fue más cerca de las 13:30."
    ]
  }
]

// Función helper para formatear diálogos con nombres en negrita
const formatDialogues = (text: string) => {
  return text.split('\n').map((line, index) => {
    // Buscar patrón: NOMBRE (opcional: descripción): texto
    const match = line.match(/^([A-ZÁÉÍÓÚÑÜ][A-ZÁÉÍÓÚÑÜ\s]*(?:\([^)]*\))?):(.*)/)
    if (match) {
      const [, speaker, dialogue] = match
      return (
        <div key={index} className="mb-2">
          <span className="font-bold">{speaker}:</span>
          <span>{dialogue}</span>
        </div>
      )
    }
    return <div key={index} className="mb-2">{line}</div>
  })
}

export default function RuletaPage() {
  const [mustSpin, setMustSpin] = useState(false)
  const [prizeNumber, setPrizeNumber] = useState(0)
  const [winner, setWinner] = useState<string | null>(null)
  const [winnerColor, setWinnerColor] = useState<string>("")
  const [showModal, setShowModal] = useState(false)
  
  // Estados para el juego de DICTA
  const [showDictaGame, setShowDictaGame] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<{question: string, answer: string} | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  
  // Estados para el juego de línea de tiempo
  const [showTimelineGame, setShowTimelineGame] = useState(false)
  const [currentTimelineGame, setCurrentTimelineGame] = useState<{title: string, dialogues: string, timeline: string[]} | null>(null)
  const [timelineTimeLeft, setTimelineTimeLeft] = useState(0)
  const [showTimelineAnswer, setShowTimelineAnswer] = useState(false)

  // Estados para el juego de mapas conceptuales
  const [showMapGame, setShowMapGame] = useState(false)
  const [currentMapGame, setCurrentMapGame] = useState<{title: string, text: string, incompleteMap: string, completeMap: string} | null>(null)
  const [mapTimeLeft, setMapTimeLeft] = useState(0)
  const [showMapAnswer, setShowMapAnswer] = useState(false)

  // Estados para el juego de contradicciones
  const [showContradictionGame, setShowContradictionGame] = useState(false)
  const [currentContradictionGame, setCurrentContradictionGame] = useState<{title: string, dialogues: string, contradictions: string[]} | null>(null)
  const [contradictionTimeLeft, setContradictionTimeLeft] = useState(0)
  const [showContradictionAnswer, setShowContradictionAnswer] = useState(false)

  // Estados para el juego de preguntas
  const [showQuestionGame, setShowQuestionGame] = useState(false)
  const [currentQuestionGame, setCurrentQuestionGame] = useState<{title: string, text: string, options: string[], correctAnswer: number, explanation: string} | null>(null)
  const [questionTimeLeft, setQuestionTimeLeft] = useState(0)
  const [showQuestionAnswer, setShowQuestionAnswer] = useState(false)

  // Estados para el juego de hablantes
  const [showSpeakerGame, setShowSpeakerGame] = useState(false)
  const [currentSpeakerGame, setCurrentSpeakerGame] = useState<{
    title: string,
    speakers: string[],
    dialoguesAnon: string,
    dialoguesSolved: string
  } | null>(null)
  const [speakerTimeLeft, setSpeakerTimeLeft] = useState(0)
  const [showSpeakerAnswer, setShowSpeakerAnswer] = useState(false)
  const [showSpeakerContent, setShowSpeakerContent] = useState(false)

  // Estados para mostrar contenido anterior en los juegos
  const [showTimelineContent, setShowTimelineContent] = useState(false)
  const [showMapContent, setShowMapContent] = useState(false)
  const [showContradictionContent, setShowContradictionContent] = useState(false)
  const [showQuestionContent, setShowQuestionContent] = useState(false)

  const spinWheel = () => {
    if (mustSpin) return

    const newPrizeNumber = Math.floor(Math.random() * prizes.length)
    setPrizeNumber(newPrizeNumber)
    setMustSpin(true)
    setWinner(null)
    setWinnerColor("")
    setShowModal(false)
  }

  const triggerConfetti = async () => {

    const confetti = (await import("canvas-confetti")).default

    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)
  }

  const handleStopSpinning = () => {
    setMustSpin(false)
    setWinner(prizes[prizeNumber].title)
    setWinnerColor(prizes[prizeNumber].style.backgroundColor)
    setShowModal(true)
    triggerConfetti()
  }

  const startDictaGame = () => {
    const randomQuestion = dictaQuestions[Math.floor(Math.random() * dictaQuestions.length)]
    setCurrentQuestion(randomQuestion)
    setTimeLeft(parseInt(prizes[prizeNumber].time))
    setShowAnswer(false)
    setShowModal(false)
    setShowDictaGame(true)
  }

  const handleShowAnswer = () => {
    setShowAnswer(true)
  }

  const handleEndDictaGame = () => {
    setShowDictaGame(false)
    setCurrentQuestion(null)
    setTimeLeft(0)
    setShowAnswer(false)
  }

  const startTimelineGame = () => {
    const randomTimelineGame = timelineGames[Math.floor(Math.random() * timelineGames.length)]
    setCurrentTimelineGame(randomTimelineGame)
    setTimelineTimeLeft(parseInt(prizes[prizeNumber].time))
    setShowTimelineAnswer(false)
    setShowModal(false)
    setShowTimelineGame(true)
  }

  const handleShowTimelineAnswer = () => {
    setShowTimelineAnswer(true)
  }

  const handleEndTimelineGame = () => {
    setShowTimelineGame(false)
    setCurrentTimelineGame(null)
    setTimelineTimeLeft(0)
    setShowTimelineAnswer(false)
    setShowTimelineContent(false)
  }

  const startMapGame = () => {
    const randomMapGame = mapGames[Math.floor(Math.random() * mapGames.length)]
    setCurrentMapGame(randomMapGame)
    setMapTimeLeft(parseInt(prizes[prizeNumber].time))
    setShowMapAnswer(false)
    setShowMapContent(false)
    setShowModal(false)
    setShowMapGame(true)
  }

  const handleShowMapAnswer = () => {
    setShowMapAnswer(true)
  }

  const handleEndMapGame = () => {
    setShowMapGame(false)
    setCurrentMapGame(null)
    setMapTimeLeft(0)
    setShowMapAnswer(false)
    setShowMapContent(false)
  }

  const startContradictionGame = () => {
    const randomContradictionGame = contradictionGames[Math.floor(Math.random() * contradictionGames.length)]
    setCurrentContradictionGame(randomContradictionGame)
    setContradictionTimeLeft(parseInt(prizes[prizeNumber].time))
    setShowContradictionAnswer(false)
    setShowContradictionContent(false)
    setShowModal(false)
    setShowContradictionGame(true)
  }

  const handleShowContradictionAnswer = () => {
    setShowContradictionAnswer(true)
  }

  const handleEndContradictionGame = () => {
    setShowContradictionGame(false)
    setCurrentContradictionGame(null)
    setContradictionTimeLeft(0)
    setShowContradictionAnswer(false)
    setShowContradictionContent(false)
  }

  const startQuestionGame = () => {
    const randomQuestionGame = questionGames[Math.floor(Math.random() * questionGames.length)]
    setCurrentQuestionGame(randomQuestionGame)
    setQuestionTimeLeft(parseInt(prizes[prizeNumber].time))
    setShowQuestionAnswer(false)
    setShowQuestionContent(false)
    setShowModal(false)
    setShowQuestionGame(true)
  }

  const handleShowQuestionAnswer = () => {
    setShowQuestionAnswer(true)
  }

  const handleEndQuestionGame = () => {
    setShowQuestionGame(false)
    setCurrentQuestionGame(null)
    setQuestionTimeLeft(0)
    setShowQuestionAnswer(false)
    setShowQuestionContent(false)
  }

  // Hablantes: iniciar, mostrar respuesta y finalizar
  const startSpeakerGame = () => {
    const randomSpeakerGame = speakerGames[Math.floor(Math.random() * speakerGames.length)]
    setCurrentSpeakerGame(randomSpeakerGame)
    setSpeakerTimeLeft(parseInt(prizes[prizeNumber].time))
    setShowSpeakerAnswer(false)
    setShowSpeakerContent(false)
    setShowModal(false)
    setShowSpeakerGame(true)
  }

  const handleShowSpeakerAnswer = () => {
    setShowSpeakerAnswer(true)
  }

  const handleEndSpeakerGame = () => {
    setShowSpeakerGame(false)
    setCurrentSpeakerGame(null)
    setSpeakerTimeLeft(0)
    setShowSpeakerAnswer(false)
    setShowSpeakerContent(false)
  }

  useEffect(() => {
    if (showModal || showDictaGame || showTimelineGame || showMapGame || showContradictionGame || showQuestionGame || showSpeakerGame) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [showModal, showDictaGame, showTimelineGame, showMapGame, showContradictionGame, showQuestionGame, showSpeakerGame])

  // Cronómetro para el juego de DICTA
  useEffect(() => {
    let interval: number | null = null
    
    if (showDictaGame && timeLeft > 0 && !showAnswer) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setShowAnswer(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [showDictaGame, timeLeft, showAnswer])

  // Cronómetro para el juego de línea de tiempo
  useEffect(() => {
    let interval: number | null = null
    
    if (showTimelineGame && timelineTimeLeft > 0 && !showTimelineAnswer) {
      interval = setInterval(() => {
        setTimelineTimeLeft((prev) => {
          if (prev <= 1) {
            setShowTimelineAnswer(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [showTimelineGame, timelineTimeLeft, showTimelineAnswer])

  // Cronómetro para el juego de mapas conceptuales
  useEffect(() => {
    let interval: number | null = null
    
    if (showMapGame && mapTimeLeft > 0 && !showMapAnswer) {
      interval = setInterval(() => {
        setMapTimeLeft((prev) => {
          if (prev <= 1) {
            setShowMapAnswer(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [showMapGame, mapTimeLeft, showMapAnswer])

  // Cronómetro para el juego de contradicciones
  useEffect(() => {
    let interval: number | null = null
    
    if (showContradictionGame && contradictionTimeLeft > 0 && !showContradictionAnswer) {
      interval = setInterval(() => {
        setContradictionTimeLeft((prev) => {
          if (prev <= 1) {
            setShowContradictionAnswer(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [showContradictionGame, contradictionTimeLeft, showContradictionAnswer])

  // Cronómetro para el juego de preguntas
  useEffect(() => {
    let interval: number | null = null
    
    if (showQuestionGame && questionTimeLeft > 0 && !showQuestionAnswer) {
      interval = setInterval(() => {
        setQuestionTimeLeft((prev) => {
          if (prev <= 1) {
            setShowQuestionAnswer(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [showQuestionGame, questionTimeLeft, showQuestionAnswer])

  // Cronómetro para el juego de hablantes
  useEffect(() => {
    let interval: number | null = null
    if (showSpeakerGame && speakerTimeLeft > 0 && !showSpeakerAnswer) {
      interval = setInterval(() => {
        setSpeakerTimeLeft((prev) => {
          if (prev <= 1) {
            setShowSpeakerAnswer(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [showSpeakerGame, speakerTimeLeft, showSpeakerAnswer])

  return (
    <div className="dicta-landing min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* Header */}
      

      {/* Sección principal: siempre visible en viewport */}
      <div className="flex flex-col justify-center items-center text-center py-4 mt-20">
        <div className="space-y-4 mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground text-balance">
            ¡Girá la Ruleta, Jugá y Ganá!
          </h1>
          {/* <p className="text-base md:text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Prueba tu suerte y descubre qué premio te espera. Cada giro es una oportunidad única.
            </p> */}
        </div>

        <div className="flex justify-center mb-30 mt-20">
          <div className="transform scale-165 origin-center my-16">
            <Wheel
              mustStartSpinning={mustSpin}
              prizeNumber={prizeNumber}
              data={prizes}
              onStopSpinning={handleStopSpinning}
              outerBorderColor="#000000"
              outerBorderWidth={12}
              innerBorderColor="#000000"
              innerBorderWidth={6}
              radiusLineColor="#000000"
              radiusLineWidth={3}
              fontSize={20}
              textDistance={60}
              spinDuration={0.5}
            />
          </div>
        </div>

        {/* Spin Button */}
        <div>
          <Button size="lg" onClick={spinWheel} disabled={mustSpin} className="text-[6rem] md:text-[8rem] px-48 py-40 h-auto font-bold min-w-[75px] md:min-w-[300px] min-h-[75px]">
            {mustSpin ? "GIRANDO..." : "¡GIRAR!"}
          </Button>
        </div>
      </div>

 

      {/* Winner Modal Popup */}
      {showModal && winner && (
        <div className="fixed inset-0 z-50 animate-in fade-in duration-300">
          {/* Fondo negro con opacidad */}
          <div className="absolute inset-0 bg-black/50" />
          
          {/* Contenido del modal */}
          <div className="relative flex items-center justify-center min-h-full p-4">
            <Card
            className="relative max-w-lg w-full p-8 border-4 animate-in zoom-in-95 duration-500 shadow-2xl"
            style={{
              backgroundColor: winnerColor,
              borderColor: winnerColor,
            }}
          >
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-6 text-center">
              <div className="text-6xl">🎉</div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-white">¡Felicitaciones! Te toco jugar a:</p>
                <h2 className="text-3xl md:text-4xl font-bold text-white">{winner}</h2>
              </div>
              <p className="text-lg text-white/95 leading-relaxed">{prizes[prizeNumber].description}</p>
              <div className="pt-4 border-t border-white/20">
                <p className="text-sm text-white/90">Tenés {prizes[prizeNumber].time} segundos para responder..</p>
              </div>
              <Button
                onClick={() => {
                  if (prizes[prizeNumber].option === "Sobre DICTA") {
                    startDictaGame()
                  } else if (prizes[prizeNumber].option === "Línea Tiempo") {
                    startTimelineGame()
                  } else if (prizes[prizeNumber].option === "Mapas") {
                    startMapGame()
                  } else if (prizes[prizeNumber].option === "Contradicción") {
                    startContradictionGame()
                  } else if (prizes[prizeNumber].option === "Preguntas") {
                    startQuestionGame()
                  } else if (prizes[prizeNumber].option === "Hablantes") {
                    startSpeakerGame()
                  } else {
                    setShowModal(false)
                  }
                }}
                size="lg"
                className="bg-white text-gray-900 hover:bg-white/90 font-semibold"
              >
                ¡Entendido!
              </Button>
            </div>
          </Card>
          </div>
        </div>
      )}

      {/* Modal del juego de Hablantes */}
      {showSpeakerGame && currentSpeakerGame && (
        <div className="fixed inset-0 z-50 animate-in fade-in duration-300">
          {/* Fondo negro con opacidad */}
          <div className="absolute inset-0 bg-black/50" />
          
          {/* Contenido del modal */}
          <div className="relative flex items-start justify-center min-h-full p-4 py-8">
            <Card className="relative max-w-4xl w-full p-8 border-4 animate-in zoom-in-95 duration-500 shadow-2xl bg-[#0ea5e9] border-[#0ea5e9] my-auto">
              <button
                type="button"
                onClick={handleEndSpeakerGame}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-6 text-white">
                {!showSpeakerAnswer ? (
                  <>
                    {/* Cronómetro */}
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-4">
                        {speakerTimeLeft}s
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold mb-3">
                        {currentSpeakerGame.title}
                      </h2>
                      <p className="text-white/90">Asigna mentalmente quién habla en cada intervención.</p>
                    </div>

                    {/* Listado de posibles hablantes */}
                    <div className="bg-white/10 rounded-lg p-4">
                      <h3 className="text-sm font-semibold mb-2">Posibles hablantes</h3>
                      <div className="flex flex-wrap gap-2">
                        {currentSpeakerGame.speakers.map((s) => (
                          <span key={s} className="px-2 py-1 rounded bg-white/20 text-sm">{s}</span>
                        ))}
                      </div>
                    </div>

                    {/* Diálogos anónimos */}
                    <div className="bg-white/10 rounded-lg p-6">
                      <div className="text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                        {formatDialogues(currentSpeakerGame.dialoguesAnon)}
                      </div>
                    </div>

                    {/* Botón para ver respuesta */}
                    <div className="text-center">
                      <Button
                        onClick={handleShowSpeakerAnswer}
                        size="lg"
                        className="bg-white text-[#0ea5e9] hover:bg-white/90 font-semibold"
                      >
                        Ver Quién Habló
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {!showSpeakerContent ? (
                      <>
                        {/* Respuesta - Diálogos con hablantes */}
                        <div className="space-y-6">
                          <div className="text-center">
                            <div className="text-6xl mb-4">🗣️</div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-6">
                              {currentSpeakerGame.title}
                            </h2>
                            <h3 className="text-xl font-semibold mb-6">Intervenciones con hablantes</h3>
                          </div>

                          <div className="bg-white/10 rounded-lg p-6">
                            <div className="text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                              {formatDialogues(currentSpeakerGame.dialoguesSolved)}
                            </div>
                          </div>
                        </div>

                        <div className="text-center space-y-3">
                          <Button
                            onClick={() => setShowSpeakerContent(true)}
                            size="lg"
                            className="bg-white/20 text-white hover:bg-white/30 font-semibold mr-4"
                          >
                            Ver Versión Anónima
                          </Button>
                          <Button
                            onClick={handleEndSpeakerGame}
                            size="lg"
                            className="bg-white text-[#0ea5e9] hover:bg-white/90 font-semibold"
                          >
                            Continuar
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Volver a ver anónimo */}
                        <div className="bg-white/10 rounded-lg p-6">
                          <div className="text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                            {formatDialogues(currentSpeakerGame.dialoguesAnon)}
                          </div>
                        </div>

                        <div className="text-center space-y-3">
                          <Button
                            onClick={() => setShowSpeakerContent(false)}
                            size="lg"
                            className="bg-white/20 text-white hover:bg-white/30 font-semibold mr-4"
                          >
                            Ver Respuesta
                          </Button>
                          <Button
                            onClick={handleEndSpeakerGame}
                            size="lg"
                            className="bg-white text-[#0ea5e9] hover:bg-white/90 font-semibold"
                          >
                            Continuar
                          </Button>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Modal del juego de DICTA */}
      {showDictaGame && currentQuestion && (
        <div className="fixed inset-0 z-50 animate-in fade-in duration-300">
          {/* Fondo negro con opacidad */}
          <div className="absolute inset-0 bg-black/50" />
          
          {/* Contenido del modal */}
          <div className="relative flex items-center justify-center min-h-full p-4">
            <Card className="relative max-w-2xl w-full p-8 border-4 animate-in zoom-in-95 duration-500 shadow-2xl bg-[#6366f1] border-[#6366f1]">
            <button
              type="button"
              onClick={handleEndDictaGame}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-6 text-center text-white">
              {!showAnswer ? (
                <>
                  {/* Cronómetro */}
                  <div className="text-4xl font-bold">
                    {timeLeft}s
                  </div>
                  
                  {/* Pregunta */}
                  <div className="space-y-4">
                    <h2 className="text-2xl md:text-3xl font-bold">
                      {currentQuestion.question}
                    </h2>
                  </div>
                  
                  {/* Botón para ver respuesta */}
                  <Button
                    onClick={handleShowAnswer}
                    size="lg"
                    className="bg-white text-[#6366f1] hover:bg-white/90 font-semibold"
                  >
                    Ver Respuesta
                  </Button>
                </>
              ) : (
                <>
                  {/* Respuesta */}
                  <div className="space-y-6">
                    <div className="text-6xl">✅</div>
                    <h2 className="text-2xl md:text-3xl font-bold">
                      {currentQuestion.question}
                    </h2>
                    <div className="p-6 bg-white/10 rounded-lg">
                      <p className="text-xl font-medium">
                        {currentQuestion.answer}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleEndDictaGame}
                    size="lg"
                    className="bg-white text-[#6366f1] hover:bg-white/90 font-semibold"
                  >
                    Continuar
                  </Button>
                </>
              )}
            </div>
          </Card>
          </div>
        </div>
      )}

      {/* Modal del juego de Línea de Tiempo */}
      {showTimelineGame && currentTimelineGame && (
        <div className="fixed inset-0 z-50 animate-in fade-in duration-300">
          {/* Fondo negro con opacidad */}
          <div className="absolute inset-0 bg-black/50" />
          
          {/* Contenido del modal */}
          <div className="relative flex items-start justify-center min-h-full p-4 py-8">
            <Card className="relative max-w-4xl w-full p-8 border-4 animate-in zoom-in-95 duration-500 shadow-2xl bg-[#10b981] border-[#10b981] my-auto">
              <button
                type="button"
                onClick={handleEndTimelineGame}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-6 text-white">
                {!showTimelineAnswer ? (
                  <>
                    {/* Cronómetro */}
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-4">
                        {timelineTimeLeft}s
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold mb-6">
                        {currentTimelineGame.title}
                      </h2>
                    </div>
                    
                    {/* Diálogos */}
                    <div className="bg-white/10 rounded-lg p-6">
                      <div className="text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                        {formatDialogues(currentTimelineGame.dialogues)}
                      </div>
                    </div>
                    
                    {/* Botón para ver respuesta */}
                    <div className="text-center">
                      <Button
                        onClick={handleShowTimelineAnswer}
                        size="lg"
                        className="bg-white text-[#10b981] hover:bg-white/90 font-semibold"
                      >
                        Ver Orden Real de los Hechos
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {!showTimelineContent ? (
                      <>
                        {/* Respuesta - Línea de tiempo */}
                        <div className="space-y-6">
                          <div className="text-center">
                            <div className="text-6xl mb-4">📋</div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-6">
                              {currentTimelineGame.title}
                            </h2>
                            <h3 className="text-xl font-semibold mb-6">
                              Orden Real de los Hechos
                            </h3>
                          </div>
                          
                          <div className="bg-white/10 rounded-lg p-6">
                            <div className="space-y-4">
                              {currentTimelineGame.timeline.map((event, index) => (
                                <div key={index} className="flex items-start gap-4">
                                  <div className="flex-shrink-0 w-8 h-8 bg-white text-[#10b981] rounded-full flex items-center justify-center font-bold text-sm">
                                    {index + 1}
                                  </div>
                                  <div className="flex-1">
                                    <div className="bg-white/20 rounded-lg p-3">
                                      <p className="text-sm font-medium">{event}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-center space-y-3">
                          <Button
                            onClick={() => setShowTimelineContent(true)}
                            size="lg"
                            className="bg-white/20 text-white hover:bg-white/30 font-semibold mr-4"
                          >
                            Ver Contenido Anterior
                          </Button>
                          <Button
                            onClick={handleEndTimelineGame}
                            size="lg"
                            className="bg-white text-[#10b981] hover:bg-white/90 font-semibold"
                          >
                            Continuar
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Contenido anterior - Diálogos */}
                        <div className="space-y-6">
                          <div className="text-center">
                            <h2 className="text-2xl md:text-3xl font-bold mb-6">
                              {currentTimelineGame.title}
                            </h2>
                            <h3 className="text-xl font-semibold mb-6">
                              Contenido de la Audiencia
                            </h3>
                          </div>
                          
                          <div className="bg-white/10 rounded-lg p-6">
                            <div className="text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                              {formatDialogues(currentTimelineGame.dialogues)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-center space-y-3">
                          <Button
                            onClick={() => setShowTimelineContent(false)}
                            size="lg"
                            className="bg-white/20 text-white hover:bg-white/30 font-semibold mr-4"
                          >
                            Ver Respuesta
                          </Button>
                          <Button
                            onClick={handleEndTimelineGame}
                            size="lg"
                            className="bg-white text-[#10b981] hover:bg-white/90 font-semibold"
                          >
                            Continuar
                          </Button>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Modal del juego de Mapas Conceptuales */}
      {showMapGame && currentMapGame && (
        <div className="fixed inset-0 z-50 animate-in fade-in duration-300">
          {/* Fondo negro con opacidad */}
          <div className="absolute inset-0 bg-black/50" />
          
          {/* Contenido del modal */}
          <div className="relative flex items-start justify-center min-h-full p-4 py-8">
            <Card className="relative max-w-4xl w-full p-8 border-4 animate-in zoom-in-95 duration-500 shadow-2xl bg-[#f59e0b] border-[#f59e0b] my-auto">
              <button
                type="button"
                onClick={handleEndMapGame}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-6 text-white">
                {!showMapAnswer ? (
                  <>
                    {/* Cronómetro */}
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-4">
                        {mapTimeLeft}s
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold mb-6">
                        {currentMapGame.title}
                      </h2>
                    </div>
                    
                    {/* Texto del caso */}
                    <div className="bg-white/10 rounded-lg p-6 mb-6">
                      <p className="text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                        {currentMapGame.text}
                      </p>
                    </div>
                    
                    {/* Mapa incompleto */}
                    <div className="bg-white/20 rounded-lg p-6">
                      <h3 className="text-lg font-bold mb-4">Mapa Conceptual Incompleto:</h3>
                      <div className="bg-white/30 rounded-lg p-4 font-mono text-center text-lg">
                        {currentMapGame.incompleteMap}
                      </div>
                    </div>
                    
                    {/* Botón para ver respuesta */}
                    <div className="text-center">
                      <Button
                        onClick={handleShowMapAnswer}
                        size="lg"
                        className="bg-white text-[#f59e0b] hover:bg-white/90 font-semibold"
                      >
                        Ver Mapa Completo
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {!showMapContent ? (
                      <>
                        {/* Respuesta - Mapa completo */}
                        <div className="space-y-6">
                          <div className="text-center">
                            <div className="text-6xl mb-4">🗺️</div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-6">
                              {currentMapGame.title}
                            </h2>
                            <h3 className="text-xl font-semibold mb-6">
                              Mapa Conceptual Completo
                            </h3>
                          </div>
                          
                          {/* Mapa incompleto */}
                          <div className="bg-white/10 rounded-lg p-6">
                            <h4 className="text-lg font-semibold mb-3 text-white/80">Mapa Incompleto:</h4>
                            <div className="bg-white/20 rounded-lg p-4 font-mono text-center">
                              {currentMapGame.incompleteMap}
                            </div>
                          </div>
                          
                          {/* Mapa completo */}
                          <div className="bg-white/20 rounded-lg p-6">
                            <h4 className="text-lg font-semibold mb-3">Mapa Completo:</h4>
                            <div className="bg-white/30 rounded-lg p-4 font-mono text-center text-lg font-bold">
                              {currentMapGame.completeMap}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-center space-y-3">
                          <Button
                            onClick={() => setShowMapContent(true)}
                            size="lg"
                            className="bg-white/20 text-white hover:bg-white/30 font-semibold mr-4"
                          >
                            Ver Contenido Anterior
                          </Button>
                          <Button
                            onClick={handleEndMapGame}
                            size="lg"
                            className="bg-white text-[#f59e0b] hover:bg-white/90 font-semibold"
                          >
                            Continuar
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Contenido anterior - Texto del caso */}
                        <div className="space-y-6">
                          <div className="text-center">
                            <h2 className="text-2xl md:text-3xl font-bold mb-6">
                              {currentMapGame.title}
                            </h2>
                            <h3 className="text-xl font-semibold mb-6">
                              Texto del Caso
                            </h3>
                          </div>
                          
                          <div className="bg-white/10 rounded-lg p-6">
                            <p className="text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                              {currentMapGame.text}
                            </p>
                          </div>
                          
                          <div className="bg-white/20 rounded-lg p-6">
                            <h4 className="text-lg font-bold mb-4">Mapa Conceptual Incompleto:</h4>
                            <div className="bg-white/30 rounded-lg p-4 font-mono text-center text-lg">
                              {currentMapGame.incompleteMap}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-center space-y-3">
                          <Button
                            onClick={() => setShowMapContent(false)}
                            size="lg"
                            className="bg-white/20 text-white hover:bg-white/30 font-semibold mr-4"
                          >
                            Ver Respuesta
                          </Button>
                          <Button
                            onClick={handleEndMapGame}
                            size="lg"
                            className="bg-white text-[#f59e0b] hover:bg-white/90 font-semibold"
                          >
                            Continuar
                          </Button>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Modal del juego de Contradicciones */}
      {showContradictionGame && currentContradictionGame && (
        <div className="fixed inset-0 z-50 animate-in fade-in duration-300">
          {/* Fondo negro con opacidad */}
          <div className="absolute inset-0 bg-black/50" />
          
          {/* Contenido del modal */}
          <div className="relative flex items-start justify-center min-h-full p-4 py-8">
            <Card className="relative max-w-4xl w-full p-8 border-4 animate-in zoom-in-95 duration-500 shadow-2xl bg-[#8b5cf6] border-[#8b5cf6] my-auto">
              <button
                type="button"
                onClick={handleEndContradictionGame}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-6 text-white">
                {!showContradictionAnswer ? (
                  <>
                    {/* Cronómetro */}
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-4">
                        {contradictionTimeLeft}s
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold mb-6">
                        {currentContradictionGame.title}
                      </h2>
                    </div>
                    
                    {/* Diálogos */}
                    <div className="bg-white/10 rounded-lg p-6 mb-6">
                      <pre className="text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                        {formatDialogues(currentContradictionGame.dialogues)}
                      </pre>
                    </div>
                    
                    {/* Instrucción */}
                    <div className="bg-white/20 rounded-lg p-4 text-center">
                      <p className="text-lg font-semibold">
                        🔍 Identifica las contradicciones en las declaraciones
                      </p>
                    </div>
                    
                    {/* Botón para ver respuesta */}
                    <div className="text-center">
                      <Button
                        onClick={handleShowContradictionAnswer}
                        size="lg"
                        className="bg-white text-[#8b5cf6] hover:bg-white/90 font-semibold"
                      >
                        Ver Contradicciones
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {!showContradictionContent ? (
                      <>
                        {/* Respuesta - Contradicciones */}
                        <div className="space-y-6">
                          <div className="text-center">
                            <div className="text-6xl mb-4">⚖️</div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-6">
                              {currentContradictionGame.title}
                            </h2>
                            <h3 className="text-xl font-semibold mb-6">
                              Contradicciones Identificadas
                            </h3>
                          </div>
                          
                          <div className="bg-white/10 rounded-lg p-6">
                            <div className="space-y-4">
                              {currentContradictionGame.contradictions.map((contradiction, index) => (
                                <div key={index} className="flex items-start gap-4">
                                  <div className="flex-shrink-0 w-8 h-8 bg-white text-[#8b5cf6] rounded-full flex items-center justify-center font-bold text-sm">
                                    {index + 1}
                                  </div>
                                  <div className="flex-1">
                                    <div className="bg-white/20 rounded-lg p-4">
                                      <p className="text-base font-medium leading-relaxed">{contradiction}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-center space-y-3">
                          <Button
                            onClick={() => setShowContradictionContent(true)}
                            size="lg"
                            className="bg-white/20 text-white hover:bg-white/30 font-semibold mr-4"
                          >
                            Ver Contenido Anterior
                          </Button>
                          <Button
                            onClick={handleEndContradictionGame}
                            size="lg"
                            className="bg-white text-[#8b5cf6] hover:bg-white/90 font-semibold"
                          >
                            Continuar
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Contenido anterior - Diálogos originales */}
                        <div className="space-y-6">
                          <div className="text-center">
                            <h2 className="text-2xl md:text-3xl font-bold mb-6">
                              {currentContradictionGame.title}
                            </h2>
                            <h3 className="text-xl font-semibold mb-6">
                              Diálogos del Caso
                            </h3>
                          </div>
                          
                          <div className="bg-white/10 rounded-lg p-6">
                            <div className="text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                              {formatDialogues(currentContradictionGame.dialogues)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-center space-y-3">
                          <Button
                            onClick={() => setShowContradictionContent(false)}
                            size="lg"
                            className="bg-white/20 text-white hover:bg-white/30 font-semibold mr-4"
                          >
                            Ver Respuesta
                          </Button>
                          <Button
                            onClick={handleEndContradictionGame}
                            size="lg"
                            className="bg-white text-[#8b5cf6] hover:bg-white/90 font-semibold"
                          >
                            Continuar
                          </Button>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Modal del juego de Preguntas */}
      {showQuestionGame && currentQuestionGame && (
        <div className="fixed inset-0 z-50 animate-in fade-in duration-300">
          {/* Fondo negro con opacidad */}
          <div className="absolute inset-0 bg-black/50" />
          
          {/* Contenido del modal */}
          <div className="relative flex items-start justify-center min-h-full p-4 py-8">
            <Card className="relative max-w-4xl w-full p-8 border-4 animate-in zoom-in-95 duration-500 shadow-2xl bg-[#ec4899] border-[#ec4899] my-auto">
              <button
                type="button"
                onClick={handleEndQuestionGame}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-6 text-white">
                {!showQuestionAnswer ? (
                  <>
                    {/* Cronómetro */}
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-4">
                        {questionTimeLeft}s
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold mb-6">
                        {currentQuestionGame.title}
                      </h2>
                    </div>
                    
                    {/* Texto del caso */}
                    <div className="bg-white/10 rounded-lg p-6 mb-6">
                      <p className="text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                        {currentQuestionGame.text}
                      </p>
                    </div>
                    
                    {/* Opciones de pregunta */}
                    <div className="bg-white/20 rounded-lg p-6">
                      <h3 className="text-lg font-bold mb-4">¿Cuál pregunta agregaría más contexto relevante?</h3>
                      <div className="space-y-3">
                        {currentQuestionGame.options.map((option, index) => (
                          <div key={index} className="bg-white/30 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <span className="flex-shrink-0 w-6 h-6 bg-white text-[#ec4899] rounded-full flex items-center justify-center font-bold text-sm">
                                {String.fromCharCode(65 + index)}
                              </span>
                              <p className="text-base font-medium">{option}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Botón para ver respuesta */}
                    <div className="text-center">
                      <Button
                        onClick={handleShowQuestionAnswer}
                        size="lg"
                        className="bg-white text-[#ec4899] hover:bg-white/90 font-semibold"
                      >
                        Ver Respuesta Correcta
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {!showQuestionContent ? (
                      <>
                        {/* Respuesta - Pregunta correcta */}
                        <div className="space-y-6">
                          <div className="text-center">
                            <div className="text-6xl mb-4">❓</div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-6">
                              {currentQuestionGame.title}
                            </h2>
                            <h3 className="text-xl font-semibold mb-6">
                              Pregunta Correcta
                            </h3>
                          </div>
                          
                          {/* Pregunta correcta destacada */}
                          <div className="bg-white/20 rounded-lg p-6">
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0 w-8 h-8 bg-white text-[#ec4899] rounded-full flex items-center justify-center font-bold text-sm">
                                {String.fromCharCode(65 + currentQuestionGame.correctAnswer)}
                              </div>
                              <div className="flex-1">
                                <div className="bg-white/30 rounded-lg p-4">
                                  <p className="text-lg font-bold leading-relaxed">
                                    {currentQuestionGame.options[currentQuestionGame.correctAnswer]}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Explicación */}
                          <div className="bg-white/10 rounded-lg p-6">
                            <h4 className="text-lg font-semibold mb-3">¿Por qué es la correcta?</h4>
                            <p className="text-base leading-relaxed">
                              {currentQuestionGame.explanation}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-center space-y-3">
                          <Button
                            onClick={() => setShowQuestionContent(true)}
                            size="lg"
                            className="bg-white/20 text-white hover:bg-white/30 font-semibold mr-4"
                          >
                            Ver Contenido Anterior
                          </Button>
                          <Button
                            onClick={handleEndQuestionGame}
                            size="lg"
                            className="bg-white text-[#ec4899] hover:bg-white/90 font-semibold"
                          >
                            Continuar
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Contenido anterior - Caso y opciones */}
                        <div className="space-y-6">
                          <div className="text-center">
                            <h2 className="text-2xl md:text-3xl font-bold mb-6">
                              {currentQuestionGame.title}
                            </h2>
                            <h3 className="text-xl font-semibold mb-6">
                              Caso y Opciones
                            </h3>
                          </div>
                          
                          <div className="bg-white/10 rounded-lg p-6">
                            <p className="text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                              {currentQuestionGame.text}
                            </p>
                          </div>
                          
                          <div className="bg-white/20 rounded-lg p-6">
                            <h4 className="text-lg font-bold mb-4">Opciones de pregunta:</h4>
                            <div className="space-y-3">
                              {currentQuestionGame.options.map((option, index) => (
                                <div key={index} className="bg-white/30 rounded-lg p-3">
                                  <div className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 bg-white text-[#ec4899] rounded-full flex items-center justify-center font-bold text-sm">
                                      {String.fromCharCode(65 + index)}
                                    </span>
                                    <p className="text-sm font-medium">{option}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-center space-y-3">
                          <Button
                            onClick={() => setShowQuestionContent(false)}
                            size="lg"
                            className="bg-white/20 text-white hover:bg-white/30 font-semibold mr-4"
                          >
                            Ver Respuesta
                          </Button>
                          <Button
                            onClick={handleEndQuestionGame}
                            size="lg"
                            className="bg-white text-[#ec4899] hover:bg-white/90 font-semibold"
                          >
                            Continuar
                          </Button>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
