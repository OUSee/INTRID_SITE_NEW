// SLIDER START

const slides = document.querySelector('.slides');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const slideItems = document.querySelectorAll('.slide');

const firstClone = slideItems[0].cloneNode(true);
const lastClone = slideItems[slideItems.length - 1].cloneNode(true);
const hr = document.createElement('hr') 
slides.appendChild(firstClone);
slides.appendChild(hr)
slides.insertBefore(lastClone, slideItems[0]);

const slideCount = slideItems.length;
const height = slideItems[0].offsetHeight;

let currentIndex = 0; 
slides.style.transform = `translateY(-${currentIndex * (height + 1)}px)`;

function updateSlider() {
  const currheight = slideItems[0].offsetHeight;
  slides.style.transform = `translateY(-${currentIndex * (currheight + 1)}px)`;

  if (currentIndex === 0) {
    setTimeout(() => {
      slides.style.transition = 'none';
      currentIndex = slideCount - 2;
      updateSlider();
      setTimeout(() => (slides.style.transition = 'transform 0.5s ease'), 50);
    }, 500);
  }

  if (currentIndex === slideCount - 1) {
    setTimeout(() => {
      slides.style.transition = 'none';
      currentIndex = 1;
      updateSlider();
      setTimeout(() => (slides.style.transition = 'transform 0.5s ease'), 50);
    }, 500);
  }
}

nextBtn.addEventListener('click', () => {
  clearInterval(autoScrollIntervalId);
  currentIndex++;
  updateSlider();
});

prevBtn.addEventListener('click', () => {
  clearInterval(autoScrollIntervalId);
  currentIndex--;
  updateSlider();
});

let autoScrollIntervalId;

function startAutoScroll() {
  autoScrollIntervalId = setInterval(() => {
    currentIndex++;
    updateSlider();
  }, 3000);
}

startAutoScroll();

// Reset slider position on window resize (optional)
window.addEventListener('resize', () => {
  updateSlider()
});

// SLIDER END

// HORIZONTAL SLIDER

const SliderInIt = () => {};

document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('.tab-slider');

  const tabButtons = document.querySelector('.slider-with-tabs_tabs-buttons');
  const tabButtonsList = tabButtons.querySelectorAll('label.button-link');

  window.addEventListener('resize', () => {
    if (window.innerWidth > 600) {
      tabButtonsList.forEach((tabButton, index) => {
        const input = tabButton.querySelector(`#tab-slide-btn-${index + 1}`);
        input.addEventListener('click', () => {
          const activeSlider = document.querySelector(
            `#tab-slide-${index + 1}`
          );
          SliderHandler(activeSlider);
        });
      });

      const SliderHandler = (slider) => {
        const cards = slider.querySelectorAll('.tab-slider-card');
        const prevButton = document.querySelector(`.slider-arrow.prev`);
        const nextButton = document.querySelector(`.slider-arrow.next`);

        let currentIndex = 0;

        const updateSlider = () => {
          const sliderWidth = slider.offsetWidth;
          const slidesPerPage = Math.floor(sliderWidth / 255);
          const maxIndex = cards.length - slidesPerPage;
          const cardWidth = Math.floor(sliderWidth / slidesPerPage - 25);

         


          cards.forEach((card) => {
            card.style.minWidth = `${cardWidth}px`;
          });

          slider.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

          if (currentIndex === 0 || cards.length <= slidesPerPage) {
            prevButton.style.display = 'none';
          } else {
            prevButton.style.display = 'block';
          }

          if (
            currentIndex === maxIndex ||
            maxIndex <= 0 ||
            cards.length <= slidesPerPage
          ) {
            nextButton.style.display = 'none';
          } else {
            nextButton.style.display = 'block';
          }
        };

        prevButton.addEventListener('click', () => {
          currentIndex--;
          updateSlider();
        });

        nextButton.addEventListener('click', () => {
          const sliderWidth = slider.offsetWidth;
          const slidesPerPage = Math.floor(sliderWidth / 255);
          const maxIndex = Math.max(0, cards.length - slidesPerPage);
          const cardWidth = Math.floor(sliderWidth / slidesPerPage - 25);

          cards.forEach((card) => {
            card.style.minWidth = `${cardWidth}px`;
          });

          currentIndex++;
          updateSlider();
        });

        window.addEventListener('resize', updateSlider);
        updateSlider();
      };

      SliderHandler(document.querySelector(`#tab-slide-${1}`));
    }
  });

  if (window.innerWidth > 600) {
    tabButtonsList.forEach((tabButton, index) => {
      const input = tabButton.querySelector(`#tab-slide-btn-${index + 1}`);
      input.addEventListener('click', () => {
        const activeSlider = document.querySelector(`#tab-slide-${index + 1}`);
        SliderHandler(activeSlider);
      });
    });

    const SliderHandler = (slider) => {
      const cards = slider.querySelectorAll('.tab-slider-card');
      const prevButton = document.querySelector(`.slider-arrow.prev`);
      const nextButton = document.querySelector(`.slider-arrow.next`);

      let currentIndex = 0;

      const updateSlider = () => {
        const sliderWidth = slider.offsetWidth;
        const slidesPerPage = Math.floor(sliderWidth / 255);
        const maxIndex = cards.length - slidesPerPage;
        const cardWidth = Math.floor(sliderWidth / slidesPerPage - 25);

        


        cards.forEach((card) => {
          card.style.minWidth = `${cardWidth}px`;
        });

        slider.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

        if (currentIndex === 0 || cards.length <= slidesPerPage) {
          prevButton.style.display = 'none';
        } else {
          prevButton.style.display = 'block';
        }

        if (
          currentIndex === maxIndex ||
          maxIndex <= 0 ||
          cards.length <= slidesPerPage
        ) {
          nextButton.style.display = 'none';
        } else {
          nextButton.style.display = 'block';
        }
      };

      prevButton.addEventListener('click', () => {
        currentIndex--;
        updateSlider();
      });

      nextButton.addEventListener('click', () => {
        const sliderWidth = slider.offsetWidth;
        const slidesPerPage = Math.floor(sliderWidth / 255);
        const maxIndex = Math.max(0, cards.length - slidesPerPage);
        const cardWidth = Math.floor(sliderWidth / slidesPerPage - 25);

        cards.forEach((card) => {
          card.style.minWidth = `${cardWidth}px`;
        });

        currentIndex++;
        updateSlider();
      });

      window.addEventListener('resize', updateSlider);
      updateSlider();

  }
  
  SliderHandler(document.querySelector(`#tab-slide-${1}`))
  }

  const tabSliderWithPagination = () => {
    const slider = document.querySelector('#cases-tabs-slider');
    const pagination = document.querySelector('#cases-pagination');
    const prevBtn = pagination.querySelector('.pagination--prev-btn')
    const nextBtn = pagination.querySelector('.pagination--next-btn')
    const navButtons = pagination.querySelectorAll('.pagination--btn-dot')
    const tabs = slider.querySelectorAll('.tab-content')
    const tabsHeaders = slider.querySelectorAll('.case-tab-button')
    let currentIndex = 0;

    
  
    const updateSlider = () => {
      const gap = window.innerWidth > 600 ? 40 : window.innerWidth > 440 ? 20 : 10;
      console.log('=> window', window.innerWidth)
      const transfotmTo = Math.floor(window.innerWidth > 440 ? window.innerWidth - 15 : window.innerWidth) * currentIndex ;
      console.log(currentIndex);
      slider.style.transform = `translateX(-${transfotmTo}px)`;
      console.log('slider', slider.style.transform, 'tr' , transfotmTo)
    }

    const nextSlide = ( ) => {
      navButtons[currentIndex].classList.remove('highlight')
      currentIndex = currentIndex === navButtons.length - 1  ? navButtons.length - 1 : currentIndex + 1  ;
      navButtons[currentIndex].classList.add('highlight')
      updateSlider();
    }

    const prevSlide = () => {
      navButtons[currentIndex].classList.remove('highlight')
      currentIndex = currentIndex > 1 ? currentIndex - 1 : 0;
      navButtons[currentIndex].classList.add('highlight')
      
      updateSlider()
    }
  
    navButtons.forEach((button, index) => {
      button.addEventListener('click', ()=> {
        navButtons[currentIndex].classList.remove('highlight')
        button.classList.add('highlight')
        currentIndex = index;
        updateSlider();
      })
    });

    function handleTouchStart(evt) {
      const firstTouch = evt.touches[0];
      xDown = firstTouch.clientX;
      yDown = firstTouch.clientY;
    }
    
    function handleTouchMove(evt) {
      if (!xDown || !yDown) {
        return;
      }
    
      const xUp = evt.touches[0].clientX;
      const yUp = evt.touches[0].clientY;
    
      const xDiff = xDown - xUp;
      const yDiff = yDown - yUp;
    
      if (Math.abs(xDiff) > Math.abs(yDiff)) { // горизонтальный свайп
        if (xDiff > 0) {
          // свайп влево — следующий слайд
          nextSlide();
        } else {
          // свайп вправо — предыдущий слайд
          prevSlide();
        }
      }
      // сброс координат
      xDown = null;
      yDown = null;
    }

    slider.addEventListener('touchstart', handleTouchStart, false)
    slider.addEventListener('touchmove', handleTouchMove, false)
  
    prevBtn.addEventListener('click', prevSlide )
    nextBtn.addEventListener('click', nextSlide )

    window.addEventListener('resize', updateSlider)
  }

  tabSliderWithPagination();

  });

// tabslider with pagination  


// opacity header onscroll

window.addEventListener('scroll', function () {
  const header = document.getElementById('header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// popup logic


// const popupTriggers = document.querySelectorAll('.popup-trigger');
// console.log(popupTriggers[0].dataset.popup);
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
    e.stopPropagation();
    e.preventDefault();
    if (e.target.classList.contains('close-button') || e.target.id == id) {
      let videoPopup = popup.querySelector('video');

      popup.classList.remove('open');

      // Возвращаем прокрутку страницы, когда окно закрыто
      document.documentElement.classList.remove('popup-opened');

      videoPopup ? toggleVideoPLay(videoPopup, false) : false;
    }
  });
};

// in tab webshop content show

const webShopDiagram = document.querySelector('.web-shop-diagram')
const webShopTarget = webShopDiagram.querySelector('.store-text')
webShopDiagram.querySelectorAll('input').forEach((input)=>
  input.addEventListener('click', ()=>{
    setTabContent(input.id)
  })
)
const tenderDiagram = document.querySelector('.tender-diagram')
const tenderTarget = tenderDiagram.querySelector('.tender-text')
tenderDiagram.querySelectorAll('input').forEach((input)=>
  input.addEventListener('click', ()=>{
    console.log('=> added click', input.id)
    setTenderTabContent(input.id)
  })
)


const setTabContent = (tabId) => {
  const content = [
    {id: 'ai-benefit-1', content: 'Подбирает сопутствующие товары, которые покупатели часто добавляют в корзину, тем самым увеличивают средний чек'},
    {id: 'ai-benefit-2', content: 'На голову выше конкурентов - Персонализированные рекомендации, умный поиск и автоматизированная поддержка выделят вас среди конкурентов'},
    {id: 'ai-benefit-3', content: 'Рост конверсии и продаж - ИИ анализирует поведение пользователей и предлагает релевантные товары в нужный момент'},
    {id: 'ai-benefit-4', content: 'Повышение вероятности покупки - Умные системы предсказывают потребности клиента и показывают ему именно то, что он ищет'},
    {id: 'ai-benefit-5', content: 'Голосовой поиск - Покупатели могут искать товары голосом, что ускоряет процесс и делает магазин удобнее для пользователей смартфонов и умных устройств'},
    {id: 'ai-benefit-6', content: 'Телеграм-бот - Телеграм-бот помогает с подбором товаров, оформлением заказов и отвечает на вопросы 24/7, увеличивая вовлеченность и лояльность клиентов'},
  ]

  const newText = content.find((item)=> item.id === tabId).content
  webShopTarget.innerHTML = newText
}

setTabContent('ai-benefit-1')

const setTenderTabContent = (tabId) => {
  console.log('=> target', tabId)
  
  const content = [
    {
      id: 'tender-radio-1', 
      content: [
      'Поставщики конкурируют за ваши тендеры на закупки и предлагают минимальную цену.',
      'Вы приобретаете сырье и материалы по самым выгодным ценам',
      'Усредненная экономия - 5% с каждой закупки'
    ]},
    {
      id: 'tender-radio-2', 
      content: [
        'Гибкая настройка интерфейса портала под ваши задачи',
        'Система разрабатывается с учетом навыков обычного пользователя ПК',
        'Быстрое освоение всего функционала портала'
      ]},
    {
      id: 'tender-radio-3', 
      content: [
        'Полная совместимость с ПО от 1С',
        'Возможность интеграции с любым другим офисным ПО и БД',
        'Тендеры выгружаются из БД в один клик, а поставщики могут выгружать свои предложения при синхронизации артикулов',
      ]},
    {

      id: 'tender-radio-4', 
      content:[
        'Менеджерам больше не нужно обзванивать сотни поставщиков и изучать их прайсы и КП.',
        'Формирование тендеров в автоматическом режиме исходя из текущих потребностей компании.',
        'Синхронизация с бухгалтерией поставщиков.',
        'Выбор лучших предложений по цене, условиям поставки и качеству продукции для тысяч наименований от сотен поставщиков. ',
        'Автоматически генерируется необходимый пакет документов. Полностью автоматизированный процесс закупок'
      ] },
    {

      id: 'tender-radio-5', 
      content: [
        'При создании портала учитывается каждый бизнес-процесс компании',
        'Роли пользователей распределяются согласно вашим требованиям',
        'Максимум эффективности и удобства при эксплуатации'
      ]},
    {

      id: 'tender-radio-6', 
      content: [
        'Фиксация и учет всех действий, которые совершались на портале',
        'Данные станут неопровержимым доказательством при разрешении спорных ситуаций',
        'Возможность составления необходимых отчетов и графиков по закупкам, ценам, поставщикам и т. д. в динамике'
      ]},
    {

      id: 'tender-radio-7',
      content: [
        'Минимизация количества сотрудников, задействованных в процессе закупок',
        'Автоматизация всех процессов организации закупок',
        'Сотрудники могут сосредоточиться на стратегических задачах, так как рутинные процессы выполняются системой'
      ]}, 
      
    {

      id: 'tender-radio-8', 
      content: [
        'Прозрачная процедура определения победителя тендера',
        'Защита от несанкционированного вмешательства',
        'Невозможность использования “откатов” и прочих теневых схем'
      ]},
      
  ]

  const newContent = content.find((item) => 
    item.id === tabId
  ).content
  
  tenderTarget.innerHTML = newContent.map((item) => {
    return(`<li>${item}</li>`)
  }).join('')
}

setTenderTabContent('tender-radio-1')