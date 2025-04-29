document.addEventListener('DOMContentLoaded', () => {
    if(window.innerWidth < 600){
        return
    }
    else{
        const map = document.querySelector('#sites-roadmap-list')
        const links = map.querySelectorAll('.links-line')
        const cards = map.querySelectorAll('li')
        console.log('=> cards', cards)
        console.log('=> links', links)
    
        const handleLinkPlace = () => {
                switch(window.innerWidth){
                    case (window.innerWidth < 1200) :{
                        
                        break
                    }
                    default :{
                        const frheight = cards[0].offsetHeight
                        const srheight = cards[3].offsetHeight
                        const trheight = cards[3].offsetHeight
                        const cardwidth = cards[0].offsetWidth

                        links.forEach((index, link) => {
                            switch(index){
                                case(0):{
                                    link.style = `top: ${frheight / 2}px; left: ${cardwidth}px`
                                    console.log('=> link', link.style)
                                }
                                case(1):{
                                    link.style = `top: ${frheight / 2}px; left: ${cardwidth * 2 + 30}px`
                                }
                                case(2):{
                                    link.style = `top: ${frheight}px; left: ${(cardwidth + 30) * 2 + cardwidth / 2}px`  
                                }
                                case(3):{
                                    link.style = `top: ${1}px; left: ${1}px`  
                                }
                                case(4):{
                                    link.style = `top: ${1}px; left: ${1}px`
                                }
                                case(5):{
                                    link.style = `top: ${1}px; left: ${1}px`     
                                }
                                case(6):{
                                    link.style = `top: ${1}px; left: ${1}px`  
                                }
                                case(7):{
                                    link.style = `top: ${1}px; left: ${1}px`   
                                }
                            }
                        });

                        break
                    }
                }
        }
        handleLinkPlace()
    }
    
})