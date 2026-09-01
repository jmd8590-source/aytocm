/**
 * CIVITAS / AYTO CUMBRES MAYORES - Seed Data
 * Datos reales del municipio de Cumbres Mayores (Huelva) con claves de iconos vectoriales SVG
 */

export const MockData = {
  municipalities: [
    {
      id: 'mun-cumbresmayores',
      name: 'Cumbres Mayores',
      province: 'Huelva',
      region: 'Andalucía',
      naturalPark: 'Parque Natural Sierra de Aracena y Picos de Aroche',
      postalCode: '21380',
      address: 'Plaza de España, 1, 21380 Cumbres Mayores (Huelva)',
      phone: '959 710 001 / 959 710 026',
      email: 'ayuntamiento@cumbresmayores.es',
      centerLat: 38.0623,
      centerLng: -6.6466,
      zoom: 16,
      population: 1750
    }
  ],

  departments: [
    { id: 'dep-vias', name: 'Vías, Obras y Pavimento', email: 'obras@cumbresmayores.es' },
    { id: 'dep-limpieza', name: 'Limpieza Viaria y Residuos', email: 'limpieza@cumbresmayores.es' },
    { id: 'dep-alumbrado', name: 'Alumbrado Público y Eficiencia', email: 'alumbrado@cumbresmayores.es' },
    { id: 'dep-medioambiente', name: 'Medio Ambiente, Dehesa y Caminos Rurales', email: 'medioambiente@cumbresmayores.es' },
    { id: 'dep-patrimonio', name: 'Patrimonio Histórico (Castillo y Ermitas)', email: 'patrimonio@cumbresmayores.es' },
    { id: 'dep-policia', name: 'Policía Local y Seguridad', email: 'policia@cumbresmayores.es' }
  ],

  categories: [
    { id: 'vias', name: 'Aceras, Empedrado y Asfalto', iconKey: 'road', departmentId: 'dep-vias', riskFactor: 3 },
    { id: 'alumbrado', name: 'Alumbrado y Farolas', iconKey: 'lamp', departmentId: 'dep-alumbrado', riskFactor: 3 },
    { id: 'limpieza', name: 'Limpieza Urbana y Plazas', iconKey: 'cleaning', departmentId: 'dep-limpieza', riskFactor: 2 },
    { id: 'residuos', name: 'Contenedores y Reciclaje', iconKey: 'trash', departmentId: 'dep-limpieza', riskFactor: 2 },
    { id: 'caminos', name: 'Caminos Rurales y Dehesa (GR-48)', iconKey: 'trail', departmentId: 'dep-medioambiente', riskFactor: 3 },
    { id: 'patrimonio', name: 'Castillo de Sancho IV y Ermitas', iconKey: 'castle', departmentId: 'dep-patrimonio', riskFactor: 3 },
    { id: 'parques', name: 'Paseo de Andalucía y Jardines', iconKey: 'tree', departmentId: 'dep-medioambiente', riskFactor: 2 },
    { id: 'agua', name: 'Red de Agua, Fugas y Fuentes', iconKey: 'water', departmentId: 'dep-vias', riskFactor: 4 },
    { id: 'senalizacion', name: 'Señalización y Espejos', iconKey: 'sign', departmentId: 'dep-policia', riskFactor: 4 },
    { id: 'animales', name: 'Ganadería Ibérica y Fauna', iconKey: 'livestock', departmentId: 'dep-medioambiente', riskFactor: 2 },
    { id: 'otros', name: 'Otras Incidencias Generales', iconKey: 'incidents', departmentId: 'dep-vias', riskFactor: 1 }
  ],

  users: [
    {
      id: 'usr-citizen-1',
      name: 'María Carmen Márquez',
      email: 'mamen@ciudadano.es',
      role: 'ROLE_CITIZEN',
      roleBadge: 'Vecina de Cumbres',
      roleColor: '#10B981',
      municipalityId: 'mun-cumbresmayores',
      phone: '+34 622 334 455',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'usr-employee-1',
      name: 'Manuel Romero (Operario)',
      email: 'operario@cumbresmayores.es',
      role: 'ROLE_EMPLOYEE',
      roleBadge: 'Operario Municipal',
      roleColor: '#F59E0B',
      departmentId: 'dep-vias',
      municipalityId: 'mun-cumbresmayores',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'usr-admin-1',
      name: 'Equipo de Gobierno (Concejalía)',
      email: 'ayuntamiento@cumbresmayores.es',
      role: 'ROLE_MUNICIPAL_ADMIN',
      roleBadge: 'Concejalía / Obras',
      roleColor: '#FF7A18',
      municipalityId: 'mun-cumbresmayores',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'usr-superadmin-1',
      name: 'Administrador Civitas',
      email: 'admin@cumbresmayores.es',
      role: 'ROLE_SUPERADMIN',
      roleBadge: 'SuperAdmin',
      roleColor: '#8B5CF6',
      municipalityId: 'mun-cumbresmayores',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    }
  ],

  incidents: [
    {
      id: 'inc-cm-101',
      trackingCode: 'CM-2026-00481',
      municipalityId: 'mun-cumbresmayores',
      title: 'Desprendimiento de adoquinado tradicional en Calle La Portá',
      description: 'Varios adoquines sueltos en el tramo peatonal frente al número 18, dificultando el paso de personas mayores y vehículos.',
      category: 'vias',
      urgency: 'alta',
      priorityScore: 82,
      status: 'en_proceso',
      assignedDepartmentId: 'dep-vias',
      assignedEmployeeId: 'usr-employee-1',
      citizenId: 'usr-citizen-1',
      citizenName: 'María Carmen Márquez',
      address: 'Calle La Portá, 18, Cumbres Mayores',
      lat: 38.0628,
      lng: -6.6459,
      adherentsCount: 7,
      adherentUserIds: ['usr-citizen-1'],
      images: [
        'https://images.unsplash.com/photo-1584463623578-3012a64703a5?w=800&auto=format&fit=crop&q=80'
      ],
      resolutionImages: [],
      resolutionNotes: '',
      createdAt: '2026-08-30T08:45:00Z',
      updatedAt: '2026-08-31T09:00:00Z',
      history: [
        { status: 'recibida', timestamp: '2026-08-30T08:45:00Z', comment: 'Comunicada por vecina de Calle La Portá.' },
        { status: 'validando', timestamp: '2026-08-30T09:30:00Z', comment: 'Inspeccionada por el encargado de obras.' },
        { status: 'asignada', timestamp: '2026-08-30T10:15:00Z', comment: 'Asignada a Manuel Romero (Servicio de Vías y Obras).' },
        { status: 'en_proceso', timestamp: '2026-08-31T09:00:00Z', comment: 'Equipo trabajando en el reasentamiento de adoquines con mortero especial.' }
      ]
    },
    {
      id: 'inc-cm-102',
      trackingCode: 'CM-2026-00482',
      municipalityId: 'mun-cumbresmayores',
      title: 'Luminaria fundida en el entorno del Castillo de Sancho IV',
      description: 'Foco del perímetro monumental apagado en la subida a la torre norte, dejando a oscuras el acceso.',
      category: 'patrimonio',
      urgency: 'media',
      priorityScore: 68,
      status: 'asignada',
      assignedDepartmentId: 'dep-alumbrado',
      assignedEmployeeId: null,
      citizenId: 'usr-citizen-1',
      citizenName: 'Vecino de Cumbres',
      address: 'Plaza del Castillo de Sancho IV, s/n',
      lat: 38.0619,
      lng: -6.6475,
      adherentsCount: 4,
      adherentUserIds: [],
      images: [
        'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=800&auto=format&fit=crop&q=80'
      ],
      resolutionImages: [],
      resolutionNotes: '',
      createdAt: '2026-08-29T21:10:00Z',
      updatedAt: '2026-08-30T08:30:00Z',
      history: [
        { status: 'recibida', timestamp: '2026-08-29T21:10:00Z', comment: 'Incidencia recibida vía portal municipal.' },
        { status: 'asignada', timestamp: '2026-08-30T08:30:00Z', comment: 'Asignada al equipo de electricistas municipales para reposición LED.' }
      ]
    },
    {
      id: 'inc-cm-103',
      trackingCode: 'CM-2026-00475',
      municipalityId: 'mun-cumbresmayores',
      title: 'Reparación de banco y fuente en Paseo de Andalucía',
      description: 'Listón roto en banco de madera y fuga en el grifo pulsador de la fuente pública.',
      category: 'parques',
      urgency: 'media',
      priorityScore: 45,
      status: 'resuelta',
      assignedDepartmentId: 'dep-vias',
      assignedEmployeeId: 'usr-employee-1',
      citizenId: 'usr-anon',
      citizenName: 'Vecino Anónimo',
      address: 'Paseo de Andalucía, Cumbres Mayores',
      lat: 38.0635,
      lng: -6.6450,
      adherentsCount: 5,
      adherentUserIds: [],
      images: [
        'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80'
      ],
      resolutionImages: [
        'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&auto=format&fit=crop&q=80'
      ],
      resolutionNotes: 'Sustituido el listón de pino tratado con barniz intemperie y cambiada la junta de cierre de la fuente.',
      createdAt: '2026-08-25T11:00:00Z',
      updatedAt: '2026-08-27T17:00:00Z',
      history: [
        { status: 'recibida', timestamp: '2026-08-25T11:00:00Z', comment: 'Aviso registrado.' },
        { status: 'asignada', timestamp: '2026-08-26T09:00:00Z', comment: 'Asignada a Manuel Romero.' },
        { status: 'en_proceso', timestamp: '2026-08-27T10:00:00Z', comment: 'Trabajos de carpintería y fontanería ejecutados.' },
        { status: 'resuelta', timestamp: '2026-08-27T17:00:00Z', comment: 'Verificada y cerrada satisfactoriamente.' }
      ]
    },
    {
      id: 'inc-cm-104',
      trackingCode: 'CM-2026-00485',
      municipalityId: 'mun-cumbresmayores',
      title: 'Piedras caídas de muro de cerca en el Sendero GR-48',
      description: 'Tramo del sendero ganadero hacia la Ermita de la Esperanza con piedras desprendidas del muro de piedra seca tras las lluvias.',
      category: 'caminos',
      urgency: 'media',
      priorityScore: 58,
      status: 'recibida',
      assignedDepartmentId: 'dep-medioambiente',
      assignedEmployeeId: null,
      citizenId: 'usr-citizen-1',
      citizenName: 'María Carmen Márquez',
      address: 'Camino de la Ermita de la Esperanza (GR-48)',
      lat: 38.0655,
      lng: -6.6490,
      adherentsCount: 6,
      adherentUserIds: [],
      images: [
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80'
      ],
      resolutionImages: [],
      resolutionNotes: '',
      createdAt: '2026-08-31T07:30:00Z',
      updatedAt: '2026-08-31T07:30:00Z',
      history: [
        { status: 'recibida', timestamp: '2026-08-31T07:30:00Z', comment: 'Reporte registrado por senderista vecinal.' }
      ]
    }
  ],

  suggestions: [
    {
      id: 'sug-cm-201',
      municipalityId: 'mun-cumbresmayores',
      title: 'Iluminación artística y paneles interpretativos del Crómlech en el Castillo de Sancho IV',
      description: 'Instalar proyectores LED de bajo consumo en el recinto amurallado y señalética didáctica sobre el crómlech de 40 menhires prehistóricos hallado en el interior.',
      category: 'patrimonio',
      authorId: 'usr-citizen-1',
      authorName: 'María Carmen Márquez',
      votesCount: 168,
      voterUserIds: ['usr-citizen-1'],
      status: 'aprobada',
      budgetEstimate: '7.500 €',
      officialResponse: 'Aprobada por el Ayuntamiento para su inclusión en la partida de fomento del patrimonio histórico de la Sierra de Aracena.',
      convertedToProject: true,
      createdAt: '2026-08-10T12:00:00Z'
    },
    {
      id: 'sug-cm-202',
      municipalityId: 'mun-cumbresmayores',
      title: 'Acondicionamiento y desbroce de la Ruta de las Tres Cumbres para senderismo familiar',
      description: 'Mejorar el trazado que une Cumbres Mayores con Cumbres de Enmedio y San Bartolomé con bancos de madera, hitos de piedra y fuentes rústicas.',
      category: 'medioambiente',
      authorId: 'usr-anon',
      authorName: 'Asociación Senderista Cumbreña',
      votesCount: 115,
      voterUserIds: [],
      status: 'en_estudio',
      budgetEstimate: '5.200 €',
      officialResponse: 'La Concejalía de Medio Ambiente está coordinando el proyecto con el Parque Natural para la homologación del sendero.',
      convertedToProject: false,
      createdAt: '2026-08-18T16:30:00Z'
    },
    {
      id: 'sug-cm-203',
      municipalityId: 'mun-cumbresmayores',
      title: 'Refuerzo de contenedores de reciclaje de cartón y vidrio en el Polígono Cárnico',
      description: 'Aumentar la capacidad de recogida selectiva en la zona industrial cárnica durante las campañas de producción del cerdo ibérico.',
      category: 'residuos',
      authorId: 'usr-anon',
      authorName: 'Comunidad de Industriales del Ibérico',
      votesCount: 89,
      voterUserIds: [],
      status: 'recibida',
      budgetEstimate: '3.800 €',
      officialResponse: '',
      convertedToProject: false,
      createdAt: '2026-08-28T10:15:00Z'
    }
  ],

  auditLogs: [
    {
      id: 'aud-cm-001',
      timestamp: '2026-08-31T09:00:00Z',
      action: 'INCIDENT_STATUS_CHANGE',
      details: 'Incidencia CM-2026-00481 (Calle La Portá) cambiada a estado EN_PROCESO',
      performedBy: 'Manuel Romero (Operario Municipal)',
      ipAddress: '192.168.1.50',
      municipalityId: 'mun-cumbresmayores'
    },
    {
      id: 'aud-cm-002',
      timestamp: '2026-08-30T10:15:00Z',
      action: 'INCIDENT_ASSIGNMENT',
      details: 'Incidencia CM-2026-00481 asignada al operario Manuel Romero',
      performedBy: 'Equipo de Gobierno (Concejalía de Obras)',
      ipAddress: '192.168.1.10',
      municipalityId: 'mun-cumbresmayores'
    },
    {
      id: 'aud-cm-003',
      timestamp: '2026-08-27T17:00:00Z',
      action: 'INCIDENT_RESOLVED',
      details: 'Incidencia CM-2026-00475 (Paseo de Andalucía) marcada como RESUELTA',
      performedBy: 'Manuel Romero (Operario Municipal)',
      ipAddress: '192.168.1.50',
      municipalityId: 'mun-cumbresmayores'
    }
  ]
};
