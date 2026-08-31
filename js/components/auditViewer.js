/**
 * CIVITAS - Audit & Traceability Viewer Component
 */

import { store } from '../state/store.js';
import { AuditService } from '../services/auditService.js';
import { Helpers } from '../utils/helpers.js';

export const AuditViewer = {
  init(containerId = 'audit-container') {
    this.render(containerId);
  },

  render(containerId, filter = '') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const logs = AuditService.getLogs(filter);

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h2>Trazabilidad y Auditoría del Sistema</h2>
          <p style="font-size: 0.9rem;">Registro inmutable de actuaciones administrativas, cambios de estado y resoluciones (Conforme a RGPD y ENS).</p>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <input type="text" id="audit-filter-input" class="form-control" style="width: 240px;" placeholder="Filtrar por acción..." 
                 value="${filter}" oninput="CivitasApp.audit.filterLogs(this.value)" />
        </div>
      </div>

      <div class="card" style="padding: 0; overflow-x: auto;">
        <table class="audit-table">
          <thead>
            <tr>
              <th>Fecha y Hora</th>
              <th>Acción Registrada</th>
              <th>Detalles del Evento</th>
              <th>Usuario Responsable</th>
              <th>IP Origen</th>
            </tr>
          </thead>
          <tbody>
            ${logs.length === 0 ? `
              <tr>
                <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted);">No se encontraron registros de auditoría</td>
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
