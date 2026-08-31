# 🏰 Ayuntamiento de Cumbres Mayores — Plataforma Municipal de Incidencias y Participación Ciudadana

Aplicación municipal oficial diseñada a medida para el **Ayuntamiento de Cumbres Mayores (Huelva)**, en el corazón del **Parque Natural Sierra de Aracena y Picos de Aroche**.

Permite a los vecinos y visitantes comunicar incidencias urbanas y rurales (casco histórico, Castillo de Sancho IV, senderos GR-48 y dehesas comunales), participar en presupuestos vecinales y consultar en tiempo real las actuaciones de los operarios municipales.

---

## 📍 Datos del Municipio

- **Municipio:** Cumbres Mayores
- **Provincia:** Huelva (Andalucía)
- **Entorno:** Parque Natural Sierra de Aracena y Picos de Aroche
- **Código Postal:** 21380
- **Sede del Ayuntamiento:** Plaza de España, 1, 21380 Cumbres Mayores (Huelva)
- **Teléfonos:** 959 710 001 / 959 710 026
- **Email:** ayuntamiento@cumbresmayores.es
- **Coordenadas Geográficas:** Lat: `38.0623`, Lng: `-6.6466`

---

## 🌟 Módulos y Funcionalidades Adaptadas

1. **Asistente de Incidencias en 4 Pasos ("Detectar → Ubicar → Informar → Seguir")**:
   - Categorías específicas: Adoquinado y Vías, Alumbrado, Patrimonio (Castillo de Sancho IV y Ermitas), Caminos Rurales y Dehesa (GR-48), Parques (Paseo de Andalucía), Red de Agua y Fuentes, Residuos e Industria Cárnica, Señalización y Ganadería.
   - Geolocalización GPS automática sobre el callejero y senderos de Cumbres Mayores.
   - **Detección inteligente de incidencias duplicadas (<50m)** con opción de sumarse (*"A mí también me afecta"*).
   - Subida de fotografías con compresión en cliente y seguridad anti-bot (Honeypot + Captcha).
   - Código único de seguimiento con prefijo municipal (`CM-2026-XXXXX`).

2. **Propuestas y Presupuestos Participativos**:
   - Propuestas vecinales (iluminación del castillo, señalización de crómlech y menhires, mejoras en senderos ganaderos y polígono cárnico).
   - Votación popular (1 vecino = 1 voto) y dictámenes oficiales de la Concejalía.

3. **Plano y Mapa de Calor Geoespacial**:
   - Cartografía interactiva sobre OpenStreetMap centrada en Cumbres Mayores.
   - Alternador dinámico a **Mapa de Calor (Heatmap)** para visualizar concentraciones de avisos.

4. **Panel de Gestión y Operarios Municipales**:
   - Cuadro de mandos con KPIs en tiempo real (Tasa de resolución %, TMR en horas).
   - Tablero **Kanban** de asignación técnica por departamento y operario.
   - Registro de fotos de resolución (antes/después) y notas técnicas.
   - **Registro de auditoría inmutable** conforme a RGPD y ENS.

5. **PWA Instalable y Accesibilidad**:
   - Modo Claro y Oscuro nativo.
   - Accesibilidad **WCAG 2.2 AA**.
   - Funcionamiento sin conexión (Offline) mediante **Service Worker**.

---

## 🏗️ Estructura del Repositorio

```
aytocm/
├── index.html                      # Portal SPA Cumbres Mayores
├── manifest.json                   # Manifiesto PWA
├── sw.js                           # Service Worker y Caché Offline
├── css/                            # Arquitectura CSS (Variables, Base, Componentes, Layout, Vistas)
├── js/                             # Controladores, Servicios, Componentes y Datos de Cumbres Mayores
├── backend-spring/                 # Backend REST Spring Boot 3.2 + PostGIS (Geometría Point y ST_DWithin)
└── docs/                           # Documentación técnica, arquitectura y guía de despliegue
```

---

## 🚀 Puesta en Marcha Rápida

```bash
# Iniciar servidor local o contenedor
python -m http.server 8080

# Abrir en el navegador
http://localhost:8080/index.html
```

---

## 🔒 Privacidad y Cumplimiento
Conforme al RGPD y la LOPDGDD, los datos de contacto de los vecinos permanecen protegidos y anonimizados en las consultas públicas.
