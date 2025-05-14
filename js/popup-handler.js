// popup logic

document.addEventListener('DOMContentLoaded', ()=>{
    const popupTriggers = document.querySelectorAll('[data-popup]');

    popupTriggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const popupId = trigger.dataset.popup;
        openPopup(popupId);
      });
    });

    // Специально, для видео из кружочка
    const toggleVideoPLay = (videoElement, init) => {
        if (videoElement) {
          init === true ? videoElement.play() : videoElement.pause();
          videoElement.setAttribute('playinline', init === true ? true : false);
          videoElement.autoplay = init === true ? true : false;
          videoElement.controls = init === true ? true : false;
          videoElement.loop = init === true ? true : false;
          videoElement.muted = init === true ? false : true;
      
          if (init === false) {
            videoElement.currentTime = 0;
          }
        }
      };


      const openPopup = (id) => {

        // console.log('open ', id);
        const popup = document.getElementById(id);
        let videoPopup = popup.querySelector('video');
        // console.log(popup);
      
        popup.classList.add('open');
      
        // Приостанавливаем прокрутку страницы, когда окно открыто
        document.documentElement.classList.add('popup-opened');
        videoPopup ? toggleVideoPLay(videoPopup, true) : false;
      
        popup.addEventListener('click', (e) => {
         
          if (e.target.classList.contains('close-button') || e.target.id == id) {
            e.stopPropagation();
            e.preventDefault();

            let videoPopup = popup.querySelector('video');
      
            popup.classList.remove('open');
      
            // Возвращаем прокрутку страницы, когда окно закрыто
            document.documentElement.classList.remove('popup-opened');
      
            videoPopup ? toggleVideoPLay(videoPopup, false) : false;
          }
        });
      };
})





