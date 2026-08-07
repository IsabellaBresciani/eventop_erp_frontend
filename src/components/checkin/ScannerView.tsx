import { Camera, ScanLine } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface ScannerViewProps {
  active: boolean
  onScan: (code: string) => void
}

export function ScannerView({ active, onScan }: ScannerViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [cameraError, setCameraError] = useState(false)
  const [scanning, setScanning] = useState(false)

  useEffect(() => {
    if (!active) return

    let stream: MediaStream | null = null

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
        setCameraError(false)
      } catch {
        setCameraError(true)
      }
    }

    startCamera()

    return () => {
      stream?.getTracks().forEach((t) => t.stop())
    }
  }, [active])

  const simulateScan = () => {
    setScanning(true)
    setTimeout(() => {
      const demoCodes = ['EVT-M3N4O5P6', 'EVT-Q7R8S9T0', 'EVT-U1V2W3X4']
      const random = demoCodes[Math.floor(Math.random() * demoCodes.length)]
      onScan(random)
      setScanning(false)
    }, 800)
  }

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-900">
      {!cameraError ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
          <Camera className="h-12 w-12 text-slate-500" />
          <p className="text-sm text-slate-400">
            Cámara no disponible. Usá el buscador manual o ingresá el código.
          </p>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="relative h-48 w-48 rounded-2xl border-2 border-white/60">
          <div className="absolute left-0 right-0 top-0 h-0.5 animate-pulse bg-primary shadow-glow" />
          <ScanLine className="absolute inset-0 m-auto h-8 w-8 text-white/40" />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <button
          type="button"
          onClick={simulateScan}
          disabled={scanning}
          className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-lg transition-all active:scale-95 disabled:opacity-70"
        >
          {scanning ? 'Escaneando...' : 'Escanear QR'}
        </button>
        <p className="mt-2 text-center text-[10px] text-white/60">
          Apuntá al código QR del invitado · RF-214
        </p>
      </div>
    </div>
  )
}
