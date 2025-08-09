import { Route, Routes } from 'react-router'
/* ------------------------------- COMPONENTS ------------------------------- */
import AppLayout from '@/components/layout/app-layout'
/* ---------------------------------- PAGES --------------------------------- */
import LoginPage from '@/pages/login/route'
import RegistroPage from '@/pages/registro/route'
import InicioPage from '@/pages/inicio/route'
import HerramientasPage from '@/pages/herramientas/route'
import { Button } from '@/components/ui/button'
import { getPath } from '@/data/paths.data'

function App() {
  return (
    <Routes>
      <Route path={getPath('login').url} element={<LoginPage />} />
      <Route path={getPath('registro').url} element={<RegistroPage />} />
      <Route path="/" element={<AppLayout />}>
        <Route index element={<InicioPage />} />
        <Route path={getPath('transcripcion').url} element={<HerramientasPage />} />
      </Route>
      <Route
        path="*"
        element={
          <div className="flex flex-col items-center justify-center">
            <p>Página no encontrada</p>
            <div>
              <Button>
                <a href={getPath('inicio').url}>Inicio</a>
              </Button>
            </div>
          </div>
        }
      />
    </Routes>
  )
}

export default App
