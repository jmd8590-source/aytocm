/**
 * CIVITAS - Internationalization (i18n) Engine
 * Multi-language support (ES, EN, CA, GL, EU)
 */

export const I18n = {
  currentLocale: 'es',

  translations: {
    es: {
      app_title: 'Civitas — Plataforma Municipal',
      app_motto: 'Tu Ayuntamiento más cerca',
      nav_report: 'Reportar Incidencia',
      nav_map: 'Mapa Interactivo',
      nav_incidents: 'Incidencias',
      nav_suggestions: 'Sugerencias',
      nav_admin: 'Panel Municipal',
      hero_title: 'Transformando juntos nuestro municipio',
      hero_subtitle: 'Comunica incidencias, vota mejoras vecinales y sigue en tiempo real las actuaciones del Ayuntamiento.',
      hero_cta_report: 'Reportar Incidencia',
      hero_cta_explore: 'Ver Mapa en Directo',
      step_1: '1. Detectar',
      step_2: '2. Ubicar',
      step_3: '3. Informar',
      step_4: '4. Seguir',
      status_recibida: 'Recibida',
      status_validando: 'Validando',
      status_asignada: 'Asignada',
      status_en_proceso: 'En Proceso',
      status_resuelta: 'Resuelta',
      status_cerrada: 'Cerrada',
      priority_baja: 'Baja',
      priority_media: 'Media',
      priority_alta: 'Alta',
      priority_urgente: 'Urgente',
      cat_limpieza: 'Limpieza y Vía Pública',
      cat_alumbrado: 'Alumbrado Público',
      cat_vias: 'Aceras y Asfalto',
      cat_residuos: 'Contenedores y Basura',
      cat_parques: 'Parques y Zonas Verdes',
      cat_mobiliario: 'Mobiliario Urbano',
      cat_senalizacion: 'Señalización y Tráfico',
      cat_agua: 'Red de Agua y Saneamiento',
      cat_ruido: 'Ruido y Molestias',
      cat_animales: 'Animales y Fauna',
      cat_otros: 'Otras Incidencias',
      btn_save: 'Guardar',
      btn_cancel: 'Cancelar',
      btn_submit: 'Enviar Reporte',
      btn_vote: 'Apoyar Propuesta',
      btn_voted: 'Apoyado',
      btn_assign: 'Asignar Técnico',
      btn_resolve: 'Marcar como Resuelta'
    },
    en: {
      app_title: 'Civitas — Civic Platform',
      app_motto: 'Your City Hall Closer',
      nav_report: 'Report Issue',
      nav_map: 'Live Map',
      nav_incidents: 'Incidents',
      nav_suggestions: 'Proposals',
      nav_admin: 'City Dashboard',
      hero_title: 'Transforming our city together',
      hero_subtitle: 'Report incidents, vote on community improvements and track city council actions in real time.',
      hero_cta_report: 'Report an Issue',
      hero_cta_explore: 'View Live Map',
      step_1: '1. Detect',
      step_2: '2. Locate',
      step_3: '3. Report',
      step_4: '4. Track',
      status_recibida: 'Received',
      status_validando: 'Validating',
      status_asignada: 'Assigned',
      status_en_proceso: 'In Progress',
      status_resuelta: 'Resolved',
      status_cerrada: 'Closed',
      priority_baja: 'Low',
      priority_media: 'Medium',
      priority_alta: 'High',
      priority_urgente: 'Urgent',
      cat_limpieza: 'Street Cleaning',
      cat_alumbrado: 'Street Lighting',
      cat_vias: 'Roads & Pavements',
      cat_residuos: 'Waste & Bins',
      cat_parques: 'Parks & Green Areas',
      cat_mobiliario: 'Urban Furniture',
      cat_senalizacion: 'Traffic & Signs',
      cat_agua: 'Water & Sewage',
      cat_ruido: 'Noise & Nuisance',
      cat_animales: 'Animals & Wildlife',
      cat_otros: 'Other Issues',
      btn_save: 'Save',
      btn_cancel: 'Cancel',
      btn_submit: 'Submit Report',
      btn_vote: 'Support Proposal',
      btn_voted: 'Supported',
      btn_assign: 'Assign Staff',
      btn_resolve: 'Mark as Resolved'
    },
    ca: {
      app_title: 'Civitas — Plataforma Municipal',
      app_motto: 'El teu Ajuntament més a prop',
      nav_report: 'Comunicar Incidència',
      nav_map: 'Mapa Interactiu',
      nav_incidents: 'Incidències',
      nav_suggestions: 'Suggeriments',
      nav_admin: 'Panell Municipal',
      hero_title: 'Transformant junts el nostre municipi',
      hero_subtitle: 'Comunica incidències, vota millores veïnals i segueix en temps real les actuacions municipals.',
      hero_cta_report: 'Reportar Incidència',
      hero_cta_explore: 'Veure Mapa en Directe',
      step_1: '1. Detectar',
      step_2: '2. Ubicar',
      step_3: '3. Informar',
      step_4: '4. Seguir',
      status_recibida: 'Rebuda',
      status_validando: 'Validant',
      status_asignada: 'Assignada',
      status_en_proceso: 'En Procés',
      status_resuelta: 'Resolta',
      status_cerrada: 'Tancada',
      priority_baja: 'Baixa',
      priority_media: 'Mitjana',
      priority_alta: 'Alta',
      priority_urgente: 'Urgent',
      cat_limpieza: 'Neteja i Via Pública',
      cat_alumbrado: 'Enllumenat Públic',
      cat_vias: 'Voreres i Asfalt',
      cat_residuos: 'Contenidors i Residus',
      cat_parques: 'Parcs i Zones Verdes',
      cat_mobiliario: 'Mobiliari Urbà',
      cat_senalizacion: 'Senyalització i Trànsit',
      cat_agua: 'Xarxa d\'Aigua',
      cat_ruido: 'Soroll i Molèsties',
      cat_animales: 'Animals i Fauna',
      cat_otros: 'Altres Incidències',
      btn_save: 'Desar',
      btn_cancel: 'Cancel·lar',
      btn_submit: 'Enviar Informe',
      btn_vote: 'Donar Suport',
      btn_voted: 'Amb Suport',
      btn_assign: 'Assignar Tècnic',
      btn_resolve: 'Marcar com a Resolta'
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
    return dict[key] || key;
  },

  applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = this.t(key);
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) {
        el.setAttribute('placeholder', this.t(key));
      }
    });
  }
};
