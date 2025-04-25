document.addEventListener('DOMContentLoaded', () => {

    const tabSliderWithPagination = (id) => {
        const slider = document.querySelector(`#${id}`);
        const pagination = document.querySelector(`#${id} + .pagination`);
        const prevBtn = pagination.querySelector('.pagination--prev-btn')
        const nextBtn = pagination.querySelector('.pagination--next-btn')
        // добавить кнопки слева справа
        const navButtons = pagination.querySelectorAll('.pagination--btn-dot')
        const tabs = slider.querySelectorAll('.tab-content')
        const tabsHeaders = slider.querySelectorAll('.case-tab-button')
        const slides = slider.childNodes;
        console.log('=> slides', slides)
        // доделать слайдер чтобы был универсальным
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
    
      tabSliderWithPagination('cases-tabs-slider');
      tabSliderWithPagination('portfolio-slider')
})