/**
 * CIVITAS - Authentication & Session Service
 * RBAC (Citizen, Employee, Municipal Admin, Superadmin, Demo) & Session management
 * Cumbres Mayores (Huelva)
 */

import { store } from '../state/store.js';
import { MockData } from '../state/mockData.js';
import { Security } from '../utils/security.js';

// Access codes for privileged roles (in a real app these come from the backend)
const ACCESS_CODES = {
  ROLE_EMPLOYEE: 'OPERARIO2026',
  ROLE_MUNICIPAL_ADMIN: 'CONCEJALIA2026',
  ROLE_SUPERADMIN: 'SUPERADMIN2026'
};

// Default avatars by role
const ROLE_AVATARS = {
  ROLE_CITIZEN: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  ROLE_EMPLOYEE: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  ROLE_MUNICIPAL_ADMIN: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  ROLE_SUPERADMIN: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
  ROLE_DEMO: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&auto=format&fit=crop&q=80'
};

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
   * Returns true if user is in demo mode
   */
  isDemo() {
    const user = this.getCurrentUser();
    return user && user.isDemo === true;
  },

  /**
   * Returns true if user can create incidents
   */
  canCreateIncident() {
    const user = this.getCurrentUser();
    if (!user || user.isDemo) return false;
    return ['ROLE_CITIZEN', 'ROLE_EMPLOYEE', 'ROLE_MUNICIPAL_ADMIN', 'ROLE_SUPERADMIN'].includes(user.role);
  },

  /**
   * Returns true if user can change incident status
   */
  canChangeStatus() {
    const user = this.getCurrentUser();
    if (!user || user.isDemo) return false;
    return ['ROLE_EMPLOYEE', 'ROLE_MUNICIPAL_ADMIN', 'ROLE_SUPERADMIN'].includes(user.role);
  },

  /**
   * Returns true if user can access admin panel
   */
  canAccessAdmin() {
    const user = this.getCurrentUser();
    if (!user || user.isDemo) return false;
    return ['ROLE_EMPLOYEE', 'ROLE_MUNICIPAL_ADMIN', 'ROLE_SUPERADMIN'].includes(user.role);
  },

  /**
   * Enters the app as a demo / guest visitor (read-only)
   */
  loginAsDemo() {
    const demoUser = {
      id: `usr-demo-${Date.now()}`,
      name: 'Visitante Demo',
      email: 'demo@portal.es',
      role: 'ROLE_DEMO',
      isDemo: true,
      municipalityId: 'mun-cumbresmayores',
      avatar: ROLE_AVATARS.ROLE_DEMO
    };
    store.setState(prev => ({ ...prev, currentUser: demoUser }));
    return demoUser;
  },

  /**
   * Registers a new user with the given role.
   * For privileged roles (EMPLOYEE, ADMIN, SUPERADMIN) requires an access code.
   * Returns { success, user, error }
   */
  register(userData) {
    const { name, email, password, role, accessCode } = userData;

    // Basic validations
    if (!name || name.trim().length < 2) return { success: false, error: 'name' };
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { success: false, error: 'email' };
    if (!password || password.length < 6) return { success: false, error: 'password' };

    // Access code check for privileged roles
    const privilegedRoles = ['ROLE_EMPLOYEE', 'ROLE_MUNICIPAL_ADMIN', 'ROLE_SUPERADMIN'];
    if (privilegedRoles.includes(role)) {
      if (!accessCode || accessCode.toUpperCase() !== ACCESS_CODES[role]) {
        return { success: false, error: 'code' };
      }
    }

    // Check if email already registered (in mock data)
    const existingUser = MockData.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      // If credentials match a mock user, just log them in
      store.setState(prev => ({ ...prev, currentUser: { ...existingUser } }));
      return { success: true, user: existingUser, wasExisting: true };
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: Security.sanitizeHTML(name.trim()),
      email: Security.sanitizeHTML(email.toLowerCase().trim()),
      role: role || 'ROLE_CITIZEN',
      isDemo: false,
      municipalityId: 'mun-cumbresmayores',
      phone: userData.phone || '',
      avatar: ROLE_AVATARS[role] || ROLE_AVATARS.ROLE_CITIZEN
    };

    store.setState(prev => ({ ...prev, currentUser: newUser }));
    return { success: true, user: newUser };
  },

  /**
   * Login with email and password.
   * Returns { success, user, error }
   */
  login(email, password, role) {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { success: false, error: 'email' };
    if (!password || password.length < 6) return { success: false, error: 'password' };

    // Match against mock users
    const matchedUser = MockData.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (matchedUser) {
      store.setState(prev => ({ ...prev, currentUser: { ...matchedUser, isDemo: false } }));
      return { success: true, user: matchedUser };
    }

    // Accept any email/password — create a session user with the selected role
    const sessionUser = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email: email.toLowerCase().trim(),
      role: role || 'ROLE_CITIZEN',
      isDemo: false,
      municipalityId: 'mun-cumbresmayores',
      avatar: ROLE_AVATARS[role] || ROLE_AVATARS.ROLE_CITIZEN
    };

    store.setState(prev => ({ ...prev, currentUser: sessionUser }));
    return { success: true, user: sessionUser };
  },

  /**
   * Logout: clear session, return to auth screen
   */
  logout() {
    store.setState(prev => ({ ...prev, currentUser: null }));
  },

  /**
   * Returns role display config
   */
  getRoleConfig(role) {
    const configs = {
      ROLE_CITIZEN:       { label: 'Vecin@ de Cumbres', labelEn: 'Cumbres Resident',   color: '#10B981', border: '#6EE7B7', emoji: '🙋' },
      ROLE_EMPLOYEE:      { label: 'Operario Municipal', labelEn: 'Municipal Operator', color: '#F59E0B', border: '#FDE68A', emoji: '🛠️' },
      ROLE_MUNICIPAL_ADMIN: { label: 'Concejalía / Obras', labelEn: 'Council / Works', color: '#FF7A18', border: '#FFD8A8', emoji: '🏛️' },
      ROLE_SUPERADMIN:    { label: 'SuperAdmin',          labelEn: 'SuperAdmin',        color: '#8B5CF6', border: '#DDD6FE', emoji: '⚡' },
      ROLE_DEMO:          { label: 'Visitante Demo',      labelEn: 'Demo Visitor',      color: '#6B7280', border: '#D1D5DB', emoji: '👁️' }
    };
    return configs[role] || { label: role, color: '#FF7A18', border: '#FFAE33', emoji: '👤' };
  }
};
