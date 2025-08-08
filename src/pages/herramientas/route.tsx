import Paneles from '@/components/Paneles'
import { useLocation } from 'react-router'

const HerramientasPage = () => {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const hash = params.get('hash') ?? 'default'
  return (
  <div className="flex flex-1 flex-col gap-4 p-4 min-h-0 h-full">
      <Paneles initialHash={hash} />
    </div>
  )
}

export default HerramientasPage
