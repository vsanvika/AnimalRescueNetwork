import { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';

export default function QRScanner() {
  const navigate = useNavigate();
  const qrRef = useRef(null);

  useEffect(() => {
    const elementId = 'qr-reader';
    const html5Qr = new Html5Qrcode(elementId);

    html5Qr.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: 250 },
      (decodedText) => {
        try {
          const url = new URL(decodedText);
          const parts = url.pathname.split('/').filter(Boolean);
          const token = parts[parts.length - 1];
          if (token) navigate(`/qr/${token}`);
          else navigate(`/qr/${decodedText}`);
        } catch (e) {
          navigate(`/qr/${decodedText}`);
        }
        html5Qr.stop().catch(() => {});
      },
      (errorMessage) => {
        // ignore scan errors
      }
    ).catch((err) => {
      console.error('QR start failed', err);
    });

    return () => { html5Qr.stop().catch(() => {}); };
  }, [navigate]);

  return <div id="qr-reader" style={{ width: '100%', maxWidth: 600, margin: '0 auto' }} ref={qrRef} />;
}
