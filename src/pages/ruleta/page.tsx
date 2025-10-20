import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button_landing"
import { Card } from "@/components/ui/card_landing"
import { X } from "lucide-react"
import { Wheel } from "react-custom-roulette"
import "../landing/landing.css"

const prizes = [
  // {
  //   option: "Hablante",
  //   title: "Identificar hablante",
  //   time: "60",
  //   description: "Se les muestra 4 a 5 voces, y tienen que indicar quién fue el que repitió voces",
  //   style: { backgroundColor: "#3b82f6", textColor: "#ffffff" },
  // },
  // {
  //   option: "Contradicción",
  //   title: "Identificar contradicción",
  //   time: "30",
  //   description: "Se les da un párrafo y 30 segundos donde van a tener que identificar la contradicción",
  //   style: { backgroundColor: "#8b5cf6", textColor: "#ffffff" },
  // },
  // {
  //   option: "Preguntas",
  //   title: "Sugerir preguntas",
  //   time: "30",
  //   description:
  //     "Se les da un párrafo y 30 segundos donde van a tener que identificar la pregunta que mejor contexto agregue",
  //   style: { backgroundColor: "#ec4899", textColor: "#ffffff" },
  // },
  {
    option: "Mapas",
    title: "Completar mapas conceptuales",
    time: "30",
    description: "Se les comparte un mapa incompleto y se le solicita al usuario indicar lo que falta",
    style: { backgroundColor: "#f59e0b", textColor: "#ffffff" },
  },
  // {
  //   option: "Línea Tiempo",
  //   title: "Completar líneas de tiempo",
  //   time: "120",
  //   description: "Se les comparte una línea de tiempo y se le solicita al usuario indicar lo que falta",
  //   style: { backgroundColor: "#10b981", textColor: "#ffffff" },
  // },
  // {
  //   option: "Audio Ruido",
  //   title: "Identificar audios con ruido",
  //   time: "30",
  //   description: "Identificar la oración que se dijo en un audio con ruido de fondo",
  //   style: { backgroundColor: "#06b6d4", textColor: "#ffffff" },
  // },
  // {
  //   option: "Sobre DICTA",
  //   title: "Preguntas de DICTA",
  //   time: "10",
  //   description: "Que hable del funcionamiento de DICTA, basándose en el folleto",
  //   style: { backgroundColor: "#6366f1", textColor: "#ffffff" },
  // },
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
  }

  const startMapGame = () => {
    const randomMapGame = mapGames[Math.floor(Math.random() * mapGames.length)]
    setCurrentMapGame(randomMapGame)
    setMapTimeLeft(parseInt(prizes[prizeNumber].time))
    setShowMapAnswer(false)
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
  }

  useEffect(() => {
    if (showModal || showDictaGame || showTimelineGame || showMapGame) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [showModal, showDictaGame, showTimelineGame, showMapGame])

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
                      <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                        {currentTimelineGame.dialogues}
                      </pre>
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
                    
                    <div className="text-center">
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
                    
                    <div className="text-center">
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
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
