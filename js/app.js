/**
 * CIVITAS / AYUNTAMIENTO DE CUMBRES MAYORES
 * Master Application Controller
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
    console.log('🏰 Inicializando App del Ayuntamiento de Cumbres Mayores (Huelva)...');

    // 1. Initialize Theme
    this.initTheme();

    // 2. Initialize i18n
    I18n.init();

    // 3. Register Service Worker for PWA
    this.registerServiceWorker();

    // 4. Render User and Header
    this.renderHeaderControls();

    // 5. Store Listener
    store.subscribe(() => {
      this.renderHeaderControls();
      this.renderCurrentView();
    });

    // 6. Keyboard Accessibility Listeners
    this.setupAccessibilityListeners();

    // 7. Initial Route Navigation
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

    // Role Pills in Top Dev Bar
    document.querySelectorAll('.role-pill').forEach(pill => {
      const targetRole = pill.getAttribute('data-role');
      if (currentUser && currentUser.role === targetRole) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    // Current User avatar & badge in Header
    const userBadge = document.getElementById('header-user-badge');
    if (userBadge && currentUser) {
      const roleLabels = {
        ROLE_CITIZEN: 'Vecino/a',
        ROLE_EMPLOYEE: 'Operario Municipal',
        ROLE_MUNICIPAL_ADMIN: 'Concejalía / Obras',
        ROLE_SUPERADMIN: 'SuperAdmin'
      };
      userBadge.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <img src="${currentUser.avatar}" style="width: 34px; height: 34px; border-radius: 50%; object-fit: cover; border: 2px solid var(--brand-primary);" alt="Avatar" />
          <div style="text-align: right; line-height: 1.15; display: none; sm-display: block;">
            <div style="font-size: 0.825rem; font-weight: 700;">${currentUser.name.split(' ')[0]}</div>
            <div style="font-size: 0.7rem; color: var(--text-muted);">${roleLabels[currentUser.role] || currentUser.role}</div>
          </div>
        </div>
      `;
    }

    // Toggle Admin Nav link visibility based on role
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
    const municipality = store.getCurrentMunicipality();
    const activeIncidents = store.getIncidents().slice(0, 3);

    container.innerHTML = `
      <!-- Hero Banner -->
      <section class="hero-banner">
        <div class="hero-content">
          <div style="display: inline-flex; align-items: center; gap: 0.5rem; background-color: var(--brand-primary-light); color: var(--brand-primary); padding: 0.35rem 0.85rem; border-radius: var(--civ-radius-full); font-size: 0.8rem; font-weight: 700; margin-bottom: 1rem;">
            🏰 Ayuntamiento de Cumbres Mayores (Huelva) — Sierra de Aracena
          </div>
          <h1 class="hero-title">Cuidemos juntos de Cumbres Mayores. Comunica, participa y mejora nuestro pueblo.</h1>
          <p class="hero-subtitle">Informa de averías en calles, farolas, senderos del Parque Natural y dehesas comunales en 4 sencillos pasos. Sigue en tiempo real las actuaciones de los operarios municipales.</p>
          
          <div class="hero-actions">
            <button type="button" class="btn btn-primary btn-lg" onclick="CivitasApp.navigateTo('report')">
              📢 Reportar Incidencia
            </button>
            <button type="button" class="btn btn-secondary btn-lg" onclick="CivitasApp.navigateTo('map')">
              🗺️ Ver Plano Municipal
            </button>
          </div>

          <div class="hero-steps">
            <div class="hero-step-item"><div class="hero-step-num">1</div> Detectar</div>
            <div class="hero-step-item"><div class="hero-step-num">2</div> Ubicar (GPS)</div>
            <div class="hero-step-item"><div class="hero-step-num">3</div> Informar</div>
            <div class="hero-step-item"><div class="hero-step-num">4</div> Seguir</div>
          </div>
        </div>
      </section>

      <!-- Recent Incidents Feed Preview -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
        <h3>Avisos e Incidencias Recientes en Cumbres Mayores</h3>
        <button class="btn btn-outline btn-sm" onclick="CivitasApp.navigateTo('incidents')">Ver Todas &rarr;</button>
      </div>

      <div class="incidents-grid" style="margin-bottom: 2.5rem;">
        ${activeIncidents.map(inc => this.renderIncidentCard(inc)).join('')}
      </div>

      <!-- Participatory Proposals Banner -->
      <div class="card" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%); border-color: var(--civ-emerald-500); padding: 1.75rem; margin-bottom: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <span class="badge" style="background-color: var(--civ-emerald-100); color: var(--civ-emerald-700); margin-bottom: 0.5rem;">Presupuestos Participativos Cumbres Mayores</span>
            <h2>¿Tienes una propuesta para mejorar el pueblo o la dehesa?</h2>
            <p>Vota proyectos vecinales y propón mejoras de patrimonio, sendas e infraestructuras para el próximo Pleno Municipal.</p>
          </div>
          <button class="btn btn-emerald btn-lg" onclick="CivitasApp.navigateTo('suggestions')">
            💡 Ver y Votar Propuestas
          </button>
        </div>
      </div>
    `;
  }

  renderMapView(container) {
    const categories = store.getState().categories;

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.75rem;">
        <div>
          <h2>Plano Municipal de Incidencias — Cumbres Mayores</h2>
          <p style="font-size: 0.875rem;">Visualización geoespacial de incidencias en el casco urbano, Castillo de Sancho IV y sendero GR-48.</p>
        </div>
        <div style="display: flex; gap: 0.5rem;">
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
            <select id="map-category-filter" class="form-control" onchange="CivitasApp.filterMapIncidents(this.value)" style="padding: 0.4rem 0.75rem; font-size: 0.85rem;">
              <option value="all">Todas las Categorías</option>
              ${categories.map(c => `<option value="${c.id}">${c.icon} ${c.name}</option>`).join('')}
            </select>
          </div>
          <div class="map-sidebar-list" id="map-sidebar-incidents">
            ${store.getIncidents().map(inc => `
              <div class="card card-hoverable" style="padding: 0.75rem; font-size: 0.85rem;" onclick="CivitasApp.openIncidentDetail('${inc.id}')">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                  <strong style="color: var(--brand-primary);">${inc.trackingCode}</strong>
                  <span class="badge status-${inc.status}" style="font-size: 0.65rem;">${inc.status.replace('_', ' ')}</span>
                </div>
                <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem;">${inc.title}</div>
                <div style="color: var(--text-muted); font-size: 0.75rem;">📍 ${inc.address}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      MapComponent.init('map', { lat: 38.0623, lng: -6.6466, zoom: 16 });
    }, 50);
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

      <!-- Advanced Filter Toolbar -->
      <div class="card" style="margin-bottom: 1.5rem; padding: 1rem;">
        <div class="filter-group">
          <div class="input-icon-wrapper" style="flex: 1; min-width: 220px;">
            <span class="input-icon">🔍</span>
            <input type="text" class="form-control" placeholder="Buscar por calle (Ej: Calle La Portá, Castillo...)" 
                   value="${this.incidentFilters.search}" oninput="CivitasApp.applyIncidentFilter('search', this.value)" />
          </div>

          <select class="form-control" style="width: auto; min-width: 180px;" onchange="CivitasApp.applyIncidentFilter('category', this.value)">
            <option value="all" ${this.incidentFilters.category === 'all' ? 'selected' : ''}>Todas las Categorías</option>
            ${categories.map(c => `<option value="${c.id}" ${this.incidentFilters.category === c.id ? 'selected' : ''}>${c.icon} ${c.name}</option>`).join('')}
          </select>

          <select class="form-control" style="width: auto; min-width: 160px;" onchange="CivitasApp.applyIncidentFilter('status', this.value)">
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
          <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem;">
            <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔍</div>
            <h3>No se encontraron avisos con esos filtros</h3>
            <p>Prueba a cambiar la búsqueda o categoría.</p>
          </div>
        ` : filtered.map(inc => this.renderIncidentCard(inc)).join('')}
      </div>
    `;
  }

  renderIncidentCard(inc) {
    const defaultImg = 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=800&auto=format&fit=crop&q=80';
    const cardImg = inc.images && inc.images.length ? inc.images[0] : defaultImg;

    return `
      <div class="card card-hoverable incident-card" onclick="CivitasApp.openIncidentDetail('${inc.id}')">
        <img src="${cardImg}" class="incident-card-image" alt="${inc.title}" />
        <div class="incident-meta">
          <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted);">${inc.trackingCode}</span>
          <span class="badge status-${inc.status}">${inc.status.replace('_', ' ')}</span>
        </div>
        <h4 class="incident-title">${inc.title}</h4>
        <p class="incident-desc">${inc.description}</p>
        <div class="incident-footer">
          <span>📍 ${inc.address}</span>
          <span>👥 ${inc.adherentsCount} apoyos</span>
        </div>
      </div>
    `;
  }

  applyIncidentFilter(key, value) {
    this.incidentFilters[key] = value;
    this.renderIncidentsView(document.getElementById('main-content-area'));
  }

  // --- Modal Detail Views ---
  openIncidentDetail(incidentId) {
    const incident = store.getState().incidents.find(i => i.id === incidentId);
    if (!incident) return;

    const modalBackdrop = document.getElementById('app-modal-backdrop');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalFooter = document.getElementById('modal-footer');

    modalTitle.innerHTML = `
      <div style="display:flex; align-items:center; gap:0.5rem;">
        <span>${incident.trackingCode}</span>
        <span class="badge status-${incident.status}">${incident.status.replace('_', ' ')}</span>
      </div>
    `;

    modalBody.innerHTML = `
      <h3 style="margin-bottom: 0.5rem;">${incident.title}</h3>
      <p style="color: var(--text-secondary); margin-bottom: 1rem;">${incident.description}</p>
      
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.25rem; font-size: 0.85rem; color: var(--text-muted);">
        <div>📍 <strong>Ubicación:</strong> ${incident.address}</div>
        <div>⚡ <strong>Urgencia:</strong> <span class="badge priority-${incident.urgency}">${incident.urgency}</span></div>
        <div>👥 <strong>Vecinos afectados:</strong> ${incident.adherentsCount}</div>
      </div>

      ${incident.images && incident.images.length ? `
        <div style="margin-bottom: 1.5rem;">
          <h4 style="font-size: 0.9rem; margin-bottom: 0.5rem;">Fotografías aportadas:</h4>
          <div style="display: flex; gap: 0.5rem; overflow-x: auto;">
            ${incident.images.map(img => `
              <img src="${img}" style="height: 140px; border-radius: var(--civ-radius-md); object-fit: cover;" alt="Evidencia" />
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${incident.resolutionNotes ? `
        <div style="background-color: var(--status-resolved-bg); border-left: 4px solid var(--civ-emerald-600); padding: 1rem; border-radius: 0 var(--civ-radius-md) var(--civ-radius-md) 0; margin-bottom: 1.5rem;">
          <h4 style="color: var(--civ-emerald-700); font-size: 0.95rem; margin-bottom: 0.25rem;">✅ Resolución por los Servicios Municipales:</h4>
          <p style="font-size: 0.9rem; color: var(--text-primary);">${incident.resolutionNotes}</p>
          ${incident.resolutionImages && incident.resolutionImages.length ? `
            <div style="margin-top: 0.5rem; display: flex; gap: 0.5rem;">
              ${incident.resolutionImages.map(img => `
                <img src="${img}" style="height: 100px; border-radius: var(--civ-radius-sm); object-fit: cover;" alt="Resolución" />
              `).join('')}
            </div>
          ` : ''}
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
      <button class="btn btn-outline" onclick="CivitasApp.supportIncidentFromModal('${incident.id}')">
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
        .then(reg => console.log('✅ ServiceWorker de Cumbres Mayores registrado', reg.scope))
        .catch(err => console.warn('Aviso: ServiceWorker no registrado (posible entorno local)', err));
    }
  }
}

export const CivitasApp = new CivitasAppController();
window.CivitasApp = CivitasApp;

document.addEventListener('DOMContentLoaded', () => {
  CivitasApp.init();
});
