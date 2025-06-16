function sliderInitialise(){

    const tabSliderWithPagination = (id) => {
        let slider = document.getElementById(`${id}`);
        const pagination = document.querySelector(`#${id} + .pagination`);
        const navLeft = document.getElementById(`navleft_for--${id}`)
        const navRight = document.getElementById(`navright_for--${id}`)
        slider.style.transform = `translateX(-0px)`;

        let prevBtn = []
        let nextBtn = []
        let navButtons = []

        let slides = slider.children;
        let gap = parseInt(window.getComputedStyle(slider).gap)
        const visibleWidth = slider.parentElement.clientWidth;
        const visibleSlidesCount = Math.round(visibleWidth / (slides[0].offsetWidth));
        let currentIndex = 0;

        if(!!navLeft && !!navRight){
          prevBtn.push(navLeft)
          nextBtn.push(navRight)

          navLeft.style = 'position: absolute; left: 5px; top: 50%; transform: translateY(-50%)'
          navRight.style = `position: absolute; right: 5px; top: 50%; transform: translateY(-50%)`
        }
        
        if(!!pagination){
            prevBtn = [...prevBtn, ...pagination?.querySelectorAll('.pagination--prev-btn')]
            nextBtn = [...nextBtn, ...pagination?.querySelectorAll('.pagination--next-btn')]
            navButtons = pagination.querySelectorAll('.pagination--btn-dot')

            const dotsContainer = pagination.querySelector('.pagination--buttons-dots')
            const btncount = slides.length - (visibleSlidesCount - 1)

            if(navButtons.length !== btncount && visibleSlidesCount > 0){
              navButtons.forEach((button)=>dotsContainer.removeChild(button))

              for (let index = 0; index < btncount; index++) {
                const btnDot = document.createElement('button')
                btnDot.classList.add('pagination--btn-dot');
                dotsContainer.appendChild(btnDot)
              }

              navButtons = pagination.querySelectorAll('.pagination--btn-dot')
              navButtons[currentIndex].classList.add('highlight')
              if(currentIndex === 0){
                prevBtn.forEach((btn)=>{
                  if (currentIndex === 0) {
                    btn.style = 'opacity: 0;'
                  } else {
                    btn.style = 'opacity: 1;'
                  }
                })
              }
            }
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
          
          try{
            [].forEach.call(slides, function(slide) {
              slide.classList.remove('active')
            });

            for(let i = currentIndex; i < currentIndex + visibleSlidesCount && i < slides.length; i++) {
              slides[i].classList.add('active');
            }
            slider.style.transform = `translateX(-${moveAmmount}px)`;

            // Disable prev button if at start
            prevBtn.forEach((btn)=>{
              if (currentIndex === 0) {
                btn.style = 'opacity: 0;'
              } else {
                btn.style = 'opacity: 1;'
              }
            })

            // Disable next button if at end
            nextBtn.forEach((btn)=> {
              if (currentIndex + visibleSlidesCount >= slides.length) {
                btn.style = 'opacity: 0;'
              } else {
                btn.style = 'opacity: 1;'
              }
            })
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
        
          if (Math.abs(xDiff) > Math.abs(yDiff) && Math.abs(xDiff) > 20) { 
            evt.preventDefault();
            if (xDiff > 0) {
              nextSlide();
            } else {
              prevSlide();
            }
          }
          else{
            return
          }
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
            console.log('=> err seting slider ', slider.id, ':', err);
          }})
    })

    const sliders = document.querySelectorAll('[data-slider]');
    if(sliders){
        sliders.forEach((slider) => {
          try{
            tabSliderWithPagination(slider.id);
          }catch(err){
            console.log('=> err seting slider ', slider.id, ':', err);
          }})
    }
}

document.addEventListener('DOMContentLoaded', sliderInitialise )