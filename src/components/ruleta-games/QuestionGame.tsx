import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button_landing"
import { Card } from "@/components/ui/card_landing"
import { X } from "lucide-react"

interface QuestionGameProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly timeLimit: number
}

interface QuestionGameData {
  title: string
  text: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const questionGames: QuestionGameData[] = [
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

// Variable para mantener el índice del juego actual entre instancias
let currentGameIndex = 0

export function QuestionGame({ isOpen, onClose, timeLimit }: QuestionGameProps) {
  const [currentGame, setCurrentGame] = useState<QuestionGameData | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [timeExpired, setTimeExpired] = useState(false)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  useEffect(() => {
    if (isOpen) {
      // Obtener el juego actual en orden
      const game = questionGames[currentGameIndex]
      setCurrentGame(game)
      
      // Avanzar al siguiente índice para la próxima vez
      currentGameIndex = (currentGameIndex + 1) % questionGames.length
      
      setTimeLeft(timeLimit)
      setShowAnswer(false)
      setTimeExpired(false)
      setSelectedOption(null)
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
    <div className="fixed inset-0 z-50 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative flex items-start justify-center min-h-full p-4 py-8">
        <Card className="relative max-w-4xl w-full p-8 border-4 animate-in zoom-in-95 duration-500 shadow-2xl bg-[#ec4899] border-[#ec4899] my-auto">
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
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-6xl mb-4">{isCorrect ? "🎉" : "❌"}</div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-6">
                      {isCorrect ? "¡Correcto!" : "Incorrecto"}
                    </h2>
                    <h3 className="text-xl font-semibold mb-4">{currentGame.title}</h3>
                  </div>

                  <div className="bg-white/10 rounded-lg p-6">
                    <p className="text-base md:text-lg leading-relaxed mb-4">{currentGame.text}</p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-lg font-semibold">Opciones:</p>
                    {currentGame.options.map((option, index) => (
                      <div
                        key={option}
                        className={`p-4 rounded-lg border-2 ${
                          index === currentGame.correctAnswer
                            ? "bg-green-500/30 border-green-300"
                            : index === selectedOption
                              ? "bg-red-500/30 border-red-300"
                              : "bg-white/10 border-white/30"
                        }`}
                      >
                        <p className="text-base md:text-lg">
                          {index + 1}. {option}
                          {index === currentGame.correctAnswer && " ✓"}
                          {index === selectedOption && index !== currentGame.correctAnswer && " ✗"}
                        </p>
                      </div>
                    ))}
                  </div>

                  {isCorrect && (
                    <div className="bg-green-500/20 rounded-lg p-6 border-l-4 border-green-400">
                      <p className="text-sm font-semibold mb-2">¿Por qué esta pregunta es relevante?</p>
                      <p className="text-base">{currentGame.explanation}</p>
                    </div>
                  )}

                  {!isCorrect && (
                    <div className="bg-red-500/20 rounded-lg p-6 border-l-4 border-red-400">
                      <p className="text-sm font-semibold mb-2">La pregunta correcta era:</p>
                      <p className="text-base mb-3">{currentGame.options[currentGame.correctAnswer]}</p>
                      <p className="text-sm font-semibold mb-2">¿Por qué?</p>
                      <p className="text-base">{currentGame.explanation}</p>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <Button
                    onClick={onClose}
                    size="lg"
                    className="bg-white text-[#ec4899] hover:bg-white/90 font-semibold"
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
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">
                    {currentGame.title}
                  </h2>
                  <p className="text-white/90 mb-4">¿Qué pregunta agregaría contexto relevante al caso?</p>
                </div>

                <div className="bg-white/10 rounded-lg p-6">
                  <p className="text-base md:text-lg leading-relaxed">{currentGame.text}</p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Selecciona la mejor opción:</h3>
                  {currentGame.options.map((option, index) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setSelectedOption(index)}
                      disabled={timeExpired}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        selectedOption === index
                          ? "bg-white text-[#ec4899] border-white"
                          : "bg-white/10 border-white/30 hover:bg-white/20"
                      } ${timeExpired ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <span className="text-base md:text-lg">
                        {index + 1}. {option}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="text-center">
                  <Button
                    onClick={() => {
                      if (selectedOption !== null) {
                        setIsCorrect(selectedOption === currentGame.correctAnswer)
                        setShowAnswer(true)
                      }
                    }}
                    size="lg"
                    disabled={selectedOption === null}
                    className="bg-white text-[#ec4899] hover:bg-white/90 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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
