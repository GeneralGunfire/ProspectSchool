import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, FeatureGroup } from 'react-leaflet';
import { motion } from 'motion/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Briefcase, GraduationCap, Building2 } from 'lucide-react';
import { PROVINCES, getProvinceFromCoords, PROVINCE_JOB_DEMAND } from '../data/mapData';

interface UserLocation {
  lat: number;
  lng: number;
  label: string;
  province?: string;
}

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  type: 'user' | 'career' | 'university' | 'tvet';
  title: string;
}

interface MapDisplayProps {
  center: [number, number];
  zoom?: number;
  userLocation?: UserLocation;
  markers?: MapMarker[];
  activeLayers?: string[];
  onLayerToggle?: (layer: string) => void;
}

export default function MapDisplay({
  center,
  zoom = 8,
  userLocation,
  markers = [],
  activeLayers = ['colleges'],
  onLayerToggle,
}: MapDisplayProps) {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  // Custom user location icon with MapPin
  const userIcon = L.divIcon({
    className: 'user-marker',
    html: `
      <div style="
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #1B5E20;
        border: 4px solid white;
        box-shadow: 0 0 0 2px #1B5E20;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: pulse 2s infinite;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
      </div>
      <style>
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 2px #1B5E20; }
          50% { box-shadow: 0 0 0 6px rgba(27, 94, 32, 0.3); }
        }
      </style>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });

  // Career marker icon (Briefcase)
  const careerIcon = L.divIcon({
    className: 'career-marker',
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background: white;
        border: 2px solid #8B5CF6;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path></svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });

  // University marker icon (GraduationCap)
  const universityIcon = L.divIcon({
    className: 'university-marker',
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background: white;
        border: 2px solid #10B981;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });

  // TVET marker icon (Building2)
  const tvetIcon = L.divIcon({
    className: 'tvet-marker',
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background: white;
        border: 2px solid #3B82F6;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });

  return (
    <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
      <MapContainer ref={mapRef} center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        {/* Base Map */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
          maxZoom={19}
        />

        {/* User Location Marker */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup className="rounded-lg">
              <div className="font-semibold text-slate-900">{userLocation.label}</div>
            </Popup>
          </Marker>
        )}

        {/* Career Markers */}
        {activeLayers.includes('careers') &&
          markers
            .filter((m) => m.type === 'career')
            .map((marker) => (
              <Marker
                key={marker.id}
                position={[marker.lat, marker.lng]}
                icon={careerIcon}
              >
                <Popup className="rounded-lg">
                  <div className="text-sm font-semibold text-slate-900">{marker.title}</div>
                </Popup>
              </Marker>
            ))}

        {/* University Markers */}
        {activeLayers.includes('colleges') &&
          markers
            .filter((m) => m.type === 'university')
            .map((marker) => (
              <Marker
                key={marker.id}
                position={[marker.lat, marker.lng]}
                icon={universityIcon}
              >
                <Popup className="rounded-lg">
                  <div className="text-sm font-semibold text-slate-900">{marker.title}</div>
                </Popup>
              </Marker>
            ))}

        {/* TVET Markers */}
        {activeLayers.includes('colleges') &&
          markers
            .filter((m) => m.type === 'tvet')
            .map((marker) => (
              <Marker
                key={marker.id}
                position={[marker.lat, marker.lng]}
                icon={tvetIcon}
              >
                <Popup className="rounded-lg">
                  <div className="text-sm font-semibold text-slate-900">{marker.title}</div>
                </Popup>
              </Marker>
            ))}
      </MapContainer>

      {/* Layer Controls */}
      <div className="absolute top-4 right-4 bg-white rounded-xl p-3 z-50 space-y-2">
        <div className="text-xs font-bold text-slate-700 px-2 py-1 uppercase tracking-widest">Layers</div>

        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:bg-slate-50 px-2 py-1 rounded">
          <input
            type="checkbox"
            checked={activeLayers.includes('colleges')}
            onChange={() => onLayerToggle?.('colleges')}
            className="w-4 h-4"
          />
          <span className="flex items-center gap-1">
            <Building2 size={14} />
            Colleges
          </span>
        </label>

        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:bg-slate-50 px-2 py-1 rounded">
          <input
            type="checkbox"
            checked={activeLayers.includes('careers')}
            onChange={() => onLayerToggle?.('careers')}
            className="w-4 h-4"
          />
          <span className="flex items-center gap-1">
            <Briefcase size={14} />
            Careers
          </span>
        </label>
      </div>
    </div>
  );
}
