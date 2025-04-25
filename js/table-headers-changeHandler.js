// handle change clicks to add smooth change of columns



document.addEventListener('DOMContentLoaded', () => {
    const table = document.querySelector('.tender-table')
    const buttons = table.querySelectorAll('th');
    buttons.forEach((button, index) => {
        if(index > 0){
            input = button.querySelector('input')
            input.addEventListener('click', (e)=>{
                changeOrderHandler(button)
            })
        }
    });

    const changeOrderHandler = (button) => {
        console.log('=> inside', )
        try{
            buttons.forEach(item => {
            item.style.order = '1'
            label = item?.querySelector('label')
            label?.classList?.add('fade-out')
            
        });

        setTimeout(()=>{
            button.style.order = '3'
        }, 350)

        setTimeout(()=>{
           buttons.forEach(item => {
            label = item?.querySelector('label')
            label?.classList?.remove('fade-out')
            console.log('-- item.style', item.style.order)
            });
        }, 400)}
        catch(error){
            console.log('=> err', error)
        }
    }
})

