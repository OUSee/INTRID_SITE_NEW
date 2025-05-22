// SLIDER START

const slides = document.querySelector('.slides');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const slideItems = document.querySelectorAll('.slide');

const firstClone = slideItems[0]?.cloneNode(true);
const lastClone = slideItems[slideItems.length - 1]?.cloneNode(true);
const hr = document.createElement('hr') 
slides.appendChild(firstClone);
slides.appendChild(hr)
slides.insertBefore(lastClone, slideItems[0]);

const slideCount = slideItems.length;
const height = slideItems[0].offsetHeight;

let currentIndex = 0; 
slides.style.transform = `translateY(-${currentIndex * (height + 1)}px)`;

function updateSlider() {
  const currheight = slideItems[0].offsetHeight;
  slides.style.transform = `translateY(-${currentIndex * (currheight + 1)}px)`;

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
  updateSlider()
});

// SLIDER END

// HORIZONTAL SLIDER

const SliderInIt = () => {};

document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('.tab-slider');

  const tabButtons = document.querySelector('.slider-with-tabs_tabs-buttons');
  const tabButtonsList = tabButtons.querySelectorAll('label.button-link');

  window.addEventListener('resize', () => {
    if (window.innerWidth > 600) {
      tabButtonsList.forEach((tabButton, index) => {
        const input = tabButton.querySelector(`#tab-slide-btn-${index + 1}`);
        input.addEventListener('click', () => {
          const activeSlider = document.querySelector(
            `#tab-slide-${index + 1}`
          );
          SliderHandler(activeSlider);
        });
      });

      const SliderHandler = (slider) => {
        const cards = slider.querySelectorAll('.tab-slider-card');
        const prevButton = document.querySelector(`.slider-arrow.prev`);
        const nextButton = document.querySelector(`.slider-arrow.next`);

        let currentIndex = 0;

        const updateSlider = () => {
          const sliderWidth = slider.offsetWidth;
          const slidesPerPage = Math.floor(sliderWidth / 255);
          const maxIndex = cards.length - slidesPerPage;
          const cardWidth = Math.floor(sliderWidth / slidesPerPage - 25);


          cards.forEach((card) => {
            card.style.minWidth = `${cardWidth}px`;
          });

          slider.style.transform = `translateX(-${currentIndex * (cardWidth + 25)}px)`;

          if (currentIndex === 0 || cards.length <= slidesPerPage) {
            prevButton.style.display = 'none';
          } else {
            prevButton.style.display = 'block';
          }

          if (
            currentIndex === maxIndex ||
            maxIndex <= 0 ||
            cards.length <= slidesPerPage
          ) {
            nextButton.style.display = 'none';
          } else {
            nextButton.style.display = 'block';
          }
        };

        prevButton.addEventListener('click', () => {
          currentIndex--;
          updateSlider();
        });

        nextButton.addEventListener('click', () => {
          const sliderWidth = slider.offsetWidth;
          const slidesPerPage = Math.floor(sliderWidth / 255);
          const maxIndex = Math.max(0, cards.length - slidesPerPage);
          const cardWidth = Math.floor(sliderWidth / slidesPerPage - 25);

          cards.forEach((card) => {
            card.style.minWidth = `${cardWidth}px`;
          });

          currentIndex++;
          updateSlider();
        });

        window.addEventListener('resize', updateSlider);
        updateSlider();
      };

      SliderHandler(document.querySelector(`#tab-slide-${1}`));
    }
  });

  if (window.innerWidth > 600) {
    tabButtonsList.forEach((tabButton, index) => {
      const input = tabButton.querySelector(`#tab-slide-btn-${index + 1}`);
      input.addEventListener('click', () => {
        const activeSlider = document.querySelector(`#tab-slide-${index + 1}`);
        SliderHandler(activeSlider);
      });
    });

    const SliderHandler = (slider) => {
      const cards = slider.querySelectorAll('.tab-slider-card');
      const prevButton = document.querySelector(`.slider-arrow.prev`);
      const nextButton = document.querySelector(`.slider-arrow.next`);

      let currentIndex = 0;

      const updateSlider = () => {
        const sliderWidth = slider.offsetWidth;
        const slidesPerPage = Math.floor(sliderWidth / 255);
        const maxIndex = cards.length - slidesPerPage;
        const cardWidth = Math.floor(sliderWidth / slidesPerPage - 25);

        


        cards.forEach((card) => {
          card.style.minWidth = `${cardWidth}px`;
        });

        slider.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

        if (currentIndex === 0 || cards.length <= slidesPerPage) {
          prevButton.style.display = 'none';
        } else {
          prevButton.style.display = 'block';
        }

        if (
          currentIndex === maxIndex ||
          maxIndex <= 0 ||
          cards.length <= slidesPerPage
        ) {
          nextButton.style.display = 'none';
        } else {
          nextButton.style.display = 'block';
        }
      };

      prevButton.addEventListener('click', () => {
        currentIndex--;
        updateSlider();
      });

      nextButton.addEventListener('click', () => {
        const sliderWidth = slider.offsetWidth;
        const slidesPerPage = Math.floor(sliderWidth / 255);
        const maxIndex = Math.max(0, cards.length - slidesPerPage);
        const cardWidth = Math.floor(sliderWidth / slidesPerPage - 25);

        cards.forEach((card) => {
          card.style.minWidth = `${cardWidth}px`;
        });

        currentIndex++;
        updateSlider();
      });

      window.addEventListener('resize', updateSlider);
      updateSlider();

  }
  
  SliderHandler(document.querySelector(`#tab-slide-${1}`))
  }

  });
