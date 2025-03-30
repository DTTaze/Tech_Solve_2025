import React from 'react';
import images from "../exchangemarket/Photo.jsx";

function Ranking({ rankData = null }) {
    // Default data if none provided
    const defaultData = {
        labels: ['Minh', 'Biên', 'Phi', 'Anh', 'Dũng'],
        values: [2500, 1800, 1500, 1200, 1000],
        avatars: [1, 2, 3, 4, 5] // User IDs for avatars
    };
    
    const data = rankData || defaultData;
    
    return (
        <div className="ranking-container">
            {/* Top 3 Users Section */}
            <div className="top-users flex justify-center items-end mb-6 pt-4">
                {/* 2nd Place */}
                <div className="place-2 flex flex-col items-center mx-3">
                    <div className="avatar w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300 overflow-hidden mb-2">
                        <img src={images.user} alt="User 2" className="w-full h-full object-cover" />
                    </div>
                    <div className="h-20 w-20 bg-silver rounded-t-lg flex items-center justify-center bg-gradient-to-t from-gray-400 to-gray-300">
                        <span className="text-white font-bold text-lg">2</span>
                    </div>
                    <div className="name text-sm font-medium mt-1 text-gray-700">{data.labels[1]}</div>
                    <div className="score text-xs text-gray-500 font-medium">{data.values[1]} điểm</div>
                </div>

                {/* 1st Place */}
                <div className="place-1 flex flex-col items-center mx-4">
                    <div className="crown text-yellow-500 -mb-3">👑</div>
                    <div className="avatar w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center border-2 border-yellow-400 overflow-hidden mb-2">
                        <img src={images.user} alt="User 1" className="w-full h-full object-cover" />
                    </div>
                    <div className="h-24 w-24 rounded-t-lg flex items-center justify-center bg-gradient-to-t from-yellow-500 to-yellow-300">
                        <span className="text-white font-bold text-xl">1</span>
                    </div>
                    <div className="name text-sm font-semibold mt-1 text-gray-800">{data.labels[0]}</div>
                    <div className="score text-sm text-gray-600 font-medium">{data.values[0]} điểm</div>
                </div>

                {/* 3rd Place */}
                <div className="place-3 flex flex-col items-center mx-3">
                    <div className="avatar w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center border-2 border-yellow-700 overflow-hidden mb-2">
                        <img src={images.user} alt="User 3" className="w-full h-full object-cover" />
                    </div>
                    <div className="h-16 w-16 rounded-t-lg flex items-center justify-center bg-gradient-to-t from-yellow-700 to-yellow-600">
                        <span className="text-white font-bold text-lg">3</span>
                    </div>
                    <div className="name text-sm font-medium mt-1 text-gray-700">{data.labels[2]}</div>
                    <div className="score text-xs text-gray-500 font-medium">{data.values[2]} điểm</div>
                </div>
            </div>
            
            {/* List of other ranks */}
            <div className="other-ranks px-2 mt-2">
                {data.labels.slice(3).map((name, idx) => {
                    const position = idx + 4;
                    return (
                        <div key={position} className="rank-item flex items-center p-2 border-b border-gray-100">
                            <div className="position w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium text-sm mr-3">
                                {position}
                            </div>
                            <div className="avatar w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-3">
                                <img src={images.user} alt={`User ${position}`} className="w-full h-full object-cover" />
                            </div>
                            <div className="name flex-1 text-sm font-medium text-gray-700">{name}</div>
                            <div className="score text-sm font-medium text-gray-600">
                                {data.values[position-1]} điểm
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* Tab section to switch between daily/weekly/monthly */}
            <div className="rank-tabs flex border-t border-gray-200 mt-4 pt-2">
                <button className="flex-1 py-2 text-xs font-medium text-green-600 border-b-2 border-green-600">Hôm nay</button>
                <button className="flex-1 py-2 text-xs font-medium text-gray-500 hover:text-gray-700">Tuần này</button>
                <button className="flex-1 py-2 text-xs font-medium text-gray-500 hover:text-gray-700">Tháng này</button>
            </div>
        </div>
    );
}

export default Ranking;