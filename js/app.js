/**
 * AYUNTAMIENTO DE CUMBRES MAYORES — Master Controller
 * VibeCut Luxury Sunset & Deep Espresso Dashboard Architecture
 * Iconografía Vectorial SVG Artesanal & Barra de Roles de Alto Contraste
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
import { Icons } from './utils/icons.js';

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
    console.log('🏰 Inicializando Dashboard Cumbres Mayores (Huelva) con Iconografía Vectorial...');

    // 1. Inject SVG Defs
    const defsContainer = document.getElementById('svg-defs-container');
    if (defsContainer) {
      defsContainer.innerHTML = Icons.defs;
    }

    // 2. Populate Static Icons
    this.populateStaticIcons();

    // 3. i18n
    I18n.init();

    // 4. PWA
    this.registerServiceWorker();

    // 5. Render Header & Role controls
    this.renderHeaderControls();

    // 6. Reactive subscription
    store.subscribe(() => {
      this.renderHeaderControls();
      this.renderCurrentView();
    });

    // 7. Accessibility Listeners
    this.setupAccessibilityListeners();

    // 8. Initial Route Navigation
    const initialRoute = window.location.hash.replace('#', '') || 'home';
    this.navigateTo(initialRoute);

    // 9. Hash change listener
    window.addEventListener('hashchange', () => {
      const route = window.location.hash.replace('#', '') || 'home';
      this.navigateTo(route);
    });
  }

  populateStaticIcons() {
    // Brand Logo
    const brandLogo = document.getElementById('brand-logo-container');
    if (brandLogo) brandLogo.innerHTML = Icons.get('castle', 24, '#FFFFFF');

    // Sidebar Icons
    document.querySelectorAll('.sidebar-link-icon-box').forEach(box => {
      const iconKey = box.getAttribute('data-icon');
      if (iconKey) {
        box.innerHTML = Icons.get(iconKey, 18, '#FFAE33');
      }
    });

    // Sidebar CTA Icon
    const ctaIcon = document.getElementById('sidebar-cta-icon');
    if (ctaIcon) ctaIcon.innerHTML = Icons.get('bulb', 22, '#FFAE33');

    // Topbar Search Icon
    const searchIcon = document.getElementById('topbar-search-icon');
    if (searchIcon) {
      searchIcon.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFAE33" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      `;
    }

    // Mobile Navigation Icons
    const mobHome = document.getElementById('mob-icon-home');
    if (mobHome) mobHome.innerHTML = Icons.get('home', 20, 'currentColor');
    const mobReport = document.getElementById('mob-icon-report');
    if (mobReport) mobReport.innerHTML = Icons.get('report', 20, 'currentColor');
    const mobMap = document.getElementById('mob-icon-map');
    if (mobMap) mobMap.innerHTML = Icons.get('map', 20, 'currentColor');
    const mobInc = document.getElementById('mob-icon-incidents');
    if (mobInc) mobInc.innerHTML = Icons.get('incidents', 20, 'currentColor');
    const mobBulb = document.getElementById('mob-icon-bulb');
    if (mobBulb) mobBulb.innerHTML = Icons.get('bulb', 20, 'currentColor');
  }

  // --- Header & Role Controls ---
  renderHeaderControls() {
    const currentUser = store.getState().currentUser;

    // Role Pills in Top Bar
    document.querySelectorAll('.role-pill').forEach(pill => {
      const targetRole = pill.getAttribute('data-role');
      if (currentUser && currentUser.role === targetRole) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    // Current User Avatar Badge in Topbar (High-Contrast & Large)
    const userBadge = document.getElementById('header-user-badge');
    if (userBadge && currentUser) {
      const roleConfig = {
        ROLE_CITIZEN: { label: 'Vecin@ de Cumbres', color: '#10B981', border: '#6EE7B7' },
        ROLE_EMPLOYEE: { label: 'Operario Municipal', color: '#F59E0B', border: '#FDE68A' },
        ROLE_MUNICIPAL_ADMIN: { label: 'Concejalía / Obras', color: '#FF7A18', border: '#FFD8A8' },
        ROLE_SUPERADMIN: { label: 'SuperAdmin', color: '#8B5CF6', border: '#DDD6FE' }
      };

      const cfg = roleConfig[currentUser.role] || { label: currentUser.role, color: '#FF7A18', border: '#FFAE33' };

      userBadge.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem; background: rgba(30, 18, 11, 0.95); padding: 0.35rem 0.95rem 0.35rem 0.45rem; border-radius: var(--cm-radius-full); border: 1.5px solid ${cfg.border}; box-shadow: 0 4px 16px rgba(0,0,0,0.5), 0 0 12px ${cfg.color}40;">
          <img src="${currentUser.avatar}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 2px solid ${cfg.color};" alt="Avatar" />
          <div style="text-align: left; line-height: 1.2;">
            <div style="font-size: 0.85rem; font-weight: 850; color: #FFFFFF; letter-spacing: -0.01em;">${currentUser.name}</div>
            <div style="font-size: 0.7rem; color: ${cfg.color}; font-weight: 800; text-transform: uppercase;">${cfg.label}</div>
          </div>
        </div>
      `;
    }

    // Toggle Admin Sidebar Nav
    const adminSidebarItem = document.getElementById('sidebar-admin-item');
    if (adminSidebarItem) {
      const canAccessAdmin = AuthService.hasRole('ROLE_EMPLOYEE', 'ROLE_MUNICIPAL_ADMIN', 'ROLE_SUPERADMIN');
      adminSidebarItem.style.display = canAccessAdmin ? 'block' : 'none';
    }
  }

  switchRole(roleName) {
    const user = AuthService.switchPersona(roleName);
    NotificationService.showToast('Perfil de Usuario Activo', `Ahora estás operando como: ${user.name}`, 'success');
  }

  // --- SPA Router & View Management ---
  navigateTo(route) {
    this.currentRoute = route;
    window.location.hash = route;

    // Update active state in sidebar and bottom navigation
    document.querySelectorAll('.sidebar-link, .bottom-nav-item').forEach(link => {
      if (link.getAttribute('data-route') === route) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    this.renderCurrentView();
    const contentArea = document.getElementById('workspace-content-area');
    if (contentArea) contentArea.scrollTo({ top: 0, behavior: 'smooth' });
  }

  renderCurrentView() {
    const mainContainer = document.getElementById('workspace-content-area');
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

  // --- View Renderers (VibeCut Style with Vector Icons) ---
  renderHomeView(container) {
    const incidents = store.getIncidents();
    const activeIncidents = incidents.slice(0, 4);

    container.innerHTML = `
      <!-- Municipal Bando Ticker -->
      <div class="bando-ticker">
        <span class="bando-tag">📢 BANDO OFICIAL</span>
        <span class="bando-text">Actuaciones de repavimentación en Calle La Portá y subida al Castillo de Sancho IV · Suministro de agua en parámetros normales.</span>
        <span style="font-size: 0.75rem; color: #FFAE33; font-family: var(--cm-font-mono); font-weight:700;">Hoy, 09:30</span>
      </div>

      <!-- VibeCut Radiant Hero Banner -->
      <div class="vibecut-hero">
        <div class="vibecut-hero-content">
          <div class="vibecut-hero-badge">
            ${Icons.get('castle', 16, '#FFAE33')}
            <span>Portal Oficial · Sierra de Aracena y Picos de Aroche</span>
          </div>
          <h1 class="vibecut-hero-title">
            Cuidemos juntos de <span class="text-gradient-amber">Cumbres Mayores</span>.
          </h1>
          <p class="vibecut-hero-subtitle">
            Comunica averías en calles, farolas, senderos del Parque Natural y dehesas comunales en 4 sencillos pasos. Consulta en directo las intervenciones de los operarios municipales.
          </p>

          <div class="vibecut-hero-actions">
            <button type="button" class="btn btn-sunset btn-lg" onclick="CivitasApp.navigateTo('report')">
              ${Icons.get('report', 18, '#FFFFFF')}
              <span>+ Nuevo Reporte de Aviso</span>
            </button>
            <button type="button" class="btn btn-secondary btn-lg" onclick="CivitasApp.navigateTo('map')">
              ${Icons.get('map', 18, '#FFFFFF')}
              <span>Explorar Plano en Vivo</span>
            </button>
          </div>
        </div>

        <div class="vibecut-hero-media">
          <div class="hero-preview-thumb">
            <img src="https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=600&auto=format&fit=crop&q=80" alt="Cumbres Mayores" />
            <div class="hero-preview-overlay">
              <div style="font-weight: 850; font-size: 0.825rem; color:#FFFFFF;">Castillo de Sancho IV</div>
              <div style="font-size: 0.725rem; color: var(--vibe-amber-200);">Luminarias LED perimetrales operativas</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Dashboard Columns Layout (2 Cols: Incidents Grid + Activity Reel) -->
      <div class="dashboard-columns">
        <!-- Left Column: Incidents Grid -->
        <div>
          <div class="section-header">
            <h2 class="section-title">Avisos e Incidencias en Curso</h2>
            <span class="section-link" onclick="CivitasApp.navigateTo('incidents')">Ver Todas (${incidents.length}) &rarr;</span>
          </div>

          <div class="incidents-grid">
            ${activeIncidents.map(inc => this.renderIncidentCard(inc)).join('')}
          </div>
        </div>

        <!-- Right Column: Recent Municipal Activity Reel -->
        <div>
          <div class="section-header">
            <h2 class="section-title">Últimas Actuaciones</h2>
            <span class="section-link" onclick="CivitasApp.navigateTo('audit')">Historial</span>
          </div>

          <div class="activity-panel">
            <div class="activity-item" onclick="CivitasApp.openIncidentDetail('inc-cm-101')">
              <img src="https://images.unsplash.com/photo-1584463623578-3012a64703a5?w=150&auto=format&fit=crop&q=80" class="activity-thumb" alt="Calle La Portá" />
              <div class="activity-details">
                <div class="activity-title">Calle La Portá, 18</div>
                <div class="activity-sub"><span class="badge status-en_proceso" style="font-size:0.65rem; padding:0.2rem 0.5rem;">En Proceso</span> · Hace 2 h</div>
              </div>
            </div>

            <div class="activity-item" onclick="CivitasApp.openIncidentDetail('inc-cm-103')">
              <img src="https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=150&auto=format&fit=crop&q=80" class="activity-thumb" alt="Paseo Andalucía" />
              <div class="activity-details">
                <div class="activity-title">Paseo de Andalucía</div>
                <div class="activity-sub"><span class="badge status-resuelta" style="font-size:0.65rem; padding:0.2rem 0.5rem;">Resuelta</span> · Ayer</div>
              </div>
            </div>

            <div class="activity-item" onclick="CivitasApp.openIncidentDetail('inc-cm-102')">
              <img src="https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=150&auto=format&fit=crop&q=80" class="activity-thumb" alt="Castillo Sancho IV" />
              <div class="activity-details">
                <div class="activity-title">Castillo de Sancho IV</div>
                <div class="activity-sub"><span class="badge status-asignada" style="font-size:0.65rem; padding:0.2rem 0.5rem;">Asignada</span> · Hace 2 días</div>
              </div>
            </div>

            <!-- Participatory Banner CTA Card -->
            <div class="card" style="background: linear-gradient(135deg, rgba(255, 122, 24, 0.16) 0%, rgba(38, 22, 14, 0.85) 100%); border-color: rgba(255, 159, 56, 0.35); margin-top: 0.5rem; padding: 1.35rem;">
              <div class="gem-icon-box gem-sm" style="margin-bottom: 0.65rem;">
                ${Icons.get('bulb', 20, '#FFAE33')}
              </div>
              <h4 style="font-size: 1rem; margin-bottom: 0.35rem; color: #FFFFFF; font-weight:800;">Presupuestos Vecinales 2026</h4>
              <p style="font-size: 0.8rem; color: #D4A386; margin-bottom: 0.85rem;">Vota propuestas de mejora para el Castillo y senderos de la Sierra.</p>
              <button class="btn btn-outline btn-sm" style="width: 100%;" onclick="CivitasApp.navigateTo('suggestions')">
                Votar Propuestas Vecinales &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderMapView(container) {
    const categories = store.getState().categories;

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.85rem;">
        <div>
          <h2>Plano Municipal Geoespacial — Cumbres Mayores</h2>
          <p style="font-size: 0.875rem; color:#D4A386;">Avisos georreferenciados en el casco urbano, Castillo de Sancho IV y sendero GR-48.</p>
        </div>
        <div style="display: flex; gap: 0.65rem;">
          <button class="btn btn-secondary btn-sm" id="btn-toggle-heat" onclick="CivitasApp.toggleMapHeatmap()">
            🔥 Alternar Mapa de Calor
          </button>
          <button class="btn btn-sunset btn-sm" onclick="CivitasApp.navigateTo('report')">
            + Reportar en este punto
          </button>
        </div>
      </div>

      <div class="map-view-container">
        <div class="map-wrapper">
          <div id="map"></div>
        </div>

        <div class="map-sidebar">
          <div class="map-sidebar-header">
            <h4 style="font-size: 0.95rem; margin-bottom: 0.5rem; color:#FFFFFF; font-weight:800;">Filtros de Categoría</h4>
            <select id="map-category-filter" class="form-control" onchange="CivitasApp.filterMapIncidents(this.value)" style="padding: 0.45rem 0.85rem; font-size: 0.85rem;">
              <option value="all">Todas las Categorías</option>
              ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
            </select>
          </div>
          <div class="map-sidebar-list" id="map-sidebar-incidents">
            ${store.getIncidents().map(inc => `
              <div class="activity-item" onclick="CivitasApp.openIncidentDetail('${inc.id}')">
                <div style="flex:1;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 0.2rem;">
                    <strong style="color: #FFAE33; font-size:0.775rem; font-family:var(--cm-font-mono);">${inc.trackingCode}</strong>
                    <span class="badge status-${inc.status}" style="font-size: 0.625rem; padding:0.18rem 0.45rem;">${inc.status.replace('_', ' ')}</span>
                  </div>
                  <div style="font-weight: 800; color: #FFFFFF; font-size:0.85rem; margin-bottom: 0.2rem;">${inc.title}</div>
                  <div style="color: #A89082; font-size: 0.725rem;">📍 ${inc.address}</div>
                </div>
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
          <p style="font-size: 0.875rem; color:#D4A386;">Consulta la evolución, aporta fotos adicionales y súmate a avisos activos.</p>
        </div>
        <button class="btn btn-sunset" onclick="CivitasApp.navigateTo('report')">
          + Comunicar Nuevo Aviso
        </button>
      </div>

      <!-- Filter Toolbar -->
      <div class="card" style="margin-bottom: 1.5rem; padding: 1.15rem;">
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <div class="input-icon-wrapper" style="flex: 1; min-width: 220px;">
            <span class="input-icon">🔍</span>
            <input type="text" class="form-control" placeholder="Buscar por calle o avería..." 
                   value="${this.incidentFilters.search}" oninput="CivitasApp.applyIncidentFilter('search', this.value)" />
          </div>

          <select class="form-control" style="width: auto; min-width: 180px;" onchange="CivitasApp.applyIncidentFilter('category', this.value)">
            <option value="all" ${this.incidentFilters.category === 'all' ? 'selected' : ''}>Todas las Categorías</option>
            ${categories.map(c => `<option value="${c.id}" ${this.incidentFilters.category === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
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
      <div class="incidents-grid" style="grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));">
        ${filtered.length === 0 ? `
          <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem;">
            <div class="gem-icon-box gem-lg" style="margin: 0 auto 1rem;">
              ${Icons.get('incidents', 28, '#FFAE33')}
            </div>
            <h3>No se encontraron incidencias con esos filtros</h3>
            <p style="margin-top: 0.25rem; color:#A89082;">Prueba a cambiar la búsqueda o categoría.</p>
          </div>
        ` : filtered.map(inc => this.renderIncidentCard(inc)).join('')}
      </div>
    `;
  }

  renderIncidentCard(inc) {
    const defaultImg = 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=800&auto=format&fit=crop&q=80';
    const cardImg = inc.images && inc.images.length ? inc.images[0] : defaultImg;

    return `
      <div class="incident-card" onclick="CivitasApp.openIncidentDetail('${inc.id}')">
        <img src="${cardImg}" class="incident-card-image" alt="${inc.title}" />
        <div class="incident-meta">
          <span style="font-size: 0.75rem; font-weight: 800; color: #FFAE33; font-family: var(--cm-font-mono);">${inc.trackingCode}</span>
          <span class="badge status-${inc.status}">${inc.status.replace('_', ' ')}</span>
        </div>
        <h4 class="incident-title">${inc.title}</h4>
        <p class="incident-desc">${inc.description}</p>
        <div class="incident-footer">
          <span>📍 ${inc.address}</span>
          <span style="font-weight: 800; color: #FFD8A8;">👥 ${inc.adherentsCount} apoyos</span>
        </div>
      </div>
    `;
  }

  applyIncidentFilter(key, value) {
    this.incidentFilters[key] = value;
    if (this.currentRoute === 'incidents') {
      this.renderIncidentsView(document.getElementById('workspace-content-area'));
    }
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
        <span style="font-family: var(--cm-font-mono); font-weight:850; color:#FFAE33;">${incident.trackingCode}</span>
        <span class="badge status-${incident.status}">${incident.status.replace('_', ' ')}</span>
      </div>
    `;

    modalBody.innerHTML = `
      <h3 style="margin-bottom: 0.5rem; color:#FFFFFF; font-weight:800;">${incident.title}</h3>
      <p style="color: var(--text-secondary); margin-bottom: 1.15rem; font-size:0.925rem;">${incident.description}</p>
      
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.25rem; font-size: 0.85rem; color: #D4A386; background: rgba(18, 10, 6, 0.9); padding: 0.85rem 1rem; border-radius: var(--cm-radius-md); border: 1.5px solid rgba(255, 159, 56, 0.25);">
        <div>📍 <strong>Ubicación:</strong> ${incident.address}</div>
        <div>⚡ <strong>Urgencia:</strong> <span class="badge priority-${incident.urgency}">${incident.urgency}</span></div>
        <div>👥 <strong>Vecinos afectados:</strong> ${incident.adherentsCount}</div>
      </div>

      <!-- Before / After Interactive Slider (if resolved with photos) -->
      ${isResolved && hasResolutionPhoto && hasInitialPhoto ? `
        <div style="margin-bottom: 1.5rem;">
          <h4 style="font-size: 0.95rem; margin-bottom: 0.4rem; color:#FFFFFF; display:flex; align-items:center; justify-content:space-between;">
            <span>📸 Comparativa "Antes y Después"</span>
            <span style="font-size:0.75rem; color:#FFAE33; font-weight:700;">Arrastra para comparar</span>
          </h4>
          <div class="before-after-container" id="before-after-box">
            <img src="${incident.resolutionImages[0]}" class="before-after-img" alt="Después de la reparación" />
            <span class="before-after-tag after-tag">✅ DESPUÉS</span>
            
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
          <h4 style="font-size: 0.9rem; margin-bottom: 0.5rem; color:#FFFFFF;">Fotografías aportadas:</h4>
          <div style="display: flex; gap: 0.6rem; overflow-x: auto;">
            ${incident.images.map(img => `
              <img src="${img}" style="height: 140px; border-radius: var(--cm-radius-md); object-fit: cover; border: 1.5px solid rgba(255, 159, 56, 0.25);" alt="Evidencia" />
            `).join('')}
          </div>
        </div>
      ` : '')}

      ${incident.resolutionNotes ? `
        <div style="background-color: rgba(16, 185, 129, 0.15); border-left: 4px solid var(--vibe-emerald); padding: 1rem 1.25rem; border-radius: 0 var(--cm-radius-md) var(--cm-radius-md) 0; margin-bottom: 1.5rem;">
          <h4 style="color: var(--vibe-emerald); font-size: 0.95rem; margin-bottom: 0.35rem;">✅ Dictamen y Resolución Municipal:</h4>
          <p style="font-size: 0.875rem; color: #FFFFFF;">${incident.resolutionNotes}</p>
        </div>
      ` : ''}

      <!-- Timeline -->
      <h4 style="font-size: 0.95rem; margin-bottom: 0.5rem; color:#FFFFFF;">Evolución y Actuaciones de los Operarios:</h4>
      <div class="timeline">
        ${(incident.history || []).map((h, idx) => `
          <div class="timeline-item ${idx === incident.history.length - 1 ? 'active' : 'completed'}">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                <span class="badge status-${h.status}" style="font-size: 0.7rem;">${h.status.replace('_', ' ')}</span>
                <span class="timeline-date">${Helpers.formatDate(h.timestamp)}</span>
              </div>
              <p style="font-size: 0.85rem; color: #FFFFFF;">${h.comment}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // --- Admin/Employee Status Change Controls ---
    const user = store.getState().currentUser;
    const canChangeStatus = user && [
      'ROLE_EMPLOYEE', 'ROLE_MUNICIPAL_ADMIN', 'ROLE_SUPERADMIN'
    ].includes(user.role);

    const statusOptions = [
      { value: 'recibida',    label: '📩 Recibida',    color: '#6B7280' },
      { value: 'validando',   label: '🔎 Validando',   color: '#F59E0B' },
      { value: 'asignada',    label: '📋 Asignada',    color: '#3B82F6' },
      { value: 'en_proceso',  label: '🔧 En Proceso',  color: '#8B5CF6' },
      { value: 'resuelta',    label: '✅ Resuelta',    color: '#10B981' },
      { value: 'cerrada',     label: '🔒 Cerrada',     color: '#EF4444' }
    ];

    const adminPanel = canChangeStatus ? `
      <div style="width: 100%; border-top: 1px solid rgba(255,174,51,0.18); padding-top: 1rem; margin-top: 0.5rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.65rem;">
          <span style="font-size: 0.8rem; font-weight: 700; color: #FFAE33; text-transform: uppercase; letter-spacing: 0.05em;">⚙️ Gestión Municipal</span>
          <span style="font-size: 0.7rem; color: #A89082; font-style: italic;">(${user.role.replace('ROLE_', '').replace('_', ' ')})</span>
        </div>
        <div style="display: flex; gap: 0.6rem; flex-wrap: wrap; align-items: flex-end;">
          <div style="flex: 0 0 auto; min-width: 170px;">
            <label style="font-size: 0.72rem; color: #D4A386; display: block; margin-bottom: 0.25rem; font-weight: 600;">Nuevo Estado</label>
            <select id="admin-status-select" class="form-control" style="padding: 0.5rem 0.75rem; font-size: 0.85rem; background: rgba(18,10,6,0.95); border: 1.5px solid rgba(255,174,51,0.3);">
              ${statusOptions.map(s => 
                '<option value="' + s.value + '"' + (s.value === incident.status ? ' selected' : '') + '>' + s.label + '</option>'
              ).join('')}
            </select>
          </div>
          <div style="flex: 1; min-width: 200px;">
            <label style="font-size: 0.72rem; color: #D4A386; display: block; margin-bottom: 0.25rem; font-weight: 600;">Comentario (opcional)</label>
            <input id="admin-status-comment" type="text" class="form-control" placeholder="Ej: Equipo de fontanería desplazado..." 
                   style="padding: 0.5rem 0.75rem; font-size: 0.85rem; background: rgba(18,10,6,0.95); border: 1.5px solid rgba(255,174,51,0.3);" />
          </div>
          <button class="btn btn-sunset" onclick="CivitasApp.changeIncidentStatus('${incident.id}')" 
                  style="white-space: nowrap; padding: 0.55rem 1.25rem; font-size: 0.85rem;">
            💾 Actualizar Estado
          </button>
        </div>
      </div>
    ` : '';

    modalFooter.innerHTML = `
      <div style="display: flex; flex-wrap: wrap; gap: 0.6rem; align-items: center; width: 100%;">
        <button class="btn btn-secondary" onclick="CivitasApp.closeModal()">Cerrar</button>
        <button class="btn btn-sunset" onclick="CivitasApp.supportIncidentFromModal('${incident.id}')">
          👍 A mí también me afecta (${incident.adherentsCount})
        </button>
      </div>
      ${adminPanel}
    `;

    modalBackdrop.classList.add('active');
  }

  supportIncidentFromModal(incidentId) {
    IncidentService.addAdherent(incidentId);
    this.openIncidentDetail(incidentId);
    this.renderCurrentView();
  }

  /**
   * Changes incident status (Admin / Operario / Concejalía action)
   */
  changeIncidentStatus(incidentId) {
    const selectEl = document.getElementById('admin-status-select');
    const commentEl = document.getElementById('admin-status-comment');
    if (!selectEl) return;

    const newStatus = selectEl.value;
    const comment = commentEl ? commentEl.value.trim() : '';

    const incident = store.getState().incidents.find(i => i.id === incidentId);
    if (!incident) return;

    // Don't update if same status and no comment
    if (incident.status === newStatus && !comment) {
      NotificationService.sendNotification(
        'Sin Cambios',
        'Selecciona un estado diferente o añade un comentario para actualizar.'
      );
      return;
    }

    IncidentService.updateStatus(incidentId, newStatus, comment);

    // Re-render modal with updated data and refresh underlying view
    this.openIncidentDetail(incidentId);
    this.renderCurrentView();

    NotificationService.sendNotification(
      '✅ Estado Actualizado',
      `La incidencia ${incident.trackingCode} ha sido actualizada a: ${newStatus.replace('_', ' ').toUpperCase()}.`
    );
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
        .then(reg => console.log('✅ ServiceWorker VibeCut registrado', reg.scope))
        .catch(err => console.warn('Aviso ServiceWorker', err));
    }
  }
}

export const CivitasApp = new CivitasAppController();
window.CivitasApp = CivitasApp;

document.addEventListener('DOMContentLoaded', () => {
  CivitasApp.init();
});
