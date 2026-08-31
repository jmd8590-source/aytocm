/**
 * CIVITAS - Mock Seed Data
 * Realistic municipal data for immediate out-of-the-box demonstration
 */

export const MockData = {
  municipalities: [
    {
      id: 'mun-1',
      name: 'Castilblanco de los Arroyos',
      province: 'Sevilla',
      postalCode: '41230',
      centerLat: 37.6742,
      centerLng: -5.9892,
      zoom: 15,
      population: 5100
    },
    {
      id: 'mun-2',
      name: 'Alcalá de Henares',
      province: 'Madrid',
      postalCode: '28801',
      centerLat: 40.4819,
      centerLng: -3.3644,
      zoom: 14,
      population: 198000
    },
    {
      id: 'mun-3',
      name: 'Sant Cugat del Vallès',
      province: 'Barcelona',
      postalCode: '08172',
      centerLat: 41.4725,
      centerLng: 2.0864,
      zoom: 14,
      population: 95000
    }
  ],

  departments: [
    { id: 'dep-vias', name: 'Vías y Obras', email: 'vias@ayto.es' },
    { id: 'dep-limpieza', name: 'Limpieza y Medio Ambiente', email: 'limpieza@ayto.es' },
    { id: 'dep-alumbrado', name: 'Alumbrado y Eficiencia Energética', email: 'alumbrado@ayto.es' },
    { id: 'dep-parques', name: 'Parques, Jardines y Fauna', email: 'parques@ayto.es' },
    { id: 'dep-policia', name: 'Seguridad y Movilidad Urbana', email: 'policia@ayto.es' }
  ],

  categories: [
    { id: 'limpieza', name: 'Limpieza y Vía Pública', icon: '🧹', departmentId: 'dep-limpieza', riskFactor: 2 },
    { id: 'alumbrado', name: 'Alumbrado Público', icon: '💡', departmentId: 'dep-alumbrado', riskFactor: 3 },
    { id: 'vias', name: 'Aceras y Asfalto', icon: '🚧', departmentId: 'dep-vias', riskFactor: 3 },
    { id: 'residuos', name: 'Contenedores y Basura', icon: '🗑️', departmentId: 'dep-limpieza', riskFactor: 2 },
    { id: 'parques', name: 'Parques y Zonas Verdes', icon: '🌳', departmentId: 'dep-parques', riskFactor: 2 },
    { id: 'mobiliario', name: 'Mobiliario Urbano', icon: '🪑', departmentId: 'dep-vias', riskFactor: 1 },
    { id: 'senalizacion', name: 'Señalización y Tráfico', icon: '🛑', departmentId: 'dep-policia', riskFactor: 4 },
    { id: 'agua', name: 'Red de Agua y Fugas', icon: '🚰', departmentId: 'dep-vias', riskFactor: 4 },
    { id: 'ruido', name: 'Ruido y Molestias', icon: '🔊', departmentId: 'dep-policia', riskFactor: 2 },
    { id: 'animales', name: 'Animales y Fauna', icon: '🐕', departmentId: 'dep-parques', riskFactor: 3 },
    { id: 'otros', name: 'Otras Incidencias', icon: '📋', departmentId: 'dep-vias', riskFactor: 1 }
  ],

  users: [
    {
      id: 'usr-citizen-1',
      name: 'Elena Morales',
      email: 'elena@ciudadano.es',
      role: 'ROLE_CITIZEN',
      municipalityId: 'mun-1',
      phone: '+34 611 223 344',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'usr-employee-1',
      name: 'Carlos Santos (Operario Vías)',
      email: 'carlos@ayto.es',
      role: 'ROLE_EMPLOYEE',
      departmentId: 'dep-vias',
      municipalityId: 'mun-1',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'usr-admin-1',
      name: 'Dra. Marta Gómez (Concejala)',
      email: 'admin@ayto.es',
      role: 'ROLE_MUNICIPAL_ADMIN',
      municipalityId: 'mun-1',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'usr-superadmin-1',
      name: 'Javier Ruiz (SuperAdmin Civitas)',
      email: 'superadmin@civitas.gob',
      role: 'ROLE_SUPERADMIN',
      municipalityId: 'mun-1',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    }
  ],

  incidents: [
    {
      id: 'inc-101',
      trackingCode: 'CIV-2026-10492',
      municipalityId: 'mun-1',
      title: 'Fuga de agua potable en acera principal',
      description: 'Rotura de tubería que brota agua continuamente inundando el paso de peatones frente a la farmacia.',
      category: 'agua',
      urgency: 'urgente',
      priorityScore: 92,
      status: 'en_proceso',
      assignedDepartmentId: 'dep-vias',
      assignedEmployeeId: 'usr-employee-1',
      citizenId: 'usr-citizen-1',
      citizenName: 'Elena Morales',
      address: 'Calle Real, 14, Castilblanco',
      lat: 37.6745,
      lng: -5.9896,
      adherentsCount: 8,
      adherentUserIds: ['usr-citizen-1'],
      images: [
        'https://images.unsplash.com/photo-1584463623578-3012a64703a5?w=800&auto=format&fit=crop&q=80'
      ],
      resolutionImages: [],
      resolutionNotes: '',
      createdAt: '2026-08-30T09:15:00Z',
      updatedAt: '2026-08-31T08:30:00Z',
      history: [
        { status: 'recibida', timestamp: '2026-08-30T09:15:00Z', comment: 'Incidencia recibida por el sistema.' },
        { status: 'validando', timestamp: '2026-08-30T10:00:00Z', comment: 'Validada por el centro de control.' },
        { status: 'asignada', timestamp: '2026-08-30T11:20:00Z', comment: 'Asignada a Carlos Santos (Vías y Obras).' },
        { status: 'en_proceso', timestamp: '2026-08-31T08:30:00Z', comment: 'Equipo desplazado con maquinaria para sustitución de válvula.' }
      ]
    },
    {
      id: 'inc-102',
      trackingCode: 'CIV-2026-10493',
      municipalityId: 'mun-1',
      title: 'Farola fundida en paso de peatones escolar',
      description: 'Luminaria apagada desde hace dos noches junto a la entrada del colegio. Zona muy oscura por la mañana.',
      category: 'alumbrado',
      urgency: 'alta',
      priorityScore: 78,
      status: 'asignada',
      assignedDepartmentId: 'dep-alumbrado',
      assignedEmployeeId: null,
      citizenId: 'usr-citizen-1',
      citizenName: 'Elena Morales',
      address: 'Av. de la Constitución, 28',
      lat: 37.6758,
      lng: -5.9875,
      adherentsCount: 5,
      adherentUserIds: [],
      images: [
        'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=800&auto=format&fit=crop&q=80'
      ],
      resolutionImages: [],
      resolutionNotes: '',
      createdAt: '2026-08-29T21:40:00Z',
      updatedAt: '2026-08-30T08:00:00Z',
      history: [
        { status: 'recibida', timestamp: '2026-08-29T21:40:00Z', comment: 'Incidencia comunicada por ciudadana.' },
        { status: 'asignada', timestamp: '2026-08-30T08:00:00Z', comment: 'Asignada al departamento de Alumbrado.' }
      ]
    },
    {
      id: 'inc-103',
      trackingCode: 'CIV-2026-10488',
      municipalityId: 'mun-1',
      title: 'Banqueta y papelera destrozada en el parque',
      description: 'Acto vandálico con banco de madera roto y papelera arrancada del anclaje.',
      category: 'mobiliario',
      urgency: 'media',
      priorityScore: 45,
      status: 'resuelta',
      assignedDepartmentId: 'dep-vias',
      assignedEmployeeId: 'usr-employee-1',
      citizenId: 'usr-anon',
      citizenName: 'Vecino Anónimo',
      address: 'Parque de la Fuente Vieja',
      lat: 37.6731,
      lng: -5.9912,
      adherentsCount: 3,
      adherentUserIds: [],
      images: [
        'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80'
      ],
      resolutionImages: [
        'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&auto=format&fit=crop&q=80'
      ],
      resolutionNotes: 'Se ha repuesto la papelera con nuevo anclaje de hormigón y listones del banco lijados y barnizados.',
      createdAt: '2026-08-26T14:10:00Z',
      updatedAt: '2026-08-28T16:00:00Z',
      history: [
        { status: 'recibida', timestamp: '2026-08-26T14:10:00Z', comment: 'Incidencia recibida.' },
        { status: 'asignada', timestamp: '2026-08-27T09:00:00Z', comment: 'Asignada a Vías y Obras.' },
        { status: 'en_proceso', timestamp: '2026-08-27T14:00:00Z', comment: 'Sustitución de elementos en taller.' },
        { status: 'resuelta', timestamp: '2026-08-28T16:00:00Z', comment: 'Mobiliario reparado e inspeccionado.' }
      ]
    },
    {
      id: 'inc-104',
      trackingCode: 'CIV-2026-10485',
      municipalityId: 'mun-1',
      title: 'Contenedores desbordados tras fin de semana',
      description: 'Isla de contenedores de cartón y envases llena con cajas acumuladas en la calzada.',
      category: 'residuos',
      urgency: 'alta',
      priorityScore: 70,
      status: 'recibida',
      assignedDepartmentId: 'dep-limpieza',
      assignedEmployeeId: null,
      citizenId: 'usr-citizen-1',
      citizenName: 'Elena Morales',
      address: 'Calle San Benito, 5',
      lat: 37.6762,
      lng: -5.9925,
      adherentsCount: 6,
      adherentUserIds: [],
      images: [
        'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80'
      ],
      resolutionImages: [],
      resolutionNotes: '',
      createdAt: '2026-08-31T07:15:00Z',
      updatedAt: '2026-08-31T07:15:00Z',
      history: [
        { status: 'recibida', timestamp: '2026-08-31T07:15:00Z', comment: 'Reporte registrado por ciudadano.' }
      ]
    }
  ],

  suggestions: [
    {
      id: 'sug-201',
      municipalityId: 'mun-1',
      title: 'Instalación de aparcabicis seguros en la plaza y polideportivo',
      description: 'Fomentar la movilidad limpia instalando módulos de aparcamiento de bicicletas tipo U invertida con videovigilancia.',
      category: 'movilidad',
      authorId: 'usr-citizen-1',
      authorName: 'Elena Morales',
      votesCount: 142,
      voterUserIds: ['usr-citizen-1'],
      status: 'aprobada',
      budgetEstimate: '4.500 €',
      officialResponse: 'Propuesta aprobada en el Pleno Municipal para ejecución en el plan de movilidad sostenible Q4 2026.',
      convertedToProject: true,
      createdAt: '2026-08-15T11:00:00Z'
    },
    {
      id: 'sug-202',
      municipalityId: 'mun-1',
      title: 'Creación de área recreativa canina (Pipicán) vallada con fuentes',
      description: 'Habilitar un espacio en el parque norte con doble puerta, suelo drenante, obstáculos de agility y fuente para mascotas.',
      category: 'parques',
      authorId: 'usr-anon',
      authorName: 'Asociación Vecinal',
      votesCount: 98,
      voterUserIds: [],
      status: 'en_estudio',
      budgetEstimate: '8.200 €',
      officialResponse: 'La concejalía de medio ambiente está valorando la parcela óptima para no interferir con las zonas infantiles.',
      convertedToProject: false,
      createdAt: '2026-08-20T17:30:00Z'
    },
    {
      id: 'sug-203',
      municipalityId: 'mun-1',
      title: 'Campaña de plantación de árboles de sombra en calles peatonales',
      description: 'Instalar alcorques arbolados con especies autóctonas para mitigar las islas de calor en verano.',
      category: 'medioambiente',
      authorId: 'usr-anon',
      authorName: 'Grupo Ecologista Local',
      votesCount: 76,
      voterUserIds: [],
      status: 'recibida',
      budgetEstimate: '6.000 €',
      officialResponse: '',
      convertedToProject: false,
      createdAt: '2026-08-28T09:00:00Z'
    }
  ],

  auditLogs: [
    {
      id: 'aud-001',
      timestamp: '2026-08-31T08:30:00Z',
      action: 'INCIDENT_STATUS_CHANGE',
      details: 'Incidencia CIV-2026-10492 cambiada a estado EN_PROCESO',
      performedBy: 'Carlos Santos (Operario Vías)',
      ipAddress: '192.168.1.45',
      municipalityId: 'mun-1'
    },
    {
      id: 'aud-002',
      timestamp: '2026-08-30T11:20:00Z',
      action: 'INCIDENT_ASSIGNMENT',
      details: 'Incidencia CIV-2026-10492 asignada al empleado Carlos Santos',
      performedBy: 'Dra. Marta Gómez (Concejala)',
      ipAddress: '192.168.1.10',
      municipalityId: 'mun-1'
    },
    {
      id: 'aud-003',
      timestamp: '2026-08-28T16:00:00Z',
      action: 'INCIDENT_RESOLVED',
      details: 'Incidencia CIV-2026-10488 marcada como RESUELTA con fotografía de evidencia',
      performedBy: 'Carlos Santos (Operario Vías)',
      ipAddress: '192.168.1.45',
      municipalityId: 'mun-1'
    }
  ]
};
