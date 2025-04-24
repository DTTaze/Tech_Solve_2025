import { useState } from "react";
import { getQRApi } from "../../utils/api";

export default function QRCodeDisplay() {
  const [qr, setQr] = useState("");
  const [text, setText] = useState("");

  const handleGenerate = async () => {
    try {
      const response = await getQRApi(text);
      setQr(response.data);
    } catch (error) {
      console.error("Error generating QR:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 gap-4">
      <input
        className="border p-2 rounded w-64"
        type="text"
        placeholder="Nhập nội dung..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={handleGenerate}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Tạo QR Code
      </button>
      {qr && <img src={qr} alt="QR Code" className="mt-4 border shadow-lg" />}
    </div>
  );
}
