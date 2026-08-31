/**
 * CIVITAS - Security Utilities
 * XSS Sanitization, Honeypot verification, Math Captcha, Password strength
 */

export const Security = {
  /**
   * Sanitizes input strings preventing HTML/Script injection (XSS)
   */
  sanitizeHTML(str) {
    if (typeof str !== 'string') return str;
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },

  /**
   * Generates a simple, accessible Math Captcha for anti-bot protection
   */
  generateMathCaptcha() {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
    return {
      num1,
      num2,
      question: `¿Cuánto es ${num1} + ${num2}?`,
      expectedAnswer: num1 + num2
    };
  },

  /**
   * Evaluates password complexity (OWASP standards)
   */
  evaluatePasswordStrength(password) {
    if (!password) return { score: 0, label: 'Vacía', isAcceptable: false };

    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z\d]/.test(password)) score++;

    let label = 'Débil';
    let isAcceptable = false;

    if (score >= 4) {
      label = 'Excelente';
      isAcceptable = true;
    } else if (score === 3) {
      label = 'Aceptable';
      isAcceptable = true;
    } else if (score === 2) {
      label = 'Media';
    }

    return { score, label, isAcceptable };
  },

  /**
   * Verifies that the honeypot field is empty (Bot trap)
   */
  verifyHoneypot(honeypotValue) {
    return !honeypotValue || honeypotValue.trim() === '';
  },

  /**
   * Simple client-side token mock generator for offline/demo mode
   */
  createDemoToken(user) {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      municipalityId: user.municipalityId,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
    }));
    const signature = btoa('civitas_secure_signature_mock');
    return `${header}.${payload}.${signature}`;
  }
};
