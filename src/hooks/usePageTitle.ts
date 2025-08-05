import { useLocation } from 'react-router'
import { PATHS } from '@/data/paths.data'

export function usePageTitle() {
  const location = useLocation()
  
  const currentPath = PATHS.find(path => path.url === location.pathname)
  
  return {
    title: currentPath?.title || 'Dicta',
    description: currentPath?.description,
    icon: currentPath?.icon
  }
}
