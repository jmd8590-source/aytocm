/**
 * CIVITAS - Suggestion & Citizen Proposal Board Component
 * Proposals list, Voting counters, Filter by area, Proposal creation modal, and Municipal Project Conversion
 */

import { store } from '../state/store.js';
import { SuggestionService } from '../services/suggestionService.js';
import { AuthService } from '../services/authService.js';
import { Helpers } from '../utils/helpers.js';
import { NotificationService } from '../services/notificationService.js';
import { I18n } from '../utils/i18n.js';

export const SuggestionBoard = {
  currentCategory: 'all',

  init(containerId = 'suggestions-container') {
    this.render(containerId);
  },

  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const suggestions = store.getSuggestions();
    const currentUser = store.getState().currentUser;
    const isStaff = AuthService.hasRole('ROLE_EMPLOYEE', 'ROLE_MUNICIPAL_ADMIN', 'ROLE_SUPERADMIN');
    const t = (k) => I18n.t(k);

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h2 data-i18n="sug_title">${t('sug_title')}</h2>
          <p style="font-size: 0.9rem; color: #D4A386;" data-i18n="sug_sub">${t('sug_sub')}</p>
        </div>
        <button type="button" class="btn btn-sunset" onclick="CivitasApp.suggestions.openNewModal()" data-i18n="sug_btn_new">
          ${t('sug_btn_new')}
        </button>
      </div>

      <!-- Suggestions Grid -->
      <div class="suggestions-grid">
        ${suggestions.length === 0 ? `
          <div class="card" style="text-align: center; padding: 3rem 1rem; grid-column: 1 / -1;">
            <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🌱</div>
            <h3 data-i18n="sug_empty_title">${t('sug_empty_title')}</h3>
            <p style="margin-bottom: 1.25rem; color: #A89082;" data-i18n="sug_empty_sub">${t('sug_empty_sub')}</p>
            <button class="btn btn-sunset" onclick="CivitasApp.suggestions.openNewModal()" data-i18n="sug_empty_btn">${t('sug_empty_btn')}</button>
          </div>
        ` : suggestions.map(rawSug => {
          const sug = I18n.translateSuggestion(rawSug);
          const hasVoted = currentUser && sug.voterUserIds && sug.voterUserIds.includes(currentUser.id);
          const statusBadges = {
            recibida: `<span class="badge" style="background-color: rgba(245, 158, 11, 0.2); color: #FCD34D;">${t('sug_status_voting')}</span>`,
            en_estudio: `<span class="badge" style="background-color: rgba(59, 130, 246, 0.2); color: #93C5FD;">${t('sug_status_study')}</span>`,
            aprobada: `<span class="badge" style="background-color: rgba(16, 185, 129, 0.2); color: #6EE7B7;">${t('sug_status_approved')}</span>`,
            en_ejecucion: `<span class="badge" style="background-color: rgba(255, 122, 24, 0.2); color: #FFAE33;">${t('sug_status_execution')}</span>`
          };

          return `
            <div class="card card-hoverable suggestion-card">
              <div style="display: flex; gap: 1rem; align-items: flex-start; margin-bottom: 1rem;">
                <button type="button" class="vote-badge-btn ${hasVoted ? 'voted' : ''}" 
                        onclick="CivitasApp.suggestions.vote('${sug.id}')" aria-label="Votar propuesta">
                  <span style="font-size: 1.1rem; line-height: 1;">▲</span>
                  <span class="vote-count">${sug.votesCount}</span>
                  <span style="font-size: 0.65rem; font-weight: 700;">${I18n.currentLocale === 'en' ? 'VOTES' : 'VOTOS'}</span>
                </button>
                <div style="flex: 1;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                    <span style="font-size: 0.75rem; color: #A89082;">${I18n.currentLocale === 'en' ? 'By' : 'Por'} ${sug.authorName}</span>
                    ${statusBadges[sug.status] || ''}
                  </div>
                  <h3 style="font-size: 1.1rem; margin-bottom: 0.4rem; line-height: 1.3; color:#FFFFFF;">${sug.title}</h3>
                </div>
              </div>

              <p style="font-size: 0.9rem; color: #D4A386; margin-bottom: 1rem; flex: 1;">${sug.description}</p>

              ${sug.budgetEstimate ? `
                <div style="font-size: 0.8rem; color: #A89082; margin-bottom: 0.5rem;">
                  💰 <span data-i18n="sug_budget_label">${t('sug_budget_label')}</span> <strong>${sug.budgetEstimate}</strong>
                </div>
              ` : ''}

              ${sug.officialResponse ? `
                <div class="official-response-box">
                  <div style="font-weight: 750; color: #6EE7B7; margin-bottom: 0.2rem; display: flex; align-items: center; gap: 0.35rem;">
                    🏛️ <span data-i18n="sug_official_response_title">${t('sug_official_response_title')}</span>
                  </div>
                  <div style="color: #FFFFFF; font-size: 0.85rem;">${sug.officialResponse}</div>
                </div>
              ` : ''}

              ${isStaff ? `
                <div style="border-top: 1px solid rgba(255,174,51,0.2); margin-top: 1rem; padding-top: 0.75rem; display: flex; justify-content: flex-end;">
                  <button class="btn btn-sm btn-outline" onclick="CivitasApp.suggestions.openOfficialResponseModal('${sug.id}')">
                    🏛️ ${I18n.currentLocale === 'en' ? 'Respond / Convert to Municipal Project' : 'Responder / Convertir en Actuación'}
                  </button>
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  vote(suggestionId) {
    const hasVoted = SuggestionService.toggleVote(suggestionId);
    this.render('suggestions-container');
    if (hasVoted) {
      NotificationService.showToast('Voto Registrado', 'Has apoyado esta propuesta ciudadana.', 'success');
    } else {
      NotificationService.showToast('Voto Retirado', 'Has retirado tu apoyo a la propuesta.', 'info');
    }
  },

  openNewModal() {
    const modalBackdrop = document.getElementById('app-modal-backdrop');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalFooter = document.getElementById('modal-footer');

    modalTitle.textContent = 'Nueva Propuesta Ciudadana';

    modalBody.innerHTML = `
      <div class="form-group">
        <label class="form-label" for="sug-title">Título de la propuesta <span class="required">*</span></label>
        <input type="text" id="sug-title" class="form-control" placeholder="Ej: Renovación de columpios adaptados en parque infantil" required />
      </div>

      <div class="form-group">
        <label class="form-label" for="sug-desc">Descripción y Justificación <span class="required">*</span></label>
        <textarea id="sug-desc" class="form-control" placeholder="Explica qué beneficio aportará a la comunidad, ubicación sugerida y detalles..." required></textarea>
      </div>

      <div class="form-group">
        <label class="form-label" for="sug-budget">Presupuesto Estimado (Opcional)</label>
        <input type="text" id="sug-budget" class="form-control" placeholder="Ej: 3.500 € o Dejar en blanco para valoración técnica" />
      </div>
    `;

    modalFooter.innerHTML = `
      <button class="btn btn-secondary" onclick="CivitasApp.closeModal()">Cancelar</button>
      <button class="btn btn-primary" onclick="CivitasApp.suggestions.submitNew()">Publicar Propuesta</button>
    `;

    modalBackdrop.classList.add('active');
  },

  submitNew() {
    const title = document.getElementById('sug-title').value.trim();
    const desc = document.getElementById('sug-desc').value.trim();
    const budget = document.getElementById('sug-budget').value.trim();

    if (!title || !desc) {
      NotificationService.showToast('Campos requeridos', 'Por favor completa título y descripción', 'warning');
      return;
    }

    SuggestionService.createSuggestion({
      title,
      description: desc,
      budgetEstimate: budget
    });

    CivitasApp.closeModal();
    this.render('suggestions-container');
  },

  openOfficialResponseModal(suggestionId) {
    const suggestion = store.getState().suggestions.find(s => s.id === suggestionId);
    if (!suggestion) return;

    const modalBackdrop = document.getElementById('app-modal-backdrop');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalFooter = document.getElementById('modal-footer');

    modalTitle.textContent = `Respuesta Municipal: ${suggestion.title}`;

    modalBody.innerHTML = `
      <div class="form-group">
        <label class="form-label">Estado de la Propuesta</label>
        <select id="sug-resp-status" class="form-control">
          <option value="recibida" ${suggestion.status === 'recibida' ? 'selected' : ''}>En Votación</option>
          <option value="en_estudio" ${suggestion.status === 'en_estudio' ? 'selected' : ''}>En Estudio Técnico / Pleno</option>
          <option value="aprobada" ${suggestion.status === 'aprobada' ? 'selected' : ''}>Aprobada para Presupuestos</option>
          <option value="en_ejecucion" ${suggestion.status === 'en_ejecucion' ? 'selected' : ''}>En Ejecución / Proyecto</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Texto de la Respuesta Oficial</label>
        <textarea id="sug-resp-text" class="form-control" placeholder="Escribe el comunicado o dictamen del Ayuntamiento...">${suggestion.officialResponse || ''}</textarea>
      </div>
    `;

    modalFooter.innerHTML = `
      <button class="btn btn-secondary" onclick="CivitasApp.closeModal()">Cancelar</button>
      <button class="btn btn-emerald" onclick="CivitasApp.suggestions.saveOfficialResponse('${suggestion.id}')">
        🏛️ Publicar Dictamen
      </button>
    `;

    modalBackdrop.classList.add('active');
  },

  saveOfficialResponse(suggestionId) {
    const status = document.getElementById('sug-resp-status').value;
    const text = document.getElementById('sug-resp-text').value;

    SuggestionService.respondToSuggestion(suggestionId, text, status, status === 'aprobada' || status === 'en_ejecucion');
    CivitasApp.closeModal();
    this.render('suggestions-container');
  }
};
