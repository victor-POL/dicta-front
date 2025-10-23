import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button_landing"
import { Card } from "@/components/ui/card_landing"
import { X } from "lucide-react"

interface SpeakerGameProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly timeLimit: number
}

interface SpeakerGameData {
  title: string
  speakers: string[]
  dialoguesAnon: string
  dialoguesSolved: string
}

const speakerGames: SpeakerGameData[] = [
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

const formatDialogues = (text: string) => {
  return text.split('\n').map((line, index) => {
    const match = line.match(/^([A-ZÁÉÍÓÚÑÜ][A-ZÁÉÍÓÚÑÜ\s]*(?:\([^)]*\))?):(.*)/)
    if (match) {
      const [, speaker, dialogue] = match
      return (
        <div key={`speaker-${index}`} className="mb-2">
          <span className="font-bold">{speaker}:</span>
          <span>{dialogue}</span>
        </div>
      )
    }
    return <div key={`text-${index}`} className="mb-2">{line}</div>
  })
}

export function SpeakerGame({ isOpen, onClose, timeLimit }: SpeakerGameProps) {
  const [currentGame, setCurrentGame] = useState<SpeakerGameData | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [timeExpired, setTimeExpired] = useState(false)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const randomGame = speakerGames[Math.floor(Math.random() * speakerGames.length)]
      setCurrentGame(randomGame)
      setTimeLeft(timeLimit)
      setShowAnswer(false)
      setTimeExpired(false)
      setShowContent(false)
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
                {showContent ? (
                  <>
                    <div className="bg-white/10 rounded-lg p-6">
                      <div className="text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                        {formatDialogues(currentGame.dialoguesAnon)}
                      </div>
                    </div>

                    <div className="text-center space-y-3">
                      <Button
                        onClick={() => setShowContent(false)}
                        size="lg"
                        className="bg-white/20 text-white hover:bg-white/30 font-semibold mr-4"
                      >
                        Ver Respuesta
                      </Button>
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
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="text-6xl mb-4">🗣️</div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-6">
                          {currentGame.title}
                        </h2>
                        <h3 className="text-xl font-semibold mb-6">Intervenciones con hablantes</h3>
                      </div>

                      <div className="bg-white/10 rounded-lg p-6">
                        <div className="text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                          {formatDialogues(currentGame.dialoguesSolved)}
                        </div>
                      </div>
                    </div>

                    <div className="text-center space-y-3">
                      <Button
                        onClick={() => setShowContent(true)}
                        size="lg"
                        className="bg-white/20 text-white hover:bg-white/30 font-semibold mr-4"
                      >
                        Ver Versión Anónima
                      </Button>
                      <Button
                        onClick={onClose}
                        size="lg"
                        className="bg-white text-[#0ea5e9] hover:bg-white/90 font-semibold"
                      >
                        Continuar
                      </Button>
                    </div>
                  </>
                )}
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
                  <p className="text-white/90">Asigna mentalmente quién habla en cada intervención.</p>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="text-sm font-semibold mb-2">Posibles hablantes</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentGame.speakers.map((speaker) => (
                      <span key={speaker} className="px-2 py-1 rounded bg-white/20 text-sm">{speaker}</span>
                    ))}
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-6">
                  <div className="text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                    {formatDialogues(currentGame.dialoguesAnon)}
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    onClick={() => setShowAnswer(true)}
                    size="lg"
                    className="bg-white text-[#0ea5e9] hover:bg-white/90 font-semibold"
                  >
                    Ver Quién Habló
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
