import { useState, useEffect, useRef, useMemo } from "react";
import "../styles/components/homepage-section.css";


function SectionHero() {
    const [index, setIndex] = useState(0);
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
            setIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const formattedTitle = useMemo(() => {
        return titles[index].split(",").map((line, i, arr) => (
            <span key={i}>
                {line}
                {i !== arr.length - 1 && ","} {/* Giữ dấu phẩy */}
                {i !== arr.length - 1 && <br />} {/* Xuống dòng */}
            </span>
        ));
    }, [index, titles]);

    return (
        <section className="section hero">
            <header>
                <h1 id="heroTitle" className="fade-text">{formattedTitle}</h1>
            </header>
            <div className="container">
                {images.map((src, i) => (
                    <img
                        key={i}
                        src={src}
                        alt={`Slide ${i + 1}`}
                        className={`fade-img ${i === index ? "active" : ""}`}
                    />
                ))}
            </div>
        </section>
    );
}

function SectionLeft({ imagePath, H2Text, PText, ButtonText }) {
    const sectionRef = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        section.classList.add("active");
                    }
                });
            },
            { threshold: 0.25 }
        );

        observer.observe(section);

        return () => observer.unobserve(section); 
    }, []);

    return (
        <section ref={sectionRef} className="section section-left">
            <div className="background">
                <img src={imagePath} alt="ảnh mô tả" />
            </div>
            <header>
                <h2>{H2Text}</h2>
                <p>{PText}</p>
                <button>{ButtonText}</button>
            </header>
        </section>
    );
}

function SectionRight({ imagePath, H2Text, PText, ButtonText }) {
    const sectionRef = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        section.classList.add("active");
                    }
                });
            },
            { threshold: 0.25 }
        );

        observer.observe(section);

        return () => observer.unobserve(section);
    }, []);

    return (
        <section ref={sectionRef} className="section section-right">
            <header>
                <h2>{H2Text}</h2>
                <p>{PText}</p>
                <button>{ButtonText}</button>
            </header>
            <div className="background">
                <img src={imagePath} alt="ảnh mô tả" />
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
