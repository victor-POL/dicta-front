import { Route, Routes } from 'react-router'
import Paneles from './components/Paneles'

function App() {
  return (
    <Routes>
      <Route
        path="/herramientas"
        element={
          <div style={{ padding: '20px' }}>
            <h1 style={{ color: 'white' }}>Diseño con paneles</h1>
            <Paneles />
          </div>
        }
      />
      <Route path="*" element={<div>Página no encontrada</div>} />
    </Routes>
  )
}

export default App
