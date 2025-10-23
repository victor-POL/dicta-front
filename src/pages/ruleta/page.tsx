import { useState } from "react"
import { Button } from "@/components/ui/button_landing"
import { Card } from "@/components/ui/card_landing"
import { X } from "lucide-react"
import { Wheel } from "react-custom-roulette"
import "../landing/landing.css"
import {
  DictaGame,
  TimelineGame,
  MapGame,
  ContradictionGame,
  QuestionGame,
  SpeakerGame
} from "@/components/ruleta-games"

const prizes = [
  {
    option: "Contradicción",
    title: "Identificar contradicción",
    time: "50",
    description: "Se les da un párrafo y 50 segundos donde van a tener que identificar la contradicción",
    style: { backgroundColor: "#8b5cf6", textColor: "#ffffff" },
  },
  {
    option: "Preguntas",
    title: "Sugerir preguntas",
    time: "80",
    description:
      "Se les da un párrafo y 80 segundos donde van a tener que identificar la pregunta que mejor contexto agregue",
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
    description: "Se les comparte un mapa incompleto y se le solicita al usuario indicar lo que falta en 90 segundos",
    style: { backgroundColor: "#f59e0b", textColor: "#ffffff" },
  },
  {
    option: "Línea Tiempo",
    title: "Completar líneas de tiempo",
    time: "120",
    description: "Se les comparte una línea de tiempo y se le solicita al usuario indicar lo que falta en 120 segundos",
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
    time: "120",
    description: "Asigna quién dijo cada intervención según el contenido en 120 segundos.",
    style: { backgroundColor: "#0ea5e9", textColor: "#ffffff" },
  },
  {
    option: "Sobre DICTA",
    title: "Preguntas de DICTA",
    time: "20",
    description: "Que responda preguntas sobre DICTA en 20 segundos.",
    style: { backgroundColor: "#6366f1", textColor: "#ffffff" },
  },
]

export default function RuletaPage() {
  const [mustSpin, setMustSpin] = useState(false)
  const [prizeNumber, setPrizeNumber] = useState(0)
  const [winner, setWinner] = useState<string | null>(null)
  const [winnerColor, setWinnerColor] = useState<string>("")
  const [showModal, setShowModal] = useState(false)

  const [showDictaGame, setShowDictaGame] = useState(false)
  const [showTimelineGame, setShowTimelineGame] = useState(false)
  const [showMapGame, setShowMapGame] = useState(false)
  const [showContradictionGame, setShowContradictionGame] = useState(false)
  const [showQuestionGame, setShowQuestionGame] = useState(false)
  const [showSpeakerGame, setShowSpeakerGame] = useState(false)

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

  const startGame = () => {
    setShowModal(false)
    const gameType = prizes[prizeNumber].option

    if (gameType === "Sobre DICTA") {
      setShowDictaGame(true)
    } else if (gameType === "Línea Tiempo") {
      setShowTimelineGame(true)
    } else if (gameType === "Mapas") {
      setShowMapGame(true)
    } else if (gameType === "Contradicción") {
      setShowContradictionGame(true)
    } else if (gameType === "Preguntas") {
      setShowQuestionGame(true)
    } else if (gameType === "Hablantes") {
      setShowSpeakerGame(true)
    }
  }

  return (
    <div className="dicta-landing min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="mt-12">
        <img
          src="/logos/dicta.png"
          alt="DICTA Logo"
          className="h-32 md:h-48 w-auto mx-auto"
        />
      </div>

      <div className="flex flex-col justify-center items-center text-center py-4 mt-5">
        <div className="space-y-4 mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground text-balance">
            ¡Girá la Ruleta, Jugá y Ganá!
          </h1>
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

        <div>
          <Button size="lg" onClick={spinWheel} disabled={mustSpin} className="text-[6rem] md:text-[8rem] px-48 py-40 h-auto font-bold min-w-[75px] md:min-w-[300px] min-h-[75px]">
            {mustSpin ? "GIRANDO..." : "¡GIRAR!"}
          </Button>
        </div>
      </div>

      {showModal && winner && (
        <div className="fixed inset-0 z-50 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/50" />

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
                  onClick={startGame}
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

      <DictaGame
        isOpen={showDictaGame}
        onClose={() => setShowDictaGame(false)}
        timeLimit={Number.parseInt(prizes[prizeNumber]?.time || "10")}
      />

      <TimelineGame
        isOpen={showTimelineGame}
        onClose={() => setShowTimelineGame(false)}
        timeLimit={Number.parseInt(prizes[prizeNumber]?.time || "120")}
      />

      <MapGame
        isOpen={showMapGame}
        onClose={() => setShowMapGame(false)}
        timeLimit={Number.parseInt(prizes[prizeNumber]?.time || "90")}
      />

      <ContradictionGame
        isOpen={showContradictionGame}
        onClose={() => setShowContradictionGame(false)}
        timeLimit={Number.parseInt(prizes[prizeNumber]?.time || "30")}
      />

      <QuestionGame
        isOpen={showQuestionGame}
        onClose={() => setShowQuestionGame(false)}
        timeLimit={Number.parseInt(prizes[prizeNumber]?.time || "60")}
      />

      <SpeakerGame
        isOpen={showSpeakerGame}
        onClose={() => setShowSpeakerGame(false)}
        timeLimit={Number.parseInt(prizes[prizeNumber]?.time || "45")}
      />
    </div>
  )
}
