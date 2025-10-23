import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button_landing"
import { Card } from "@/components/ui/card_landing"
import { X } from "lucide-react"

interface TimelineGameProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly timeLimit: number
}

interface TimelineGameData {
  title: string
  dialogues: string
  timeline: string[]
}

const timelineGames: TimelineGameData[] = [
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

const formatDialogues = (text: string) => {
  return text.split('\n').map((line, index) => {
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

// Función para mezclar el array de eventos
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Variable para mantener el índice del juego actual entre instancias
let currentGameIndex = 0

export function TimelineGame({ isOpen, onClose, timeLimit }: TimelineGameProps) {
  const [currentGame, setCurrentGame] = useState<TimelineGameData | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [timeExpired, setTimeExpired] = useState(false)
  const [userOrder, setUserOrder] = useState<string[]>([])
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [showTranscription, setShowTranscription] = useState(true)
  const [showTranscriptionInAnswer, setShowTranscriptionInAnswer] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Obtener el juego actual en orden
      const game = timelineGames[currentGameIndex]
      setCurrentGame(game)

      // Avanzar al siguiente índice para la próxima vez
      currentGameIndex = (currentGameIndex + 1) % timelineGames.length

      // Mezclar los eventos para que el usuario los ordene
      setUserOrder(shuffleArray(game.timeline))

      setTimeLeft(timeLimit)
      setShowAnswer(false)
      setTimeExpired(false)
      setIsCorrect(null)
      setShowTranscription(true)
      setShowTranscriptionInAnswer(false)
    }
  }, [isOpen, timeLimit])

  useEffect(() => {
    let interval: number | null = null

    if (isOpen && timeLeft > 0 && !showAnswer) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setTimeExpired(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isOpen, timeLeft, showAnswer])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen || !currentGame) return null

  return (
    <div className="fixed inset-0 z-50 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative flex items-start justify-center min-h-full p-4 py-8">
        <Card className="relative max-w-4xl w-full p-8 border-4 animate-in zoom-in-95 duration-500 shadow-2xl bg-[#10b981] border-[#10b981] my-auto">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="space-y-6 text-white">
            {showAnswer ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">{isCorrect ? "🎉" : "❌"}</div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">
                    {isCorrect ? "¡Orden Correcto!" : "Orden Incorrecto"}
                  </h2>
                  <h3 className="text-xl font-semibold mb-6">{currentGame.title}</h3>
                </div>

                {showTranscriptionInAnswer ? (
                  <>
                    <div className="bg-white/10 rounded-lg p-6">
                      <h4 className="text-lg font-bold mb-4 text-center">Transcripción Original</h4>
                      <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
                        {formatDialogues(currentGame.dialogues)}
                      </div>
                    </div>

                    <div className="text-center space-x-4">
                      <Button
                        onClick={() => setShowTranscriptionInAnswer(false)}
                        size="lg"
                        className="bg-white/20 text-white hover:bg-white/30 font-semibold border-2 border-white/40"
                      >
                        Ver Comparación
                      </Button>
                      <Button
                        onClick={onClose}
                        size="lg"
                        className="bg-white text-[#10b981] hover:bg-white/90 font-semibold"
                      >
                        Continuar
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-bold mb-4 text-center">Tu Orden</h4>
                        <div className="space-y-3">
                          {userOrder.map((event, index) => {
                            const correctIndex = currentGame.timeline.indexOf(event)
                            const isInCorrectPosition = correctIndex === index
                            return (
                              <div
                                key={event}
                                className={`flex items-start gap-4 rounded-lg p-4 border-2 ${isInCorrectPosition
                                    ? "bg-green-500/30 border-green-300"
                                    : "bg-red-500/30 border-red-300"
                                  }`}
                              >
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/30 flex items-center justify-center font-bold">
                                  {index + 1}
                                </div>
                                <p className="text-sm md:text-base flex-1">{event}</p>
                                <div className="flex-shrink-0">
                                  {isInCorrectPosition ? "✓" : "✗"}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-bold mb-4 text-center">Orden Correcto</h4>
                        <div className="space-y-3">
                          {currentGame.timeline.map((event, index) => (
                            <div
                              key={event}
                              className="flex items-start gap-4 bg-green-500/20 border-2 border-green-300 rounded-lg p-4"
                            >
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/30 flex items-center justify-center font-bold">
                                {index + 1}
                              </div>
                              <p className="text-sm md:text-base flex-1">{event}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="text-center space-x-4">
                      <Button
                        onClick={() => setShowTranscriptionInAnswer(true)}
                        size="lg"
                        className="bg-white/20 text-white hover:bg-white/30 font-semibold border-2 border-white/40"
                      >
                        Ver Transcripción
                      </Button>
                      <Button
                        onClick={onClose}
                        size="lg"
                        className="bg-white text-[#10b981] hover:bg-white/90 font-semibold"
                      >
                        Continuar
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <div className="text-center">
                  {timeExpired ? (
                    <div className="space-y-4 mb-4">
                      <div className="text-6xl">⏰</div>
                      <div className="text-2xl font-bold text-red-200">
                        ¡Tiempo Agotado!
                      </div>
                    </div>
                  ) : (
                    <div className="text-4xl font-bold mb-4">
                      {timeLeft}s
                    </div>
                  )}
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">
                    {currentGame.title}
                  </h2>
                </div>

                {showTranscription ? (
                  <>
                    <p className="text-lg mb-4 text-center">Lee la transcripción de la audiencia</p>

                    <div className="bg-white/10 rounded-lg p-6 mb-6 max-h-96 overflow-y-auto">
                      <h4 className="text-lg font-bold mb-4">Transcripción de la Audiencia</h4>
                      <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                        {formatDialogues(currentGame.dialogues)}
                      </div>
                    </div>

                    <div className="text-center">
                      <Button
                        onClick={() => setShowTranscription(false)}
                        size="lg"
                        className="bg-white text-[#10b981] hover:bg-white/90 font-semibold"
                      >
                        Ordenar Hechos
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-lg mb-4 text-center">Ordena los eventos arrastrándolos</p>

                    <div className="space-y-3 mb-6">
                      {userOrder.map((event, index) => (
                        <div
                          key={event}
                          draggable={!timeExpired}
                          onDragStart={() => setDraggedIndex(index)}
                          onDragOver={(e) => {
                            e.preventDefault()
                          }}
                          onDrop={() => {
                            if (draggedIndex !== null && draggedIndex !== index) {
                              const newOrder = [...userOrder]
                              const draggedItem = newOrder[draggedIndex]
                              newOrder.splice(draggedIndex, 1)
                              newOrder.splice(index, 0, draggedItem)
                              setUserOrder(newOrder)
                              setDraggedIndex(null)
                            }
                          }}
                          onDragEnd={() => setDraggedIndex(null)}
                          className={`flex items-start gap-4 bg-white/10 rounded-lg p-4 border-2 border-white/30 transition-all ${!timeExpired ? "cursor-move hover:bg-white/20 hover:border-white/50" : "opacity-70 cursor-not-allowed"
                            } ${draggedIndex === index ? "opacity-50" : ""}`}
                        >
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <p className="text-base md:text-lg flex-1">{event}</p>
                          {!timeExpired && (
                            <div className="flex-shrink-0 text-white/60">
                              ⋮⋮
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="text-center space-x-4">
                      <Button
                        onClick={() => setShowTranscription(true)}
                        size="lg"
                        className="bg-white/20 text-white hover:bg-white/30 font-semibold border-2 border-white/40"
                      >
                        Ver Transcripción
                      </Button>
                      <Button
                        onClick={() => {
                          const correct = JSON.stringify(userOrder) === JSON.stringify(currentGame.timeline)
                          setIsCorrect(correct)
                          setShowAnswer(true)
                        }}
                        size="lg"
                        className="bg-white text-[#10b981] hover:bg-white/90 font-semibold"
                      >
                        Ver Respuesta
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
  )
}
