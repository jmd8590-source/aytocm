/**
 * CIVITAS / AYUNTAMIENTO DE CUMBRES MAYORES
 * Report Wizard Component (4-Pasos: "Detectar → Ubicar → Informar → Seguir")
 * Con selección de calles y número aproximado, mapa sincronizado y verificación anti-spam 100% fiable.
 */

import { store } from '../state/store.js';
import { IncidentService } from '../services/incidentService.js';
import { Security } from '../utils/security.js';
import { Helpers } from '../utils/helpers.js';
import { NotificationService } from '../services/notificationService.js';
import { Icons } from '../utils/icons.js';

export const CumbresMayoresStreets = [
  { name: 'Calle La Portá', lat: 38.0628, lng: -6.6459 },
  { name: 'Calle Abades', lat: 38.0620, lng: -6.6462 },
  { name: 'Plaza de España (Ayuntamiento / Centro)', lat: 38.0623, lng: -6.6466 },
  { name: 'Paseo de Andalucía', lat: 38.0635, lng: -6.6450 },
  { name: 'Plaza del Castillo de Sancho IV', lat: 38.0619, lng: -6.6475 },
  { name: 'Calle San Antón', lat: 38.0615, lng: -6.6455 },
  { name: 'Calle Nueva', lat: 38.0632, lng: -6.6470 },
  { name: 'Calle Dehesa', lat: 38.0640, lng: -6.6480 },
  { name: 'Calle San Roque', lat: 38.0610, lng: -6.6445 },
  { name: 'Calle Cantarranas', lat: 38.0625, lng: -6.6482 },
  { name: 'Calle Mesones', lat: 38.0618, lng: -6.6458 },
  { name: 'Calle Real', lat: 38.0621, lng: -6.6468 },
  { name: 'Ermita de la Esperanza / Sendero GR-48', lat: 38.0655, lng: -6.6490 },
  { name: 'Ermita del Amparo', lat: 38.0605, lng: -6.6430 },
  { name: 'Polígono Cárnico del Ibérico', lat: 38.0580, lng: -6.6410 },
  { name: 'Otra calle o vía del término municipal', lat: 38.0623, lng: -6.6466 }
];

export const ReportWizard = {
  currentStep: 1,
  formData: {
    category: 'vias',
    urgency: 'media',
    street: 'Calle La Portá',
    customStreet: '',
    streetNumber: '',
    referencePoint: '',
    address: 'Calle La Portá, Cumbres Mayores',
    lat: 38.0628,
    lng: -6.6459,
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
    
    // Default location to Calle La Portá
    this.formData.street = 'Calle La Portá';
    this.formData.customStreet = '';
    this.formData.streetNumber = '';
    this.formData.referencePoint = '';
    this.formData.lat = 38.0628;
    this.formData.lng = -6.6459;
    this.formData.address = 'Calle La Portá, Cumbres Mayores';
    this.formData.images = [];

    this.render(containerId);
  },

  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const categories = store.getState().categories;

    container.innerHTML = `
      <div class="card" style="max-width: 820px; margin: 0 auto;">
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

        <!-- Step 2: Ubicar (Calle, Número Aproximado y Mapa de Apoyo) -->
        <div class="wizard-step-pane ${this.currentStep === 2 ? 'active' : ''}" id="wizard-step-2">
          <h3 style="margin-bottom: 0.5rem; color:#FFFFFF;">Paso 2: ¿Dónde se encuentra la avería o incidencia?</h3>
          <p style="margin-bottom: 1.5rem; font-size: 0.9rem; color:#D4A386;">Indica la calle y el número o referencia más aproximada para que los operarios la localicen rápidamente.</p>

          <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 1rem; margin-bottom: 1rem;">
            <!-- Calle Selector -->
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" for="wizard-street-select">
                <span>📍 Calle o Lugar Principal <span class="required">*</span></span>
              </label>
              <select id="wizard-street-select" class="form-control" onchange="CivitasApp.wizard.handleStreetChange(this.value)">
                ${CumbresMayoresStreets.map(s => `
                  <option value="${s.name}" ${this.formData.street === s.name ? 'selected' : ''}>
                    ${s.name}
                  </option>
                `).join('')}
              </select>
            </div>

            <!-- Número Aproximado -->
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" for="wizard-street-number">
                <span>🔢 Número aproximado / Altura</span>
              </label>
              <input type="text" id="wizard-street-number" class="form-control" 
                     placeholder="Ej: Nº 14, Frente al 8, S/N..." 
                     value="${this.formData.streetNumber}" 
                     oninput="CivitasApp.wizard.handleNumberChange(this.value)" />
            </div>
          </div>

          <!-- Si selecciona 'Otra calle' -->
          <div class="form-group" id="wizard-custom-street-group" style="display: ${this.formData.street === 'Otra calle o vía del término municipal' ? 'block' : 'none'};">
            <label class="form-label" for="wizard-custom-street">Escribe el nombre de la calle, camino o paraje</label>
            <input type="text" id="wizard-custom-street" class="form-control" 
                   placeholder="Ej: Camino de las Cruces, Paraje de la Dehesa..." 
                   value="${this.formData.customStreet}" 
                   oninput="CivitasApp.wizard.handleCustomStreetChange(this.value)" />
          </div>

          <!-- Punto de Referencia Adicional -->
          <div class="form-group">
            <label class="form-label" for="wizard-ref-point">Punto de referencia o detalle adicional (Opcional)</label>
            <input type="text" id="wizard-ref-point" class="form-control" 
                   placeholder="Ej: Junto a la fuente de piedra, frente a la farmacia, acera izquierda..." 
                   value="${this.formData.referencePoint}" 
                   oninput="CivitasApp.wizard.handleRefChange(this.value)" />
          </div>

          <!-- Dirección Generada en Tiempo Real -->
          <div style="background: rgba(30, 18, 11, 0.9); border: 1.5px solid rgba(255, 159, 56, 0.35); border-radius: var(--cm-radius-md); padding: 0.85rem 1.15rem; margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
            <div>
              <div style="font-size: 0.75rem; color: #A89082; text-transform: uppercase; font-weight: 750;">Dirección Completa Registrada:</div>
              <strong style="color: #FFBE6B; font-size: 0.95rem;" id="wizard-full-address-text">${this.composeFullAddress()}</strong>
            </div>
            <button type="button" class="btn btn-secondary btn-sm" onclick="CivitasApp.wizard.useCurrentGPS()">
              ${Icons.get('pin', 16, '#FFAE33')} Fijar con mi GPS
            </button>
          </div>

          <!-- Mapa de Apoyo Visual -->
          <div style="margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
            <label class="form-label" style="margin-bottom: 0;">🗺️ Plano de Apoyo Visual (Cumbres Mayores)</label>
            <span style="font-size: 0.75rem; color: #A89082;">Puedes ajustar el pin si lo deseas</span>
          </div>
          <div style="height: 240px; border-radius: var(--cm-radius-md); overflow: hidden; margin-bottom: 1.5rem; border: 1.5px solid rgba(255, 159, 56, 0.25);" id="wizard-map"></div>

          <div style="display: flex; justify-content: space-between; margin-top: 1.5rem;">
            <button type="button" class="btn btn-secondary" onclick="CivitasApp.wizard.goToStep(1)">&larr; Atrás</button>
            <button type="button" class="btn btn-sunset" onclick="CivitasApp.wizard.goToStep(3)">Continuar a Descripción y Fotos &rarr;</button>
          </div>
        </div>

        <!-- Step 3: Informar (Detalles, Fotografías y Verificación Anti-Spam Fiable) -->
        <div class="wizard-step-pane ${this.currentStep === 3 ? 'active' : ''}" id="wizard-step-3">
          <h3 style="margin-bottom: 0.5rem; color:#FFFFFF;">Paso 3: Describe la incidencia y añade fotos</h3>
          <p style="margin-bottom: 1.25rem; font-size: 0.9rem; color:#D4A386;">Aporta una descripción clara para que el equipo municipal acuda con el material necesario.</p>

          <div class="form-group">
            <label class="form-label" for="wizard-title">Título Resumido del Aviso <span class="required">*</span></label>
            <input type="text" id="wizard-title" class="form-control" placeholder="Ej: Adoquines levantados o farola fundida"
                   value="${this.formData.title}" oninput="CivitasApp.wizard.formData.title = this.value" maxlength="100" />
          </div>

          <div class="form-group">
            <label class="form-label" for="wizard-desc">Descripción Detallada <span class="required">*</span></label>
            <textarea id="wizard-desc" class="form-control" placeholder="Explica con detalle el problema, peligrosidad o desperfectos observados..."
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
              <p style="font-size: 0.75rem; color: #A89082; margin-top: 0.25rem;">Formatos JPG, PNG o WebP</p>
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

          <!-- Verificación Anti-Spam 100% Fiable y Accesible -->
          <div class="card" style="background: rgba(30, 18, 11, 0.95); padding: 1.25rem; margin-bottom: 1.75rem; border: 1.5px solid rgba(255, 159, 56, 0.35);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
              <label class="form-label" style="margin-bottom: 0; font-size: 0.925rem;">
                <span>🔒 Verificación de Seguridad Vecinal</span>
              </label>
              <button type="button" class="btn btn-secondary btn-sm" onclick="CivitasApp.wizard.refreshCaptcha()" title="Generar otra suma">
                🔄 Cambiar pregunta
              </button>
            </div>
            
            <p style="font-size: 0.825rem; color: #D4A386; margin-bottom: 0.85rem;">
              Por favor, resuelve esta sencilla suma para validar el envío al Ayuntamiento:
            </p>

            <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
              <div style="background: rgba(18, 10, 6, 0.95); border: 2px solid #FF7A18; border-radius: var(--cm-radius-md); padding: 0.65rem 1.25rem; font-size: 1.35rem; font-weight: 850; font-family: var(--cm-font-mono); color: #FFAE33; letter-spacing: 0.05em; box-shadow: 0 4px 12px rgba(255,122,24,0.3);">
                ${this.currentCaptcha.num1} + ${this.currentCaptcha.num2} = ?
              </div>
              <input type="number" id="wizard-captcha-input" class="form-control" 
                     placeholder="Tu resultado..." 
                     style="max-width: 170px; font-size: 1.15rem; font-weight: 750; text-align: center;" 
                     autocomplete="off" />
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 1.5rem;">
            <button type="button" class="btn btn-secondary" onclick="CivitasApp.wizard.goToStep(2)">&larr; Atrás</button>
            <button type="button" class="btn btn-sunset btn-lg" onclick="CivitasApp.wizard.submitIncident()">
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

  composeFullAddress() {
    let streetName = this.formData.street;
    if (streetName === 'Otra calle o vía del término municipal') {
      streetName = this.formData.customStreet ? this.formData.customStreet.trim() : 'Término de Cumbres Mayores';
    }

    let full = streetName;
    if (this.formData.streetNumber && this.formData.streetNumber.trim()) {
      full += `, ${this.formData.streetNumber.trim()}`;
    }
    if (this.formData.referencePoint && this.formData.referencePoint.trim()) {
      full += ` (${this.formData.referencePoint.trim()})`;
    }
    full += ' — Cumbres Mayores (Huelva)';
    this.formData.address = full;
    return full;
  },

  handleStreetChange(streetName) {
    this.formData.street = streetName;
    const match = CumbresMayoresStreets.find(s => s.name === streetName);
    if (match) {
      this.formData.lat = match.lat;
      this.formData.lng = match.lng;
      if (this.miniMap && this.miniMapMarker) {
        this.miniMap.setView([match.lat, match.lng], 17);
        this.miniMapMarker.setLatLng([match.lat, match.lng]);
      }
    }

    const customGroup = document.getElementById('wizard-custom-street-group');
    if (customGroup) {
      customGroup.style.display = streetName === 'Otra calle o vía del término municipal' ? 'block' : 'none';
    }

    this.updateAddressDisplay();
  },

  handleNumberChange(value) {
    this.formData.streetNumber = value;
    this.updateAddressDisplay();
  },

  handleCustomStreetChange(value) {
    this.formData.customStreet = value;
    this.updateAddressDisplay();
  },

  handleRefChange(value) {
    this.formData.referencePoint = value;
    this.updateAddressDisplay();
  },

  updateAddressDisplay() {
    const textEl = document.getElementById('wizard-full-address-text');
    if (textEl) {
      textEl.innerText = this.composeFullAddress();
    }
  },

  refreshCaptcha() {
    this.currentCaptcha = Security.generateMathCaptcha();
    this.render('report-wizard-container');
    const input = document.getElementById('wizard-captcha-input');
    if (input) input.focus();
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
    if (step === 3) {
      this.composeFullAddress();
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
      html: `<div style="background: var(--brand-gradient); width: 30px; height: 30px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 4px 14px rgba(255,122,24,0.7); display: flex; align-items: center; justify-content: center; color: white; font-size: 15px;">📍</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    this.miniMapMarker = L.marker([this.formData.lat, this.formData.lng], {
      draggable: true,
      icon: customIcon
    }).addTo(this.miniMap);

    this.miniMapMarker.on('dragend', (e) => {
      const position = e.target.getLatLng();
      this.formData.lat = position.lat;
      this.formData.lng = position.lng;
    });

    this.miniMap.on('click', (e) => {
      this.formData.lat = e.latlng.lat;
      this.formData.lng = e.latlng.lng;
      this.miniMapMarker.setLatLng(e.latlng);
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
          NotificationService.showToast('GPS Fijado', 'Coordenadas GPS obtenidas correctamente.', 'success');
        },
        (err) => {
          NotificationService.showToast('Aviso GPS', 'No se pudo obtener el GPS; usa la selección de calle.', 'warning');
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
    const userCaptchaValue = captchaInput ? captchaInput.value : '';

    if (!title || !desc) {
      NotificationService.showToast('Faltan Campos', 'Por favor, introduce un título y una descripción de la avería.', 'warning');
      return;
    }

    // Anti-Spam verification check
    const isCaptchaValid = Security.verifyMathCaptcha(userCaptchaValue, this.currentCaptcha);

    if (!isCaptchaValid) {
      NotificationService.showToast('Verificación Incorrecta', 'El resultado numérico no es correcto. Inténtalo de nuevo.', 'error');
      if (captchaInput) {
        captchaInput.value = '';
        captchaInput.focus();
      }
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
      address: this.composeFullAddress(),
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

        <div style="background: rgba(18, 10, 6, 0.9); border: 1.5px solid rgba(255, 159, 56, 0.3); border-radius: var(--cm-radius-md); padding: 1.25rem; max-width: 440px; margin: 0 auto 2rem;">
          <div style="font-size: 0.8rem; color: #A89082; text-transform: uppercase; font-weight: 750;">Código Único de Seguimiento</div>
          <div style="font-size: 1.85rem; font-weight: 850; font-family: var(--cm-font-mono); color: #FFAE33; margin: 0.35rem 0;">
            ${created.trackingCode}
          </div>
          <div style="font-size: 0.775rem; color: #D4A386;">📍 ${created.address}</div>
        </div>

        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <button type="button" class="btn btn-sunset" onclick="CivitasApp.navigateTo('incidents')">
            📋 Ver mis Incidencias
          </button>
          <button type="button" class="btn btn-secondary" onclick="CivitasApp.openIncidentDetail('${created.id}')">
            Ver Detalle del Aviso
          </button>
          <button type="button" class="btn btn-secondary" onclick="CivitasApp.navigateTo('home')">
            Volver al Inicio
          </button>
        </div>
      `;
    }
  }
};
