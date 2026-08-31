# 🏛️ Civitas — Plataforma Municipal de Incidencias y Participación Ciudadana

Plataforma cívica digital moderna, segura y escalable diseñada para conectar ciudadanos y Ayuntamientos en un único espacio para comunicar incidencias en la vía pública, realizar propuestas vecinales (presupuestos participativos) y consultar en tiempo real las actuaciones municipales.

---

## 🌟 Características Principales

- **Flujo Ciudadano Express ("Detectar → Ubicar → Informar → Seguir")**:
  - Asistente guiado en 4 pasos con selección visual de categorías (Limpieza, Alumbrado, Vías, Residuos, Parques, Mobiliario, Señalización, Agua, Ruido, Animales).
  - Geolocalización GPS automática con mapa interactivo y arrastre de chincheta.
  - **Detección inteligente de duplicados (<50m)** con adhesión ciudadana en 1 clic (*"A mí también me afecta"*).
  - Subida de hasta 3 fotografías con previsualización y compresión en cliente.
  - Validación de seguridad anti-bot mediante trampa *Honeypot* y Captcha matemático accesible.
  - Código único de seguimiento (`CIV-2026-XXXXX`) y timeline de evolución del estado.

- **Presupuestos Participativos y Sugerencias**:
  - Publicación de propuestas vecinales categorizadas.
  - Sistema de votación transparente (1 ciudadano = 1 voto).
  - Dictamen institucional y conversión de propuestas aprobadas en actuaciones municipales.

- **Panel de Gestión y Backoffice Municipal**:
  - Cuadro de mandos con KPIs en tiempo real (Tasa de resolución, TMR - Tiempo Medio de Resolución en horas).
  - Tablero de trabajo interactivo **Kanban** y lista filtrable por estado, urgencia y departamento.
  - Asignación técnica a departamentos y operarios específicos.
  - Subida de evidencias fotográficas de resolución.
  - Registro de **auditoría y trazabilidad inmutable** conforme a RGPD y ENS.

- **Módulo Geoespacial & Mapas de Calor**:
  - Mapa interactivo con Leaflet y OpenStreetMap.
  - Marcadores clasificados por estado y categoría.
  - Modo alternable de **Mapa de Calor (Heatmap)** con gradiente según prioridad y gravedad.

- **Diseño, Accesibilidad y PWA**:
  - Modo Claro y Modo Oscuro nativo con detección de preferencias del sistema.
  - Cumplimiento de accesibilidad **WCAG 2.2 nivel AA** (navegación por teclado, foco visible, skip-links, lectores de pantalla).
  - Progressive Web App (PWA) instalable con **Service Worker** y soporte offline.
  - Internacionalización i18n extensible (Español, Inglés, Català).

---

## 🏗️ Arquitectura del Sistema

```
aytocm/
├── index.html                      # Aplicación Principal SPA Responsive
├── manifest.json                   # Manifiesto PWA (Instalable)
├── sw.js                           # Service Worker & Caché Offline
├── css/
│   ├── variables.css               # Paleta de colores, tokens y temas claro/oscuro
│   ├── base.css                    # Resets, tipografía, utilidades y WCAG 2.2 AA
│   ├── components.css              # Botones, cards, badges, modales, timeline, toasts
│   ├── layout.css                  # Header, barra de roles, navegación móvil y footer
│   └── views.css                   # Vistas del asistente, mapas, tablero Kanban y feed
├── js/
│   ├── app.js                      # Controlador principal SPA, enrutador y listeners
│   ├── state/
│   │   ├── store.js                # Estado central reactivo con persistencia local
│   │   └── mockData.js             # Dataset realista de demostración
│   ├── services/
│   │   ├── authService.js          # Control de acceso y sesiones RBAC
│   │   ├── incidentService.js      # CRUD, cálculo de prioridad, deduplicador <50m
│   │   ├── suggestionService.js    # Propuestas vecinales y votaciones
│   │   ├── notificationService.js  # Avisos in-app y notificaciones toast
│   │   └── auditService.js         # Registro de auditoría inmutable
│   ├── components/
│   │   ├── mapComponent.js         # Mapa Leaflet con marcadores y Heatmap
│   │   ├── reportWizard.js         # Asistente 4 pasos ("Detectar → Ubicar → Informar → Seguir")
│   │   ├── adminDashboard.js       # Panel municipal con KPIs, Kanban y asignaciones
│   │   ├── suggestionBoard.js      # Muro de sugerencias ciudadanas y votación
│   │   └── auditViewer.js          # Visor de trazas y seguridad
│   └── utils/
│       ├── helpers.js              # Haversine, fechas relativas, compresor de fotos
│       ├── security.js             # Sanitización XSS, honeypot y captcha matemático
│       └── i18n.js                 # Motor de traducción multi-idioma
├── backend-spring/                 # Arquitectura completa Spring Boot 3.2 / Java 21
│   ├── pom.xml                     # Maven con JPA, Hibernate Spatial, PostGIS, Security, JWT
│   ├── src/main/java/com/civitas/
│   │   ├── CivitasApplication.java
│   │   ├── config/SecurityConfig.java
│   │   ├── controllers/IncidentController.java
│   │   ├── models/ (Incident, Suggestion, User)
│   │   └── repositories/ (IncidentRepository con ST_DWithin)
│   └── src/main/resources/
│       ├── application.yml         # Configuración multi-entorno
│       └── schema.sql              # Script DDL PostgreSQL + PostGIS
└── docs/
    ├── ARCHITECTURE.md             # Arquitectura, algoritmos de prioridad y deduplicación
    └── DEPLOYMENT.md               # Despliegue con Docker Compose y variables de entorno
```

---

## 🚦 Despliegue Rápido con Docker Compose

```bash
# Iniciar servicios con Docker Compose (PostgreSQL PostGIS + Backend Spring + Frontend Nginx)
docker compose up -d

# Visualizar la plataforma en el navegador
http://localhost:8080/index.html
```

---

## 🔒 Seguridad y Privacidad
- **RGPD**: Minimización de datos y anonimización de ciudadanos en consultas públicas.
- **OWASP**: Sanitización contra XSS, protección CSRF, Honeypot y control de acceso RBAC.
- **Cifrado**: Contraseñas procesadas mediante **BCrypt (factor 12)**.

---

## 📄 Licencia
Este proyecto está bajo la Licencia MIT.
