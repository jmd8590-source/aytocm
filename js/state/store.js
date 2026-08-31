/**
 * CIVITAS - Centralized Reactive Store
 * Manages local persistence, state mutation, and subscriber notifications
 */

import { MockData } from './mockData.js';

const STORAGE_KEY = 'civitas_app_state_v1';

class Store {
  constructor() {
    this.subscribers = new Set();
    this.state = this.loadInitialState();
  }

  loadInitialState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored Civitas state, fallback to seed data', e);
      }
    }

    const initialState = {
      currentMunicipalityId: 'mun-1',
      currentUser: MockData.users[0], // Default: Elena Morales (Citizen)
      municipalities: [...MockData.municipalities],
      departments: [...MockData.departments],
      categories: [...MockData.categories],
      incidents: [...MockData.incidents],
      suggestions: [...MockData.suggestions],
      auditLogs: [...MockData.auditLogs],
      notifications: [
        {
          id: 'notif-1',
          title: 'Actualización en tu incidencia',
          message: 'Tu reporte CIV-2026-10492 ha pasado al estado: En Proceso.',
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
