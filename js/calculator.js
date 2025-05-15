const target = document.getElementById('calculator-total-target');

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
    const reset_button = document.getElementById('reset-options-btn');
    const sentButton = document.getElementById('send-calculator-total');

    let total = 0;
    let additional = ''

    inputs.forEach(input => {
        input.addEventListener('change', ()=>{
            if(input.checked && input?.dataset?.price){
                if(input.id === 'promotion-seo' || input.id === 'promotion-max_start'){
                    return
                }
                total = parseInt(total) + parseInt(input.dataset.price)
            }
            else if(input.value !== ''){
                additional = additional + input.id + ': ' + input.value + '; ' 
            }
            else if(input?.dataset?.price){
                total = parseInt(total) - parseInt(input.dataset.price)
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

  const handleChangeSeoPromotion = (e) => {
    const seo = document.getElementById('promotion-seo')
    const max = document.getElementById('promotion-max_start')
    const reg = document.getElementById('promotion-region')
    const ctr = document.getElementById('promotion-country')
    let total = parseInt(target.innerText.replace('₽', ''))
    const price = parseInt(seo.dataset.price);
    switch (seo.checked){
        case true :{
            max.checked = false
            reg.checked = true
            target.innerText = total + price + ' ₽'
            break
        }
        default:{
            if(max.checked){
                break
            }    
            else{
                if(ctr.checked){
                    ctr.checked = false
                    target.innerText = total - price*2 + ' ₽'
                }
                else{
                    reg.checked = false
                    target.innerText = total - price + ' ₽'
                }
            }
        }
    }
  }

  const handleChangeMaxPromotion = (e) => {
    const seo = document.getElementById('promotion-seo')
    const max = document.getElementById('promotion-max_start')
    const reg = document.getElementById('promotion-region')
    const ctr = document.getElementById('promotion-country')
    let total = parseInt(target.innerText.replace('₽', ''))
    const price = parseInt(seo.dataset.price);
    switch (max.checked){
        case true :{
            seo.checked = false
            reg.checked = true
            target.innerText = total + price + ' ₽'
            break
        }
        default:{
            if(seo.checked){
                break
            }    
            else{
                if(ctr.checked){
                    ctr.checked = false
                    target.innerText = total - price*2 + ' ₽'
                }
                else{
                    reg.checked = false
                    target.innerText = total - price + ' ₽'
                }
            }
        }
    }
  }

  const handleChangeRegion = (e) => {
    const seo = document.getElementById('promotion-seo')
    const max = document.getElementById('promotion-max_start')
    const reg = document.getElementById('promotion-region')
    const ctr = document.getElementById('promotion-country')
    let total = parseInt(target.innerText.replace('₽', ''))
    const seo_price = parseInt(seo.dataset.price);
    const max_price = parseInt(max.dataset.price);
    if(e === 1)
        switch (reg.checked){
            case true: {
                if(ctr.checked){
                    ctr.checked = false
                    if(seo.checked){

                    }
                    else if(max{

                    }
                    target.innerText = total - 
                }
                else{
                    seo.checked = true;
                    target.innerText = total + seo_price + ' ₽';
                }
            }
            default: {
                if(seo.checked){
                    target.innerText = total - seo_price + ' ₽';
                    seo.checked = false
                }
                else if(max.checked){
                    target.innerText = total - max_price + ' ₽';
                    max.checked = false
                }
            }
        }
    
    else
        switch (ctr.checked) {
            case true: {
                reg.checked = false
                if(seo.checked){
                    target.innerText = total - seo_price + ' ₽';
                }
                else if(max.checked){
                    target.innerText = total - max_price + ' ₽';
                }
            }
            default: {
                if(seo.checked){
                    target.innerText = total - seo_price + ' ₽';
                }
                else if(max.checked){
                    target.innerText = total - max_price + ' ₽';
                }
            }
        }
    
  }