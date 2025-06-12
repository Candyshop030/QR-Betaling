// App.js
import React, { useState } from 'react';
import QRCode from 'qrcode.react';

const producten = [
  { naam: 'Adana', prijs: 10, afbeelding: 'https://via.placeholder.com/80x80?text=Adana' },
  { naam: 'Sucuk', prijs: 5, afbeelding: 'https://via.placeholder.com/80x80?text=Sucuk' },
  { naam: 'Drinken', prijs: 1, afbeelding: 'https://via.placeholder.com/80x80?text=Drinken' },
];

export default function App() {
  const [selectedItems, setSelectedItems] = useState({});
  const [history, setHistory] = useState([]);
  const [qrUrl, setQrUrl] = useState('');

  const baseUrl = 'https://tikkie.me/pay/abc123';

  const totalAmount = Object.values(selectedItems).reduce(
    (sum, { product, quantity }) => sum + product.prijs * quantity,
    0
  );

  const description = Object.values(selectedItems)
    .map(({ product, quantity }) => `${quantity}x ${product.naam}`)
    .join(', ');

  const updateProductQuantity = (product, delta) => {
    setSelectedItems((prev) => {
      const current = prev[product.naam] || { product, quantity: 0 };
      const newQuantity = Math.max(0, current.quantity + delta);
      const updated = { ...prev };
      if (newQuantity === 0) {
        delete updated[product.naam];
      } else {
        updated[product.naam] = { product, quantity: newQuantity };
      }
      return updated;
    });
    setQrUrl('');
  };

  const handleGenerateQR = () => {
    if (Object.keys(selectedItems).length === 0) return alert('Selecteer minimaal één product');
    const url = `${baseUrl}?amount=${totalAmount}&description=${encodeURIComponent(description)}`;
    setQrUrl(url);
  };

  const handleConfirmPayment = () => {
    const entry = {
      amount: totalAmount,
      description,
      date: new Date().toLocaleString(),
    };
    setHistory([entry, ...history]);
    setSelectedItems({});
    setQrUrl('');
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-bold">QR Betaling</h1>

      <div className="grid grid-cols-3 gap-4">
        {producten.map((product, index) => {
          const quantity = selectedItems[product.naam]?.quantity || 0;
          return (
            <div
              key={index}
              className={\`border p-2 rounded flex flex-col items-center \${quantity > 0 ? 'bg-blue-100 border-blue-500' : ''}\`}
            >
              <img src={product.afbeelding} alt={product.naam} className="w-16 h-16 object-cover rounded" />
              <span className="mt-1 text-sm">{product.naam}</span>
              <span className="text-xs text-gray-600">€{product.prijs}</span>
              <div className="flex mt-2 items-center space-x-2">
                <button className="px-2 py-1 bg-gray-200 rounded" onClick={() => updateProductQuantity(product, -1)}>-</button>
                <span>{quantity}</span>
                <button className="px-2 py-1 bg-gray-200 rounded" onClick={() => updateProductQuantity(product, 1)}>+</button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border p-2 rounded">
        <p><strong>Geselecteerd:</strong> {description || '–'}</p>
        <p><strong>Totaal:</strong> €{totalAmount.toFixed(2)}</p>
      </div>

      <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" onClick={handleGenerateQR}>
        Genereer QR-code
      </button>

      {qrUrl && (
        <div className="text-center">
          <QRCode value={qrUrl} size={200} />
          <p className="text-sm break-all mt-2">{qrUrl}</p>
          <button className="bg-green-600 text-white px-4 py-2 rounded mt-2" onClick={handleConfirmPayment}>
            ✅ Betaling ontvangen
          </button>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold">Geschiedenis</h2>
          <ul className="space-y-1 text-sm">
            {history.map((item, idx) => (
              <li key={idx} className="border p-2 rounded">
                💶 €{item.amount} – {item.description} <br />
                📅 {item.date}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
