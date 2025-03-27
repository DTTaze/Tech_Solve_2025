import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import '../styles/components/VideoSection.css';
import HeartButton from './heartButton';
import CommentButton from './commentButton';
import ShareButton from './shareButton';
import CoinImg from "../assets/images/Coin"
import Timer from "../assets/images/Timer"

export default function VideosSection() {
  const [videoData, setVideoData] = useState([
    {
      id: 1,
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
      likes: 120,
      comments: 45,
      caption: "A cute bunny with butterfly wings! 🐰🦋",
      postedBy: { username: "johndoe", avatar: "https://example.com/avatar.jpg" },
    },
    {
      id: 2,
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
      likes: 85,
      comments: 30,
      caption: "Having fun with friends! 🎉",
      postedBy: { username: "janedoe", avatar: "https://example.com/avatar2.jpg" },
    },
  ]);

  const [playingStates, setPlayingStates] = useState(null); // Video đang trong viewport
  const [isActuallyPlaying, setIsActuallyPlaying] = useState(false); // Video thực sự đang phát
  const [timer, setTimer] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const intervalRef = useRef(null);
  const [user, setUser] = useState({ id: 1, username: 'user1', coins: 0 });
  const videoRefs = useRef([]);
  const observerRef = useRef(null);

  useEffect(() => {
    videoRefs.current = videoData.map((_, i) => videoRefs.current[i] || React.createRef());
  }, [videoData]);

  // Đồng bộ isTimerRunning với trạng thái thực tế của video
  useEffect(() => {
    setIsTimerRunning(isActuallyPlaying);
  }, [isActuallyPlaying]);

  // Logic đồng hồ đếm ngược
  useEffect(() => {
    if (isTimerRunning) {
      // Chỉ tạo interval nếu chưa có
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          console.log("Timer tick");
          setTimer((prev) => {
            if (prev <= 1) {
              setUser((prevUser) => {
            console.log("Adding 3 coins");
            return { ...prevUser, coins: prevUser.coins + 3 };
          });             
              return 30;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } else {
      // Dọn dẹp interval khi đồng hồ dừng
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  
    // Cleanup khi component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isTimerRunning]);

  const updateLike = (index, isLiked) => {
    setVideoData((prevData) => {
      const newData = [...prevData];
      const currentLikes = newData[index].likes;
      newData[index] = { ...newData[index], likes: isLiked ? currentLikes + 1 : currentLikes - 1 };
      return newData;
    });
  };

  // IntersectionObserver để xác định video trong viewport
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = videoRefs.current.findIndex(
            (ref) => ref?.getInternalPlayer() === entry.target
          );
          if (index === -1) return;

          if (entry.isIntersecting) {
            if (playingStates !== index) {
              if (playingStates !== null && videoRefs.current[playingStates]?.current) {
                videoRefs.current[playingStates].current.seekTo(0);
                setIsActuallyPlaying(false); // Dừng phát video cũ
              }
              setPlayingStates(index);
              // Không tự động play, chờ người dùng hoặc logic khác
            }
          } else if (index === playingStates) {
            setPlayingStates(null);
            setIsActuallyPlaying(false); // Dừng khi ra khỏi viewport
            if (videoRefs.current[index]?.current) {
              videoRefs.current[index].current.seekTo(0);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [playingStates, videoData]);

  return (
    <div
      style={{ flexGrow: 1, backgroundColor: 'lightgray' }}
      className="h-screen overflow-y-auto [scroll-snap-type:y_mandatory] [scroll-snap-align:start] video-section-container"
    >
      <div className="fixed top-[10%] right-[5%] bg-black/70 text-white p-2 rounded z-[1000]">
        <div className='flex gap-1' >
          <CoinImg/>
          <p className='text-xl'>- {user.coins}</p>
        </div>
        <div className='flex'>
          <Timer/>
          <p className='text-xl'>- {timer}s</p>
        </div>
      </div>

      {videoData.map((video, index) => (
        <div
          key={video.id}
          style={{
            height: '100vh',
            display: 'flex',
            scrollSnapAlign: 'start',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgb(20, 19, 19)',
            position: 'relative',
          }}
        >
          <ReactPlayer
            url={video.url}
            playing={index === playingStates && isActuallyPlaying} // Chỉ phát khi trong viewport và thực sự đang play
            loop={true}
            controls={true}
            width="100%"
            height="100%"
            style={{ maxWidth: '400px', maxHeight: '750px', border: '1px solid black', borderRadius: '10px' }}
            ref={(el) => (videoRefs.current[index] = el)}
            onReady={() => {
              if (videoRefs.current[index] && observerRef.current) {
                observerRef.current.observe(videoRefs.current[index].getInternalPlayer());
              }
            }}
            onPlay={() => {
              if (index === playingStates) {
                setIsActuallyPlaying(true); // Bắt đầu phát
              }
            }}
            onPause={() => {
              setIsActuallyPlaying(false); // Dừng phát
            }}
            onEnded={() => {
              setIsActuallyPlaying(false); // Khi video kết thúc
            }}
          />

          <div className="absolute bottom-10 right-[60px] h-full flex justify-end items-end pointer-events-none">

          <div className="flex items-center justify-between">
                {/* Avatar và username */}
                <div className="flex items-center space-x-2">
                  <img
                    src={video.postedBy.avatar}
                    alt={`${video.postedBy.username}'s avatar`}
                    className="w-10 h-10 rounded-full border-2 border-white"
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/40')} // Fallback nếu ảnh lỗi
                  />
                  <span className="text-base font-semibold">{video.postedBy.username}</span>
                </div>
              {/* Caption */}
              <div className="mt-2 text-sm bg-black/50 p-2 rounded-lg">{video.caption}</div>
            </div>

            <div className="flex flex-col gap-3 pointer-events-auto">
              <HeartButton
                initialLikes={video.likes}
                onLike={(isLiked) => updateLike(index, isLiked)}
                className="bg-black/50 text-white border-none rounded-full p-3 text-2xl cursor-pointer transition-all duration-200 ease-in-out hover:scale-110"
              />
              <CommentButton
                comments={video.comments}
                className="bg-black/50 text-white border-none rounded-full p-3 text-2xl cursor-pointer transition-all duration-200 ease-in-out hover:scale-110"
              />
              <ShareButton
                className="bg-black/50 text-white border-none rounded-full p-3 text-2xl cursor-pointer transition-all duration-200 ease-in-out hover:scale-110"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}