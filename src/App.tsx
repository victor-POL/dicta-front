import { Route, Routes } from 'react-router'
/* ------------------------------- COMPONENTS ------------------------------- */
import AppLayout from '@/components/layout/app-layout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { PublicRoute } from '@/components/auth/PublicRoute'
import { AuthProvider } from '@/contexts/AuthContext'
import { SocketProvider } from '@/contexts/SocketContext'
import { TranscripcionProgressProvider } from '@/contexts/TranscripcionProgressContext'
/* ---------------------------------- PAGES --------------------------------- */
import LoginPage from '@/pages/login/route'
import RegistroPage from '@/pages/registro/route'
import InicioPage from '@/pages/inicio/route'
import HerramientasPage from '@/pages/herramientas/route'
import { getPath } from '@/data/paths.data'
import PerfilPage from '@/pages/perfil/route'
import EstudiosPage from '@/pages/estudios/route'
import TranscribirPage from '@/pages/transcripciones/route'
import CasosPage from '@/pages/casos/route'
import PageNotFound from '@/pages/not-found/route'

function App() {
  return (
    <AuthProvider>
      <SocketProvider autoConnect={true} sessionHash="donadonadonadona">
        <TranscripcionProgressProvider>
          <Routes>
        {/* Rutas públicas - solo accesibles para usuarios no autenticados */}
        <Route
          path={getPath('login').url}
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path={getPath('registro').url}
          element={
            <PublicRoute>
              <RegistroPage />
            </PublicRoute>
          }
        />

        {/* Rutas protegidas - solo accesibles para usuarios autenticados */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<InicioPage />} />
          <Route path={getPath('transcripcion_en_vivo').url} element={<HerramientasPage />} />
          <Route path={getPath('perfil').url} element={<PerfilPage />} />
          <Route path={getPath('mis_estudios').url} element={<EstudiosPage />} />
          <Route path={getPath('casos').url} element={<CasosPage />} />
          <Route path={getPath('transcripciones').url} element={<TranscribirPage />} />
        </Route>

        {/* Ruta 404 */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
        </TranscripcionProgressProvider>
      </SocketProvider>
    </AuthProvider>
  )
}

export default App
