/**
 * CIVITAS - Report Wizard Component
 * 4-Step Guided Flow: "Detectar → Ubicar → Informar → Seguir"
 */

import { store } from '../state/store.js';
import { IncidentService } from '../services/incidentService.js';
import { Security } from '../utils/security.js';
import { Helpers } from '../utils/helpers.js';
import { NotificationService } from '../services/notificationService.js';

export const ReportWizard = {
  currentStep: 1,
  formData: {
    category: 'limpieza',
    urgency: 'media',
    lat: 37.6742,
    lng: -5.9892,
    address: '',
    title: '',
    description: '',
    images: []
  },
  miniMap: null,
  miniMapMarker: null,
  currentCaptcha: null,

  init(containerId = 'report-wizard-container') {
    this.currentStep = 1;
    this.currentCaptcha = Security.generateMathCaptcha();
    const municipality = store.getCurrentMunicipality();
    this.formData.lat = municipality.centerLat;
    this.formData.lng = municipality.centerLng;
    this.formData.address = municipality.name;
    this.formData.images = [];

    this.render(containerId);
  },

  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const categories = store.getState().categories;

    container.innerHTML = `
      <div class="card" style="max-width: 780px; margin: 0 auto;">
        <!-- Progress Stepper -->
        <div class="wizard-progress">
          <div class="wizard-step-node ${this.currentStep === 1 ? 'active' : (this.currentStep > 1 ? 'completed' : '')}" onclick="CivitasApp.wizard.goToStep(1)">
            <div class="wizard-node-circle">1</div>
            <span class="wizard-node-label">Detectar</span>
          </div>
          <div class="wizard-step-node ${this.currentStep === 2 ? 'active' : (this.currentStep > 2 ? 'completed' : '')}" onclick="CivitasApp.wizard.goToStep(2)">
            <div class="wizard-node-circle">2</div>
            <span class="wizard-node-label">Ubicar</span>
          </div>
          <div class="wizard-step-node ${this.currentStep === 3 ? 'active' : (this.currentStep > 3 ? 'completed' : '')}" onclick="CivitasApp.wizard.goToStep(3)">
            <div class="wizard-node-circle">3</div>
            <span class="wizard-node-label">Informar</span>
          </div>
          <div class="wizard-step-node ${this.currentStep === 4 ? 'active' : ''}">
            <div class="wizard-node-circle">4</div>
            <span class="wizard-node-label">Seguir</span>
          </div>
        </div>

        <!-- Step 1: Detectar (Categoría y Urgencia) -->
        <div class="wizard-step-pane ${this.currentStep === 1 ? 'active' : ''}" id="wizard-step-1">
          <h3 style="margin-bottom: 0.5rem;">Paso 1: ¿Qué tipo de incidencia has detectado?</h3>
          <p style="margin-bottom: 1.25rem; font-size: 0.9rem;">Selecciona la categoría que mejor describa la situación para dirigirla al equipo técnico adecuado.</p>
          
          <div class="category-grid" style="margin-bottom: 1.5rem;">
            ${categories.map(cat => `
              <div class="category-card ${this.formData.category === cat.id ? 'selected' : ''}" 
                   onclick="CivitasApp.wizard.selectCategory('${cat.id}')">
                <span class="category-icon">${cat.icon}</span>
                <span>${cat.name}</span>
              </div>
            `).join('')}
          </div>

          <div class="form-group">
            <label class="form-label">Nivel de Urgencia Estimado</label>
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              ${['baja', 'media', 'alta', 'urgente'].map(u => `
                <button type="button" class="btn btn-sm ${this.formData.urgency === u ? 'btn-primary' : 'btn-secondary'}"
                        onclick="CivitasApp.wizard.selectUrgency('${u}')" style="text-transform: capitalize;">
                  ${u}
                </button>
              `).join('')}
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; margin-top: 1.5rem;">
            <button type="button" class="btn btn-primary btn-lg" onclick="CivitasApp.wizard.nextStep()">
              Siguiente: Ubicar en el Mapa &rarr;
            </button>
          </div>
        </div>

        <!-- Step 2: Ubicar (GPS & Mapa) -->
        <div class="wizard-step-pane ${this.currentStep === 2 ? 'active' : ''}" id="wizard-step-2">
          <h3 style="margin-bottom: 0.5rem;">Paso 2: ¿Dónde se encuentra la incidencia?</h3>
          <p style="margin-bottom: 1rem; font-size: 0.9rem;">Usa tu ubicación actual con un clic o arrastra el marcador sobre el mapa.</p>

          <div style="display: flex; gap: 0.75rem; margin-bottom: 1rem;">
            <button type="button" class="btn btn-secondary" onclick="CivitasApp.wizard.requestGeolocation()">
              📍 Usar Mi Ubicación GPS Actual
            </button>
            <input type="text" id="wizard-address-input" class="form-control" placeholder="Dirección o punto de referencia..." 
                   value="${this.formData.address}" oninput="CivitasApp.wizard.formData.address = this.value" />
          </div>

          <div id="wizard-mini-map" style="height: 280px; border-radius: var(--civ-radius-md); border: 1px solid var(--border-subtle); margin-bottom: 1.5rem;"></div>

          <div id="wizard-duplicate-alert" style="display: none;"></div>

          <div style="display: flex; justify-content: space-between; margin-top: 1.5rem;">
            <button type="button" class="btn btn-secondary" onclick="CivitasApp.wizard.prevStep()">&larr; Volver</button>
            <button type="button" class="btn btn-primary" onclick="CivitasApp.wizard.checkDuplicatesAndProceed()">
              Siguiente: Describir y Fotos &rarr;
            </button>
          </div>
        </div>

        <!-- Step 3: Informar (Detalles, Fotos & Captcha) -->
        <div class="wizard-step-pane ${this.currentStep === 3 ? 'active' : ''}" id="wizard-step-3">
          <h3 style="margin-bottom: 0.5rem;">Paso 3: Describe los detalles y adjunta fotos</h3>
          <p style="margin-bottom: 1.25rem; font-size: 0.9rem;">Una descripción clara y una fotografía ayudan a resolver el problema mucho más rápido.</p>

          <div class="form-group">
            <label class="form-label" for="wizard-title">Título breve <span class="required">*</span></label>
            <input type="text" id="wizard-title" class="form-control" placeholder="Ej: Rotura de tubería con fuga de agua en acera" 
                   value="${this.formData.title}" oninput="CivitasApp.wizard.formData.title = this.value" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="wizard-desc">Descripción detallada <span class="required">*</span></label>
            <textarea id="wizard-desc" class="form-control" placeholder="Explica la situación, peligros o detalles relevantes..." 
                      oninput="CivitasApp.wizard.formData.description = this.value" required>${this.formData.description}</textarea>
          </div>

          <!-- Photo Upload Area -->
          <div class="form-group">
            <label class="form-label">Fotografías o Evidencias</label>
            <div class="photo-uploader" onclick="document.getElementById('wizard-photo-input').click()">
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">📷</div>
              <p style="font-weight: 600; color: var(--brand-primary); margin-bottom: 0.25rem;">Haz clic para subir fotos o captura desde el móvil</p>
              <p style="font-size: 0.8rem; color: var(--text-muted);">Formatos admitidos: JPG, PNG, WEBP (hasta 3 fotos)</p>
              <input type="file" id="wizard-photo-input" accept="image/*" multiple style="display: none;" onchange="CivitasApp.wizard.handlePhotoUpload(event)" />
            </div>

            <div class="photo-preview-grid" id="wizard-photo-previews">
              ${this.formData.images.map((img, idx) => `
                <div class="photo-preview-item">
                  <img src="${img}" alt="Preview ${idx + 1}" />
                  <button type="button" class="photo-remove-btn" onclick="CivitasApp.wizard.removePhoto(${idx})">&times;</button>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Anti-bot Math Captcha & Honeypot -->
          <div style="background-color: var(--bg-surface-subtle); padding: 1rem; border-radius: var(--civ-radius-md); border: 1px solid var(--border-subtle); margin: 1.5rem 0;">
            <label class="form-label" for="wizard-captcha">Seguridad Anti-Bot: ${this.currentCaptcha.question} <span class="required">*</span></label>
            <input type="number" id="wizard-captcha" class="form-control" style="max-width: 140px;" placeholder="Tu respuesta" required />
            <input type="text" id="wizard-honeypot" style="display: none;" tabindex="-1" autocomplete="off" />
          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 1.5rem;">
            <button type="button" class="btn btn-secondary" onclick="CivitasApp.wizard.prevStep()">&larr; Volver</button>
            <button type="button" class="btn btn-emerald btn-lg" onclick="CivitasApp.wizard.submitReport()">
              🚀 Enviar Incidencia al Ayuntamiento
            </button>
          </div>
        </div>

        <!-- Step 4: Seguir (Éxito & Seguimiento) -->
        <div class="wizard-step-pane ${this.currentStep === 4 ? 'active' : ''}" id="wizard-step-4">
          <div style="text-align: center; padding: 2rem 1rem;">
            <div style="font-size: 3.5rem; margin-bottom: 1rem;">🎉</div>
            <h2 style="color: var(--civ-emerald-600); margin-bottom: 0.5rem;">¡Incidencia Registrada con Éxito!</h2>
            <p style="margin-bottom: 1.5rem;">Tu comunicación ha sido enviada al departamento competente del Ayuntamiento.</p>

            <div style="background-color: var(--bg-surface-subtle); border: 2px dashed var(--brand-primary); border-radius: var(--civ-radius-lg); padding: 1.5rem; max-width: 420px; margin: 0 auto 2rem;">
              <span style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Código Único de Seguimiento</span>
              <div style="font-size: 1.8rem; font-weight: 800; color: var(--brand-primary); letter-spacing: 0.05em; margin: 0.5rem 0;" id="wizard-success-code">-</div>
              <p style="font-size: 0.8rem; color: var(--text-secondary);">Guarda este código para consultar la evolución y actuaciones de los operarios.</p>
            </div>

            <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
              <button type="button" class="btn btn-primary" onclick="CivitasApp.navigateTo('incidents')">
                📋 Ver Mis Incidencias
              </button>
              <button type="button" class="btn btn-secondary" onclick="CivitasApp.wizard.init()">
                ➕ Reportar Otra Incidencia
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    if (this.currentStep === 2) {
      setTimeout(() => this.initMiniMap(), 100);
    }
  },

  selectCategory(catId) {
    this.formData.category = catId;
    this.render('report-wizard-container');
  },

  selectUrgency(urgency) {
    this.formData.urgency = urgency;
    this.render('report-wizard-container');
  },

  goToStep(step) {
    if (step < this.currentStep) {
      this.currentStep = step;
      this.render('report-wizard-container');
    }
  },

  nextStep() {
    this.currentStep++;
    this.render('report-wizard-container');
  },

  prevStep() {
    this.currentStep = Math.max(this.currentStep - 1, 1);
    this.render('report-wizard-container');
  },

  initMiniMap() {
    const mapEl = document.getElementById('wizard-mini-map');
    if (!mapEl || typeof L === 'undefined') return;

    if (this.miniMap) {
      this.miniMap.remove();
    }

    this.miniMap = L.map('wizard-mini-map', {
      zoomControl: true,
      attributionControl: false
    }).setView([this.formData.lat, this.formData.lng], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(this.miniMap);

    this.miniMapMarker = L.marker([this.formData.lat, this.formData.lng], {
      draggable: true
    }).addTo(this.miniMap);

    this.miniMapMarker.on('dragend', (e) => {
      const pos = e.target.getLatLng();
      this.formData.lat = pos.lat;
      this.formData.lng = pos.lng;
      this.checkForDuplicates();
    });

    this.miniMap.on('click', (e) => {
      this.formData.lat = e.latlng.lat;
      this.formData.lng = e.latlng.lng;
      this.miniMapMarker.setLatLng(e.latlng);
      this.checkForDuplicates();
    });
  },

  requestGeolocation() {
    if ('geolocation' in navigator) {
      NotificationService.showToast('Localizando...', 'Obteniendo coordenadas GPS de tu dispositivo', 'info');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.formData.lat = pos.coords.latitude;
          this.formData.lng = pos.coords.longitude;
          if (this.miniMap && this.miniMapMarker) {
            this.miniMap.setView([this.formData.lat, this.formData.lng], 17);
            this.miniMapMarker.setLatLng([this.formData.lat, this.formData.lng]);
          }
          this.formData.address = `GPS: ${this.formData.lat.toFixed(5)}, ${this.formData.lng.toFixed(5)}`;
          const addrInput = document.getElementById('wizard-address-input');
          if (addrInput) addrInput.value = this.formData.address;
          NotificationService.showToast('Ubicación Detectada', 'Se ha fijado el punto GPS en el mapa', 'success');
          this.checkForDuplicates();
        },
        (err) => {
          console.warn('Geolocation error', err);
          NotificationService.showToast('Aviso de Ubicación', 'No se pudo acceder al GPS. Puedes marcar el punto manualmente.', 'warning');
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    }
  },

  checkForDuplicates() {
    const duplicates = IncidentService.findDuplicates(this.formData.lat, this.formData.lng, this.formData.category, 60);
    const alertBox = document.getElementById('wizard-duplicate-alert');
    if (!alertBox) return duplicates;

    if (duplicates.length > 0) {
      const topMatch = duplicates[0].incident;
      alertBox.style.display = 'block';
      alertBox.innerHTML = `
        <div class="duplicate-alert-banner">
          <div style="font-size: 1.75rem;">⚠️</div>
          <div style="flex: 1;">
            <strong style="color: var(--civ-amber-600); font-size: 0.95rem;">Posible incidencia duplicada detectada</strong>
            <p style="font-size: 0.85rem; margin: 0.25rem 0;">Ya existe un aviso muy similar a ${duplicates[0].distanceMeters}m: <strong>"${topMatch.title}"</strong> (${topMatch.trackingCode}).</p>
            <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
              <button type="button" class="btn btn-sm btn-primary" onclick="CivitasApp.wizard.joinExistingIncident('${topMatch.id}')">
                👍 Sumarme a este aviso ("A mí también me afecta")
              </button>
              <button type="button" class="btn btn-sm btn-secondary" onclick="document.getElementById('wizard-duplicate-alert').style.display='none'">
                Continuar con nuevo reporte
              </button>
            </div>
          </div>
        </div>
      `;
    } else {
      alertBox.style.display = 'none';
    }

    return duplicates;
  },

  joinExistingIncident(incidentId) {
    IncidentService.addAdherent(incidentId);
    CivitasApp.navigateTo('incidents');
  },

  checkDuplicatesAndProceed() {
    this.checkForDuplicates();
    this.nextStep();
  },

  async handlePhotoUpload(event) {
    const files = event.target.files;
    if (!files || !files.length) return;

    for (let i = 0; i < Math.min(files.length, 3 - this.formData.images.length); i++) {
      try {
        const compressedBase64 = await Helpers.compressImageToBase64(files[i]);
        this.formData.images.push(compressedBase64);
      } catch (err) {
        console.error('Error compressing image', err);
      }
    }

    this.render('report-wizard-container');
  },

  removePhoto(index) {
    this.formData.images.splice(index, 1);
    this.render('report-wizard-container');
  },

  submitReport() {
    const title = this.formData.title.trim();
    const desc = this.formData.description.trim();
    const captchaInput = document.getElementById('wizard-captcha');
    const honeypotInput = document.getElementById('wizard-honeypot');

    if (!title) {
      NotificationService.showToast('Campo Requerido', 'Por favor, introduce un título breve', 'warning');
      return;
    }

    if (!desc) {
      NotificationService.showToast('Campo Requerido', 'Por favor, describe la incidencia', 'warning');
      return;
    }

    // Anti-bot validations
    if (honeypotInput && !Security.verifyHoneypot(honeypotInput.value)) {
      console.warn('Bot detected via honeypot');
      return;
    }

    if (!captchaInput || parseInt(captchaInput.value, 10) !== this.currentCaptcha.expectedAnswer) {
      NotificationService.showToast('Verificación Incorrecta', 'Por favor, resuelve correctamente la pregunta anti-bot', 'error');
      this.currentCaptcha = Security.generateMathCaptcha();
      this.render('report-wizard-container');
      return;
    }

    const newInc = IncidentService.createIncident({
      title: title,
      description: desc,
      category: this.formData.category,
      urgency: this.formData.urgency,
      lat: this.formData.lat,
      lng: this.formData.lng,
      address: this.formData.address,
      images: this.formData.images
    });

    this.currentStep = 4;
    this.render('report-wizard-container');
    const codeEl = document.getElementById('wizard-success-code');
    if (codeEl) codeEl.textContent = newInc.trackingCode;
  }
};
