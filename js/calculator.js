document.addEventListener('DOMContentLoaded', ()=> {
    const inputs= document.getElementById('calculator')?.querySelectorAll('.accordion-content input');
    const reset_button = document.getElementById('reset-options-btn');
    const sentButton = document.getElementById('send-calculator-total');
    const target = document.getElementById('calculator-total-target');
    const hash = window.location.hash
    const togglechange = new Event('change')

    const formatNumber = (num) => {
        const [integer, decimal] = num.toString().split('.');
        const formatted = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        // console.log('=> formatted', formatted)
        return formatted
    }

    Object.defineProperty(target, 'current_value', {
        get(){
            return this._current_value
        },
        set(val){
            this._current_value = val;
            this.innerText = formatNumber(val);
            // console.log('=> set new value', val)
        },
        configurable: true
    })

    const handleToggleByHash = (hash, toggles) => {
        const id = hash.replace('#','')
        const handle_target = toggles.find(t => t.id === id);
        if(handle_target){
            try{
                handle_target.elementref.checked = true;
                handle_target.elementref.dispatchEvent(togglechange)
                if(handle_target.nested && handle_target.nested.length > 0){
                                handle_target.nested.forEach(nestedToggleid => {
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
                console.log('=> sucess', )
             }catch(err){
                console.log('=> error', err)
             }
        }
    }

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
        target.innerText = 0;
        target.current_value = 0;

        toggles.forEach(toggle => {
            toggle.elementref.addEventListener('change', () => {
                switch (toggle.id) {
                    default : {
                        if(toggle.elementref.checked){
                            if(toggle.reveal){
                                toggle.reveal.classList.remove('hidden');
                            }
                            if(toggle.counter?.total){
                                target.current_value = target.current_value + toggle.counter.total
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
                                                target.current_value = target.current_value - el.price - el.counter.total
                                                el.reveal?.classList.add('hidden')
                                            }
                                            else if(el.elementref.checked){
                                              target.current_value = target.current_value - el.price
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
                            target.current_value = target.current_value + toggle.price
                            break
                        }
                        else{
                            if(toggle.reveal){
                                toggle.reveal.classList.add('hidden');
                            }
                            if(toggle.counter?.total){
                                target.current_value = target.current_value - toggle.counter.total
                                // target.current_value = 162
                            }
                            if(toggle.nested && toggle.nested.length > 0){
                                toggle.nested.forEach(nestedToggleid => {
                                    const nestedToggle = toggles.find(t => t.id === nestedToggleid);
                                    if(nestedToggle.elementref.checked){
                                        nestedToggle.elementref.checked = false;
                                        nestedToggle.elementref.dispatchEvent(togglechange);
                                    }
                                    if(nestedToggle.reveal){
                                        nestedToggle.reveal.classList.add('hidden');
                                    }
                                })
                            }
                            if(toggle.id === 'promotion-seo' || toggle.id === 'promotion-max_start'){
                                const inside_toggles = toggle.reveal.querySelectorAll('input[type=checkbox]')
                                // console.log('=> inside_toggles', inside_toggles)
                                const new_toggleChange =  new Event('change')
                                inside_toggles.forEach(toggle => {
                                    if(toggle.checked){
                                       toggle.checked = false;
                                       try{
                                        toggle.dispatchEvent(new_toggleChange)     
                                       }catch(e){
                                        console.log('err: ', e)
                                       }
                                    }
                                })
                            }
                            const total = parseInt(target.current_value) - toggle.price;
                            if(total < 0){
                                target.current_value = 0
                            }
                            else{
                                target.current_value = target.current_value - toggle.price
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
                target.current_value = target.current_value - counter.total
                counter.total = (parseInt(counter.elementref.value === '' ? 0 : counter.elementref.value)) * counter.price;
                target.current_value = target.current_value + counter.total
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

        reset_button?.addEventListener('click', () => {
            toggles.map((toggle) => {
                toggle.elementref.checked = false;
            })
            target.current_value = 0;
        })

        if(hash){handleToggleByHash(hash, toggles)}
    }
})