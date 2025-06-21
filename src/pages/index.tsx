import { useState, useRef } from 'react';
import QRCode from 'qrcode';

export default function Home() {
  const [text, setText] = useState('');
  const [qr, setQr] = useState('');
  const [color, setColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [transparentBg, setTransparentBg] = useState(false);
  const [logo, setLogo] = useState<File | null>(null);
  const [qrSize, setQrSize] = useState(300);
  const [margin, setMargin] = useState(2);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQrCode = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !text) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    await QRCode.toCanvas(canvas, text, {
      margin,
      width: qrSize,
      color: {
        dark: color,
        light: transparentBg ? '#00000000' : bgColor,
      },
    });

    if (logo) {
      const logoImg = new Image();
      logoImg.src = URL.createObjectURL(logo);
      logoImg.onload = () => {
        const size = qrSize / 5;
        const x = (canvas.width - size) / 2;
        const y = (canvas.height - size) / 2;
        ctx.drawImage(logoImg, x, y, size, size);
        setQr(canvas.toDataURL('image/png'));
      };
    } else {
      setQr(canvas.toDataURL('image/png'));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 justify-between">
      {/* Header */}
      <header className="text-center py-8 px-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800">
          QR Code Generator
        </h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Fully customizable, mobile-ready QR tool
        </p>
      </header>

      {/* Main Card */}
      <main className="flex flex-col items-center px-4">
        <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 w-full max-w-lg space-y-4">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text or URL"
            className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">QR Color:</label>
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Background Color:</label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                disabled={transparentBg}
                className={`${transparentBg ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              <label className="inline-flex items-center mt-1 space-x-2 text-xs text-gray-600">
                <input
                  type="checkbox"
                  checked={transparentBg}
                  onChange={(e) => setTransparentBg(e.target.checked)}
                />
                <span>Transparent background</span>
              </label>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">QR Size:</label>
              <select
                value={qrSize}
                onChange={(e) => setQrSize(Number(e.target.value))}
                className="w-full border px-3 py-2 rounded-md text-sm"
              >
                <option value={150}>150 x 150</option>
                <option value={200}>200 x 200</option>
                <option value={300}>300 x 300</option>
                <option value={400}>400 x 400</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Margin:</label>
              <input
                type="range"
                min={0}
                max={10}
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-gray-600">Margin: {margin}</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm">Upload Logo:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogo(e.target.files?.[0] || null)}
              className="w-full text-sm"
            />
          </div>

          <button
            onClick={generateQrCode}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-500 transition text-sm sm:text-base"
          >
            Generate QR Code
          </button>

          <canvas ref={canvasRef} className="hidden" />

          {qr && (
            <div className="mt-6 text-center">
              <img
                src={qr}
                alt="Generated QR Code"
                className="mx-auto mb-4 rounded shadow max-w-full"
              />
              <a
                href={qr}
                download="custom-qr-code.png"
                className="inline-block text-blue-600 font-medium underline hover:text-blue-800 text-sm"
              >
                Download QR Code
              </a>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 px-4 text-gray-600 text-xs sm:text-sm">
        © {new Date().getFullYear()} Nandita Mahesh. All rights reserved.
      </footer>
    </div>
  );
}
