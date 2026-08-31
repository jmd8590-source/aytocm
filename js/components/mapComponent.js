/**
 * CIVITAS - Map Component (Leaflet.js + Custom Markers + Heatmap Mode)
 */

import { store } from '../state/store.js';
import { Helpers } from '../utils/helpers.js';

export const MapComponent = {
  mapInstance: null,
  markersLayer: null,
  heatLayer: null,
  currentMode: 'markers', // 'markers' | 'heatmap'

  init(containerId = 'map', options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear existing map instance if any
    if (this.mapInstance) {
      this.mapInstance.remove();
      this.mapInstance = null;
    }

    const municipality = store.getCurrentMunicipality();
    const centerLat = options.lat || municipality.centerLat;
    const centerLng = options.lng || municipality.centerLng;
    const zoom = options.zoom || municipality.zoom;

    // Check if Leaflet L is loaded globally
    if (typeof L === 'undefined') {
      container.innerHTML = `
        <div style="display:flex;height:100%;align-items:center;justify-content:center;padding:2rem;text-align:center;">
          <p>Cargando servicio cartográfico OpenStreetMap...</p>
        </div>
      `;
      return;
    }

    this.mapInstance = L.map(containerId, {
      zoomControl: true,
      attributionControl: false
    }).setView([centerLat, centerLng], zoom);

    // OpenStreetMap standard tile layer with clean styling
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c']
    }).addTo(this.mapInstance);

    this.markersLayer = L.layerGroup().addTo(this.mapInstance);

    if (!options.isSelectorOnly) {
      this.renderIncidents();
    }

    // Fix map rendering when displayed inside dynamic tab/view
    setTimeout(() => {
      if (this.mapInstance) {
        this.mapInstance.invalidateSize();
      }
    }, 200);

    return this.mapInstance;
  },

  renderIncidents(filterCategory = 'all', filterStatus = 'all') {
    if (!this.mapInstance || !this.markersLayer) return;

    this.markersLayer.clearLayers();
    const incidents = store.getIncidents();

    const filtered = incidents.filter(inc => {
      const matchCat = filterCategory === 'all' || inc.category === filterCategory;
      const matchStatus = filterStatus === 'all' || inc.status === filterStatus;
      return matchCat && matchStatus && inc.lat && inc.lng;
    });

    filtered.forEach(inc => {
      const marker = this.createIncidentMarker(inc);
      marker.addTo(this.markersLayer);
    });

    if (this.currentMode === 'heatmap') {
      this.renderHeatmap(filtered);
    }
  },

  createIncidentMarker(incident) {
    const statusColors = {
      recibida: '#6366F1',
      validando: '#F59E0B',
      asignada: '#818CF8',
      en_proceso: '#0284C7',
      resuelta: '#10B981',
      cerrada: '#64748B'
    };

    const color = statusColors[incident.status] || '#6366F1';
    const category = store.getState().categories.find(c => c.id === incident.category);
    const iconChar = category ? category.icon : '📍';

    const customIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div style="
          background-color: ${color};
          width: 38px;
          height: 38px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2.5px solid #FFFFFF;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          cursor: pointer;
        ">
          <span style="transform: rotate(45deg); font-size: 16px;">${iconChar}</span>
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 38],
      popupAnchor: [0, -38]
    });

    const marker = L.marker([incident.lat, incident.lng], { icon: customIcon });

    const popupHtml = `
      <div style="font-family: inherit; width: 230px; padding: 4px;">
        ${incident.images && incident.images.length ? `<img src="${incident.images[0]}" style="width:100%;height:110px;object-fit:cover;border-radius:6px;margin-bottom:8px;" alt="Incidencia" />` : ''}
        <div style="font-size:0.75rem; color:#64748B; font-weight:700; text-transform:uppercase; margin-bottom:2px;">${incident.trackingCode}</div>
        <h4 style="font-size:0.95rem; font-weight:700; margin-bottom:4px; color:#0F172A; line-height:1.2;">${incident.title}</h4>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
          <span class="badge status-${incident.status}" style="font-size:0.7rem;">${incident.status.replace('_', ' ')}</span>
          <span style="font-size:0.75rem; color:#64748B;">${Helpers.getRelativeTime(incident.createdAt)}</span>
        </div>
      </div>
    `;

    marker.bindPopup(popupHtml);
    return marker;
  },

  renderHeatmap(incidents) {
    if (this.heatLayer && this.mapInstance) {
      this.mapInstance.removeLayer(this.heatLayer);
      this.heatLayer = null;
    }

    if (typeof L.heatLayer === 'undefined') return;

    const heatPoints = incidents.map(inc => [
      inc.lat,
      inc.lng,
      (inc.priorityScore || 50) / 100
    ]);

    this.heatLayer = L.heatLayer(heatPoints, {
      radius: 30,
      blur: 20,
      maxZoom: 17,
      gradient: { 0.4: '#10B981', 0.65: '#F59E0B', 1.0: '#EF4444' }
    }).addTo(this.mapInstance);
  },

  toggleHeatmap() {
    this.currentMode = this.currentMode === 'markers' ? 'heatmap' : 'markers';
    if (this.currentMode === 'heatmap') {
      if (this.markersLayer) this.markersLayer.clearLayers();
      this.renderHeatmap(store.getIncidents());
    } else {
      if (this.heatLayer && this.mapInstance) {
        this.mapInstance.removeLayer(this.heatLayer);
        this.heatLayer = null;
      }
      this.renderIncidents();
    }
    return this.currentMode;
  }
};
