import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { FiCheck, FiCrosshair, FiMapPin, FiNavigation, FiTrash2 } from 'react-icons/fi'

export type LocationCoordinates = {
  latitude: number
  longitude: number
}

type LocationPickerMapProps = {
  value?: { latitude?: number | null; longitude?: number | null }
  onChange: (coords: LocationCoordinates | null) => void
  disabled?: boolean
}

// Preset Kampus UNSRI
const UNSRI_INDRALAYA = {
  name: 'Kampus Indralaya',
  lat: -3.2185,
  lng: 104.6495,
  zoom: 16,
}

const UNSRI_PALEMBANG = {
  name: 'Kampus Bukit Besar',
  lat: -2.9852,
  lng: 104.7324,
  zoom: 16,
}

// Custom Marker Pin khas LaporUNSRI (Navy #08315c + Gold #ffbb00)
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

export function LocationPickerMap({ value, onChange, disabled = false }: LocationPickerMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)

  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const disabledRef = useRef(disabled)
  useEffect(() => {
    disabledRef.current = disabled
  }, [disabled])

  const [geoLocating, setGeoLocating] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)

  const currentLat = typeof value?.latitude === 'number' ? value.latitude : null
  const currentLng = typeof value?.longitude === 'number' ? value.longitude : null
  const hasCoordinates = currentLat !== null && currentLng !== null

  const [initialCoords] = useState(() => {
    const lat = typeof value?.latitude === 'number' ? value.latitude : UNSRI_INDRALAYA.lat
    const lng = typeof value?.longitude === 'number' ? value.longitude : UNSRI_INDRALAYA.lng
    const zoom = typeof value?.latitude === 'number' && typeof value?.longitude === 'number' ? 17 : UNSRI_INDRALAYA.zoom
    return { lat, lng, zoom }
  })

  // Inisialisasi peta Leaflet sekali saat komponen di-mount
  useEffect(() => {
    if (!mapContainerRef.current) return

    const map = L.map(mapContainerRef.current, {
      center: [initialCoords.lat, initialCoords.lng],
      zoom: initialCoords.zoom,
      zoomControl: false,
    })

    // Pasang Zoom Control di kanan bawah
    L.control.zoom({ position: 'bottomright' }).addTo(map)

    // Pasang OpenStreetMap Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> kontributor',
    }).addTo(map)

    mapInstanceRef.current = map

    // Handler klik pada peta untuk meletakkan/memindahkan pin
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (disabledRef.current) return
      const lat = Number(e.latlng.lat.toFixed(6))
      const lng = Number(e.latlng.lng.toFixed(6))

      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng])
      } else {
        const marker = L.marker([lat, lng], {
          icon: createCustomPinIcon(),
          draggable: !disabledRef.current,
        }).addTo(map)

        marker.on('dragend', () => {
          const pos = marker.getLatLng()
          onChangeRef.current({
            latitude: Number(pos.lat.toFixed(6)),
            longitude: Number(pos.lng.toFixed(6)),
          })
        })

        markerRef.current = marker
      }

      onChangeRef.current({ latitude: lat, longitude: lng })
      setGeoError(null)
    })

    // Beri waktu agar container selesai render, lalu invalidateSize
    const timer = setTimeout(() => {
      map.invalidateSize()
    }, 200)

    return () => {
      clearTimeout(timer)
      map.remove()
      mapInstanceRef.current = null
      markerRef.current = null
    }
  }, [initialCoords.lat, initialCoords.lng, initialCoords.zoom])

  // Sinkronisasi posisi marker saat prop `value` berubah
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    if (currentLat !== null && currentLng !== null) {
      if (markerRef.current) {
        markerRef.current.setLatLng([currentLat, currentLng])
      } else {
        const marker = L.marker([currentLat, currentLng], {
          icon: createCustomPinIcon(),
          draggable: !disabled,
        }).addTo(map)

        marker.on('dragend', () => {
          const pos = marker.getLatLng()
          onChangeRef.current({
            latitude: Number(pos.lat.toFixed(6)),
            longitude: Number(pos.lng.toFixed(6)),
          })
        })

        markerRef.current = marker
      }
    } else if (markerRef.current) {
      markerRef.current.remove()
      markerRef.current = null
    }
  }, [currentLat, currentLng, disabled])

  // Deteksi lokasi user via Geolocation API
  const handleUseCurrentLocation = () => {
    if (disabled || !navigator.geolocation) {
      setGeoError('Perangkat Anda tidak mendukung fitur lokasi (Geolocation).')
      return
    }

    setGeoLocating(true)
    setGeoError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoLocating(false)
        const lat = Number(position.coords.latitude.toFixed(6))
        const lng = Number(position.coords.longitude.toFixed(6))

        const map = mapInstanceRef.current
        if (map) {
          map.setView([lat, lng], 17, { animate: true })

          if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng])
          } else {
            const marker = L.marker([lat, lng], {
              icon: createCustomPinIcon(),
              draggable: !disabled,
            }).addTo(map)

            marker.on('dragend', () => {
              const pos = marker.getLatLng()
              onChangeRef.current({
                latitude: Number(pos.lat.toFixed(6)),
                longitude: Number(pos.lng.toFixed(6)),
              })
            })

            markerRef.current = marker
          }
        }

        onChange({ latitude: lat, longitude: lng })
      },
      (err) => {
        setGeoLocating(false)
        if (err.code === err.PERMISSION_DENIED) {
          setGeoError('Izin akses lokasi ditolak oleh browser. Mohon izinkan akses lokasi atau klik peta secara manual.')
        } else {
          setGeoError('Gagal mendeteksi lokasi saat ini. Silakan tentukan lokasi dengan mengeklik peta.')
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }

  // Navigasi cepat ke preset kampus
  const handlePanToPreset = (preset: typeof UNSRI_INDRALAYA) => {
    const map = mapInstanceRef.current
    if (!map) return
    map.setView([preset.lat, preset.lng], preset.zoom, { animate: true })
  }

  // Hapus titik lokasi
  const handleClearLocation = () => {
    if (disabled) return
    if (markerRef.current) {
      markerRef.current.remove()
      markerRef.current = null
    }
    onChange(null)
    setGeoError(null)
  }

  return (
    <div className="flex flex-col gap-2.5">
      {/* Action Toolbar di atas peta */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-500 mr-1">Pindah Area:</span>
          <button
            type="button"
            onClick={() => handlePanToPreset(UNSRI_INDRALAYA)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition cursor-pointer"
          >
            <FiNavigation className="size-3 text-[#08315c]" aria-hidden="true" />
            <span>Indralaya</span>
          </button>
          <button
            type="button"
            onClick={() => handlePanToPreset(UNSRI_PALEMBANG)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition cursor-pointer"
          >
            <FiNavigation className="size-3 text-[#08315c]" aria-hidden="true" />
            <span>Bukit Palembang</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={disabled || geoLocating}
            onClick={handleUseCurrentLocation}
            className="inline-flex items-center gap-1.5 rounded-lg bg-sky-50 border border-sky-200 px-3 py-1 text-xs font-semibold text-[#08315c] hover:bg-sky-100 transition disabled:opacity-50 cursor-pointer"
          >
            <FiCrosshair className={`size-3.5 ${geoLocating ? 'animate-spin' : ''}`} aria-hidden="true" />
            <span>{geoLocating ? 'Mencari...' : 'Lokasi Saya'}</span>
          </button>

          {hasCoordinates && !disabled && (
            <button
              type="button"
              onClick={handleClearLocation}
              className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition cursor-pointer"
              title="Hapus penanda lokasi"
            >
              <FiTrash2 className="size-3" aria-hidden="true" />
              <span>Hapus Titik</span>
            </button>
          )}
        </div>
      </div>

      {/* Kontainer Peta Leaflet */}
      <div className="relative w-full h-72 sm:h-80 rounded-2xl border border-slate-200 bg-slate-100 overflow-hidden shadow-inner z-0">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Petunjuk melayang di pojok atas peta */}
        <div className="absolute top-2.5 left-2.5 z-[500] pointer-events-none">
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 text-[11px] font-medium text-white shadow">
            <FiMapPin className="size-3 text-[#ffbb00]" aria-hidden="true" />
            <span>Klik pada peta atau geser pin untuk menentukan titik</span>
          </div>
        </div>
      </div>

      {/* Pesan Kesalahan Geolocation */}
      {geoError && (
        <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl p-2.5 leading-relaxed">
          {geoError}
        </p>
      )}

      {/* Info Status Koordinat */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 border border-slate-200/80 px-3.5 py-2 text-xs">
        {hasCoordinates ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
              <FiCheck className="size-3 stroke-[3]" aria-hidden="true" />
              <span>Titik Terpilih</span>
            </span>
            <span className="font-mono text-slate-700 font-semibold">
              Lat: {currentLat?.toFixed(6)}, Lng: {currentLng?.toFixed(6)}
            </span>
          </div>
        ) : (
          <span className="text-slate-500">
            Belum ada titik yang dipilih. Klik di area peta fasilitas untuk menandai lokasi.
          </span>
        )}
        <span className="text-[10px] text-slate-400">Peta interaktif Leaflet · OpenStreetMap</span>
      </div>
    </div>
  )
}
export default LocationPickerMap
