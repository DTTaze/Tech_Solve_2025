window.addEventListener("scroll", function () {
    const header = document.querySelector(".header");

    if (window.scrollY > 50) { 
        header.classList.add("header--sticky");
    } else {
        header.classList.remove("header--sticky");
    }
});

const images = document.querySelectorAll(".fade-img");
const titles = [
    "Hành động nhỏ, tác động lớn!",  
    "Trồng cây hôm nay, hưởng trái ngọt mai sau!", 
    "Bảo vệ động vật biển, bảo vệ chính chúng ta!" 
];

const heroTitle = document.getElementById("heroTitle");
let index = 0;

function changeImage() {
    images[index].classList.remove("active");
    index = (index + 1) % images.length;
    images[index].classList.add("active");

    heroTitle.style.opacity = 0; 
    setTimeout(() => {
        heroTitle.textContent = titles[index];
        heroTitle.style.opacity = 1; 
    }, 500); 
}

setInterval(changeImage, 3000); 

document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll("section");
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.25 }
    );
  
    sections.forEach((section) => observer.observe(section));
});