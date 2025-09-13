const { Server } = require('socket.io');
const http = require('http');
const url = require('url');

// Crear servidor HTTP y Socket.IO
const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  transports: ['websocket', 'polling']
});

// Middleware para parsear JSON en requests HTTP
function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        resolve({});
      }
    });
  });
}

// Puerto del servidor
const PORT = 4001;

// Datos simulados
const MOCK_DATA = {
  // Datos de emociones simulados
  emociones: {
    success: true,
    data: {
      id: "mock-emotions-id",
      orador_detectado: "Juan Pérez",
      precision: 85.7,
      emociones: [
        { tipo: "Neutral", porcentaje: 35, color: "#6B7280", descripcion: "Estado emocional equilibrado" },
        { tipo: "Alegría", porcentaje: 25, color: "#F59E0B", descripcion: "Expresiones positivas y optimistas" },
        { tipo: "Confianza", porcentaje: 20, color: "#10B981", descripcion: "Seguridad en las afirmaciones" },
        { tipo: "Preocupación", porcentaje: 15, color: "#DC2626", descripcion: "Indicios de inquietud o ansiedad" },
        { tipo: "Sorpresa", porcentaje: 5, color: "#8B5CF6", descripcion: "Reacciones inesperadas" }
      ],
      fecha_analisis: new Date().toISOString(),
      duracion_audio: 150,
      confianza_general: 75,
      cached: false
    },
    cached: false,
    audio_hash: "mock-audio-hash"
  },

  // Datos de transcripción simulados
  transcripcion: {
    segments: [
      {
        id: 1,
        start: "00:00:00,000",
        end: "00:00:05,500",
        speaker: "Juan Pérez",
        text: "Buenos días, mi nombre es Juan Pérez y soy el abogado defensor."
      },
      {
        id: 2,
        start: "00:00:05,500",
        end: "00:00:12,000",
        speaker: "Juez Martínez",
        text: "Buenos días, licenciado Pérez. Puede proceder con su alegato inicial."
      },
      {
        id: 3,
        start: "00:00:12,000",
        end: "00:00:20,000",
        speaker: "Juan Pérez",
        text: "Gracias, su señoría. Mi cliente es inocente de los cargos presentados."
      },
      {
        id: 4,
        start: "00:00:20,000",
        end: "00:00:28,000",
        speaker: "Fiscal González",
        text: "Protesto, su señoría. La defensa está haciendo declaraciones sin fundamento."
      }
    ],
    final_transcription_path: "/mock/path/transcripcion.srt",
    cached: false,
    audio_hash: "mock-audio-hash-transcripcion"
  },

  // Datos de resumen simulados
  resumen: {
    data: {
      summary: `# Resumen de Audiencia Judicial

## Información General
- **Caso:** Causa Nº 12345/2024
- **Fecha:** ${new Date().toLocaleDateString()}
- **Duración:** 45 minutos

## Participantes
- **Juez:** Dr. Martínez
- **Fiscal:** Dra. González  
- **Defensor:** Lic. Juan Pérez
- **Imputado:** Carlos López

## Desarrollo de la Audiencia

### Alegato Inicial (00:00 - 15:00)
La defensa presentó su caso alegando la inocencia del imputado basándose en:
- Falta de pruebas contundentes
- Testimonios contradictorios
- Problemas en la cadena de custodia

### Presentación de Pruebas (15:00 - 30:00)
- Se presentaron 5 documentos como evidencia
- Testimonio del testigo principal
- Análisis pericial forense

### Alegatos Finales (30:00 - 45:00)
- Fiscal solicita pena de 3 años
- Defensa solicita absolución
- Juez anuncia que dictará sentencia en 15 días

## Resoluciones
1. Se acepta la incorporación de prueba documental
2. Se fija audiencia de sentencia para el 15/10/2024
3. El imputado permanece en libertad

## Observaciones
La audiencia se desarrolló con normalidad, respetando el debido proceso y los derechos de todas las partes.`,
      cached: false,
      audio_hash: "mock-audio-hash-resumen"
    },
    status: 'success'
  },

  // Datos de sugerencias simuladas
  sugerencias: {
    data: {
      questions: [
        {
          question: "¿Cuáles fueron las pruebas principales presentadas por la fiscalía?",
          reasoning: "Esta pregunta es relevante para entender la estrategia acusatoria y evaluar la fortaleza del caso."
        },
        {
          question: "¿Qué argumentos utilizó la defensa para solicitar la absolución?",
          reasoning: "Permite analizar la estrategia defensiva y los fundamentos legales invocados."
        },
        {
          question: "¿Cuál fue la posición del juez respecto a las pruebas presentadas?",
          reasoning: "Importante para evaluar la imparcialidad judicial y las consideraciones del tribunal."
        },
        {
          question: "¿Se mencionaron antecedentes penales del imputado?",
          reasoning: "Los antecedentes pueden influir en la pena y son relevantes para el análisis del caso."
        },
        {
          question: "¿Qué testigos declararon en la audiencia?",
          reasoning: "Los testimonios son fundamentales para reconstruir los hechos y evaluar credibilidad."
        },
        {
          question: "¿Hubo objeciones durante los alegatos?",
          reasoning: "Las objeciones revelan puntos controvertidos y estrategias procesales de las partes."
        },
        {
          question: "¿Se estableció algún plazo para presentar pruebas adicionales?",
          reasoning: "Los plazos procesales son cruciales para el desarrollo correcto del juicio."
        },
        {
          question: "¿Cuál fue la reacción del imputado ante los cargos?",
          reasoning: "La actitud del imputado puede ser relevante para la evaluación judicial del caso."
        },
        {
          question: "¿Se mencionó algún acuerdo de reparación del daño?",
          reasoning: "Los acuerdos reparatorios pueden influir en la resolución del conflicto penal."
        },
        {
          question: "¿Qué medidas cautelares se mantienen vigentes?",
          reasoning: "Las medidas cautelares afectan la libertad del imputado y deben ser justificadas."
        }
      ],
      cached: false,
      audio_hash: "mock-audio-hash-sugerencias"
    },
    status: 'success'
  },

  // Datos de contradicciones simuladas
  contradicciones: {
    contradicciones: [
      {
        id: 1,
        tipo: "testimonial",
        descripcion: "El testigo afirma haber visto al acusado a las 10:00 PM, pero en declaración previa dijo que fue a las 9:30 PM",
        participantes: ["Testigo López", "Declaración previa"],
        timestamp: "00:15:30",
        gravedad: "media"
      },
      {
        id: 2,
        tipo: "evidencia",
        descripcion: "La defensa presenta documento que contradice el informe pericial sobre la hora del incidente",
        participantes: ["Defensa", "Perito oficial"],
        timestamp: "00:22:15",
        gravedad: "alta"
      }
    ],
    resumen: "Se identificaron 2 contradicciones principales que podrían afectar el caso",
    cached: false
  },

  // Datos de cronología simulada
  cronologia: {
    eventos: [
      {
        timestamp: "2024-01-15 09:00:00",
        evento: "Inicio de audiencia",
        participante: "Juez Martínez",
        descripcion: "Se da inicio formal a la audiencia"
      },
      {
        timestamp: "2024-01-15 09:05:00",
        evento: "Verificación de partes",
        participante: "Secretario",
        descripcion: "Se verifica la presencia de todas las partes"
      },
      {
        timestamp: "2024-01-15 09:15:00",
        evento: "Alegato inicial defensa",
        participante: "Lic. Juan Pérez",
        descripcion: "Presentación de la teoría del caso de la defensa"
      },
      {
        timestamp: "2024-01-15 09:30:00",
        evento: "Presentación de pruebas fiscalía",
        participante: "Fiscal González",
        descripcion: "Incorporación de documentos y testimonios"
      },
      {
        timestamp: "2024-01-15 09:45:00",
        evento: "Alegatos finales",
        participante: "Ambas partes",
        descripcion: "Conclusiones finales de fiscalía y defensa"
      }
    ],
    duracion_total: "45 minutos",
    cached: false
  },

  // Datos de mapa conceptual simulado
  mapa: {
    nodos: [
      { id: "caso", label: "Causa 12345/2024", tipo: "principal" },
      { id: "imputado", label: "Carlos López", tipo: "persona" },
      { id: "delito", label: "Robo agravado", tipo: "cargo" },
      { id: "victima", label: "Comercio Local", tipo: "persona" },
      { id: "testigo1", label: "Testigo López", tipo: "persona" },
      { id: "evidencia1", label: "Video seguridad", tipo: "evidencia" }
    ],
    relaciones: [
      { from: "imputado", to: "delito", label: "acusado de" },
      { from: "delito", to: "victima", label: "contra" },
      { from: "testigo1", to: "imputado", label: "identificó a" },
      { from: "evidencia1", to: "delito", label: "muestra" }
    ],
    cached: false
  },

  // Usuarios mock para auth
  usuarios: [
    {
      correo: "admin@dicta.com",
      password: "admin123",
      nombre: "Admin",
      apellido: "Sistema",
      perfil: "admin",
      token: "mock-token-admin-123",
      estudiosAbogados: ["Estudio Principal", "Bufete Asociados"]
    },
    {
      correo: "usuario@dicta.com", 
      password: "usuario123",
      nombre: "Juan",
      apellido: "Pérez",
      perfil: "user",
      token: "mock-token-user-456",
      estudiosAbogados: ["Estudio Pérez & Asociados"]
    }
  ]
};

// Función para generar respuestas de chat
function generateChatResponse(message) {
  const responses = [
    `Entiendo tu consulta sobre "${message}". Basándome en la transcripción, puedo decir que...`,
    `Según lo que se discutió en la audiencia, "${message}" se relaciona con...`,
    `Respecto a "${message}", en el expediente se menciona que...`,
    `Para responder a "${message}", debo señalar que durante la audiencia...`,
    `Tu pregunta sobre "${message}" es muy pertinente. En el caso se estableció que...`
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

// Función para simular delay realista
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

console.log(`🚀 Servidor Socket.IO simulado iniciando en puerto ${PORT}...`);

io.on('connection', (socket) => {
  console.log(`✅ Cliente conectado: ${socket.id}`);
  
  // Manejo de eventos de autenticación
  socket.on('auth_login', async (data, callback) => {
    await delay(1000); // Simular procesamiento
    console.log('🔐 Login attempt:', data);
    
    const user = MOCK_DATA.usuarios.find(u => 
      u.correo === data.correo && u.password === data.password
    );
    
    if (user) {
      const response = {
        nombre: user.nombre,
        apellido: user.apellido,
        correo: user.correo,
        perfil: user.perfil,
        token: user.token,
        estudiosAbogados: user.estudiosAbogados,
        urlFotoPerfil: `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/200/300`
      };
      socket.emit('auth_login_response', response);
      console.log('✅ Login exitoso para:', user.correo);
    } else {
      socket.emit('auth_login_response', { error: 'Credenciales inválidas' });
      console.log('❌ Login fallido para:', data.correo);
    }
  });

  socket.on('auth_register', async (data) => {
    await delay(1500);
    console.log('📝 Register attempt:', data);
    
    const newUser = {
      nombre: data.nombre,
      apellido: data.apellido,
      correo: data.correo,
      perfil: 'user',
      token: `mock-token-${Date.now()}`,
      estudiosAbogados: ['Estudio Nuevo'],
      urlFotoPerfil: `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/200/300`
    };
    
    socket.emit('auth_register_response', newUser);
    console.log('✅ Registro exitoso para:', newUser.correo);
  });

  socket.on('auth_logout', async () => {
    await delay(500);
    socket.emit('auth_logout_response', { success: true });
    console.log('👋 Logout exitoso');
  });

  // Manejo de eventos de datos principales
  socket.on('get_emotions', async (data) => {
    await delay(800);
    console.log('😊 Solicitando emociones para:', data.hash);
    socket.emit('get_emotions_response', MOCK_DATA.emociones);
  });

  socket.on('get_analisis_emociones', async (data) => {
    await delay(1200);
    console.log('📊 Solicitando análisis emociones para:', data.hash);
    socket.emit('get_analisis_emociones_response', MOCK_DATA.emociones);
  });

  socket.on('send_chat_message', async (data) => {
    await delay(600);
    console.log('💬 Mensaje de chat:', data.text);
    
    const response = {
      reply: generateChatResponse(data.text)
    };
    
    socket.emit('send_chat_message_response', response);
    console.log('📤 Respuesta enviada:', response.reply.substring(0, 50) + '...');
  });

  socket.on('get_transcripcion', async (data) => {
    await delay(1000);
    console.log('📝 Solicitando transcripción para:', data.hash);
    socket.emit('get_transcripcion_response', MOCK_DATA.transcripcion);

    // Simular nuevos segmentos llegando en tiempo real (solo una vez por cliente)
    if (!socket.transcriptionTimeout) {
      socket.transcriptionTimeout = setTimeout(() => {
        const newSegment = {
          id: MOCK_DATA.transcripcion.segments.length + 1,
          start: "00:00:30,000",
          end: "00:00:35,000", 
          speaker: "Juez Martínez",
          text: "La audiencia queda suspendida por 10 minutos."
        };
        
        socket.emit('transcription_update', newSegment);
        console.log('🆕 Nuevo segmento enviado a', socket.id + ':', newSegment.text.substring(0, 30) + '...');
        socket.transcriptionTimeout = null;
      }, 3000);
    }
  });

  socket.on('get_resumen', async (data) => {
    await delay(1500);
    console.log('📄 Solicitando resumen para:', data.hash);
    socket.emit('get_resumen_response', MOCK_DATA.resumen);

    // Simular actualización de resumen (solo una vez por cliente)
    if (!socket.resumenTimeout) {
      socket.resumenTimeout = setTimeout(() => {
        socket.emit('resumen_update', {
          ...MOCK_DATA.resumen.data,
          summary: MOCK_DATA.resumen.data.summary + '\n\n## Actualización\nSe ha agregado nueva información al resumen...'
        });
        console.log('🆕 Actualización de resumen enviada a', socket.id);
        socket.resumenTimeout = null;
      }, 5000);
    }
  });

  socket.on('get_sugerencias', async (data) => {
    await delay(900);
    console.log('💡 Solicitando sugerencias para:', data.hash);
    socket.emit('get_sugerencias_response', MOCK_DATA.sugerencias);

    // Simular nueva sugerencia llegando (solo una vez por cliente)
    if (!socket.sugerenciasTimeout) {
      socket.sugerenciasTimeout = setTimeout(() => {
        const newQuestion = {
          question: "¿Qué opina sobre la credibilidad de los testimonios presentados?",
          reasoning: "Esta pregunta surge del análisis de las declaraciones contradictorias observadas."
        };
        
        socket.emit('sugerencias_update', {
          questions: [...MOCK_DATA.sugerencias.data.questions, newQuestion],
          cached: false,
          audio_hash: data.hash
        });
        console.log('🆕 Nueva sugerencia enviada a', socket.id);
        socket.sugerenciasTimeout = null;
      }, 4000);
    }
  });

  socket.on('get_contradicciones', async (data) => {
    await delay(1100);
    console.log('⚡ Solicitando contradicciones para:', data.hash);
    socket.emit('get_contradicciones_response', MOCK_DATA.contradicciones);
  });

  socket.on('get_cronologia', async (data) => {
    await delay(700);
    console.log('⏰ Solicitando cronología para:', data.hash);
    socket.emit('get_cronologia_response', MOCK_DATA.cronologia);
  });

  socket.on('get_mapa', async (data) => {
    await delay(950);
    console.log('🗺️ Solicitando mapa para:', data.hash);
    socket.emit('get_mapa_response', MOCK_DATA.mapa);
  });

  // Eventos de desconexión
  socket.on('disconnect', (reason) => {
    console.log(`❌ Cliente desconectado: ${socket.id}, razón: ${reason}`);
    
    // Limpiar timeouts para evitar memory leaks
    if (socket.transcriptionTimeout) {
      clearTimeout(socket.transcriptionTimeout);
      socket.transcriptionTimeout = null;
    }
    if (socket.sugerenciasTimeout) {
      clearTimeout(socket.sugerenciasTimeout);
      socket.sugerenciasTimeout = null;
    }
    if (socket.resumenTimeout) {
      clearTimeout(socket.resumenTimeout);
      socket.resumenTimeout = null;
    }
  });

  socket.on('error', (error) => {
    console.error('💥 Error en socket:', error);
  });

  // Enviar un mensaje de bienvenida después de la conexión
  setTimeout(() => {
    socket.emit('connection_welcome', {
      message: 'Conectado al servidor Socket.IO simulado de Dicta',
      timestamp: new Date().toISOString(),
      features: [
        'Autenticación', 'Chat', 'Transcripción', 'Análisis de Emociones',
        'Resumen', 'Sugerencias', 'Contradicciones', 'Cronología', 'Mapa'
      ]
    });
  }, 1000);
});

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`🌟 Servidor Socket.IO simulado corriendo en http://localhost:${PORT}`);
  console.log('📋 Eventos disponibles:');
  console.log('   🔐 auth_login, auth_register, auth_logout');
  console.log('   😊 get_emotions, get_analisis_emociones');
  console.log('   💬 send_chat_message');
  console.log('   📝 get_transcripcion');
  console.log('   📄 get_resumen');
  console.log('   💡 get_sugerencias');
  console.log('   ⚡ get_contradicciones');
  console.log('   ⏰ get_cronologia');
  console.log('   🗺️ get_mapa');
  console.log('');
  console.log('🎯 Para usar con tu aplicación:');
  console.log('   npm install socket.io');
  console.log('   node mock-socket-server.js');
  console.log('');
  console.log('📡 Endpoints HTTP para testing:');
  console.log('   POST http://localhost:4001/api/transcripcion/segment');
  console.log('   POST http://localhost:4001/api/sugerencias/add');
  console.log('   POST http://localhost:4001/api/emociones/update');
  console.log('   POST http://localhost:4001/api/chat/message');
  console.log('   GET  http://localhost:4001/api/status');
});

// Agregar endpoints HTTP para testing con Postman
server.on('request', async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  try {
    // Endpoint para agregar segmento de transcripción
    if (pathname === '/api/transcripcion/segment' && method === 'POST') {
      const body = await parseBody(req);
      const { sessionId, segment } = body;
      
      if (!sessionId || !segment) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'sessionId y segment son requeridos' }));
        return;
      }

      // Enviar el segmento a todos los sockets de esa sesión
      io.emit('transcripcion_segment', {
        sessionId,
        segment: {
          id: Date.now(),
          texto: segment.texto || '',
          inicio: segment.inicio || 0,
          fin: segment.fin || 0,
          hablante: segment.hablante || 'Desconocido',
          timestamp: new Date().toISOString()
        }
      });

      res.writeHead(200);
      res.end(JSON.stringify({ success: true, message: 'Segmento enviado' }));
      return;
    }

    // Endpoint para agregar sugerencia
    if (pathname === '/api/sugerencias/add' && method === 'POST') {
      const body = await parseBody(req);
      const { sessionId, sugerencia } = body;
      
      if (!sessionId || !sugerencia) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'sessionId y sugerencia son requeridos' }));
        return;
      }

      // Enviar la sugerencia a todos los sockets de esa sesión
      io.emit('nueva_sugerencia', {
        sessionId,
        sugerencia: {
          id: Date.now(),
          tipo: sugerencia.tipo || 'general',
          titulo: sugerencia.titulo || 'Nueva sugerencia',
          descripcion: sugerencia.descripcion || '',
          prioridad: sugerencia.prioridad || 'media',
          timestamp: new Date().toISOString()
        }
      });

      res.writeHead(200);
      res.end(JSON.stringify({ success: true, message: 'Sugerencia enviada' }));
      return;
    }

    // Endpoint para actualizar emociones
    if (pathname === '/api/emociones/update' && method === 'POST') {
      const body = await parseBody(req);
      const { sessionId, emociones, orador_detectado, confianza_general } = body;
      
      if (!sessionId || !emociones) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'sessionId y emociones son requeridos' }));
        return;
      }

      // Normalizar emociones para que sumen 100%
      const total = Object.values(emociones).reduce((sum, val) => sum + (val || 0), 0);
      const normalizedEmociones = {};
      Object.keys(emociones).forEach(key => {
        normalizedEmociones[key] = total > 0 ? ((emociones[key] || 0) / total) * 100 : 0;
      });

      io.emit('emociones_actualizadas', {
        sessionId,
        emociones: normalizedEmociones,
        orador_detectado: orador_detectado || 'API Externa',
        confianza_general: confianza_general || 0.85,
        timestamp: new Date().toISOString()
      });

      res.writeHead(200);
      res.end(JSON.stringify({ success: true, message: 'Emociones actualizadas' }));
      return;
    }

    // Endpoint para enviar mensaje de chat
    if (pathname === '/api/chat/message' && method === 'POST') {
      const body = await parseBody(req);
      const { sessionId, message, sender } = body;
      
      if (!sessionId || !message) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'sessionId y message son requeridos' }));
        return;
      }

      io.emit('nuevo_mensaje_chat', {
        sessionId,
        message: {
          id: Date.now(),
          contenido: message,
          remitente: sender || 'Sistema',
          timestamp: new Date().toISOString(),
          tipo: 'texto'
        }
      });

      res.writeHead(200);
      res.end(JSON.stringify({ success: true, message: 'Mensaje enviado' }));
      return;
    }

    // Endpoint para obtener estado del servidor
    if (pathname === '/api/status' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({ 
        status: 'running', 
        connectedClients: io.engine.clientsCount,
        timestamp: new Date().toISOString()
      }));
      return;
    }

    // 404 para rutas no encontradas
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Endpoint no encontrado' }));

  } catch (error) {
    console.error('Error en endpoint HTTP:', error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Error interno del servidor' }));
  }
});

// Manejo graceful de cierre
process.on('SIGINT', () => {
  console.log('\n👋 Cerrando servidor Socket.IO simulado...');
  server.close(() => {
    console.log('✅ Servidor cerrado exitosamente');
    process.exit(0);
  });
});
