/**
 * AYUNTAMIENTO DE CUMBRES MAYORES — Bespoke Luxury SVG Icon System
 * Iconografía vectorial de alta gama estilo Linear / Lucide con degradados de luz cálida
 */

export const Icons = {
  defs: `
    <svg style="position: absolute; width: 0; height: 0; overflow: hidden;" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cm-sunset-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFAE33" />
          <stop offset="50%" stop-color="#FF7A18" />
          <stop offset="100%" stop-color="#D9480F" />
        </linearGradient>
        <linearGradient id="cm-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFE58F" />
          <stop offset="100%" stop-color="#FAAD14" />
        </linearGradient>
        <linearGradient id="cm-emerald-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#6EE7B7" />
          <stop offset="100%" stop-color="#059669" />
        </linearGradient>
        <linearGradient id="cm-cyan-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#7DD3FC" />
          <stop offset="100%" stop-color="#0284C7" />
        </linearGradient>
        <linearGradient id="cm-purple-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#C084FC" />
          <stop offset="100%" stop-color="#7C3AED" />
        </linearGradient>
      </defs>
    </svg>
  `,

  get(name, size = 20, color = 'currentColor', gradientId = null) {
    const fillOrStroke = gradientId ? `url(#${gradientId})` : color;

    const map = {
      // Castillo-Fortaleza de Sancho IV (Emblema Municipal)
      castle: `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${fillOrStroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 21V10l3-2v4l2-1.5V6l3-2 3 2v4.5l2 1.5v-4l3 2v11H4z"/>
          <path d="M9 21v-5a3 3 0 0 1 6 0v5"/>
          <path d="M9 10h.01M15 10h.01"/>
          <line x1="2" y1="21" x2="22" y2="21"/>
        </svg>
      `,

      // Inicio / Dashboard
      home: `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${fillOrStroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9.5L12 3l9 6.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.5z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      `,

      // Megáfono / Reportar
      report: `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${fillOrStroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 11l14-5v12L3 13v-2z"/>
          <path d="M17 9a4 4 0 0 1 0 6"/>
          <path d="M6 13v6a2 2 0 0 0 2 2h1"/>
          <path d="M21 7a7.5 7.5 0 0 1 0 10"/>
        </svg>
      `,

      // Mapa / Ubicación
      map: `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${fillOrStroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
          <line x1="8" y1="2" x2="8" y2="18"/>
          <line x1="16" y1="6" x2="16" y2="22"/>
        </svg>
      `,

      // Incidencias / Lista
      incidents: `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${fillOrStroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="16" rx="3"/>
          <line x1="8" y1="9" x2="16" y2="9"/>
          <line x1="8" y1="13" x2="14" y2="13"/>
          <line x1="8" y1="17" x2="11" y2="17"/>
        </svg>
      `,

      // Bombilla / Propuestas & Presupuestos
      bulb: `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${fillOrStroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 18h6"/>
          <path d="M10 22h4"/>
          <path d="M12 2a7 7 0 0 0-7 7c0 2.6 1.4 4.8 3.5 6h7c2.1-1.2 3.5-3.4 3.5-6a7 7 0 0 0-7-7z"/>
        </svg>
      `,

      // Escudo / Panel de Administración
      shield: `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${fillOrStroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="M9 12l2 2 4-4"/>
        </svg>
      `,

      // Historial / Auditoría
      audit: `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${fillOrStroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="9"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      `,

      // GPS Pin
      pin: `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${fillOrStroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      `,

      // Cámara
      camera: `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${fillOrStroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
          <circle cx="12" cy="13" r="4"/>
        </svg>
      `,

      // Vías y Adoquinado
      road: `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${fillOrStroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <line x1="3" y1="9" x2="21" y2="9"/>
          <line x1="3" y1="15" x2="21" y2="15"/>
          <line x1="9" y1="3" x2="9" y2="9"/>
          <line x1="15" y1="9" x2="15" y2="15"/>
          <line x1="9" y1="15" x2="9" y2="21"/>
        </svg>
      `,

      // Farola / Alumbrado
      lamp: `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${fillOrStroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 2h6l2 5H7l2-5z"/>
          <path d="M12 7v15"/>
          <path d="M8 22h8"/>
          <path d="M5 12l2 1"/>
          <path d="M19 12l-2 1"/>
        </svg>
      `,

      // Limpieza y Barrido
      cleaning: `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${fillOrStroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 2l-7 7"/>
          <path d="M14 7l3 3"/>
          <path d="M12 9l-7 7a3 3 0 0 0 4 4l7-7"/>
          <path d="M3 21l3-3"/>
        </svg>
      `,

      // Residuos y Contenedores
      trash: `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${fillOrStroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          <line x1="10" y1="11" x2="10" y2="17"/>
          <line x1="14" y1="11" x2="14" y2="17"/>
        </svg>
      `,

      // Sendero GR-48 / Dehesa
      trail: `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${fillOrStroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 19c4-1 6-7 10-8s5 4 6 5"/>
          <path d="M4 12c3-1 6-6 10-6s5 3 6 4"/>
          <circle cx="12" cy="4" r="1.5"/>
        </svg>
      `,

      // Parques y Zonas Verdes
      tree: `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${fillOrStroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2L6 10h3l-4 7h14l-4-7h3L12 2z"/>
          <path d="M12 17v5"/>
        </svg>
      `,

      // Agua y Fugas
      water: `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${fillOrStroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
        </svg>
      `,

      // Señalización de Tráfico
      sign: `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${fillOrStroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      `,

      // Ganadería y Cerdo Ibérico
      livestock: `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${fillOrStroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="8"/>
          <circle cx="9" cy="10" r="1.2"/>
          <circle cx="15" cy="10" r="1.2"/>
          <ellipse cx="12" cy="14.5" rx="3" ry="2"/>
          <circle cx="11" cy="14.5" r="0.6"/>
          <circle cx="13" cy="14.5" r="0.6"/>
          <path d="M5.5 6L8 8M18.5 6L16 8"/>
        </svg>
      `,

      // Check / Resuelta
      checkCircle: `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${fillOrStroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      `,

      // Reloj / TMR
      clock: `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${fillOrStroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      `,

      // Operario / Técnico
      tool: `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${fillOrStroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </svg>
      `,

      // Usuario / Perfil
      user: `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${fillOrStroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      `
    };

    return map[name] || map['castle'];
  }
};
