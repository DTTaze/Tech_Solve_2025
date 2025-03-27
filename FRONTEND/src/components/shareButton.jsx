import React, { useState } from "react";
import Sharing from '../assets/images/Sharing'

export default function ShareButton () {
    const [copied, setCopied] = useState(false);

    const handleClickShareButton = () => {
        const url = window.location.href; // Lấy URL hiện tại
        navigator.clipboard.writeText(url) // Copy vào clipboard
        .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Hiện thông báo trong 2s
        })
        .catch(err => console.error("Lỗi khi copy link:", err));
    };

    return (
        <>
            <button className="btn "
            onClick={handleClickShareButton}
            >
                <Sharing/>
            </button>

            {copied && (
                <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg shadow-md animate-slide-up">
                    Đã sao chép liên kết!
                </div>
            )}

            <style>
                {`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-up {
                    animation: slideUp 0.3s ease-in-out;
                }
                `}
            </style>
        </>
        
    )
}