// slider

const slides = document.querySelector('.slides');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const slide = document.querySelector('.slide')

let currentIndex = 0;

const slideCount = document.querySelectorAll('.slide').length;
const height = slide.offsetHeight;

function updateSlider() {
    slides.style.transform = `translateY(-${currentIndex * (height) + 1}px)`;
}

nextBtn.addEventListener('click', () => {
  clearInterval(autoScrollIntervalId); // Stop autoscroll on manual navigation
  if (currentIndex < slideCount - 2) { // Move to next slide if not at the end
      currentIndex++;
  } else { // Roll back to the start if at the end
      currentIndex = 0;
  }
  updateSlider();
});

prevBtn.addEventListener('click', () => {
  clearInterval(autoScrollIntervalId); // Stop autoscroll on manual navigation
  if (currentIndex > 0) { // Move to previous slide if not at the start
      currentIndex--;
  } else { // Roll back to the end if at the start
      currentIndex = slideCount - 2; // Adjusted to show two slides at once
  }
  updateSlider();
});

function startAutoScroll() {
  autoScrollIntervalId = setInterval(() => {
    if (currentIndex < slideCount - 2) { // Move to next slide if not at the end
      currentIndex++;
    } else { // Roll back to the start if at the end
        currentIndex = 0;
    }
  updateSlider();
  }, 5000);
}

startAutoScroll();

// opacity header onscroll

window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    if (window.scrollY > 50) { 
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });