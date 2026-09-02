/**
 * CIVITAS - Internationalization (i18n) Engine
 * Multi-language support (ES, EN) — Traducción simultánea en toda la app
 * Cumbres Mayores (Huelva)
 */

export const I18n = {
  currentLocale: 'es',

  translations: {
    es: {
      // App General
      app_title: 'Ayuntamiento de Cumbres Mayores',
      app_motto: 'Tu Ayuntamiento más cerca',
      app_location: '📍 Cumbres Mayores (Huelva) — Sierra de Aracena',

      // Auth Screen
      auth_welcome: 'Bienvenido al Portal Municipal',
      auth_subtitle: 'Selecciona tu perfil para acceder o entra en modo demostración.',
      auth_btn_citizen: 'Vecin@ de Cumbres',
      auth_btn_citizen_sub: 'Anotar y seguir incidencias',
      auth_btn_operator: 'Operario Municipal',
      auth_btn_operator_sub: 'Gestionar y actualizar estados',
      auth_btn_admin: 'Concejalía / Obras',
      auth_btn_admin_sub: 'Administración completa',
      auth_btn_superadmin: 'SuperAdmin',
      auth_btn_superadmin_sub: 'Control total del sistema',
      auth_btn_demo: 'Versión Demo',
      auth_btn_demo_sub: 'Ver la app sin registrarse',
      auth_entering_demo: 'Entrando en modo demostración...',

      // Login/Register Modal
      auth_modal_login: 'Iniciar Sesión',
      auth_modal_register: 'Crear Cuenta',
      auth_modal_login_tab: 'Ya tengo cuenta',
      auth_modal_register_tab: 'Registrarme',
      auth_modal_name: 'Nombre completo',
      auth_modal_name_ph: 'Ej: María García López',
      auth_modal_email: 'Correo electrónico',
      auth_modal_email_ph: 'tucorreo@ejemplo.com',
      auth_modal_password: 'Contraseña',
      auth_modal_password_ph: 'Mínimo 6 caracteres',
      auth_modal_access_code: 'Código de acceso',
      auth_modal_access_code_ph: 'Código proporcionado por el Ayuntamiento',
      auth_modal_access_code_hint: 'Este perfil requiere un código de acceso oficial.',
      auth_btn_login_submit: 'Entrar',
      auth_btn_register_submit: 'Crear cuenta y entrar',
      auth_btn_cancel: 'Cancelar',
      auth_error_email: 'Introduce un correo electrónico válido.',
      auth_error_password: 'La contraseña debe tener al menos 6 caracteres.',
      auth_error_name: 'Por favor, introduce tu nombre completo.',
      auth_error_code: 'Código de acceso incorrecto.',
      auth_error_not_found: 'No se encontró ningún usuario con ese correo.',
      auth_success_welcome: '¡Bienvenido/a!',
      auth_success_logged: 'Sesión iniciada correctamente.',
      auth_success_registered: 'Cuenta creada con éxito. ¡Bienvenido/a al portal!',

      // Logout
      btn_logout: 'Salir',
      logout_confirm_title: '¿Cerrar sesión?',
      logout_confirm_msg: '¿Seguro que quieres salir del portal municipal?',
      btn_logout_yes: 'Sí, salir',
      btn_logout_no: 'Cancelar',

      // Demo mode notice
      demo_banner: '👁️ Modo Demo — Solo lectura. Regístrate para participar.',

      // Navigation
      nav_home: 'Inicio',
      nav_report: 'Reportar Aviso',
      nav_map: 'Plano Municipal',
      nav_incidents: 'Incidencias',
      nav_suggestions: 'Presupuestos',
      nav_admin: 'Gestión Municipal',
      nav_audit: 'Auditoría',
      nav_mob_home: 'Inicio',
      nav_mob_report: 'Avisar',
      nav_mob_map: 'Plano',
      nav_mob_incidents: 'Avisos',
      nav_mob_suggestions: 'Ideas',

      // Sidebar brand
      sidebar_brand_title: 'Cumbres Mayores',
      sidebar_brand_sub: 'Ayuntamiento Oficial',
      sidebar_cta_title: 'Participación Vecinal',
      sidebar_cta_sub: 'Tu aviso ayuda a mantener en perfecto estado nuestro pueblo.',
      sidebar_cta_btn: '+ Nuevo Aviso',

      // Topbar
      topbar_services: 'Servicios Operativos',
      topbar_search_ph: 'Buscar por calle, avería, castillo, farolas...',

      // Home View
      home_bando_tag: '📢 BANDO OFICIAL',
      home_bando_text: 'Actuaciones de repavimentación en Calle La Portá y subida al Castillo de Sancho IV · Suministro de agua en parámetros normales.',
      home_hero_badge: 'Portal Oficial · Sierra de Aracena y Picos de Aroche',
      home_hero_title_1: 'Cuidemos juntos de',
      home_hero_title_2: 'Cumbres Mayores',
      home_hero_subtitle: 'Comunica averías en calles, farolas, senderos del Parque Natural y dehesas comunales en 4 sencillos pasos.',
      home_hero_btn_report: '+ Nuevo Reporte de Aviso',
      home_hero_btn_map: 'Explorar Plano en Vivo',
      home_hero_img_alt: 'Cumbres Mayores',
      home_hero_castle: 'Castillo de Sancho IV',
      home_hero_castle_sub: 'Luminarias LED perimetrales operativas',
      home_incidents_title: 'Avisos e Incidencias en Curso',
      home_incidents_link: 'Ver Todas',
      home_activity_title: 'Últimas Actuaciones',
      home_activity_link: 'Historial',
      home_budget_title: 'Presupuestos Vecinales 2026',
      home_budget_sub: 'Vota propuestas de mejora para el Castillo y senderos de la Sierra.',
      home_budget_btn: 'Votar Propuestas Vecinales →',

      // Incidents View
      incidents_title: 'Explorador de Incidencias de Cumbres Mayores',
      incidents_subtitle: 'Consulta la evolución, aporta fotos adicionales y súmate a avisos activos.',
      incidents_btn_new: '+ Comunicar Nuevo Aviso',
      incidents_filter_search_ph: 'Buscar por calle o avería...',
      incidents_filter_all_cats: 'Todas las Categorías',
      incidents_filter_all_status: 'Todos los Estados',
      incidents_empty_title: 'No se encontraron incidencias con esos filtros',
      incidents_empty_sub: 'Prueba a cambiar la búsqueda o categoría.',
      incidents_supports: 'apoyos',
      incidents_card_btn_detail: 'Ver detalle',

      // Map View
      map_title: 'Plano Municipal Geoespacial — Cumbres Mayores',
      map_subtitle: 'Avisos georreferenciados en el casco urbano, Castillo de Sancho IV y sendero GR-48.',
      map_btn_heat: '🔥 Alternar Mapa de Calor',
      map_btn_markers: '📍 Ver Marcadores',
      map_btn_report: '+ Reportar en este punto',
      map_filter_title: 'Filtros de Categoría',
      map_filter_all: 'Todas las Categorías',

      // Modal Incident Detail
      modal_close: 'Cerrar',
      modal_location: 'Ubicación',
      modal_urgency: 'Urgencia',
      modal_neighbors: 'Vecinos afectados',
      modal_before_after: '📸 Comparativa "Antes y Después"',
      modal_drag_compare: 'Arrastra para comparar',
      modal_after_tag: '✅ DESPUÉS',
      modal_before_tag: '⚠️ ANTES',
      modal_photos_title: 'Fotografías aportadas:',
      modal_resolution_title: '✅ Dictamen y Resolución Municipal:',
      modal_timeline_title: 'Evolución y Actuaciones de los Operarios:',
      modal_btn_support: '👍 A mí también me afecta',
      modal_admin_title: '⚙️ Gestión Municipal',
      modal_status_label: 'Nuevo Estado',
      modal_comment_label: 'Comentario (opcional)',
      modal_comment_ph: 'Ej: Equipo de fontanería desplazado...',
      modal_btn_update: '💾 Actualizar Estado',

      // Status Labels
      status_recibida: 'Recibida',
      status_validando: 'Validando',
      status_asignada: 'Asignada',
      status_en_proceso: 'En Proceso',
      status_resuelta: 'Resuelta',
      status_cerrada: 'Cerrada',

      // Status Options (modal select)
      status_opt_recibida: '📩 Recibida',
      status_opt_validando: '🔎 Validando',
      status_opt_asignada: '📋 Asignada',
      status_opt_en_proceso: '🔧 En Proceso',
      status_opt_resuelta: '✅ Resuelta',
      status_opt_cerrada: '🔒 Cerrada',

      // Priority
      priority_baja: 'Baja',
      priority_media: 'Media',
      priority_alta: 'Alta',
      priority_urgente: 'Urgente',

      // Categories
      cat_vias: 'Aceras, Empedrado y Asfalto',
      cat_alumbrado: 'Alumbrado y Farolas',
      cat_limpieza: 'Limpieza Urbana y Plazas',
      cat_residuos: 'Contenedores y Reciclaje',
      cat_caminos: 'Caminos Rurales y Dehesa (GR-48)',
      cat_patrimonio: 'Castillo de Sancho IV y Ermitas',
      cat_parques: 'Paseo de Andalucía y Jardines',
      cat_agua: 'Red de Agua, Fugas y Fuentes',
      cat_senalizacion: 'Señalización y Espejos',
      cat_animales: 'Ganadería Ibérica y Fauna',
      cat_otros: 'Otras Incidencias Generales',

      // Buttons general
      btn_save: 'Guardar',
      btn_cancel: 'Cancelar',
      btn_submit: 'Enviar Reporte',
      btn_vote: 'Apoyar Propuesta',
      btn_voted: 'Apoyado',
      btn_assign: 'Asignar Técnico',
      btn_resolve: 'Marcar como Resuelta',

      // Notifications/Toast
      toast_no_changes: 'Sin Cambios',
      toast_no_changes_msg: 'Selecciona un estado diferente o añade un comentario para actualizar.',
      toast_status_updated: '✅ Estado Actualizado',
      toast_status_updated_msg: 'La incidencia ha sido actualizada a:',

      // Role Labels
      role_citizen: 'Vecin@ de Cumbres',
      role_employee: 'Operario Municipal',
      role_admin: 'Concejalía / Obras',
      role_superadmin: 'SuperAdmin',
      role_demo: 'Visitante Demo',

      // Restriction messages
      restrict_demo_report: 'En modo demo no puedes crear incidencias. Regístrate para participar.',
      restrict_citizen_status: 'Solo el personal municipal puede cambiar el estado de las incidencias.',

      // Activity items (home)
      activity_calle_porta: 'Calle La Portá, 18',
      activity_paseo: 'Paseo de Andalucía',
      activity_castillo: 'Castillo de Sancho IV',
      activity_hace2h: 'Hace 2 h',
      activity_ayer: 'Ayer',
      activity_hace2d: 'Hace 2 días'
    },

    en: {
      // App General
      app_title: 'Cumbres Mayores Town Hall',
      app_motto: 'Your City Hall Closer',
      app_location: '📍 Cumbres Mayores (Huelva) — Sierra de Aracena',

      // Auth Screen
      auth_welcome: 'Welcome to the Municipal Portal',
      auth_subtitle: 'Select your profile to access or enter in demonstration mode.',
      auth_btn_citizen: 'Cumbres Resident',
      auth_btn_citizen_sub: 'Report and track incidents',
      auth_btn_operator: 'Municipal Operator',
      auth_btn_operator_sub: 'Manage and update statuses',
      auth_btn_admin: 'Council / Works',
      auth_btn_admin_sub: 'Full administration',
      auth_btn_superadmin: 'SuperAdmin',
      auth_btn_superadmin_sub: 'Full system control',
      auth_btn_demo: 'Demo Version',
      auth_btn_demo_sub: 'Browse the app without signing up',
      auth_entering_demo: 'Entering demo mode...',

      // Login/Register Modal
      auth_modal_login: 'Sign In',
      auth_modal_register: 'Create Account',
      auth_modal_login_tab: 'I already have an account',
      auth_modal_register_tab: 'Sign up',
      auth_modal_name: 'Full name',
      auth_modal_name_ph: 'e.g. María García López',
      auth_modal_email: 'Email address',
      auth_modal_email_ph: 'your@email.com',
      auth_modal_password: 'Password',
      auth_modal_password_ph: 'At least 6 characters',
      auth_modal_access_code: 'Access code',
      auth_modal_access_code_ph: 'Code provided by the Town Hall',
      auth_modal_access_code_hint: 'This profile requires an official access code.',
      auth_btn_login_submit: 'Sign In',
      auth_btn_register_submit: 'Create account and sign in',
      auth_btn_cancel: 'Cancel',
      auth_error_email: 'Please enter a valid email address.',
      auth_error_password: 'Password must be at least 6 characters.',
      auth_error_name: 'Please enter your full name.',
      auth_error_code: 'Incorrect access code.',
      auth_error_not_found: 'No user found with that email address.',
      auth_success_welcome: 'Welcome!',
      auth_success_logged: 'Signed in successfully.',
      auth_success_registered: 'Account created successfully. Welcome to the portal!',

      // Logout
      btn_logout: 'Sign Out',
      logout_confirm_title: 'Sign out?',
      logout_confirm_msg: 'Are you sure you want to leave the municipal portal?',
      btn_logout_yes: 'Yes, sign out',
      btn_logout_no: 'Cancel',

      // Demo mode notice
      demo_banner: '👁️ Demo Mode — Read only. Sign up to participate.',

      // Navigation
      nav_home: 'Home',
      nav_report: 'Report Issue',
      nav_map: 'Municipal Map',
      nav_incidents: 'Incidents',
      nav_suggestions: 'Budgets',
      nav_admin: 'City Management',
      nav_audit: 'Audit',
      nav_mob_home: 'Home',
      nav_mob_report: 'Report',
      nav_mob_map: 'Map',
      nav_mob_incidents: 'Issues',
      nav_mob_suggestions: 'Ideas',

      // Sidebar brand
      sidebar_brand_title: 'Cumbres Mayores',
      sidebar_brand_sub: 'Official Town Hall',
      sidebar_cta_title: 'Community Participation',
      sidebar_cta_sub: 'Your report helps keep our village in perfect condition.',
      sidebar_cta_btn: '+ New Report',

      // Topbar
      topbar_services: 'Services Operational',
      topbar_search_ph: 'Search by street, fault, castle, street lights...',

      // Home View
      home_bando_tag: '📢 OFFICIAL NOTICE',
      home_bando_text: 'Repaving works on Calle La Portá and Castillo de Sancho IV access road · Water supply within normal parameters.',
      home_hero_badge: 'Official Portal · Sierra de Aracena y Picos de Aroche',
      home_hero_title_1: 'Let\'s look after',
      home_hero_title_2: 'Cumbres Mayores',
      home_hero_subtitle: 'Report faults on streets, street lights, Natural Park trails and communal dehesas in 4 simple steps.',
      home_hero_btn_report: '+ New Issue Report',
      home_hero_btn_map: 'Explore Live Map',
      home_hero_img_alt: 'Cumbres Mayores',
      home_hero_castle: 'Castillo de Sancho IV',
      home_hero_castle_sub: 'LED perimeter lights operational',
      home_incidents_title: 'Current Issues & Incidents',
      home_incidents_link: 'View All',
      home_activity_title: 'Latest Actions',
      home_activity_link: 'History',
      home_budget_title: 'Community Budgets 2026',
      home_budget_sub: 'Vote for improvement proposals for the Castle and Sierra trails.',
      home_budget_btn: 'Vote Community Proposals →',

      // Incidents View
      incidents_title: 'Cumbres Mayores Incidents Explorer',
      incidents_subtitle: 'Track progress, add more photos and join active reports.',
      incidents_btn_new: '+ Report New Issue',
      incidents_filter_search_ph: 'Search by street or fault...',
      incidents_filter_all_cats: 'All Categories',
      incidents_filter_all_status: 'All Statuses',
      incidents_empty_title: 'No incidents found with those filters',
      incidents_empty_sub: 'Try changing the search or category.',
      incidents_supports: 'supporters',
      incidents_card_btn_detail: 'View detail',

      // Map View
      map_title: 'Geospatial Municipal Map — Cumbres Mayores',
      map_subtitle: 'Geolocated reports in the urban area, Castillo de Sancho IV and GR-48 trail.',
      map_btn_heat: '🔥 Toggle Heat Map',
      map_btn_markers: '📍 View Markers',
      map_btn_report: '+ Report at this point',
      map_filter_title: 'Category Filters',
      map_filter_all: 'All Categories',

      // Modal Incident Detail
      modal_close: 'Close',
      modal_location: 'Location',
      modal_urgency: 'Urgency',
      modal_neighbors: 'Residents affected',
      modal_before_after: '📸 "Before & After" Comparison',
      modal_drag_compare: 'Drag to compare',
      modal_after_tag: '✅ AFTER',
      modal_before_tag: '⚠️ BEFORE',
      modal_photos_title: 'Photos submitted:',
      modal_resolution_title: '✅ Municipal Resolution:',
      modal_timeline_title: 'Progress & Operator Actions:',
      modal_btn_support: '👍 This also affects me',
      modal_admin_title: '⚙️ City Management',
      modal_status_label: 'New Status',
      modal_comment_label: 'Comment (optional)',
      modal_comment_ph: 'e.g. Plumbing team dispatched...',
      modal_btn_update: '💾 Update Status',

      // Status Labels
      status_recibida: 'Received',
      status_validando: 'Validating',
      status_asignada: 'Assigned',
      status_en_proceso: 'In Progress',
      status_resuelta: 'Resolved',
      status_cerrada: 'Closed',

      // Status Options (modal select)
      status_opt_recibida: '📩 Received',
      status_opt_validando: '🔎 Validating',
      status_opt_asignada: '📋 Assigned',
      status_opt_en_proceso: '🔧 In Progress',
      status_opt_resuelta: '✅ Resolved',
      status_opt_cerrada: '🔒 Closed',

      // Priority
      priority_baja: 'Low',
      priority_media: 'Medium',
      priority_alta: 'High',
      priority_urgente: 'Urgent',

      // Categories
      cat_vias: 'Pavements, Cobblestones & Roads',
      cat_alumbrado: 'Street Lighting & Lamps',
      cat_limpieza: 'Urban Cleaning & Squares',
      cat_residuos: 'Waste Bins & Recycling',
      cat_caminos: 'Rural Paths & Dehesa (GR-48)',
      cat_patrimonio: 'Castillo de Sancho IV & Chapels',
      cat_parques: 'Paseo de Andalucía & Gardens',
      cat_agua: 'Water Network, Leaks & Fountains',
      cat_senalizacion: 'Road Signs & Mirrors',
      cat_animales: 'Iberian Livestock & Wildlife',
      cat_otros: 'Other General Incidents',

      // Buttons general
      btn_save: 'Save',
      btn_cancel: 'Cancel',
      btn_submit: 'Submit Report',
      btn_vote: 'Support Proposal',
      btn_voted: 'Supported',
      btn_assign: 'Assign Staff',
      btn_resolve: 'Mark as Resolved',

      // Notifications/Toast
      toast_no_changes: 'No Changes',
      toast_no_changes_msg: 'Select a different status or add a comment to update.',
      toast_status_updated: '✅ Status Updated',
      toast_status_updated_msg: 'The incident has been updated to:',

      // Role Labels
      role_citizen: 'Cumbres Resident',
      role_employee: 'Municipal Operator',
      role_admin: 'Council / Works',
      role_superadmin: 'SuperAdmin',
      role_demo: 'Demo Visitor',

      // Restriction messages
      restrict_demo_report: 'In demo mode you cannot create incidents. Register to participate.',
      restrict_citizen_status: 'Only municipal staff can change the status of incidents.',

      // Activity items (home)
      activity_calle_porta: 'Calle La Portá, 18',
      activity_paseo: 'Paseo de Andalucía',
      activity_castillo: 'Castillo de Sancho IV',
      activity_hace2h: '2 hours ago',
      activity_ayer: 'Yesterday',
      activity_hace2d: '2 days ago'
    }
  },

  init(locale = 'es') {
    const saved = localStorage.getItem('civitas_locale');
    this.currentLocale = saved || locale;
    this.applyTranslations();
  },

  setLocale(locale) {
    if (this.translations[locale]) {
      this.currentLocale = locale;
      localStorage.setItem('civitas_locale', locale);
      this.applyTranslations();
    }
  },

  t(key) {
    const dict = this.translations[this.currentLocale] || this.translations['es'];
    return dict[key] !== undefined ? dict[key] : (this.translations['es'][key] || key);
  },

  applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = this.t(key);
      }
    });

    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      if (key) {
        el.innerHTML = this.t(key);
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) {
        el.setAttribute('placeholder', this.t(key));
      }
    });

    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      const key = el.getAttribute('data-i18n-title');
      if (key) {
        el.setAttribute('title', this.t(key));
      }
    });

    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      const key = el.getAttribute('data-i18n-aria');
      if (key) {
        el.setAttribute('aria-label', this.t(key));
      }
    });
  }
};
