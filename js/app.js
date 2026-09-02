/**
 * AYUNTAMIENTO DE CUMBRES MAYORES — Master Controller
 * VibeCut Luxury Sunset & Deep Espresso Dashboard Architecture
 * Auth Gate · Logout · ES/EN Live Translation · Perfiles Reales
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
import { AuthScreen } from './components/authScreen.js';

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
      search: '',
      owner: 'all'  // 'all' | 'mine'
    };
    this._storeUnsubscribe = null; // Track subscription to avoid leaks
  }

  init() {
    console.log('🏰 Inicializando Dashboard Cumbres Mayores (Huelva)...');

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

    // 5. Auth Gate — decide whether to show auth screen or the app
    this._checkAuthGate();

    // 6. Auth screen callback
    AuthScreen.onLoginSuccess = (user) => {
      this._enterApp();
    };

    // 7. Accessibility Listeners (ESC to close modal, etc.)
    this.setupAccessibilityListeners();

    // 8. Hash change listener
    window.addEventListener('hashchange', () => {
      const route = window.location.hash.replace('#', '') || 'home';
      if (store.getState().currentUser) {
        this.navigateTo(route);
      }
    });
  }

  /**
   * Auth Gate: show auth screen if no user, else enter app directly
   */
  _checkAuthGate() {
    const user = store.getState().currentUser;
    if (!user) {
      this._showAuthScreen();
    } else {
      this._enterApp();
    }
  }

  _showAuthScreen() {
    const authContainer = document.getElementById('auth-screen-container');
    const appShell = document.querySelector('.app-shell');
    const bottomNav = document.querySelector('.bottom-nav');

    if (authContainer) {
      authContainer.style.display = 'flex';
      AuthScreen.render(authContainer);
    }
    if (appShell) appShell.style.display = 'none';
    if (bottomNav) bottomNav.style.display = 'none';
  }

  _enterApp() {
    const authContainer = document.getElementById('auth-screen-container');
    const appShell = document.querySelector('.app-shell');
    const bottomNav = document.querySelector('.bottom-nav');

    if (authContainer) authContainer.style.display = 'none';
    if (appShell) {
      appShell.style.display = 'flex';
      appShell.style.animation = 'appShellIn 0.4s cubic-bezier(0.16,1,0.3,1) both';
    }
    if (bottomNav) bottomNav.style.display = 'flex';

    // Re-render header with user info
    this.renderHeaderControls();

    // Reactive subscription — unsubscribe any previous one first to avoid leaks
    if (this._storeUnsubscribe) {
      this._storeUnsubscribe();
      this._storeUnsubscribe = null;
    }
    this._storeUnsubscribe = store.subscribe(() => {
      this.renderHeaderControls();
      this.renderCurrentView();
    });

    // Navigate to initial route
    const initialRoute = window.location.hash.replace('#', '') || 'home';
    this.navigateTo(initialRoute);

    // Show demo banner if needed
    this._updateDemoBanner();
  }

  _updateDemoBanner() {
    const user = store.getState().currentUser;
    const banner = document.getElementById('demo-mode-banner');
    if (banner) {
      if (user && user.isDemo) {
        banner.style.display = 'flex';
        banner.innerHTML = `<span data-i18n="demo_banner">${I18n.t('demo_banner')}</span>`;
      } else {
        banner.style.display = 'none';
      }
    }
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

  // --- Language Switcher ---
  switchLanguage(lang) {
    I18n.setLocale(lang);
    // Re-render auth screen if visible
    const authContainer = document.getElementById('auth-screen-container');
    if (authContainer && authContainer.style.display !== 'none') {
      AuthScreen.render(authContainer);
    }
    // Re-render current app view
    const user = store.getState().currentUser;
    if (user) {
      this.renderHeaderControls();
      this.renderCurrentView();
      this._updateDemoBanner();
    }
    // Update lang switcher buttons in topbar
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
  }

  // --- Header Controls (Topbar + Sidebar) ---
  renderHeaderControls() {
    const currentUser = store.getState().currentUser;
    if (!currentUser) return;

    const cfg = AuthService.getRoleConfig(currentUser.role);
    const locale = I18n.currentLocale;
    const roleLabel = locale === 'en' ? cfg.labelEn : cfg.label;

    // Current User Avatar Badge in Topbar
    const userBadge = document.getElementById('header-user-badge');
    if (userBadge) {
      userBadge.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem; background: rgba(30, 18, 11, 0.95); padding: 0.35rem 0.95rem 0.35rem 0.45rem; border-radius: var(--cm-radius-full); border: 1.5px solid ${cfg.border}; box-shadow: 0 4px 16px rgba(0,0,0,0.5), 0 0 12px ${cfg.color}40;">
          <img src="${currentUser.avatar}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 2px solid ${cfg.color};" alt="Avatar" />
          <div style="text-align: left; line-height: 1.2;">
            <div style="font-size: 0.85rem; font-weight: 850; color: #FFFFFF; letter-spacing: -0.01em;">${currentUser.name}</div>
            <div style="font-size: 0.7rem; color: ${cfg.color}; font-weight: 800; text-transform: uppercase;">${roleLabel}</div>
          </div>
        </div>
      `;
    }

    // Lang Switcher in Topbar
    const langSwitcher = document.getElementById('topbar-lang-switcher');
    if (langSwitcher) {
      langSwitcher.innerHTML = `
        <button type="button" class="lang-btn ${locale === 'es' ? 'active' : ''}" data-lang="es" onclick="CivitasApp.switchLanguage('es')" title="Español">🇪🇸 ES</button>
        <button type="button" class="lang-btn ${locale === 'en' ? 'active' : ''}" data-lang="en" onclick="CivitasApp.switchLanguage('en')" title="English">🇬🇧 EN</button>
      `;
    }

    // Logout button
    const logoutBtn = document.getElementById('topbar-logout-btn');
    if (logoutBtn) {
      logoutBtn.innerHTML = `
        <button type="button" class="btn-logout" onclick="CivitasApp.confirmLogout()" data-i18n-title="btn_logout" title="${I18n.t('btn_logout')}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span data-i18n="btn_logout">${I18n.t('btn_logout')}</span>
        </button>
      `;
    }

    // Toggle Admin Sidebar Nav
    const adminSidebarItem = document.getElementById('sidebar-admin-item');
    if (adminSidebarItem) {
      adminSidebarItem.style.display = AuthService.canAccessAdmin() ? 'block' : 'none';
    }

    // i18n: apply to sidebar texts
    I18n.applyTranslations();
  }

  // --- Logout ---
  confirmLogout() {
    const backdrop = document.getElementById('app-modal-backdrop');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalFooter = document.getElementById('modal-footer');

    if (!backdrop || !modalTitle || !modalBody || !modalFooter) return;

    modalTitle.textContent = I18n.t('logout_confirm_title');
    modalBody.innerHTML = `<p style="font-size:1rem; color:#E5D2C7; margin: 0.5rem 0;">${I18n.t('logout_confirm_msg')}</p>`;
    modalFooter.innerHTML = `
      <div style="display:flex; gap:0.75rem; justify-content:flex-end; width:100%;">
        <button class="btn btn-secondary" onclick="CivitasApp.closeModal()">
          ${I18n.t('btn_logout_no')}
        </button>
        <button class="btn btn-sunset" onclick="CivitasApp.logout()">
          ${I18n.t('btn_logout_yes')}
        </button>
      </div>
    `;
    backdrop.classList.add('active');
  }

  logout() {
    this.closeModal();
    // Unsubscribe store listener before logging out
    if (this._storeUnsubscribe) {
      this._storeUnsubscribe();
      this._storeUnsubscribe = null;
    }
    AuthService.logout();
    // Reset state
    this.currentRoute = 'home';
    this.incidentFilters = { category: 'all', status: 'all', search: '', owner: 'all' };
    window.location.hash = '';;
    // Show auth screen
    this._showAuthScreen();
  }

  // --- SPA Router & View Management ---
  navigateTo(route) {
    const user = store.getState().currentUser;
    if (!user) return;

    // Redirect demo from report
    if (route === 'report' && user.isDemo) {
      NotificationService.showToast(
        '👁️ Modo Demo',
        I18n.t('restrict_demo_report'),
        'warning'
      );
      return;
    }

    // Restrict admin access
    if (route === 'admin' && !AuthService.canAccessAdmin()) {
      NotificationService.showToast('🔒 Acceso Restringido', I18n.t('restrict_citizen_status'), 'warning');
      return;
    }

    // Reset incident filters when navigating to incidents so new incidents are always visible
    if (route === 'incidents') {
      this.incidentFilters = { category: 'all', status: 'all', search: '', owner: 'all' };
    }

    this.currentRoute = route;
    window.location.hash = route;

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
        if (AuthService.canAccessAdmin()) {
          mainContainer.innerHTML = `<div id="admin-dashboard-container"></div>`;
          this.admin.init('admin-dashboard-container');
        } else {
          this.renderHomeView(mainContainer);
        }
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
    const activeIncidents = incidents.slice(0, 4);
    const t = (k) => I18n.t(k);

    container.innerHTML = `
      <!-- Municipal Bando Ticker -->
      <div class="bando-ticker">
        <span class="bando-tag" data-i18n="home_bando_tag">${t('home_bando_tag')}</span>
        <span class="bando-text" data-i18n="home_bando_text">${t('home_bando_text')}</span>
        <span style="font-size: 0.75rem; color: #FFAE33; font-family: var(--cm-font-mono); font-weight:700;">09:30</span>
      </div>

      <!-- VibeCut Radiant Hero Banner -->
      <div class="vibecut-hero">
        <div class="vibecut-hero-content">
          <div class="vibecut-hero-badge">
            ${Icons.get('castle', 16, '#FFAE33')}
            <span data-i18n="home_hero_badge">${t('home_hero_badge')}</span>
          </div>
          <h1 class="vibecut-hero-title">
            <span data-i18n="home_hero_title_1">${t('home_hero_title_1')}</span> <span class="text-gradient-amber" data-i18n="home_hero_title_2">${t('home_hero_title_2')}</span>.
          </h1>
          <p class="vibecut-hero-subtitle" data-i18n="home_hero_subtitle">
            ${t('home_hero_subtitle')}
          </p>

          <div class="vibecut-hero-actions">
            <button type="button" class="btn btn-sunset btn-lg" onclick="CivitasApp.navigateTo('report')">
              ${Icons.get('report', 18, '#FFFFFF')}
              <span data-i18n="home_hero_btn_report">${t('home_hero_btn_report')}</span>
            </button>
            <button type="button" class="btn btn-secondary btn-lg" onclick="CivitasApp.navigateTo('map')">
              ${Icons.get('map', 18, '#FFFFFF')}
              <span data-i18n="home_hero_btn_map">${t('home_hero_btn_map')}</span>
            </button>
          </div>
        </div>

        <div class="vibecut-hero-media">
          <div class="hero-preview-thumb">
            <img src="https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=600&auto=format&fit=crop&q=80" alt="${t('home_hero_img_alt')}" />
            <div class="hero-preview-overlay">
              <div style="font-weight: 850; font-size: 0.825rem; color:#FFFFFF;" data-i18n="home_hero_castle">${t('home_hero_castle')}</div>
              <div style="font-size: 0.725rem; color: var(--vibe-amber-200);" data-i18n="home_hero_castle_sub">${t('home_hero_castle_sub')}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Dashboard Columns Layout -->
      <div class="dashboard-columns">
        <!-- Left Column: Incidents Grid -->
        <div>
          <div class="section-header">
            <h2 class="section-title" data-i18n="home_incidents_title">${t('home_incidents_title')}</h2>
            <span class="section-link" onclick="CivitasApp.navigateTo('incidents')">
              <span data-i18n="home_incidents_link">${t('home_incidents_link')}</span> (${incidents.length}) &rarr;
            </span>
          </div>

          <div class="incidents-grid">
            ${activeIncidents.map(inc => this.renderIncidentCard(inc)).join('')}
          </div>
        </div>

        <!-- Right Column: Recent Municipal Activity -->
        <div>
          <div class="section-header">
            <h2 class="section-title" data-i18n="home_activity_title">${t('home_activity_title')}</h2>
            <span class="section-link" onclick="CivitasApp.navigateTo('audit')" data-i18n="home_activity_link">${t('home_activity_link')}</span>
          </div>

          <div class="activity-panel">
            <div class="activity-item" onclick="CivitasApp.openIncidentDetail('inc-cm-101')">
              <img src="https://images.unsplash.com/photo-1584463623578-3012a64703a5?w=150&auto=format&fit=crop&q=80" class="activity-thumb" alt="${t('activity_calle_porta')}" />
              <div class="activity-details">
                <div class="activity-title" data-i18n="activity_calle_porta">${t('activity_calle_porta')}</div>
                <div class="activity-sub"><span class="badge status-en_proceso" style="font-size:0.65rem; padding:0.2rem 0.5rem;" data-i18n="status_en_proceso">${t('status_en_proceso')}</span> · <span data-i18n="activity_hace2h">${t('activity_hace2h')}</span></div>
              </div>
            </div>

            <div class="activity-item" onclick="CivitasApp.openIncidentDetail('inc-cm-103')">
              <img src="https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=150&auto=format&fit=crop&q=80" class="activity-thumb" alt="${t('activity_paseo')}" />
              <div class="activity-details">
                <div class="activity-title" data-i18n="activity_paseo">${t('activity_paseo')}</div>
                <div class="activity-sub"><span class="badge status-resuelta" style="font-size:0.65rem; padding:0.2rem 0.5rem;" data-i18n="status_resuelta">${t('status_resuelta')}</span> · <span data-i18n="activity_ayer">${t('activity_ayer')}</span></div>
              </div>
            </div>

            <div class="activity-item" onclick="CivitasApp.openIncidentDetail('inc-cm-102')">
              <img src="https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=150&auto=format&fit=crop&q=80" class="activity-thumb" alt="${t('activity_castillo')}" />
              <div class="activity-details">
                <div class="activity-title" data-i18n="activity_castillo">${t('activity_castillo')}</div>
                <div class="activity-sub"><span class="badge status-asignada" style="font-size:0.65rem; padding:0.2rem 0.5rem;" data-i18n="status_asignada">${t('status_asignada')}</span> · <span data-i18n="activity_hace2d">${t('activity_hace2d')}</span></div>
              </div>
            </div>

            <!-- Participatory Banner CTA Card -->
            <div class="card" style="background: linear-gradient(135deg, rgba(255, 122, 24, 0.16) 0%, rgba(38, 22, 14, 0.85) 100%); border-color: rgba(255, 159, 56, 0.35); margin-top: 0.5rem; padding: 1.35rem;">
              <div class="gem-icon-box gem-sm" style="margin-bottom: 0.65rem;">
                ${Icons.get('bulb', 20, '#FFAE33')}
              </div>
              <h4 style="font-size: 1rem; margin-bottom: 0.35rem; color: #FFFFFF; font-weight:800;" data-i18n="home_budget_title">${t('home_budget_title')}</h4>
              <p style="font-size: 0.8rem; color: #D4A386; margin-bottom: 0.85rem;" data-i18n="home_budget_sub">${t('home_budget_sub')}</p>
              <button class="btn btn-outline btn-sm" style="width: 100%;" onclick="CivitasApp.navigateTo('suggestions')" data-i18n="home_budget_btn">
                ${t('home_budget_btn')}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderMapView(container) {
    const categories = store.getState().categories;
    const t = (k) => I18n.t(k);

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.85rem;">
        <div>
          <h2 data-i18n="map_title">${t('map_title')}</h2>
          <p style="font-size: 0.875rem; color:#D4A386;" data-i18n="map_subtitle">${t('map_subtitle')}</p>
        </div>
        <div style="display: flex; gap: 0.65rem;">
          <button class="btn btn-secondary btn-sm" id="btn-toggle-heat" onclick="CivitasApp.toggleMapHeatmap()" data-i18n="map_btn_heat">
            ${t('map_btn_heat')}
          </button>
          <button class="btn btn-sunset btn-sm" onclick="CivitasApp.navigateTo('report')" data-i18n="map_btn_report">
            ${t('map_btn_report')}
          </button>
        </div>
      </div>

      <div class="map-view-container">
        <div class="map-wrapper">
          <div id="map"></div>
        </div>

        <div class="map-sidebar">
          <div class="map-sidebar-header">
            <h4 style="font-size: 0.95rem; margin-bottom: 0.5rem; color:#FFFFFF; font-weight:800;" data-i18n="map_filter_title">${t('map_filter_title')}</h4>
            <select id="map-category-filter" class="form-control" onchange="CivitasApp.filterMapIncidents(this.value)" style="padding: 0.45rem 0.85rem; font-size: 0.85rem;">
              <option value="all" data-i18n="map_filter_all">${t('map_filter_all')}</option>
              ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
            </select>
          </div>
          <div class="map-sidebar-list" id="map-sidebar-incidents">
            ${store.getIncidents().map(inc => `
              <div class="activity-item" onclick="CivitasApp.openIncidentDetail('${inc.id}')">
                <div style="flex:1;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 0.2rem;">
                    <strong style="color: #FFAE33; font-size:0.775rem; font-family:var(--cm-font-mono);">${inc.trackingCode}</strong>
                    <span class="badge status-${inc.status}" style="font-size: 0.625rem; padding:0.18rem 0.45rem;">${this._statusLabel(inc.status)}</span>
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
      btn.textContent = mode === 'heatmap' ? I18n.t('map_btn_markers') : I18n.t('map_btn_heat');
    }
  }

  renderIncidentsView(container) {
    const categories = store.getState().categories;
    const allIncidents = store.getIncidents();
    const currentUser = store.getState().currentUser;
    const t = (k) => I18n.t(k);

    // 'mine' filter: show only current user's incidents
    const showMine = this.incidentFilters.owner === 'mine';
    let incidents = allIncidents;

    if (showMine && currentUser) {
      incidents = allIncidents.filter(inc =>
        inc.citizenId === currentUser.id ||
        (inc.adherentUserIds && inc.adherentUserIds.includes(currentUser.id))
      );
    }

    const filtered = incidents.filter(inc => {
      const matchCat = this.incidentFilters.category === 'all' || inc.category === this.incidentFilters.category;
      const matchStatus = this.incidentFilters.status === 'all' || inc.status === this.incidentFilters.status;
      const matchSearch = !this.incidentFilters.search ||
        inc.title.toLowerCase().includes(this.incidentFilters.search.toLowerCase()) ||
        inc.trackingCode.toLowerCase().includes(this.incidentFilters.search.toLowerCase()) ||
        inc.address.toLowerCase().includes(this.incidentFilters.search.toLowerCase());
      return matchCat && matchStatus && matchSearch;
    });

    const canReport = AuthService.canCreateIncident();
    const myCount = currentUser ? allIncidents.filter(i => i.citizenId === currentUser.id).length : 0;

    container.innerHTML = `
      <div class="feed-header-bar">
        <div>
          <h2 data-i18n="incidents_title">${t('incidents_title')}</h2>
          <p style="font-size: 0.875rem; color:#D4A386;" data-i18n="incidents_subtitle">${t('incidents_subtitle')}</p>
        </div>
        ${canReport ? `
        <button class="btn btn-sunset" onclick="CivitasApp.navigateTo('report')" data-i18n="incidents_btn_new">
          ${t('incidents_btn_new')}
        </button>
        ` : ''}
      </div>

      <!-- Mis Incidencias / Todas — Toggle tabs -->
      <div style="display: flex; gap: 0.5rem; margin-bottom: 1.25rem; flex-wrap: wrap; align-items: center;">
        <button type="button" class="incidents-tab ${!showMine ? 'active' : ''}" onclick="CivitasApp.setIncidentOwnerFilter('all')">
          🌍 ${I18n.currentLocale === 'en' ? 'All Incidents' : 'Todas las Incidencias'}
          <span style="font-size:0.7rem; background:rgba(255,159,56,0.15); padding:0.1rem 0.4rem; border-radius:999px; margin-left:0.3rem;">${allIncidents.length}</span>
        </button>
        ${currentUser && !currentUser.isDemo ? `
        <button type="button" class="incidents-tab ${showMine ? 'active' : ''}" onclick="CivitasApp.setIncidentOwnerFilter('mine')">
          👤 ${I18n.currentLocale === 'en' ? 'My Incidents' : 'Mis Incidencias'}
          ${myCount > 0 ? `<span style="font-size:0.7rem; background:rgba(16,185,129,0.2); color:#6EE7B7; padding:0.1rem 0.4rem; border-radius:999px; margin-left:0.3rem;">${myCount}</span>` : ''}
        </button>
        ` : ''}
      </div>

      <!-- Filter Toolbar -->
      <div class="card" style="margin-bottom: 1.5rem; padding: 1.15rem;">
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <div class="input-icon-wrapper" style="flex: 1; min-width: 220px;">
            <span class="input-icon">🔍</span>
            <input type="text" class="form-control" data-i18n-placeholder="incidents_filter_search_ph"
                   placeholder="${t('incidents_filter_search_ph')}"
                   value="${this.incidentFilters.search}" oninput="CivitasApp.applyIncidentFilter('search', this.value)" />
          </div>

          <select class="form-control" style="width: auto; min-width: 180px;" onchange="CivitasApp.applyIncidentFilter('category', this.value)">
            <option value="all" ${this.incidentFilters.category === 'all' ? 'selected' : ''} data-i18n="incidents_filter_all_cats">${t('incidents_filter_all_cats')}</option>
            ${categories.map(c => `<option value="${c.id}" ${this.incidentFilters.category === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
          </select>

          <select class="form-control" style="width: auto; min-width: 160px;" onchange="CivitasApp.applyIncidentFilter('status', this.value)">
            <option value="all" ${this.incidentFilters.status === 'all' ? 'selected' : ''} data-i18n="incidents_filter_all_status">${t('incidents_filter_all_status')}</option>
            <option value="recibida" ${this.incidentFilters.status === 'recibida' ? 'selected' : ''} data-i18n="status_opt_recibida">${t('status_opt_recibida')}</option>
            <option value="validando" ${this.incidentFilters.status === 'validando' ? 'selected' : ''} data-i18n="status_opt_validando">${t('status_opt_validando')}</option>
            <option value="asignada" ${this.incidentFilters.status === 'asignada' ? 'selected' : ''} data-i18n="status_opt_asignada">${t('status_opt_asignada')}</option>
            <option value="en_proceso" ${this.incidentFilters.status === 'en_proceso' ? 'selected' : ''} data-i18n="status_opt_en_proceso">${t('status_opt_en_proceso')}</option>
            <option value="resuelta" ${this.incidentFilters.status === 'resuelta' ? 'selected' : ''} data-i18n="status_opt_resuelta">${t('status_opt_resuelta')}</option>
            <option value="cerrada" ${this.incidentFilters.status === 'cerrada' ? 'selected' : ''} data-i18n="status_opt_cerrada">${t('status_opt_cerrada')}</option>
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
            <h3 data-i18n="incidents_empty_title">${showMine ? (I18n.currentLocale === 'en' ? 'You have not reported any incidents yet' : 'Aún no has comunicado ninguna incidencia') : t('incidents_empty_title')}</h3>
            <p style="margin-top: 0.25rem; color:#A89082;">${showMine ? (I18n.currentLocale === 'en' ? 'Use the "Report Issue" button to report your first incident.' : 'Usa el botón "Reportar Aviso" para comunicar tu primera incidencia.') : t('incidents_empty_sub')}</p>
            ${showMine && canReport ? `<button class="btn btn-sunset" style="margin-top:1rem;" onclick="CivitasApp.navigateTo('report')">+ ${I18n.currentLocale === 'en' ? 'Report Incident' : 'Comunicar Aviso'}</button>` : ''}
          </div>
        ` : filtered.map(inc => this.renderIncidentCard(inc, currentUser)).join('')}
      </div>
    `;
  }

  setIncidentOwnerFilter(owner) {
    this.incidentFilters.owner = owner;
    if (this.currentRoute === 'incidents') {
      this.renderIncidentsView(document.getElementById('workspace-content-area'));
    }
  }

  applyIncidentFilter(key, value) {
    this.incidentFilters[key] = value;
    if (this.currentRoute === 'incidents') {
      this.renderIncidentsView(document.getElementById('workspace-content-area'));
    }
  }


  _statusLabel(status) {
    const map = {
      recibida: 'status_recibida', validando: 'status_validando',
      asignada: 'status_asignada', en_proceso: 'status_en_proceso',
      resuelta: 'status_resuelta', cerrada: 'status_cerrada'
    };
    return I18n.t(map[status] || status);
  }

  renderIncidentCard(inc, currentUser) {
    const defaultImg = 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=800&auto=format&fit=crop&q=80';
    const cardImg = inc.images && inc.images.length ? inc.images[0] : defaultImg;
    const t = (k) => I18n.t(k);
    const isOwn = currentUser && inc.citizenId === currentUser.id;

    return `
      <div class="incident-card ${isOwn ? 'incident-card-own' : ''}" onclick="CivitasApp.openIncidentDetail('${inc.id}')">
        ${isOwn ? `<div class="incident-own-badge">👤 ${I18n.currentLocale === 'en' ? 'My Report' : 'Mi Aviso'}</div>` : ''}
        <img src="${cardImg}" class="incident-card-image" alt="${inc.title}" />
        <div class="incident-meta">
          <span style="font-size: 0.75rem; font-weight: 800; color: #FFAE33; font-family: var(--cm-font-mono);">${inc.trackingCode}</span>
          <span class="badge status-${inc.status}">${this._statusLabel(inc.status)}</span>
        </div>
        <h4 class="incident-title">${inc.title}</h4>
        <p class="incident-desc">${inc.description}</p>
        <div class="incident-footer">
          <span>📍 ${inc.address}</span>
          <span style="font-weight: 800; color: #FFD8A8;">👥 ${inc.adherentsCount} ${t('incidents_supports')}</span>
        </div>
      </div>
    `;
  }

  // --- Modal Detail Views ---
  openIncidentDetail(incidentId) {
    const incident = store.getState().incidents.find(i => i.id === incidentId);
    if (!incident) return;

    const modalBackdrop = document.getElementById('app-modal-backdrop');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalFooter = document.getElementById('modal-footer');
    const t = (k) => I18n.t(k);

    const isResolved = incident.status === 'resuelta' || incident.status === 'cerrada';
    const hasResolutionPhoto = incident.resolutionImages && incident.resolutionImages.length > 0;
    const hasInitialPhoto = incident.images && incident.images.length > 0;

    modalTitle.innerHTML = `
      <div style="display:flex; align-items:center; gap:0.6rem;">
        <span style="font-family: var(--cm-font-mono); font-weight:850; color:#FFAE33;">${incident.trackingCode}</span>
        <span class="badge status-${incident.status}">${this._statusLabel(incident.status)}</span>
      </div>
    `;

    modalBody.innerHTML = `
      <h3 style="margin-bottom: 0.5rem; color:#FFFFFF; font-weight:800;">${incident.title}</h3>
      <p style="color: var(--text-secondary); margin-bottom: 1.15rem; font-size:0.925rem;">${incident.description}</p>
      
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.25rem; font-size: 0.85rem; color: #D4A386; background: rgba(18, 10, 6, 0.9); padding: 0.85rem 1rem; border-radius: var(--cm-radius-md); border: 1.5px solid rgba(255, 159, 56, 0.25);">
        <div>📍 <strong data-i18n="modal_location">${t('modal_location')}:</strong> ${incident.address}</div>
        <div>⚡ <strong data-i18n="modal_urgency">${t('modal_urgency')}:</strong> <span class="badge priority-${incident.urgency}">${t('priority_' + incident.urgency) || incident.urgency}</span></div>
        <div>👥 <strong data-i18n="modal_neighbors">${t('modal_neighbors')}:</strong> ${incident.adherentsCount}</div>
      </div>

      <!-- Before / After Interactive Slider -->
      ${isResolved && hasResolutionPhoto && hasInitialPhoto ? `
        <div style="margin-bottom: 1.5rem;">
          <h4 style="font-size: 0.95rem; margin-bottom: 0.4rem; color:#FFFFFF; display:flex; align-items:center; justify-content:space-between;">
            <span data-i18n="modal_before_after">${t('modal_before_after')}</span>
            <span style="font-size:0.75rem; color:#FFAE33; font-weight:700;" data-i18n="modal_drag_compare">${t('modal_drag_compare')}</span>
          </h4>
          <div class="before-after-container" id="before-after-box">
            <img src="${incident.resolutionImages[0]}" class="before-after-img" alt="${t('modal_after_tag')}" />
            <span class="before-after-tag after-tag" data-i18n="modal_after_tag">${t('modal_after_tag')}</span>
            
            <div class="before-after-overlay" id="before-after-overlay" style="width: 50%;">
              <img src="${incident.images[0]}" style="width: 600px; max-width: none; height: 100%; object-fit: cover;" alt="${t('modal_before_tag')}" />
              <span class="before-after-tag before-tag" data-i18n="modal_before_tag">${t('modal_before_tag')}</span>
            </div>

            <input type="range" min="0" max="100" value="50" class="before-after-slider-input" 
                   oninput="document.getElementById('before-after-overlay').style.width = this.value + '%'" />
          </div>
        </div>
      ` : (hasInitialPhoto ? `
        <div style="margin-bottom: 1.5rem;">
          <h4 style="font-size: 0.9rem; margin-bottom: 0.5rem; color:#FFFFFF;" data-i18n="modal_photos_title">${t('modal_photos_title')}</h4>
          <div style="display: flex; gap: 0.6rem; overflow-x: auto;">
            ${incident.images.map(img => `
              <img src="${img}" style="height: 140px; border-radius: var(--cm-radius-md); object-fit: cover; border: 1.5px solid rgba(255, 159, 56, 0.25);" alt="Evidencia" />
            `).join('')}
          </div>
        </div>
      ` : '')}

      ${incident.resolutionNotes ? `
        <div style="background-color: rgba(16, 185, 129, 0.15); border-left: 4px solid var(--vibe-emerald); padding: 1rem 1.25rem; border-radius: 0 var(--cm-radius-md) var(--cm-radius-md) 0; margin-bottom: 1.5rem;">
          <h4 style="color: var(--vibe-emerald); font-size: 0.95rem; margin-bottom: 0.35rem;" data-i18n="modal_resolution_title">${t('modal_resolution_title')}</h4>
          <p style="font-size: 0.875rem; color: #FFFFFF;">${incident.resolutionNotes}</p>
        </div>
      ` : ''}

      <!-- Timeline -->
      <h4 style="font-size: 0.95rem; margin-bottom: 0.5rem; color:#FFFFFF;" data-i18n="modal_timeline_title">${t('modal_timeline_title')}</h4>
      <div class="timeline">
        ${(incident.history || []).map((h, idx) => `
          <div class="timeline-item ${idx === incident.history.length - 1 ? 'active' : 'completed'}">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                <span class="badge status-${h.status}" style="font-size: 0.7rem;">${this._statusLabel(h.status)}</span>
                <span class="timeline-date">${Helpers.formatDate(h.timestamp)}</span>
              </div>
              <p style="font-size: 0.85rem; color: #FFFFFF;">${h.comment}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // --- Status Change Controls (Operario/Admin only) ---
    const canChangeStatus = AuthService.canChangeStatus();
    const statusOptions = [
      { value: 'recibida',   key: 'status_opt_recibida' },
      { value: 'validando',  key: 'status_opt_validando' },
      { value: 'asignada',   key: 'status_opt_asignada' },
      { value: 'en_proceso', key: 'status_opt_en_proceso' },
      { value: 'resuelta',   key: 'status_opt_resuelta' },
      { value: 'cerrada',    key: 'status_opt_cerrada' }
    ];

    const user = store.getState().currentUser;
    const roleLabel = user ? AuthService.getRoleConfig(user.role).label : '';

    const adminPanel = canChangeStatus ? `
      <div style="width: 100%; border-top: 1px solid rgba(255,174,51,0.18); padding-top: 1rem; margin-top: 0.5rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.65rem;">
          <span style="font-size: 0.8rem; font-weight: 700; color: #FFAE33; text-transform: uppercase; letter-spacing: 0.05em;" data-i18n="modal_admin_title">⚙️ ${t('modal_admin_title').replace('⚙️ ', '')}</span>
          <span style="font-size: 0.7rem; color: #A89082; font-style: italic;">(${roleLabel})</span>
        </div>
        <div style="display: flex; gap: 0.6rem; flex-wrap: wrap; align-items: flex-end;">
          <div style="flex: 0 0 auto; min-width: 170px;">
            <label style="font-size: 0.72rem; color: #D4A386; display: block; margin-bottom: 0.25rem; font-weight: 600;" data-i18n="modal_status_label">${t('modal_status_label')}</label>
            <select id="admin-status-select" class="form-control" style="padding: 0.5rem 0.75rem; font-size: 0.85rem; background: rgba(18,10,6,0.95); border: 1.5px solid rgba(255,174,51,0.3);">
              ${statusOptions.map(s =>
                `<option value="${s.value}"${s.value === incident.status ? ' selected' : ''}>${t(s.key)}</option>`
              ).join('')}
            </select>
          </div>
          <div style="flex: 1; min-width: 200px;">
            <label style="font-size: 0.72rem; color: #D4A386; display: block; margin-bottom: 0.25rem; font-weight: 600;" data-i18n="modal_comment_label">${t('modal_comment_label')}</label>
            <input id="admin-status-comment" type="text" class="form-control" data-i18n-placeholder="modal_comment_ph"
                   placeholder="${t('modal_comment_ph')}" 
                   style="padding: 0.5rem 0.75rem; font-size: 0.85rem; background: rgba(18,10,6,0.95); border: 1.5px solid rgba(255,174,51,0.3);" />
          </div>
          <button class="btn btn-sunset" onclick="CivitasApp.changeIncidentStatus('${incident.id}')" 
                  style="white-space: nowrap; padding: 0.55rem 1.25rem; font-size: 0.85rem;" data-i18n="modal_btn_update">
            ${t('modal_btn_update')}
          </button>
        </div>
      </div>
    ` : '';

    modalFooter.innerHTML = `
      <div style="display: flex; flex-wrap: wrap; gap: 0.6rem; align-items: center; width: 100%;">
        <button class="btn btn-secondary" onclick="CivitasApp.closeModal()" data-i18n="modal_close">${t('modal_close')}</button>
        <button class="btn btn-sunset" onclick="CivitasApp.supportIncidentFromModal('${incident.id}')">
          <span data-i18n="modal_btn_support">${t('modal_btn_support')}</span> (${incident.adherentsCount})
        </button>
      </div>
      ${adminPanel}
    `;

    modalBackdrop.classList.add('active');
  }

  supportIncidentFromModal(incidentId) {
    if (AuthService.isDemo()) {
      NotificationService.showToast('👁️ Demo', I18n.t('restrict_demo_report'), 'warning');
      return;
    }
    IncidentService.addAdherent(incidentId);
    this.openIncidentDetail(incidentId);
    this.renderCurrentView();
  }

  changeIncidentStatus(incidentId) {
    if (!AuthService.canChangeStatus()) {
      NotificationService.showToast('🔒', I18n.t('restrict_citizen_status'), 'warning');
      return;
    }

    const selectEl = document.getElementById('admin-status-select');
    const commentEl = document.getElementById('admin-status-comment');
    if (!selectEl) return;

    const newStatus = selectEl.value;
    const comment = commentEl ? commentEl.value.trim() : '';

    const incident = store.getState().incidents.find(i => i.id === incidentId);
    if (!incident) return;

    if (incident.status === newStatus && !comment) {
      NotificationService.sendNotification(I18n.t('toast_no_changes'), I18n.t('toast_no_changes_msg'));
      return;
    }

    IncidentService.updateStatus(incidentId, newStatus, comment);
    this.openIncidentDetail(incidentId);
    this.renderCurrentView();

    NotificationService.sendNotification(
      I18n.t('toast_status_updated'),
      `${I18n.t('toast_status_updated_msg')} ${newStatus.replace('_', ' ').toUpperCase()}.`
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
        .then(reg => console.log('✅ ServiceWorker registrado', reg.scope))
        .catch(err => console.warn('Aviso ServiceWorker', err));
    }
  }
}

export const CivitasApp = new CivitasAppController();
window.CivitasApp = CivitasApp;

document.addEventListener('DOMContentLoaded', () => {
  CivitasApp.init();
});
