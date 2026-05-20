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

  if (error) return <div className="text-red-500 p-8">{error}</div>;
  if (!wabaNumber) return <div className="text-neutral-500 p-8">Loading...</div>;

  const deepLink = `https://wa.me/${wabaNumber}?text=RateMyVisit%20${cafeId}`;

  return (
    <div className="space-y-6 max-w-xl">
      <h2 className="text-lg font-bold text-slate-900 mb-4">Table QR Code</h2>
      <p className="text-sm text-neutral-600">
        Print and place this QR code on your tables. When customers scan it, it will open a pre-filled WhatsApp message to collect their feedback.
      </p>

      <div className="dashboard-card p-8 flex flex-col items-center justify-center bg-neutral-50">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-100 mb-6" ref={qrRef}>
          <QRCodeCanvas 
            value={deepLink}
            size={200}
            level={"H"}
            includeMargin={true}
          />
        </div>
        
        <button 
          onClick={downloadQR}
          className="dashboard-btn-secondary flex items-center gap-2 w-full justify-center"
        >
          <Download size={16} /> Download as PNG
        </button>
      </div>
      
      <div className="p-4 border border-neutral-200 rounded-lg">
         <p className="text-xs font-bold text-neutral-500 uppercase mb-1">Raw Deep Link</p>
         <p className="font-mono text-sm break-all text-black">{deepLink}</p>
      </div>
    </div>
  );
}
