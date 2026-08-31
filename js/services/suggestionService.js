/**
 * CIVITAS - Suggestion & Citizen Proposal Service
 * Proposals creation, 1 citizen 1 vote engine, official municipal responses & project conversion
 */

import { store } from '../state/store.js';
import { Security } from '../utils/security.js';
import { AuditService } from './auditService.js';
import { NotificationService } from './notificationService.js';

export const SuggestionService = {
  /**
   * Creates a new citizen proposal/suggestion
   */
  createSuggestion(suggestionData) {
    const user = store.getState().currentUser;
    const municipalityId = store.getState().currentMunicipalityId;
    const nowIso = new Date().toISOString();

    const newSuggestion = {
      id: `sug-${Date.now()}`,
      municipalityId: municipalityId,
      title: Security.sanitizeHTML(suggestionData.title),
      description: Security.sanitizeHTML(suggestionData.description),
      category: suggestionData.category || 'general',
      authorId: user ? user.id : 'usr-anon',
      authorName: user ? user.name : 'Vecino',
      votesCount: 1,
      voterUserIds: user ? [user.id] : [],
      status: 'recibida',
      budgetEstimate: suggestionData.budgetEstimate || 'En valoración',
      officialResponse: '',
      convertedToProject: false,
      createdAt: nowIso
    };

    store.setState(prev => ({
      ...prev,
      suggestions: [newSuggestion, ...prev.suggestions]
    }));

    NotificationService.sendNotification(
      'Propuesta Publicada',
      'Tu propuesta vecinal ha sido publicada y ya puede recibir votos ciudadanos.'
    );

    return newSuggestion;
  },

  /**
   * Casts a vote for a proposal (Ensures 1 vote per citizen)
   */
  toggleVote(suggestionId) {
    const user = store.getState().currentUser;
    const userId = user ? user.id : 'usr-temp-voter';
    let hasVoted = false;

    store.setState(prev => {
      const updatedSuggestions = prev.suggestions.map(sug => {
        if (sug.id === suggestionId) {
          const voterList = sug.voterUserIds || [];
          const alreadyVoted = voterList.includes(userId);

          if (alreadyVoted) {
            // Remove vote
            hasVoted = false;
            return {
              ...sug,
              votesCount: Math.max(sug.votesCount - 1, 0),
              voterUserIds: voterList.filter(id => id !== userId)
            };
          } else {
            // Add vote
            hasVoted = true;
            return {
              ...sug,
              votesCount: sug.votesCount + 1,
              voterUserIds: [...voterList, userId]
            };
          }
        }
        return sug;
      });

      return { ...prev, suggestions: updatedSuggestions };
    });

    return hasVoted;
  },

  /**
   * Responds officially to a suggestion and updates its status
   */
  respondToSuggestion(suggestionId, responseText, status, convertedToProject = false) {
    store.setState(prev => {
      const updatedSuggestions = prev.suggestions.map(sug => {
        if (sug.id === suggestionId) {
          return {
            ...sug,
            officialResponse: Security.sanitizeHTML(responseText),
            status: status,
            convertedToProject: Boolean(convertedToProject)
          };
        }
        return sug;
      });

      return { ...prev, suggestions: updatedSuggestions };
    });

    AuditService.logAction(
      'SUGGESTION_RESPONSE',
      `Respuesta oficial emitida a propuesta #${suggestionId} (${status})`
    );

    NotificationService.sendNotification(
      'Respuesta Municipal a Propuesta',
      'El Ayuntamiento ha emitido una respuesta oficial sobre una propuesta ciudadana.'
    );
  }
};
