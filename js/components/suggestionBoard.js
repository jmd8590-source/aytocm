/**
 * CIVITAS - Suggestion & Citizen Proposal Board Component
 * Proposals list, Voting counters, Filter by area, Proposal creation modal, and Municipal Project Conversion
 */

import { store } from '../state/store.js';
import { SuggestionService } from '../services/suggestionService.js';
import { AuthService } from '../services/authService.js';
import { Helpers } from '../utils/helpers.js';
import { NotificationService } from '../services/notificationService.js';

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

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h2>Propuestas y Presupuestos Participativos</h2>
          <p style="font-size: 0.9rem;">Propón mejoras para tu barrio, vota ideas de tus vecinos y sigue su conversión en proyectos reales.</p>
        </div>
        <button type="button" class="btn btn-primary" onclick="CivitasApp.suggestions.openNewModal()">
          💡 Proponer Nueva Idea
        </button>
      </div>

      <!-- Suggestions Grid -->
      <div class="suggestions-grid">
        ${suggestions.length === 0 ? `
          <div class="card" style="text-align: center; padding: 3rem 1rem; grid-column: 1 / -1;">
            <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🌱</div>
            <h3>Sé el primero en proponer una mejora</h3>
            <p style="margin-bottom: 1.25rem;">Las propuestas más apoyadas son evaluadas directamente por el Pleno Municipal.</p>
            <button class="btn btn-primary" onclick="CivitasApp.suggestions.openNewModal()">Crear Propuesta</button>
          </div>
        ` : suggestions.map(sug => {
          const hasVoted = currentUser && sug.voterUserIds && sug.voterUserIds.includes(currentUser.id);
          const statusBadges = {
            recibida: '<span class="badge" style="background-color: var(--status-received-bg); color: var(--status-received-text);">En Votación</span>',
            en_estudio: '<span class="badge" style="background-color: var(--status-validating-bg); color: var(--status-validating-text);">En Estudio Técnico</span>',
            aprobada: '<span class="badge" style="background-color: var(--status-resolved-bg); color: var(--status-resolved-text);">Aprobada</span>',
            en_ejecucion: '<span class="badge" style="background-color: var(--status-in-progress-bg); color: var(--status-in-progress-text);">En Ejecución</span>'
          };

          return `
            <div class="card card-hoverable suggestion-card">
              <div style="display: flex; gap: 1rem; align-items: flex-start; margin-bottom: 1rem;">
                <button type="button" class="vote-badge-btn ${hasVoted ? 'voted' : ''}" 
                        onclick="CivitasApp.suggestions.vote('${sug.id}')" aria-label="Votar propuesta">
                  <span style="font-size: 1.1rem; line-height: 1;">▲</span>
                  <span class="vote-count">${sug.votesCount}</span>
                  <span style="font-size: 0.65rem; font-weight: 700;">VOTOS</span>
                </button>
                <div style="flex: 1;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                    <span style="font-size: 0.75rem; color: var(--text-muted);">Por ${sug.authorName}</span>
                    ${statusBadges[sug.status] || ''}
                  </div>
                  <h3 style="font-size: 1.1rem; margin-bottom: 0.4rem; line-height: 1.3;">${sug.title}</h3>
                </div>
              </div>

              <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1rem; flex: 1;">${sug.description}</p>

              ${sug.budgetEstimate ? `
                <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.5rem;">
                  💰 Estimación presupuestaria: <strong>${sug.budgetEstimate}</strong>
                </div>
              ` : ''}

              ${sug.officialResponse ? `
                <div class="official-response-box">
                  <div style="font-weight: 700; color: var(--civ-emerald-700); margin-bottom: 0.2rem; display: flex; align-items: center; gap: 0.35rem;">
                    🏛️ Respuesta Municipal Oficial:
                  </div>
                  <div>${sug.officialResponse}</div>
                </div>
              ` : ''}

              ${isStaff ? `
                <div style="border-top: 1px solid var(--border-subtle); margin-top: 1rem; padding-top: 0.75rem; display: flex; justify-content: flex-end;">
                  <button class="btn btn-sm btn-outline" onclick="CivitasApp.suggestions.openOfficialResponseModal('${sug.id}')">
                    🏛️ Responder / Convertir en Actuación
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
