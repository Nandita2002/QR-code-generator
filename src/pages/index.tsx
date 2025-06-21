import { useState, useRef } from 'react';
import QRCode from 'qrcode';

export default function Home() {
  const [text, setText] = useState('');
  const [qr, setQr] = useState('');
  const [color, setColor] = useState('#000000');
  const [logo, setLogo] = useState<File | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQrCode = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !text) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas before drawing new QR
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw new QR code with updated color
    await QRCode.toCanvas(canvas, text, {
      margin: 1,
      width: 300,
      color: {
        dark: color,
        light: '#ffffff',
      },
    });

    // If logo is selected, draw it on top
    if (logo) {
      const logoImg = new Image();
      logoImg.src = URL.createObjectURL(logo);

      logoImg.onload = () => {
        const size = 60;
        const x = (canvas.width - size) / 2;
        const y = (canvas.height - size) / 2;
        ctx.drawImage(logoImg, x, y, size, size);
        // Set QR code as base64 string
        setQr(canvas.toDataURL('image/png'));
      };
    } else {
      setQr(canvas.toDataURL('image/png'));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 justify-between">
      <header className="text-center py-10">
        <h1 className="text-4xl font-extrabold text-gray-800">QR Code Generator</h1>
        <p className="text-gray-600 mt-2">Customize color and add your logo!</p>
      </header>

      <main className="flex flex-col items-center px-4">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text or URL"
            className="w-full px-4 py-3 border border-gray-300 rounded-md mb-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label className="block mb-4">
            <span className="text-gray-700 font-medium">Select QR Color:</span>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="ml-4"
            />
          </label>

          <label className="block mb-4">
            <span className="text-gray-700 font-medium">Upload Logo (optional):</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogo(e.target.files?.[0] || null)}
              className="mt-1 block"
            />
          </label>

          <button
            onClick={generateQrCode}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-500 transition"
          >
            Generate QR Code
          </button>

          <canvas ref={canvasRef} className="hidden" />

          {qr && (
            <div className="mt-6 text-center">
              <img src={qr} alt="Generated QR Code" className="mx-auto mb-4 rounded shadow" />
              <a
                href={qr}
                download="custom-qr-code.png"
                className="inline-block text-blue-600 font-medium underline hover:text-blue-800"
              >
                Download QR Code
              </a>
            </div>
          )}
        </div>
      </main>

      <footer className="text-center py-6 text-gray-600 text-sm">
        © {new Date().getFullYear()} Nandita Mahesh. All rights reserved.
      </footer>
    </div>
  );
}
