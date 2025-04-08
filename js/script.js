// SLIDER START

const slides = document.querySelector('.slides');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const slideItems = document.querySelectorAll('.slide');

// Clone first and last slides for infinite effect
const firstClone = slideItems[0].cloneNode(true);
const lastClone = slideItems[slideItems.length - 1].cloneNode(true);

// Add clones to the slides container
slides.appendChild(firstClone);
slides.insertBefore(lastClone, slideItems[0]);

// Re-select all slides after cloning
const allSlides = document.querySelectorAll('.slide');
const slideCount = allSlides.length;
const height = allSlides[0].offsetHeight;

let currentIndex = 1; // Start at the first original slide (after clone)
slides.style.transform = `translateY(-${currentIndex * height + 1}px)`;

// Add transition for smooth sliding
slides.style.transition = 'transform 0.5s ease';

function updateSlider() {
  slides.style.transform = `translateY(-${currentIndex * height + 1}px)`;

  // If we're at a clone, instantly jump to the original without animation
  if (currentIndex === 0) {
    setTimeout(() => {
      slides.style.transition = 'none';
      currentIndex = slideCount - 2;
      updateSlider();
      setTimeout(() => (slides.style.transition = 'transform 0.5s ease'), 50);
    }, 500);
  }

  if (currentIndex === slideCount - 1) {
    setTimeout(() => {
      slides.style.transition = 'none';
      currentIndex = 1;
      updateSlider();
      setTimeout(() => (slides.style.transition = 'transform 0.5s ease'), 50);
    }, 500);
  }
}

nextBtn.addEventListener('click', () => {
  clearInterval(autoScrollIntervalId);
  currentIndex++;
  updateSlider();
});

prevBtn.addEventListener('click', () => {
  clearInterval(autoScrollIntervalId);
  currentIndex--;
  updateSlider();
});

let autoScrollIntervalId;

function startAutoScroll() {
  autoScrollIntervalId = setInterval(() => {
    currentIndex++;
    updateSlider();
  }, 3000);
}

startAutoScroll();

// Reset slider position on window resize (optional)
window.addEventListener('resize', () => {
  const newHeight = allSlides[0].offsetHeight;
  slides.style.transform = `translateY(-${currentIndex * newHeight}px)`;
});

// SLIDER END


// HORIZONTAL SLIDER


document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('.tab-slider');

  sliders.forEach((slider) => {
      const cards = slider.querySelectorAll('.tab-slider-card');
      const prevButton = document.querySelector(`.slider-arrow.prev[data-slider="${slider.id}"]`);
      const nextButton = document.querySelector(`.slider-arrow.next[data-slider="${slider.id}"]`);

      let currentIndex = 0;

      const updateSlider = () => {
          const sliderWidth = slider.offsetWidth;
          const cardWidth = cards[0].offsetWidth;
          const slidesPerPage = Math.floor(sliderWidth / cardWidth);
          const maxIndex = Math.max(0, cards.length - slidesPerPage);

          slider.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

          prevButton.disabled = currentIndex === 0;
          nextButton.disabled = currentIndex === maxIndex;
      };

      prevButton.addEventListener('click', () => {
          currentIndex = Math.max(0, currentIndex - 1);
          updateSlider();
      });

      nextButton.addEventListener('click', () => {
          const sliderWidth = slider.offsetWidth;
          const cardWidth = cards[0].offsetWidth;
          const slidesPerPage = Math.floor(sliderWidth / cardWidth);
          const maxIndex = Math.max(0, cards.length - slidesPerPage);

          currentIndex = Math.min(maxIndex, currentIndex + 1);
          updateSlider();
      });

      window.addEventListener('resize', updateSlider);
      updateSlider();
  });
});


// opacity header onscroll

window.addEventListener('scroll', function () {
  const header = document.getElementById('header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// popup logic

const popupTriggers = document.querySelectorAll('.popup-trigger');
console.log(popupTriggers[0].dataset.popup);
popupTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const popupId = trigger.dataset.popup;
    openPopup(popupId);
  });
});

const openPopup = (id) => {
  console.log('open ', id);
  const popup = document.getElementById(id);
  console.log(popup);
  popup.classList.add('open');

  popup.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('dialog -', e.target);
    if (e.target.classList.contains('close-button') || e.target.id == id) {
      popup.classList.remove('open');
    }
  });
};

console.log(1);
