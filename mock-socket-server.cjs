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
        start: "00:00:00,171",
        end: "00:00:06,417",
        speaker: "SPEAKER_02",
        text: "Miño y Welks, que es el que le acabo de señalar que desistió la querella."
      },
      {
        id: 2,
        start: "00:00:07,077",
        end: "00:00:15,866",
        speaker: "El Hablante no especifica nombre",
        text: "De lo mismo modo que la querella planteó el interés en desistir de dos, les pregunto a las partes si mantienen el interés, porque esto es una audiencia un poco de transición para acomodarnos a la"
      },
      {
        id: 3,
        start: "00:00:17,585",
        end: "00:00:30,300",
        speaker: "El Hablante no especifica nombre",
        text: "nueva situación con la presencia del doctor Chítaro que llegamos a dar la bienvenida formalmente pero la pregunta antes de tener más tiempo a los testigos es si a todos les interesan los testigos que he convocado para hoy o alguno más quiere desistirlos"
      }
    ],
    final_transcription_path: "D:\\Dicta-Priv\\Dicta-Priv\\src\\dicta-nodejs-data\\logs\\srt\\656265cbe0d81f3a7ee2a483c42c45b2d4e3de31c5c049640a5c2c24cd532c88_final_transcription.srt",
    ai_case: {
      case_id: "ff8b912b-6922-4a1f-9f96-15d8d585dcda",
      case_name: "sabag",
      upload_success: true,
      transcription_length: 79604
    },
    cached: false,
    audio_hash: "656265cbe0d81f3a7ee2a483c42c45b2d4e3de31c5c049640a5c2c24cd532c88"
  },

  // Datos de resumen simulados
  resumen: {
    summary: `# Resumen de Audiencia Judicial

## Información General
- **Caso:** Causa Nº 12345/2024 - sabag
- **Fecha:** ${new Date().toLocaleDateString()}
- **Duración:** 30 segundos

## Participantes
- **SPEAKER_02:** Miño y Welks (mencionado)
- **El Hablante no especifica nombre:** Juez o moderador de la audiencia
- **Doctor Chítaro:** Nuevo participante incorporado

## Desarrollo de la Audiencia

### Desistimiento de Querella (00:00 - 06:00)
Se menciona que Miño y Welks desistió de la querella, estableciendo un precedente en el caso.

### Consulta sobre Interés de las Partes (07:00 - 16:00)
El juez consulta a las partes sobre su interés en mantener ciertos aspectos del caso, describiendo esta audiencia como "de transición" para adaptarse a la nueva situación.

### Incorporación del Doctor Chítaro (17:00 - 30:00)
Se da la bienvenida formal al doctor Chítaro y se consulta sobre el interés en los testigos convocados para la audiencia, con posibilidad de desistir de algunos testimonios.

## Resoluciones
1. Reconocimiento del desistimiento de querella por parte de Miño y Welks
2. Bienvenida formal al doctor Chítaro
3. Audiencia caracterizada como "de transición"

## Observaciones
La audiencia se enfoca en la reorganización del caso debido a cambios en la representación legal y desistimientos de querella.`,
    cached: false,
    audio_hash: "656265cbe0d81f3a7ee2a483c42c45b2d4e3de31c5c049640a5c2c24cd532c88"
  },

  // Datos de sugerencias simuladas
  sugerencias: {
    questions: [
      {
        question: "¿Podría el testigo Dr. Chitáro explicar detalladamente las razones por las cuales se opone inicialmente a la incorporación por lectura de las ocho testimoniales mencionadas, y qué circunstancias específicas podrían llevarlo a reconsiderar su posición?",
        reasoning: "Esta pregunta busca obtener información sobre los criterios subyacentes en la objeción inicial del Dr. Chitáro, así como las condiciones que podrían modificar su perspectiva, lo cual es relevante para evaluar la flexibilidad de las partes y anticipar posibles cambios en el desarrollo del juicio."
      },
      {
        question: "¿Cuál fue el motivo exacto por el cual el testigo doctor Chitáro solicitó un retraso antes de hacer su manifestación durante la audiencia?",
        reasoning: "Esta pregunta busca esclarecer las razones detrás del pedido de tiempo extra, lo que podría revelar consideraciones estratégicas o complicaciones en la preparación de la defensa."
      },
      {
        question: "¿Cómo justifica el testigo doctor Chitáro su necesidad de reevaluar y posiblemente modificar su respuesta sobre los ocho testigos mencionados para la audiencia del 12 de marzo?",
        reasoning: "Esta pregunta intenta comprender las bases de la decisión estratégica del Dr. Chitáro, ofreciendo perspectivas sobre cómo evalúan y priorizan la información en su defensa."
      },
      {
        question: "¿Cuál es el interés o la importancia específica que tiene para ustedes (Dr. Chitáro y su equipo) el testimonio de cada uno de los testigos reprogramados para la próxima audiencia?",
        reasoning: "Al solicitar una evaluación de la relevancia de cada testigo, esta pregunta ayuda a iluminar las estrategias defensivas planeadas y cómo se alinean con las necesidades del caso."
      }
    ],
    cached: false,
    audio_hash: "656265cbe0d81f3a7ee2a483c42c45b2d4e3de31c5c049640a5c2c24cd532c88"
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
    mermaid_timeline: {
      mermaid_code: "timeline\n    title Audiencia Judicial del Tribunal Oral Federal Nº 6\n    section Actualización Procedimental\n        Cambio en calendario debido a nuevo abogado defensor, Dr. Chítaro Brenda Uliarte\n        Discusión sobre retirada de testigos y testimonios previamente registrados\n    section Testimonios de Testigos\n        Francisco Manuel Fernández Sosa: Entrega voluntaria de teléfono móvil\n        Confirmación por documentos sin objeciones adicionales\n    section Pruebas Expertas\n        Retrasos en análisis forenses de telefonía debido a cortes de energía\n        Nuevas fechas programadas para marzo y febrero de 2025\n        Posibilidad de designar expertos adicionales\n    section Discusiones sobre Testigos\n        Debates sobre lista final de testigos\n        Confirmación de retiro de ciertos testigos\n        Consideración de testimonios adicionales (Niamandú, Nadia Ayelen Mir)\n    section Contexto del Caso\n        Importancia de entender motivaciones detrás del ataque a Cristina Fernández Kirchner\n        Relevancia de testigos vinculados con grupos políticos y sociales\n    section Argumentos Centrales\n        Defensa: Dr. Chítaro enfatiza su papel como nuevo abogado defensor\n        Fiscalía: Sugiere cambios en la lista de testigos para evitar retrasos\n    section Pruebas o Testimonios Influyentes\n        Francisco Manuel Fernández Sosa: Confirma procedimiento sin coacción\n        Patricia Verónica Huaglianone: Proporciona detalles técnicos sobre seguridad de dispositivos móviles\n    section Decisiones o Resoluciones del Juez\n        Solicita respuestas a las partes sobre inclusión de testimonios y evaluaciones expertas\n        Acuerda considerar el interés en llamar a ciertos testigos para futuras audiencias\n    section Resultado o Estado Actual del Caso\n        Sesión concluye con planes para abordar más testimonios y pruebas\n        Nuevas fechas programadas para análisis forenses y revisión de documentos reservados\n        Reunión siguiente programada para el próximo miércoles",
      analysis_metadata: {
        generation_method: "direct_mermaid",
        cleaned_response: true
      }
    },
    cached: false,
    audio_hash: "656265cbe0d81f3a7ee2a483c42c45b2d4e3de31c5c049640a5c2c24cd532c88"
  },

  // Datos de mapa conceptual simulado
  mapa: {
    mermaid_mindmap: {
      mermaid_code: "mindmap\n  Resumen Final de la Audiencia Judicial\n    Fases Principales de la Audiencia\n        Actualización Procedimental\n        Testimonios de Testigos\n        Pruebas Expertas\n        Discusiones Sobre Testigos\n        Contexto del Caso\n    Argumentos Centrales\n        Defensa: Dr. Chítaro\n        Fiscalía\n    Pruebas o Testimonios Influyentes\n        Testimonio de Francisco Manuel Fernández Sosa\n        Declaración de Patricia Verónica Huaglianone\n    Decisiones o Resoluciones del Juez\n        Respuestas a las Partes sobre Inclusión de Testimonios\n        Consideración de Interés en Llamar Testigos Futuros\n    Resultado o Estado Actual del Caso\n        Planes para Sesiones Futuras\n        Nuevas Fechas de Análisis Forenses\n        Revisión de Documentos Reservados\n",
      analysis_metadata: {
        node_count: 20,
        generation_method: "structured_nodes"
      }
    },
    cached: false,
    audio_hash: "656265cbe0d81f3a7ee2a483c42c45b2d4e3de31c5c049640a5c2c24cd532c88"
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
          ...MOCK_DATA.resumen,
          summary: MOCK_DATA.resumen.summary + '\n\n## Actualización\nSe ha agregado nueva información al resumen...'
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
          questions: [...MOCK_DATA.sugerencias.questions, newQuestion],
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
