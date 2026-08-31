/**
 * AYUNTAMIENTO DE CUMBRES MAYORES — Master Application Controller
 * Premium Boutique Design System (Bento Grid, Linear/Apple GovTech aesthetics)
 */

import { store } from './state/store.js';
import { AuthService } from './services/authService.js';
import { IncidentService } from './services/incidentService.js';
import { SuggestionService } from './services/suggestionService.js';
import { NotificationService } from './services/notificationService.js';
import { AuditService } from './services/auditService.js';
import { I18n } from './utils/i18n.js';
import { Helpers } from './utils/helpers.js';
import { Security } from './utils/security.js';

import { MapComponent } from './components/mapComponent.js';
import { ReportWizard } from './components/reportWizard.js';
import { AdminDashboard } from './components/adminDashboard.js';
import { SuggestionBoard } from './components/suggestionBoard.js';
import { AuditViewer } from './components/auditViewer.js';

class CivitasAppController {
  constructor() {
    this.currentRoute = 'home';
    this.wizard = ReportWizard;
    this.admin = AdminDashboard;
    this.suggestions = SuggestionBoard;
    this.audit = AuditViewer;
    this.map = MapComponent;
    this.incidentFilters = {
      category: 'all',
      status: 'all',
      search: ''
    };
  }

  init() {
    console.log('🏰 Inicializando Portal Boutique de Cumbres Mayores (Huelva)...');

    // 1. Theme
    this.initTheme();

    // 2. i18n
    I18n.init();

    // 3. PWA
    this.registerServiceWorker();

    // 4. Header controls
    this.renderHeaderControls();

    // 5. Reactive subscription
    store.subscribe(() => {
      this.renderHeaderControls();
      this.renderCurrentView();
    });

    // 6. Accessibility & Keyboard
    this.setupAccessibilityListeners();

    // 7. Initial routing
    const initialRoute = window.location.hash.replace('#', '') || 'home';
    this.navigateTo(initialRoute);

    // 8. Hash change listener
    window.addEventListener('hashchange', () => {
      const route = window.location.hash.replace('#', '') || 'home';
      this.navigateTo(route);
    });
  }

  // --- Theme Management ---
  initTheme() {
    const savedTheme = localStorage.getItem('civitas_theme') || 
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeButton(savedTheme);
  }

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('civitas_theme', next);
    this.updateThemeButton(next);
    store.setState({ currentTheme: next });
    NotificationService.showToast('Tema Actualizado', `Modo ${next === 'dark' ? 'Oscuro' : 'Claro'} activado.`, 'info');
  }

  updateThemeButton(theme) {
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) {
      btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
      btn.setAttribute('aria-label', `Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`);
    }
  }

  // --- Header & Role Controls ---
  renderHeaderControls() {
    const currentUser = store.getState().currentUser;

    // Role Pills
    document.querySelectorAll('.role-pill').forEach(pill => {
      const targetRole = pill.getAttribute('data-role');
      if (currentUser && currentUser.role === targetRole) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    // User Avatar Badge
    const userBadge = document.getElementById('header-user-badge');
    if (userBadge && currentUser) {
      const roleLabels = {
        ROLE_CITIZEN: 'Vecino/a',
        ROLE_EMPLOYEE: 'Operario Municipal',
        ROLE_MUNICIPAL_ADMIN: 'Concejalía / Obras',
        ROLE_SUPERADMIN: 'SuperAdmin'
      };
      userBadge.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.55rem; background: var(--bg-surface-subtle); padding: 0.25rem 0.65rem; border-radius: var(--cm-radius-full); border: 1px solid var(--border-subtle);">
          <img src="${currentUser.avatar}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 1.5px solid var(--brand-primary);" alt="Avatar" />
          <div style="text-align: left; line-height: 1.15; display: none; sm-display: block;">
            <div style="font-size: 0.8rem; font-weight: 750;">${currentUser.name.split(' ')[0]}</div>
            <div style="font-size: 0.675rem; color: var(--text-muted);">${roleLabels[currentUser.role] || currentUser.role}</div>
          </div>
        </div>
      `;
    }

    // Toggle Admin Nav
    const adminNavLink = document.getElementById('nav-link-admin');
    if (adminNavLink) {
      const canAccessAdmin = AuthService.hasRole('ROLE_EMPLOYEE', 'ROLE_MUNICIPAL_ADMIN', 'ROLE_SUPERADMIN');
      adminNavLink.style.display = canAccessAdmin ? 'flex' : 'none';
    }
  }

  switchRole(roleName) {
    const user = AuthService.switchPersona(roleName);
    NotificationService.showToast('Perfil Cambiado', `Ahora navegas como: ${user.name} (${roleName})`, 'success');
  }

  // --- SPA Router & View Management ---
  navigateTo(route) {
    this.currentRoute = route;
    window.location.hash = route;

    document.querySelectorAll('.nav-link, .bottom-nav-item').forEach(link => {
      if (link.getAttribute('data-route') === route) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    this.renderCurrentView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  renderCurrentView() {
    const mainContainer = document.getElementById('main-content-area');
    if (!mainContainer) return;

    switch (this.currentRoute) {
      case 'home':
        this.renderHomeView(mainContainer);
        break;
      case 'report':
        mainContainer.innerHTML = `<div id="report-wizard-container"></div>`;
        this.wizard.init('report-wizard-container');
        break;
      case 'map':
        this.renderMapView(mainContainer);
        break;
      case 'incidents':
        this.renderIncidentsView(mainContainer);
        break;
      case 'suggestions':
        mainContainer.innerHTML = `<div id="suggestions-container"></div>`;
        this.suggestions.init('suggestions-container');
        break;
      case 'admin':
        mainContainer.innerHTML = `<div id="admin-dashboard-container"></div>`;
        this.admin.init('admin-dashboard-container');
        break;
      case 'audit':
        mainContainer.innerHTML = `<div id="audit-container"></div>`;
        this.audit.init('audit-container');
        break;
      default:
        this.renderHomeView(mainContainer);
    }
  }

  // --- View Renderers ---
  renderHomeView(container) {
    const incidents = store.getIncidents();
    const activeCount = incidents.filter(i => !['resuelta', 'cerrada'].includes(i.status)).length;
    const resolvedCount = incidents.filter(i => ['resuelta', 'cerrada'].includes(i.status)).length;
    const activeIncidents = incidents.slice(0, 3);

    container.innerHTML = `
      <!-- Municipal Bando / Live Ticker -->
      <div class="bando-ticker">
        <span class="bando-tag">📢 BANDO OFICIAL</span>
        <span class="bando-text">Actuaciones de repavimentación en Calle La Portá y entorno del Castillo de Sancho IV · Red de agua en servicio normal.</span>
        <span style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--cm-font-mono);">Hoy, 09:30</span>
      </div>

      <!-- Hero Bento Grid (Award-Winning Layout) -->
      <div class="bento-grid">
        <!-- Main Bento Hero Card -->
        <div class="bento-card hero-bento-main">
          <div>
            <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: var(--brand-primary-light); color: var(--brand-primary-text); padding: 0.35rem 0.85rem; border-radius: var(--cm-radius-full); font-size: 0.8rem; font-weight: 750; margin-bottom: 1.25rem; border: 1px solid var(--brand-primary-glow);">
              🌿 Sierra de Aracena y Picos de Aroche
            </div>
            <h1 style="margin-bottom: 0.85rem; line-height: 1.15;">
              Tu voz cuida de <span class="text-gradient">Cumbres Mayores</span>.
            </h1>
            <p style="font-size: 1.05rem; max-width: 580px; margin-bottom: 1.85rem; color: var(--text-secondary);">
              Comunica averías en calles, farolas, senderos rurales del Parque Natural y dehesas comunales. Sigue en directo la resolución de los operarios municipales.
            </p>
          </div>

          <div style="display: flex; gap: 0.85rem; flex-wrap: wrap;">
            <button type="button" class="btn btn-primary btn-lg" onclick="CivitasApp.navigateTo('report')">
              📢 Reportar Incidencia Ahora
            </button>
            <button type="button" class="btn btn-secondary btn-lg" onclick="CivitasApp.navigateTo('map')">
              🗺️ Ver Plano en Vivo
            </button>
          </div>
        </div>

        <!-- Stat Card 1: Resoluciones en Tiempo Real -->
        <div class="bento-card hero-bento-stat">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <span style="font-size: 0.8rem; font-weight: 750; color: var(--text-muted); text-transform: uppercase;">Actividad Municipal</span>
              <div class="live-pulse"><div class="live-pulse-dot"></div><span>En Directo</span></div>
            </div>
            <div style="font-size: 2.75rem; font-weight: 850; color: var(--text-primary); line-height: 1; margin-bottom: 0.35rem;">
              ${resolvedCount} <span style="font-size: 1.1rem; color: var(--brand-primary); font-weight: 700;">Resueltas</span>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted);">
              ${activeCount} avisos actualmente en proceso de trabajo en el casco urbano y senderos.
            </p>
          </div>

          <div style="background: var(--bg-surface-subtle); padding: 0.85rem 1rem; border-radius: var(--cm-radius-md); border: 1px solid var(--border-subtle); margin-top: 1rem;">
            <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 650; margin-bottom: 0.35rem;">
              <span>Tiempo Medio de Respuesta (TMR)</span>
              <span style="color: var(--brand-primary);">18.4 horas</span>
            </div>
            <div style="height: 6px; background: var(--border-strong); border-radius: var(--cm-radius-full); overflow: hidden;">
              <div style="width: 85%; height: 100%; background: var(--brand-primary);"></div>
            </div>
          </div>
        </div>

        <!-- Bento CTA 1: Presupuestos Vecinales -->
        <div class="bento-card hero-bento-cta" onclick="CivitasApp.navigateTo('suggestions')">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
            <span style="font-size: 2rem;">💡</span>
            <span class="badge" style="background: var(--brand-accent-light); color: var(--brand-accent);">Presupuestos 2026</span>
          </div>
          <div>
            <h3 style="font-size: 1.15rem; margin-bottom: 0.35rem;">Propuestas Ciudadanas</h3>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">
              Vota proyectos para la iluminación del Castillo de Sancho IV y acondicionamiento de senderos.
            </p>
          </div>
          <div style="margin-top: 1rem; font-size: 0.85rem; font-weight: 700; color: var(--brand-primary); display: flex; align-items: center; gap: 0.35rem;">
            Participar y votar &rarr;
          </div>
        </div>

        <!-- Bento CTA 2: Plano Interactivo -->
        <div class="bento-card hero-bento-cta" onclick="CivitasApp.navigateTo('map')">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
            <span style="font-size: 2rem;">🗺️</span>
            <span class="badge" style="background: var(--status-en_proceso-bg); color: var(--status-en_proceso-text);">Cartografía GPS</span>
          </div>
          <div>
            <h3 style="font-size: 1.15rem; margin-bottom: 0.35rem;">Plano y Mapa de Calor</h3>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">
              Explora en tiempo real las actuaciones en Calle La Portá, Paseo de Andalucía y GR-48.
            </p>
          </div>
          <div style="margin-top: 1rem; font-size: 0.85rem; font-weight: 700; color: var(--brand-primary); display: flex; align-items: center; gap: 0.35rem;">
            Abrir mapa interactivo &rarr;
          </div>
        </div>

        <!-- Bento CTA 3: Asistente Express -->
        <div class="bento-card hero-bento-cta" onclick="CivitasApp.navigateTo('report')">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
            <span style="font-size: 2rem;">⚡</span>
            <span class="badge" style="background: var(--status-validando-bg); color: var(--status-validando-text);">4 Pasos Fáciles</span>
          </div>
          <div>
            <h3 style="font-size: 1.15rem; margin-bottom: 0.35rem;">Aviso en 30 Segundos</h3>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">
              Detecta, ubica con GPS, sube foto y recibe notificaciones de reparación del Ayuntamiento.
            </p>
          </div>
          <div style="margin-top: 1rem; font-size: 0.85rem; font-weight: 700; color: var(--brand-primary); display: flex; align-items: center; gap: 0.35rem;">
            Iniciar asistente &rarr;
          </div>
        </div>
      </div>

      <!-- Recent Incidents Feed -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <div>
          <h2>Avisos Vecinales Recientes</h2>
          <p style="font-size: 0.875rem;">Seguimiento transparente de intervenciones en el municipio.</p>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="CivitasApp.navigateTo('incidents')">Ver Todas (${incidents.length}) &rarr;</button>
      </div>

      <div class="incidents-grid" style="margin-bottom: 2.5rem;">
        ${activeIncidents.map(inc => this.renderIncidentCard(inc)).join('')}
      </div>
    `;
  }

  renderMapView(container) {
    const categories = store.getState().categories;

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.85rem;">
        <div>
          <h2>Plano Municipal Geoespacial — Cumbres Mayores</h2>
          <p style="font-size: 0.875rem;">Avisos georreferenciados en el casco urbano, Castillo de Sancho IV y sendero GR-48.</p>
        </div>
        <div style="display: flex; gap: 0.65rem;">
          <button class="btn btn-secondary btn-sm" id="btn-toggle-heat" onclick="CivitasApp.toggleMapHeatmap()">
            🔥 Alternar Mapa de Calor
          </button>
          <button class="btn btn-primary btn-sm" onclick="CivitasApp.navigateTo('report')">
            ➕ Reportar en este punto
          </button>
        </div>
      </div>

      <div class="map-view-container">
        <div class="map-wrapper">
          <div id="map"></div>
        </div>

        <div class="map-sidebar">
          <div class="map-sidebar-header">
            <h4 style="font-size: 0.95rem; margin-bottom: 0.5rem;">Filtros de Categoría</h4>
            <select id="map-category-filter" class="form-control" onchange="CivitasApp.filterMapIncidents(this.value)" style="padding: 0.45rem 0.85rem; font-size: 0.85rem;">
              <option value="all">Todas las Categorías</option>
              ${categories.map(c => `<option value="${c.id}">${c.icon} ${c.name}</option>`).join('')}
            </select>
          </div>
          <div class="map-sidebar-list" id="map-sidebar-incidents">
            ${store.getIncidents().map(inc => `
              <div class="bento-card card-hoverable" style="padding: 0.85rem; font-size: 0.85rem;" onclick="CivitasApp.openIncidentDetail('${inc.id}')">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                  <strong style="color: var(--brand-primary);">${inc.trackingCode}</strong>
                  <span class="badge status-${inc.status}" style="font-size: 0.65rem;">${inc.status.replace('_', ' ')}</span>
                </div>
                <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem;">${inc.title}</div>
                <div style="color: var(--text-muted); font-size: 0.75rem;">📍 ${inc.address}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      MapComponent.init('map', { lat: 38.0623, lng: -6.6466, zoom: 16 });
    }, 60);
  }

  filterMapIncidents(categoryId) {
    MapComponent.renderIncidents(categoryId, 'all');
  }

  toggleMapHeatmap() {
    const mode = MapComponent.toggleHeatmap();
    const btn = document.getElementById('btn-toggle-heat');
    if (btn) {
      btn.innerHTML = mode === 'heatmap' ? '📍 Ver Marcadores' : '🔥 Alternar Mapa de Calor';
    }
  }

  renderIncidentsView(container) {
    const categories = store.getState().categories;
    const incidents = store.getIncidents();

    const filtered = incidents.filter(inc => {
      const matchCat = this.incidentFilters.category === 'all' || inc.category === this.incidentFilters.category;
      const matchStatus = this.incidentFilters.status === 'all' || inc.status === this.incidentFilters.status;
      const matchSearch = !this.incidentFilters.search || 
        inc.title.toLowerCase().includes(this.incidentFilters.search.toLowerCase()) ||
        inc.trackingCode.toLowerCase().includes(this.incidentFilters.search.toLowerCase()) ||
        inc.address.toLowerCase().includes(this.incidentFilters.search.toLowerCase());
      return matchCat && matchStatus && matchSearch;
    });

    container.innerHTML = `
      <div class="feed-header-bar">
        <div>
          <h2>Explorador de Incidencias de Cumbres Mayores</h2>
          <p style="font-size: 0.9rem;">Consulta la evolución, aporta fotos adicionales y súmate a incidencias activas.</p>
        </div>
        <button class="btn btn-primary" onclick="CivitasApp.navigateTo('report')">
          ➕ Comunicar Nueva Incidencia
        </button>
      </div>

      <!-- Filter Toolbar -->
      <div class="bento-card" style="margin-bottom: 1.75rem; padding: 1.15rem;">
        <div style="display: flex; gap: 0.85rem; flex-wrap: wrap;">
          <div class="input-icon-wrapper" style="flex: 1; min-width: 240px;">
            <span class="input-icon">🔍</span>
            <input type="text" class="form-control" placeholder="Buscar por calle (Ej: Calle La Portá, Castillo...)" 
                   value="${this.incidentFilters.search}" oninput="CivitasApp.applyIncidentFilter('search', this.value)" />
          </div>

          <select class="form-control" style="width: auto; min-width: 190px;" onchange="CivitasApp.applyIncidentFilter('category', this.value)">
            <option value="all" ${this.incidentFilters.category === 'all' ? 'selected' : ''}>Todas las Categorías</option>
            ${categories.map(c => `<option value="${c.id}" ${this.incidentFilters.category === c.id ? 'selected' : ''}>${c.icon} ${c.name}</option>`).join('')}
          </select>

          <select class="form-control" style="width: auto; min-width: 170px;" onchange="CivitasApp.applyIncidentFilter('status', this.value)">
            <option value="all" ${this.incidentFilters.status === 'all' ? 'selected' : ''}>Todos los Estados</option>
            <option value="recibida" ${this.incidentFilters.status === 'recibida' ? 'selected' : ''}>Recibidas</option>
            <option value="validando" ${this.incidentFilters.status === 'validando' ? 'selected' : ''}>Validando</option>
            <option value="asignada" ${this.incidentFilters.status === 'asignada' ? 'selected' : ''}>Asignadas</option>
            <option value="en_proceso" ${this.incidentFilters.status === 'en_proceso' ? 'selected' : ''}>En Proceso</option>
            <option value="resuelta" ${this.incidentFilters.status === 'resuelta' ? 'selected' : ''}>Resueltas</option>
            <option value="cerrada" ${this.incidentFilters.status === 'cerrada' ? 'selected' : ''}>Cerradas</option>
          </select>
        </div>
      </div>

      <!-- Results Grid -->
      <div class="incidents-grid">
        ${filtered.length === 0 ? `
          <div class="bento-card" style="grid-column: 1 / -1; text-align: center; padding: 3.5rem 1.5rem;">
            <div style="font-size: 2.75rem; margin-bottom: 0.5rem;">🔍</div>
            <h3>No se encontraron incidencias con esos filtros</h3>
            <p style="margin-top: 0.25rem;">Prueba a cambiar los términos de búsqueda.</p>
          </div>
        ` : filtered.map(inc => this.renderIncidentCard(inc)).join('')}
      </div>
    `;
  }

  renderIncidentCard(inc) {
    const defaultImg = 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=800&auto=format&fit=crop&q=80';
    const cardImg = inc.images && inc.images.length ? inc.images[0] : defaultImg;

    return `
      <div class="bento-card card-hoverable incident-card" onclick="CivitasApp.openIncidentDetail('${inc.id}')">
        <img src="${cardImg}" class="incident-card-image" alt="${inc.title}" />
        <div class="incident-meta">
          <span style="font-size: 0.75rem; font-weight: 750; color: var(--text-muted); font-family: var(--cm-font-mono);">${inc.trackingCode}</span>
          <span class="badge status-${inc.status}">${inc.status.replace('_', ' ')}</span>
        </div>
        <h4 class="incident-title">${inc.title}</h4>
        <p class="incident-desc">${inc.description}</p>
        <div class="incident-footer">
          <span>📍 ${inc.address}</span>
          <span style="font-weight: 650; color: var(--brand-primary);">👥 ${inc.adherentsCount} apoyos</span>
        </div>
      </div>
    `;
  }

  applyIncidentFilter(key, value) {
    this.incidentFilters[key] = value;
    this.renderIncidentsView(document.getElementById('main-content-area'));
  }

  // --- Modal Detail Views with Before / After Comparison ---
  openIncidentDetail(incidentId) {
    const incident = store.getState().incidents.find(i => i.id === incidentId);
    if (!incident) return;

    const modalBackdrop = document.getElementById('app-modal-backdrop');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalFooter = document.getElementById('modal-footer');

    const isResolved = incident.status === 'resuelta' || incident.status === 'cerrada';
    const hasResolutionPhoto = incident.resolutionImages && incident.resolutionImages.length > 0;
    const hasInitialPhoto = incident.images && incident.images.length > 0;

    modalTitle.innerHTML = `
      <div style="display:flex; align-items:center; gap:0.6rem;">
        <span style="font-family: var(--cm-font-mono); font-weight:800;">${incident.trackingCode}</span>
        <span class="badge status-${incident.status}">${incident.status.replace('_', ' ')}</span>
      </div>
    `;

    modalBody.innerHTML = `
      <h3 style="margin-bottom: 0.5rem;">${incident.title}</h3>
      <p style="color: var(--text-secondary); margin-bottom: 1.15rem;">${incident.description}</p>
      
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.25rem; font-size: 0.85rem; color: var(--text-muted); background: var(--bg-surface-subtle); padding: 0.75rem 1rem; border-radius: var(--cm-radius-md); border: 1px solid var(--border-subtle);">
        <div>📍 <strong>Ubicación:</strong> ${incident.address}</div>
        <div>⚡ <strong>Urgencia:</strong> <span class="badge priority-${incident.urgency}">${incident.urgency}</span></div>
        <div>👥 <strong>Vecinos afectados:</strong> ${incident.adherentsCount}</div>
      </div>

      <!-- Before / After Interactive Slider (if resolved with photos) -->
      ${isResolved && hasResolutionPhoto && hasInitialPhoto ? `
        <div style="margin-bottom: 1.5rem;">
          <h4 style="font-size: 0.95rem; margin-bottom: 0.4rem; display:flex; align-items:center; justify-content:space-between;">
            <span>📸 Comparativa Interactiva "Antes y Después"</span>
            <span style="font-size:0.75rem; color:var(--text-muted); font-weight:normal;">Arrastra para comparar</span>
          </h4>
          <div class="before-after-container" id="before-after-box">
            <img src="${incident.resolutionImages[0]}" class="before-after-img" alt="Después de la reparación" />
            <span class="before-after-tag after-tag">✅ DESPUÉS (REPARADO)</span>
            
            <div class="before-after-overlay" id="before-after-overlay" style="width: 50%;">
              <img src="${incident.images[0]}" style="width: 600px; max-width: none; height: 100%; object-fit: cover;" alt="Antes de la reparación" />
              <span class="before-after-tag before-tag">⚠️ ANTES</span>
            </div>

            <input type="range" min="0" max="100" value="50" class="before-after-slider-input" 
                   oninput="document.getElementById('before-after-overlay').style.width = this.value + '%'" />
          </div>
        </div>
      ` : (hasInitialPhoto ? `
        <div style="margin-bottom: 1.5rem;">
          <h4 style="font-size: 0.9rem; margin-bottom: 0.5rem;">Fotografías aportadas:</h4>
          <div style="display: flex; gap: 0.6rem; overflow-x: auto;">
            ${incident.images.map(img => `
              <img src="${img}" style="height: 150px; border-radius: var(--cm-radius-md); object-fit: cover; border: 1px solid var(--border-subtle);" alt="Evidencia" />
            `).join('')}
          </div>
        </div>
      ` : '')}

      ${incident.resolutionNotes ? `
        <div style="background-color: var(--status-resuelta-bg); border-left: 4px solid var(--cm-forest-600); padding: 1rem 1.25rem; border-radius: 0 var(--cm-radius-md) var(--cm-radius-md) 0; margin-bottom: 1.5rem;">
          <h4 style="color: var(--cm-forest-700); font-size: 0.95rem; margin-bottom: 0.35rem;">✅ Dictamen y Resolución Municipal:</h4>
          <p style="font-size: 0.9rem; color: var(--text-primary);">${incident.resolutionNotes}</p>
        </div>
      ` : ''}

      <!-- Timeline -->
      <h4 style="font-size: 0.95rem; margin-bottom: 0.5rem;">Evolución y Actuaciones de los Operarios:</h4>
      <div class="timeline">
        ${(incident.history || []).map((h, idx) => `
          <div class="timeline-item ${idx === incident.history.length - 1 ? 'active' : 'completed'}">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                <span class="badge status-${h.status}" style="font-size: 0.7rem;">${h.status.replace('_', ' ')}</span>
                <span class="timeline-date">${Helpers.formatDate(h.timestamp)}</span>
              </div>
              <p style="font-size: 0.85rem; color: var(--text-primary);">${h.comment}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    modalFooter.innerHTML = `
      <button class="btn btn-secondary" onclick="CivitasApp.closeModal()">Cerrar</button>
      <button class="btn btn-primary" onclick="CivitasApp.supportIncidentFromModal('${incident.id}')">
        👍 A mí también me afecta (${incident.adherentsCount})
      </button>
    `;

    modalBackdrop.classList.add('active');
  }

  supportIncidentFromModal(incidentId) {
    IncidentService.addAdherent(incidentId);
    this.openIncidentDetail(incidentId);
    this.renderCurrentView();
  }

  closeModal() {
    const modalBackdrop = document.getElementById('app-modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.classList.remove('active');
    }
  }

  setupAccessibilityListeners() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
      }
    });

    const modalBackdrop = document.getElementById('app-modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
          this.closeModal();
        }
      });
    }
  }

  // --- PWA Service Worker ---
  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log('✅ ServiceWorker registrado para Cumbres Mayores', reg.scope))
        .catch(err => console.warn('Aviso ServiceWorker', err));
    }
  }
}

export const CivitasApp = new CivitasAppController();
window.CivitasApp = CivitasApp;

document.addEventListener('DOMContentLoaded', () => {
  CivitasApp.init();
});
