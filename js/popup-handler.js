// popup logic

document.addEventListener('DOMContentLoaded', () => {
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
    const onLoad = popup.dataset.onload;

    let buttonClose = document.createElement('button');

    buttonClose.classList.add('popup-close');
    buttonClose.setAttribute('data-close-popup', true);
    buttonClose.setAttribute('aria-label', 'close-popup');

    let videoPopup = popup.querySelector('video');
    // console.log(popup);

    popup.classList.add('open');

    popup.prepend(buttonClose);

    // Приостанавливаем прокрутку страницы, когда окно открыто
    document.documentElement.classList.add('popup-opened');
    videoPopup ? toggleVideoPLay(videoPopup, true) : false;

    if (onLoad) {
      window[onLoad]();
    }

    popup.addEventListener('click', (e) => {
      if (
        e.target.classList.contains('popup-close') ||
        e.target.dataset.closePopup ||
        e.target.id == id
      ) {
        if (e.target.tagName && e.target.tagName.toLowerCase() !== 'a') {
          e.stopPropagation();
          e.preventDefault();
        }

        let videoPopup = popup.querySelector('video');

        popup.classList.remove('open');

        buttonClose.remove();

        // Возвращаем прокрутку страницы, когда окно закрыто
        document.documentElement.classList.remove('popup-opened');

        videoPopup ? toggleVideoPLay(videoPopup, false) : false;
      }
    });
  };
});
