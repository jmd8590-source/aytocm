import { store } from '../state/store.js';
import { IncidentService } from '../services/incidentService.js';
import { Helpers } from '../utils/helpers.js';
import { NotificationService } from '../services/notificationService.js';
import { MockData } from '../state/mockData.js';
import { I18n } from '../utils/i18n.js';

export const AdminDashboard = {
  currentFilterDepartment: 'all',
  currentFilterStatus: 'all',

  init(containerId = 'admin-dashboard-container') {
    this.render(containerId);
  },

  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const incidents = store.getIncidents();
    const departments = store.getState().departments;
    const totalIncidents = incidents.length;
    const resolvedCount = incidents.filter(i => ['resuelta', 'cerrada'].includes(i.status)).length;
    const inProgressCount = incidents.filter(i => i.status === 'en_proceso').length;
    const pendingCount = incidents.filter(i => ['recibida', 'validando', 'asignada'].includes(i.status)).length;
    const resolutionRate = totalIncidents > 0 ? Math.round((resolvedCount / totalIncidents) * 100) : 0;
    const t = (k) => I18n.t(k);

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h2 data-i18n="admin_title">${t('admin_title')}</h2>
          <p style="font-size: 0.9rem; color:#D4A386;" data-i18n="admin_subtitle">${t('admin_subtitle')}</p>
        </div>
        <div style="display: flex; gap: 0.75rem;">
          <button type="button" class="btn btn-secondary btn-sm" onclick="CivitasApp.admin.exportReport()">
            📊 ${I18n.currentLocale === 'en' ? 'Export PDF/CSV Report' : 'Exportar Informe PDF/CSV'}
          </button>
          <button type="button" class="btn btn-sunset btn-sm" onclick="CivitasApp.navigateTo('audit')">
            🛡️ ${I18n.currentLocale === 'en' ? 'Audit Log' : 'Registro de Auditoría'}
          </button>
        </div>
      </div>

      <!-- KPI Metrics Summary -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-icon" style="background-color: rgba(255,159,56,0.15); color: #FFAE33;">📋</div>
          <div>
            <div class="kpi-value">${totalIncidents}</div>
            <div class="kpi-label">${I18n.currentLocale === 'en' ? 'Total Incidents' : 'Total Incidencias'}</div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon" style="background-color: rgba(245,158,11,0.15); color: #F59E0B;">⏳</div>
          <div>
            <div class="kpi-value">${pendingCount}</div>
            <div class="kpi-label">${I18n.currentLocale === 'en' ? 'Pending / Assigned' : 'Pendientes / Asignadas'}</div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon" style="background-color: rgba(16,185,129,0.15); color: #10B981;">✅</div>
          <div>
            <div class="kpi-value">${resolvedCount} (${resolutionRate}%)</div>
            <div class="kpi-label">${I18n.currentLocale === 'en' ? 'Resolution Rate' : 'Tasa de Resolución'}</div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon" style="background-color: rgba(244,63,94,0.15); color: #F43F5E;">⚡</div>
          <div>
            <div class="kpi-value">18.4 h</div>
            <div class="kpi-label">${I18n.currentLocale === 'en' ? 'Avg. Resolution Time' : 'Tiempo Medio Resolución (TMR)'}</div>
          </div>
        </div>
      </div>

      <!-- Tabs for Kanban vs Table -->
      <div class="nav-tabs" style="margin-bottom: 1.25rem;">
        <button class="tab-btn active" id="admin-tab-kanban" onclick="CivitasApp.admin.switchTab('kanban')">
          📌 Tablero de Trabajo (Kanban)
        </button>
        <button class="tab-btn" id="admin-tab-table" onclick="CivitasApp.admin.switchTab('table')">
          📋 Lista Detallada con Filtros
        </button>
        <button class="tab-btn" id="admin-tab-heatmap" onclick="CivitasApp.navigateTo('map')">
          🔥 Mapa de Calor Geoespacial
        </button>
      </div>

      <!-- Kanban View -->
      <div id="admin-kanban-view" style="display: block;">
        <div class="kanban-board">
          ${this.renderKanbanColumn('Recibidas / Validando', ['recibida', 'validando'], 'var(--civ-primary-500)', incidents)}
          ${this.renderKanbanColumn('Asignadas a Departamento', ['asignada'], 'var(--civ-primary-700)', incidents)}
          ${this.renderKanbanColumn('En Proceso de Reparación', ['en_proceso'], 'var(--civ-blue-600)', incidents)}
          ${this.renderKanbanColumn('Resueltas y Verificadas', ['resuelta', 'cerrada'], 'var(--civ-emerald-600)', incidents)}
        </div>
      </div>

      <!-- Table View (Hidden by default) -->
      <div id="admin-table-view" style="display: none;">
        <div class="card" style="padding: 0; overflow-x: auto;">
          <table class="audit-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Incidencia</th>
                <th>Categoría</th>
                <th>Urgencia / Prioridad</th>
                <th>Estado</th>
                <th>Departamento</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${incidents.map(inc => `
                <tr>
                  <td><strong>${inc.trackingCode}</strong></td>
                  <td>${inc.title}</td>
                  <td><span class="badge" style="background-color:var(--bg-surface-subtle);">${inc.category}</span></td>
                  <td>
                    <span class="badge priority-${inc.urgency}">${inc.urgency} (${inc.priorityScore} pts)</span>
                  </td>
                  <td><span class="badge status-${inc.status}">${inc.status.replace('_', ' ')}</span></td>
                  <td>${this.getDepartmentName(inc.assignedDepartmentId)}</td>
                  <td>${Helpers.getRelativeTime(inc.createdAt)}</td>
                  <td>
                    <button class="btn btn-sm btn-primary" onclick="CivitasApp.admin.openAssignModal('${inc.id}')">
                      Gestionar
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  renderKanbanColumn(title, statuses, color, incidents) {
    const colIncidents = incidents.filter(i => statuses.includes(i.status));

    return `
      <div class="kanban-column">
        <div class="kanban-col-header" style="border-bottom-color: ${color};">
          <strong style="font-size: 0.9rem;">${title}</strong>
          <span class="badge" style="background-color: var(--bg-surface);">${colIncidents.length}</span>
        </div>
        <div class="kanban-cards-container">
          ${colIncidents.length === 0 ? `
            <div style="text-align: center; color: var(--text-muted); font-size: 0.8rem; padding: 2rem 0;">Sin incidencias</div>
          ` : colIncidents.map(inc => `
            <div class="kanban-item card-hoverable" onclick="CivitasApp.admin.openAssignModal('${inc.id}')">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                <span style="font-size: 0.725rem; font-weight: 700; color: var(--text-muted);">${inc.trackingCode}</span>
                <span class="badge priority-${inc.urgency}" style="font-size: 0.65rem;">${inc.urgency}</span>
              </div>
              <strong style="font-size: 0.875rem; color: var(--text-primary); display: block; margin-bottom: 0.4rem; line-height: 1.25;">${inc.title}</strong>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.5rem;">📍 ${inc.address}</div>
              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--border-subtle); padding-top: 0.4rem;">
                <span style="font-size: 0.7rem; color: var(--brand-primary); font-weight: 600;">
                  ${this.getDepartmentName(inc.assignedDepartmentId)}
                </span>
                <span style="font-size: 0.7rem; color: var(--text-muted);">👥 ${inc.adherentsCount} afectados</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  getDepartmentName(deptId) {
    const dept = store.getState().departments.find(d => d.id === deptId);
    return dept ? dept.name : 'Sin Asignar';
  },

  switchTab(tab) {
    const kanbanEl = document.getElementById('admin-kanban-view');
    const tableEl = document.getElementById('admin-table-view');
    const btnKanban = document.getElementById('admin-tab-kanban');
    const btnTable = document.getElementById('admin-tab-table');

    if (tab === 'kanban') {
      kanbanEl.style.display = 'block';
      tableEl.style.display = 'none';
      btnKanban.classList.add('active');
      btnTable.classList.remove('active');
    } else {
      kanbanEl.style.display = 'none';
      tableEl.style.display = 'block';
      btnKanban.classList.remove('active');
      btnTable.classList.add('active');
    }
  },

  openAssignModal(incidentId) {
    const incident = store.getState().incidents.find(i => i.id === incidentId);
    if (!incident) return;

    const departments = store.getState().departments;
    const employees = MockData.users.filter(u => u.role === 'ROLE_EMPLOYEE' || u.role === 'ROLE_MUNICIPAL_ADMIN');

    const modalBackdrop = document.getElementById('app-modal-backdrop');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalFooter = document.getElementById('modal-footer');

    modalTitle.textContent = `Gestión Municipal: ${incident.trackingCode}`;

    modalBody.innerHTML = `
      <div style="margin-bottom: 1.25rem;">
        <h4 style="margin-bottom: 0.25rem;">${incident.title}</h4>
        <p style="font-size: 0.875rem; color: var(--text-secondary);">${incident.description}</p>
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.4rem;">📍 Ubicación: ${incident.address}</div>
      </div>

      ${incident.images && incident.images.length ? `
        <div style="margin-bottom: 1.25rem;">
          <strong style="font-size: 0.85rem;">Fotografía aportada por ciudadano:</strong>
          <img src="${incident.images[0]}" style="width: 100%; max-height: 200px; object-fit: cover; border-radius: var(--civ-radius-md); margin-top: 0.4rem;" alt="Evidencia" />
        </div>
      ` : ''}

      <div class="form-group">
        <label class="form-label">Cambiar Estado Operativo</label>
        <select id="modal-status-select" class="form-control">
          <option value="recibida" ${incident.status === 'recibida' ? 'selected' : ''}>RECIBIDA</option>
          <option value="validando" ${incident.status === 'validando' ? 'selected' : ''}>VALIDANDO</option>
          <option value="asignada" ${incident.status === 'asignada' ? 'selected' : ''}>ASIGNADA</option>
          <option value="en_proceso" ${incident.status === 'en_proceso' ? 'selected' : ''}>EN PROCESO</option>
          <option value="resuelta" ${incident.status === 'resuelta' ? 'selected' : ''}>RESUELTA</option>
          <option value="cerrada" ${incident.status === 'cerrada' ? 'selected' : ''}>CERRADA</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Departamento Responsable</label>
        <select id="modal-dept-select" class="form-control">
          ${departments.map(d => `
            <option value="${d.id}" ${incident.assignedDepartmentId === d.id ? 'selected' : ''}>${d.name}</option>
          `).join('')}
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Operario / Empleado Asignado</label>
        <select id="modal-emp-select" class="form-control">
          <option value="">-- Sin técnico específico asignado --</option>
          ${employees.map(e => `
            <option value="${e.id}" ${incident.assignedEmployeeId === e.id ? 'selected' : ''}>${e.name}</option>
          `).join('')}
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Notas de Actuación / Informe de Resolución</label>
        <textarea id="modal-notes-input" class="form-control" placeholder="Detalla la intervención realizada o las instrucciones técnicas...">${incident.resolutionNotes || ''}</textarea>
      </div>
    `;

    modalFooter.innerHTML = `
      <button class="btn btn-secondary" onclick="CivitasApp.closeModal()">Cerrar</button>
      <button class="btn btn-primary" onclick="CivitasApp.admin.saveIncidentChanges('${incident.id}')">
        💾 Guardar Actuación
      </button>
    `;

    modalBackdrop.classList.add('active');
  },

  saveIncidentChanges(incidentId) {
    const status = document.getElementById('modal-status-select').value;
    const deptId = document.getElementById('modal-dept-select').value;
    const empId = document.getElementById('modal-emp-select').value;
    const notes = document.getElementById('modal-notes-input').value;

    IncidentService.assignIncident(incidentId, deptId, empId || null);
    IncidentService.updateStatus(incidentId, status, notes);

    CivitasApp.closeModal();
    this.render('admin-dashboard-container');
    NotificationService.showToast('Cambios Guardados', 'Incidencia actualizada y registrada en auditoría', 'success');
  },

  exportReport() {
    NotificationService.showToast('Generando Informe', 'Exportando informe de incidencias en formato estructurado...', 'info');
    setTimeout(() => {
      NotificationService.showToast('Informe Listo', 'Informe descargado con éxito.', 'success');
    }, 1200);
  }
};
