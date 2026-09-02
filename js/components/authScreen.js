/**
 * CIVITAS — Auth Screen Component
 * Pantalla de inicio premium con selector de perfil, modal login/registro
 * y traducción simultánea ES/EN
 * Cumbres Mayores (Huelva)
 */

import { AuthService } from '../services/authService.js';
import { NotificationService } from '../services/notificationService.js';
import { I18n } from '../utils/i18n.js';

const ROLES = [
  {
    role: 'ROLE_CITIZEN',
    emoji: '🙋',
    keyLabel: 'auth_btn_citizen',
    keySub: 'auth_btn_citizen_sub',
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.25) 0%, rgba(18,10,6,0.9) 100%)',
    border: '#10B981',
    glow: 'rgba(16,185,129,0.35)',
    needsCode: false
  },
  {
    role: 'ROLE_EMPLOYEE',
    emoji: '🛠️',
    keyLabel: 'auth_btn_operator',
    keySub: 'auth_btn_operator_sub',
    gradient: 'linear-gradient(135deg, rgba(245,158,11,0.25) 0%, rgba(18,10,6,0.9) 100%)',
    border: '#F59E0B',
    glow: 'rgba(245,158,11,0.35)',
    needsCode: true
  },
  {
    role: 'ROLE_MUNICIPAL_ADMIN',
    emoji: '🏛️',
    keyLabel: 'auth_btn_admin',
    keySub: 'auth_btn_admin_sub',
    gradient: 'linear-gradient(135deg, rgba(255,122,24,0.28) 0%, rgba(18,10,6,0.9) 100%)',
    border: '#FF7A18',
    glow: 'rgba(255,122,24,0.4)',
    needsCode: true
  },
  {
    role: 'ROLE_SUPERADMIN',
    emoji: '⚡',
    keyLabel: 'auth_btn_superadmin',
    keySub: 'auth_btn_superadmin_sub',
    gradient: 'linear-gradient(135deg, rgba(139,92,246,0.28) 0%, rgba(18,10,6,0.9) 100%)',
    border: '#8B5CF6',
    glow: 'rgba(139,92,246,0.4)',
    needsCode: true
  }
];

export const AuthScreen = {
  onLoginSuccess: null, // callback set by app.js

  /**
   * Renders the full auth screen into the given container element
   */
  render(container) {
    container.innerHTML = this._buildHTML();
    this._bindEvents(container);
    I18n.applyTranslations();
  },

  _buildHTML() {
    const locale = I18n.currentLocale;
    return `
      <div class="auth-screen" id="auth-screen-inner">

        <!-- Language Switcher -->
        <div class="auth-lang-switcher">
          <button type="button" class="lang-btn ${locale === 'es' ? 'active' : ''}" onclick="CivitasApp.switchLanguage('es')">🇪🇸 ES</button>
          <button type="button" class="lang-btn ${locale === 'en' ? 'active' : ''}" onclick="CivitasApp.switchLanguage('en')">🇬🇧 EN</button>
        </div>

        <!-- Background particles / decorative glows -->
        <div class="auth-glow auth-glow-1"></div>
        <div class="auth-glow auth-glow-2"></div>
        <div class="auth-glow auth-glow-3"></div>

        <!-- Auth Card -->
        <div class="auth-card">
          <!-- Logo & Header -->
          <div class="auth-header">
            <div class="auth-logo">🏰</div>
            <h1 class="auth-title" data-i18n="auth_welcome">${I18n.t('auth_welcome')}</h1>
            <div class="auth-location" data-i18n="app_location">${I18n.t('app_location')}</div>
            <p class="auth-subtitle" data-i18n="auth_subtitle">${I18n.t('auth_subtitle')}</p>
          </div>

          <!-- Profile Selector Grid -->
          <div class="profile-grid">
            ${ROLES.map(r => `
              <button type="button" class="profile-btn" data-role="${r.role}"
                      style="--profile-border: ${r.border}; --profile-glow: ${r.glow}; background: ${r.gradient};"
                      onclick="AuthScreen.openModal('${r.role}')">
                <span class="profile-emoji">${r.emoji}</span>
                <span class="profile-label" data-i18n="${r.keyLabel}">${I18n.t(r.keyLabel)}</span>
                <span class="profile-sub" data-i18n="${r.keySub}">${I18n.t(r.keySub)}</span>
              </button>
            `).join('')}
          </div>

          <!-- Demo separator -->
          <div class="auth-divider">
            <span data-i18n="auth_btn_demo_sub">${I18n.t('auth_btn_demo_sub')}</span>
          </div>

          <!-- Demo button -->
          <button type="button" class="demo-btn" onclick="AuthScreen.enterDemo()">
            <span>👁️</span>
            <span data-i18n="auth_btn_demo">${I18n.t('auth_btn_demo')}</span>
          </button>
        </div>

        <!-- Login / Register Modal (hidden by default) -->
        <div class="auth-modal-backdrop" id="auth-modal-backdrop" style="display:none;">
          <div class="auth-modal" id="auth-modal">
            <!-- Modal Header -->
            <div class="auth-modal-header" id="auth-modal-header">
              <div id="auth-modal-role-badge"></div>
              <button type="button" class="auth-modal-close" onclick="AuthScreen.closeModal()" aria-label="Cerrar">✕</button>
            </div>

            <!-- Tabs -->
            <div class="auth-tabs">
              <button type="button" class="auth-tab active" id="tab-login" onclick="AuthScreen.switchTab('login')" data-i18n="auth_modal_login_tab">${I18n.t('auth_modal_login_tab')}</button>
              <button type="button" class="auth-tab" id="tab-register" onclick="AuthScreen.switchTab('register')" data-i18n="auth_modal_register_tab">${I18n.t('auth_modal_register_tab')}</button>
            </div>

            <!-- Forms -->
            <div id="auth-form-container"></div>
          </div>
        </div>
      </div>
    `;
  },

  _bindEvents(container) {
    // Close modal on backdrop click
    const backdrop = container.querySelector('#auth-modal-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) this.closeModal();
      });
    }
    // ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModal();
    });
  },

  // --- Modal open/close ---
  openModal(role) {
    this._currentRole = role;
    this._currentTab = 'login';
    const backdrop = document.getElementById('auth-modal-backdrop');
    if (backdrop) {
      backdrop.style.display = 'flex';
      this._renderModalHeader(role);
      this._renderForm('login');
      // Animate in
      const modal = document.getElementById('auth-modal');
      if (modal) {
        modal.style.animation = 'authModalIn 0.3s cubic-bezier(0.16,1,0.3,1) both';
      }
    }
  },

  closeModal() {
    const backdrop = document.getElementById('auth-modal-backdrop');
    if (backdrop) backdrop.style.display = 'none';
    this._currentRole = null;
  },

  switchTab(tab) {
    this._currentTab = tab;
    document.getElementById('tab-login').classList.toggle('active', tab === 'login');
    document.getElementById('tab-register').classList.toggle('active', tab === 'register');
    this._renderForm(tab);
  },

  _renderModalHeader(role) {
    const cfg = AuthService.getRoleConfig(role);
    const headerEl = document.getElementById('auth-modal-header');
    if (!headerEl) return;

    const badgeEl = document.getElementById('auth-modal-role-badge');
    if (badgeEl) {
      badgeEl.innerHTML = `
        <div style="display:flex; align-items:center; gap:0.6rem;">
          <span style="font-size:1.4rem;">${cfg.emoji}</span>
          <div>
            <div style="font-size:1.05rem; font-weight:800; color:#FFF7F2;">${cfg.label}</div>
            <div style="font-size:0.75rem; color:${cfg.color}; font-weight:700; text-transform:uppercase; letter-spacing:0.05em;">
              ${I18n.currentLocale === 'en' ? cfg.labelEn : cfg.label}
            </div>
          </div>
        </div>
      `;
    }
  },

  _renderForm(tab) {
    const container = document.getElementById('auth-form-container');
    if (!container) return;
    const role = this._currentRole;
    const cfg = AuthService.getRoleConfig(role);
    const needsCode = ROLES.find(r => r.role === role)?.needsCode;
    const isLogin = tab === 'login';

    container.innerHTML = `
      <form class="auth-form" id="auth-form-main" onsubmit="AuthScreen.handleSubmit(event)">

        ${!isLogin ? `
        <div class="form-group">
          <label class="form-label" data-i18n="auth_modal_name">${I18n.t('auth_modal_name')}</label>
          <input type="text" id="auth-name" class="auth-input" 
                 data-i18n-placeholder="auth_modal_name_ph"
                 placeholder="${I18n.t('auth_modal_name_ph')}" autocomplete="name" />
          <div class="auth-field-error" id="err-name"></div>
        </div>
        ` : ''}

        <div class="form-group">
          <label class="form-label" data-i18n="auth_modal_email">${I18n.t('auth_modal_email')}</label>
          <input type="email" id="auth-email" class="auth-input" 
                 data-i18n-placeholder="auth_modal_email_ph"
                 placeholder="${I18n.t('auth_modal_email_ph')}" autocomplete="email" />
          <div class="auth-field-error" id="err-email"></div>
        </div>

        <div class="form-group">
          <label class="form-label" data-i18n="auth_modal_password">${I18n.t('auth_modal_password')}</label>
          <div class="auth-input-wrapper">
            <input type="password" id="auth-password" class="auth-input" 
                   data-i18n-placeholder="auth_modal_password_ph"
                   placeholder="${I18n.t('auth_modal_password_ph')}" autocomplete="${isLogin ? 'current-password' : 'new-password'}" />
            <button type="button" class="auth-toggle-pw" onclick="AuthScreen.togglePassword()" title="Mostrar/ocultar">👁</button>
          </div>
          <div class="auth-field-error" id="err-password"></div>
        </div>

        ${needsCode && !isLogin ? `
        <div class="form-group">
          <label class="form-label" data-i18n="auth_modal_access_code">${I18n.t('auth_modal_access_code')}</label>
          <input type="text" id="auth-code" class="auth-input" 
                 data-i18n-placeholder="auth_modal_access_code_ph"
                 placeholder="${I18n.t('auth_modal_access_code_ph')}" style="font-family: var(--cm-font-mono); letter-spacing:0.08em;" />
          <div class="auth-code-hint" data-i18n="auth_modal_access_code_hint">
            ${I18n.t('auth_modal_access_code_hint')}
          </div>
          <div class="auth-field-error" id="err-code"></div>
        </div>
        ` : ''}

        <div class="auth-field-error auth-global-error" id="err-global"></div>

        <button type="submit" class="btn-auth-submit" style="--submit-color: ${cfg.color}; --submit-glow: ${cfg.glow};">
          ${isLogin ? I18n.t('auth_btn_login_submit') : I18n.t('auth_btn_register_submit')}
        </button>
      </form>
    `;
  },

  handleSubmit(event) {
    event.preventDefault();
    const isLogin = this._currentTab === 'login';
    const role = this._currentRole;

    // Clear errors
    ['name', 'email', 'password', 'code', 'global'].forEach(id => {
      const el = document.getElementById(`err-${id}`);
      if (el) el.textContent = '';
    });

    const emailEl = document.getElementById('auth-email');
    const passwordEl = document.getElementById('auth-password');
    const nameEl = document.getElementById('auth-name');
    const codeEl = document.getElementById('auth-code');

    const email = emailEl ? emailEl.value.trim() : '';
    const password = passwordEl ? passwordEl.value : '';
    const name = nameEl ? nameEl.value.trim() : '';
    const accessCode = codeEl ? codeEl.value.trim() : '';

    let result;
    if (isLogin) {
      result = AuthService.login(email, password, role);
    } else {
      result = AuthService.register({ name, email, password, role, accessCode });
    }

    if (!result.success) {
      const errField = document.getElementById(`err-${result.error}`);
      const globalErr = document.getElementById('err-global');
      const msg = I18n.t(`auth_error_${result.error}`);
      if (errField) errField.textContent = msg;
      else if (globalErr) globalErr.textContent = msg;
      return;
    }

    // Success
    this.closeModal();
    NotificationService.showToast(
      I18n.t('auth_success_welcome'),
      isLogin ? I18n.t('auth_success_logged') : I18n.t('auth_success_registered'),
      'success'
    );

    if (this.onLoginSuccess) {
      this.onLoginSuccess(result.user);
    }
  },

  togglePassword() {
    const pw = document.getElementById('auth-password');
    if (pw) pw.type = pw.type === 'password' ? 'text' : 'password';
  },

  enterDemo() {
    const demoUser = AuthService.loginAsDemo();
    NotificationService.showToast(
      I18n.t('auth_btn_demo'),
      I18n.t('auth_entering_demo'),
      'info'
    );
    if (this.onLoginSuccess) {
      this.onLoginSuccess(demoUser);
    }
  }
};

// Expose globally for inline onclick handlers
window.AuthScreen = AuthScreen;
