import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button_landing"
import { Card } from "@/components/ui/card_landing"
import { X } from "lucide-react"

interface DictaGameProps {
  isOpen: boolean
  onClose: () => void
  timeLimit: number
}

const dictaQuestions = [
  {
    question: "¿Qué hace DICTA?",
    options: [
      "Genera fallos judiciales basados en precedentes legales.",
      "Graba videos de las audiencias",
      "Traduce documentos jurídicos a otros idiomas.",
      "Transcribe audiencias judiciales y analiza la información en tiempo real."
    ],
    correctAnswer: 3
  },
  {
    question: "¿Qué herramienta o tecnología incluye DICTA?",
    options: [
      "Elaboracion de un veredicto final.",
      "Traducción simultánea al inglés.",
      "Detección de contradicciones.",
      "Escaneo de documentos físicos.",
    ],
    correctAnswer: 2
  },
  {
    question: "¿De qué formas es posible obtener una transcripción en DICTA?",
    options: [
      "Solo escribiendo manualmente lo que dice cada persona.",
      "Desde archivos de audio o videos YouTube.",
      "Desde un podcast en vivo.",
      "Cargando documentos PDF con el contenido de la audiencia."
    ],
    correctAnswer: 1
  },
  {
    question: "¿Qué analiza DICTA para reconocer emociones?",
    options: [
      "Las expresiones faciales de los asistentes.",
      "Los gestos corporales registrados por una cámara.",
      "El tono y la forma de hablar de cada participante.",
      "Los mensajes escritos en el expediente judicial."
    ],
    correctAnswer: 2
  },
  {
    question: "¿DICTA genera informes al final de una audiencia?",
    options: [
      "No, solo guarda el audio",
      "Solo si se lo solicitan",
      "Sí, crea resúmenes automáticos",
      "Genera informes después de una semana"
    ],
    correctAnswer: 2
  },
  {
    question: "¿Para quién está pensada DICTA?",
    options: [
      "Solo para jueces",
      "Solo para abogados defensores",
      "Para auxiliares de la justicia, jueces, abogados, estudiantes, etc",
      "Únicamente para fiscales"
    ],
    correctAnswer: 2
  },
  {
    question: "¿Qué objetivo principal tiene el desarrollo de DICTA?",
    options: [
      "Optimizar el registro y análisis de audiencias judiciales",
      "Sustituir al juez en el proceso",
      "Crear un expediente digital único",
      "Capacitar a nuevos abogados"
    ],
    correctAnswer: 0
  }
]

// Variable para mantener el índice de la pregunta actual entre instancias
let currentQuestionIndex = 0

export function DictaGame({ isOpen, onClose, timeLimit }: DictaGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState<{ question: string, options: string[], correctAnswer: number } | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [timeExpired, setTimeExpired] = useState(false)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  useEffect(() => {
    if (isOpen) {
      // Obtener la pregunta actual en orden
      const question = dictaQuestions[currentQuestionIndex]
      setCurrentQuestion(question)

      // Avanzar al siguiente índice para la próxima vez
      currentQuestionIndex = (currentQuestionIndex + 1) % dictaQuestions.length

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

  if (!isOpen || !currentQuestion) return null

  return (
    <div className="fixed inset-0 z-50 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative flex items-center justify-center min-h-full p-4">
        <Card className="relative max-w-2xl w-full p-8 border-4 animate-in zoom-in-95 duration-500 shadow-2xl bg-[#6366f1] border-[#6366f1]">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="space-y-6 text-center text-white">
            {showAnswer ? (
              <>
                <div className="space-y-6">
                  <div className="text-6xl">{isCorrect ? "🎉" : "❌"}</div>
                  <h2 className="text-2xl md:text-3xl font-bold">
                    {isCorrect ? "¡Correcto!" : "Incorrecto"}
                  </h2>
                  <div className="text-left space-y-4">
                    <p className="text-xl font-semibold mb-4">
                      {currentQuestion.question}
                    </p>
                    {currentQuestion.options.map((option, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-2 ${index === currentQuestion.correctAnswer
                          ? "bg-green-500/30 border-green-300"
                          : index === selectedOption
                            ? "bg-red-500/30 border-red-300"
                            : "bg-white/10 border-white/30"
                          }`}
                      >
                        <p className="text-lg">
                          {String.fromCharCode(65 + index)}. {option}
                          {index === currentQuestion.correctAnswer && " ✓"}
                          {index === selectedOption && index !== currentQuestion.correctAnswer && " ✗"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={onClose}
                  size="lg"
                  className="bg-white text-[#6366f1] hover:bg-white/90 font-semibold"
                >
                  Continuar
                </Button>
              </>
            ) : (
              <>
                {timeExpired ? (
                  <div className="space-y-4">
                    <div className="text-6xl">⏰</div>
                    <div className="text-2xl font-bold text-red-200">
                      ¡Tiempo Agotado!
                    </div>
                  </div>
                ) : (
                  <div className="text-4xl font-bold">
                    {timeLeft}s
                  </div>
                )}

                <div className="space-y-4">
                  <h2 className="text-2xl md:text-3xl font-bold">
                    {currentQuestion.question}
                  </h2>
                </div>

                <div className="space-y-3 text-left">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedOption(index)}
                      disabled={timeExpired}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${selectedOption === index
                        ? "bg-white text-[#6366f1] border-white"
                        : "bg-white/10 border-white/30 hover:bg-white/20"
                        } ${timeExpired ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <span className="text-lg font-medium">
                        {String.fromCharCode(65 + index)}. {option}
                      </span>
                    </button>
                  ))}
                </div>

                <Button
                  onClick={() => {
                    if (selectedOption !== null) {
                      setIsCorrect(selectedOption === currentQuestion.correctAnswer)
                      setShowAnswer(true)
                    }
                  }}
                  size="lg"
                  disabled={selectedOption === null}
                  className="bg-white text-[#6366f1] hover:bg-white/90 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Ver Respuesta
                </Button>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
