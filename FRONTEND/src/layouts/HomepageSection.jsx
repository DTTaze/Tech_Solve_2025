import { useState, useEffect, useRef, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/components/HomepageSection.css";
import { AuthContext } from "../contexts/auth.context";
import Loader from "../components/ui/Loader";

function SectionHero() {
    const [index, setIndex] = useState(0);
    const [showText, setShowText] = useState(true);

    const titles = [
        "Hành động nhỏ, tác động lớn!",
        "Trồng cây hôm nay, hưởng trái ngọt mai sau!",
        "Bảo vệ động vật biển, bảo vệ chính chúng ta!"
    ];
    const images = [
        "../src/assets/images/pick-up-trash.jpg",
        "../src/assets/images/plant-a-tree.jpg",
        "../src/assets/images/turtle.jpg"
    ];

    useEffect(() => {
        const changeSlide = () => {
            setShowText(false);
            setTimeout(() => {
                setIndex((prevIndex) => (prevIndex + 1) % images.length);
                setShowText(true);
            }, 500);
        };

        const interval = setInterval(changeSlide, 3000);

        return () => clearInterval(interval);
    }, []);

    const formattedTitle = useMemo(() => {
        return titles[index].split(",").map((line, i, arr) => (
            <span key={i}>
                {line}
                {i !== arr.length - 1 && ","}
                {i !== arr.length - 1 && <br />}
            </span>
        ));
    }, [index]);

    return (
        <section className="relative min-h-screen w-full flex flex-col lg:flex-row justify-center items-center p-4 sm:p-6 lg:p-12 overflow-hidden">
            <header className="w-full lg:w-1/2 flex justify-center items-center text-center font-bold text-lg sm:text-xl md:text-2xl lg:text-4xl xl:text-5xl text-[#059212] leading-tight px-4">
                <h1 id="heroTitle" className={`transition-opacity duration-500 ${showText ? "opacity-100" : "opacity-0"}`}>
                    {formattedTitle}
                </h1>
            </header>
            <div className="relative w-full lg:w-1/2 flex justify-center items-center h-[500px] sm:h-[250px] md:h-[350px] lg:h-[450px] xl:h-[600px]">
                {images.map((src, i) => (
                    <img key={i} src={src} alt={`Slide ${i + 1}`} className={`w-full h-full object-cover rounded-2xl aspect-[16/9] absolute left-1/2 transform -translate-x-1/2 transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`} />          
                ))}
            </div>
        </section>
    );
}

function Section({ imagePath, H2Text, PText, ButtonText, path, reverse }) {
    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    }
                });
            },
            { threshold: 0.1 }
        );

        observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef} 
            className={`w-full min-h-[60vh] sm:min-h-[80vh] flex flex-col lg:flex-row ${reverse ? "lg:flex-row-reverse" : ""} items-center justify-center gap-6 sm:gap-8 lg:gap-12 p-4 sm:p-6 lg:p-8 section`}
        >
            <img
                src={imagePath}
                alt="ảnh mô tả"
                className={`h-full sm:h-3/5 lg:h-100 overflow-hidden transform transition-transform duration-1000 ${isVisible ? "translate-x-0" : reverse ? "translate-x-full" : "-translate-x-full"}`}
            />
            <header 
                className={`w-full sm:w-4/5 lg:w-2/5 max-sm:items-center flex flex-col justify-center sm:items-center gap-4 sm:gap-6 text-center lg:text-left transform transition-transform duration-1000 ${isVisible ? "translate-x-0" : reverse ? "-translate-x-full" : "translate-x-full"}`}
            >
                <h2 className="text-xl sm:text-2xl lg:text-[30px] text-[#1F7D53] font-semibold">
                    {H2Text}
                </h2>
                <p className="text-sm sm:text-base lg:text-[20px] text-gray-700">
                    {PText}
                </p>
                <button onClick={() => {
                        if (auth.isAuthenticated) {
                            navigate(path);
                            window.scrollTo(0, 0);
                        } else {
                            navigate("/register");
                            window.scrollTo(0, 0);
                        }
                    }}>
                    {ButtonText}
                </button>
            </header>
        </section>
    );
}

function HomepageSection() {
    return (
        <>
            <SectionHero />
            <Section 
                imagePath="../src/assets/images/Nhiemvu.png"
                H2Text="Hoàn thành nhiệm vụ, tích điểm xanh"
                PText="Chọn nhiệm vụ phù hợp, hoàn thành thử thách xanh và nhận điểm thưởng. Càng nhiều nhiệm vụ hoàn thành, bạn càng đóng góp nhiều hơn cho hành tinh!"
                path = "/missions"
                ButtonText="Khám phá nhiệm vụ"
            />
            <Section 
                imagePath="../src/assets/images/Cho-trao-doi.png"
                H2Text="Chợ Trao Đổi - Biến Điểm Thành Hành Động"
                PText="Dùng điểm tích lũy để đổi lấy những sản phẩm bền vững, giúp bạn tiếp tục duy trì lối sống xanh và bảo vệ hành tinh."
                path="/market"
                ButtonText="Khám phá chợ trao đổi"
                reverse
            />
            <Section 
                imagePath="../src/assets/images/hand-drawn-people-planting-a-tree.jpg"
                H2Text="Kết Nối Cộng Đồng - Lan Tỏa Hành Động Xanh"
                PText="Chia sẻ thành tích, tham gia thử thách cùng bạn bè và truyền cảm hứng đến cộng đồng. Mỗi hành động nhỏ tạo nên một phong trào lớn!"
                path="/register"
                ButtonText="Tham gia ngay"
            />
        </>
    );
}

export default HomepageSection;