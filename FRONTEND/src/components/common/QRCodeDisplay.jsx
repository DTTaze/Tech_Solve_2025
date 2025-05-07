import { useState, useEffect } from "react";
import { getQRApi } from "../../utils/api";

export default function QRCodeDisplay({ initialText }) {
  const [qr, setQr] = useState("");

  useEffect(() => {
    const generateQR = async () => {
      if (initialText) {
        try {
          const response = await getQRApi(initialText);
          console.log("qr response: ", response);
          setQr(response.data);
        } catch (error) {
          console.error("Error generating QR:", error);
        }
      }
    };

    generateQR();
  }, [initialText]);

  return (
    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
      {qr && (
        <img
          src={qr}
          alt="QR Code"
          className="w-64 h-64 object-contain border-2 border-gray-200 rounded-lg shadow-md"
        />
      )}
    </div>
  );
}
