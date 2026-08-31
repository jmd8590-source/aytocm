/**
 * CIVITAS - Audit & Traceability Service
 * Immutable logging of administrative actions compliant with GDPR
 */

import { store } from '../state/store.js';

export const AuditService = {
  /**
   * Records an administrative action in the immutable audit log
   */
  logAction(actionType, details) {
    const user = store.getState().currentUser;
    const municipalityId = store.getState().currentMunicipalityId;

    const newLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: actionType,
      details: details,
      performedBy: user ? `${user.name} (${user.role})` : 'Sistema Automático',
      ipAddress: '127.0.0.1 (Local Client)',
      municipalityId: municipalityId
    };

    store.setState(prev => ({
      ...prev,
      auditLogs: [newLog, ...(prev.auditLogs || [])]
    }));

    return newLog;
  },

  /**
   * Retrieves audit logs with optional filtering
   */
  getLogs(filterAction = '') {
    const currentMunicipalityId = store.getState().currentMunicipalityId;
    const logs = (store.getState().auditLogs || []).filter(l => l.municipalityId === currentMunicipalityId);

    if (!filterAction) return logs;
    return logs.filter(l => l.action.toLowerCase().includes(filterAction.toLowerCase()));
  }
};
