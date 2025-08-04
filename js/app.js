// header
const header = document.getElementById("header");
const preloader = document.getElementById("preloader");

window.addEventListener("scroll", function () {
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    preloader.style.display = "none";
  }, 3000);
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

    isMobileView = window.innerWidth < 1100;

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

// popup logic
document.addEventListener("DOMContentLoaded", () => {
  const popupTriggers = document.querySelectorAll("[data-popup]");

  popupTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const popupId = trigger.dataset.popup;
      openPopup(popupId);
    });
  });

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
      }
    }
  };

  const openPopup = (id) => {
    // console.log('open ', id);
    const popup = document.getElementById(id);
    const onLoad = popup.dataset.onload;

    let buttonClose = document.createElement("button");

    buttonClose.classList.add("popup-close");
    buttonClose.setAttribute("data-close-popup", true);
    buttonClose.setAttribute("aria-label", "close-popup");

    let videoPopup = popup.querySelector("video");
    // console.log(popup);

    popup.classList.add("open");

    popup.querySelector(".popup-wrapper")
      ? popup?.querySelector(".popup-wrapper").prepend(buttonClose)
      : popup.prepend(buttonClose);

    // Приостанавливаем прокрутку страницы, когда окно открыто
    document.documentElement.classList.add("popup-opened");
    videoPopup ? toggleVideoPLay(videoPopup, true) : false;

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

        let videoPopup = popup.querySelector("video");
        let iframe = popup.querySelector("iframe");

        popup.classList.remove("open");

        buttonClose.remove();

        // Возвращаем прокрутку страницы, когда окно закрыто
        document.documentElement.classList.remove("popup-opened");

        videoPopup ? toggleVideoPLay(videoPopup, false) : false;
        iframe ? iframe.remove() : false;
      }
    });
  };
});

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
      link.addEventListener("click", (e) => {
        loadMap(e, e?.target?.dataset.map);
      });
    });

    function loadMap(e, value) {
      e.preventDefault();
      // console.log('=> enter func loadMap', e, value)
      const map = document.querySelector("#map");
      const container = map.querySelector(".map-container");
      const linkBtn = map.querySelector(".button-link");
      const paragraph = map.querySelector("p.color-white");
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

      console.log(telegram.getAttribute("href"));

      linkBtn.href = mapData[value].link;
    }
  } catch (error) {
    console.error("=> error", error.message);
  }
});

// sitePreview logic
let popup = document.querySelector("#site-preview"),
  buttons = document.querySelectorAll("[data-site-preview]"),
  iframe = document.createElement("iframe");

if (buttons.length > 0) {
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      iframe.src = e.currentTarget.dataset.sitePreview;
      popup.querySelector(".iframe-window").appendChild(iframe);
      popup.querySelector(".iframe-tab-link").innerText = e.currentTarget
        .closest(".recent-work-card, .support-card, .card--recent")
        .querySelector(".card-body b").innerText;
      popup.querySelector(".iframe-url-input").innerText =
        e.currentTarget.dataset.sitePreview;
    });
  });
}

// techList logic
document.addEventListener("DOMContentLoaded", () => {
  let lists = document.querySelectorAll(".tech-we-use-list"),
    interval = 0.6;

  lists.forEach((list) => {
    let items = list.querySelectorAll("li");

    if (list) {
      list.style.setProperty("--list-length", items.length);

      items.forEach((item, index) => {
        item.querySelector(".tech-tag").style.animation = `list-glow ${
          items.length * interval
        }s linear infinite`;
        item.querySelector(".tech-tag").style.animationDelay = `${
          index * interval
        }s`;
      });
    }
  });
});

// SLIDER LEGACY START
// SLIDER START
document.addEventListener("DOMContentLoaded", () => {
  try {
    const slides = document.querySelector(".slides");
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");
    const slideItems = document.querySelectorAll(".slide");

    if (!slides || !slideItems.length) {
      return;
    }

    const firstClone = slideItems[0]?.cloneNode(true);
    const lastClone = slideItems[slideItems.length - 1]?.cloneNode(true);
    const hr = document.createElement("hr");

    slides.insertBefore(lastClone, slideItems[0]);
    slides.appendChild(firstClone);
    slides.appendChild(hr);

    const allSlides = slides.querySelectorAll(".slide");

    const slideCount = slideItems.length;
    const height = slideItems[0].offsetHeight;

    let currentIndex = 0;
    slides.style.transform = `translateY(-${currentIndex * (height + 1)}px)`;

    let isAutoScrollPaused = false;
    slides.addEventListener("mouseenter", () => {
      isAutoScrollPaused = true;
      clearInterval(autoScrollIntervalId);
    });

    slides.addEventListener("mouseleave", () => {
      isAutoScrollPaused = false;
      startAutoScroll();
    });

    function updateSlider() {
      const currentHeight = slideItems[0].offsetHeight;
      slides.style.transform = `translateY(-${
        currentIndex * (currentHeight + 1)
      }px)`;

      if (currentIndex >= allSlides.length - 1) {
        setTimeout(() => {
          slides.style.transition = "none";
          currentIndex = 1; // Переходим к последнему оригинальному слайду
          slides.style.transform = `translateY(-${currentIndex * height}px)`;
          setTimeout(
            () => (slides.style.transition = "transform 0.5s ease"),
            50
          );
        }, 500);
      } else if (currentIndex <= 0) {
        setTimeout(() => {
          slides.style.transition = "none";
          currentIndex = slideCount - 1; // Переходим к предпоследнему оригинальному слайду
          slides.style.transform = `translateY(-${currentIndex * height}px)`;
          setTimeout(
            () => (slides.style.transition = "transform 0.5s ease"),
            50
          );
        }, 500);
      }

      // if (currentIndex === 0) {
      //   setTimeout(() => {
      //     slides.style.transition = 'none';
      //     currentIndex = slideCount - 2;
      //     updateSlider();
      //     setTimeout(
      //       () => (slides.style.transition = 'transform 0.5s ease'),
      //       50
      //     );
      //   }, 500);
      // }

      // if (currentIndex === slideCount - 1) {
      //   setTimeout(() => {
      //     slides.style.transition = 'none';
      //     currentIndex = 1;
      //     updateSlider();
      //     setTimeout(
      //       () => (slides.style.transition = 'transform 0.5s ease'),
      //       50
      //     );
      //   }, 500);
      // }
    }

    nextBtn.addEventListener("click", () => {
      clearInterval(autoScrollIntervalId);
      currentIndex++;
      updateSlider();
      resetAutoScroll();
    });

    prevBtn.addEventListener("click", () => {
      clearInterval(autoScrollIntervalId);
      currentIndex--;
      updateSlider();
      resetAutoScroll();
    });

    let autoScrollIntervalId;

    function startAutoScroll() {
      if (isAutoScrollPaused) return;
      autoScrollIntervalId = setInterval(() => {
        currentIndex++;
        updateSlider();
      }, 3000);
    }

    function resetAutoScroll() {
      clearInterval(autoScrollIntervalId);
      startAutoScroll();
    }

    // Инициализация
    slides.style.transition = "transform 0.5s ease";
    startAutoScroll();

    window.addEventListener("resize", () => {
      updateSlider();
    });
  } catch (err) {
    console.log("=> err", err);
  }
});
// SLIDER END

// HORIZONTAL SLIDER
const SliderInIt = () => {};

document.addEventListener("DOMContentLoaded", () => {
  const sliders = document.querySelectorAll(".tab-slider");

  const tabButtons = document.querySelector(
    ".prices-block--buttons, .slider-with-tabs_tabs-buttons"
  );

  if (!tabButtons) {
    return;
  }

  const tabButtonsList = tabButtons.querySelectorAll("label.button-link");

  window.addEventListener("resize", () => {
    if (window.innerWidth > 600) {
      tabButtonsList.forEach((tabButton, index) => {
        const input = tabButton.querySelector(`#tab-slide-btn-${index + 1}`);
        input.addEventListener("change", () => {
          const activeSlider = document.querySelector(
            `#tab-slide-${index + 1}`
          );
          SliderHandler(activeSlider);
        });
      });

      const SliderHandler = (slider) => {
        const cards = slider.querySelectorAll(".tab-slider-card, .card--tab");
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

          slider.style.transform = `translateX(-${
            currentIndex * (cardWidth + 25)
          }px)`;

          if (currentIndex === 0 || cards.length <= slidesPerPage) {
            prevButton.style.display = "none";
          } else {
            prevButton.style.display = "block";
          }

          if (
            currentIndex === maxIndex ||
            maxIndex <= 0 ||
            cards.length <= slidesPerPage
          ) {
            nextButton.style.display = "none";
          } else {
            nextButton.style.display = "block";
          }
        };

        prevButton.addEventListener("click", () => {
          currentIndex--;
          updateSlider();
        });

        nextButton.addEventListener("click", () => {
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

        window.addEventListener("resize", updateSlider);
        updateSlider();
      };

      SliderHandler(document.querySelector(`#tab-slide-${1}`));
    }
  });

  if (window.innerWidth > 600) {
    tabButtonsList.forEach((tabButton, index) => {
      const input = tabButton.querySelector(`#tab-slide-btn-${index + 1}`);
      input.addEventListener("change", () => {
        const activeSlider = document.querySelector(`#tab-slide-${index + 1}`);
        SliderHandler(activeSlider);
      });
    });

    const SliderHandler = (slider) => {
      const cards = slider.querySelectorAll(".tab-slider-card, .card--tab");
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
          prevButton.style.display = "none";
        } else {
          prevButton.style.display = "block";
        }

        if (
          currentIndex === maxIndex ||
          maxIndex <= 0 ||
          cards.length <= slidesPerPage
        ) {
          nextButton.style.display = "none";
        } else {
          nextButton.style.display = "block";
        }
      };

      prevButton.addEventListener("click", () => {
        currentIndex--;
        updateSlider();
      });

      nextButton.addEventListener("click", () => {
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

      window.addEventListener("resize", updateSlider);
      updateSlider();
    };

    SliderHandler(document.querySelector(`#tab-slide-${1}`));
  }
});

// tabs init
document
  .querySelectorAll('.prices-block--buttons input[type="radio"]')
  .forEach((radio) => {
    radio.addEventListener("change", function () {
      const tabId = this.id.replace("btn-", "");
      document.querySelectorAll('[id^="tab-slide-"]').forEach((tab) => {
        tab.classList.remove("active");
      });
      document.getElementById(tabId).classList.add("active");
    });
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
        webShopTarget.innerHTML = newText;
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

        tenderTarget.innerHTML = newContent
          .map((item) => {
            return `<li>${item}</li>`;
          })
          .join("");
      };

      setTenderTabContent("tender-radio-1");
    }
  };

  tenderDiagramHandler();
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

// sliders with pagination
function sliderInitialise() {
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
          if (currentIndex + visibleSlidesCount >= slides.length) {
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
            btn.style = `position: absolute; transform: translateY(-${sliderHeight}px) translateX(${
              window.innerWidth > 600 ? `-100%` : `0`
            }); left: ${
              window.innerWidth > 600 ? `25px` : `-5px`
            }; color: var(--blue-main);`;
          } else {
            btn.style = `position: absolute; transform: translateY(-${sliderHeight}px) translateX(${
              window.innerWidth > 600 ? `-100%` : `0`
            }); left: ${
              window.innerWidth > 600 ? `-5px` : `0`
            }; color: var(--blue-main);`;
          }
        });
        nextBtn.forEach((btn) => {
          if (slider.id === "gallery-slider") {
            btn.style = `position: absolute; transform: translateY(-${sliderHeight}px) translateX(${
              window.innerWidth > 600 ? `100%` : `0`
            }); right: ${
              window.innerWidth > 600 ? `25px` : `-5px`
            }; color: var(--blue-main);`;
          } else {
            btn.style = `position: absolute; transform: translateY(-${sliderHeight}px) translateX(${
              window.innerWidth > 600 ? `100%` : `0`
            }); right: ${
              window.innerWidth > 600 ? `-5px` : `0`
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

document.addEventListener("DOMContentLoaded", sliderInitialise);

// increment numbers
document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll("[data-counter-value]");

  const initInremet = () => {
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
    initInremet();
  }, 1000);
});
