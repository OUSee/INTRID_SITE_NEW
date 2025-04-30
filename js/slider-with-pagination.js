document.addEventListener('DOMContentLoaded', () => {

    const tabSliderWithPagination = (id) => {
        
        let slider = document.querySelector(`#${id}`);
        // console.log('=> slider found', slider)
        const pagination = document.querySelector(`#${id} + .pagination`);
        // console.log('=> slider exec', id, `${!!slider ? 'found: ' + slider.id : 'not-found'}`, `${!!pagination ? 'pagination found: ' + pagination : 'no pagination'}`)
        // console.log('=> pagination found', pagination)
        let prevBtn
        let nextBtn
        let navButtons

        if(!!pagination){
           prevBtn = pagination?.querySelector('.pagination--prev-btn')
           nextBtn = pagination?.querySelector('.pagination--next-btn')
       
        // добавить кнопки слева справа
         navButtons = pagination.querySelectorAll('.pagination--btn-dot')
        }

        const tabs = slider.querySelectorAll('.tab-content')
        const tabsHeaders = slider.querySelectorAll('.case-tab-button')
        let slides = slider.children;
        let gap = parseInt(window.getComputedStyle(slider).gap)

        if(id === `cases-tabs-slider`){
          slides = slider.querySelectorAll('.tab-content')
          gap =  parseInt(window.getComputedStyle(slider.querySelector('.cases-content')).gap)
        }

        let currentIndex = 0;
      
        const updateSlider = () => {
          const moveAmmount = (slides[0].offsetWidth + gap) * currentIndex;
          // console.log('=> slider', slider)
          // console.log('=> slides', slides)
          // console.log('=> gap', gap)
          // console.log('=> slides[0].offsetWidth', slides[0].offsetWidth)
          
          slider.style.transform = `translateX(-${moveAmmount}px)`;
        }
    
        const nextSlide = ( ) => {
          if(navButtons[currentIndex + 1] && window.getComputedStyle(navButtons[currentIndex + 1]).display === 'none'){
            return
          }
          navButtons[currentIndex].classList.remove('highlight')
          currentIndex = currentIndex === navButtons.length - 1  ? navButtons.length - 1 : currentIndex + 1 ;
          // console.log('=> curIndex', currentIndex )
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
    

      window.addEventListener('resize', ()=>{
        tabSliderWithPagination('cases-tabs-slider');
        tabSliderWithPagination('portfolio-slider');
        tabSliderWithPagination('reviews-slider');
        
      })
      tabSliderWithPagination('cases-tabs-slider');
      tabSliderWithPagination('portfolio-slider');
      tabSliderWithPagination('reviews-slider');
})