/**
 * CIVITAS - Notification Service
 * In-app Toast notifications, Activity Feed, Sound feedback & Push readiness
 */

import { store } from '../state/store.js';

export const NotificationService = {
  /**
   * Sends an in-app notification and displays a toast message
   */
  sendNotification(title, message, type = 'info') {
    const newNotif = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false
    };

    store.setState(prev => ({
      ...prev,
      notifications: [newNotif, ...(prev.notifications || [])]
    }));

    this.showToast(title, message, type);
  },

  /**
   * Renders a floating Toast alert on the screen
   */
  showToast(title, message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');

    const iconMap = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    };

    toast.innerHTML = `
      <div style="font-size: 1.25rem; line-height: 1;">${iconMap[type] || '🔔'}</div>
      <div style="flex: 1;">
        <div style="font-weight: 700; font-size: 0.9rem; margin-bottom: 0.2rem;">${title}</div>
        <div style="font-size: 0.825rem; color: var(--text-secondary);">${message}</div>
      </div>
      <button style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:1rem;" aria-label="Cerrar aviso">&times;</button>
    `;

    const closeBtn = toast.querySelector('button');
    closeBtn.addEventListener('click', () => {
      toast.remove();
    });

    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentElement) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 250);
      }
    }, 4500);
  },

  /**
   * Marks all notifications as read
   */
  markAllAsRead() {
    store.setState(prev => ({
      ...prev,
      notifications: (prev.notifications || []).map(n => ({ ...n, read: true }))
    }));
  }
};
