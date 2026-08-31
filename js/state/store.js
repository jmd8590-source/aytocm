/**
 * CIVITAS / AYUNTAMIENTO DE CUMBRES MAYORES
 * Centralized Reactive Store para Cumbres Mayores (Huelva)
 */

import { MockData } from './mockData.js';

const STORAGE_KEY = 'ayto_cumbresmayores_state_v2';

class Store {
  constructor() {
    this.subscribers = new Set();
    this.state = this.loadInitialState();
  }

  loadInitialState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.currentMunicipalityId === 'mun-cumbresmayores') {
          return parsed;
        }
      } catch (e) {
        console.error('Error parsing state, resetting to Cumbres Mayores data', e);
      }
    }

    const initialState = {
      currentMunicipalityId: 'mun-cumbresmayores',
      currentUser: MockData.users[0], // María Carmen Márquez (Citizen)
      municipalities: [...MockData.municipalities],
      departments: [...MockData.departments],
      categories: [...MockData.categories],
      incidents: [...MockData.incidents],
      suggestions: [...MockData.suggestions],
      auditLogs: [...MockData.auditLogs],
      notifications: [
        {
          id: 'notif-1',
          title: 'Actuación en Calle La Portá',
          message: 'Tu aviso CM-2026-00481 ha pasado al estado: En Proceso (Reparación de adoquines).',
          timestamp: new Date().toISOString(),
          read: false,
          type: 'info'
        }
      ],
      currentTheme: localStorage.getItem('civitas_theme') || 'light'
    };

    this.persist(initialState);
    return initialState;
  }

  persist(state = this.state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Unable to persist state to localStorage', e);
    }
  }

  getState() {
    return this.state;
  }

  setState(updater) {
    if (typeof updater === 'function') {
      this.state = updater(this.state);
    } else {
      this.state = { ...this.state, ...updater };
    }
    this.persist();
    this.notify();
  }

  subscribe(listener) {
    this.subscribers.add(listener);
    return () => this.subscribers.delete(listener);
  }

  notify() {
    for (const listener of this.subscribers) {
      listener(this.state);
    }
  }

  // Helper getters
  getCurrentMunicipality() {
    return this.state.municipalities.find(m => m.id === this.state.currentMunicipalityId) || this.state.municipalities[0];
  }

  getCurrentUser() {
    return this.state.currentUser;
  }

  getIncidents() {
    return this.state.incidents.filter(inc => inc.municipalityId === this.state.currentMunicipalityId);
  }

  getSuggestions() {
    return this.state.suggestions.filter(sug => sug.municipalityId === this.state.currentMunicipalityId);
  }
}

export const store = new Store();
