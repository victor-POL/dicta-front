import { useLocation } from 'react-router'
import { getPathByUrl } from '@/data/paths.data'

export function usePageTitle() {
  const location = useLocation()
  
  const currentPath = getPathByUrl(location.pathname)
  
  return {
    title: currentPath?.title || 'Dicta',
    description: currentPath?.description,
    icon: currentPath?.icon
  }
}
