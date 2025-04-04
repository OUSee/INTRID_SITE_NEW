// slider

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

// horizontal slider tab-slider


document.addEventListener('DOMContentLoaded', function() {
    const sliderContainer = document.getElementById('tab-slider');
    const sliderWrapper = document.getElementById('tab-view');
    const cards = document.querySelectorAll('.tab-slider-card');
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');
    
    let currentIndex = 0;
    let visibleCards = 1;
    const cardMinWidth = 480;
    const cardMargin = 15;
    
    // Рассчитываем количество видимых карточек
    function calculateVisibleCards() {
        const containerWidth = sliderContainer.offsetWidth;
        visibleCards = Math.max(1, Math.floor(containerWidth / (cardMinWidth + cardMargin)));
        
        // Обновляем ширину карточек
        const cardWidth = (containerWidth / visibleCards) - cardMargin;
        cards.forEach(card => {
            card.style.minWidth = '0';
            card.style.width = `${cardWidth}px`;
        });
        
        updateSlider();
    }
    
    // Обновляем позицию слайдера
    function updateSlider() {
        const cardWidth = cards[0].offsetWidth + cardMargin;
        const offset = -currentIndex * cardWidth * visibleCards;
        sliderWrapper.style.transform = `translateX(${offset}px)`;
        
        // Обновляем точки навигации
        updateDots();
        
        // Управляем видимостью кнопок
        prevBtn.style.display = currentIndex === 0 ? 'none' : 'flex';
        nextBtn.style.display = currentIndex >= Math.ceil(cards.length / visibleCards) - 1 ? 'none' : 'flex';
    }
    
    // Обновляем активные точки
    function updateDots() {
        const totalGroups = Math.ceil(cards.length / visibleCards);
        dots.forEach((dot, index) => {
            dot.style.display = index < totalGroups ? 'block' : 'none';
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Следующая группа слайдов
    function nextSlide() {
        const totalGroups = Math.ceil(cards.length / visibleCards);
        if (currentIndex < totalGroups - 1) {
            currentIndex++;
            updateSlider();
        }
    }
    
    // Предыдущая группа слайдов
    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    }
    
    // Обработчики событий
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Навигация по точкам
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            currentIndex = parseInt(this.getAttribute('data-index'));
            updateSlider();
        });
    });
    
    // Навигация с клавиатуры
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
    });
    
    // Обработчик изменения размера окна
    window.addEventListener('resize', function() {
        calculateVisibleCards();
    });
    
    // Инициализация
    calculateVisibleCards();
    updateSlider();
});


// Reset slider position on window resize (optional)
window.addEventListener('resize', () => {
  const newHeight = allSlides[0].offsetHeight;
  slides.style.transform = `translateY(-${currentIndex * newHeight}px)`;
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
