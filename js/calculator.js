
  document.addEventListener('DOMContentLoaded', ()=> {
    const inputs= document.getElementById('calculator')?.querySelectorAll('.accordion-content input');
    const reset_button = document.getElementById('reset-options-btn');
    const sentButton = document.getElementById('send-calculator-total');
    const target = document.getElementById('calculator-total-target');
    console.log('=> checks', inputs)

    // const briefInputs = document.getElementById('calculator')?.querySelectorAll('')

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

    

    if(inputs){
        const {toggles, counters, texts} = toggleConverter(inputs);
        target ? target.innerText = `0` : false;
        const togglechange = new Event('change')
        reset_button?.addEventListener('click', () => {
            toggles.map((toggle) => {
                toggle.elementref.checked = false;
            })
            target ? target.innerText = `0` : false;
        })
        toggles.forEach(toggle => {
            toggle.elementref.addEventListener('change', () => {
                switch (toggle.id) {
                    default : {
                        if(toggle.elementref.checked){
                            if(toggle.reveal){
                                toggle.reveal.classList.remove('hidden');
                            }
                            if(toggle.counter?.total && target){
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
                                                if(target){
                                                    target.innerText = `${parseInt(target.innerText) - el.price - el.counter.total}`
                                                }
                                                el.reveal?.classList.add('hidden')
                                            }
                                            else if(el.elementref.checked){
                                              if(target){
                                                target.innerText = `${parseInt(target.innerText) - el.price}`
                                              }  
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
                            if(target){
                                target.innerText = `${parseInt(target.innerText) + toggle.price}`
                            }
                            break
                        }
                        else{
                            if(toggle.reveal){
                                toggle.reveal.classList.add('hidden');
                            }
                            if(toggle.counter?.total && target){
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
                            if(target){
                                const total = parseInt(target.innerText) - toggle.price;
                                if(total < 0){
                                    target.innerText = "0"
                                }
                                else{
                                    target.innerText = `${parseInt(target.innerText) - toggle.price}`
                                }
                            }
                            
                            break
                        }
                    }
                }
            })
        })
        if(target){
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
                counter.total = (parseInt(counter.elementref.value === '' ? 0 : counter.elementref.value)) * counter.price;
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
        }
        sentButton?.addEventListener('click', ()=> {
            const review = {
                options: toggles.filter(toggle => toggle.elementref.checked),
                extra: texts.filter(text => text.elementref.value !== ''),
                preprice: target.innerText ? target.innerText : 'empty',
            }
            console.log(review)
        })
    }
    
})