import Paneles from '@/components/Paneles'
import { useEffect, useLayoutEffect } from 'react'

const HerramientasPage = () => {
  // useLayoutEffect se ejecuta de forma síncrona antes del repaint
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    const mainElement = document.querySelector('main')
    if (mainElement) {
      mainElement.scrollTop = 0
    }
  }, [])

  // Asegurar que la página siempre empiece desde arriba
  useEffect(() => {
    const resetScroll = () => {
      window.scrollTo(0, 0)
      // También resetear scroll en el elemento padre si existe
      const mainElement = document.querySelector('main')
      if (mainElement) {
        mainElement.scrollTop = 0
      }
      // Prevenir cualquier scroll automático de componentes hijos
      const scrollContainers = document.querySelectorAll('[data-scroll-container]')
      scrollContainers.forEach(container => {
        if (container instanceof HTMLElement) {
          container.scrollTop = 0
        }
      })
    }

    resetScroll()
    
    // Resetear después de que todos los componentes se hayan montado
    const timeoutId = setTimeout(resetScroll, 100)
    
    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex-1 min-h-0">
        <Paneles />
      </div>
    </div>
  )
}

export default HerramientasPage
