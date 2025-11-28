// header
const header = document.querySelector(".header");
const preloader = document.getElementById("preloader");

window.addEventListener("scroll", function () {
  if (window.scrollY > 50) {
    header?.classList.add("scrolled");
  } else {
    header?.classList.remove("scrolled");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    preloader.style.display = "none";
  }, 3000);
});

// mobile-menu
const mainMenu = document.querySelector(".menu");
const menuOpenButtons = document.querySelectorAll("[data-menu]");
const menuCloseButtons = document.querySelectorAll("[data-menu-close]");

function openMenu(menuElem) {
  if (menuElem.getAttribute("data-menu") === "open") {
    menuElem.setAttribute("data-menu", "closed");
    mainMenu.classList.remove("open");
    document.documentElement.classList.remove("menu-open");
  } else {
    menuElem.setAttribute("data-menu", "open");
    mainMenu.classList.add("open");
    document.documentElement.classList.add("menu-open");
  }
}

function closeMenu() {
  document.querySelector(".header-burger").setAttribute("data-menu", "closed");
  mainMenu.classList.remove("open");
  document.documentElement.classList.remove("menu-open");
}

function initDropdowns() {
  const menuDropdowns = document.querySelectorAll(".menu-dropdown");
  let activeDropdown = null;

  // Обработчик для главных ссылок меню
  document.querySelectorAll(".menu-dropdown > a.menu-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      const currentDropdown = this.closest(".menu-dropdown");

      // Если кликнули по уже открытому меню - просто закрываем его
      if (currentDropdown === activeDropdown) {
        currentDropdown.classList.remove("active");
        activeDropdown = null;
        e.preventDefault();
        return;
      }

      // Закрываем предыдущее открытое меню
      if (activeDropdown) {
        activeDropdown.classList.remove("active");
      }

      // Открываем текущее меню
      currentDropdown.classList.add("active");
      activeDropdown = currentDropdown;

      e.preventDefault();
    });
  });

  // Закрываем меню при клике вне области
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".menu-dropdown") && activeDropdown) {
      activeDropdown.classList.remove("active");
      activeDropdown = null;
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  if (window.innerWidth <= 1000) {
    initDropdowns();
  }
});

// Обработчик событий для кнопки открытия меню
menuOpenButtons?.forEach((menuElem) => {
  menuElem?.addEventListener("click", () => {
    openMenu(menuElem);
  });
});

// Обработчик событий для кнопки закрытия меню
menuCloseButtons?.forEach((menuItem) => {
  menuItem?.addEventListener("click", () => {
    closeMenu();
  });
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 1000) {
    closeMenu();
  }

  if (window.innerWidth <= 1000) {
    initDropdowns();
  }
});

// dynamic mockup place
function updateMockupPlace() {
  const mockup = document.querySelector(".flying-mockup");
  if (!mockup) return; // Если мокап не найден, выходим из функции

  const mainPageSelector = document.querySelector(".main-section--index");
  const isMainPage = !!mainPageSelector;
  let isMobileView = window.innerWidth < 1000;

  if (isMainPage) {
    const mainSectionRight = document.querySelector(".main-section--right");
    if (!mainSectionRight) return;

    isMobileView = window.innerWidth < 1200;

    if (isMobileView) {
      // Для мобильного вида на главной странице - перед mainSectionRight
      mainSectionRight.before(mockup);
    } else {
      // Для десктопного вида на главной странице - внутрь mainSectionRight первым элементом
      mainSectionRight.insertBefore(mockup, mainSectionRight.firstChild);
    }
  } else {
    const movementPlace = document.querySelector(".main-section--actions");
    const returnPlace = document.querySelector(".main-section");

    if (isMobileView && movementPlace) {
      // Для мобильного вида на других страницах - перед movementPlace
      movementPlace.before(mockup);
    } else if (returnPlace) {
      // Для десктопного вида на других страницах - в конец returnPlace
      returnPlace.appendChild(mockup);
    }
  }
}

// Используем debounce для оптимизации обработки resize
let resizeTimeout;
function handleResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    updateMockupPlace();
  }, 50);
}

document.addEventListener("DOMContentLoaded", updateMockupPlace);
window.addEventListener("resize", handleResize);

// Проверка email-полей на заполнение
const emailInputs = document.querySelectorAll('input[type="email"]');

function validate(e) {
  if (isEmailValid(e.currentTarget.value)) {
    console.log(e.currentTarget.validationMessage);
  } else {
    console.log(e.currentTarget.validationMessage);
  }
}

emailInputs.forEach((input) => {
  input.addEventListener("input", (e) => {
    validate(e);
  });
});

function isEmailValid(value) {
  return value.match(
    /^(([^<>()[\$\\.,;:\s@\"]+(\.[^<>()[\$\\.,;:\s@\"]+)*)|(\".+\"))@((\$[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\$)|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
}

// popup logic
function initPopups() {
  const popupTriggers = document?.querySelectorAll("[data-popup]");

  popupTriggers.forEach((trigger) => {
    trigger.removeEventListener("click", handlePopupTriggerClick);
    trigger.addEventListener("click", handlePopupTriggerClick);
  });
}

// Обработчик клика на триггере модального окна
function handlePopupTriggerClick() {
  const popupId = this.dataset.popup;
  openPopup(popupId);
}

// Специально, для видео из кружочка
const toggleVideoPLay = (videoElement, init) => {
  if (videoElement) {
    init === true ? videoElement.play() : videoElement.pause();
    videoElement.setAttribute("playinline", init === true ? true : false);
    videoElement.autoplay = init === true ? true : false;
    videoElement.controls = init === true ? true : false;
    videoElement.loop = init === true ? true : false;
    videoElement.muted = init === true ? false : true;

    if (init === false) {
      videoElement.currentTime = 0;

      // optimized
      videoElement.remove();
    }
  }
};

// Открытие окон
const openPopup = (id) => {
  const popup = document.getElementById(id);
  const onLoad = popup.dataset.onload;

  let buttonClose;
  let popupVideo = popup.id === "video-circle";

  // Проверка на кнопки закрытия
  if (!popup.querySelector(".popup-close")) {
    buttonClose = document.createElement("button");
    buttonClose.classList.add("popup-close");
    buttonClose.setAttribute("data-close-popup", true);
    buttonClose.setAttribute("aria-label", "close-popup");
  }

  // Проверка окна с видео + последующая вставка <video></video>
  if (popupVideo) {
    let popupBody = popup.querySelector(".popup-body"),
      videoElement = `<video poster="./src/images/video/poster.webp">
                    <source src="./src/video/video.mp4" type="video/mp4">
                    <source src="./src/video/video.webm" type="video/webm">
                </video>`;

    // Вставляем элемент с видео
    popupBody.innerHTML = videoElement;
  }

  // Обозначаем видео селектор в popup
  let videoSelector = popup.querySelector("video");

  // Открываем окно
  popup.classList.add("open");

  // Вставка кнопки закрытия в зависимости от верстки окон
  popup.querySelector(".popup-wrapper")
    ? popup?.querySelector(".popup-wrapper").prepend(buttonClose)
    : popup.prepend(buttonClose);

  // Приостанавливаем прокрутку страницы, когда окно открыто
  document.documentElement.classList.add("popup-opened");
  videoSelector ? toggleVideoPLay(videoSelector, true) : false;

  if (onLoad) {
    window[onLoad]();
  }

  popup.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("popup-close") ||
      e.target.dataset.closePopup ||
      e.target.classList.contains("popup-wrapper") ||
      e.target.id == id
    ) {
      if (e.target.tagName && e.target.tagName.toLowerCase() !== "a") {
        e.stopPropagation();
        e.preventDefault();
      }

      // let videoPopup = popup.querySelector("video");
      let iframe = popup.querySelector("iframe");

      popup.classList.remove("open");

      if (buttonClose) {
        buttonClose.remove();
      }

      // Возвращаем прокрутку страницы, когда окно закрыто
      document.documentElement.classList.remove("popup-opened");

      videoSelector ? toggleVideoPLay(videoSelector, false) : false;
      iframe ? iframe.remove() : false;
    }
  });
};

document.addEventListener("DOMContentLoaded", initPopups);

// MAP LOGIC
document.addEventListener("DOMContentLoaded", () => {
  // console.log('=> map script started', )
  try {
    const mapLinks = document.querySelectorAll(".map-link");
    // console.log('=> links found', mapLinks)

    const mapData = {
      prague: {
        frame:
          '<iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3A596c110a6e67b7ecf53baf573cb97950916b7bfb81fe164b7ec895af9864ccb8&amp;source=constructor" width="835" height="516" frameborder="0"></iframe>',
        link: "https://yandex.ru/maps/-/CHvuzWlD",
        adress: "Poděbradská 52, 19000 Praha 9",
        phone: "420777749719",
        wa: "79518587172",
        tg: "lionvdv",
      },
      vrn: {
        frame:
          '<iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3Ade02f3d1f93ca59ddbc7669962c5e7f350cec0968beae8e096d86287b227d6b1&amp;source=constructor" width="674" height="534" frameborder="0"></iframe>',
        link: "https://yandex.com/maps/-/CHfmvO6X",
        adress: "г. Воронеж ул. Пятницкого, 40",
        schedule: "Пн-Пт: 9:00-18:00",
        phone: "74732540796",
        wa: "74732540796",
        tg: "webintrid",
      },
    };

    mapLinks.forEach((link) => {
      link?.addEventListener("click", (e) => {
        loadMap(e, e?.target?.dataset.map);
      });
    });

    function loadMap(e, value) {
      e.preventDefault();
      // console.log('=> enter func loadMap', e, value)
      const map = document.getElementById("map");

      if (!map) return;

      const container = map.querySelector(".map-container");
      const linkBtn = map.querySelector(".button-link");
      const paragraph = map.querySelector("#map-info");
      const social = map.querySelector("#map-social");
      const whatsapp = map.querySelector("#map-whatsapp");
      const telegram = map.querySelector("#map-telegram");

      paragraph.innerHTML =
        mapData[value].adress +
        (mapData[value]?.schedule
          ? '<span class="separator">|</span><span> ' +
          mapData[value].schedule +
          '</span><span class="separator">|</span>'
          : '<span class="separator">|</span>');
      container.innerHTML = mapData[value].frame;

      social.style.display =
        mapData[value]?.wa || mapData[value]?.tg ? "flex" : "none";

      whatsapp.style.display = mapData[value].wa ? "flex" : "none";
      whatsapp.setAttribute("href", "https://wa.me/" + mapData[value]?.wa);
      whatsapp.setAttribute("target", "_blank");

      telegram.style.display = mapData[value].tg ? "flex" : "none";
      telegram.setAttribute("href", "https://t.me/" + mapData[value]?.tg);
      telegram.setAttribute("target", "_blank");

      // console.log(telegram.getAttribute('href'));

      linkBtn.href = mapData[value].link;
    }
  } catch (error) {
    console.error("=> error", error.message);
  }
});

// sitePreview logic
function sitePreview() {
  let popup = document.getElementById("site-preview"),
    buttons = document.querySelectorAll("[data-site-preview]"),
    iframe = document.createElement("iframe");

  if (!buttons) return;

  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      iframe.src = e.currentTarget.dataset.sitePreview;
      popup.querySelector(".iframe-window").appendChild(iframe);
      popup.querySelector(".iframe-tab-link").innerText = e.currentTarget
        .closest(
          ".card--support, .card--recent, .card--portfolio, .card--group"
        )
        .querySelector(".card-body b, b, .card-header div span").innerText;
      popup.querySelector(".iframe-url-input").innerText =
        e.currentTarget.dataset.sitePreview;
    });
  });
}
sitePreview();

// techList logic
document.addEventListener("DOMContentLoaded", () => {
  let lists = document.querySelectorAll(".tech-we-use-list"),
    interval = 0.6;

  if (!lists) return;

  lists.forEach((list) => {
    let items = list.querySelectorAll("li");

    if (list) {
      list.style.setProperty("--list-length", items.length);

      items.forEach((item, index) => {
        item.querySelector(".tech-tag").style.animation = `list-glow ${items.length * interval
          }s linear infinite`;
        item.querySelector(".tech-tag").style.animationDelay = `${index * interval
          }s`;
      });
    }
  });
});

// SLIDER LEGACY START
// SLIDER START
function tabSlidersStart() {
  try {
    const slidesContainer = document.querySelector(".slides");
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");
    const originalSlides = document.querySelectorAll(".slide");

    if (!slidesContainer || !originalSlides.length) {
      return;
    }

    // Делегирование событий для кликов по слайдам
    slidesContainer.addEventListener("click", (e) => {
      const slide = e.target.closest(".slide");
      if (slide) {
        // Получаем индекс оригинального слайда
        const allSlides = slidesContainer.querySelectorAll(".slide");
        const slideIndex = Array.from(allSlides).indexOf(slide);
        const realIndex =
          (slideIndex - 2 + originalSlides.length) % originalSlides.length;

        // Вызываем обработчик события для слайда
        handleSlideClick(realIndex, slide);
      }
    });

    // Функция для обработки кликов по слайдам
    function handleSlideClick(index, slideElement) {
      // console.log("Clicked slide:", index);
      index === 0 ? openPopup(slideElement.dataset.popup) : "";
    }

    // Создаем клоны для плавных переходов
    const firstClone = originalSlides[0].cloneNode(true);
    const secondClone = originalSlides[1].cloneNode(true);
    const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);
    const preLastClone =
      originalSlides[originalSlides.length - 2].cloneNode(true);

    // Добавляем клоны в DOM (2 в начале и 2 в конце)
    slidesContainer.insertBefore(lastClone, originalSlides[0]);
    slidesContainer.insertBefore(preLastClone, originalSlides[0]);
    slidesContainer.appendChild(firstClone);
    slidesContainer.appendChild(secondClone);

    // Получаем все слайды (оригиналы + клоны)
    const allSlides = slidesContainer.querySelectorAll(".slide");
    const realSlideCount = originalSlides.length;
    let currentIndex = 2; // Начинаем с первого оригинального слайда

    // Определяем ориентацию слайдера
    let isHorizontal = false;
    const checkOrientation = () => {
      const newIsHorizontal = window.innerWidth <= 600;
      if (newIsHorizontal !== isHorizontal) {
        isHorizontal = newIsHorizontal;
        slidesContainer.style.flexDirection = isHorizontal ? "row" : "column";
        updateSlider(true); // Принудительное обновление без анимации
      }
    };

    // Настройки автопрокрутки
    let isAutoScrollPaused = false;
    let autoScrollIntervalId;

    // Функция обновления позиции слайдера
    function updateSlider(instant = false) {
      const slideSize = isHorizontal
        ? originalSlides[0].offsetWidth
        : originalSlides[0].offsetHeight;

      const translateValue = isHorizontal
        ? `translateX(-${currentIndex * slideSize}px)`
        : `translateY(-${currentIndex * slideSize}px)`;

      if (instant) {
        slidesContainer.style.transition = "none";
      } else {
        slidesContainer.style.transition = "transform 0.5s ease";
      }

      slidesContainer.style.transform = translateValue;
    }

    // Обработчики навигации
    function goNext() {
      clearInterval(autoScrollIntervalId);
      currentIndex++;
      updateSlider();

      // Если достигли конца (последний клон), мгновенно переходим к началу
      if (currentIndex >= allSlides.length - 2) {
        setTimeout(() => {
          currentIndex = 2;
          updateSlider(true);
        }, 500);
      }

      resetAutoScroll();
    }

    function goPrev() {
      clearInterval(autoScrollIntervalId);
      currentIndex--;
      updateSlider();

      // Если достигли начала (первый клон), мгновенно переходим к концу
      if (currentIndex <= 1) {
        setTimeout(() => {
          currentIndex = allSlides.length - 3;
          updateSlider(true);
        }, 500);
      }

      resetAutoScroll();
    }

    // Управление автопрокруткой
    function startAutoScroll() {
      if (isAutoScrollPaused) return;
      autoScrollIntervalId = setInterval(goNext, 3000);
    }

    function stopAutoScroll() {
      clearInterval(autoScrollIntervalId);
    }

    function resetAutoScroll() {
      stopAutoScroll();
      startAutoScroll();
    }

    // Обработчики событий
    nextBtn.addEventListener("click", goNext);
    prevBtn.addEventListener("click", goPrev);

    slidesContainer.addEventListener("mouseenter", () => {
      isAutoScrollPaused = true;
      stopAutoScroll();
    });

    slidesContainer.addEventListener("mouseleave", () => {
      isAutoScrollPaused = false;
      startAutoScroll();
    });

    // Инициализация
    checkOrientation();
    updateSlider(true);
    startAutoScroll();

    // Обработка ресайза с троттлингом
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        checkOrientation();
        updateSlider();
      }, 100);
    });
  } catch (err) {
    console.error("Slider error:", err);
  }
}

tabSlidersStart();
document.addEventListener("DOMContentLoaded", tabSlidersStart);
// SLIDER END

// HORIZONTAL SLIDER
const SliderInIt = () => {
  const sliders = document.querySelectorAll(".tab-slider");
  const tabButtons = document.querySelector(
    ".prices-block--buttons, [data-tabs-buttons]"
  );

  if (!tabButtons) return;

  const tabButtonsList = tabButtons.querySelectorAll(
    "label.button-link, label.button--tab"
  );

  // Единая функция для обработки слайдера
  const SliderHandler = (slider) => {
    const cards = slider.querySelectorAll(".tab-slider-card, .card--tab");
    let currentIndex = 0;

    const updateSlider = () => {
      const sliderWidth = slider.offsetWidth;
      const slidesPerPage = Math.floor(sliderWidth / 255);
      const maxIndex = Math.max(0, cards.length - slidesPerPage);
      const cardWidth = Math.floor(sliderWidth / slidesPerPage - 25);

      cards.forEach((card) => {
        card.style.minWidth = `${cardWidth}px`;
      });

      const offset = currentIndex * (cardWidth + 25);
      slider.style.transform = `translateX(-${offset}px)`;

      // Получаем актуальные ссылки на кнопки при каждом обновлении
      const prevButton = document.querySelector(".slider-arrow.prev");
      const nextButton = document.querySelector(".slider-arrow.next");

      if (prevButton && nextButton) {
        // Обновляем видимость кнопок
        prevButton.style.display =
          currentIndex === 0 || cards.length <= slidesPerPage
            ? "none"
            : "block";
        nextButton.style.display =
          currentIndex === maxIndex ||
            maxIndex <= 0 ||
            cards.length <= slidesPerPage
            ? "none"
            : "block";

        console.log(
          `currentIndex: ${currentIndex}, maxIndex: ${maxIndex}, slidesPerPage: ${slidesPerPage}, cards: ${cards.length}`
        ); // Для отладки
      }
    };

    // Обработчики для кнопок
    const handlePrevClick = () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
      }
    };

    const handleNextClick = () => {
      const sliderWidth = slider.offsetWidth;
      const slidesPerPage = Math.floor(sliderWidth / 255);
      const maxIndex = Math.max(0, cards.length - slidesPerPage);

      if (currentIndex < maxIndex) {
        currentIndex++;
        updateSlider();
      }
    };

    // Удаляем старые обработчики и добавляем новые
    const setupButtons = () => {
      const prevButton = document.querySelector(".slider-arrow.prev");
      const nextButton = document.querySelector(".slider-arrow.next");

      if (prevButton && nextButton) {
        // Клонируем кнопки чтобы сбросить все старые обработчики
        const newPrev = prevButton.cloneNode(true);
        const newNext = nextButton.cloneNode(true);

        prevButton.parentNode.replaceChild(newPrev, prevButton);
        nextButton.parentNode.replaceChild(newNext, nextButton);

        // Добавляем новые обработчики
        newPrev.addEventListener("click", handlePrevClick);
        newNext.addEventListener("click", handleNextClick);

        // Обновляем видимость кнопок
        updateSlider();
      }
    };

    setupButtons();
    window.addEventListener("resize", updateSlider);
    updateSlider();
  };

  // Общая функция инициализации
  const initializeSlider = () => {
    if (window.innerWidth > 600) {
      tabButtonsList.forEach((tabButton, index) => {
        const input = tabButton.querySelector(`#tab-slide-btn-${index + 1}`);
        if (input) {
          // Удаляем старые обработчики перед добавлением новых
          input.removeEventListener("change", handleTabChange);
          input.addEventListener("change", handleTabChange);
        }
      });

      // Инициализация первого слайдера
      // const firstSlider = document.querySelector("#tab-slide-1");
      const firstSlider = document.querySelector("[data-slider].active");
      if (firstSlider) SliderHandler(firstSlider);
    }
  };

  // Обработчик переключения табов
  const handleTabChange = function () {
    const index = Array.from(tabButtonsList).findIndex(
      (tabButton) => tabButton.querySelector('input[type="radio"]') === this
    );
    if (index !== -1) {
      const activeSlider = document.querySelector(`#tab-slide-${index + 1}`);
      if (activeSlider) SliderHandler(activeSlider);
    }
  };

  // Инициализация при загрузке
  initializeSlider();

  // Дебаунс для resize чтобы избежать множественных вызовов
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(initializeSlider, 100);
  });
};

document.addEventListener("DOMContentLoaded", SliderInIt);

// tabs init
document
  .querySelectorAll(
    '.prices-block--buttons input[type="radio"], .table-tabs--buttons input[type="radio"], [data-tabs-buttons]  input[type="radio"]'
  )
  .forEach((radio) => {
    if (!radio) return;

    radio.addEventListener("change", function () {
      const tabId = this.id.replace("btn-", "");
      document.querySelectorAll('[id^="tab-slide-"]').forEach((tab) => {
        tab.classList.remove("active");
      });
      document.getElementById(tabId).classList.add("active");
    });

    if (radio.checked === true) {
      const tabId = radio.id.replace("btn-", "");
      document.querySelectorAll('[id^="tab-slide-"]').forEach((tab) => {
        tab.classList.remove("active");
      });
      document.getElementById(tabId).classList.add("active");
    }
  });

// main page diagrams
// in tab webshop content show
document.addEventListener("DOMContentLoaded", () => {
  const webShopDiagramHandler = () => {
    const webShopDiagram = document.querySelector(".web-shop-diagram");
    if (!webShopDiagram) {
      return;
    } else {
      const webShopTarget = webShopDiagram.querySelector(".store-text-target");
      // console.log('=> webshop', webShopDiagram, webShopTarget)
      webShopDiagram.querySelectorAll("input").forEach((input) =>
        input.addEventListener("click", () => {
          // console.log('=> input', input)
          setTabContent(input.id);
          toggleLineShopAI(input.id);
        })
      );

      const toggleLineShopAI = (id) => {
        // console.log('=> enter', )
        const lines = webShopDiagram.querySelectorAll(".line");
        // console.log('=> lines', lines)
        lines.forEach((line) => {
          line.classList.remove("active-left");
          line.classList.remove("active-right");
        });
        const lastChar = id.slice(-1);
        switch (lastChar) {
          default: {
            lines[1].classList.add("active-left");
            break;
          }
          case "2": {
            lines[0].classList.add("active-left");
            break;
          }
          case "3": {
            lines[2].classList.add("active-left");
            break;
          }
          case "4": {
            lines[2].classList.add("active-right");
            break;
          }
          case "5": {
            lines[0].classList.add("active-right");
            break;
          }
          case "6": {
            lines[1].classList.add("active-right");
            break;
          }
        }
      };

      const setTabContent = (tabId) => {
        const content = [
          {
            id: "ai-benefit-1",
            content:
              "ИИ анализирует поведение пользователей и предлагает релевантные товары в нужный момент",
          },
          {
            id: "ai-benefit-2",
            content:
              "Персонализированные рекомендации, умный поиск и автоматизированная поддержка выделят вас среди конкурентов",
          },
          {
            id: "ai-benefit-3",
            content:
              "Подбирает сопутствующие товары, которые покупатели часто добавляют в корзину, тем самым увеличивают средний чек",
          },
          {
            id: "ai-benefit-4",
            content:
              "Умные системы предсказывают потребности клиента и показывают ему именно то, что он ищет",
          },
          {
            id: "ai-benefit-5",
            content:
              "Покупатели могут искать товары голосом, что ускоряет процесс и делает магазин удобнее для пользователей смартфонов и умных устройств",
          },
          {
            id: "ai-benefit-6",
            content:
              "Телеграм-бот помогает с подбором товаров, оформлением заказов и отвечает на вопросы 24/7, увеличивая вовлеченность и лояльность клиентов",
          },
        ];

        const newText = content.find((item) => item.id === tabId).content;

        webShopTarget.classList.add("transition");

        setTimeout(() => {
          webShopTarget.classList.remove("transition");
          webShopTarget.innerHTML = newText;
        }, 250);
      };

      setTabContent("ai-benefit-1");
      toggleLineShopAI("1");
    }
  };

  webShopDiagramHandler();

  const tenderDiagramHandler = () => {
    const tenderDiagram = document.querySelector(".tender-diagram");
    if (!tenderDiagram) {
      return;
    } else {
      const tenderTarget = tenderDiagram.querySelector(".tender-text-target");
      tenderDiagram.querySelectorAll("input").forEach((input) =>
        input.addEventListener("click", () => {
          setTenderTabContent(input.id);
        })
      );
      const setTenderTabContent = (tabId) => {
        const content = [
          {
            id: "tender-radio-1",
            content: [
              "Поставщики конкурируют за ваши тендеры на закупки и предлагают минимальную цену.",
              "Вы приобретаете сырье и материалы по самым выгодным ценам",
              "Усредненная экономия - 5% с каждой закупки",
            ],
          },
          {
            id: "tender-radio-2",
            content: [
              "Гибкая настройка интерфейса портала под ваши задачи",
              "Система разрабатывается с учетом навыков обычного пользователя ПК",
              "Быстрое освоение всего функционала портала",
            ],
          },
          {
            id: "tender-radio-3",
            content: [
              "Полная совместимость с ПО от 1С",
              "Возможность интеграции с любым другим офисным ПО и БД",
              "Тендеры выгружаются из БД в один клик, а поставщики могут выгружать свои предложения при синхронизации артикулов",
            ],
          },
          {
            id: "tender-radio-4",
            content: [
              "Менеджерам больше не нужно обзванивать сотни поставщиков и изучать их прайсы и КП.",
              "Формирование тендеров в автоматическом режиме исходя из текущих потребностей компании.",
              "Синхронизация с бухгалтерией поставщиков.",
              "Выбор лучших предложений по цене, условиям поставки и качеству продукции для тысяч наименований от сотен поставщиков. ",
              "Автоматически генерируется необходимый пакет документов. Полностью автоматизированный процесс закупок",
            ],
          },
          {
            id: "tender-radio-5",
            content: [
              "При создании портала учитывается каждый бизнес-процесс компании",
              "Роли пользователей распределяются согласно вашим требованиям",
              "Максимум эффективности и удобства при эксплуатации",
            ],
          },
          {
            id: "tender-radio-6",
            content: [
              "Фиксация и учет всех действий, которые совершались на портале",
              "Данные станут неопровержимым доказательством при разрешении спорных ситуаций",
              "Возможность составления необходимых отчетов и графиков по закупкам, ценам, поставщикам и т. д. в динамике",
            ],
          },
          {
            id: "tender-radio-7",
            content: [
              "Минимизация количества сотрудников, задействованных в процессе закупок",
              "Автоматизация всех процессов организации закупок",
              "Сотрудники могут сосредоточиться на стратегических задачах, так как рутинные процессы выполняются системой",
            ],
          },

          {
            id: "tender-radio-8",
            content: [
              "Прозрачная процедура определения победителя тендера",
              "Защита от несанкционированного вмешательства",
              "Невозможность использования “откатов” и прочих теневых схем",
            ],
          },
        ];

        const newContent = content.find((item) => item.id === tabId).content;

        tenderTarget.classList.add("transition");

        setTimeout(() => {
          tenderTarget.classList.remove("transition");

          tenderTarget.innerHTML = newContent
            .map((item) => {
              return `<li>${item}</li>`;
            })
            .join("");
        }, 250);
      };

      setTenderTabContent("tender-radio-1");
    }
  };

  tenderDiagramHandler();
});

// handle change clicks to add smooth change of columns
document.addEventListener("DOMContentLoaded", () => {
  const tables = document.querySelectorAll(".tender-table");

  if (!tables) return;
  tables.forEach((table) => {
    if (!table) {
      return;
    }
    const buttons = table.querySelectorAll("th");
    buttons.forEach((button, index) => {
      if (index > 0) {
        input = button.querySelector("input");
        input.addEventListener("click", (e) => {
          changeOrderHandler(button);
        });
      }
    });

    const changeOrderHandler = (button) => {
      console.log("=> inside");
      try {
        buttons.forEach((item) => {
          item.style.order = "1";
          label = item?.querySelector("label");
          label?.classList?.add("fade-out");
        });

        setTimeout(() => {
          button.style.order = "3";
        }, 350);

        setTimeout(() => {
          buttons.forEach((item) => {
            label = item?.querySelector("label");
            label?.classList?.remove("fade-out");
            console.log("-- item.style", item.style.order);
          });
        }, 400);
      } catch (error) {
        console.log("=> err", error);
      }
    };
  });
});

// sliders with pagination
function sliderInitialize() {
  const tabSliderWithPagination = (id) => {
    if (id === "logo-slider") {
      console.log("=> init", id);
    }
    let slider = document.getElementById(`${id}`);
    const pagination = document.querySelector(`#${id} + .pagination`);
    const navLeft = document.getElementById(`navleft_for--${id}`);
    const navRight = document.getElementById(`navright_for--${id}`);
    const fill = slider.dataset.fill;
    slider.style.transform = `translateX(-0px)`;
    let currentIndex = 0;

    let prevBtn = [];
    let nextBtn = [];
    let navButtons = [];

    let slides = slider.children;
    let gap = parseInt(window.getComputedStyle(slider).gap);
    const visibleWidth = slider.parentElement.clientWidth;

    if (fill) {
      const breaks = fill.split(",");
      const windowWidth = window.innerWidth;

      if (windowWidth > 1200) {
        const slideWidth = visibleWidth / breaks[0] - gap;
        [].forEach.call(slides, function (slide) {
          slide.style.minWidth = `${slideWidth}px`;
        });
      } else if (windowWidth > 900) {
        const slideWidth = visibleWidth / breaks[1] - gap;
        [].forEach.call(slides, function (slide) {
          slide.style.minWidth = `${slideWidth}px`;
        });
      } else if (windowWidth > 600) {
        const slideWidth = visibleWidth / breaks[2] - gap;
        [].forEach.call(slides, function (slide) {
          slide.style.minWidth = `${slideWidth}px`;
        });
      } else {
        const slideWidth = visibleWidth / breaks[3] - gap;
        [].forEach.call(slides, function (slide) {
          slide.style.minWidth = `${slideWidth}px`;
        });
      }
    }

    const visibleSlidesCount = Math.round(visibleWidth / slides[0].offsetWidth);

    if (!!navLeft && !!navRight) {
      prevBtn.push(navLeft);
      nextBtn.push(navRight);

      navLeft.style =
        "position: absolute; left: 5px; top: 50%; transform: translateY(-50%)";
      navRight.style = `position: absolute; right: 5px; top: 50%; transform: translateY(-50%)`;
    }

    if (id === `cases-tabs-slider`) {
      slides = slider.querySelectorAll(".tab-content");
      gap = parseInt(
        window.getComputedStyle(slider.querySelector(".cases-content")).gap
      );
    }

    for (
      let i = currentIndex;
      i < currentIndex + visibleSlidesCount && i < slides.length;
      i++
    ) {
      slides[i].classList.add("active");
    }

    const updateSlider = () => {
      const moveAmmount = (slides[0].offsetWidth + gap) * currentIndex;
      try {
        if (fill) {
          const breaks = fill.split(",");
          const windowWidth = window.innerWidth;

          if (windowWidth > 1200) {
            const slideWidth = visibleWidth / breaks[0] - gap;
            [].forEach.call(slides, function (slide) {
              slide.style.minWidth = `${slideWidth}px`;
            });
          } else if (windowWidth > 900) {
            const slideWidth = visibleWidth / breaks[1] - gap;
            [].forEach.call(slides, function (slide) {
              slide.style.minWidth = `${slideWidth}px`;
            });
          } else if (windowWidth > 600) {
            const slideWidth = visibleWidth / breaks[2] - gap;
            [].forEach.call(slides, function (slide) {
              slide.style.minWidth = `${slideWidth}px`;
            });
          } else {
            const slideWidth = visibleWidth / breaks[3] - gap;
            [].forEach.call(slides, function (slide) {
              slide.style.minWidth = `${slideWidth}px`;
            });
          }
        }
        [].forEach.call(slides, function (slide) {
          slide.classList.remove("active");
        });

        for (
          let i = currentIndex;
          i < currentIndex + visibleSlidesCount && i < slides.length;
          i++
        ) {
          slides[i].classList.add("active");
        }
        slider.style.transform = `translateX(-${moveAmmount}px)`;

        // Disable prev button if at start
        prevBtn.forEach((btn) => {
          if (currentIndex === 0) {
            btn.style.opacity = "0";
          } else {
            btn.style.opacity = "1";
          }
        });

        // Disable next button if at end
        nextBtn.forEach((btn) => {
          if (
            currentIndex + visibleSlidesCount >= slides.length ||
            currentIndex >= slides.length - 1
          ) {
            btn.style.opacity = "0";
          } else {
            btn.style.opacity = "1";
          }
        });

        if (!!pagination) {
          const btncount = slides.length - (visibleSlidesCount - 1);
          if (btncount < 2) {
            pagination.style.display = "none";
          } else if (pagination.style.display === "none" && btncount > 1) {
            pagination.style.display = "flex";
          }
        }
      } catch (err) {
        console.log("=> err", err);
      }
    };

    if (!!pagination) {
      prevBtn = [
        ...prevBtn,
        ...pagination?.querySelectorAll(".pagination--prev-btn"),
      ];
      nextBtn = [
        ...nextBtn,
        ...pagination?.querySelectorAll(".pagination--next-btn"),
      ];
      navButtons = pagination.querySelectorAll(".pagination--btn-dot");
      const dotsContainer = pagination.querySelector(
        ".pagination--buttons-dots"
      );
      const btncount = slides.length - (visibleSlidesCount - 1);

      navButtons.forEach((navbutton) => {
        navbutton.classList.remove("highlight");
      });

      navButtons[currentIndex].classList.add("highlight");

      const handleSliderArrows = () => {
        const sliderHeight = slider.offsetHeight / 2 + 40;

        prevBtn.forEach((btn) => {
          if (slider.id === "gallery-slider") {
            btn.style = `position: absolute; transform: translateY(-${sliderHeight}px) translateX(${window.innerWidth > 600 ? `-100%` : `0`
              }); left: ${window.innerWidth > 600 ? `25px` : `-5px`
              }; color: var(--blue-main);`;
          } else {
            btn.style = `position: absolute; transform: translateY(-${sliderHeight}px) translateX(${window.innerWidth > 600 ? `-100%` : `0`
              }); left: ${window.innerWidth > 600 ? `15px` : `-5px`
              }; color: var(--blue-main);`;
          }
        });
        nextBtn.forEach((btn) => {
          if (slider.id === "gallery-slider") {
            btn.style = `position: absolute; transform: translateY(-${sliderHeight}px) translateX(${window.innerWidth > 600 ? `100%` : `0`
              }); right: ${window.innerWidth > 600 ? `25px` : `-5px`
              }; color: var(--blue-main);`;
          } else {
            btn.style = `position: absolute; transform: translateY(-${sliderHeight}px) translateX(${window.innerWidth > 600 ? `100%` : `0`
              }); right: ${window.innerWidth > 600 ? `15px` : `-5px`
              }; color: var(--blue-main);`;
          }
        });
      };

      if (navButtons.length !== btncount && visibleSlidesCount > 0) {
        navButtons.forEach((button) => dotsContainer.removeChild(button));
        for (let index = 0; index < btncount; index++) {
          const btnDot = document.createElement("button");
          btnDot.classList.add("pagination--btn-dot");
          dotsContainer.appendChild(btnDot);
        }
        navButtons = pagination.querySelectorAll(".pagination--btn-dot");
        navButtons.forEach((button) => {
          button.classList.remove("highlight");
        });
        navButtons[currentIndex].classList.add("highlight");
        if (currentIndex === 0) {
          prevBtn.forEach((btn) => {
            if (currentIndex === 0) {
              btn.style.opacity = "0";
            } else {
              btn.style.opacity = "1";
            }
          });
        }
      }
      handleSliderArrows();
    }

    const nextSlide = () => {
      if (
        navButtons[currentIndex + 1] &&
        window.getComputedStyle(navButtons[currentIndex + 1]).display === "none"
      ) {
        return;
      }
      navButtons.forEach((navbutton) => {
        navbutton.classList.remove("highlight");
      });
      currentIndex =
        currentIndex === navButtons.length - 1
          ? navButtons.length - 1
          : currentIndex + 1;
      navButtons[currentIndex].classList.add("highlight");
      updateSlider();
    };

    const prevSlide = () => {
      navButtons.forEach((navbutton) => {
        navbutton.classList.remove("highlight");
      });
      currentIndex = currentIndex > 1 ? currentIndex - 1 : 0;
      navButtons[currentIndex].classList.add("highlight");
      updateSlider();
    };

    navButtons.forEach((button, index) => {
      button.addEventListener("click", () => {
        navButtons.forEach((navbutton) => {
          navbutton.classList.remove("highlight");
        });
        button.classList.add("highlight");
        currentIndex = index;
        updateSlider();
      });
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

      if (Math.abs(xDiff) > Math.abs(yDiff) && Math.abs(xDiff) > 20) {
        evt.preventDefault();
        if (xDiff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      } else {
        return;
      }
      xDown = null;
      yDown = null;
    }

    updateSlider();

    slider.addEventListener("touchstart", handleTouchStart, false);
    slider.addEventListener("touchmove", handleTouchMove, false);

    prevBtn.forEach((btn) => btn.addEventListener("click", prevSlide));
    nextBtn.forEach((btn) => btn.addEventListener("click", nextSlide));

    window.addEventListener("resize", () => {
      updateSlider();
    });
  };

  const sliders = document.querySelectorAll("[data-slider]");

  window.addEventListener("resize", () => {
    sliders.forEach((slider) => {
      try {
        tabSliderWithPagination(slider.id);
      } catch (err) {
        console.warn("=> err seting slider ", slider.id, ":", err);
      }
    });
  });

  window.addEventListener("DOMContentLoaded", () => {
    sliders.forEach((slider) => {
      try {
        tabSliderWithPagination(slider.id);
      } catch (err) {
        console.warn("=> err seting slider ", slider.id, ":", err);
      }
    });
  });

  if (sliders) {
    sliders.forEach((slider) => {
      try {
        // Listen for additions or removals of child elements
        const config = { childList: true };

        let debounceTimeout = null;

        const callback = function (mutationsList, observer) {
          if (debounceTimeout) clearTimeout(debounceTimeout);

          debounceTimeout = setTimeout(() => {
            // Check if any mutation is of type 'childList'
            const hasChildListMutation = mutationsList.some(
              (mutation) => mutation.type === "childList"
            );
            if (hasChildListMutation) {
              tabSliderWithPagination(slider.id);
            }
          }, 250);
        };

        const observer = new MutationObserver(callback);

        observer.observe(slider, config);
        // End of listen for additions or removals of child elements

        tabSliderWithPagination(slider.id);
      } catch (err) {
        console.warn("=> err seting slider ", slider.id, ":", err);
      }
    });
  }
}

sliderInitialize();
document.addEventListener("DOMContentLoaded", sliderInitialize);
document.addEventListener("resize", sliderInitialize);

// vakansies
window.addEventListener("hashchange", () => {
  console.log("=> ", location.hash);
  if (location.hash === "#apply") {
    document.getElementById("apply_link").classList.add("infinite-glow");

    setTimeout(() => {
      history.replaceState(
        "",
        document.title,
        window.location.pathname + window.location.search
      );
    }, 3000);
  }
});

// increment numbers
document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll("[data-counter-value]");

  const initIncrement = () => {
    if (counters) {
      counters.forEach((counter) => {
        let hasAnimated = false;

        const animateCounter = (counter, duration = 4000) => {
          // Убираем пробелы и преобразуем в число
          const targetValue = parseInt(
            counter.getAttribute("data-counter-value").replace(/\s+/g, ""),
            10
          );
          const blankValue = counter.getAttribute("data-counter-value").length;
          let currentValue = 0;
          const startTime = performance.now();

          // Устанавливаем начальное значение в виде нулей
          counter.textContent = "0".repeat(blankValue);

          const updateCounter = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);

            currentValue = Math.floor(progress * targetValue);
            // Форматируем текущее значение с пробелами
            counter.textContent = currentValue
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, " ") // Добавляем пробелы
              .padStart(blankValue, "0"); // Добавляем нули слева

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              // Форматируем конечное значение с пробелами
              counter.textContent = targetValue
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ") // Добавляем пробелы
                .padStart(blankValue, "0"); // Устанавливаем конечное значение с нулями
            }
          };

          requestAnimationFrame(updateCounter);
        };

        const observerOptions = {
          root: null,
          rootMargin: "0px",
          threshold: 0.1,
        };

        const observerCallback = (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (!hasAnimated) {
                setTimeout(() => {
                  animateCounter(entry.target, 1200);
                }, 250);
                hasAnimated = true;
                observer.unobserve(entry.target);
              }
            }
          });
        };

        const observer = new IntersectionObserver(
          observerCallback,
          observerOptions
        );
        observer.observe(counter);
      });
    }
  };

  setTimeout(() => {
    initIncrement();
  }, 1000);
});

// phone field handler
document.addEventListener("DOMContentLoaded", () => {
  const fields = document.querySelectorAll("input[type=tel]");
  const phonePattern =
    "^(7|8)[\\s\\-]?\\(?\\d{3}\\)?[\\s\\-]?\\d{3}[\\s\\-]?\\d{2}[\\s\\-]?\\d{2}$";

  fields.forEach((field) => {
    field.addEventListener("beforeinput", (e) => {
      const input = e.target;
      const value = input.value;
      const digits = value.replace(/\D/g, "");
      const isDigit = /\d/.test(e.data);

      if (isDigit && digits.length >= 11) {
        e.preventDefault();
      }
    });

    field.addEventListener("input", (e) => {
      const input = e.target;
      field.setAttribute("pattern", phonePattern);

      let cursorPos = input.selectionStart;
      const oldValue = input.value;

      let digits = oldValue.replace(/\D/g, "");

      if (digits.length > 0 && digits[0] !== "7") {
        digits = "7" + digits.slice(1);
      }

      if (digits.length > 11) {
        digits = digits.slice(0, 11);
      }

      function formatPhone(digits) {
        let formatted = "";
        if (digits.length > 0) {
          formatted += digits[0];
        }
        if (digits.length >= 2) {
          formatted += " (" + digits.slice(1, 4);
        }
        if (digits.length >= 5) {
          formatted += ") " + digits.slice(4, 7);
        }
        if (digits.length >= 8) {
          formatted += " " + digits.slice(7, 9);
        }
        if (digits.length >= 10) {
          formatted += " " + digits.slice(9, 11);
        }
        return formatted;
      }

      const formatted = formatPhone(digits);

      function countDigits(str, pos) {
        return (str.slice(0, pos).match(/\d/g) || []).length;
      }

      const digitsBeforeCursor = countDigits(oldValue, cursorPos);

      let newCursorPos = 0;
      let digitsCount = 0;

      while (
        digitsCount < digitsBeforeCursor &&
        newCursorPos < formatted.length
      ) {
        if (/\d/.test(formatted[newCursorPos])) {
          digitsCount++;
        }
        newCursorPos++;
      }

      input.value = formatted;
      input.setSelectionRange(newCursorPos, newCursorPos);
    });
  });
});

// blog selector
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("[data-selector]");
  const titleTarget = document.getElementById("blogs-title");
  const slider = document.getElementById("blog-slider");

  const titles = {
    "blog-site": { title: "Статьи Разработка сайтов" },
    "digital-design": { title: "Статьи Digital-дизайн" },
    "seo-promotion": { title: "Статьи SEO-продвижение" },
    "internet-marketing": { title: "Статьи Интернет-маркетинг" },
  };

  const articles = {
    "blog-site": [
      {
        img: "./src/images/image-by-item-and-alias.webp",
        link: "./blog/landing-page.html",
        title: "Отличия Landing Page от сайта",
        description: `Прежде чем заказать лендинг, нужно понимать, что это и для чего он нужен. 
                              А также нужно разобраться, в чем его отличия от обычного сайте. 
                              Суть обоих понятий довольно близка - немного отличается лишь разнообразие. 
                              Выбор должен основываться на преследуемых целях и особенностей бизнеса.`,
        date: "2022-01-01",
      },
      {
        img: "./src/images/blog/kontent_sayta.webp",
        link: "./blog/unikalnyj-kontent-dla-vasego-internet-magazina.html",
        title: "Уникальный контент для Вашего интернет-магазина",
        description: `Интернет-магазин - удобная и современная платформа для реализации товаров. 
                              Однако, для удачной работы недостаточно просто создать сайт или страницу в соцсетях. 
                              Нужно наполнить его качественным контентом: статьями, заметками и описаниями товаров.`,
        date: "2022-01-02",
      },
      {
        img: "./src/images/blog/cms-blog-preview.webp",
        link: "./blog/vozmoznosti-nasej-cms-i-sms.html",
        title: 'Возможности нашей CMS – "i-сms"',
        description: `Наша компания разрабатывает и устанавливает уникальные CMS, под конкретные веб-ресурсы с индивидуальными функциональными возможностями. 
                              Каждый такой сайт оснащается также надёжной системой защиты от несанкционированного доступа.`,
        date: "2022-01-02",
      },
      {
        img: "./src/images/blog/viz02.webp",
        link: "./blog/manual-dla-licnogo-kabineta.html",
        title: "Мануал для личного кабинета",
        description: `В этой инструкции мы расскажем для чего нужен личный кабинет и как пользоваться его инструментами.`,
        date: "2022-01-02",
      },
      {
        img: "./src/images/blog/cms-zoom.webp",
        link: "./blog/pocemu-nelza-sozdavat-internet-magaziny-na-sablonah.html",
        title: "Почему нельзя создавать интернет-магазины на шаблонах",
        description: `Основные проблемы, с которыми сталкиваются пользователи при создании сайтов на шаблонах`,
        date: "2022-01-02",
      },
      {
        img: "./src/images/blog/list-preview.webp",
        link: "./blog/pamatka-zakazciku.html",
        title: "Памятка заказчику",
        description: `Ни для кого не секрет, что коммерческий сайт – это современный инструмент бизнеса, позволяющий получать большой поток клиентов из сети. 
                              Основные задачи сайта: привлекать клиентов, приносить прибыль, способствовать продвижению торговой марки, улучшать имидж компании, обеспечивать обратную связь с потребителями и т.д., и т.п.                        `,
        date: "2022-01-02",
      },
    ],
    "digital-design": [
      {
        img: "./src/images/blog/UX_UI_dis.webp",
        link: "./blog/uxui_design.html",
        title: "UX и UI-дизайн — что это и зачем нужно?",
        description: `Доступно и кратко рассказываем о самой эффективной технологии web-дизайна.`,
        date: "2022-01-02",
      },
      {
        img: "./src/images/blog/visitka.webp",
        link: "./blog/vizitka-vaznyj-element-delovogo-imidza.html",
        title: "Визитка – важный элемент делового имиджа",
        description: `Облегчая общение, визитка служит неназойливым напоминанием о деловом человеке. 
                              Просматривая свою визитницу, ее обладатель будет постоянно видеть Вашу визитку, и не исключено, что, подыскивая деловых партнеров, вспомнит о Вашем существовании. 
                              Многие из нас к самому процессу изготовления визиток подходят не совсем ответственно и взвешенно, и напрасно.`,
        date: "2022-01-02",
      },
      {
        img: "./src/images/blog/kreative-design.webp",
        link: "./blog/kreativ-v-reklamnom-dizajne.html",
        title: "Креатив в рекламном дизайне",
        description: `Процесс рекламного дизайна заключается в непрерывном поиске новых средств, которые могли бы привлечь внимание читателя и заинтересовать его в предмете рекламы. 
                              Дизайн процесс творческий.`,
        date: "2022-01-02",
      },
      {
        img: "./src/images/blog/ponyatie-logotipa.webp",
        link: "./blog/ponatie-logotipa.html",
        title: "Понятие логотипа",
        description: `Логотип это официально принятый термин, означающий зарегистрированное в порядке оригинально оформленное художественное изображение, для отличия товаров и услуг и их рекламы.`,
        date: "2022-01-02",
      },
    ],
    "seo-promotion": [
      {
        img: "./src/images/blog/eseo.webp",
        link: "./blog/etapy-seo-prodvijenia.html",
        title: "Этапы SEO-продвижения сайта",
        description: `Чтобы стать успешным предпринимателем, просто создать сайт недостаточно. 
                              Интернет-ресурс должен быть заметен потенциальной клиентуре. 
                              Для этого требуется продвинуть его вверх в поисковых системах.`,
        date: "2022-01-02",
      },
      {
        img: "./src/images/blog/seo-circle.webp",
        link: "./blog/kratkij-gajd-po-faktoram-ranzirovania-v-seo.html",
        title: "Краткий гайд по факторам ранжирования в SEO ",
        description: `Факторы, на которые роботы смотрят при ранжировании сайтов в поисковой системе. 
                              Основная информация.`,
        date: "2022-01-02",
      },
      {
        img: "./src/images/blog/orig.webp",
        link: "./blog/filtry-andeksa-priznaki-popadania-sroki-sankcij-i-sposoby-vyhoda.html",
        title: "Фильтры Яндекса",
        description: `Признаки попадания, сроки санкций и способы выхода.
                              Кратко о том, что такое санкции Яндекса и с чем их едят.`,
        date: "2022-01-02",
      },
      {
        img: "./src/images/blog/link-building.webp",
        link: "./blog/linkbilding-v-2019-rabocie-metody.html",
        title: "Линкбилдинг в 2019: рабочие методы",
        description: `Статья о том, как продвигать сайт с помощью ссылок в 2019 году и не попадать под фильтры.`,
        date: "2022-01-02",
      },
    ],
    "internet-marketing": [
      {
        img: "./src/images/blog/reputation-preview.webp",
        link: "./blog/upravlenie-reputaciej-v-internete-zacem-i-kak.html",
        title: "Управление репутацией в интернете: зачем и как",
        description: `О том, почему так важно поддерживать репутацию бренда в интернете.`,
        date: "2022-01-02",
      },
      {
        img: "./src/images/blog/typewriter.webp",
        link: "./blog/korporativnyj-blog-dan-mode-ili-effektivnaa-reklama.html",
        title: "Корпоративный блог: дань моде или эффективная реклама?",
        description: `Зачем нужно вести корпоративный блог и что он Вам даст?`,
        date: "2022-01-02",
      },
      {
        img: "./src/images/blog/cursor-preview.webp",
        link: "./blog/kontekstnaa-reklama-8-sovetov-novickam.html",
        title: "Контекстная реклама: 8 советов новичкам",
        description: `Настройка КР для чайников – больше конверсии, меньше трат бюджета!`,
        date: "2022-01-02",
      },
      {
        img: "./src/images/blog/mic-preview.webp",
        link: "./blog/intervu.html",
        title:
          "Интервью как способ громко заявить о своём бизнесе с помощью прессы",
        description: `Одно хорошее интервью может быть эффективнее десяти щедро проплаченных рекламных кампаний. Почему? Читайте в этой статье.`,
        date: "2022-01-02",
      },
    ],
  };

  if (buttons && titleTarget && slider) {
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        titleTarget.innerText = titles[button.dataset.selector].title;

        while (slider.lastChild) {
          slider.removeChild(slider.lastChild);
        }
        articles[button.dataset.selector].forEach((article) => {
          const slide = document.createElement("div");
          slide.classList.add("card");
          slide.classList.add("card--recent");
          slide.classList.add("card--newsletter");
          slide.classList.add("active");
          const slideHtml = `
                        <a href="${article.link}">
                            <div class="img-wrapper"><img src="${article.img}" alt="${article.title}"></div>
                            <div class="card-body">
                                <b>${article.title}</b>
                                <p>
                                    ${article.description}
                                </p>
                                <span class="card-date">
                                    ${article.date}
                                </span>
                            </div>
                        </a>`;
          slide.innerHTML = slideHtml;
          slider.appendChild(slide);
        });

        buttons.forEach((btn) => btn.classList.remove("selected"));
        button.classList.add("selected");

        let elementRect = document
          .querySelector("#blogs-blog")
          .getBoundingClientRect();
        let offsetPosition = elementRect.top + window.pageYOffset - 20;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      });
    });

    const handleToggleByHash = (hash) => {
      const id = hash.replace("#", "");
      const button = document.querySelector(`.card--tab[data-selector=${id}]`);

      button.click();
    };

    setTimeout(() => {
      handleToggleByHash(window.location.hash);
    }, 300);
  }
});

// textarea autosize
window.textarea_autosize = {
  init: function () {
    // Resize all textareas with data-autosize attribute
    document
      .querySelectorAll("textarea[data-autosize]")
      .forEach(function (elem) {
        textarea_autosize.resize(elem);
      });

    // Listen for input and change events on textareas with data-autosize
    document.addEventListener("input", function (event) {
      if (event.target && event.target.matches("textarea[data-autosize]")) {
        textarea_autosize.resize(event.target);
      }
    });
    document.addEventListener("change", function (event) {
      if (event.target && event.target.matches("textarea[data-autosize]")) {
        textarea_autosize.resize(event.target);
      }
    });

    // Listen for DOMSubtreeModified event to resize textareas without data-autosize="true"
    // document.addEventListener('DOMSubtreeModified', function() {
    //     document.querySelectorAll('textarea[data-autosize]:not([data-autosize="true"])').forEach(function(elem) {
    //         textarea_autosize.resize(elem);
    //     });
    // });
  },

  resize: function (elem) {
    if (elem) {
      elem.style.height = "auto";
      elem.style.height = elem.scrollHeight + 5 + "px";

      if (elem.getAttribute("data-autosize") !== "true") {
        elem.setAttribute("data-autosize", "true");
      }
    }
  },
};

// Initialize on DOMContentLoaded
document.addEventListener("DOMContentLoaded", textarea_autosize.init);

// gallery selector
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("gallery-popup")) {
    const gallery = document
      .getElementById("gallery-popup")
      .querySelector("[data-slider]");
    const triggers = document.querySelectorAll("[data-gallery]");
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
      const contentId = info.split("_")[0];
      const contentCount = info.split("_")[1];
      clearGallery();

      for (let index = 0; index < contentCount; index++) {
        const div = document.createElement("div");
        div.classList.add("gallery-card");
        const img = document.createElement("img");
        img.src = `../src/images/galleries/${contentId}_${index + 1}.webp`;
        div.appendChild(img);
        gallery.appendChild(div);
      }

      if (onLoad) {
        window[onLoad]();
      }
    };

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        setUpGallery(trigger.dataset.gallery);
      });
    });
  }
});

// tooltip handler
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-tooltip]").forEach((el) => {
    if (!el) return;

    el.addEventListener("mouseenter", () => {
      let text = el.getAttribute("data-tooltip");

      let tooltip = document.getElementById("custom-tooltip");
      if (!tooltip) {
        tooltip = document.createElement("div");
        tooltip.id = "custom-tooltip";

        tooltip.classList.add("tooltip-after");
        document.body.appendChild(tooltip);
      }

      tooltip.textContent = text;
      tooltip.classList.add("visible");

      const rect = el.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      let top = window.scrollY + rect.bottom + 8; // 8px offset
      let left = window.scrollX + rect.left;

      // Check right overflow
      if (left + tooltipRect.width > window.scrollX + window.innerWidth) {
        left = window.scrollX + window.innerWidth - tooltipRect.width - 8;
      }
      // Check left overflow
      if (left < window.scrollX) {
        left = window.scrollX + 8;
      }
      // Check bottom overflow
      if (top + tooltipRect.height > window.scrollY + window.innerHeight) {
        top = window.scrollY + rect.top - tooltipRect.height - 8;
      }
      // Check top overflow
      if (top < window.scrollY) {
        top = window.scrollY + 8;
      }

      tooltip.style.top = `${top}px`;
      tooltip.style.left = `${left}px`;
    });

    el.addEventListener("mouseleave", () => {
      let tooltip = document.getElementById("custom-tooltip");
      if (tooltip) tooltip.classList.remove("visible");
    });
  });
});

// brif
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("calculator-brif")) {
    const inputs = document
      .getElementById("calculator-brif")
      ?.querySelectorAll(".accordion-content input");
    const sentButton = document.getElementById("send-brif-total");

    const toggleConverter = (inputs) => {
      const toggles = [];
      const texts = [];
      inputs.forEach((input) => {
        switch (input.type) {
          case "checkbox": {
            toggles.push({
              id: input.id,
              elementref: input,
              reveal: document.getElementById(input.dataset.reveal || ""),
              radioid: input.dataset.radio?.split(";"),
            });
            break;
          }
          default: {
            texts.push({
              id: input.id,
              elementref: input,
            });
            break;
          }
        }
      });

      return { toggles: toggles, texts: texts };
    };

    if (inputs && sentButton) {
      const { toggles, texts } = toggleConverter(inputs);
      const togglechange = new Event("change");

      toggles.forEach((toggle) => {
        toggle.elementref.addEventListener("change", () => {
          switch (toggle.id) {
            default: {
              if (toggle.elementref.checked) {
                if (toggle.reveal) {
                  toggle.reveal.classList.remove("hidden");
                }
                if (toggle.radioid && toggle.radioid.length > 0) {
                  toggles.map((el) => {
                    toggle.radioid?.forEach((id) => {
                      if (el.id === id && el.elementref.checked) {
                        el.elementref.checked = false;
                        el.reveal?.classList.add("hidden");
                      }
                    });
                  });
                }
                break;
              } else {
                if (toggle.reveal) {
                  toggle.reveal.classList.add("hidden");
                }
                break;
              }
            }
          }
        });
      });

      sentButton.addEventListener("click", () => {
        const review = {
          options: toggles.filter((toggle) => toggle.elementref.checked),
          extra: texts.filter((text) => text.elementref.value !== ""),
        };
        console.log(review);
      });
    }
  }
});

// calculator v1 с жесткими пресетами для типов сайтов (исправлен расчет для вложенных тендерных порталов)
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("calculator")) {
    const inputs = document
      .getElementById("calculator")
      ?.querySelectorAll(".accordion-content input");
    const reset_button = document.getElementById("reset-options-btn");
    const sentButton = document.getElementById("send-calculator-total");
    const target = document.getElementById("calculator-total-target");
    const hash = window.location.hash;
    const togglechange = new Event("change");

    const formatNumber = (num) => {
      const [integer, decimal] = num.toString().split(".");
      const formatted = integer.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      return formatted;
    };

    Object.defineProperty(target, "current_value", {
      get() {
        return this._current_value;
      },
      set(val) {
        this._current_value = val;
        this.innerText = formatNumber(val);
      },
      configurable: true,
    });

    // ФУНКЦИИ ДЛЯ УПРАВЛЕНИЯ БЛОКАМИ
    const showElement = (element) => {
      if (element) element.classList.remove("hidden");
    };

    const hideElement = (element) => {
      if (element) element.classList.add("hidden");
    };

    const showAccordionItems = (accordionItemIds) => {
      if (!accordionItemIds) return;
      accordionItemIds.forEach((itemId) => {
        const item = document.getElementById(itemId);
        showElement(item);
      });
    };

    const hideAccordionItems = (accordionItemIds) => {
      if (!accordionItemIds) return;
      accordionItemIds.forEach((itemId) => {
        const item = document.getElementById(itemId);
        hideElement(item);
      });
    };

    // ФУНКЦИЯ ДЛЯ ПОЛНОГО СБРОСА КАЛЬКУЛЯТОРА
    const resetCalculator = (toggles, counters, target) => {
      // Сбрасываем все toggles
      toggles.forEach((toggle) => {
        toggle.elementref.checked = false;
        if (toggle.reveal) {
          toggle.reveal.classList.add("hidden");
        }
      });

      // Сбрасываем все счетчики
      counters.forEach((counter) => {
        // Для design-landing устанавливаем значение 1, для остальных 0
        if (counter.intendfor === "design-landing") {
          counter.elementref.value = 1;
          counter.total = 1 * counter.price;
        } else {
          counter.elementref.value = 0;
          counter.total = 0;
        }
      });

      target.current_value = 0;

      // Показываем все accordion-items при сбросе
      const allAccordionItems = document.querySelectorAll(".accordion-item");
      allAccordionItems.forEach((item) => {
        item.classList.remove("hidden");
        item.classList.remove("deactive");
      });
    };

    // ФУНКЦИЯ ДЛЯ ПРИМЕНЕНИЯ ПРЕСЕТА ТИПА САЙТА
    const applySiteTypePreset = (selectedToggle, toggles, counters, target) => {
      // Полностью сбрасываем калькулятор
      resetCalculator(toggles, counters, target);

      isTenderToggling(selectedToggle);

      // Применяем выбранный тип сайта
      selectedToggle.elementref.checked = true;
      target.current_value += selectedToggle.price;

      // Показываем reveal блок
      if (selectedToggle.reveal) {
        selectedToggle.reveal.classList.remove("hidden");
      }

      // Активируем все nested toggles и добавляем их стоимость
      if (selectedToggle.nested && selectedToggle.nested.length > 0) {
        selectedToggle.nested.forEach((nestedToggleId) => {
          const nestedToggle = toggles.find((t) => t.id === nestedToggleId);
          if (nestedToggle) {
            nestedToggle.elementref.checked = true;
            target.current_value += nestedToggle.price;

            // Добавляем стоимость счетчиков nested toggles
            if (nestedToggle.counter) {
              const counter = nestedToggle.counter;
              // ВОССТАНАВЛИВАЕМ ЗНАЧЕНИЕ СЧЕТЧИКА ИЗ HTML
              const defaultValue = parseInt(
                counter.elementref.getAttribute("value") || "0"
              );
              counter.elementref.value = defaultValue;
              counter.total = defaultValue * counter.price;
              target.current_value += counter.total;

              // ПОКАЗЫВАЕМ REVEAL-БЛОК ДЛЯ СЧЕТЧИКА
              if (nestedToggle.reveal) {
                nestedToggle.reveal.classList.remove("hidden");
              }
            }

            // ПОКАЗЫВАЕМ REVEAL-БЛОК ДЛЯ NESTED TOGGLE
            if (nestedToggle.reveal) {
              nestedToggle.reveal.classList.remove("hidden");
            }

            // Активируем связанные секции
            const section = document.querySelector(
              `#section-${nestedToggleId.split("-")?.[0]}`
            );
            if (section) {
              section.checked = true;
            }
          }
        });
      }

      // Управляем блоками accordion
      if (selectedToggle.showAccordionItems) {
        showAccordionItems(selectedToggle.showAccordionItems);
      }
      if (selectedToggle.hideAccordionItems) {
        hideAccordionItems(selectedToggle.hideAccordionItems);
      }
    };

    // ФУНКЦИЯ ДЛЯ ОБНОВЛЕНИЯ СЧЕТЧИКОВ
    const updateCountersForToggle = (toggle, target) => {
      if (toggle.counter) {
        const counter = toggle.counter;
        const currentValue = parseInt(counter.elementref.value || "0");
        counter.total = currentValue * counter.price;

        if (toggle.elementref.checked) {
          target.current_value += counter.total;
        }
      }
    };

    // ФУНКЦИЯ ДЛЯ ПРОВЕРКИ, ЯВЛЯЕТСЯ ЛИ TOGGLE ВНУТРЕННИМ ДЛЯ ТЕНДЕРНОГО ПОРТАЛА
    const isTenderPortalInnerToggle = (toggle) => {
      const tenderConfigIds = [
        "tender-portal_config",
        "tender-portal_paying_config",
      ];

      for (const configId of tenderConfigIds) {
        const configElement = document.getElementById(configId);
        if (configElement && configElement.contains(toggle.elementref)) {
          return true;
        }
      }
      return false;
    };

    // ФУНКЦИЯ ДЛЯ ОБРАБОТКИ TENDERS_TOGGLE (ОСОБЫЙ СЛУЧАЙ)
    const handleTendersToggle = (toggle, toggles, counters, target) => {
      if (toggle.elementref.checked) {
        // АКТИВАЦИЯ TENDERS_TOGGLE - сбрасываем калькулятор и показываем блок
        resetCalculator(toggles, counters, target);

        // Восстанавливаем состояние tenders_toggle
        toggle.elementref.checked = true;

        // Показываем блок тендерных порталов
        if (toggle.showAccordionItems) {
          showAccordionItems(toggle.showAccordionItems);
        }

        // Скрываем другие аккордеоны (как для тендерных порталов)
        isTenderToggling({
          elementref: { id: "tenders_toggle", checked: true },
        });
      } else {
        // ДЕАКТИВАЦИЯ TENDERS_TOGGLE - сбрасываем калькулятор и скрываем блок
        resetCalculator(toggles, counters, target);

        // Скрываем блок тендерных порталов
        if (toggle.showAccordionItems) {
          hideAccordionItems(toggle.showAccordionItems);
        }
      }
    };

    // ФУНКЦИЯ ДЛЯ АКТИВАЦИИ NESTED TOGGLES С ДОБАВЛЕНИЕМ СТОИМОСТИ
    const activateNestedToggles = (toggle, toggles, target) => {
      if (toggle.nested && toggle.nested.length > 0) {
        toggle.nested.forEach((nestedToggleid) => {
          const nestedToggle = toggles.find((t) => t.id === nestedToggleid);
          if (nestedToggle && !nestedToggle.elementref.checked) {
            // Активируем nested toggle
            nestedToggle.elementref.checked = true;

            // Добавляем стоимость nested toggle
            target.current_value += nestedToggle.price;

            // Показываем reveal блок
            if (nestedToggle.reveal) {
              nestedToggle.reveal.classList.remove("hidden");
            }

            // Активируем связанные секции
            const section = document.querySelector(
              `#section-${nestedToggleid.split("-")?.[0]}`
            );
            if (section) section.checked = true;

            // Рекурсивно активируем вложенные nested toggles
            activateNestedToggles(nestedToggle, toggles, target);
          }
        });
      }
    };

    // ФУНКЦИЯ ДЛЯ ДЕАКТИВАЦИИ NESTED TOGGLES С ВЫЧИТАНИЕМ СТОИМОСТИ
    const deactivateNestedToggles = (toggle, toggles, target) => {
      if (toggle.nested && toggle.nested.length > 0) {
        toggle.nested.forEach((nestedToggleid) => {
          const nestedToggle = toggles.find((t) => t.id === nestedToggleid);
          if (nestedToggle && nestedToggle.elementref.checked) {
            // Вычитаем стоимость nested toggle
            target.current_value -= nestedToggle.price;

            // Деактивируем nested toggle
            nestedToggle.elementref.checked = false;

            // Скрываем reveal блок
            if (nestedToggle.reveal) {
              nestedToggle.reveal.classList.add("hidden");
            }

            // Рекурсивно деактивируем вложенные nested toggles
            deactivateNestedToggles(nestedToggle, toggles, target);
          }
        });
      }
    };

    const handleToggleByHash = (hash, toggles, counters, target) => {
      const id = hash.replace("#", "");
      const handle_target = toggles.find((t) => t.id === id);

      if (handle_target) {
        try {
          // ОСОБАЯ ЛОГИКА ДЛЯ ТИПОВ САЙТОВ
          if (handle_target.isSiteType) {
            // Для типов сайтов применяем полный пресет
            applySiteTypePreset(handle_target, toggles, counters, target);
          } else {
            // Для обычных toggles активируем напрямую
            handle_target.elementref.checked = true;
            handle_target.elementref.dispatchEvent(togglechange);

            // Активируем nested toggles
            if (handle_target.nested && handle_target.nested.length > 0) {
              handle_target.nested.forEach((nestedToggleid) => {
                const nestedToggle = toggles.find(
                  (t) => t.id === nestedToggleid
                );
                const section = document.querySelector(
                  `#section-${nestedToggleid.split("-")?.[0]}`
                );
                if (section) section.checked = true;

                try {
                  if (nestedToggle) {
                    nestedToggle.elementref.checked = true;
                    nestedToggle.elementref.dispatchEvent(togglechange);
                  } else {
                    console.error("=> ", nestedToggleid, "not found");
                  }
                  if (nestedToggle?.reveal) {
                    nestedToggle.reveal.classList.remove("hidden");
                  }
                } catch (err) {
                  console.error(nestedToggleid, err);
                }
              });
            }
          }
          toggleSection(["calculator", "calculator-total"], false);
          console.log("=> success");
        } catch (err) {
          console.log("=> error", err);
        }
      } else {
        console.log("=> toggle not found for hash:", id);
      }
    };

    // ОБНОВЛЕН toggleConverter - УТОЧНЕННАЯ ЛОГИКА ДЛЯ isSiteType
    const toggleConverter = (inputs) => {
      const toggles = [];
      const counters = [];
      const texts = [];

      // Определяем основные типы сайтов (tenders_toggle НЕ является типом сайта)
      const mainSiteTypes = [
        "type-landing",
        "type-portfolio",
        "type-corporate",
        "type-corporate_catalogue",
        "type-store",
        "type-store_ai",
        "type-portal",
        "tenders-toggle",
        "type-unique",
      ];

      inputs.forEach((input) => {
        switch (input.type) {
          case "checkbox": {
            // Проверяем, является ли это основным типом сайта
            const isMainSiteType = mainSiteTypes.includes(input.id);

            toggles.push({
              id: input.id,
              elementref: input,
              price: parseInt(input.dataset.price || "0"),
              nested: input.dataset.nested?.split(";"),
              reveal: document.getElementById(input.dataset.reveal || ""),
              radioid: input.dataset.radio?.split(";"),
              showAccordionItems: input.dataset.showAccordionItem?.split(";"),
              hideAccordionItems: input.dataset.hideAccordionItem?.split(";"),
              isSiteType: isMainSiteType,
            });
            break;
          }
          case "number": {
            counters.push({
              id: input.id,
              elementref: input,
              price: parseInt(input.dataset.price || "0"),
              total:
                parseInt(input.dataset.price || "0") *
                (parseInt(input.value) || 0),
              intendfor: input.dataset.intendfor,
            });
            break;
          }
          default: {
            texts.push({
              id: input.id,
              elementref: input,
            });
            break;
          }
        }
      });

      toggles.forEach((toggle) => {
        counters.forEach((counter) => {
          if (counter.intendfor === toggle.id) {
            toggle.counter = counter;
          }
        });
      });

      return { toggles: toggles, counters: counters, texts: texts };
    };

    // Функция деактивации аккордионов при изменении состояния переключателей Тендерных порталов
    const isTenderToggling = (toggle) => {
      const accordionNamesToHide = [
        "design-accordion",
        "engine-accordion",
        "management-accordion",
        "structure-accordion",
        "modules-accordion",
        "ai-accordion",
        "seo-accordion",
        "extra-accordion",
      ];

      const accordions = document.querySelectorAll(".accordion-item");
      const isTenderSelected =
        (toggle.elementref.id === "tender-portal" ||
          toggle.elementref.id === "tender-portal-paying" ||
          toggle.elementref.id === "tenders_toggle") &&
        toggle.elementref.checked;

      accordions.forEach((accordion) => {
        // Проверяем, содержится ли id аккордиона в массиве accordionNamesToHide
        if (accordionNamesToHide.some((name) => accordion.id === name)) {
          if (isTenderSelected) {
            // Деактивируем и сворачиваем аккордион
            accordion.classList.add("deactive");
            // Находим чекбокс секции и снимаем выделение (сворачиваем)
            const sectionCheckbox = accordion.querySelector(
              'input[type="checkbox"][id^="section-"]'
            );
            if (sectionCheckbox) {
              sectionCheckbox.checked = false;
            }
          } else {
            // Активируем аккордион (разрешаем взаимодействие)
            accordion.classList.remove("deactive");
          }
        }
      });
    };

    if (inputs && target) {
      const { toggles, counters, texts } = toggleConverter(inputs);
      target.innerText = 0;
      target.current_value = 0;

      toggles.forEach((toggle) => {
        toggle.elementref.addEventListener("change", () => {
          // ОСОБАЯ ЛОГИКА ДЛЯ TENDERS_TOGGLE
          if (toggle.id === "tenders_toggle") {
            handleTendersToggle(toggle, toggles, counters, target);
            isTenderToggling(toggle);
            return;
          }

          // ОСОБАЯ ЛОГИКА ДЛЯ ТИПОВ САЙТОВ
          if (toggle.isSiteType) {
            if (toggle.elementref.checked) {
              applySiteTypePreset(toggle, toggles, counters, target);
            } else {
              resetCalculator(toggles, counters, target);
            }
            isTenderToggling(toggle);
            return;
          }

          // ПРОВЕРЯЕМ, ЯВЛЯЕТСЯ ЛИ TOGGLE ВНУТРЕННИМ ДЛЯ ТЕНДЕРНОГО ПОРТАЛА
          const isTenderInnerToggle = isTenderPortalInnerToggle(toggle);

          // СТАНДАРТНАЯ ЛОГИКА ДЛЯ ОБЫЧНЫХ TOGGLES
          if (toggle.elementref.checked) {
            // АКТИВАЦИЯ
            if (toggle.reveal) {
              toggle.reveal.classList.remove("hidden");
            }

            // Обновляем счетчик
            if (toggle.counter) {
              updateCountersForToggle(toggle, target);
            }

            // ОБРАБОТКА RADIO ГРУПП
            if (toggle.radioid && toggle.radioid.length > 0) {
              toggle.radioid.forEach((id) => {
                const radioToggle = toggles.find((t) => t.id === id);
                if (radioToggle && radioToggle.elementref.checked) {
                  // Деактивируем radio toggle
                  radioToggle.elementref.checked = false;
                  target.current_value -= radioToggle.price;
                  if (radioToggle.reveal) {
                    radioToggle.reveal.classList.add("hidden");
                  }

                  // Сбрасываем счетчики радио-элемента
                  if (radioToggle.counter && radioToggle.counter.total) {
                    target.current_value -= radioToggle.counter.total;
                    radioToggle.counter.total = 0;
                  }

                  // Сбрасываем nested toggles радио-элемента
                  if (radioToggle.nested) {
                    deactivateNestedToggles(radioToggle, toggles, target);
                  }
                }
              });
            }

            // АКТИВАЦИЯ NESTED TOGGLES С ДОБАВЛЕНИЕМ СТОИМОСТИ
            if (toggle.nested && toggle.nested.length > 0) {
              activateNestedToggles(toggle, toggles, target);
            }

            // ДОБАВЛЯЕМ СТОИМОСТЬ ОСНОВНОГО TOGGLE
            target.current_value += toggle.price;

            // УПРАВЛЕНИЕ БЛОКАМИ - ПРИМЕНЯЕМ ТОЛЬКО ДЛЯ НЕ-ВНУТРЕННИХ TOGGLES
            if (!isTenderInnerToggle) {
              if (toggle.showAccordionItems) {
                showAccordionItems(toggle.showAccordionItems);
              }
              if (toggle.hideAccordionItems) {
                hideAccordionItems(toggle.hideAccordionItems);
              }
            }
          } else {
            // ДЕАКТИВАЦИЯ
            if (toggle.reveal) {
              toggle.reveal.classList.add("hidden");
            }

            // ВЫЧИТАЕМ СТОИМОСТЬ СЧЕТЧИКА
            if (toggle.counter?.total) {
              target.current_value -= toggle.counter.total;
              toggle.counter.total = 0;
            }

            // ДЕАКТИВАЦИЯ NESTED TOGGLES С ВЫЧИТАНИЕМ СТОИМОСТИ
            if (toggle.nested && toggle.nested.length > 0) {
              deactivateNestedToggles(toggle, toggles, target);
            }

            // ВЫЧИТАЕМ СТОИМОСТЬ ОСНОВНОГО TOGGLE
            target.current_value -= toggle.price;

            // УПРАВЛЕНИЕ БЛОКАМИ - ПРИМЕНЯЕМ ТОЛЬКО ДЛЯ НЕ-ВНУТРЕННИХ TOGGLES
            if (!isTenderInnerToggle) {
              if (toggle.showAccordionItems) {
                hideAccordionItems(toggle.showAccordionItems);
              }
              if (toggle.hideAccordionItems) {
                showAccordionItems(toggle.hideAccordionItems);
              }
            }
          }

          // Гарантируем, что стоимость не станет отрицательной
          if (target.current_value < 0) {
            target.current_value = 0;
          }
        });
      });

      // ОБРАБОТКА COUNTERS
      counters.forEach((counter) => {
        const changeEvent = new Event("input");
        counter.elementref.nextElementSibling?.addEventListener("click", () => {
          counter.elementref.value++;
          counter.elementref.dispatchEvent(changeEvent);
        });
        counter.elementref.previousElementSibling?.addEventListener(
          "click",
          () => {
            if (counter.elementref.dataset?.intendfor === "design-landing") {
              if (counter.elementref.value > 1) {
                counter.elementref.value--;
              }
            } else if (counter.elementref.value > 0) {
              counter.elementref.value--;
            }
            counter.elementref.dispatchEvent(changeEvent);
          }
        );
        counter.elementref.addEventListener("input", () => {
          // Находим связанный toggle
          const relatedToggle = toggles.find((t) => t.id === counter.intendfor);

          if (relatedToggle && relatedToggle.elementref.checked) {
            // Если toggle активирован, обновляем стоимость
            const oldTotal = counter.total;
            counter.total =
              parseInt(
                counter.elementref.value === "" ? "0" : counter.elementref.value
              ) * counter.price;
            const difference = counter.total - oldTotal;
            target.current_value += difference;
          } else {
            // Если toggle не активирован, просто обновляем total
            counter.total =
              parseInt(
                counter.elementref.value === "" ? "0" : counter.elementref.value
              ) * counter.price;
          }

          // Гарантируем, что стоимость не станет отрицательной
          if (target.current_value < 0) {
            target.current_value = 0;
          }

          if (counter.elementref.dataset?.intendfor === "design-landing") {
            if (counter.elementref.value < 1) {
              counter.elementref.value = 1;
            }
          }

          // counter.elementref.dispatchEvent(changeEvent);
        });
        counter.elementref.addEventListener("keydown", (e) => {
          const blockedkeys = ["-", ",", ".", "+"];
          if (blockedkeys.includes(e.key)) {
            e.preventDefault();
          }
        });
        counter.elementref.addEventListener("blur", () => {
          if (counter.elementref.value === "") {
            counter.elementref.value = 0;
          }
          if (
            counter.elementref.dataset?.intendfor === "design-landing" &&
            counter.elementref.value < 1
          ) {
            counter.elementref.value = 1;
          }
        });
      });

      sentButton?.addEventListener("click", () => {
        const review = {
          options: toggles.filter((toggle) => toggle.elementref.checked),
          extra: texts.filter((text) => text.elementref.value !== ""),
          preprice: target.innerText,
        };
        console.log(review);
      });

      reset_button?.addEventListener("click", () => {
        resetCalculator(toggles, counters, target);
      });

      if (hash) {
        handleToggleByHash(hash, toggles, counters, target);
      }
    }
  }
});

// trigger blocks
const triggerButtons = document?.querySelectorAll("[data-trigger]");

triggerButtons?.forEach((button) => {
  button?.addEventListener("click", (e) => {
    toggleSection(e, true);
  });
});

const toggleSection = (trigger, isObject = false) => {
  let sectionIds = [];

  if (!isObject) {
    if (Array.isArray(trigger)) {
      sectionIds = trigger;
    } else {
      sectionIds = [trigger];
    }
  } else {
    const triggerShow = trigger.currentTarget.dataset.triggerShow;

    if (triggerShow) {
      sectionIds = triggerShow.split(";").filter((id) => id.trim() !== "");
    }
  }

  sectionIds.forEach((id) => {
    const section = document.getElementById(id);

    if (!section) {
      console.warn(`Элемент с id="${id}" не найден`);
      return;
    }

    const isActive = section.classList.contains("show");
    section.classList.add("show", !isActive);

    if (sectionIds.length > 0) {
      const firstSection = document.getElementById(sectionIds[0]);

      setTimeout(() => {
        firstSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        console.log("success scroll to #" + id);
      }, isObject ? 0 : 250);
    }
  });
};

// reviews
document.addEventListener("DOMContentLoaded", () => {
  const reviewsContainer = document.getElementById("reviews-container");

  if (reviewsContainer) {
    reviewsContainer.addEventListener("submit", (event) => {
      if (event.target.matches("form[data-pjax]")) {
        event.preventDefault();

        $.pjax.submit(event, "#reviews-container", {
          push: true,
          replace: false,
          timeout: 1000,
          scrollTo: false,
        });
      }
    });

    // Обработка кликов по пагинации
    document.addEventListener("click", (event) => {
      const pageLink = event.target.closest(".pagination a");

      if (pageLink) {
        event.preventDefault();
        $.pjax.reload("#reviews-container", {
          url: pageLink.href,
          type: "GET",
          timeout: 1000,
          push: false,
          replace: true,
          scrollTo: true,
        });
        return;
      }
    });

    document.addEventListener("change", (event) => {
      const filter = event.target.matches(".reviews__button input")
        ? event.target
        : null;

      if (filter) {
        const type = filter.dataset.type;
        const wrapper = reviewsContainer.querySelector(".reviews__list");

        const isShow = wrapper && wrapper.classList.contains("show");

        if (isShow) {
          wrapper.classList.remove("show");

          setTimeout(() => {
            wrapper.classList.add("show");
          }, 250);
        } else {
          wrapper.classList.add("show");
        }

        console.log("success change: ", type);

        $.pjax.reload("#reviews-container", {
          type: "POST",
          data: { type: type },
          timeout: 1000,
          push: false,
          replace: true,
        });
      }
    });
  }
});

// handle change clicks to add smooth change of columns
document.addEventListener("DOMContentLoaded", () => {
  const table = document.querySelector(".tender-table");
  if (!table) {
    return;
  }
  const buttons = table.querySelectorAll("th");
  buttons.forEach((button, index) => {
    if (index > 0) {
      input = button.querySelector("input");
      input.addEventListener("click", (e) => {
        changeOrderHandler(button);
      });
    }
  });

  const changeOrderHandler = (button) => {
    console.log("=> inside");
    try {
      buttons.forEach((item) => {
        item.style.order = "1";
        label = item?.querySelector("label");
        label?.classList?.add("fade-out");
      });

      setTimeout(() => {
        button.style.order = "3";
      }, 350);

      setTimeout(() => {
        buttons.forEach((item) => {
          label = item?.querySelector("label");
          label?.classList?.remove("fade-out");
          console.log("-- item.style", item.style.order);
        });
      }, 400);
    } catch (error) {
      console.log("=> err", error);
    }
  };
});

// filter portfolio sites
document.addEventListener("DOMContentLoaded", () => {
  let filtered = document.querySelector("[data-items]"),
    items = filtered?.querySelectorAll("[data-item]"),
    filterInputs = document.querySelectorAll("[data-filter]");

  if (filterInputs.length > 0 && filtered) {
    filterInputs.forEach((input) => {
      input.addEventListener("change", (e) => {
        const selectedFilters = Array.from(filterInputs)
          .filter((input) => input.checked)
          .map((input) => input.dataset.filter);

        items.forEach((item) => {
          const shouldShow =
            selectedFilters.length === 0 ||
            selectedFilters.includes(item.dataset.item);

          if (shouldShow) {
            item.style.display = "";
            item.classList.remove("hiding");
            item.classList.add("showing");
            setTimeout(() => {
              item.classList.remove("showing");
            }, 300);
          } else {
            item.classList.add("hiding");
            item.classList.remove("showing");
            setTimeout(() => {
              item.classList.remove("hiding");

              setTimeout(() => {
                item.style.display = "none";
              }, 50);
            }, 300);
          }
        });
      });
    });
  }
});

const lazyElements = document.querySelectorAll(".lazyload");
const observer = new IntersectionObserver(handleIntersection, {
  rootMargin: "100px",
});
lazyElements.forEach((element) => observer.observe(element));

// lazyloading for bg-images elements
function handleIntersection(entries) {
  entries.map((entry) => {
    if (entry.isIntersecting) {
      // Item has crossed our observation
      // threshold - load src from data-src
      entry.target.src = entry.target.dataset.src;
      entry.target.classList.remove("lazyload");
      // Job done for this item - no need to watch it!
      observer.unobserve(entry.target);
    }
  });
}
