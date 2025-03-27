import { useState, useRef, useEffect } from "react";
import Comment_icon from '../assets/images/Comment'


const CommentButton = ({comments}) => {
  const [showComments, setShowComments] = useState(false);

  const modalRef = useRef(null); // Tạo ref để kiểm tra click ngoài

  // Xử lý sự kiện khi click ra ngoài modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowComments(false);
      }
    };

    if (showComments) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showComments]);


  return (
    <>
      <div className="flex flex-col items-center">
        <button className="comment" onClick={() => setShowComments(true)}>
            <Comment_icon/>
        </button>
        <div className="text-white text-sm mt-1">{comments}</div>
      </div>
      
      {showComments && (
        <div 
            className="fixed inset-0 bg-black/50 flex justify-center items-end"
            onClick={() => setShowComments(false)} // Click vào nền để đóng
        >
            {/* Ngăn sự kiện onClick lan ra ngoài */}
            <div 
            ref={modalRef}
            className="bg-white text-black p-5 w-full max-w-md rounded-t-lg"
            onClick={(e) => e.stopPropagation()} // Chặn sự kiện từ modal
            >
            <div className="comments">
                <p><strong>User1:</strong> Video hay quá!</p>
                <p><strong>User2:</strong> Cười xỉu 🤣</p>
            </div>
            </div>
        </div>
        )}

    </>
  );
};

export default CommentButton
