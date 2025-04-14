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

const SliderInIt = () => {}


document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('.tab-slider');

  const tabButtons = document.querySelector('.slider-with-tabs_tabs-buttons');
  const tabButtonsList = tabButtons.querySelectorAll('label.button-link');


  window.addEventListener('resize', ()=>{
    if(window.innerWidth > 600){
      tabButtonsList.forEach((tabButton, index) => {
        const input = tabButton.querySelector(`#tab-slide-btn-${index+1}`)
        input.addEventListener('click', () => {
          const activeSlider = document.querySelector(`#tab-slide-${index+1}`)
          SliderHandler(activeSlider)
        })
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
          const cardWidth = Math.floor(sliderWidth / slidesPerPage -25) ;
  
  
    
          cards.forEach((card) => {
            card.style.minWidth = `${cardWidth}px`;
          })
          
          slider.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
  
          if(currentIndex === 0 || cards.length <= slidesPerPage){
            prevButton.style.display = 'none';
          }
          else{
            prevButton.style.display = 'block';
          }
      
          if(currentIndex === maxIndex || maxIndex <= 0 || cards.length <= slidesPerPage){
            nextButton.style.display = 'none'
          }
          else{
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
          const cardWidth = Math.floor(sliderWidth / slidesPerPage -25) ;
  
          cards.forEach((card) => {
            card.style.minWidth = `${cardWidth}px`;
          })
  
          currentIndex++;
          updateSlider();
        });
  
        window.addEventListener('resize', updateSlider);
        updateSlider();
    }
  
    SliderHandler(document.querySelector(`#tab-slide-${1}`))
    }
  })

  if(window.innerWidth > 600){
    tabButtonsList.forEach((tabButton, index) => {
      const input = tabButton.querySelector(`#tab-slide-btn-${index+1}`)
      input.addEventListener('click', () => {
        const activeSlider = document.querySelector(`#tab-slide-${index+1}`)
        SliderHandler(activeSlider)
      })
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
        const cardWidth = Math.floor(sliderWidth / slidesPerPage -25) ;
        

  
        cards.forEach((card) => {
          card.style.minWidth = `${cardWidth}px`;
        })
        
        slider.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

        if(currentIndex === 0 || cards.length <= slidesPerPage){
          prevButton.style.display = 'none';
        }
        else{
          prevButton.style.display = 'block';
        }
    
        if(currentIndex === maxIndex || maxIndex <= 0 || cards.length <= slidesPerPage){
          nextButton.style.display = 'none'
        }
        else{
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
        const cardWidth = Math.floor(sliderWidth / slidesPerPage -25) ;

        cards.forEach((card) => {
          card.style.minWidth = `${cardWidth}px`;
        })

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

    console.log(currentIndex)
  
    const updateSlider = () => {
      const gap = window.innerWidth > 600 ? 40 : window.innerWidth > 440 ? 20 : 10;
      console.log('=> window', window.innerWidth)
      const transfotmTo = Math.floor(window.innerWidth > 440 ? window.innerWidth - 15 : window.innerWidth) * currentIndex ;
      console.log(currentIndex);
      slider.style.transform = `translateX(-${transfotmTo}px)`;
      console.log('slider', slider.style.transform, 'tr' , transfotmTo)
    }
  
    navButtons.forEach((button, index) => {
      button.addEventListener('click', ()=> {
        navButtons[currentIndex].classList.remove('highlight')
        button.classList.add('highlight')
        currentIndex = index;
        updateSlider();
      })
    });
  
    prevBtn.addEventListener('click', () => {
      navButtons[currentIndex].classList.remove('highlight')
      currentIndex = currentIndex > 1 ? currentIndex - 1 : 0;
      navButtons[currentIndex].classList.add('highlight')
      updateSlider();
    })
  
    nextBtn.addEventListener('click', () => {
      navButtons[currentIndex].classList.remove('highlight')
      currentIndex = currentIndex === navButtons.length - 1  ? navButtons.length - 1 : currentIndex + 1  ;
      navButtons[currentIndex].classList.add('highlight')
      updateSlider()
    })

    window.addEventListener('resize', updateSlider)
  }

  tabSliderWithPagination();

  });

// tabslider with pagination  



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
popupTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const popupId = trigger.dataset.popup;
    openPopup(popupId);
  });
});

const openPopup = (id) => {
  const popup = document.getElementById(id);
  popup.classList.add('open');

  popup.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (e.target.classList.contains('close-button') || e.target.id == id) {
      popup.classList.remove('open');
    }
  });
};
