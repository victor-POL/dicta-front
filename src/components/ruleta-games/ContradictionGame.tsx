import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button_landing"
import { Card } from "@/components/ui/card_landing"
import { X } from "lucide-react"

interface ContradictionGameProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly timeLimit: number
}

interface ContradictionGameData {
  title: string
  dialogues: string
  contradictions: string[]
}

const contradictionGames: ContradictionGameData[] = [
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

const formatDialogues = (text: string) => {
  return text.split('\n').map((line, index) => {
    const match = line.match(/^([A-ZÁÉÍÓÚÑÜ][A-ZÁÉÍÓÚÑÜ\s]*(?:\([^)]*\))?):(.*)/)
    if (match) {
      const [, speaker, dialogue] = match
      return (
        <div key={`dialogue-${index}`} className="mb-2">
          <span className="font-bold">{speaker}:</span>
          <span>{dialogue}</span>
        </div>
      )
    }
    return <div key={`line-${index}`} className="mb-2">{line}</div>
  })
}

export function ContradictionGame({ isOpen, onClose, timeLimit }: ContradictionGameProps) {
  const [currentGame, setCurrentGame] = useState<ContradictionGameData | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [timeExpired, setTimeExpired] = useState(false)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const randomGame = contradictionGames[Math.floor(Math.random() * contradictionGames.length)]
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
        <Card className="relative max-w-4xl w-full p-8 border-4 animate-in zoom-in-95 duration-500 shadow-2xl bg-[#8b5cf6] border-[#8b5cf6] my-auto">
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
                    <div className="space-y-6">
                      <div className="text-center">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6">
                          {currentGame.title}
                        </h2>
                        <p className="text-white/90">Vuelve a leer los diálogos:</p>
                      </div>

                      <div className="bg-white/10 rounded-lg p-6">
                        <div className="text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                          {formatDialogues(currentGame.dialogues)}
                        </div>
                      </div>
                    </div>

                    <div className="text-center space-y-3">
                      <Button
                        onClick={() => setShowContent(false)}
                        size="lg"
                        className="bg-white/20 text-white hover:bg-white/30 font-semibold mr-4"
                      >
                        Ver Contradicciones
                      </Button>
                      <Button
                        onClick={onClose}
                        size="lg"
                        className="bg-white text-[#8b5cf6] hover:bg-white/90 font-semibold"
                      >
                        Continuar
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="text-6xl mb-4">⚠️</div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-6">
                          {currentGame.title}
                        </h2>
                        <h3 className="text-xl font-semibold mb-6">Contradicciones Identificadas</h3>
                      </div>

                      <div className="space-y-4">
                        {currentGame.contradictions.map((contradiction, index) => (
                          <div key={`contradiction-${index}`} className="bg-red-500/20 rounded-lg p-4 border-l-4 border-red-400">
                            <div className="flex items-start gap-3">
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-400 text-white flex items-center justify-center text-sm font-bold">
                                {index + 1}
                              </span>
                              <p className="text-base md:text-lg flex-1">{contradiction}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-center space-y-3">
                      <Button
                        onClick={() => setShowContent(true)}
                        size="lg"
                        className="bg-white/20 text-white hover:bg-white/30 font-semibold mr-4"
                      >
                        Ver Diálogos Originales
                      </Button>
                      <Button
                        onClick={onClose}
                        size="lg"
                        className="bg-white text-[#8b5cf6] hover:bg-white/90 font-semibold"
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
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">
                    {currentGame.title}
                  </h2>
                  <p className="text-white/90">Identifica las contradicciones en los testimonios:</p>
                </div>

                <div className="bg-white/10 rounded-lg p-6">
                  <div className="text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                    {formatDialogues(currentGame.dialogues)}
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    onClick={() => setShowAnswer(true)}
                    size="lg"
                    className="bg-white text-[#8b5cf6] hover:bg-white/90 font-semibold"
                  >
                    Ver Contradicciones
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
