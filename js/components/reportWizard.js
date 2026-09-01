/**
 * CIVITAS / AYUNTAMIENTO DE CUMBRES MAYORES
 * Report Wizard Component (4-Pasos: "Detectar → Ubicar → Informar → Seguir")
 * Con Iconografía Vectorial de Alta Gama
 */

import { store } from '../state/store.js';
import { IncidentService } from '../services/incidentService.js';
import { Security } from '../utils/security.js';
import { Helpers } from '../utils/helpers.js';
import { NotificationService } from '../services/notificationService.js';
import { Icons } from '../utils/icons.js';

export const ReportWizard = {
  currentStep: 1,
  formData: {
    category: 'vias',
    urgency: 'media',
    lat: 38.0623,
    lng: -6.6466,
    address: 'Calle La Portá, Cumbres Mayores',
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
    this.formData.lat = municipality.centerLat || 38.0623;
    this.formData.lng = municipality.centerLng || -6.6466;
    this.formData.address = 'Cumbres Mayores (Huelva)';
    this.formData.images = [];

    this.render(containerId);
  },

  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const categories = store.getState().categories;

    container.innerHTML = `
      <div class="card" style="max-width: 800px; margin: 0 auto;">
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
          <h3 style="margin-bottom: 0.5rem; color:#FFFFFF;">Paso 1: ¿Qué tipo de incidencia has detectado en Cumbres Mayores?</h3>
          <p style="margin-bottom: 1.5rem; font-size: 0.9rem; color:#D4A386;">Selecciona la categoría para dirigir el aviso directamente al operario o departamento correspondiente.</p>
          
          <div class="category-grid" style="margin-bottom: 1.75rem;">
            ${categories.map(cat => `
              <div class="category-card ${this.formData.category === cat.id ? 'selected' : ''}" 
                   onclick="CivitasApp.wizard.selectCategory('${cat.id}')">
                <div class="gem-icon-box">
                  ${Icons.get(cat.iconKey || 'incidents', 22, '#FFAE33')}
                </div>
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

          <div style="display: flex; justify-content: flex-end; margin-top: 2rem;">
            <button type="button" class="btn btn-sunset" onclick="CivitasApp.wizard.goToStep(2)">
              Continuar a Ubicación &rarr;
            </button>
          </div>
        </div>

        <!-- Step 2: Ubicar (Geolocalización GPS y Mapa) -->
        <div class="wizard-step-pane ${this.currentStep === 2 ? 'active' : ''}" id="wizard-step-2">
          <h3 style="margin-bottom: 0.5rem; color:#FFFFFF;">Paso 2: ¿Dónde se encuentra exactamente?</h3>
          <p style="margin-bottom: 1.25rem; font-size: 0.9rem; color:#D4A386;">Arrastra el marcador en el mapa o pulsa el botón para usar el GPS del dispositivo.</p>

          <div style="margin-bottom: 1rem; display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <button type="button" class="btn btn-secondary btn-sm" onclick="CivitasApp.wizard.useCurrentGPS()">
              ${Icons.get('pin', 16, '#FFAE33')} Usar mi Ubicación GPS
            </button>
            <span style="font-size: 0.85rem; color: #D4A386; display: flex; align-items: center;" id="wizard-coords-display">
              📍 Lat: ${this.formData.lat.toFixed(4)}, Lng: ${this.formData.lng.toFixed(4)}
            </span>
          </div>

          <div class="form-group">
            <label class="form-label" for="wizard-address">Dirección o Referencia Local <span class="required">*</span></label>
            <input type="text" id="wizard-address" class="form-control" 
                   value="${this.formData.address}" 
                   oninput="CivitasApp.wizard.formData.address = this.value" />
          </div>

          <div style="height: 280px; border-radius: var(--cm-radius-md); overflow: hidden; margin-bottom: 1.5rem; border: 1.5px solid rgba(255, 159, 56, 0.25);" id="wizard-map"></div>

          <div style="display: flex; justify-content: space-between; margin-top: 1.5rem;">
            <button type="button" class="btn btn-secondary" onclick="CivitasApp.wizard.goToStep(1)">&larr; Atrás</button>
            <button type="button" class="btn btn-sunset" onclick="CivitasApp.wizard.goToStep(3)">Continuar a Detalles &rarr;</button>
          </div>
        </div>

        <!-- Step 3: Informar (Detalles, Fotografías y Captcha) -->
        <div class="wizard-step-pane ${this.currentStep === 3 ? 'active' : ''}" id="wizard-step-3">
          <h3 style="margin-bottom: 0.5rem; color:#FFFFFF;">Paso 3: Describe la incidencia y añade fotos</h3>
          <p style="margin-bottom: 1.25rem; font-size: 0.9rem; color:#D4A386;">Aporta una descripción clara para que el equipo municipal acuda con el material necesario.</p>

          <div class="form-group">
            <label class="form-label" for="wizard-title">Título Resumido <span class="required">*</span></label>
            <input type="text" id="wizard-title" class="form-control" placeholder="Ej: Fuga de agua en fuente de Plaza de España"
                   value="${this.formData.title}" oninput="CivitasApp.wizard.formData.title = this.value" maxlength="100" />
          </div>

          <div class="form-group">
            <label class="form-label" for="wizard-desc">Descripción Detallada <span class="required">*</span></label>
            <textarea id="wizard-desc" class="form-control" placeholder="Explica con detalle el problema, peligrosidad o daños observados..."
                      oninput="CivitasApp.wizard.formData.description = this.value">${this.formData.description}</textarea>
          </div>

          <!-- Photo Uploader -->
          <div class="form-group">
            <label class="form-label">Fotografías o Evidencias (Máx. 3 fotos)</label>
            <div class="photo-uploader" onclick="document.getElementById('wizard-file-input').click()">
              <div class="gem-icon-box" style="margin: 0 auto 0.75rem;">
                ${Icons.get('camera', 24, '#FFAE33')}
              </div>
              <div style="font-weight: 750; font-size: 0.9rem; color: #FFFFFF;">Haz clic o arrastra fotos aquí</div>
              <p style="font-size: 0.75rem; color: #A89082; margin-top: 0.25rem;">Formatos JPG, PNG o WebP (Comprimidas automáticamente)</p>
              <input type="file" id="wizard-file-input" style="display: none;" accept="image/*" multiple onchange="CivitasApp.wizard.handleFileSelect(event)" />
            </div>

            <div class="photo-preview-grid" id="wizard-photo-previews">
              ${this.formData.images.map((img, idx) => `
                <div class="photo-preview-item">
                  <img src="${img}" alt="Preview" />
                  <button type="button" class="photo-remove-btn" onclick="CivitasApp.wizard.removeImage(${idx})">&times;</button>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Captcha Antispam -->
          <div class="card" style="background: rgba(18, 10, 6, 0.9); padding: 1rem; margin-bottom: 1.5rem; border: 1px solid rgba(255, 159, 56, 0.2);">
            <label class="form-label" style="margin-bottom: 0.5rem;">🔒 Verificación Anti-Spam: ¿Cuánto es ${this.currentCaptcha.question}?</label>
            <input type="number" id="wizard-captcha-input" class="form-control" placeholder="Tu respuesta numérica..." style="max-width: 180px;" />
          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 1.5rem;">
            <button type="button" class="btn btn-secondary" onclick="CivitasApp.wizard.goToStep(2)">&larr; Atrás</button>
            <button type="button" class="btn btn-sunset" onclick="CivitasApp.wizard.submitIncident()">
              🚀 Enviar Aviso al Ayuntamiento
            </button>
          </div>
        </div>

        <!-- Step 4: Seguir (Confirmación y Código de Seguimiento) -->
        <div class="wizard-step-pane ${this.currentStep === 4 ? 'active' : ''}" id="wizard-step-4">
          <div id="wizard-confirmation-box" style="text-align: center; padding: 2rem 1rem;">
            <!-- Rendered after submit -->
          </div>
        </div>
      </div>
    `;

    if (this.currentStep === 2) {
      setTimeout(() => this.initMiniMap(), 100);
    }
  },

  selectCategory(categoryId) {
    this.formData.category = categoryId;
    this.render('report-wizard-container');
  },

  selectUrgency(urgency) {
    this.formData.urgency = urgency;
    this.render('report-wizard-container');
  },

  goToStep(step) {
    if (step === 2 && !this.formData.category) {
      NotificationService.showToast('Atención', 'Selecciona una categoría para continuar.', 'warning');
      return;
    }
    if (step === 3 && !this.formData.address) {
      NotificationService.showToast('Atención', 'Indica la ubicación en Cumbres Mayores.', 'warning');
      return;
    }

    this.currentStep = step;
    this.render('report-wizard-container');
  },

  initMiniMap() {
    const mapEl = document.getElementById('wizard-map');
    if (!mapEl) return;

    if (this.miniMap) {
      this.miniMap.remove();
    }

    this.miniMap = L.map('wizard-map').setView([this.formData.lat, this.formData.lng], 16);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; CartoDB &copy; OpenStreetMap'
    }).addTo(this.miniMap);

    const customIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `<div style="background: var(--brand-gradient); width: 28px; height: 28px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 4px 12px rgba(255,122,24,0.6); display: flex; align-items: center; justify-content: center; color: white; font-size: 14px;">📍</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    this.miniMapMarker = L.marker([this.formData.lat, this.formData.lng], {
      draggable: true,
      icon: customIcon
    }).addTo(this.miniMap);

    this.miniMapMarker.on('dragend', (e) => {
      const position = e.target.getLatLng();
      this.formData.lat = position.lat;
      this.formData.lng = position.lng;
      const coordsEl = document.getElementById('wizard-coords-display');
      if (coordsEl) {
        coordsEl.innerText = `📍 Lat: ${position.lat.toFixed(4)}, Lng: ${position.lng.toFixed(4)}`;
      }
    });

    this.miniMap.on('click', (e) => {
      this.formData.lat = e.latlng.lat;
      this.formData.lng = e.latlng.lng;
      this.miniMapMarker.setLatLng(e.latlng);
      const coordsEl = document.getElementById('wizard-coords-display');
      if (coordsEl) {
        coordsEl.innerText = `📍 Lat: ${e.latlng.lat.toFixed(4)}, Lng: ${e.latlng.lng.toFixed(4)}`;
      }
    });
  },

  useCurrentGPS() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.formData.lat = pos.coords.latitude;
          this.formData.lng = pos.coords.longitude;
          if (this.miniMap && this.miniMapMarker) {
            this.miniMap.setView([this.formData.lat, this.formData.lng], 17);
            this.miniMapMarker.setLatLng([this.formData.lat, this.formData.lng]);
          }
          const coordsEl = document.getElementById('wizard-coords-display');
          if (coordsEl) {
            coordsEl.innerText = `📍 Lat: ${this.formData.lat.toFixed(4)}, Lng: ${this.formData.lng.toFixed(4)}`;
          }
          NotificationService.showToast('GPS Fijado', 'Ubicación GPS capturada con precisión.', 'success');
        },
        (err) => {
          NotificationService.showToast('Aviso GPS', 'No se pudo obtener el GPS; usa el mapa.', 'warning');
        }
      );
    }
  },

  handleFileSelect(event) {
    const files = event.target.files;
    if (!files || !files.length) return;

    Array.from(files).slice(0, 3 - this.formData.images.length).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.formData.images.push(e.target.result);
        this.render('report-wizard-container');
      };
      reader.readAsDataURL(file);
    });
  },

  removeImage(index) {
    this.formData.images.splice(index, 1);
    this.render('report-wizard-container');
  },

  submitIncident() {
    const title = this.formData.title ? this.formData.title.trim() : '';
    const desc = this.formData.description ? this.formData.description.trim() : '';
    const captchaInput = document.getElementById('wizard-captcha-input');
    const userCaptcha = captchaInput ? parseInt(captchaInput.value, 10) : null;

    if (!title || !desc) {
      NotificationService.showToast('Faltan Campos', 'Por favor, introduce un título y descripción.', 'warning');
      return;
    }

    if (userCaptcha !== this.currentCaptcha.answer) {
      NotificationService.showToast('Error Anti-Spam', 'Respuesta incorrecta al cálculo de seguridad.', 'error');
      this.currentCaptcha = Security.generateMathCaptcha();
      this.render('report-wizard-container');
      return;
    }

    // Default sample image if none provided
    if (this.formData.images.length === 0) {
      this.formData.images.push('https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=800&auto=format&fit=crop&q=80');
    }

    const created = IncidentService.createIncident({
      title: title,
      description: desc,
      category: this.formData.category,
      urgency: this.formData.urgency,
      lat: this.formData.lat,
      lng: this.formData.lng,
      address: this.formData.address || 'Cumbres Mayores (Huelva)',
      images: this.formData.images
    });

    this.currentStep = 4;
    this.render('report-wizard-container');

    const confirmationBox = document.getElementById('wizard-confirmation-box');
    if (confirmationBox) {
      confirmationBox.innerHTML = `
        <div class="gem-icon-box gem-lg" style="margin: 0 auto 1.25rem;">
          ${Icons.get('checkCircle', 32, '#6EE7B7')}
        </div>
        <h2 style="margin-bottom: 0.5rem; color:#FFFFFF;">¡Aviso Registrado con Éxito!</h2>
        <p style="color: #D4A386; max-width: 540px; margin: 0 auto 1.5rem;">
          Tu comunicación ha sido trasladada al equipo municipal de Cumbres Mayores para su inspección inmediata.
        </p>

        <div style="background: rgba(18, 10, 6, 0.9); border: 1.5px solid rgba(255, 159, 56, 0.3); border-radius: var(--cm-radius-md); padding: 1.25rem; max-width: 420px; margin: 0 auto 2rem;">
          <div style="font-size: 0.8rem; color: #A89082; text-transform: uppercase; font-weight: 750;">Código Único de Seguimiento</div>
          <div style="font-size: 1.85rem; font-weight: 850; font-family: var(--cm-font-mono); color: #FFAE33; margin: 0.35rem 0;">
            ${created.trackingCode}
          </div>
          <div style="font-size: 0.775rem; color: #D4A386;">Guarda este código para consultar el estado en cualquier momento.</div>
        </div>

        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <button type="button" class="btn btn-primary" onclick="CivitasApp.openIncidentDetail('${created.id}')">
            Ver Detalle del Aviso
          </button>
          <button type="button" class="btn btn-secondary" onclick="CivitasApp.navigateTo('map')">
            Ver en el Plano
          </button>
          <button type="button" class="btn btn-secondary" onclick="CivitasApp.navigateTo('home')">
            Volver al Inicio
          </button>
        </div>
      `;
    }
  }
};
