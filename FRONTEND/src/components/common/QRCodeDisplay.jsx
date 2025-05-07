import { useState, useEffect } from "react";
import { getQRApi } from "../../utils/api";

export default function QRCodeDisplay({ initialText }) {
  const [qr, setQr] = useState("");

  useEffect(() => {
    const generateQR = async () => {
      if (initialText) {
        try {
          const response = await getQRApi(initialText);
          setQr(response.data);
        } catch (error) {
          console.error("Error generating QR:", error);
        }
      }
    };

    generateQR();
  }, [initialText]);

  return (
    <div className="flex flex-col items-center p-4">
      {qr && <img src={qr} alt="QR Code" className="border shadow-lg" />}
    </div>
  );
}
