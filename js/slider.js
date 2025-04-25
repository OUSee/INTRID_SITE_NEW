// SLIDER START

const slides = document.querySelector('.slides');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const slideItems = document.querySelectorAll('.slide');

const firstClone = slideItems[0].cloneNode(true);
const lastClone = slideItems[slideItems.length - 1].cloneNode(true);
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

  const tabSliderWithPagination = () => {
    const slider = document.querySelector('#cases-tabs-slider');
    const pagination = document.querySelector('#cases-pagination');
    const prevBtn = pagination.querySelector('.pagination--prev-btn')
    const nextBtn = pagination.querySelector('.pagination--next-btn')
    const navButtons = pagination.querySelectorAll('.pagination--btn-dot')
    const tabs = slider.querySelectorAll('.tab-content')
    const tabsHeaders = slider.querySelectorAll('.case-tab-button')
    let currentIndex = 0;

    
  
    const updateSlider = () => {
      const gap = window.innerWidth > 600 ? 40 : window.innerWidth > 440 ? 20 : 10;
      const transfotmTo = Math.floor(window.innerWidth > 440 ? window.innerWidth - 15 : window.innerWidth) * currentIndex ;
      slider.style.transform = `translateX(-${transfotmTo}px)`;
    }

    const nextSlide = ( ) => {
      navButtons[currentIndex].classList.remove('highlight')
      currentIndex = currentIndex === navButtons.length - 1  ? navButtons.length - 1 : currentIndex + 1  ;
      navButtons[currentIndex].classList.add('highlight')
      updateSlider();
    }

    const prevSlide = () => {
      navButtons[currentIndex].classList.remove('highlight')
      currentIndex = currentIndex > 1 ? currentIndex - 1 : 0;
      navButtons[currentIndex].classList.add('highlight')
      
      updateSlider()
    }
  
    navButtons.forEach((button, index) => {
      button.addEventListener('click', ()=> {
        navButtons[currentIndex].classList.remove('highlight')
        button.classList.add('highlight')
        currentIndex = index;
        updateSlider();
      })
    });

    function handleTouchStart(evt) {
      const firstTouch = evt.touches[0];
      xDown = firstTouch.clientX;
      yDown = firstTouch.clientY;
    }
    
    function handleTouchMove(evt) {
      if (!xDown || !yDown) {
        return;
      }
    
      const xUp = evt.touches[0].clientX;
      const yUp = evt.touches[0].clientY;
    
      const xDiff = xDown - xUp;
      const yDiff = yDown - yUp;
    
      if (Math.abs(xDiff) > Math.abs(yDiff)) { // горизонтальный свайп
        if (xDiff > 0) {
          // свайп влево — следующий слайд
          nextSlide();
        } else {
          // свайп вправо — предыдущий слайд
          prevSlide();
        }
      }
      // сброс координат
      xDown = null;
      yDown = null;
    }

    slider.addEventListener('touchstart', handleTouchStart, false)
    slider.addEventListener('touchmove', handleTouchMove, false)
  
    prevBtn.addEventListener('click', prevSlide )
    nextBtn.addEventListener('click', nextSlide )

    window.addEventListener('resize', updateSlider)
  }

  tabSliderWithPagination();

  });
