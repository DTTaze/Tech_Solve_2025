import React, { useState, useEffect, useRef, createRef } from "react";
import ReactPlayer from "react-player";
import "../styles/components/VideoSection.css";
import HeartButton from "./heartButton";
import CommentButton from "./commentButton";
import ShareButton from "./shareButton";
import CoinImg from "../assets/images/Coin";
import Timer from "../assets/images/Timer";
import { notification } from "antd";
// Component hiển thị số coin và timer
function CalcCoins({ coins, timer }) {
  const onReceiveCoins = () => {
    notification.success({
      message: "Receive coins success",
    });
  };
  return (
    <div
      onClick={onReceiveCoins}
      className="fixed top-4 right-4 sm:top-6 sm:right-6 flex flex-col gap-2 sm:gap-3 z-[1000]"
    >
      {/* Coins Display */}
      <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg border border-white/10">
        <div className="w-5 h-5 sm:w-6 sm:h-6">
          <CoinImg />
        </div>
        <span className="text-white font-medium text-base sm:text-lg">
          {coins}
        </span>
      </div>

      {/* Timer Display */}
      <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg border border-white/10">
        <div className="w-5 h-5 sm:w-6 sm:h-6">
          <Timer />
        </div>
        <span className="text-white font-medium text-base sm:text-lg">
          {timer}s
        </span>
      </div>
    </div>
  );
}

// Component xử lý tương tác với video (like, comment, share)
function InteractWithVideo({ video, index, updateLike, onShare, videoId }) {
  return (
    <div className="flex flex-col gap-2 sm:gap-3 pointer-events-auto mb-10">
      <HeartButton
        initialLikes={video.likes}
        onLike={(isLiked) => updateLike(index, isLiked)}
        className="bg-black/50 text-white border-none rounded-full p-2 sm:p-3 text-xl sm:text-2xl cursor-pointer transition-all duration-200 ease-in-out hover:scale-110"
      />
      <CommentButton
        comments={video.comments}
        className="bg-black/50 text-white border-none rounded-full p-2 sm:p-3 text-xl sm:text-2xl cursor-pointer transition-all duration-200 ease-in-out hover:scale-110"
      />
      <ShareButton
        onShare={onShare}
        VideoId={videoId}
        className="bg-black/50 text-white border-none rounded-full p-2 sm:p-3 text-xl sm:text-2xl cursor-pointer transition-all duration-200 ease-in-out hover:scale-110"
      />
    </div>
  );
}

// Component hiển thị thông tin video (avatar, username, caption)
function DescriptionVideo({ video }) {
  return (
    <div className="absolute bottom-24 sm:bottom-11 left-1/6 -translate-x-1/2 w-[100%] shadow-bg-blur sm:w-[420px] flex flex-col gap-3 sm:gap-4 text-white px-3 sm:px-4 pr-16 sm:pr-6">
      {/* User info section */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative">
          <img
            src={video.postedBy.avatar}
            alt={`${video.postedBy.username}'s avatar`}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/80 shadow-lg hover:border-white transition-all duration-300"
            onError={(e) => (e.target.src = "https://placehold.co/48x48")}
          />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <div className="flex flex-col">
          <span className="text-base sm:text-lg font-semibold tracking-wide">
            {video.postedBy.username}
          </span>
          <span className="text-xs sm:text-sm text-white/80">@username</span>
        </div>
      </div>

      {/* Caption section */}
      <div className="flex flex-col gap-2">
        <p className="text-sm sm:text-base leading-relaxed bg-black/40 p-2 sm:p-3 rounded-xl shadow-lg">
          {video.caption}
        </p>
      </div>
    </div>
  );
}

// Component chính: VideosSection
export default function VideosSection() {
  // Khởi tạo dữ liệu video với thuộc tính shares được khởi tạo là 0
  const [videoData, setVideoData] = useState([
    {
      id: 1,
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
      likes: 120,
      comments: 45,
      shares: 0,
      caption: "A cute bunny with butterfly wings! 🐰🦋",
      postedBy: {
        username: "johndoe",
        avatar: "https://example.com/avatar.jpg",
      },
    },
    {
      id: 2,
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
      likes: 85,
      comments: 30,
      shares: 0,
      caption: "Having fun with friends! 🎉",
      postedBy: {
        username: "janedoe",
        avatar: "https://example.com/avatar2.jpg",
      },
    },
  ]);

  const [user, setUser] = useState({ id: 1, username: "user1", coins: 0 });
  const [playingStates, setPlayingStates] = useState(null);
  const [isActuallyPlaying, setIsActuallyPlaying] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const intervalRef = useRef(null);

  // Sử dụng mảng ref cho ReactPlayer và container
  const videoRefs = useRef(videoData.map(() => createRef()));
  const containerRefs = useRef(videoData.map(() => createRef()));
  const observerRef = useRef(null);

  // Hàm cập nhật số lượt like
  const updateLike = (index, isLiked) => {
    setVideoData((prevData) => {
      const newData = [...prevData];
      const currentLikes = newData[index].likes;
      newData[index] = {
        ...newData[index],
        likes: isLiked ? currentLikes + 1 : currentLikes - 1,
      };
      return newData;
    });
  };

  const handleShare = async (videoId) => {
    try {
      await navigator.share({
        title: "Check out this video!",
        text: "Watch this amazing video on our app",
        url: window.location.href,
      });
      setVideoData((prev) =>
        prev.map((video) =>
          video.id === videoId ? { ...video, shares: video.shares + 1 } : video
        )
      );
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  // Đồng bộ isTimerRunning với trạng thái thực tế của video
  useEffect(() => {
    if (isActuallyPlaying && playingStates !== null) {
      setIsTimerRunning(true);
    } else {
      setIsTimerRunning(false);
    }
  }, [isActuallyPlaying, playingStates]);

  // Logic đồng hồ đếm ngược
  useEffect(() => {
    if (isTimerRunning) {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              setUser((prevUser) => ({
                ...prevUser,
                coins: prevUser.coins + 3,
              }));
              return 30;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isTimerRunning]);

  // IntersectionObserver: lựa chọn video có phần hiển thị nhiều nhất làm video active
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        let maxRatio = 0;
        let activeIndex = null;
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            activeIndex = containerRefs.current.findIndex(
              (ref) => ref.current === entry.target
            );
          }
        });
        // Nếu tìm được video active khác với video đang phát thì cập nhật trạng thái
        if (activeIndex !== null && activeIndex !== playingStates) {
          videoRefs.current.forEach((ref, i) => {
            if (i !== activeIndex && ref.current) {
              ref.current.seekTo(0);
            }
          });
          setPlayingStates(activeIndex);
          setIsActuallyPlaying(true);
        }
        // Nếu không có video nào đủ điều kiện thì dừng video đang active
        if (activeIndex === null && playingStates !== null) {
          setPlayingStates(null);
          setIsActuallyPlaying(false);
        }
      },
      { threshold: 0.75 }
    );

    // Cleanup observer khi component unmount
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [playingStates]);

  // Gắn observer cho container video khi chúng sẵn sàng
  useEffect(() => {
    containerRefs.current.forEach((ref) => {
      if (ref.current && observerRef.current) {
        observerRef.current.observe(ref.current);
      }
    });
  }, [videoData]);

  return (
    <div
      style={{ flexGrow: 1, backgroundColor: "lightgray" }}
      className="h-screen overflow-y-auto [scroll-snap-type:y_mandatory] [scroll-snap-align:start] video-section-container"
    >
      <CalcCoins coins={user.coins} timer={timer} />

      {videoData.map((video, index) => (
        <div
          key={video.id}
          ref={containerRefs.current[index]}
          className="h-screen flex snap-start justify-center items-center bg-[#141313] relative"
        >
          <ReactPlayer
            url={video.url}
            playing={index === playingStates && isActuallyPlaying}
            loop={true}
            controls={true}
            width="100%"
            height="100%"
            muted={true}
            style={{
              maxWidth: "min(400px, 90vw)",
              maxHeight: "min(750px, 90vh)",
              border: "1px solid black",
              borderRadius: "10px",
            }}
            ref={videoRefs.current[index]}
            onReady={() => {
              if (index === 0 && !isInitialized) {
                setPlayingStates(0);
                setIsActuallyPlaying(true);
                videoRefs.current[0].current.seekTo(0);
                setIsInitialized(true);
              }
            }}
            onPlay={() => {
              if (index === playingStates) {
                setIsActuallyPlaying(true);
              }
            }}
            onPause={() => {
              if (index === playingStates) {
                setIsActuallyPlaying(false);
              }
            }}
            onEnded={() => {
              if (index === playingStates) {
                setIsActuallyPlaying(false);
              }
            }}
          />

          <div className="absolute bottom-8 sm:bottom-10 right-4 sm:right-[60px] h-full flex justify-end items-end z-10">
            <InteractWithVideo
              video={video}
              index={index}
              updateLike={updateLike}
              onShare={handleShare}
              videoId={video.id}
            />
          </div>
          <DescriptionVideo video={video} />
        </div>
      ))}
    </div>
  );
}
