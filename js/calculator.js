document.addEventListener('DOMContentLoaded', function() {
    const calcTotal = document.getElementById('calculator-total');
    const footer = document.querySelector('.footer');
  
    let calcOriginalOffsetTop = calcTotal.offsetTop;
    let calcHeight = calcTotal.offsetHeight;
  
    // Update measurements dynamically
    function updateMeasurements() {
      calcOriginalOffsetTop = calcTotal.offsetTop;
      calcHeight = calcTotal.offsetHeight;
    }
  
    function onScroll() {
      const scrollY = window.scrollY || window.pageYOffset;
      const viewportHeight = window.innerHeight;
      const footerRect = footer.getBoundingClientRect();
  
      updateMeasurements();
  
      if (scrollY + viewportHeight < calcOriginalOffsetTop + calcHeight) {
        // Stick block to bottom of viewport
        calcTotal.classList.add('fixed-bottom');
        calcTotal.style.bottom = '0px';
      } else {
        if (footerRect.top < viewportHeight) {
          // Footer visible, shift block up to avoid overlap
          const overlap = viewportHeight - footerRect.top;
          calcTotal.classList.add('fixed-bottom');
          calcTotal.style.bottom = overlap + 'px';
        } else {
          calcTotal.style.bottom = '';
        }
      }
    }
  
    // Observe size changes of the calculator total block
    const resizeObserver = new ResizeObserver(() => {
      updateMeasurements();
      onScroll();
    });
  
    resizeObserver.observe(calcTotal);
  
    // Listen for scroll and resize events
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', () => {
      updateMeasurements();
      onScroll();
    });
  
    // Initial setup
    updateMeasurements();
    onScroll();
  });
  

  document.addEventListener('DOMContentLoaded', function() {
    const calculator_body = document.getElementById('calculator')
    const inputs = calculator_body.querySelectorAll('.accordion-content input');
    const target = document.getElementById('calculator-total-target');
    const reset_button = document.getElementById('reset-options-btn');
    const sentButton = document.getElementById('send-calculator-total');

    let total = 0;
    let additional = ''

    inputs.forEach(input => {
        input.addEventListener('change', ()=>{
            if(input.checked){
                total++;
            }
            else if(input.value !== ''){
                additional = additional + input.id + ': ' + input.value + '; ' 
            }
            else{
                total--;
            }

            target.innerText = total + ' ₽';
        })
    })

    reset_button.addEventListener('click', ()=>{
        inputs.forEach(input => {
            input.checked = false; 
            input.value = ''
            total = 0;
            target.innerText = total + ' ₽';
        })
    })

    sentButton.addEventListener('click', ()=>{
        let inputs_total = ''
        inputs.forEach(input =>{
            if(input.checked){
                inputs_total =  inputs_total + (input.id + ': ' + true + '; ');
            }
        })
        const info = additional + inputs_total
        console.log('=> inputs total', info)

        
    })

  })