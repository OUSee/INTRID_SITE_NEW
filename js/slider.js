// SLIDER START
document.addEventListener('DOMContentLoaded', () => {
  try {
    const slides = document.querySelector('.slides');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const slideItems = document.querySelectorAll('.slide');

    if (!slides || !slideItems.length) {
      return;
    }

    const firstClone = slideItems[0]?.cloneNode(true);
    const lastClone = slideItems[slideItems.length - 1]?.cloneNode(true);
    const hr = document.createElement('hr');

    slides.insertBefore(lastClone, slideItems[0]);
    slides.appendChild(firstClone);
    slides.appendChild(hr);

    const allSlides = slides.querySelectorAll('.slide');

    const slideCount = slideItems.length;
    const height = slideItems[0].offsetHeight;

    let currentIndex = 0;
    slides.style.transform = `translateY(-${currentIndex * (height + 1)}px)`;

    let isAutoScrollPaused = false;
    slides.addEventListener('mouseenter', () => {
      isAutoScrollPaused = true;
      clearInterval(autoScrollIntervalId);
    });

    slides.addEventListener('mouseleave', () => {
      isAutoScrollPaused = false;
      startAutoScroll();
    });

    function updateSlider() {
      const currentHeight = slideItems[0].offsetHeight;
      slides.style.transform = `translateY(-${
        currentIndex * (currentHeight + 1)
      }px)`;

      if (currentIndex >= allSlides.length - 1) {
        setTimeout(() => {
          slides.style.transition = 'none';
          currentIndex = 1; // Переходим к последнему оригинальному слайду
          slides.style.transform = `translateY(-${currentIndex * height}px)`;
          setTimeout(
            () => (slides.style.transition = 'transform 0.5s ease'),
            50
          );
        }, 500);
      } else if (currentIndex <= 0) {
        setTimeout(() => {
          slides.style.transition = 'none';
          currentIndex = slideCount - 1; // Переходим к предпоследнему оригинальному слайду
          slides.style.transform = `translateY(-${currentIndex * height}px)`;
          setTimeout(
            () => (slides.style.transition = 'transform 0.5s ease'),
            50
          );
        }, 500);
      }

      // if (currentIndex === 0) {
      //   setTimeout(() => {
      //     slides.style.transition = 'none';
      //     currentIndex = slideCount - 2;
      //     updateSlider();
      //     setTimeout(
      //       () => (slides.style.transition = 'transform 0.5s ease'),
      //       50
      //     );
      //   }, 500);
      // }

      // if (currentIndex === slideCount - 1) {
      //   setTimeout(() => {
      //     slides.style.transition = 'none';
      //     currentIndex = 1;
      //     updateSlider();
      //     setTimeout(
      //       () => (slides.style.transition = 'transform 0.5s ease'),
      //       50
      //     );
      //   }, 500);
      // }
    }

    nextBtn.addEventListener('click', () => {
      clearInterval(autoScrollIntervalId);
      currentIndex++;
      updateSlider();
      resetAutoScroll();
    });

    prevBtn.addEventListener('click', () => {
      clearInterval(autoScrollIntervalId);
      currentIndex--;
      updateSlider();
      resetAutoScroll();
    });

    let autoScrollIntervalId;

    function startAutoScroll() {
      if (isAutoScrollPaused) return;
      autoScrollIntervalId = setInterval(() => {
        currentIndex++;
        updateSlider();
      }, 3000);
    }

    function resetAutoScroll() {
      clearInterval(autoScrollIntervalId);
      startAutoScroll();
    }

    // Инициализация
    slides.style.transition = 'transform 0.5s ease';
    startAutoScroll();

    window.addEventListener('resize', () => {
      updateSlider();
    });
  } catch (err) {
    console.log('=> err', err);
  }
});

// SLIDER END

// HORIZONTAL SLIDER

const SliderInIt = () => {};

document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('.tab-slider');

  const tabButtons = document.querySelector('.prices-block--buttons, .slider-with-tabs_tabs-buttons');

  if (!tabButtons) {
    return;
  }

  const tabButtonsList = tabButtons.querySelectorAll('label.button-link');

  window.addEventListener('resize', () => {
    if (window.innerWidth > 600) {
      tabButtonsList.forEach((tabButton, index) => {
        const input = tabButton.querySelector(`#tab-slide-btn-${index + 1}`);
        input.addEventListener('change', () => {
          const activeSlider = document.querySelector(
            `#tab-slide-${index + 1}`
          );
          SliderHandler(activeSlider);
        });
      });

      const SliderHandler = (slider) => {
        const cards = slider.querySelectorAll('.tab-slider-card, .card--tab');
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

          slider.style.transform = `translateX(-${
            currentIndex * (cardWidth + 25)
          }px)`;

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
      input.addEventListener('change', () => {
        const activeSlider = document.querySelector(`#tab-slide-${index + 1}`);
        SliderHandler(activeSlider);
      });
    });

    const SliderHandler = (slider) => {
      const cards = slider.querySelectorAll('.tab-slider-card, .card--tab');
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