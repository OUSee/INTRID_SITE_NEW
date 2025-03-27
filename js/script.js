// slider

const slides = document.querySelector('.slides');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const slide = document.querySelector('.slide')

let currentIndex = 0;

const slideCount = document.querySelectorAll('.slide').length;
const height = slide.offsetHeight;

function updateSlider() {
    slides.style.transform = `translateY(-${currentIndex * (height) + 2}px)`;
}

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slideCount;
    updateSlider();
});

prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slideCount) % slideCount;
    updateSlider();
});

// opacity header onscroll

window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    if (window.scrollY > 50) { 
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });