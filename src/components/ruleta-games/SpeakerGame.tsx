import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button_landing"
import { Card } from "@/components/ui/card_landing"
import { X } from "lucide-react"

interface SpeakerGameProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly timeLimit: number
}

interface DialogueLine {
  speaker: string
  text: string
}

interface SpeakerGameData {
  title: string
  speakers: string[]
  dialogues: DialogueLine[]
}

let currentGameIndex = 0

const speakerGames: SpeakerGameData[] = [
  {
    title: "Reclamo por ruido nocturno",
    speakers: ["JUEZ", "VECINA (Sosa)", "ADMINISTRADOR", "DENUNCIADO (Pablo)"],
    dialogues: [
      { speaker: "JUEZ", text: "Buen día. Se abre la audiencia por ruidos molestos." },
      { speaker: "VECINA (Sosa)", text: "Desde hace tres meses hay música fuerte después de las 23. Tengo videos y el acta del portero." },
      { speaker: "ADMINISTRADOR", text: "Recibimos tres reclamos formales y dos notificaciones al propietario del dpto. 5B." },
      { speaker: "DENUNCIADO (Pablo)", text: "Los fines de semana hago reuniones, pero nunca después de medianoche. Una sola vez fue el cumpleaños de mi hermano." },
      { speaker: "ADMINISTRADOR", text: "En el video del 12/08 se escuchan decibeles altos a las 01:15. Coincide con el 5B." },
      { speaker: "DENUNCIADO (Pablo)", text: "Ese día yo no estaba en el departamento." }
    ]
  },
  {
    title: "Disputa por alquiler",
    speakers: ["JUEZ", "PROPIETARIA (Gómez)", "INQUILINO (Rivero)", "ADMINISTRADOR"],
    dialogues: [
      { speaker: "JUEZ", text: "Se abre la audiencia por reclamo de deuda locativa." },
      { speaker: "PROPIETARIA (Gómez)", text: "El inquilino adeuda dos meses y el pago de expensas; traigo los avisos enviados." },
      { speaker: "INQUILINO (Rivero)", text: "El depósito debía cubrir una parte y la inmobiliaria nunca lo imputó." },
      { speaker: "ADMINISTRADOR", text: "Consta en el sistema del consorcio que hubo dos intimaciones por expensas impagas." },
      { speaker: "JUEZ", text: "La cláusula 7 prevé intereses por mora y actualización." },
      { speaker: "INQUILINO (Rivero)", text: "Yo envié un comprobante por mail; pido que lo verifiquen." }
    ]
  },
  {
    title: "Colisión en avenida Santa Fe",
    speakers: ["JUEZ", "CONDUCTOR AUTO (Molina)", "MOTOCICLISTA (Rojas)", "PERITO VIAL"],
    dialogues: [
      { speaker: "JUEZ", text: "Iniciamos la audiencia por colisión en la intersección de Santa Fe y Pueyrredón." },
      { speaker: "CONDUCTOR AUTO (Molina)", text: "Yo iba por el carril derecho con luz verde; la moto se me cruzó." },
      { speaker: "MOTOCICLISTA (Rojas)", text: "El auto dobló sin señalizar; yo tenía paso." },
      { speaker: "PERITO VIAL", text: "El relevamiento muestra huellas de frenado del auto de 3 metros y pavimento seco." },
      { speaker: "JUEZ", text: "¿Hubo giro permitido en esa esquina a esa hora?" },
      { speaker: "PERITO VIAL", text: "El giro a la izquierda está prohibido en horario pico." }
    ]
  }
]

export function SpeakerGame({ isOpen, onClose, timeLimit }: SpeakerGameProps) {
  const [currentGame, setCurrentGame] = useState<SpeakerGameData | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [timeExpired, setTimeExpired] = useState(false)
  const [userSelections, setUserSelections] = useState<{ [key: number]: string }>({})

  useEffect(() => {
    if (isOpen) {
      const game = speakerGames[currentGameIndex]
      setCurrentGame(game)
      setTimeLeft(timeLimit)
      setShowAnswer(false)
      setTimeExpired(false)
      setUserSelections({})

      currentGameIndex = (currentGameIndex + 1) % speakerGames.length
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

  const handleSpeakerSelect = (lineIndex: number, speaker: string) => {
    setUserSelections({
      ...userSelections,
      [lineIndex]: speaker
    })
  }

  const allSelectionsComplete = currentGame
    ? currentGame.dialogues.every((_, index) => userSelections[index])
    : false

  if (!isOpen || !currentGame) return null

  return (
    <div className="fixed inset-0 z-50 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative flex items-start justify-center min-h-full p-4 py-8">
        <Card className="relative max-w-4xl w-full p-8 border-4 animate-in zoom-in-95 duration-500 shadow-2xl bg-[#0ea5e9] border-[#0ea5e9] my-auto">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="space-y-6 text-white">
            {showAnswer ? (
              <>
                <div className="text-center">
                  <div className="text-6xl mb-4">
                    {Object.values(userSelections).every((selection, index) =>
                      selection === currentGame.dialogues[index].speaker
                    ) ? "🎉" : "❌"}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-3">
                    {currentGame.title}
                  </h2>
                  <h3 className="text-xl font-semibold mb-6">
                    {Object.values(userSelections).every((selection, index) =>
                      selection === currentGame.dialogues[index].speaker
                    ) ? "¡Todas las asignaciones correctas!" : "Revisá las respuestas"}
                  </h3>
                </div>

                <div className="bg-white/10 rounded-lg p-6 max-h-[50vh] overflow-y-auto">
                  <div className="space-y-4">
                    {currentGame.dialogues.map((dialogue, index) => {
                      const isCorrect = userSelections[index] === dialogue.speaker
                      return (
                        <div
                          key={`answer-${index}`}
                          className={`p-4 rounded-lg ${isCorrect
                            ? "bg-green-500/20 border-2 border-green-400"
                            : "bg-red-500/20 border-2 border-red-400"
                            }`}
                        >
                          <div className="flex items-start gap-2 mb-2">
                            <span className="text-2xl">{isCorrect ? "✓" : "✗"}</span>
                            <div className="flex-1">
                              <div className="font-semibold mb-1">
                                {isCorrect ? (
                                  <span className="text-green-200">
                                    {dialogue.speaker}
                                  </span>
                                ) : (
                                  <>
                                    <span className="text-red-200">Tu selección: {userSelections[index] || "Sin selección"}</span>
                                    <br />
                                    <span className="text-green-200">Correcto: {dialogue.speaker}</span>
                                  </>
                                )}
                              </div>
                              <div className="text-white/90">{dialogue.text}</div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    onClick={onClose}
                    size="lg"
                    className="bg-white text-[#0ea5e9] hover:bg-white/90 font-semibold"
                  >
                    Continuar
                  </Button>
                </div>
              </>
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
                  <h2 className="text-2xl md:text-3xl font-bold mb-3">
                    {currentGame.title}
                  </h2>
                  <p className="text-white/90">Seleccioná quién habla en cada intervención</p>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="text-sm font-semibold mb-2">Posibles hablantes</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentGame.speakers.map((speaker) => (
                      <span key={speaker} className="px-2 py-1 rounded bg-white/20 text-sm">{speaker}</span>
                    ))}
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-6 max-h-[50vh] overflow-y-auto">
                  <div className="space-y-6">
                    {currentGame.dialogues.map((dialogue, index) => (
                      <div key={`dialogue-${index}`} className="space-y-2">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="text-white/90 text-base leading-relaxed">
                              {dialogue.text}
                            </div>
                            <select
                              value={userSelections[index] || ""}
                              onChange={(e) => handleSpeakerSelect(index, e.target.value)}
                              disabled={timeExpired}
                              className={`w-full px-3 py-2 rounded border-2 font-semibold text-sm ${userSelections[index]
                                ? "bg-blue-500/30 border-blue-400 text-white"
                                : "bg-white/10 border-white/30 text-white/70"
                                } ${timeExpired ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-white/20"}`}
                            >
                              <option value="" className="bg-gray-800 text-white/70">
                                -- Seleccioná un hablante --
                              </option>
                              {currentGame.speakers.map((speaker) => (
                                <option key={speaker} value={speaker} className="bg-gray-800 text-white">
                                  {speaker}
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
                    onClick={() => setShowAnswer(true)}
                    size="lg"
                    disabled={!allSelectionsComplete || timeExpired}
                    className={`font-semibold ${!allSelectionsComplete || timeExpired
                      ? "bg-white/20 text-white/50 cursor-not-allowed"
                      : "bg-white text-[#0ea5e9] hover:bg-white/90"
                      }`}
                  >
                    Ver Respuesta
                  </Button>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
