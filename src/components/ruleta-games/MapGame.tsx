import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button_landing"
import { Card } from "@/components/ui/card_landing"
import { X } from "lucide-react"

interface MapGameProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly timeLimit: number
}

interface MapGameData {
  title: string
  text: string
  incompleteMap: string
  completeMap: string
  blanks: Array<{ id: number, correct: string, options: string[] }>
}

const mapGames: MapGameData[] = [
  {
    title: "El choque del puente",
    text: `Una mañana de julio, una camioneta perdió el control al cruzar el puente de la avenida Costanera. El vehículo se desvió hacia el carril contrario e impactó contra un auto que venía de frente.
El conductor del auto, el señor Figueroa, sufrió heridas leves, mientras que la conductora de la camioneta, la señora Duarte, resultó ilesa.
Durante la audiencia, Duarte explicó que había intentado esquivar un perro que cruzó la calle repentinamente.
Sin embargo, el testigo que esperaba el colectivo afirmó que no había ningún animal, sino que la conductora estaba usando su celular al momento del accidente.
El perito vial confirmó que no se encontraron huellas de frenado y que el pavimento estaba seco.
Finalmente, el juez determinó que la distracción por el uso del celular fue la causa principal del siniestro y ordenó una multa y la suspensión de la licencia por seis meses.`,
    incompleteMap: "Accidente → (____) → Choque → (____) → Testimonios → (____) → Fallo del juez",
    completeMap: "Accidente → Distracción → Choque → Peritaje → Testimonios → Sanción → Fallo del juez",
    blanks: [
      {
        id: 0,
        correct: "Distracción",
        options: ["Distracción", "Neblina", "Falla mecánica"]
      },
      {
        id: 1,
        correct: "Peritaje",
        options: ["Peritaje", "Ambulancia", "Testigos"]
      },
      {
        id: 2,
        correct: "Sanción",
        options: ["Sanción", "Perdón", "Compensación"]
      }
    ]
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
    completeMap: "Compra → Envío fallido → Paquete extraviado → Negligencia comprobada → Pruebas → Reembolso → Fallo del juez",
    blanks: [
      {
        id: 0,
        correct: "Envío fallido",
        options: ["Envío fallido", "Robo", "Cancelación"]
      },
      {
        id: 1,
        correct: "Negligencia comprobada",
        options: ["Negligencia comprobada", "Error técnico", "Confusión de direcciones"]
      },
      {
        id: 2,
        correct: "Reembolso",
        options: ["Reembolso", "Multa", "Descuento"]
      }
    ]
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
    completeMap: "Conflicto laboral → Despido y enojo → Robo → Investigación policial → Evidencias → Prueba concluyente → Sentencia",
    blanks: [
      {
        id: 0,
        correct: "Despido y enojo",
        options: ["Despido y enojo", "Renuncia", "Vacaciones"]
      },
      {
        id: 1,
        correct: "Investigación policial",
        options: ["Investigación policial", "Mediación", "Acuerdo privado"]
      },
      {
        id: 2,
        correct: "Prueba concluyente",
        options: ["Prueba concluyente", "Testimonio único", "Confesión"]
      }
    ]
  }
]

// Variable para mantener el índice del juego actual entre instancias
let currentGameIndex = 0

export function MapGame({ isOpen, onClose, timeLimit }: MapGameProps) {
  const [currentGame, setCurrentGame] = useState<MapGameData | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [timeExpired, setTimeExpired] = useState(false)
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({})
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  useEffect(() => {
    if (isOpen) {
      // Obtener el juego actual en orden
      const game = mapGames[currentGameIndex]
      setCurrentGame(game)

      // Avanzar al siguiente índice para la próxima vez
      currentGameIndex = (currentGameIndex + 1) % mapGames.length

      setUserAnswers({})
      setTimeLeft(timeLimit)
      setShowAnswer(false)
      setTimeExpired(false)
      setIsCorrect(null)
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
    <div className="fixed inset-0 z-50 animate-in fade-in duration-300 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative flex items-center justify-center h-full p-4">
        <Card className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto border-4 animate-in zoom-in-95 duration-500 shadow-2xl bg-[#f59e0b] border-[#f59e0b]">
          <div className="sticky top-0 bg-[#f59e0b] z-10 p-6 pb-4 border-b border-white/20">
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center text-white">
              {timeExpired ? (
                <div className="space-y-4 mb-2">
                  <div className="text-6xl">⏰</div>
                  <div className="text-2xl font-bold text-red-200">¡Tiempo Agotado!</div>
                </div>
              ) : (
                <div className="text-3xl font-bold mb-2">{timeLeft}s</div>
              )}
              <h2 className="text-xl md:text-2xl font-bold">{currentGame.title}</h2>
            </div>
          </div>

          <div className="p-6 space-y-4 text-white">
            {showAnswer ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">{isCorrect ? "🎉" : "❌"}</div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    {isCorrect ? "¡Todas Correctas!" : "Algunas Incorrectas"}
                  </h2>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Contexto</h3>
                  <p className="text-sm md:text-base leading-relaxed">{currentGame.text}</p>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4">Comparación de Respuestas</h3>

                  <div className="space-y-4">
                    {currentGame.blanks.map((blank) => {
                      const userAnswer = userAnswers[blank.id]
                      const isBlankCorrect = userAnswer === blank.correct

                      return (
                        <div
                          key={blank.id}
                          className={`p-4 rounded-lg border-2 ${isBlankCorrect
                            ? "bg-green-500/30 border-green-300"
                            : "bg-red-500/30 border-red-300"
                            }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold">Espacio {blank.id + 1}:</span>
                            <span className="text-2xl">{isBlankCorrect ? "✓" : "✗"}</span>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-semibold">Tu respuesta: </span>
                              <span className={isBlankCorrect ? "text-green-200" : "text-red-200"}>
                                {userAnswer || "(sin respuesta)"}
                              </span>
                            </div>
                            {!isBlankCorrect && (
                              <div>
                                <span className="font-semibold">Correcta: </span>
                                <span className="text-green-200">{blank.correct}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="mt-4 p-4 bg-green-500/20 rounded-lg border-2 border-green-300">
                    <h4 className="font-semibold mb-2">Mapa Completo Correcto:</h4>
                    <p className="text-sm md:text-base font-mono break-words">
                      {currentGame.completeMap}
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    onClick={onClose}
                    size="lg"
                    className="bg-white text-[#f59e0b] hover:bg-white/90 font-semibold"
                  >
                    Continuar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Contexto</h3>
                  <p className="text-sm md:text-base leading-relaxed">{currentGame.text}</p>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Mapa Conceptual</h3>
                  <p className="text-xs md:text-sm text-white/80 mb-4 italic">
                    Visualiza el mapa y completa los espacios numerados seleccionando la opción correcta.
                  </p>

                  {/* Visualización del mapa con números */}
                  <div className="bg-white/30 rounded-lg p-4 mb-6">
                    <div className="flex flex-wrap items-center gap-2 justify-center">
                      {(() => {
                        let blankCounter = 0
                        return currentGame.incompleteMap.split('→').map((segment, index) => {
                          const trimmedSegment = segment.trim()
                          const blankRegex = /\(____\)/
                          const isBlank = blankRegex.exec(trimmedSegment)

                          if (isBlank) {
                            const currentBlankId = blankCounter
                            blankCounter++
                            const blank = currentGame.blanks[currentBlankId]
                            const userAnswer = blank ? userAnswers[blank.id] : null

                            return (
                              <>
                                <div key={`segment-${index}-blank-${currentBlankId}`} className="px-3 py-2 bg-amber-400/40 rounded-lg border-2 border-amber-300 font-bold text-sm flex items-center gap-2">
                                  <span className="w-6 h-6 rounded-full bg-white/40 flex items-center justify-center text-xs flex-shrink-0">
                                    {currentBlankId + 1}
                                  </span>
                                  {userAnswer ? (
                                    <span className="text-white">{userAnswer}</span>
                                  ) : (
                                    <span className="text-white/50 italic">_____</span>
                                  )}
                                </div>
                                {index < currentGame.incompleteMap.split('→').length - 1 && (
                                  <span key={`arrow-${index}`} className="text-xl font-bold">→</span>
                                )}
                              </>
                            )
                          } else {
                            return (
                              <>
                                <div key={`segment-${index}-text`} className="px-3 py-2 bg-white/40 rounded-lg font-semibold text-sm">
                                  {trimmedSegment}
                                </div>
                                {index < currentGame.incompleteMap.split('→').length - 1 && (
                                  <span key={`arrow-${index}`} className="text-xl font-bold">→</span>
                                )}
                              </>
                            )
                          }
                        })
                      })()}
                    </div>
                  </div>

                  {/* Desplegables para completar */}
                  <div className="space-y-4">
                    <h4 className="text-base font-semibold">Completa los espacios:</h4>
                    {currentGame.blanks.map((blank, blankIndex) => (
                      <div key={blank.id} className="space-y-2">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-400/60 flex items-center justify-center font-bold text-sm">
                            {blankIndex + 1}
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="text-white/90 text-sm font-semibold">
                              Espacio {blankIndex + 1}
                            </div>
                            <select
                              value={userAnswers[blank.id] || ""}
                              onChange={(e) => {
                                setUserAnswers({
                                  ...userAnswers,
                                  [blank.id]: e.target.value
                                })
                              }}
                              disabled={timeExpired}
                              className={`w-full px-3 py-2 rounded border-2 font-semibold text-sm ${userAnswers[blank.id]
                                  ? "bg-blue-500/30 border-blue-400 text-white"
                                  : "bg-white/10 border-white/30 text-white/70"
                                } ${timeExpired ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-white/20"}`}
                            >
                              <option value="" className="bg-gray-800 text-white/70">
                                -- Seleccioná una opción --
                              </option>
                              {blank.options.map((option) => (
                                <option key={option} value={option} className="bg-gray-800 text-white">
                                  {option}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    onClick={() => {
                      // Verificar si todas las respuestas son correctas
                      const allCorrect = currentGame.blanks.every(
                        blank => userAnswers[blank.id] === blank.correct
                      )
                      setIsCorrect(allCorrect)
                      setShowAnswer(true)
                    }}
                    size="lg"
                    disabled={Object.keys(userAnswers).length !== currentGame.blanks.length}
                    className="bg-white text-[#f59e0b] hover:bg-white/90 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Ver Respuesta
                  </Button>
                  {Object.keys(userAnswers).length !== currentGame.blanks.length && (
                    <p className="text-sm text-white/70 mt-2">
                      Completa todos los espacios para continuar ({Object.keys(userAnswers).length}/{currentGame.blanks.length})
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
