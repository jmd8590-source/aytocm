/**
 * CIVITAS - Incident Service
 * Deduplication engine (<50m), Priority algorithm, Status workflow & CRUD
 */

import { store } from '../state/store.js';
import { Helpers } from '../utils/helpers.js';
import { Security } from '../utils/security.js';
import { AuditService } from './auditService.js';
import { NotificationService } from './notificationService.js';

export const IncidentService = {
  /**
   * Finds potential duplicate incidents within a 50m radius with matching category
   */
  findDuplicates(lat, lng, category, maxDistanceMeters = 50) {
    const currentMunicipalityId = store.getState().currentMunicipalityId;
    const activeIncidents = store.getState().incidents.filter(inc => 
      inc.municipalityId === currentMunicipalityId &&
      !['resuelta', 'cerrada'].includes(inc.status)
    );

    const matches = [];

    for (const inc of activeIncidents) {
      if (inc.lat && inc.lng) {
        const distance = Helpers.calculateDistance(lat, lng, inc.lat, inc.lng);
        // Match if close (<50m) and either same category or general proximity
        if (distance <= maxDistanceMeters) {
          const isSameCategory = inc.category === category;
          matches.push({
            incident: inc,
            distanceMeters: distance,
            confidence: isSameCategory ? 0.95 : 0.65
          });
        }
      }
    }

    return matches.sort((a, b) => a.distanceMeters - b.distanceMeters);
  },

  /**
   * Calculates dynamic weighted priority score (0-100)
   * Formula: (UrgencyWeight * 0.4) + (CategoryRisk * 0.3) + (Adherents * 0.2) + (SensitiveZone * 0.1)
   */
  calculatePriorityScore(urgency, categoryId, adherentsCount = 1) {
    const urgencyWeights = { urgente: 100, alta: 75, media: 45, baja: 20 };
    const urgencyScore = urgencyWeights[urgency] || 40;

    const category = store.getState().categories.find(c => c.id === categoryId);
    const categoryRiskScore = (category ? category.riskFactor : 2) * 20; // 1-5 to 20-100

    const adherentsScore = Math.min(adherentsCount * 10, 100);
    const sensitiveZoneScore = 50;

    const finalScore = Math.round(
      (urgencyScore * 0.40) +
      (categoryRiskScore * 0.30) +
      (adherentsScore * 0.20) +
      (sensitiveZoneScore * 0.10)
    );

    return Math.min(Math.max(finalScore, 10), 100);
  },

  /**
   * Creates a new citizen incident
   */
  createIncident(incidentData) {
    const user = store.getState().currentUser;
    const municipalityId = store.getState().currentMunicipalityId;
    const trackingCode = Helpers.generateTrackingCode();
    const nowIso = new Date().toISOString();

    const priorityScore = this.calculatePriorityScore(incidentData.urgency, incidentData.category, 1);

    const categoryObj = store.getState().categories.find(c => c.id === incidentData.category);

    const newIncident = {
      id: `inc-${Date.now()}`,
      trackingCode: trackingCode,
      municipalityId: municipalityId,
      title: Security.sanitizeHTML(incidentData.title),
      description: Security.sanitizeHTML(incidentData.description),
      category: incidentData.category,
      urgency: incidentData.urgency || 'media',
      priorityScore: priorityScore,
      status: 'recibida',
      assignedDepartmentId: categoryObj ? categoryObj.departmentId : null,
      assignedEmployeeId: null,
      citizenId: user ? user.id : 'usr-anon',
      citizenName: user ? user.name : 'Vecino',
      address: Security.sanitizeHTML(incidentData.address || 'Ubicación GPS'),
      lat: incidentData.lat,
      lng: incidentData.lng,
      adherentsCount: 1,
      adherentUserIds: user ? [user.id] : [],
      images: incidentData.images || [],
      resolutionImages: [],
      resolutionNotes: '',
      createdAt: nowIso,
      updatedAt: nowIso,
      history: [
        {
          status: 'recibida',
          timestamp: nowIso,
          comment: 'Incidencia comunicada por el ciudadano vía portal web.'
        }
      ]
    };

    store.setState(prev => ({
      ...prev,
      incidents: [newIncident, ...prev.incidents]
    }));

    NotificationService.sendNotification(
      'Incidencia Registrada',
      `Tu incidencia con código ${trackingCode} ha sido recibida correctamente.`
    );

    AuditService.logAction(
      'INCIDENT_CREATED',
      `Nueva incidencia ${trackingCode} (${newIncident.title}) en categoría ${newIncident.category}`
    );

    return newIncident;
  },

  /**
   * Adds citizen support ("A mí también me afecta") to an existing incident
   */
  addAdherent(incidentId) {
    const user = store.getState().currentUser;
    const userId = user ? user.id : `anon-${Date.now()}`;

    let updatedIncident = null;

    store.setState(prev => {
      const updatedIncidents = prev.incidents.map(inc => {
        if (inc.id === incidentId) {
          if (inc.adherentUserIds && inc.adherentUserIds.includes(userId)) {
            return inc; // Already supported
          }

          const newCount = (inc.adherentsCount || 1) + 1;
          const newPriority = this.calculatePriorityScore(inc.urgency, inc.category, newCount);

          updatedIncident = {
            ...inc,
            adherentsCount: newCount,
            adherentUserIds: [...(inc.adherentUserIds || []), userId],
            priorityScore: newPriority,
            updatedAt: new Date().toISOString()
          };

          return updatedIncident;
        }
        return inc;
      });

      return { ...prev, incidents: updatedIncidents };
    });

    if (updatedIncident) {
      NotificationService.sendNotification(
        'Apoyo Registrado',
        `Te has sumado a la incidencia ${updatedIncident.trackingCode}. Recibirás avisos de su evolución.`
      );
    }

    return updatedIncident;
  },

  /**
   * Updates incident status (Admin / Operario action)
   */
  updateStatus(incidentId, newStatus, comment = '', resolutionImage = null) {
    const user = store.getState().currentUser;
    const nowIso = new Date().toISOString();
    let updatedIncident = null;

    store.setState(prev => {
      const updatedIncidents = prev.incidents.map(inc => {
        if (inc.id === incidentId) {
          const newHistory = [
            ...inc.history,
            {
              status: newStatus,
              timestamp: nowIso,
              comment: comment || `Estado cambiado a ${newStatus} por ${user ? user.name : 'Administrador'}.`
            }
          ];

          const resolutionImages = resolutionImage ? [...inc.resolutionImages, resolutionImage] : inc.resolutionImages;

          updatedIncident = {
            ...inc,
            status: newStatus,
            resolutionNotes: newStatus === 'resuelta' ? comment : inc.resolutionNotes,
            resolutionImages: resolutionImages,
            updatedAt: nowIso,
            history: newHistory
          };
          return updatedIncident;
        }
        return inc;
      });

      return { ...prev, incidents: updatedIncidents };
    });

    if (updatedIncident) {
      AuditService.logAction(
        'INCIDENT_STATUS_CHANGE',
        `Incidencia ${updatedIncident.trackingCode} cambiada a ${newStatus.toUpperCase()}`
      );

      NotificationService.sendNotification(
        'Estado de Incidencia Actualizado',
        `La incidencia ${updatedIncident.trackingCode} ha cambiado a: ${newStatus.toUpperCase()}.`
      );
    }

    return updatedIncident;
  },

  /**
   * Assigns incident to a department and specific employee
   */
  assignIncident(incidentId, departmentId, employeeId = null) {
    const nowIso = new Date().toISOString();
    const department = store.getState().departments.find(d => d.id === departmentId);
    const employee = MockData.users.find(u => u.id === employeeId);

    let updatedIncident = null;

    store.setState(prev => {
      const updatedIncidents = prev.incidents.map(inc => {
        if (inc.id === incidentId) {
          const assignComment = `Asignada al departamento ${department ? department.name : departmentId}` +
            (employee ? ` y al técnico ${employee.name}` : '');

          const newHistory = [
            ...inc.history,
            {
              status: 'asignada',
              timestamp: nowIso,
              comment: assignComment
            }
          ];

          updatedIncident = {
            ...inc,
            status: 'asignada',
            assignedDepartmentId: departmentId,
            assignedEmployeeId: employeeId,
            updatedAt: nowIso,
            history: newHistory
          };
          return updatedIncident;
        }
        return inc;
      });

      return { ...prev, incidents: updatedIncidents };
    });

    if (updatedIncident) {
      AuditService.logAction(
        'INCIDENT_ASSIGNMENT',
        `Incidencia ${updatedIncident.trackingCode} asignada a ${department ? department.name : departmentId}`
      );
    }

    return updatedIncident;
  }
};
