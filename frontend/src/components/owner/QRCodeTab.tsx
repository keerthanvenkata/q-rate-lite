import React, { useState, useEffect, useRef } from 'react';
import { fetchWhatsappConfig } from '../../api';
import { QRCodeCanvas } from 'qrcode.react';
import { Download } from 'lucide-react';

interface QRCodeTabProps {
  cafeId: number;
}

export default function QRCodeTab({ cafeId }: QRCodeTabProps) {
  const [wabaNumber, setWabaNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchWhatsappConfig()
      .then(data => setWabaNumber(data.waba_phone_number))
      .catch(err => setError(err.message || "Failed to load config"));
  }, []);

  const downloadQR = () => {
    if (!qrRef.current) return;
    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) return;
    
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `qrate-qr-cafe-${cafeId}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (error) {
    return (
      <div className="flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">
        <span className="mt-0.5">⚠</span>
        <span>{error}</span>
      </div>
    );
  }
  if (!wabaNumber) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-10 h-10 rounded-full border-2 border-neutral-200 border-t-black animate-spin" />
          <p className="text-sm text-neutral-500 font-medium">Loading QR code…</p>
        </div>
      </div>
    );
  }

  const deepLink = `https://wa.me/${wabaNumber}?text=RateMyVisit%20${cafeId}`;

  return (
    <div className="space-y-6 max-w-xl">
      <h2 className="text-sm font-bold text-black tracking-tight mb-2">Table QR Code</h2>
      <p className="text-sm text-neutral-500 leading-relaxed">
        Print and place this QR code on your tables. When customers scan it, it will open a pre-filled WhatsApp message to collect their feedback.
      </p>

      <div className="dashboard-card p-8 flex flex-col items-center justify-center bg-white gap-6">
        <div className="p-4 rounded-xl border border-neutral-200" style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }} ref={qrRef}>
          <QRCodeCanvas 
            value={deepLink}
            size={200}
            level={"H"}
            includeMargin={true}
          />
        </div>
        
        <button 
          onClick={downloadQR}
          className="dashboard-btn-secondary w-full max-w-xs mx-auto"
        >
          <Download size={16} /> Download as PNG
        </button>
      </div>
      
      <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
         <p className="dashboard-section-title mb-2">Raw Deep Link</p>
         <p className="font-mono text-xs text-neutral-600 break-all leading-relaxed">{deepLink}</p>
      </div>
    </div>
  );
}
