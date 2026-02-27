import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { QrCode, X } from 'lucide-react';

export default function Scanner() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    scanner.render(
      (decodedText) => {
        console.log("QR Decoded:", decodedText);
        
        // Handle relative paths or direct IDs
        if (decodedText.startsWith('/product/')) {
          scanner.clear();
          navigate(decodedText);
          return;
        }

        if (!isNaN(Number(decodedText))) {
          scanner.clear();
          navigate(`/product/${decodedText}`);
          return;
        }

        // Handle full URLs
        try {
          const url = new URL(decodedText);
          const pathParts = url.pathname.split('/');
          const productId = pathParts[pathParts.length - 1];
          
          if (productId && !isNaN(Number(productId))) {
            scanner.clear();
            navigate(`/product/${productId}`);
          } else {
            setError("Invalid QR Code format. Please scan a LocalVocal product QR.");
          }
        } catch (e) {
          setError("Could not parse QR Code. Please try again.");
        }
      },
      (errorMessage) => {
        // parse error, ignore it
      }
    );

    return () => {
      scanner.clear().catch(error => console.error("Failed to clear scanner", error));
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[40px] p-8 max-w-md w-full shadow-2xl"
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
              <QrCode size={24} />
            </div>
            <h1 className="text-2xl font-serif font-bold text-stone-900">Scan Product</h1>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="p-2 text-stone-400 hover:text-stone-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <p className="text-stone-600 mb-8 text-center">
          Point your camera at the product's QR code to see its story and verify authenticity.
        </p>

        <div id="reader" className="overflow-hidden rounded-3xl border-2 border-stone-100"></div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium text-center">
            {error}
          </div>
        )}

        <button 
          onClick={() => navigate(-1)}
          className="w-full mt-8 py-4 text-stone-500 font-bold hover:text-stone-700 transition-colors"
        >
          Cancel Scanning
        </button>
      </motion.div>
    </div>
  );
}
