type Toggle = {
    id: string;
    elementref: HTMLInputElement;
    price: number;
    nested?: string[];
    reveal: HTMLElement | null;
    radioid?: string[];
    counter?: Counter
}

type Counter = {
    id: string;
    elementref: HTMLInputElement;
    price: number;
    total: number;
    intendfor: string;
}

type TextInput = {
    id: string;
    elementref: HTMLInputElement;
}

document.addEventListener('DOMContentLoaded', ()=> {
    const inputs:NodeListOf<HTMLInputElement> | undefined = document.getElementById('calculator')?.querySelectorAll('.accordion-content input');
    const reset_button = document.getElementById('reset-options-btn');
    const sentButton = document.getElementById('send-calculator-total');
    const target = document.getElementById('calculator-total-target');

    const toggleConverter = (inputs: NodeListOf<HTMLInputElement>) => {
        const toggles:Array<Toggle> = [];
        const counters:Array<Counter> = [];
        const texts:Array<TextInput> = [];
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
                }
                case 'number': {
                    counters.push({
                        id: input.id,
                        elementref: input,
                        price: parseInt(input.dataset.price || ''),
                        total: this.price * input.value,
                        intendfor: input.dataset.intendfor || ''
                    })
                }
                default:{
                    texts.push({
                        id: input.id,
                        elementref: input,
                    })
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
                                            el.elementref.checked = false
                                            if(el.counter){
                                                target.innerText = `${parseInt(target.innerText) - el.counter.total}`
                                            }
                                            target.innerText = `${parseInt(target.innerText) - el.price}`
                                        }
                                    });
                                })
                            }
                            target.innerText = `${parseInt(target.innerText) + toggle.price}`
                            break
                        }
                        else{
                            console.log('=> def --')
                            if(toggle.reveal){
                                toggle.reveal.classList.add('hidden');
                            }
                            if(toggle.counter?.total){
                                target.innerText = `${parseInt(target.innerText) - toggle.counter.total}`
                            }
                             target.innerText = `${parseInt(target.innerText) - toggle.price}`
                            break
                        }
                    }
                }
            })
        })
        counters.forEach(counter => {
            counter.elementref.addEventListener('input', () => {
                target.innerText = `${parseInt(target.innerText) - counter.total}`
                counter.total = (parseInt(counter.elementref.value)) * counter.price;
                target.innerText = `${parseInt(target.innerText) + counter.total}`
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