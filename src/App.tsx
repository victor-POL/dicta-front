import { Route, Routes } from 'react-router'
/* ------------------------------- COMPONENTS ------------------------------- */
import AppLayout from '@/components/layout/app-layout'
/* ---------------------------------- PAGES --------------------------------- */
import LoginPage from '@/pages/login/route'
import RegistroPage from '@/pages/registro/route'
import InicioPage from '@/pages/inicio/route'
import HerramientasPage from '@/pages/herramientas/route'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegistroPage />} />
      <Route path="/" element={<AppLayout />}>
        <Route index element={<InicioPage />} />
        <Route path="herramientas" element={<HerramientasPage />} />
      </Route>
      <Route path="*" element={<div>Página no encontrada</div>} />
    </Routes>
  )
}

export default App
