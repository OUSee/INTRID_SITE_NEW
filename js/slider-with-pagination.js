document.addEventListener('DOMContentLoaded', () => {

    const tabSliderWithPagination = (id) => {
        
        let slider = document.querySelector(`#${id}`);
        // console.log('=> slider found', slider)
        const pagination = document.querySelector(`#${id} + .pagination`);
        const navLeft = document.querySelector(`#navleft_for--${id}`)
        const navRight = document.querySelector(`#navright_for--${id}`)

        // console.log('=> slider exec', id, `${!!slider ? 'found: ' + slider.id : 'not-found'}`, `${!!pagination ? 'pagination found: ' + pagination : 'no pagination'}`)
        // console.log('=> pagination found', pagination)
        let prevBtn
        let nextBtn
        let navButtons
        let newNavButtons

        let slides = slider.children;
        let gap = parseInt(window.getComputedStyle(slider).gap)
        const visibleWidth = slider.parentElement.clientWidth;
        const visibleSlidesCount = Math.round(visibleWidth / (slides[0].offsetWidth));
        let currentIndex = 0;

        if(!!navLeft && !!navRight){
          prevBtn.push(navLeft)
          nextBtn.push(navRight)
        }
        
        if(!!pagination){
            prevBtn = pagination?.querySelectorAll('.pagination--prev-btn')
            nextBtn = pagination?.querySelectorAll('.pagination--next-btn')
            navButtons = pagination.querySelectorAll('.pagination--btn-dot')

            const dotsContainer = pagination.querySelector('.pagination--buttons-dots')

            console.log('=> navbtns', navButtons)

            navButtons.forEach((button)=>dotsContainer.removeChild(button))

            const btncount = slides.length - (visibleSlidesCount - 1)

            for (let index = 0; index < btncount; index++) {
              const btnDot = document.createElement('button')
              btnDot.classList.add('pagination--btn-dot');
              dotsContainer.appendChild(btnDot)
              console.log('=> added', )
            }

            navButtons = pagination.querySelectorAll('.pagination--btn-dot')
            navButtons[currentIndex].classList.add('highlight')
            // console.log('=> buttons and pagination found', prevBtn, nextBtn, navButtons)
        }
        
        if(id === `cases-tabs-slider`){
          slides = slider.querySelectorAll('.tab-content')
          gap =  parseInt(window.getComputedStyle(slider.querySelector('.cases-content')).gap)
        }

        for(let i = currentIndex; i < currentIndex + visibleSlidesCount && i < slides.length; i++) {
          slides[i].classList.add('active');
        }
      
        const updateSlider = () => {
          const moveAmmount = (slides[0].offsetWidth + gap) * currentIndex;
          
          // Remove .active class from all slides
          try{
            // slides.forEach(slide => slide.classList.remove('active'));

            [].forEach.call(slides, function(slide) {
              slide.classList.remove('active')
            });
            

            // Add .active class to visible slides based on currentIndex and visibleSlidesCount
            for(let i = currentIndex; i < currentIndex + visibleSlidesCount && i < slides.length; i++) {
              slides[i].classList.add('active');
            }
            // console.log('=> going to', `translateX(-${moveAmmount}px)`)
            slider.style.transform = `translateX(-${moveAmmount}px)`;
          }
          catch(err){
            console.log('=> err', err)
          }
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
            evt.preventDefault();
            if (xDiff > 0) {
              // свайп влево — следующий слайд
              nextSlide();
            } else {
              // свайп вправо — предыдущий слайд
              prevSlide();
            }
          }
          else{
            return
          }
          // сброс координат
          xDown = null;
          yDown = null;
        }
    
        slider.addEventListener('touchstart', handleTouchStart, false)
        slider.addEventListener('touchmove', handleTouchMove, false)
      
        prevBtn.forEach(btn => btn.addEventListener('click', prevSlide ))
        nextBtn.forEach(btn => btn.addEventListener('click', nextSlide ))
    
        window.addEventListener('resize', updateSlider)
    }
    

      window.addEventListener('resize', ()=>{
        sliders.forEach((slider) => {
          try{
            tabSliderWithPagination(slider.id);
          }catch(err){
            console.log('=> err seting slider: ', err);
          }})
      })

      const sliders = document.querySelectorAll('[data-slider]');
      if(sliders){
        sliders.forEach((slider) => {
          try{
            tabSliderWithPagination(slider.id);
          }catch(err){
            console.log('=> err seting slider: ', err);
          }})
      }
})