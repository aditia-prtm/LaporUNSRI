import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { FiCheck, FiCopy, FiExternalLink, FiMapPin } from 'react-icons/fi'

type LocationViewerMapProps = {
  latitude: number
  longitude: number
  title?: string
  locationName?: string
  className?: string
  mapHeight?: string
  showBottomBar?: boolean
}

function createCustomPinIcon() {
  return L.divIcon({
    className: 'laporunsri-leaflet-marker',
    html: `
      <div style="position: relative; width: 36px; height: 42px; transform: translate(-50%, -100%);">
        <svg viewBox="0 0 36 42" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%; filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.35));">
          <path d="M18 0C8.059 0 0 8.059 0 18C0 28.5 15.5 40.5 17.1 41.7C17.6 42.1 18.4 42.1 18.9 41.7C20.5 40.5 36 28.5 36 18C36 8.059 27.941 0 18 0Z" fill="#08315c"/>
          <circle cx="18" cy="17" r="7" fill="#ffbb00"/>
          <circle cx="18" cy="17" r="3.5" fill="#ffffff"/>
        </svg>
      </div>
    `,
    iconSize: [36, 42],
    iconAnchor: [18, 42],
    popupAnchor: [0, -40],
  })
}

export function LocationViewerMap({
  latitude,
  longitude,
  title,
  locationName,
  className = '',
  mapHeight = 'h-64 sm:h-72',
  showBottomBar = true,
}: LocationViewerMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!mapContainerRef.current) return

    const map = L.map(mapContainerRef.current, {
      center: [latitude, longitude],
      zoom: 17,
      zoomControl: false,
    })

    L.control.zoom({ position: 'bottomright' }).addTo(map)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> kontributor',
    }).addTo(map)

    const marker = L.marker([latitude, longitude], {
      icon: createCustomPinIcon(),
      draggable: false,
    }).addTo(map)

    const popupContent = `
      <div style="font-family: inherit; font-size: 12px; color: #1e293b; line-height: 1.4;">
        <strong style="color: #08315c; font-size: 13px;">${title ?? 'Lokasi Fasilitas'}</strong>
        ${locationName ? `<div style="margin-top: 4px; color: #64748b;">${locationName}</div>` : ''}
        <div style="margin-top: 6px; font-family: monospace; font-size: 11px; color: #475569;">
          ${latitude.toFixed(6)}, ${longitude.toFixed(6)}
        </div>
      </div>
    `
    marker.bindPopup(popupContent)

    mapInstanceRef.current = map
    markerRef.current = marker

    const timer = setTimeout(() => {
      map.invalidateSize()
    }, 200)

    return () => {
      clearTimeout(timer)
      map.remove()
      mapInstanceRef.current = null
      markerRef.current = null
    }
  }, [latitude, longitude, title, locationName])

  const handleCopyCoordinates = async () => {
    try {
      await navigator.clipboard.writeText(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback jika clipboard permission gagal
    }
  }

  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`

  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      {/* Kontainer Peta */}
      <div className={`relative w-full ${mapHeight} rounded-2xl border border-slate-200 bg-slate-100 overflow-hidden shadow-sm z-0`}>
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      {/* Info & Aksi Koordinat */}
      {showBottomBar && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 border border-slate-200/90 p-3 text-xs">
          <div className="flex items-center gap-2">
            <FiMapPin className="size-4 text-[#08315c] shrink-0" aria-hidden="true" />
            <span className="font-mono font-medium text-slate-700">
              {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyCoordinates}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              {copied ? (
                <>
                  <FiCheck className="size-3.5 text-emerald-600 stroke-[3]" aria-hidden="true" />
                  <span className="text-emerald-700 font-bold">Tersalin!</span>
                </>
              ) : (
                <>
                  <FiCopy className="size-3.5 text-slate-500" aria-hidden="true" />
                  <span>Salin</span>
                </>
              )}
            </button>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#08315c] px-3 py-1 text-xs font-bold text-white hover:bg-[#0c4278] transition shadow-xs"
            >
              <FiExternalLink className="size-3.5" aria-hidden="true" />
              <span>Google Maps</span>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
export default LocationViewerMap
