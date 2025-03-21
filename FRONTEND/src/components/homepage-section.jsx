import { useState, useEffect, useRef, useMemo } from "react";
import "../styles/components/homepage-section.css";


function SectionHero() {
    const [index, setIndex] = useState(0);
    const [showText, setShowText] = useState(false); 

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
        const interval = setInterval(() => {
            setShowText(false);
            setTimeout(() => {
                setIndex((prevIndex) => (prevIndex + 1) % images.length);
                setShowText(true); 
            }, 300); 
        }, 3000);

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
    }, [index, titles]);

    return (
        <section className="section hero h-screen w-screen flex justify-center items-center">
            <header className="text-4xl w-1/2 h-full z-10 text-[#059212] flex justify-center items-center">
                <h1 
                    id="heroTitle" 
                    className={`transition-opacity duration-1000 ${showText ? "opacity-100" : "opacity-0"}`}
                >
                    {formattedTitle}
                </h1>
            </header>
            <div className="relative w-1/2 h-full flex justify-center items-center">
                {images.map((src, i) => (
                    <img
                        key={i}
                        src={src}
                        alt={`Slide ${i + 1}`}
                        className={`w-4/5 h-[70%] object-cover rounded-[20px] absolute transition-opacity duration-1000 ${i === index ? "opacity-100" : "opacity-0"}`}
                    />
                ))}
            </div>
        </section>
    );
}


function SectionLeft({ imagePath, H2Text, PText, ButtonText }) {
    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    }
                });
            },
            { threshold: 0.25 }
        );

        observer.observe(section);

        return () => observer.unobserve(section);
    }, []);

    return (
        <section ref={sectionRef} className="w-screen h-[90vh] overflow-hidden flex justify-evenly items-center section-left">
            <div className={`w-2/5 h-4/5 overflow-hidden rounded-[20px] transform transition-transform duration-1000 ${isVisible ? "translate-x-0" : "-translate-x-full"}`}>
                <img src={imagePath} alt="ảnh mô tả" className="w-full h-full object-cover" />
            </div>
            <header className={`w-2/5 h-1/2 flex flex-col justify-between transform transition-transform duration-1000 ${isVisible ? "translate-x-0" : "translate-x-full"}`}>
                <h2 className="text-[30px] text-[#1F7D53]">{H2Text}</h2>
                <p className="text-[20px]">{PText}</p>
                <button>
                    {ButtonText}
                </button>
            </header>
        </section>
    );
}

function SectionRight({ imagePath, H2Text, PText, ButtonText }) {
    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    }
                });
            },
            { threshold: 0.25 }
        );

        observer.observe(section);

        return () => observer.unobserve(section);
    }, []);

    return (
        <section ref={sectionRef} className="w-screen h-[90vh] overflow-hidden flex justify-evenly items-center section section-right">
            <header className={`w-2/5 h-1/2 flex flex-col justify-between transform transition-transform duration-1000 ${isVisible ? "translate-x-0" : "translate-x-full"}`}>
                <h2 className="text-[30px] text-[#1F7D53]">{H2Text}</h2>
                <p className="text-[20px]">{PText}</p>
                <button>
                    {ButtonText}
                </button>
            </header>
            <div className={`w-2/5 h-4/5 overflow-hidden rounded-[20px] transform transition-transform duration-1000 ${isVisible ? "translate-x-0" : "-translate-x-full"}`}>
                <img src={imagePath} alt="ảnh mô tả" className="w-full h-full object-cover" />
            </div>
        </section>
    );
}

function Footer() {
    return <footer className="footer">@Created by ABKT</footer>;
}

function HomepageSection() {
    return (
        <>
            <SectionHero/>
            <SectionLeft 
                imagePath="../src/assets/images/anh-tho.jpg"
                H2Text="Hoàn thành nhiệm vụ, tích điểm xanh"
                PText="Chọn nhiệm vụ phù hợp, hoàn thành thử thách xanh và nhận điểm thưởng. Càng nhiều nhiệm vụ hoàn thành, bạn càng đóng góp nhiều hơn cho hành tinh!"
                ButtonText="Khám phá nhiệm vụ"
            />
            <SectionRight 
                imagePath="../src/assets/images/anh-tho.jpg"
                H2Text="Chợ Trao Đổi - Biến Điểm Thành Hành Động"
                PText="Dùng điểm tích lũy để đổi lấy những sản phẩm bền vững, giúp bạn tiếp tục duy trì lối sống xanh và bảo vệ hành tinh."
                ButtonText="Khám phá chợ trao đổi"
            />
            <SectionLeft className="Sai-gon-xanh"
                imagePath="../src/assets/images/hand-drawn-people-planting-a-tree.jpg"
                H2Text="Kết Nối Cộng Đồng - Lan Tỏa Hành Động Xanh"
                PText="Chia sẻ thành tích, tham gia thử thách cùng bạn bè và truyền cảm hứng đến cộng đồng. Mỗi hành động nhỏ tạo nên một phong trào lớn!"
                ButtonText="Tham gia ngay"
            />
            <Footer/>
        </>
    );
}

export { SectionHero, SectionLeft, SectionRight, Footer };
export default HomepageSection; 
