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
  // {
  //   option: "Mapas",
  //   title: "Completar mapas conceptuales",
  //   time: "30",
  //   description: "Se les comparte un mapa incompleto y se le solicita al usuario indicar lo que falta",
  //   style: { backgroundColor: "#f59e0b", textColor: "#ffffff" },
  // },
  // {
  //   option: "Línea Tiempo",
  //   title: "Completar líneas de tiempo",
  //   time: "15",
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
  {
    option: "Sobre DICTA",
    title: "Preguntas de DICTA",
    time: "10",
    description: "Que hable del funcionamiento de DICTA, basándose en el folleto",
    style: { backgroundColor: "#6366f1", textColor: "#ffffff" },
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

  useEffect(() => {
    if (showModal || showDictaGame) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [showModal, showDictaGame])

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

  return (
    <div className="dicta-landing min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* Header */}
      

      {/* Sección principal: siempre visible en viewport */}
      <div className="flex flex-col justify-center items-center text-center py-4">
        <div className="space-y-4 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
            ¡Girá la Ruleta, Jugá y Ganá!
          </h1>
          {/* <p className="text-base md:text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Prueba tu suerte y descubre qué premio te espera. Cada giro es una oportunidad única.
            </p> */}
        </div>

        <div className="flex justify-center mb-6">
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            data={prizes}
            onStopSpinning={handleStopSpinning}
            outerBorderColor="#1e293b"
            outerBorderWidth={8}
            innerBorderColor="#1e293b"
            innerBorderWidth={4}
            radiusLineColor="#1e293b"
            radiusLineWidth={2}
            fontSize={14}
            textDistance={70}
            spinDuration={0.5}
          />
        </div>

        {/* Spin Button */}
        <div>
          <Button size="lg" onClick={spinWheel} disabled={mustSpin} className="text-lg px-8 py-6 h-auto">
            {mustSpin ? "Girando..." : "¡Girar la Ruleta!"}
          </Button>
        </div>
      </div>

      {/* Prizes List - Debajo de la sección principal */}
      <div className="max-w-4xl mx-auto pb-8">
        <Card className="p-6 md:p-8 text-left">
          <h2 className="text-xl font-bold text-foreground mb-4">Juegos Disponibles:</h2>
          <div className="grid gap-4">
            {prizes.map((prize, index) => (
              <div key={index} className="flex gap-3">
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0 mt-1"
                  style={{ backgroundColor: prize.style.backgroundColor }}
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{prize.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{prize.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
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
    </div>
  )
}
