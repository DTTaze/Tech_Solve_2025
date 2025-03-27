import React, { useState, useEffect } from "react";
import Heart from '../assets/images/Heart'

export default function HeartButton ({initialLikes, onLike}) {

    const [heart, setHeart] = useState(false);
    const [likes, setLikes] = useState(initialLikes);

    useEffect(() => {
        setLikes(initialLikes);
      }, [initialLikes]);

    const handleLike = () => {
        setHeart(!heart);
        if (heart) {
            setLikes(likes - 1);
        } else {
            setLikes(likes + 1);
        }
        
        onLike(!heart);
    };

    return (
        <button className={`flex flex-col items-center ${
            heart 
              ? "text-red-500 scale-125" 
              : "text-gray-200 scale-100"
          } transition-transform duration-200 ease-in-out`}
          onClick={handleLike}
        >
            <Heart color={heart ? "#FF0000" : "#808080"} />
            <div className="text-white text-sm mt-1">{likes}</div>
        </button>
    )
}