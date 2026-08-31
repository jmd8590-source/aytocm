/**
 * CIVITAS - Authentication & Session Service
 * RBAC (Citizen, Employee, Municipal Admin, Superadmin) & Session management
 */

import { store } from '../state/store.js';
import { MockData } from '../state/mockData.js';
import { Security } from '../utils/security.js';

export const AuthService = {
  /**
   * Returns currently logged in user
   */
  getCurrentUser() {
    return store.getState().currentUser;
  },

  /**
   * Checks if user has one of required roles
   */
  hasRole(...roles) {
    const user = this.getCurrentUser();
    if (!user) return false;
    if (user.role === 'ROLE_SUPERADMIN') return true;
    return roles.includes(user.role);
  },

  /**
   * Switches user persona for rapid evaluation and testing
   */
  switchPersona(roleName) {
    const targetUser = MockData.users.find(u => u.role === roleName) || MockData.users[0];
    store.setState(prev => ({
      ...prev,
      currentUser: { ...targetUser }
    }));
    return targetUser;
  },

  /**
   * Registers a new citizen
   */
  register(userData) {
    const newUser = {
      id: `usr-${Date.now()}`,
      name: Security.sanitizeHTML(userData.name),
      email: Security.sanitizeHTML(userData.email),
      role: 'ROLE_CITIZEN',
      municipalityId: store.getState().currentMunicipalityId,
      phone: userData.phone || '',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    };

    store.setState(prev => ({
      ...prev,
      currentUser: newUser
    }));

    return newUser;
  },

  /**
   * Login with email and password
   */
  login(email, password) {
    const matchedUser = MockData.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (matchedUser) {
      store.setState(prev => ({
        ...prev,
        currentUser: { ...matchedUser }
      }));
      return { success: true, user: matchedUser };
    }
    
    // Default fallback create session
    const guestUser = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0],
      email: email,
      role: 'ROLE_CITIZEN',
      municipalityId: store.getState().currentMunicipalityId,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    };
    
    store.setState(prev => ({
      ...prev,
      currentUser: guestUser
    }));

    return { success: true, user: guestUser };
  },

  /**
   * Logout user
   */
  logout() {
    store.setState(prev => ({
      ...prev,
      currentUser: null
    }));
  }
};
