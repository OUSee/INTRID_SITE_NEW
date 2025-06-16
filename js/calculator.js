document.addEventListener('DOMContentLoaded', function() {
    const calcTotal = document.getElementById('calculator-total');
    const footer = document.querySelector('.footer');
    const reset_button = document.getElementById('reset-options-btn');
    const header = document.getElementById('header')
    const accordions = document.querySelectorAll('.accordion-checkbox')
    console.log('=> accordions', accordions)
    
    let resetOriginalOffsetTop = reset_button.offsetTop;
    let resetHeight = reset_button.offsetTop;
    let resetOriginalOffsetLeft = reset_button.offsetLeft
    let calcOriginalOffsetTop = calcTotal.offsetTop;
    
    let calcHeight = calcTotal.offsetHeight;
  
    // Update measurements dynamically
    function updateMeasurements() {
      calcOriginalOffsetTop = calcTotal.offsetTop;
      calcHeight = calcTotal.offsetHeight;
      resetOriginalOffsetTop = reset_button.offsetTop;
      resetHeight = reset_button.offsetHeight;
    }
  
    function onScroll() {
      const scrollY = window.scrollY || window.pageYOffset;
      const viewportHeight = window.innerHeight;
      const footerRect = footer.getBoundingClientRect();
      const headerRect = header.getBoundingClientRect();
  
      updateMeasurements();

      // add here
      const headerBottom = headerRect.bottom;
    //   if (scrollY + headerBottom > resetOriginalOffsetTop) {
    //     // Make reset button sticky below header
    //     reset_button.style.position = 'fixed';
    //     reset_button.style.top = headerBottom + 10 + 'px';
    //     reset_button.style.left = resetOriginalOffsetLeft + 'px';
    //   } else {
    //     reset_button.style.position = '';
    //     reset_button.style.top = '';
    //     reset_button.style.zIndex = '';
    //   }
  
      if (scrollY + viewportHeight < calcOriginalOffsetTop + calcHeight) {
        // Stick block to bottom of viewport
        calcTotal.classList.add('fixed-bottom');
        calcTotal.style.bottom = '0px';
        calcTotal.style.zIndex = '11'
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
  
    // resizeObserver.observe(calcTotal);
  
    // Listen for scroll and resize events
    // window.addEventListener('scroll', onScroll);
    // window.addEventListener('resize', () => {
    //   updateMeasurements();
    //   onScroll();
    // });

    accordions.forEach(acc => {
        acc.addEventListener('change', () => {
            updateMeasurements();
            onScroll();
            setTimeout(()=>{
                updateMeasurements();
                onScroll();
            }, 100)
            setTimeout(()=>{
                updateMeasurements();
                onScroll();
            }, 150)
        })
    });
  
    // Initial setup
    // updateMeasurements();
    // onScroll();
  });
  

  document.addEventListener('DOMContentLoaded', ()=> {
    const inputs= document.getElementById('calculator')?.querySelectorAll('.accordion-content input');
    const reset_button = document.getElementById('reset-options-btn');
    const sentButton = document.getElementById('send-calculator-total');
    const target = document.getElementById('calculator-total-target');

    const toggleConverter = (inputs) => {
        const toggles = [];
        const counters = [];
        const texts = [];
        inputs.forEach((input) => {
            switch (input.type) {
                case 'checkbox':{
                    toggles.push({
                        id: input.id,
                        elementref: input,
                        price: parseInt(input.dataset.price || ''),
                        nested: input.dataset.nested?.split(';'),
                        reveal: document.getElementById(input.dataset.reveal || ''),
                        radioid: input.dataset.radio?.split(';')  
                    })
                    break
                }
                case 'number': {
                    counters.push({
                        id: input.id,
                        elementref: input,
                        price: parseInt(input.dataset.price),
                        total: parseInt(input.dataset.price) * input.value,
                        intendfor: input.dataset.intendfor
                    })
                    break
                }
                default:{
                    texts.push({
                        id: input.id,
                        elementref: input,
                    })
                    break
                }
            }
        })

        toggles.forEach(toggle => {
            counters.forEach(counter => {
                if(counter.intendfor === toggle.id){
                    toggle.counter = counter
                }
            })
        });
        
        return ({toggles: toggles, counters: counters, texts: texts});
    }

    

    if(inputs && target){
        const {toggles, counters, texts} = toggleConverter(inputs);
        target.innerText = `0`;
        const togglechange = new Event('change')
        reset_button?.addEventListener('click', () => {
            toggles.map((toggle) => {
                toggle.elementref.checked = false;
            })
            target.innerText = `0`;
        })
        toggles.forEach(toggle => {
            toggle.elementref.addEventListener('change', () => {
                switch (toggle.id) {
                    default : {
                        if(toggle.elementref.checked){
                            if(toggle.reveal){
                                toggle.reveal.classList.remove('hidden');
                            }
                            if(toggle.counter?.total){
                                target.innerText = `${parseInt(target.innerText) + toggle.counter.total}`;
                            }
                            if(toggle.radioid && toggle.radioid.length > 0){
                                toggles.map((el) => {
                                    toggle.radioid?.forEach(id => {
                                        if(el.id === id){
                                            if(el?.nested?.length > 0 && el.elementref.checked){
                                                el.nested.forEach(nested => {
                                                    const nestedToggle = toggles.find(t => t.id === nested);
                                                    nestedToggle.elementref.checked = false
                                                    nestedToggle.reveal?.classList.add('hidden')
                                                    nestedToggle.elementref.dispatchEvent(togglechange)
                                                })
                                            }
                                            if(el.counter && el.elementref.checked){
                                                el.elementref.checked = false;
                                                target.innerText = `${parseInt(target.innerText) - el.price - el.counter.total}`
                                                el.reveal?.classList.add('hidden')
                                            }
                                            else if(el.elementref.checked){
                                              target.innerText = `${parseInt(target.innerText) - el.price}`
                                              el.elementref.checked = false
                                              el.reveal?.classList.add('hidden')
                                            }
                                        }
                                    });
                                })
                            }
                            if(toggle.nested && toggle.nested.length > 0){
                                toggle.nested.forEach(nestedToggleid => {
                                    const nestedToggle = toggles.find(t => t.id === nestedToggleid);
                                    const section = document.querySelector(`#section-${nestedToggleid.split('-')?.[0]}`)
                                    section.checked = true
                                    try{
                                        if(nestedToggle){
                                            nestedToggle.elementref.checked = true;
                                            nestedToggle.elementref.dispatchEvent(togglechange);
                                        }
                                        else{
                                            console.error('=> ', nestedToggleid, 'not found')
                                        }
                                        if(nestedToggle?.reveal){
                                            nestedToggle.reveal.classList.remove('hidden');
                                        }
                                    }catch(err){
                                        console.error(nestedToggleid, err)
                                    }
                                    
                                })
                            }
                            target.innerText = `${parseInt(target.innerText) + toggle.price}`
                            break
                        }
                        else{
                            if(toggle.reveal){
                                toggle.reveal.classList.add('hidden');
                            }
                            if(toggle.counter?.total){
                                target.innerText = `${parseInt(target.innerText) - toggle.counter.total}`
                            }
                            if(toggle.nested && toggle.nested.length > 0){
                                toggle.nested.forEach(nestedToggleid => {
                                    const nestedToggle = toggles.find(t => t.id === nestedToggleid);
                                    nestedToggle.elementref.checked = false;
                                    nestedToggle.elementref.dispatchEvent(togglechange);
                                    if(nestedToggle.reveal){
                                        nestedToggle.reveal.classList.add('hidden');
                                    }
                                })
                            }
                            const total = parseInt(target.innerText) - toggle.price;
                            if(total < 0){
                                target.innerText = "0"
                            }
                            else{
                                target.innerText = `${parseInt(target.innerText) - toggle.price}`
                            }
                            break
                        }
                    }
                }
            })
        })
        counters.forEach(counter => {
            const changeEvent = new Event('input')
            counter.elementref.nextElementSibling?.addEventListener('click', ()=>{
                counter.elementref.value++  
                counter.elementref.dispatchEvent(changeEvent)
            })
            counter.elementref.previousElementSibling?.addEventListener('click', ()=>{
                if(counter.elementref.dataset?.intendfor === 'design-landing'){
                    if(counter.elementref.value > 1){
                        counter.elementref.value--  
                    }
                } else if(counter.elementref.value > 0){
                    counter.elementref.value--  
                }
                counter.elementref.dispatchEvent(changeEvent)
            })
            counter.elementref.addEventListener('input', () => {
                target.innerText = `${parseInt(target.innerText) - counter.total}`
                counter.total = (parseInt(counter.elementref.value)) * counter.price;
                target.innerText = `${parseInt(target.innerText) + counter.total}`
            })
            counter.elementref.addEventListener('keydown', (e) => {
                const blockedkeys = ['-', ',', '.', '+']
                if(blockedkeys.includes(e.key)){e.preventDefault();}
            })
            counter.elementref.addEventListener('blur', () => {
                if(counter.elementref.value === ''){
                    counter.elementref.value = 0
                }
                if(counter.elementref.dataset?.intendfor === 'design-landing' && counter.elementref.value < 1){
                    counter.elementref.value = 1
                }
            })
        })
        sentButton?.addEventListener('click', ()=> {
            const review = {
                options: toggles.filter(toggle => toggle.elementref.checked),
                extra: texts.filter(text => text.elementref.value !== ''),
                preprice: target.innerText,
            }
            console.log(review)
        })
    }
})