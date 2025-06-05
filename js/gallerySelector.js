document.addEventListener('DOMContentLoaded', ()=> {
    const gallery = document.getElementById('gallery-popup').querySelector('[data-slider]')
    const triggers = document.querySelectorAll('[data-gallery]');
    const onLoad = gallery.dataset.onload;

    const clearGallery = () => {
        // [].forEach.call(gallery.children, function(child) {
        //       gallery.remove(child)
        //     });
        while (gallery.firstChild) {
            gallery.removeChild(gallery.firstChild);
        }
    };

    const setUpGallery = (info) => {
        const contentId = info.split('_')[0];
        const contentCount = info.split('_')[1];
        clearGallery()

        for (let index = 0; index < contentCount; index++) {
            const div = document.createElement('div');
            div.classList.add('gallery-card');
            const img = document.createElement('img');
            img.src = `../src/images/galleries/${contentId}_${index + 1}.webp`
            div.appendChild(img)
            gallery.appendChild(div)
        }

        if(onLoad){
          window[onLoad]()
        }
    }

    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            setUpGallery(trigger.dataset.gallery)
        })
    });
})