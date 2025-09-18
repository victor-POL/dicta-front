@echo off
echo 🐳 Iniciando contenedores en modo desarrollo...
echo Los cambios en el código se reflejarán en tiempo real
echo.

REM Detener contenedores existentes si están corriendo
docker-compose down

REM Construir e iniciar contenedores
docker-compose up --build

echo.
echo ✅ Servicios disponibles:
echo    📱 Frontend: http://localhost:5173
echo    🚀 Backend: http://localhost:3001
echo    🗄️  Base de datos: localhost:5432
echo.
echo Para detener los servicios, presiona Ctrl+C