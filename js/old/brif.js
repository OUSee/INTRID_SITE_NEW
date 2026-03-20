document.addEventListener('DOMContentLoaded', ()=> {
    const inputs= document.getElementById('calculator')?.querySelectorAll('.accordion-content input');
    const sentButton = document.getElementById('send-brif-total');

    const toggleConverter = (inputs) => {
        const toggles = [];
        const texts = [];
        inputs.forEach((input) => {
            switch (input.type) {
                case 'checkbox':{
                    toggles.push({
                        id: input.id,
                        elementref: input,
                        reveal: document.getElementById(input.dataset.reveal || ''),
                        radioid: input.dataset.radio?.split(';')  
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
        
        
        return ({toggles: toggles, texts: texts});
    }

    if(inputs && sentButton){
        const {toggles, texts} = toggleConverter(inputs);
        const togglechange = new Event('change');

        toggles.forEach(toggle => {
            toggle.elementref.addEventListener('change', () => {
                switch (toggle.id) {
                    default : {
                        if(toggle.elementref.checked){
                            if(toggle.reveal){
                                toggle.reveal.classList.remove('hidden');
                            }
                            if(toggle.radioid && toggle.radioid.length > 0){
                                toggles.map((el) => {
                                    toggle.radioid?.forEach(id => {
                                        if(el.id === id && el.elementref.checked){
                                          el.elementref.checked = false
                                          el.reveal?.classList.add('hidden')
                                        }
                                    });
                                })
                            }                         
                            break
                        }
                        else{
                            if(toggle.reveal){
                                toggle.reveal.classList.add('hidden');
                            }
                            break
                        }
                    }
                }
            })
        })

        sentButton.addEventListener('click', ()=> {
            const review = {
                options: toggles.filter(toggle => toggle.elementref.checked),
                extra: texts.filter(text => text.elementref.value !== ''),
            }
            console.log(review)
        })
    }
})