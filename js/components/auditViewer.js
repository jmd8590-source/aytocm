/**
 * CIVITAS - Audit & Traceability Viewer Component
 */

import { store } from '../state/store.js';
import { AuditService } from '../services/auditService.js';
import { Helpers } from '../utils/helpers.js';
import { I18n } from '../utils/i18n.js';

export const AuditViewer = {
  init(containerId = 'audit-container') {
    this.render(containerId);
  },

  render(containerId, filter = '') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const logs = AuditService.getLogs(filter);
    const t = (k) => I18n.t(k);

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h2 data-i18n="audit_title">${t('audit_title')}</h2>
          <p style="font-size: 0.9rem; color:#D4A386;" data-i18n="audit_subtitle">${t('audit_subtitle')}</p>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <input type="text" id="audit-filter-input" class="form-control" style="width: 240px;" 
                 placeholder="${I18n.currentLocale === 'en' ? 'Filter by action...' : 'Filtrar por acción...'}" 
                 value="${filter}" oninput="CivitasApp.audit.filterLogs(this.value)" />
        </div>
      </div>

      <div class="card" style="padding: 0; overflow-x: auto;">
        <table class="audit-table">
          <thead>
            <tr>
              <th>${I18n.currentLocale === 'en' ? 'Date & Time' : 'Fecha y Hora'}</th>
              <th>${I18n.currentLocale === 'en' ? 'Action' : 'Acción Registrada'}</th>
              <th>${I18n.currentLocale === 'en' ? 'Event Details' : 'Detalles del Evento'}</th>
              <th>${I18n.currentLocale === 'en' ? 'Responsible User' : 'Usuario Responsable'}</th>
              <th>${I18n.currentLocale === 'en' ? 'IP Address' : 'IP Origen'}</th>
            </tr>
          </thead>
          <tbody>
            ${logs.length === 0 ? `
              <tr>
                <td colspan="5" style="text-align: center; padding: 2rem; color: #A89082;">${I18n.currentLocale === 'en' ? 'No audit records found' : 'No se encontraron registros de auditoría'}</td>
              </tr>
            ` : logs.map(log => `
              <tr>
                <td style="white-space: nowrap; font-family: var(--civ-font-mono); font-size: 0.8rem;">
                  ${Helpers.formatDate(log.timestamp, true)}
                </td>
                <td>
                  <span class="badge" style="background-color: var(--civ-primary-50); color: var(--civ-primary-700); font-size: 0.75rem;">
                    ${log.action}
                  </span>
                </td>
                <td>${log.details}</td>
                <td><strong>${log.performedBy}</strong></td>
                <td style="font-family: var(--civ-font-mono); font-size: 0.75rem; color: var(--text-muted);">${log.ipAddress}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  filterLogs(query) {
    this.render('audit-container', query);
  }
};
