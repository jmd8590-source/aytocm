/**
 * AYTO CUMBRES MAYORES - Utility Helpers
 * Date formatting, Haversine geo-distance, debounce, ID generator
 */

export const Helpers = {
  /**
   * Generates unique municipal tracking code like CM-2026-87421
   */
  generateTrackingCode() {
    const year = new Date().getFullYear();
    const random = Math.floor(10000 + Math.random() * 90000);
    return `CM-${year}-${random}`;
  },

  /**
   * Generates a standard UUID
   */
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  /**
   * Formats ISO timestamp to human localized date string
   */
  formatDate(isoString, includeTime = true) {
    if (!isoString) return '-';
    const date = new Date(isoString);
    const options = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {})
    };
    return new Intl.DateTimeFormat('es-ES', options).format(date);
  },

  /**
   * Returns human-readable relative time ("hace 5 min", "hace 2 horas", "hace 3 días")
   */
  getRelativeTime(isoString) {
    if (!isoString) return '';
    const now = new Date();
    const past = new Date(isoString);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 30) return `Hace ${diffDays} días`;
    return this.formatDate(isoString, false);
  },

  /**
   * Calculates Haversine distance in meters between two lat/lng coordinates
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c); // returns meters
  },

  /**
   * Debounce helper
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Converts a File/Blob to Base64 with maximum width/height compression
   */
  compressImageToBase64(file, maxWidth = 1200, quality = 0.8) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  }
};
