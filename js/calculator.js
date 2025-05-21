document.addEventListener('DOMContentLoaded', function() {
    const calcTotal = document.getElementById('calculator-total');
    const footer = document.querySelector('.footer');
    const reset_button = document.getElementById('reset-options-btn');
    const header = document.getElementById('header')
    
    let resetOriginalOffsetTop = reset_button.offsetTop;
    let resetHeight = reset_button.offsetTop;
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
        console.log('=> ', toggleConverter(inputs))
        target.innerText = `0`;
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
                        console.log('=> def', target.innerText)
                        if(toggle.elementref.checked){
                            console.log('=> def ++')
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
                                            if(el.counter && el.elementref.checked){
                                                target.innerText = `${parseInt(target.innerText) - el.counter.total - el.price}`
                                                console.log('=> text', target.innerText, `(-${el.counter.total + el.price}`)
                                                el.elementref.checked = false
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
                                    console.log('=> nested', nestedToggleid.split('-')[0])
                                    const section = document.querySelector(`#section-${nestedToggleid.split('-')?.[0]}`)
                                    section.checked = true
                                    try{
                                        if(nestedToggle){
                                            nestedToggle.elementref.checked = true;
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
            console.log('=> ctr', counter.elementref.nextSibling)
            counter.elementref.nextElementSibling?.addEventListener('click', ()=>{
                console.log('=> ++', )
                counter.elementref.value++  
                counter.elementref.dispatchEvent(changeEvent)
            })
            counter.elementref.previousElementSibling?.addEventListener('click', ()=>{
                console.log('=> --', counter.elementref)
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
                console.log('=> text', target.innerText)
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

  // document.addEventListener('DOMContentLoaded', function() {
  //   const calculator_body = document.getElementById('calculator')
  //   const inputs = calculator_body.querySelectorAll('.accordion-content input');
  //   const reset_button = document.getElementById('reset-options-btn');
  //   const sentButton = document.getElementById('send-calculator-total');

    
  //   let additional = ''

  //   inputs.forEach(input => {
  //       input.addEventListener('change', ()=>{
  //           let total = parseInt(target.innerText.replace(' ₽',''));
  //           switch (input.id){
  //             // package blocks
  //             case 'type-landing':{
  //               break
  //             }  
  //             case 'type-portfolio':{
  //               break
  //             } 
  //             case 'type-corporate':{
  //               break
  //             } 
  //             case 'type-corporate_catalogue':{
  //               break
  //             } 
  //             case 'type-store':{
  //               break
  //             }
  //             case 'type-store_ai':{
  //               break
  //             }
  //             case 'type-portal':{
  //               break 
  //             }
  //             case 'type-unique':{
  //               const field = document.getElementById('type-unique_text')
  //               if (input.checked){
  //                   field.classList.remove('hidden')
  //               }
  //               else{
  //                   field.classList.add('hidden')
  //               }
  //               break
  //             }
  //             // design block
  //             case 'design-landing': {
  //               const div = document.getElementById('landig-bloks-input')
  //               const field = div.querySelector('input');
  //               let count = field.value
  //               if (input.checked){
  //                   div.classList.remove('hidden')
  //                   total = parseInt(input.dataset.price) * count;
  //                   field.addEventListener('change', ()=>{
  //                       total = total - parseInt(input.dataset.price) * (count - field.value)
  //                   })
  //               }
  //               else{
  //                   div.classList.add('hidden')
  //                   field.removeEventListener('change', ()=>{})
  //                   total = total - parseInt(input.dataset.price) * (count - field.value)
  //               }
  //               break
  //             }
  //             case 'design-base': {
  //               const div = document.getElementById('design-base-input')
  //               const field = div.querySelector('input');
  //               let count = field.value

  //               if (input.checked){
  //                   const landing = document.getElementById('design-landing');
  //                   const prem = document.getElementById('design-premium');
  //                   div.classList.remove('hidden')
  //                   total = parseInt(input.dataset.price) + count * parseInt(field.dataset.price);
  //                   field.addEventListener('change', ()=>{
  //                       total = (total - parseInt(field.dataset.price) * (count - field.value))
  //                   })
                    
  //               }
  //               else{
  //                   div.classList.add('hidden')
  //                   field.removeEventListener('change', ()=>{})
  //                   total = (total - parseInt(field.dataset.price) * (count - field.value)) 
  //               }
  //               break
  //             }
  //             case 'design-premium': {
  //               const div = document.getElementById('design-premium-input')
  //               const field = div.querySelector('input');
  //               let count = field.value
                
  //               if (input.checked){
  //                   div.classList.remove('hidden')
  //                   total = parseInt(input.dataset.price) + count * parseInt(field.dataset.price);
  //                   field.addEventListener('change', ()=>{
  //                       total = (total - parseInt(field.dataset.price) * (count - field.value)) + ' ₽'
  //                   })
  //               }
  //               else{
  //                   div.classList.add('hidden')
  //                   field.removeEventListener('change', ()=>{})
  //                   total= (total - parseInt(field.dataset.price) * (count - field.value)) + ' ₽'

  //               }
  //               break
  //             }
  //             // default toggles
  //             default: {
  //               console.log('=> def', total)
  //               if(input.checked && input?.dataset?.price){
  //                   console.log('=> def ++')
  //                   total = total + parseInt(input.dataset.price)
  //                   break
  //               }
  //               else if(input.value !== '' && input.type === 'text'){
  //                   console.log('=> def field')
  //                   additional = additional + input.id + ': ' + input.value + '; ' 
  //                   break
  //               }
  //               else if(input?.dataset?.price && input.checked === false){
  //                   console.log('=> def --')
  //                   total = total - parseInt(input.dataset.price)
  //                   break
  //               }
  //             }
  //           }
  //           target.innerText = total + ' ₽';
  //       })
  //   })

  //   reset_button.addEventListener('click', ()=>{
  //       inputs.forEach(input => {
  //           input.checked = false; 
  //           input.value = ''
  //           total = 0;
  //           console.log('=> reset', )
  //           target.innerText = total + ' ₽';
  //       })
  //   })

  //   sentButton.addEventListener('click', ()=>{
  //       let inputs_total = ''
  //       inputs.forEach(input =>{
  //           if(input.checked){
  //               inputs_total =  inputs_total + (input.id + ': ' + true + '; ');
  //           }
  //       })
  //       const info = additional + inputs_total
  //       console.log('=> inputs total', info)


  //   })

  // })

  // const handleChangeSeoPromotion = (e) => {
  //   const seo = document.getElementById('promotion-seo')
  //   const max = document.getElementById('promotion-max_start')
  //   const reg = document.getElementById('promotion-region')
  //   const ctr = document.getElementById('promotion-country')
  //   let total = parseInt(target.innerText.replace('₽', ''))
  //   const price = parseInt(seo.dataset.price);
  //   if(seo.checked){
  //       if(max.checked){
  //           if(reg.checked){
  //               total = total - price
  //           }
  //           else if(ctr.checked){
  //               total = total - price*2
  //           }
  //           max.checked = false
  //       }
  //       else{
  //           total = total + price
  //           reg.checked = true
  //       }
  //   }
  //   else{
  //       total = total - price
  //       reg.checked = false
  //       ctr.checked = false
  //   }
  //   target.innerText = total + ' ₽';
  // }

  // const handleChangeMaxPromotion = (e) => {
  //   const seo = document.getElementById('promotion-seo')
  //   const max = document.getElementById('promotion-max_start')
  //   const reg = document.getElementById('promotion-region')
  //   const ctr = document.getElementById('promotion-country')
  //   let total = parseInt(target.innerText.replace('₽', ''))
  //   const price = parseInt(max.dataset.price);
  //   if(max.checked){
  //       if(seo.checked){
  //           if(reg.checked){
  //               total = total + price/2
  //           }
  //           else if(ctr.checked){
  //               total = total + price
  //           }
  //           seo.checked = false
  //       }
  //       else{
  //           total = total + price
  //           reg.checked = true
  //       }
  //   }
  //   else{
  //       total = total - price
  //       reg.checked = false
  //       ctr.checked = false
  //   }
  //   target.innerText = total + ' ₽';
  // }



 