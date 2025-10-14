import { Button } from "@/components/ui/button_landing"
import { Card } from "@/components/ui/card_landing"
import { Input } from "@/components/ui/input_landing"
import { Textarea } from "@/components/ui/textarea_landing"
import { Mic, Users, Lightbulb, Scale, ArrowRight, Send } from "lucide-react"
import { ScrollFade } from "@/components/scroll-fade"
import { useNavigate } from "react-router"
import { getPath } from "@/data/paths.data"
import { toast, Toaster } from "sonner"
import { useState } from "react"
import "./landing.css"

export default function DictaLanding() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const form = e.currentTarget
    
    setIsSubmitting(true)
    
    setTimeout(() => {
      form.reset()
      
      setIsSubmitting(false)
      
      toast.success("¡Mensaje enviado!", {
        description: "Gracias por contactarnos. Te responderemos pronto.",
        duration: 4000,
      })
    }, 1500)
  }

  return (
    <div className="dicta-landing min-h-screen bg-background" id="top">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8 ml-8">
            <a href="#top" className="flex items-center hover:opacity-80 transition-opacity cursor-pointer">
              <img 
                src="/logos/dicta.png" 
                alt="DICTA" 
                width={40} 
                height={40}
                className="rounded"
              />
            </a>
            <nav className="hidden md:flex gap-6">
              <a href="#que-es" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                ¿Qué es?
              </a>
              <a
                href="#caracteristicas"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Características
              </a>
              <a href="#resultados" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Resultados
              </a>
              <a href="#equipo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Equipo
              </a>
              <a href="#linkedin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                LinkedIn
              </a>
            </nav>
          </div>
          <a href="#contacto">
            <Button variant="default" size="sm" className="mr-8">
              Contactar
            </Button>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 pt-24 md:pt-32">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src="/videos/dicta.webm" type="video/webm" />
          </video>
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <ScrollFade>
              <div className="space-y-6">
                <div className="flex flex-col items-center gap-4">
                  <img 
                    src="/logos/logo_mejorado_4x.png" 
                    alt="DICTA Logo" 
                    width={300} 
                    height={300}
                    className="rounded-lg"
                  />
                  <p className="text-lg md:text-xl text-white/90 text-pretty italic text-center">
                    Inteligencia legal en tiempo real.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button size="lg" className="gap-2" onClick={() => navigate(getPath("inicio").url)}>
                    Ver Demo <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                    onClick={() => navigate(getPath("ruleta").url)}
                  >
                    Jugar Ruleta
                  </Button>
                </div>
              </div>
            </ScrollFade>
          </div>
        </div>
      </section>

      {/* What is DICTA Section */}
      <section id="que-es" className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          <ScrollFade>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance">¿Qué es DICTA?</h2>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p className="text-pretty">
                  Dicta es una{" "}
                  <span className="text-foreground font-semibold">
                    plataforma informática desarrollada para asistir en audiencias orales públicas
                  </span>
                  . A partir de grabaciones de audio o video, genera una{" "}
                  <span className="text-foreground font-semibold">transcripción automática</span> del contenido,
                  identifica a los hablantes, genera marcas de tiempo precisas, detecta contradicciones y emociones, y
                  sugiere preguntas en tiempo real según el contexto.
                </p>
                <p className="text-pretty">
                  Su asistente legal, impulsado por{" "}
                  <span className="text-foreground font-semibold">inteligencia artificial</span>, permite interactuar
                  con el contenido de forma ágil y precisa. Dicta brinda herramientas innovadoras más allá de las
                  soluciones tradicionales del ámbito judicial.
                </p>
              </div>

              <div className="mt-8">
                <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl bg-muted">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/mTzWbvQh-rw?autoplay=0&iv_load_policy=3"
                    title="DICTA - Video de Presentación"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          </ScrollFade>
        </div>
      </section>

      {/* Features Section */}
      <section id="caracteristicas" className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <ScrollFade>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
                Características Principales
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                Tecnología de vanguardia para transformar el proceso judicial
              </p>
            </div>
          </ScrollFade>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
            <ScrollFade delay={100}>
              <Card className="p-8 space-y-6 bg-card hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mic className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Transcripción Automática</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <Mic className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Ingresa el Audio</p>
                      <p className="text-sm text-muted-foreground">Sube grabaciones de audio o video de la audiencia</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Identificar Hablantes</p>
                      <p className="text-sm text-muted-foreground">Reconocimiento automático de participantes</p>
                    </div>
                  </div>
                </div>
              </Card>
            </ScrollFade>

            <ScrollFade delay={200}>
              <Card className="p-8 space-y-6 bg-card hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Sugerencias de Contexto</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <Lightbulb className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Análisis Contextual</p>
                      <p className="text-sm text-muted-foreground">Sugerencias inteligentes basadas en el contenido</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <Scale className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Asistente Legal</p>
                      <p className="text-sm text-muted-foreground">IA especializada en contexto judicial</p>
                    </div>
                  </div>
                </div>
              </Card>
            </ScrollFade>
          </div>

          {/* Process Flow */}
          <ScrollFade delay={300}>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Mic className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground">1. Captura</h4>
                  <p className="text-sm text-muted-foreground">Grabación de audio o video de la audiencia</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground">2. Procesamiento</h4>
                  <p className="text-sm text-muted-foreground">Transcripción e identificación automática</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Scale className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground">3. Asistencia</h4>
                  <p className="text-sm text-muted-foreground">Análisis y sugerencias contextuales</p>
                </div>
              </div>
            </div>
          </ScrollFade>
        </div>
      </section>

      {/* Results Section */}
      <section id="resultados" className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          <ScrollFade>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance">Resultados</h2>
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground text-pretty">
                  Las audiencias orales generan grandes volúmenes de información en muy poco tiempo, lo que
                  históricamente se traduce en{" "}
                  <span className="text-foreground font-semibold">
                    demoras, sobrecarga de trabajo y procesos manuales
                  </span>{" "}
                  muy tediosos.
                </p>
                <p className="text-lg text-muted-foreground text-pretty">
                  Con Dicta, estas tareas se automatizan: transcribe el audio en tiempo real, identifica a los
                  hablantes, marca los momentos clave, sugiere preguntas contextuales, detecta contradicciones y analiza
                  emociones.
                </p>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mt-8">
                  <p className="text-lg text-foreground font-medium text-pretty">
                    El resultado es una <span className="text-primary font-bold">gestión más ágil y precisa</span> de la
                    audiencia, que reduce tiempos de trabajo, evita pérdidas de información y permite que los
                    profesionales jurídicos se concentren en el análisis y la toma de decisiones, en lugar de tareas
                    rutinarias.
                  </p>
                </div>
              </div>
            </div>
          </ScrollFade>
        </div>
      </section>

      {/* Team Section */}
      <section id="equipo" className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <ScrollFade>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center text-balance">Equipo</h2>
            </ScrollFade>
            <div className="grid md:grid-cols-2 gap-8">
              <ScrollFade delay={100}>
                <Card className="p-8 bg-card">
                  <h3 className="text-xl font-bold text-foreground pb-3 border-b border-border">Docentes</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-foreground">Jefe de cátedra</p>
                      <p className="text-muted-foreground">Roberto Uribe</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Tutores</p>
                      <ul className="text-muted-foreground space-y-1">
                        <li>Mariano Bucher</li>
                        <li>Fernando Paker</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </ScrollFade>

              <ScrollFade delay={200}>
                <Card className="p-8 bg-card">
                  <h3 className="text-xl font-bold text-foreground pb-3 border-b border-border">Alumnos</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>Víctor Povoli</li>
                    <li>Donatella Fragassi</li>
                    <li>Manuel Ruiz Díaz</li>
                    <li>Agustín Contreras</li>
                    <li>Gian Luca Simonetti</li>
                  </ul>
                </Card>
              </ScrollFade>
            </div>
          </div>
        </div>
      </section>

      {/* LinkedIn Profiles Section */}
      <section id="linkedin" className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          <ScrollFade>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
                Conéctate con el Equipo
              </h2>
              <p className="text-lg text-muted-foreground text-pretty">
                Conoce más sobre los miembros del equipo en LinkedIn
              </p>
            </div>
          </ScrollFade>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "Víctor Povoli",
                linkedin: "https://www.linkedin.com/in/victor-povoli/",
                image: "/profile_pictures/victor.jpg",
              },
              {
                name: "Donatella Fragassi",
                linkedin: "https://www.linkedin.com/in/fragassidonatella/",
                image: "/profile_pictures/dona.jpg",
              },
              {
                name: "Manuel Ruiz Díaz",
                linkedin: "https://www.linkedin.com/in/manuel-ruiz-diaz/",
                image: "/profile_pictures/manu.jpg",
              },
              {
                name: "Agustín Contreras",
                linkedin: "https://www.linkedin.com/in/agustin-contreras/",
                image: "/profile_pictures/contre.png",
              },
              {
                name: "Gian Luca Simonetti",
                linkedin: "https://www.linkedin.com/in/gian-luca-simonetti/",
                image: "/profile_pictures/gian.jpg",
              },
            ].map((member, index) => (
              <ScrollFade key={member.name} delay={index * 50}>
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="group block">
                  <Card className="p-4 text-center hover:shadow-lg transition-all hover:-translate-y-1">
                    <div className="relative w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden bg-muted">
                      <img
                        src={member.image || "/placeholder.svg"}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">Ver perfil →</p>
                  </Card>
                </a>
              </ScrollFade>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contacto" className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <ScrollFade>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">Contáctanos</h2>
                <p className="text-lg text-muted-foreground text-pretty">
                  ¿Tienes preguntas? Envíanos un mensaje y te responderemos pronto
                </p>
              </div>
            </ScrollFade>

            <ScrollFade delay={100}>
              <Card className="p-8 bg-card">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-foreground">
                        Nombre
                      </label>
                      <Input id="name" placeholder="Tu nombre" required disabled={isSubmitting} />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-foreground">
                        Email
                      </label>
                      <Input id="email" type="email" placeholder="tu@email.com" required disabled={isSubmitting} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="organization" className="text-sm font-medium text-foreground">
                      Organización
                    </label>
                    <Input id="organization" placeholder="Tu organización o institución" disabled={isSubmitting} />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-foreground">
                      Mensaje
                    </label>
                    <Textarea id="message" placeholder="Cuéntanos cómo podemos ayudarte..." rows={5} required disabled={isSubmitting} />
                  </div>
                  <Button type="submit" size="lg" className="w-full gap-2" disabled={isSubmitting}>
                    <Send className="w-4 h-4" />
                    {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
                  </Button>
                </form>
              </Card>
            </ScrollFade>

            <ScrollFade delay={200}>
              <div className="mt-8 text-center space-y-2">
                <p className="text-sm text-muted-foreground">O contáctanos directamente:</p>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <a href="mailto:hola@dicta.ar" className="text-primary hover:underline">
                    hola@dicta.ar
                  </a>
                </div>
              </div>
            </ScrollFade>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12 lg:px-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-foreground mb-1">DICTA</h3>
              <p className="text-sm text-muted-foreground">Inteligencia legal en tiempo real</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Contacto</h4>
              <p className="text-sm text-muted-foreground">hola@dicta.ar</p>
            </div>
            <div>
              <div className="flex gap-6">
                <div className="flex flex-col items-center gap-2">
                  <img src="/logos/unlam.jpg" alt="UNLaM" className="h-16 w-auto object-contain" />
                  <p className="text-xs text-muted-foreground text-center">Universidad Nacional de La Matanza</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <img src="/logos/diit.png" alt="DIIT" className="h-16 w-auto object-contain" />
                  <p className="text-xs text-muted-foreground text-center">DIIT - Departamento de Ingeniería</p>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© 2025 DICTA.</p>
          </div>
        </div>
      </footer>
      
      {/* Toast notifications */}
      <Toaster />
    </div>
  )
}
