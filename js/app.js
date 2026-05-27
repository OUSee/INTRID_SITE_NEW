// header
const header = document.querySelector(".header");
const footer = document.querySelector(".footer");
const preloader = document.getElementById("preloader");
const fileInputs = document.querySelectorAll(".input-file input[type=file]");
const emailInputs = document.querySelectorAll('input[type="email"]');
const tenderTables = document.querySelectorAll(".tender-table");
const mockup = document.querySelector(".flying-mockup");
const mainPageSelector = document.querySelector(".main-section--index");
const aboutPageSelector = document.querySelector(".main-section--about");
const articleNav = document.querySelector(".article-navigation");
const techLists = document.querySelectorAll(".tech-we-use-list");
const reviewsContainer = document.getElementById("reviews-container");
const webShopDiagram = document.querySelector(".web-shop-diagram");
const tenderDiagram = document.querySelector(".tender-diagram");
const mapLinks = document.querySelectorAll(".map-link");
const selects = document.querySelectorAll("select");
const aSlider = document.querySelector("#dynamic-achievements");

let dropdownClickHandlers = [];
let outsideClickHandler = null;
let photoCards = document?.querySelectorAll(".card--photo");
let headerScrolled = false;
let lastMobileState = null;
let lastFooterMobileState = null;
let lastAchievementMobileState = null;
let resizeTimeout;
let resizeRunning = false;

// mobile-menu
const mainMenu = document.querySelector(".menu");
const menuOpenButtons = document.querySelectorAll("[data-menu]");
const menuCloseButtons = document.querySelectorAll("[data-menu-close]");

const totalSwitchButtons = document.querySelectorAll("[data-total-switch]");
const triggerButtons = document?.querySelectorAll("[data-trigger]");

function pageIsScrolled() {
  const should = window.scrollY > 50;
  if (should !== headerScrolled) {
    header?.classList.toggle("scrolled", should);
    headerScrolled = should;
  }
}

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

  const currentMobileState = window.innerWidth < 1000;
  if (lastMobileState === currentMobileState) return;
  lastMobileState = currentMobileState;

  // Удаляем все ранее добавленные обработчики при переходе в десктоп
  if (!currentMobileState) {
    // Удаляем обработчики кликов на ссылках
    dropdownClickHandlers.forEach(({ link, handler }) => {
      link.removeEventListener("click", handler);
    });
    dropdownClickHandlers = [];

    // Удаляем обработчик клика вне меню
    if (outsideClickHandler) {
      document.removeEventListener("click", outsideClickHandler);
      outsideClickHandler = null;
    }

    // Сбрасываем состояние открытых меню
    if (activeDropdown) {
      activeDropdown.classList.remove("active");
      activeDropdown = null;
    }
    return; // Выходим — в десктопе ничего не добавляем
  }

  // Обработчик для главных ссылок меню (только в мобильном режиме)
  document.querySelectorAll(".menu-dropdown > a.menu-link").forEach((link) => {
    // Создаём обработчик
    const clickHandler = function (e) {
      const currentDropdown = this.closest(".menu-dropdown");

      // Если кликнули по уже открытому меню — просто закрываем его
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
    };

    // Добавляем обработчик
    link.addEventListener("click", clickHandler);

    // Сохраняем ссылку для последующего удаления
    dropdownClickHandlers.push({ link, handler: clickHandler });
  });

  // Закрываем меню при клике вне области
  outsideClickHandler = function (e) {
    if (!e.target.closest(".menu-dropdown") && activeDropdown) {
      activeDropdown.classList.remove("active");
      activeDropdown = null;
    }
  };
  document.addEventListener("click", outsideClickHandler);
}

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

// Обработчик для показа спиннера при отправки формы
function showButtonLoader(btn) {
  if (!btn || btn.dataset.loading === "true") return btn.innerHTML;
  const originalHTML = btn.innerHTML;
  btn.dataset.originalHTML = originalHTML;
  btn.innerHTML = '<span class="spinner"></span>';
  btn.disabled = true;
  btn.dataset.loading = "true";
  return originalHTML;
}

// Обработчик для скрытия спиннера и возврата оригинального текста кнопки после отправки формы
function hideButtonLoader(btn) {
  if (!btn || btn.dataset.loading !== "true") return;
  btn.innerHTML = btn.dataset.originalHTML || btn.innerHTML;
  btn.disabled = false;
  delete btn.dataset.loading;
  delete btn.dataset.originalHTML;
}

// Обработчик для показа сообщения об успешной отправке формы
function showFormFeedback(btn, message, type = "success", duration = 4000) {
  // Скрываем спиннер на кнопке (важно!)
  hideButtonLoader(btn);

  if (!message) return;

  // Удаляем предыдущий глобальный тост, если есть
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  // Создаём элемент тоста
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  document.body.appendChild(toast);

  // Принудительный reflow для CSS-перехода
  toast.offsetHeight;
  toast.classList.add("show");

  // Автоудаление
  const removeTimer = setTimeout(() => {
    toast.classList.remove("show");
    toast.addEventListener("transitionend", () => {
      if (toast.parentNode) toast.remove();
    });
    // Запасное удаление
    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 600);
  }, duration);

  // Удаление при клике на тост
  toast.addEventListener("click", () => {
    clearTimeout(removeTimer);
    toast.classList.remove("show");
    toast.addEventListener("transitionend", () => {
      if (toast.parentNode) toast.remove();
    });
    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 600);
  });
}

// move service-links in footer
function moveServiceLinks() {
  if (!footer) return;

  const topMenu = footer.querySelector(".footer-categories");
  const middleMenu = footer.querySelector(".footer-menu");
  const serviceLinks = Array.from(
    footer.querySelectorAll("[data-service-link]"),
  );

  if (!topMenu || !middleMenu || serviceLinks.length === 0) return;

  const currentFooterMobileState = window.innerWidth < 991;
  if (lastFooterMobileState === currentFooterMobileState) return;
  lastFooterMobileState = currentFooterMobileState;

  if (currentFooterMobileState) {
    // Мобильная версия: перемещаем ссылки в middleMenu в конец
    serviceLinks.forEach((link) => middleMenu.appendChild(link));
  } else {
    // Десктопная версия: перемещаем ссылки в topMenu в начало
    serviceLinks.reverse().forEach((link) => {
      topMenu.insertBefore(link, topMenu.firstChild);
    });
  }
}

// dynamic achievements
function moveAchievementsSlider() {
  if (!aSlider) return;

  const sliderPlace = document.querySelector("#slider-place");
  const mainSection = document.querySelector(
    ".main-section .main-section--actions",
  );

  if (!sliderPlace || !mainSection) return;

  const isMobile = window.innerWidth < 612;
  if (lastAchievementMobileState === isMobile) return;
  lastAchievementMobileState = isMobile;

  if (isMobile) {
    // Мобильная версия: в конец mainSection
    mainSection.insertBefore(aSlider, mainSection.firstChild);
  } else {
    // Десктопная версия: в начало sliderPlace
    sliderPlace.insertBefore(aSlider, sliderPlace.firstChild);
  }
}

// dynamic mockup place
function updateMockupPlace() {
  const isAboutPage = !!aboutPageSelector;
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
  } else if (isAboutPage) {
    const mainSectionRight = document.querySelector(".main-section--right");
    const mainSectionParagraph = document.querySelector(
      ".main-section--left p",
    );
    if (!mainSectionRight) return;

    isMobileView = window.innerWidth < 600;

    if (isMobileView) {
      // Для мобильного вида на главной странице - перед mainSectionRight
      mainSectionParagraph.after(mockup);
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

// handle resize event
function handleResize() {
  if (resizeRunning) return;

  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    resizeRunning = true;

    requestAnimationFrame(() => {
      if (window.innerWidth >= 1000) {
        closeMenu();
      }

      initDropdowns();
      moveAchievementsSlider();
      if (footer) moveServiceLinks();
      if (mockup) updateMockupPlace();
      // sliderInitialize();
      SliderInIt();
      resetTotalState();
      resizeRunning = false;
    });
  }, 350);
}

// Проверка email-полей на заполнение
function validate(e) {
  if (isEmailValid(e.currentTarget.value)) {
    // console.log(e.currentTarget.validationMessage);
  } else {
    // console.log(e.currentTarget.validationMessage);
  }
}

emailInputs.forEach((input) => {
  input.addEventListener("input", (e) => {
    validate(e);
  });
});

function isEmailValid(value) {
  return value.match(
    /^(([^<>()[\$\\.,;:\s@\"]+(\.[^<>()[\$\\.,;:\s@\"]+)*)|(\".+\"))@((\$[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\$)|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
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
  if (!popup.querySelector(".popup-close") && typeof popup.id !== "undefined") {
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
  if (typeof buttonClose !== "undefined") {
    popup.querySelector(".popup-wrapper")
      ? popup?.querySelector(".popup-wrapper").prepend(buttonClose)
      : popup.prepend(buttonClose);
  }

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

document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll("form.ajax-form");
  const recaptchaForms = [];
  const defaultSuccessMessage = "Форма отправлена";
  const defaultErrorMessage = "Ошибка отправки";
  let notificationStylesInjected = false;

  const ensureNotificationStyles = () => {
    if (notificationStylesInjected) {
      return;
    }

    if (document.getElementById("popup-notify-style")) {
      notificationStylesInjected = true;
      return;
    }

    const style = document.createElement("style");
    style.id = "popup-notify-style";
    style.textContent = `
.popup-notify__message {
  margin: 12px 0;
  font-size: 18px;
  line-height: 1.45;
}
.popup-notify__message:first-child {
  margin-top: 0;
}
.popup-notify__message:last-child {
  margin-bottom: 0;
}
.popup-notify__message--error {
  color: var(--text-hl-red);
}
`;
    document.head.appendChild(style);
    notificationStylesInjected = true;
  };

  const sanitizeMessage = (rawMessage) => {
    if (rawMessage === null || rawMessage === undefined) {
      return "";
    }

    const container = document.createElement("div");
    container.textContent = String(rawMessage);
    return container.innerHTML
      .replace(/(?:\r\n|\r|\n)/g, "<br>")
      .replace(/&lt;br\s*\/?&gt;/gi, "<br>");
  };

  const extractMessage = (payload, fallback) => {
    if (payload && typeof payload === "object" && !Array.isArray(payload)) {
      if (typeof payload.data === "string" && payload.data.trim() !== "") {
        return payload.data;
      }

      if (Array.isArray(payload.data)) {
        const prepared = payload.data
          .map((item) => (typeof item === "string" ? item.trim() : ""))
          .filter((item) => item !== "");

        if (prepared.length > 0) {
          return prepared.join("<br>");
        }
      }
    }

    if (typeof payload === "string" && payload.trim() !== "") {
      return payload;
    }

    return fallback;
  };

  const showNotificationPopup = (message, type = "success") => {
    const fallback =
      type === "error" ? defaultErrorMessage : defaultSuccessMessage;
    const popup = document.getElementById("notify");
    const normalizedMessage =
      typeof message === "string" && message.trim() !== "" ? message : fallback;

    if (!popup) {
      const alertMessage = normalizedMessage.replace(
        /<br\s*\/?>(\s*)/gi,
        "\n$1",
      );
      window.alert(alertMessage);
      return;
    }

    ensureNotificationStyles();

    const body = popup.querySelector(".popup-body");
    if (!body) {
      const alertMessage = normalizedMessage.replace(
        /<br\s*\/?>(\s*)/gi,
        "\n$1",
      );
      window.alert(alertMessage);
      return;
    }

    body.innerHTML = "";

    const messageElement = document.createElement("div");
    messageElement.classList.add("popup-notify__message");
    messageElement.classList.add(
      type === "error"
        ? "popup-notify__message--error"
        : "popup-notify__message--success",
    );
    messageElement.innerHTML = sanitizeMessage(normalizedMessage);

    body.appendChild(messageElement);

    if (typeof window.openPopup === "function") {
      window.openPopup("notify");
      return;
    }

    popup.classList.add("open");
    let closeButton = popup.querySelector(".popup-close");
    if (!closeButton) {
      closeButton = document.createElement("button");
      closeButton.classList.add("popup-close");
      closeButton.setAttribute("data-close-popup", "true");
      closeButton.setAttribute("aria-label", "close-popup");
      const wrapper = popup.querySelector(".popup-wrapper");
      if (wrapper) {
        wrapper.prepend(closeButton);
      } else {
        popup.prepend(closeButton);
      }
    }

    popup.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("popup-close") ||
        e.target.dataset.closePopup ||
        e.target.classList.contains("popup-wrapper") ||
        e.target.id == "notify"
      ) {
        if (e.target.tagName && e.target.tagName.toLowerCase() !== "a") {
          e.stopPropagation();
          e.preventDefault();
        }

        popup.classList.remove("open");

        if (closeButton) {
          closeButton.remove();
        }

        // Возвращаем прокрутку страницы, когда окно закрыто
        document.documentElement.classList.remove("popup-opened");
      }
    });

    document.documentElement.classList.add("popup-opened");
  };

  window.showNotificationPopup = showNotificationPopup;

  const closeFormPopup = (form) => {
    const popup = form.closest(".popup");
    if (!popup || !popup.classList.contains("open")) {
      return;
    }

    const closeButton = popup.querySelector(".popup-close");
    if (closeButton) {
      closeButton.click();
      return;
    }

    popup.classList.remove("open");
    if (!document.querySelector(".popup.open")) {
      document.documentElement.classList.remove("popup-opened");
    }
  };

  const resetAutosizeTextareas = (form) => {
    form.querySelectorAll("textarea[data-autosize]").forEach((textarea) => {
      textarea.style.height = "auto";
      if (
        window.textarea_autosize &&
        typeof window.textarea_autosize.resize === "function"
      ) {
        window.textarea_autosize.resize(textarea);
      }
    });
  };

  const submitAjaxForm = (form) => {
    const isQuickForm = form.id === "quick-form";
    const submitBtn = form.querySelector(
      'button[type="submit"], input[type="submit"]',
    );
    showButtonLoader(submitBtn);

    const formData = new FormData(form);
    const requestHeaders = {};

    if (isQuickForm) {
      requestHeaders["X-Requested-With"] = "XMLHttpRequest";
    }

    return fetch(form.action, {
      method: "POST",
      body: formData,
      credentials: "same-origin",
      headers: requestHeaders,
    })
      .then(async (response) => {
        let parsedData = null;

        try {
          parsedData = await response.json();
        } catch (error) {
          if (!response.ok) {
            throw new Error(defaultErrorMessage);
          }
        }

        if (!response.ok) {
          const errorMessage = extractMessage(parsedData, defaultErrorMessage);
          throw new Error(errorMessage);
        }

        return parsedData;
      })
      .then((data) => {
        const isSuccess = isQuickForm ? true : Boolean(data && data.status);

        let message = extractMessage(
          data,
          isSuccess ? defaultSuccessMessage : defaultErrorMessage,
        );

        if (
          isQuickForm &&
          data &&
          typeof data === "object" &&
          typeof data.message === "string" &&
          data.message.trim() !== ""
        ) {
          message = data.message;
        }

        if (isSuccess) {
          closeFormPopup(form);
          form.reset();
          resetAutosizeTextareas(form);
          form.querySelectorAll('input[type="file"]').forEach((input) => {
            if (input.fileInputManager) {
              input.fileInputManager.clearFiles();
            }
          });
        }
        showFormFeedback(submitBtn, message, isSuccess ? "success" : "error");
        return data;
      })
      .catch((error) => {
        const message =
          error &&
          typeof error.message === "string" &&
          error.message.trim() !== ""
            ? error.message
            : defaultErrorMessage;
        showFormFeedback(submitBtn, message, "error");
      })
      .finally(() => hideButtonLoader(submitBtn));
  };

  forms.forEach((form) => {
    const recaptchaInput = form.querySelector(
      'input[name="g-recaptcha-response"]',
    );
    const recaptchaContainer = form.querySelector(".js-recaptcha");

    if (recaptchaInput && recaptchaContainer) {
      const formData = {
        form,
        recaptchaInput,
        recaptchaContainer,
        widgetId: null,
        pendingSubmit: false,
        initialized: false,
      };

      form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (formData.widgetId !== null) {
          recaptchaInput.value = "";
          window.smartCaptcha.execute(formData.widgetId);
        } else {
          formData.pendingSubmit = true;
        }
      });

      recaptchaForms.push(formData);
    } else {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        submitAjaxForm(form);
      });
    }
  });

  if (recaptchaForms.length > 0) {
    const initializeSmartCaptcha = () => {
      recaptchaForms.forEach((item) => {
        if (item.initialized || typeof window.smartCaptcha === "undefined") {
          return;
        }

        const globalSitekey =
          typeof window.SMARTCAPTCHA_SITEKEY === "string"
            ? window.SMARTCAPTCHA_SITEKEY.trim()
            : "";
        const localSitekey =
          item.recaptchaContainer.dataset.sitekey &&
          item.recaptchaContainer.dataset.sitekey.length > 0
            ? item.recaptchaContainer.dataset.sitekey.trim()
            : "";
        const sitekey = globalSitekey || localSitekey;

        if (!sitekey) {
          return;
        }

        const widgetId = window.smartCaptcha.render(item.recaptchaContainer, {
          sitekey,
          invisible: true,
          callback: (token) => {
            item.recaptchaInput.value = token;

            submitAjaxForm(item.form).finally(() => {
              item.recaptchaInput.value = "";
            });
          },
        });

        item.widgetId = widgetId;
        item.initialized = true;

        if (item.pendingSubmit) {
          item.pendingSubmit = false;
          window.smartCaptcha.execute(widgetId);
        }
      });
    };

    if (typeof window.smartCaptcha !== "undefined") {
      initializeSmartCaptcha();
    } else {
      const callbackName = "initAjaxFormSmartCaptcha";
      const previousCallback = window[callbackName];

      window[callbackName] = () => {
        if (typeof previousCallback === "function") {
          previousCallback();
        }
        initializeSmartCaptcha();
      };

      const scriptId = "yandex-smartcaptcha-script";
      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.id = scriptId;
        script.src =
          "https://smartcaptcha.yandexcloud.net/captcha.js?render=onload&onload=" +
          callbackName +
          "&hl=ru";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
    }
  }
});

// MAP LOGIC
const mapLinksInit = () => {
  try {
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
        max: "u/f9LHodD0cOIK2py_Tk-Zx7kyjPsbUaWzS4eCQ4fOJ48vaPvbEIsQCdftNMk",
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
      const map = document.querySelector("#map");

      if (!map) return;

      const container = map.querySelector(".map-container");
      const linkBtn = map.querySelector(".button-link");
      const paragraph = map.querySelector("#map-info");
      const social = map.querySelector("#map-social");
      const whatsapp = map.querySelector("#map-whatsapp");
      const max = map.querySelector("#map-max");
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

      if (max) {
        max.style.display = mapData[value].max ? "flex" : "none";
        max.setAttribute(
          "href",
          "https://max.ru/" + (mapData[value]?.max || ""),
        );
        max.setAttribute("target", "_blank");
      }

      if (whatsapp) {
        whatsapp.style.display = mapData[value].wa ? "flex" : "none";
        whatsapp.setAttribute(
          "href",
          "https://wa.me/" + (mapData[value]?.wa || ""),
        );
        whatsapp.setAttribute("target", "_blank");
      }

      if (telegram) {
        telegram.style.display = mapData[value].tg ? "flex" : "none";
        telegram.setAttribute(
          "href",
          "https://t.me/" + (mapData[value]?.tg || ""),
        );
        telegram.setAttribute("target", "_blank");
      }

      // console.log(telegram.getAttribute("href"));

      linkBtn.href = mapData[value].link;
    }
  } catch (error) {
    console.error("=> error", error.message);
  }
};

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
          ".card--support, .card--recent, .card--portfolio, .card--group",
        )
        .querySelector(".card-body b, b, .card-header div span").innerText;
      popup.querySelector(".iframe-url-input").innerText =
        e.currentTarget.dataset.sitePreview;
    });
  });
}

// techList logic
const techListInit = () => {
  let interval = 0.6;

  if (!techLists) return;

  techLists.forEach((list) => {
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
};

// SLIDER LEGACY START
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
        const allSlides = slidesContainer.querySelectorAll(".slide");
        const slideIndex = Array.from(allSlides).indexOf(slide);
        const realIndex =
          (slideIndex - 2 + originalSlides.length) % originalSlides.length;
        handleSlideClick(realIndex, slide);
      }
    });

    function handleSlideClick(index, slideElement) {
      index === 0 ? openPopup(slideElement.dataset.popup) : "";
    }

    // Клонирование слайдов (без изменений)
    const firstClone = originalSlides[0].cloneNode(true);
    const secondClone = originalSlides[1].cloneNode(true);
    const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);
    const preLastClone =
      originalSlides[originalSlides.length - 2].cloneNode(true);

    slidesContainer.insertBefore(lastClone, originalSlides[0]);
    slidesContainer.insertBefore(preLastClone, originalSlides[0]);
    slidesContainer.appendChild(firstClone);
    slidesContainer.appendChild(secondClone);

    const allSlides = slidesContainer.querySelectorAll(".slide");
    const realSlideCount = originalSlides.length;
    let currentIndex = 2; // начинаем с первого оригинального слайда

    // ---------- ОПТИМИЗИРОВАННАЯ ОРИЕНТАЦИЯ ----------
    const mediaQuery = window.matchMedia("(max-width: 600px)");
    let isHorizontal = mediaQuery.matches; // начальное состояние
    slidesContainer.style.flexDirection = isHorizontal ? "row" : "column";

    // Функция обновления позиции слайдера
    function updateSlider(instant = false) {
      requestAnimationFrame(() => {
        if (!slidesContainer.offsetParent) return;
        const slideSize = isHorizontal
          ? originalSlides[0].offsetWidth
          : originalSlides[0].offsetHeight;
        if (!slideSize) return;

        const translateValue = isHorizontal
          ? `translateX(-${currentIndex * slideSize}px)`
          : `translateY(-${currentIndex * slideSize}px)`;

        slidesContainer.style.transition = instant
          ? "none"
          : "transform 0.5s ease";
        slidesContainer.style.transform = translateValue;
      });
    }

    // Обработчик изменения ориентации (срабатывает только при пересечении 600px)
    function handleOrientationChange(e) {
      const newIsHorizontal = e.matches;
      if (newIsHorizontal !== isHorizontal) {
        isHorizontal = newIsHorizontal;
        slidesContainer.style.flexDirection = isHorizontal ? "row" : "column";
        updateSlider(true); // мгновенно пересчитываем без анимации
      }
    }
    mediaQuery.addEventListener("change", handleOrientationChange);
    // ------------------------------------------------

    // Настройки автопрокрутки и флаги
    let isAutoScrollPaused = false;
    let autoScrollIntervalId = null;
    let isAnimating = false;

    function goNext() {
      if (isAnimating) return;
      isAnimating = true;
      clearInterval(autoScrollIntervalId);
      currentIndex++;
      updateSlider();

      setTimeout(() => {
        isAnimating = false;
      }, 500);
      if (currentIndex >= allSlides.length - 2) {
        setTimeout(() => {
          currentIndex = 2;
          updateSlider(true);
        }, 500);
      }
      resetAutoScroll();
    }

    function goPrev() {
      if (isAnimating) return;
      isAnimating = true;
      clearInterval(autoScrollIntervalId);
      currentIndex--;
      updateSlider();

      setTimeout(() => {
        isAnimating = false;
      }, 500);
      if (currentIndex <= 1) {
        setTimeout(() => {
          currentIndex = allSlides.length - 3;
          updateSlider(true);
        }, 500);
      }
      resetAutoScroll();
    }

    function startAutoScroll() {
      if (isAutoScrollPaused || autoScrollIntervalId) return;
      clearInterval(autoScrollIntervalId);
      autoScrollIntervalId = setInterval(goNext, 3000);
    }

    function stopAutoScroll() {
      if (autoScrollIntervalId) {
        clearInterval(autoScrollIntervalId);
        autoScrollIntervalId = null;
      }
    }

    function resetAutoScroll() {
      stopAutoScroll();
      setTimeout(() => {
        if (!isAutoScrollPaused) startAutoScroll();
      }, 10);
    }

    // Обработчики кнопок навигации
    nextBtn.addEventListener("click", goNext);
    prevBtn.addEventListener("click", goPrev);
    prevBtn.setAttribute("aria-label", "Предыдущий слайд");
    prevBtn.setAttribute("role", "button");
    nextBtn.setAttribute("aria-label", "Следующий слайд");
    nextBtn.setAttribute("role", "button");

    // Остановка автопрокрутки при наведении
    slidesContainer.addEventListener("mouseenter", () => {
      isAutoScrollPaused = true;
      stopAutoScroll();
    });
    slidesContainer.addEventListener("mouseleave", () => {
      isAutoScrollPaused = false;
      startAutoScroll();
    });

    window.addEventListener("blur", stopAutoScroll);
    window.addEventListener("focus", startAutoScroll);
    document.addEventListener("visibilitychange", () => {
      document.hidden ? stopAutoScroll() : startAutoScroll();
    });

    // Тач-свайпы
    let isDragging = false;

    let xDown = null,
      yDown = null,
      pos = null;

    function handleTouchStart(evt) {
      xDown = evt.touches[0].clientX;
      yDown = evt.touches[0].clientY;
      isDragging = false;
    }
    function handleTouchMove(evt) {
      if (xDown === null || yDown === null || isDragging || isAnimating) return;
      const xUp = evt.touches[0].clientX;
      const yUp = evt.touches[0].clientY;
      const xDiff = xDown - xUp;
      const yDiff = yDown - yUp;
      if (Math.abs(xDiff) > Math.abs(yDiff) && Math.abs(xDiff) > 20) {
        evt.preventDefault();
        isDragging = true;
        xDiff > 0 ? goNext() : goPrev();
      }
      // НЕ обнуляем xDown, yDown здесь!
    }
    function handleTouchEnd() {
      xDown = null;
      yDown = null;
      isDragging = false;
    }

    slidesContainer.addEventListener("touchstart", handleTouchStart, false);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, false);
    document.addEventListener("touchcancel", handleTouchEnd, false);

    // Инициализация (без checkOrientation)
    updateSlider(true);
    startAutoScroll();

    // Ресайз – только пересчёт размеров, ориентация НЕ проверяется
    let resizeTimeout;
    let isResizing = false;
    window.addEventListener("resize", () => {
      if (isResizing) return;
      isResizing = true;
      stopAutoScroll();
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        updateSlider(true);
        setTimeout(() => {
          startAutoScroll();
          isResizing = false;
        }, 300);
      }, 150);
    });
  } catch (err) {
    console.error("Slider error:", err);
  }
}
// SLIDER LEGACY END

function casesToggleTabs(interval = 5000) {
  const cases = document.querySelector(".cases-tabs");
  const isMobileView = window.innerWidth < 900;

  // Если cases нет — выходим
  if (!cases) return;

  // Если мобильный вид — ставим checked на первую кнопку и выходим
  if (isMobileView) {
    const buttons = cases.querySelectorAll(
      '.cases-buttons input[type="radio"]',
    );
    if (buttons.length > 0) {
      buttons[0].checked = true;
    }
    return;
  }

  // Получаем кнопки
  const buttons = cases.querySelectorAll('.cases-buttons input[type="radio"]');

  // Если кнопок нет — выходим
  if (buttons.length === 0) return;

  let currentIndex = 0;
  let intervalId = null;
  let isHovered = false;

  // Функция для переключения на следующую кнопку
  function switchToNextButton() {
    // Снимаем checked со всех кнопок
    buttons.forEach((button) => {
      button.checked = false;
    });

    // Переключаемся на следующую кнопку (с циклом: после последней — первая)
    currentIndex = (currentIndex + 1) % buttons.length;
    buttons[currentIndex].checked = true;
  }

  // Функция запуска автопереключения
  function startAutoSwitch() {
    if (!isHovered && !intervalId) {
      intervalId = setInterval(switchToNextButton, interval);
    }
  }

  // Функция остановки автопереключения
  function stopAutoSwitch() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  // Обработчики событий мыши
  cases.addEventListener("mouseenter", () => {
    isHovered = true;
    stopAutoSwitch();
  });

  cases.addEventListener("mouseleave", () => {
    isHovered = false;
    startAutoSwitch();
  });

  // Запускаем автопереключение изначально
  startAutoSwitch();

  // Дополнительно: сразу активируем первую кнопку при старте
  buttons[0].checked = true;

  // Возвращаем функцию для возможности отписки от событий при необходимости
  return function cleanup() {
    stopAutoSwitch();
    cases.removeEventListener("mouseenter", () => {});
    cases.removeEventListener("mouseleave", () => {});
  };
}

// HORIZONTAL SLIDER
const SliderInIt = () => {
  const sliders = document.querySelectorAll(".tab-slider");
  const tabButtons = document.querySelector(
    ".prices-block--buttons, [data-tabs-buttons]",
  );

  if (!tabButtons) return;

  const tabButtonsList = tabButtons.querySelectorAll(
    "label.button-link, label.button--tab",
  );

  // Единая функция для обработки слайдера
  const SliderHandler = (slider) => {
    const cards = slider.querySelectorAll(".tab-slider-card, .card--tab");
    let currentIndex = 0;

    const updateSlider = () => {
      requestAnimationFrame(() => {
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

        if (prevButton) {
          prevButton.setAttribute("aria-label", "Предыдущий слайд");
          prevButton.setAttribute("role", "button");
        }

        if (nextButton) {
          nextButton.setAttribute("aria-label", "Следующий слайд");
          nextButton.setAttribute("role", "button");
        }

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

          // console.log(
          // 	`currentIndex: ${currentIndex}, maxIndex: ${maxIndex}, slidesPerPage: ${slidesPerPage}, cards: ${cards.length}`
          // ); // Для отладки
        }
      });
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

        if (newPrev) {
          newPrev.setAttribute("aria-label", "Предыдущий слайд");
          newPrev.setAttribute("role", "button");
        }

        if (newNext) {
          newNext.setAttribute("aria-label", "Следующий слайд");
          newNext.setAttribute("role", "button");
        }

        // Обновляем видимость кнопок
        updateSlider();
      }
    };

    setupButtons();
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
      const firstSlider = document.querySelector("[data-slider].active");
      if (firstSlider) SliderHandler(firstSlider);
    }
  };

  // Обработчик переключения табов
  const handleTabChange = function () {
    const index = Array.from(tabButtonsList).findIndex(
      (tabButton) => tabButton.querySelector('input[type="radio"]') === this,
    );
    if (index !== -1) {
      const activeSlider = document.querySelector(`#tab-slide-${index + 1}`);
      if (activeSlider) SliderHandler(activeSlider);
    }
  };

  // Инициализация при загрузке
  initializeSlider();
};

// tabs init
document
  .querySelectorAll(
    '.prices-block--buttons input[type="radio"], .table-tabs--buttons input[type="radio"], [data-tabs-buttons]  input[type="radio"]',
  )
  .forEach((radio) => {
    if (!radio) return;

    radio.addEventListener("change", function () {
      const tabId = this.id.replace("btn-", "");
      document.querySelectorAll('[id^="tab-slide-"]').forEach((tab) => {
        tab.classList.remove("active");
      });
      const activeTab = document.getElementById(tabId);
      if (activeTab) {
        activeTab.classList.add("active");
        // Даём браузеру применить стили и показать вкладку
        setTimeout(() => {
          // Ищем все скрытые слайдеры внутри этой вкладки и принудительно обновляем их
          const slidersInTab = activeTab.querySelectorAll("[data-slider]");
          slidersInTab.forEach((slider) => {
            // Сбрасываем флаг инициализации, чтобы sliderInitialize пересоздала всё заново
            // (этот подход безопасен, потому что старые обработчики пагинации будут удалены
            // и пересозданы с актуальными размерами)
            delete slider.dataset.initialized;
          });
          // Вызываем общую переинициализацию — она обновит все видимые слайдеры (в том числе внутри табов)
          sliderInitialize();
        }, 50);
      }
    });

    if (radio.checked === true) {
      const tabId = radio.id.replace("btn-", "");
      document.querySelectorAll('[id^="tab-slide-"]').forEach((tab) => {
        tab.classList.remove("active");
      });
      document.getElementById(tabId).classList.add("active");
    }
  });

// diagrams
const webShopDiagramHandler = () => {
  const webShopTarget = webShopDiagram.querySelector(".store-text-target");
  // console.log('=> webshop', webShopDiagram, webShopTarget)

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
    // Пытаемся найти контент в HTML
    const input = document.getElementById(tabId);
    if (!input) {
      console.error(`Input with id "${tabId}" not found`);
      return;
    }

    const label = input.closest("label");
    if (!label) {
      console.error(`Label for input with id "${tabId}" not found`);
      return;
    }

    const hiddenContent = label.querySelector(".content-hidden");
    let newText;
    if (hiddenContent) {
      newText = hiddenContent.textContent;
    } else {
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

      const foundItem = content.find((item) => item.id === tabId);
      if (!foundItem) {
        console.error(`Content for id "${tabId}" not found`);
        return;
      }
      newText = foundItem.content;
    }

    webShopTarget.classList.add("transition");

    setTimeout(() => {
      webShopTarget.classList.remove("transition");
      webShopTarget.innerHTML = newText;
    }, 250);
  };

  const inputs = webShopDiagram.querySelectorAll("input");

  inputs.forEach((input) => {
    input.addEventListener("click", () => {
      setTabContent(input.id);
      toggleLineShopAI(input.id);
    });
  });

  inputs.forEach((input) => {
    if (input.checked) {
      setTabContent(input.id);
      toggleLineShopAI(input.id);
    }
  });

  const anyChecked = Array.from(inputs).some((input) => input.checked);

  if (!anyChecked) {
    setTabContent("ai-benefit-1");
    toggleLineShopAI("1");
  }
};

const tenderDiagramHandler = () => {
  const tenderTarget = tenderDiagram.querySelector(".tender-text-target");

  const setTenderTabContent = (tabId) => {
    const content = [
      {
        id: "tender-radio-1",
        content: [
          "Поставщики конкурируют за ваши тендеры и предлагают минимальную цену",
          "Вы приобретаете сырье и материалы по самым выгодным ценам",
          "Усредненная экономия - 5% с каждого тендера",
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
          "Тендеры выгружаются из БД в один клик, а транспортные компании могут выгружать свои предложения при синхронизации артикулов",
        ],
      },
      {
        id: "tender-radio-4",
        content: [
          "Менеджерам больше не нужно обзванивать сотни поставщиков и изучать их прайсы.",
          "Автоматическое формирование тендеров под текущие потребности.",
          "Синхронизация с бухгалтерией поставщиков",
          "Выбор лучших предложений по цене, срокам и качеству для тысяч товаров от сотен поставщиков",
          "Автоматическая генерация документов — полностью автоматизированный процесс закупок",
        ],
      },
      {
        id: "tender-radio-5",
        content: [
          "При создании портала учитываются особенности бизнес-процессов и корпоративные требования компании",
          "Роли пользователей распределяются согласно вашим требованиям",
          "Максимум эффективности и удобства при эксплуатации",
        ],
      },
      {
        id: "tender-radio-6",
        content: [
          "Фиксация и учет всех действий, которые совершались на портале",
          "Данные станут неопровержимым доказательством при разрешении спорных ситуаций",
          "Возможность составления необходимых отчетов и графиков по ценам, транспортным компаниям и т. д. в динамике",
        ],
      },
      {
        id: "tender-radio-7",
        content: [
          "Минимизация количества сотрудников, задействованных в процессе",
          "Автоматизация всех процессов организации",
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

  const inputs = tenderDiagram.querySelectorAll("input");

  inputs.forEach((input) => {
    input.addEventListener("click", () => {
      setTenderTabContent(input.id);
    });
  });

  inputs.forEach((input) => {
    if (input.checked) {
      setTenderTabContent(input.id);
    }
  });

  const anyChecked = Array.from(inputs).some((input) => input.checked);

  if (!anyChecked) {
    setTenderTabContent("tender-radio-1");
  }
};

// handle change clicks to add smooth change of columns
const tenderTablesInit = () => {
  tenderTables.forEach((table) => {
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
      // console.log("=> inside");
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
            // console.log("-- item.style", item.style.order);
          });
        }, 400);
      } catch (error) {
        console.log("=> err", error);
      }
    };
  });
};

// tabs-to-slider into portfolio
const portfolioCardsSlider = () => {
  let isInitialized = false;
  let resizeTimer = null;

  const breakpoint = 1000;
  const block = document.querySelector("#porfolio-body-content");
  const slider = block?.querySelector(".portfolio-block__cards");

  if (!block || !slider) return;

  if (slider.dataset.portfolioSliderInitialized === "true") {
    return;
  }

  let slides = Array.from(slider.children);
  let currentIndex = 0;
  let isAnimating = false;
  let isDragging = false;
  let isLoading = false;
  let xDown = null;
  let yDown = null;
  let pos = { x: 0, y: 0 };
  let lastSlideChange = 0;

  const pagination = block.querySelector(
    ".pagination, .pagination-block, .pages",
  );

  const getNextUrl = (root = document) => {
    const scope = root.querySelector("#porfolio-body-content") || root;
    const pagination = scope.querySelector(".pagination");

    if (!pagination) return null;

    const nextBtn = pagination.querySelector(".pagination--next-btn[href]");

    if (nextBtn) {
      return new URL(nextBtn.getAttribute("href"), window.location.origin).href;
    }

    const activeBtn = pagination.querySelector(
      ".pagination--btn-num.highlight",
    );

    if (!activeBtn) return null;

    const currentPage = Number(activeBtn.dataset.page);
    const nextPage = currentPage + 1;

    const nextPageBtn = pagination.querySelector(
      `.pagination--btn-num[data-page="${nextPage}"][href]`,
    );

    return nextPageBtn
      ? new URL(nextPageBtn.getAttribute("href"), window.location.origin).href
      : null;
  };

  let nextUrl = getNextUrl(document);

  const getVisibleSlidesCount = () => {
    if (window.innerWidth >= 1200) return 1;
    if (window.innerWidth >= 720) return 1;
    return 1;
  };

  const getGap = () => parseInt(window.getComputedStyle(slider).gap) || 0;

  const getControls = () => {
    let controls = block.querySelector(".portfolio-slider-controls");

    if (!controls) {
      controls = document.createElement("div");
      controls.className = "portfolio-slider-controls";
      controls.innerHTML = `
        <button type="button" class="portfolio-slider-prev" aria-label="Предыдущий слайд"><svg width="11" height="19" viewBox="0 0 11 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.366116 8.32107C-0.122039 8.80923 -0.122039 9.60069 0.366117 10.0888L8.32107 18.0438C8.80923 18.5319 9.60069 18.5319 10.0888 18.0438C10.577 17.5556 10.577 16.7642 10.0888 16.276L3.01777 9.20496L10.0888 2.13388C10.577 1.64573 10.577 0.85427 10.0888 0.366115C9.60067 -0.12204 8.80922 -0.122039 8.32106 0.366117L0.366116 8.32107ZM2.25 9.20496L2.25 7.95496L1.25 7.95496L1.25 9.20496L1.25 10.455L2.25 10.455L2.25 9.20496Z" fill="currentColor"/></svg></button>
        <div class="portfolio-slider-counter">1 / 1</div>
        <button type="button" class="portfolio-slider-next" aria-label="Следующий слайд"><svg width="11" height="19" viewBox="0 0 11 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.0888 10.0888C10.577 9.60068 10.577 8.80923 10.0888 8.32107L2.13389 0.366121C1.64573 -0.122034 0.854277 -0.122034 0.366121 0.366121C-0.122034 0.854277 -0.122034 1.64573 0.366121 2.13389L7.43719 9.20496L0.366121 16.276C-0.122034 16.7642 -0.122034 17.5556 0.366121 18.0438C0.854277 18.5319 1.64573 18.5319 2.13389 18.0438L10.0888 10.0888ZM8.20496 9.20496V10.455H9.20496V9.20496V7.95496H8.20496V9.20496Z" fill="currentColor"/></svg></button>
      `;

      slider.after(controls);

      controls
        .querySelector(".portfolio-slider-prev")
        .addEventListener("click", prevSlide);
      controls
        .querySelector(".portfolio-slider-next")
        .addEventListener("click", nextSlide);
    }

    return controls;
  };

  const updateCounter = () => {
    const counter = getControls().querySelector(".portfolio-slider-counter");
    counter.textContent = `${Math.min(currentIndex + 1, slides.length)} / ${slides.length}`;
  };

  const updateActiveSlides = () => {
    const visibleSlidesCount = getVisibleSlidesCount();

    slides.forEach((slide) => slide.classList.remove("active"));

    for (
      let i = currentIndex;
      i < currentIndex + visibleSlidesCount && i < slides.length;
      i++
    ) {
      slides[i].classList.add("active");
    }
  };

  const updateButtons = () => {
    const controls = getControls();
    const prevBtn = controls.querySelector(".portfolio-slider-prev");
    const nextBtn = controls.querySelector(".portfolio-slider-next");
    const visibleSlidesCount = getVisibleSlidesCount();

    prevBtn.style.opacity = currentIndex === 0 ? "0" : "1";
    prevBtn.style.pointerEvents = currentIndex === 0 ? "none" : "";

    const isLastVisibleRow = currentIndex + visibleSlidesCount >= slides.length;

    nextBtn.style.opacity = isLastVisibleRow && !nextUrl ? "0" : "1";
    nextBtn.style.pointerEvents = isLastVisibleRow && !nextUrl ? "none" : "";
  };

  const updateControlsPosition = () => {
    const controls = getControls();
    const prevBtn = controls.querySelector(".portfolio-slider-prev");
    const nextBtn = controls.querySelector(".portfolio-slider-next");

    const sliderRect = slider.getBoundingClientRect();
    const controlsRect = controls.getBoundingClientRect();

    const top = sliderRect.top - controlsRect.top + sliderRect.height / 2;

    prevBtn.style.top = `${top}px`;
    nextBtn.style.top = `${top}px`;
  };

  const updateSlider = () => {
    if (!isInitialized) return;

    slides = Array.from(slider.children);

    const visibleSlidesCount = getVisibleSlidesCount();
    const gap = getGap();
    const containerWidth = slider.parentElement.getBoundingClientRect().width;
    const slideWidth =
      (containerWidth - gap * (visibleSlidesCount - 1)) / visibleSlidesCount;

    slides.forEach((slide) => {
      slide.style.minWidth = `${slideWidth}px`;
      slide.style.maxWidth = `${slideWidth}px`;
    });

    const maxIndex = Math.max(slides.length - visibleSlidesCount, 0);
    currentIndex = Math.min(currentIndex, maxIndex);

    slider.style.transform = `translateX(-${(slideWidth + gap) * currentIndex}px)`;

    updateActiveSlides();
    updateCounter();
    updateButtons();
    updateControlsPosition();

    if (currentIndex + visibleSlidesCount >= slides.length) {
      loadMore();
    }
  };

  async function loadMore() {
    if (isLoading || !nextUrl) return;

    isLoading = true;

    try {
      const response = await fetch(nextUrl, {
        headers: {
          "X-PJAX": "true",
          "X-PJAX-Container": "#porfolio-body-content",
        },
      });

      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      const nextBlock = doc.querySelector("#porfolio-body-content") || doc;
      const newCards = nextBlock.querySelectorAll(
        ".portfolio-block__cards > *",
      );

      newCards.forEach((card) => slider.appendChild(card));

      nextUrl = getNextUrl(doc);

      gallerySelector?.();
      initPopups?.();
      sitePreview?.();

      updateSlider();
    } catch (err) {
      console.warn("Portfolio slider load more error:", err);
    } finally {
      isLoading = false;
    }
  }

  function prevSlide() {
    if (isAnimating || currentIndex === 0) return;

    isAnimating = true;
    currentIndex--;
    updateSlider();

    setTimeout(() => {
      isAnimating = false;
    }, 350);
  }

  function nextSlide() {
    if (isAnimating) return;

    const visibleSlidesCount = getVisibleSlidesCount();

    if (currentIndex + visibleSlidesCount >= slides.length) {
      loadMore();
      return;
    }

    isAnimating = true;
    currentIndex++;
    updateSlider();

    setTimeout(() => {
      isAnimating = false;
    }, 350);
  }

  function handleTouchStart(evt) {
    xDown = evt.touches[0].clientX;
    yDown = evt.touches[0].clientY;
    isDragging = false;
  }

  function handleTouchMove(evt) {
    if (xDown === null || yDown === null || isDragging || isAnimating) return;

    const xUp = evt.touches[0].clientX;
    const yUp = evt.touches[0].clientY;
    const xDiff = xDown - xUp;
    const yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff) && Math.abs(xDiff) > 20) {
      evt.preventDefault();
      isDragging = true;

      if (xDiff > 0) nextSlide();
      else prevSlide();
    }
  }

  function handleTouchEnd() {
    xDown = null;
    yDown = null;
    isDragging = false;
  }

  function mouseDownHandler(e) {
    e.preventDefault();

    pos = {
      x: e.clientX,
      y: e.clientY,
    };

    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
  }

  function mouseMoveHandler(e) {
    const currentTime = Date.now();
    const dx = e.clientX - pos.x;
    const dy = e.clientY - pos.y;

    isDragging = true;

    slides.forEach((slide) => {
      slide.style.pointerEvents = "none";
    });

    if (
      Math.abs(dx) > Math.abs(dy) &&
      Math.abs(dx) > 70 &&
      currentTime - lastSlideChange > 300
    ) {
      e.preventDefault();

      if (dx < 0) nextSlide();
      else prevSlide();

      lastSlideChange = currentTime;
      pos.x = e.clientX;
    }
  }

  function mouseUpHandler() {
    isDragging = false;

    slides.forEach((slide) => {
      slide.style.pointerEvents = "";
    });

    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);
  }

  function init() {
    if (isInitialized) {
      updateSlider();
      return;
    }

    isInitialized = true;
    slider.dataset.portfolioSliderInitialized = "true";
    slider.classList.add("portfolio-block__cards--slider");

    if (pagination) {
      pagination.style.display = "none";
    }

    getControls();

    slider.addEventListener("touchstart", handleTouchStart, false);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, false);
    document.addEventListener("touchcancel", handleTouchEnd, false);
    slider.addEventListener("mousedown", mouseDownHandler, false);

    updateSlider();
  }

  function handleBreakpointChange() {
    if (window.innerWidth >= breakpoint) {
      destroy();
      return;
    }

    init();
  }

  function destroy() {
    if (!isInitialized) return;

    isInitialized = false;

    slider.classList.remove("portfolio-block__cards--slider");
    slider.style.transform = "";

    slides.forEach((slide) => {
      slide.classList.remove("active");
      slide.style.minWidth = "";
      slide.style.maxWidth = "";
      slide.style.pointerEvents = "";
    });

    if (pagination) {
      pagination.style.display = "";
    }

    block.querySelector(".portfolio-slider-controls")?.remove();

    slider.removeEventListener("touchstart", handleTouchStart);
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleTouchEnd);
    document.removeEventListener("touchcancel", handleTouchEnd);
    slider.removeEventListener("mousedown", mouseDownHandler);
    window.removeEventListener("resize", updateSlider);

    delete slider.dataset.portfolioSliderInitialized;
  }

  handleBreakpointChange();

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
      handleBreakpointChange();
    }, 150);
  });
};

// sliders with pagination
function sliderInitialize() {
  const tabSliderWithPagination = (id) => {
    if (id === "logo-slider") {
      // console.log("=> init", id);
    }

    if (!id) return;
    let slider = document.getElementById(id);
    if (!slider) return;
    if (slider.offsetParent === null) return; // скрытые слайдеры пропускаем

    let isAnimating = false; // блокировка на время анимации
    let xDown = null,
      yDown = null;

    // ----- Очистка предыдущей инициализации (если была) -----
    if (slider.dataset.initialized === "true") {
      const parent = slider.parentElement;

      // Удаляем только динамические точки пагинации, если есть
      const pagination = parent.querySelector(".pagination");
      if (pagination) {
        const dotsContainer = pagination.querySelector(
          ".pagination--buttons-dots",
        );
        if (dotsContainer) dotsContainer.innerHTML = "";
        pagination.style.display = "";
      }

      // Для статических стрелок навигации – клонируем, чтобы сбросить обработчики
      if (navLeft) {
        const newNavLeft = navLeft.cloneNode(true);
        navLeft.parentNode.replaceChild(newNavLeft, navLeft);
      }
      if (navRight) {
        const newNavRight = navRight.cloneNode(true);
        navRight.parentNode.replaceChild(newNavRight, navRight);
      }

      // Также для кнопок внутри пагинации (если они есть) – клонируем
      if (pagination) {
        const prevBtnEls = pagination.querySelectorAll(".pagination--prev-btn");
        const nextBtnEls = pagination.querySelectorAll(".pagination--next-btn");
        prevBtnEls.forEach((btn) => {
          const newBtn = btn.cloneNode(true);
          btn.parentNode.replaceChild(newBtn, btn);
        });
        nextBtnEls.forEach((btn) => {
          const newBtn = btn.cloneNode(true);
          btn.parentNode.replaceChild(newBtn, btn);
        });
      }

      // Сброс обработчика ресайза
      if (slider._resizeHandler) {
        window.removeEventListener("resize", slider._resizeHandler);
        slider._resizeHandler = null;
      }

      // Визуальный сброс
      slider.style.transform = "";
      Array.from(slider.children).forEach((slide) =>
        slide.classList.remove("active"),
      );
      delete slider.dataset.initialized;
    }

    // const pagination = document.querySelector(`#${id} + .pagination`);
    const pagination = document.querySelector(`#${id} ~ .pagination`);
    const navLeft = document.getElementById(`navleft_for--${id}`);
    const navRight = document.getElementById(`navright_for--${id}`);
    const fill = slider.dataset.fill;
    let isDragging = false;
    slider.style.transform = `translateX(-0px)`;
    let currentIndex = 0;

    let prevBtn = [];
    let nextBtn = [];
    let navButtons = [];

    // Преобразуем в массив!
    let slides = Array.from(slider.children);
    let gap = 0;

    // Первоначальная установка ширины через fill (будет переопределяться в updateSlider)
    if (fill) {
      const setSlideWidthByFill = () => {
        const containerWidth =
          slider.parentElement.getBoundingClientRect().width;
        const breaks = fill.split(",");
        const windowWidth = window.innerWidth;
        let index = 0;
        if (windowWidth > 1200) index = 0;
        else if (windowWidth > 900) index = 1;
        else if (windowWidth > 600) index = 2;
        else index = 3;
        const slideWidth = containerWidth / breaks[index] - gap / 2;
        slides.forEach((s) => (s.style.minWidth = `${slideWidth}px`));
      };
      setSlideWidthByFill();
    }

    if (!!navLeft && !!navRight) {
      prevBtn.push(navLeft);
      nextBtn.push(navRight);
      // Базовые стили – позиционирование будет уточнено в handleSliderArrows
      navLeft.style.position = "absolute";
      navRight.style.position = "absolute";
      navLeft.setAttribute("aria-label", "Предыдущий слайд");
      navLeft.setAttribute("role", "button");
      navRight.setAttribute("aria-label", "Следующий слайд");
      navRight.setAttribute("role", "button");
    }

    if (id === `cases-tabs-slider`) {
      slides = Array.from(slider.querySelectorAll(".tab-content"));
    }

    // Функция для правильного размещения стрелок (восстановлена)
    const handleSliderArrows = () => {
      const sliderHeight = slider.offsetHeight / 2 + 40;
      prevBtn.forEach((btn) => {
        btn.style.top = "50%";
        btn.style.transform = `translateY(-${sliderHeight}px) translateX(${window.innerWidth > 600 ? "-100%" : "0"})`;
        btn.style.left =
          window.innerWidth > 600
            ? slider.id === "gallery-slider"
              ? "25px"
              : "15px"
            : "-10px";
      });
      nextBtn.forEach((btn) => {
        btn.style.top = "50%";
        btn.style.transform = `translateY(-${sliderHeight}px) translateX(${window.innerWidth > 600 ? "100%" : "0"})`;
        btn.style.right =
          window.innerWidth > 600
            ? slider.id === "gallery-slider"
              ? "25px"
              : "15px"
            : "-10px";
      });
    };

    // Основная функция обновления – всё пересчитывается динамически
    const updateSlider = () => {
      const containerWidth = slider.parentElement.getBoundingClientRect().width;
      gap = parseInt(window.getComputedStyle(slider).gap) || 0;
      const slideWidth = slides[0].offsetWidth;
      const visibleSlidesCount = Math.round(containerWidth / slideWidth);

      if (fill) {
        const breaks = fill.split(",");
        const windowWidth = window.innerWidth;
        let index = 0;
        if (windowWidth > 1200) index = 0;
        else if (windowWidth > 900) index = 1;
        else if (windowWidth > 600) index = 2;
        else index = 3;
        const newWidth = containerWidth / breaks[index] - gap / 2;
        slides.forEach((s) => (s.style.minWidth = `${newWidth}px`));
      }

      const moveAmount = (slideWidth + gap) * currentIndex;

      // Активные классы
      slides.forEach((s) => s.classList.remove("active"));
      for (
        let i = currentIndex;
        i < currentIndex + visibleSlidesCount && i < slides.length;
        i++
      ) {
        slides[i].classList.add("active");
      }

      slider.style.transform = `translateX(-${moveAmount}px)`;

      // Стрелки видимость и позиционирование
      prevBtn.forEach((btn) => {
        btn.style.opacity = currentIndex === 0 ? "0" : "1";
        btn.style.pointerEvents = currentIndex === 0 ? "none" : "";
      });
      nextBtn.forEach((btn) => {
        const disable = currentIndex + visibleSlidesCount >= slides.length;
        btn.style.opacity = disable ? "0" : "1";
        btn.style.pointerEvents = disable ? "none" : "";
      });
      handleSliderArrows(); // <-- вызываем позиционирование стрелок при каждом обновлении

      // Пагинация
      if (pagination) {
        const maxDots = slides.length - visibleSlidesCount + 1;
        pagination.style.display = maxDots < 2 ? "none" : "flex";
        const dotsContainer = pagination.querySelector(
          ".pagination--buttons-dots",
        );
        if (dotsContainer) {
          if (dotsContainer.children.length !== maxDots) {
            dotsContainer.innerHTML = "";
            for (let i = 0; i < maxDots; i++) {
              const dot = document.createElement("button");
              dot.className = "pagination--btn-dot";
              dot.setAttribute("role", "button");
              dot.setAttribute("aria-label", `Слайд ${i + 1}`);
              if (i === currentIndex) dot.classList.add("highlight");
              dot.addEventListener("click", () => {
                currentIndex = i;
                updateSlider();
              });
              dotsContainer.appendChild(dot);
            }
            navButtons = dotsContainer.querySelectorAll(".pagination--btn-dot");
          } else {
            navButtons.forEach((btn, i) => {
              btn.classList.toggle("highlight", i === currentIndex);
              if (i === currentIndex) btn.setAttribute("aria-current", "true");
              else btn.removeAttribute("aria-current");
            });
          }
        }
      }
    };

    // Инициализация пагинации (первый вызов updateSlider создаст точки)
    if (pagination) {
      prevBtn = [
        ...prevBtn,
        ...pagination.querySelectorAll(".pagination--prev-btn"),
      ];
      nextBtn = [
        ...nextBtn,
        ...pagination.querySelectorAll(".pagination--next-btn"),
      ];
      navButtons = pagination.querySelectorAll(".pagination--btn-dot");
    }

    // Обработчики стрелок
    const prevSlide = () => {
      if (isAnimating) return;
      if (currentIndex > 0) {
        isAnimating = true;
        currentIndex--;
        updateSlider();
        setTimeout(() => {
          isAnimating = false;
        }, 500);
      }
    };
    const nextSlide = () => {
      if (isAnimating) return;
      const containerWidth = slider.parentElement.getBoundingClientRect().width;
      const visibleSlidesCount = Math.round(
        containerWidth / slides[0].offsetWidth,
      );
      if (currentIndex + visibleSlidesCount < slides.length) {
        isAnimating = true;
        currentIndex++;
        updateSlider();
        setTimeout(() => {
          isAnimating = false;
        }, 500);
      }
    };
    prevBtn.forEach((btn) => btn.addEventListener("click", prevSlide));
    nextBtn.forEach((btn) => btn.addEventListener("click", nextSlide));

    // Touch и mouse события
    function handleTouchStart(evt) {
      xDown = evt.touches[0].clientX;
      yDown = evt.touches[0].clientY;
      isDragging = false;
    }
    function handleTouchMove(evt) {
      if (xDown === null || yDown === null || isDragging || isAnimating) return;
      const xUp = evt.touches[0].clientX;
      const yUp = evt.touches[0].clientY;
      const xDiff = xDown - xUp;
      const yDiff = yDown - yUp;
      if (Math.abs(xDiff) > Math.abs(yDiff) && Math.abs(xDiff) > 20) {
        evt.preventDefault();
        isDragging = true;
        if (xDiff > 0) nextSlide();
        else prevSlide();
      }
    }
    function handleTouchEnd() {
      xDown = null;
      yDown = null;
      isDragging = false;
    }

    function mouseDownHandler(e) {
      if (id === `cases-tabs-slider`) return;
      const sliderEl = e.currentTarget;
      e.preventDefault();
      pos = { x: e.clientX, y: e.clientY };
      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);
    }

    function mouseMoveHandler(e) {
      let lastSlideChange = 0;
      const minInterval = 300;
      const currentTime = Date.now();
      const dx = e.clientX - pos.x;
      const dy = e.clientY - pos.y;
      isDragging = true;

      // Используем актуальный массив слайдов
      slides = Array.from(slider.children);
      slides.forEach((slide) => {
        if (isDragging) slide.style.setProperty("pointer-events", "none");
      });

      if (
        Math.abs(dx) > Math.abs(dy) &&
        Math.abs(dx) > 70 &&
        currentTime - lastSlideChange > minInterval
      ) {
        e.preventDefault();
        if (dx < 0) nextSlide();
        else prevSlide();
        lastSlideChange = currentTime;
      } else {
        return;
      }
      pos.x = e.clientX;
    }

    function mouseUpHandler() {
      isDragging = false;
      slides = Array.from(slider.children);
      slides.forEach((slide) => {
        if (!isDragging) slide.style.setProperty("pointer-events", "");
      });
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
    }

    slider.addEventListener("touchstart", handleTouchStart, false);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, false);
    document.addEventListener("touchcancel", handleTouchEnd, false);
    slider.addEventListener("mousedown", mouseDownHandler, false);

    // Первичное обновление + позиционирование
    handleSliderArrows();
    updateSlider();

    // Сохраняем обработчик resize
    if (slider._resizeHandler)
      window.removeEventListener("resize", slider._resizeHandler);
    slider._resizeHandler = updateSlider;
    window.addEventListener("resize", updateSlider);

    slider.dataset.initialized = "true";
  };

  const sliders = document.querySelectorAll("[data-slider]");

  // Инициализация всех слайдеров на странице
  sliders?.forEach((slider) => {
    try {
      tabSliderWithPagination(slider.id);
    } catch (err) {
      console.warn("=> err setting slider ", slider.id, ":", err);
    }
  });

  portfolioCardsSlider();
}

// increment numbers
const incrementNumbersInit = () => {
  const counters = document.querySelectorAll("[data-counter-value]");

  if (!counters) return;

  const initIncrement = () => {
    if (counters) {
      counters.forEach((counter) => {
        if (!counter) return;

        let hasAnimated = false;

        const animateCounter = (counter, duration = 4000) => {
          // Убираем пробелы и преобразуем в число
          const targetValue = parseInt(
            counter.getAttribute("data-counter-value").replace(/\s+/g, ""),
            10,
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
          observerOptions,
        );
        observer.observe(counter);
      });
    }
  };

  setTimeout(() => {
    initIncrement();
  }, 1000);
};

// phone field handler
function maskPhone(selector, masked = "+7 (___) ___-__-__") {
  const elems = document.querySelectorAll(selector);

  function mask(event) {
    const keyCode = event.keyCode;
    const template = masked,
      def = template.replace(/\D/g, ""),
      val = this.value.replace(/\D/g, "");
    // console.log(template);
    let i = 0,
      newValue = template.replace(/[_\d]/g, function (a) {
        return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
      });
    i = newValue.indexOf("_");
    if (i !== -1) {
      newValue = newValue.slice(0, i);
    }
    let reg = template
      .substr(0, this.value.length)
      .replace(/_+/g, function (a) {
        return "\\d{1," + a.length + "}";
      })
      .replace(/[+()]/g, "\\$&");
    reg = new RegExp("^" + reg + "$");
    if (
      !reg.test(this.value) ||
      this.value.length < 5 ||
      (keyCode > 47 && keyCode < 58)
    ) {
      this.value = newValue;
    }
    if (event.type === "blur" && this.value.length < 5) {
      this.value = "";
    }
  }

  for (const elem of elems) {
    elem.addEventListener("input", mask);
    elem.addEventListener("focus", mask);
    elem.addEventListener("blur", mask);
  }
}

maskPhone('input[type="tel"]', "+7 (___) ___-__-__");

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
      elem.style.minHeight =
        (elem.getAttribute("rows")
          ? (elem.getAttribute("rows") * 50) / 1.25
          : 50) + "px";
      elem.style.height = elem.scrollHeight + 2 + "px";

      if (elem.getAttribute("data-autosize") !== "true") {
        elem.setAttribute("data-autosize", "true");
      }
    }
  },
};

// gallery selector
function gallerySelector() {
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

  const resolveGallerySource = () => {
    if (typeof window !== "undefined") {
      if (typeof window.galleryData !== "undefined") {
        return window.galleryData;
      }
      if (typeof window.galleryImages !== "undefined") {
        return window.galleryImages;
      }
    }

    if (typeof galleryData !== "undefined") {
      return galleryData;
    }

    if (typeof galleryImages !== "undefined") {
      return galleryImages;
    }

    return {};
  };

  const normaliseGalleryEntry = (entry) => {
    if (!entry) {
      return [];
    }

    if (Array.isArray(entry)) {
      return entry;
    }

    if (entry && Array.isArray(entry.images)) {
      return entry.images;
    }

    return [];
  };

  const setUpGallery = (info) => {
    // console.log("=> setUpGallery", info);
    clearGallery();

    const source = resolveGallerySource();
    const galleryEntry = normaliseGalleryEntry(source[info]);

    galleryEntry.forEach((imgSrc) => {
      if (!imgSrc) {
        return;
      }

      const div = document.createElement("div");
      div.classList.add("gallery-card");
      const img = document.createElement("img");
      img.src = imgSrc;
      div.appendChild(img);
      gallery.appendChild(div);
    });

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

// NiceSelect
const niceSelectJS = function (selectName, options) {
  let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  let settings = {};
  settings.activeMobile = false;
  for (var userOpt in options) {
    if (options.hasOwnProperty(userOpt)) {
      settings[userOpt] = options[userOpt];
    }
  }

  selectName = document.querySelectorAll(selectName);
  selectName.forEach((select) => {
    if (!settings.activeMobile && isMobile) {
      if (select.getAttribute("data-display") !== null) {
        var option = document.createElement("option");
        option.text = select.getAttribute("data-display");
        select.add(option, select[0]);
        option.setAttribute("selected", true);
      }
      return;
    }
    select.style.display = "none";
    if (!select.nextElementSibling) {
      create_nice_select(select);
    }
  });

  function create_nice_select(select) {
    let divSelect = document.createElement("div");
    let classes = select.getAttribute("class");
    if (!classes == "") {
      divSelect.className = "nice-select " + classes + "";
    }
    divSelect.classList.add("nice-select");
    divSelect.setAttribute(
      "tabindex",
      select.getAttribute("disabled") ? null : "0",
    );
    divSelect.innerHTML = '<span class="current"></span><ul class="list"></ul>';
    // addClass($select.attr('disabled') ? 'disabled' : '') disable özelliği eklenicek

    select.parentNode.insertBefore(divSelect, select.nextSibling);

    let dropdown = select.nextElementSibling;
    let _options = select.getElementsByTagName("option");
    let selected = select.getElementsByTagName("option:selected");

    dropdown.querySelector(".current").innerHTML =
      select.getAttribute("data-display") ||
      select.firstChild.nextElementSibling.innerText;

    for (const child of _options) {
      let listUl = dropdown.querySelector(".list");
      let listItem = document.createElement("li");
      listItem.innerHTML = child.textContent;
      listItem.setAttribute("data-value", child.value);
      if (child.hasAttribute("data-price")) {
        listItem.setAttribute("data-price", child.getAttribute("data-price"));
      }
      listItem.classList.add("option");
      if (
        child.getAttribute("disabled") == "" ||
        child.getAttribute("disabled") == "disabled"
      ) {
        listItem.classList.add("disabled");
      } else if (
        child.getAttribute("selected") == "" ||
        child.getAttribute("selected") == "selected"
      ) {
        listItem.classList.add("selected");
      }

      listUl.appendChild(listItem);
    }
  }

  // Open/close
  let allSelects = document.querySelectorAll(".nice-select");

  allSelects.forEach((link) => {
    link.addEventListener("click", function () {
      if (this.classList.contains("open")) {
        this.classList.remove("open");
        if (this.querySelector(".focus") !== null) {
          this.querySelector(".focus").classList.remove("focus");
        }
      } else {
        allSelects.forEach((el) => {
          el.classList.remove("open");
        });
        this.classList.add("open");
        if (this.querySelector(".selected") !== null) {
          this.querySelector(".selected").classList.add("focus");
        }
      }
    });
  });

  // Close when clicking outside
  document.addEventListener("click", function (e) {
    if (e.target.closest(".nice-select") === null) {
      allSelects.forEach((el) => {
        el.classList.remove("open");
      });
    }
  });

  // Option click
  document.addEventListener("click", function (e) {
    const option = e.target.closest(".nice-select .option:not(.disabled)");
    if (!option) return;
    let dropdown = option.closest(".nice-select");
    if (dropdown.querySelector(".selected") !== null) {
      dropdown.querySelector(".selected").classList.remove("selected");
    }
    option.classList.add("selected");
    let text = option.textContent;
    dropdown.querySelector(".current").textContent = text;
    let originalSelect = dropdown.previousSibling;
    originalSelect.value = option.getAttribute("data-value");
    // Генерируем событие change для калькулятора
    originalSelect.dispatchEvent(new Event("change"));
    // console.log(
    // 	`dispatched change on ${originalSelect.id}, value=${originalSelect.value}`,
    // );
  });

  return this;
};

window.updateNiceSelect = function (selectEl) {
  const niceSelect = selectEl.nextElementSibling?.classList.contains(
    "nice-select",
  )
    ? selectEl.nextElementSibling
    : null;
  if (!niceSelect) return;
  const currentSpan = niceSelect.querySelector(".current");
  if (currentSpan) {
    const selectedOption = selectEl.options[selectEl.selectedIndex];
    currentSpan.textContent = selectedOption
      ? selectedOption.textContent
      : selectEl.getAttribute("data-display") || "Выберите...";
  }
  const items = niceSelect.querySelectorAll(".list .option");
  items.forEach((item, idx) => {
    if (idx === selectEl.selectedIndex) {
      item.classList.add("selected");
      item.setAttribute("aria-selected", "true");
    } else {
      item.classList.remove("selected");
      item.removeAttribute("aria-selected");
    }
  });
};

// tooltip handler
const showTooltip = (el) => {
  requestAnimationFrame(() => {
    let text = el.getAttribute("data-tooltip");

    let tooltip = document.getElementById("custom-tooltip");
    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.id = "custom-tooltip";

      tooltip.classList.add("tooltip-after");
      document.body.appendChild(tooltip);
    }

    tooltip.innerHTML = text;
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
};

const hideTooltip = () => {
  let tooltip = document.getElementById("custom-tooltip");
  if (tooltip) tooltip.classList.remove("visible");
};

const tooltipEvents = () => {
  // mouseenter events
  document.addEventListener(
    "mouseenter",
    (e) => {
      const target = e.target;
      if (target.nodeType !== 1) return;

      const el = e.target.closest("[data-tooltip]");

      if (el) showTooltip(el);
    },
    true,
  );

  // mouseleave events
  document.addEventListener(
    "mouseleave",
    (e) => {
      const target = e.target;
      if (target.nodeType !== 1) return;

      const el = e.target.closest("[data-tooltip]");

      if (el) hideTooltip();
    },
    true,
  );
};

// brif
document.addEventListener("DOMContentLoaded", () => {
  const container =
    document.getElementById("calculator-sitebrif") ||
    document.getElementById("calculator-brif");
  if (!container) return;

  const inputs = container.querySelectorAll(
    ".accordion-content input, .accordion-content textarea, .accordion-content select",
  );
  const sendButton = document.getElementById("send-brif-total");

  // ---------- вспомогательные функции ----------
  const showElement = (el) => el && el.classList.remove("hidden");
  const hideElement = (el) => el && el.classList.add("hidden");

  // парсинг data-nested (формат: "id1:index;id2;id3:index")
  const parseNested = (str) => {
    if (!str) return [];
    return str.split(";").map((item) => {
      const parts = item.split(":");
      return parts.length === 2
        ? { id: parts[0], optionIndex: parseInt(parts[1]) }
        : { id: parts[0], optionIndex: null };
    });
  };

  // обновление кастомного селекта (nice-select)
  const updateNiceSelect = (selectEl) => {
    const niceSelect = selectEl.nextElementSibling?.classList.contains(
      "nice-select",
    )
      ? selectEl.nextElementSibling
      : null;
    if (!niceSelect) return;

    const currentSpan = niceSelect.querySelector(".current");
    if (currentSpan) {
      const selectedOption = selectEl.options[selectEl.selectedIndex];
      currentSpan.textContent = selectedOption
        ? selectedOption.textContent
        : selectEl.getAttribute("data-display") || "Выберите...";
    }
    niceSelect
      .querySelectorAll(".option")
      .forEach((opt) => opt.classList.remove("selected"));
    if (selectEl.selectedIndex >= 0) {
      const selectedLi =
        niceSelect.querySelectorAll(".option")[selectEl.selectedIndex];
      if (selectedLi) selectedLi.classList.add("selected");
    }
  };

  // обновление тултипов для селекта (полная версия)
  const updateTooltipsForSelect = (selectEl) => {
    if (!selectEl) return;

    let prefix = selectEl.getAttribute("data-tooltip-prefix");
    if (!prefix) {
      const id = selectEl.id;
      if (id && id.endsWith("-select")) {
        prefix = id.slice(0, -7);
      } else {
        const container = selectEl.closest(".toggle-line");
        if (container) {
          const tooltips = container.querySelectorAll(".tooltip");
          tooltips.forEach((t) => t.classList.add("hidden"));
          const idx = selectEl.selectedIndex;
          if (idx >= 0 && idx < tooltips.length) {
            tooltips[idx].classList.remove("hidden");
          }
        }
        return;
      }
    }

    const tooltips = [];
    for (let i = 1; ; i++) {
      const tip = document.getElementById(`${prefix}-${i}`);
      if (!tip) break;
      tooltips.push(tip);
    }
    tooltips.forEach((t) => t.classList.add("hidden"));
    const idx = selectEl.selectedIndex;
    if (idx >= 0 && idx < tooltips.length) {
      tooltips[idx].classList.remove("hidden");
    }
  };

  // ---------- активация / деактивация вложенных элементов (без цены) ----------
  const activateNestedToggles = (parent, toggles) => {
    if (!parent.nested || parent.nested.length === 0) return;
    parent.nested.forEach((nestedItem) => {
      const nestedToggle = toggles.find((t) => t.id === nestedItem.id);
      if (nestedToggle && !nestedToggle.elementref.checked) {
        if (nestedItem.optionIndex !== null)
          nestedToggle._tempSelectIndex = nestedItem.optionIndex;
        if (nestedToggle.type === "checkbox") {
          nestedToggle.elementref.checked = true;
          nestedToggle.elementref.dispatchEvent(new Event("change"));
        } else if (
          nestedToggle.type === "select" &&
          nestedItem.optionIndex !== null
        ) {
          const selectEl = nestedToggle.elementref;
          if (selectEl.selectedIndex !== nestedItem.optionIndex) {
            selectEl.selectedIndex = nestedItem.optionIndex;
            selectEl.dispatchEvent(new Event("change"));
          }
        }
        activateNestedToggles(nestedToggle, toggles);
      }
    });
  };

  const deactivateNestedToggles = (parent, toggles) => {
    if (!parent.nested || parent.nested.length === 0) return;
    parent.nested.forEach((nestedItem) => {
      const nestedToggle = toggles.find((t) => t.id === nestedItem.id);
      if (nestedToggle && nestedToggle.elementref.checked) {
        if (nestedToggle.type === "checkbox") {
          nestedToggle.elementref.checked = false;
          nestedToggle.elementref.dispatchEvent(new Event("change"));
        } else if (nestedToggle.type === "select") {
          nestedToggle.elementref.selectedIndex = -1;
          nestedToggle.elementref.dispatchEvent(new Event("change"));
        }
        deactivateNestedToggles(nestedToggle, toggles);
      }
    });
  };

  // ---------- активация / деактивация опции селекта (без цены) ----------
  const activateSelectOption = (option, toggles) => {
    if (!option) return;
    if (option.reveal) showElement(option.reveal);
    if (option.nested && option.nested.length)
      activateNestedToggles({ nested: option.nested }, toggles);
  };

  const deactivateSelectOption = (option, toggles) => {
    if (!option) return;
    if (option.reveal) hideElement(option.reveal);
    if (option.nested && option.nested.length)
      deactivateNestedToggles({ nested: option.nested }, toggles);
  };

  // ---------- активация / деактивация текстового поля (без цены) ----------
  const activateTextField = (textToggle, toggles) => {
    if (textToggle.active) return;
    if (textToggle.reveal) showElement(textToggle.reveal);
    if (textToggle.nested && textToggle.nested.length)
      activateNestedToggles(textToggle, toggles);
    textToggle.active = true;
  };

  const deactivateTextField = (textToggle, toggles) => {
    if (!textToggle.active) return;
    if (textToggle.reveal) hideElement(textToggle.reveal);
    if (textToggle.nested && textToggle.nested.length)
      deactivateNestedToggles(textToggle, toggles);
    textToggle.active = false;
  };

  // ---------- конвертация DOM-элементов во внутренние объекты ----------
  const toggleConverter = (inputs) => {
    const toggles = []; // элементы, управляющие отображением (checkbox, select, textfield)
    const texts = []; // простые текстовые поля без логики (для отправки)

    inputs.forEach((input) => {
      // --- текстовые поля / textarea с логикой (data-reveal или data-nested) ---
      if (
        (input.type === "text" || input.tagName === "TEXTAREA") &&
        (input.hasAttribute("data-reveal") || input.hasAttribute("data-nested"))
      ) {
        toggles.push({
          id: input.id,
          elementref: input,
          reveal: document.getElementById(input.dataset.reveal || ""),
          nested: parseNested(input.dataset.nested),
          type: "textfield",
          active: false,
        });
        return;
      }

      // --- select ---
      if (input.tagName === "SELECT") {
        const options = [];
        for (let opt of input.options) {
          options.push({
            value: opt.value,
            reveal: opt.dataset.reveal
              ? document.getElementById(opt.dataset.reveal)
              : null,
            nested: parseNested(opt.dataset.nested),
            selectId: input.id,
          });
        }

        const selectObj = {
          id: input.id,
          elementref: input,
          type: "select",
          options: options,
          currentOption: null,
        };

        // предустановленная опция
        let hasSelected = false;
        for (let i = 0; i < input.options.length; i++) {
          if (input.options[i].hasAttribute("selected")) {
            hasSelected = true;
            break;
          }
        }
        if (hasSelected && input.selectedIndex >= 0) {
          selectObj.currentOption = options[input.selectedIndex];
        } else {
          input.selectedIndex = -1;
        }

        toggles.push(selectObj);
        return;
      }

      // --- checkbox ---
      if (input.type === "checkbox") {
        toggles.push({
          id: input.id,
          elementref: input,
          reveal: document.getElementById(input.dataset.reveal || ""),
          radioid: input.dataset.radio ? input.dataset.radio.split(";") : [],
          nested: parseNested(input.dataset.nested),
          selectTarget: input.dataset.selectTarget || null,
          selectOptionIndex: input.dataset.selectOptionIndex
            ? parseInt(input.dataset.selectOptionIndex)
            : 0,
          type: "checkbox",
        });
        return;
      }

      // --- прочие поля (обычные текстовые, email, tel и т.д.) ---
      texts.push({ id: input.id, elementref: input });
    });

    return { toggles, texts };
  };

  // ---------- инициализация и обработчики ----------
  if (inputs.length && sendButton) {
    const { toggles, texts } = toggleConverter(inputs);
    const changeEvent = new Event("change");

    const reviewTotal = () => {
      const review = {
        options: toggles
          .filter((t) => t.type === "checkbox" && t.elementref.checked)
          .map((t) => ({ id: t.id })),
        selects: toggles
          .filter((t) => t.type === "select" && t.currentOption)
          .map((t) => ({
            id: t.id,
            selectedValue:
              t.elementref.options[t.elementref.selectedIndex]?.value,
          })),
        textfields: toggles
          .filter((t) => t.type === "textfield" && t.active)
          .map((t) => ({
            id: t.id,
            value: t.elementref.value,
          })),
        extra: texts
          .filter((t) => t.elementref.value !== "")
          .map((t) => ({ id: t.id, value: t.elementref.value })),
      };
      // console.log(review);
    };

    // --- обработчики для чекбоксов ---
    toggles.forEach((toggle) => {
      if (toggle.type === "checkbox") {
        toggle.elementref.addEventListener("change", () => {
          if (toggle.elementref.checked) {
            // показываем свой reveal
            if (toggle.reveal) showElement(toggle.reveal);
            // радио-группа: выключаем другие чекбоксы из этой группы
            if (toggle.radioid && toggle.radioid.length) {
              toggles.forEach((other) => {
                if (
                  other.type === "checkbox" &&
                  toggle.radioid.includes(other.id) &&
                  other !== toggle &&
                  other.elementref.checked
                ) {
                  other.elementref.checked = false;
                  other.elementref.dispatchEvent(changeEvent);
                }
              });
            }
            // управление связанным селектом
            if (toggle.selectTarget) {
              const targetSelect = document.getElementById(toggle.selectTarget);
              if (targetSelect && targetSelect.tagName === "SELECT") {
                let index =
                  toggle._tempSelectIndex !== undefined
                    ? toggle._tempSelectIndex
                    : toggle.selectOptionIndex;
                if (index === undefined) index = 0;
                if (index >= 0 && index < targetSelect.options.length) {
                  targetSelect.selectedIndex = index;
                  targetSelect.dispatchEvent(new Event("change"));
                }
                delete toggle._tempSelectIndex;
              }
            }
            // активируем вложенные элементы
            if (toggle.nested && toggle.nested.length)
              activateNestedToggles(toggle, toggles);
          } else {
            if (toggle.reveal) hideElement(toggle.reveal);
            // сбрасываем связанный селект
            if (toggle.selectTarget) {
              const targetSelect = document.getElementById(toggle.selectTarget);
              if (targetSelect && targetSelect.tagName === "SELECT") {
                targetSelect.selectedIndex = -1;
                targetSelect.dispatchEvent(new Event("change"));
              }
            }
            if (toggle.nested && toggle.nested.length)
              deactivateNestedToggles(toggle, toggles);
          }

          reviewTotal();
        });
      }
    });

    // --- обработчики для селектов ---
    toggles.forEach((toggle) => {
      if (toggle.type === "select") {
        toggle.elementref.addEventListener("change", () => {
          const oldOption = toggle.currentOption;
          const newIndex = toggle.elementref.selectedIndex;
          const newOption = newIndex >= 0 ? toggle.options[newIndex] : null;

          if (oldOption === newOption) return;

          if (oldOption) deactivateSelectOption(oldOption, toggles);
          if (newOption) activateSelectOption(newOption, toggles);

          toggle.currentOption = newOption;
          updateNiceSelect(toggle.elementref);
          updateTooltipsForSelect(toggle.elementref);
          reviewTotal();
        });
      }
    });

    // --- обработчики для текстовых полей с логикой ---
    toggles.forEach((toggle) => {
      if (toggle.type === "textfield") {
        const handler = () => {
          const hasText = toggle.elementref.value.trim() !== "";
          if (hasText && !toggle.active) activateTextField(toggle, toggles);
          else if (!hasText && toggle.active)
            deactivateTextField(toggle, toggles);
        };
        toggle.elementref.addEventListener("input", handler);
        toggle.elementref.addEventListener("change", handler);
        reviewTotal();
      }
    });

    // --- инициализация уже отмеченных / заполненных элементов ---
    toggles.forEach((toggle) => {
      if (toggle.type === "checkbox" && toggle.elementref.checked) {
        // для уже отмеченных чекбоксов применяем связь с селектом и вложенность
        if (toggle.selectTarget) {
          const targetSelect = document.getElementById(toggle.selectTarget);
          if (targetSelect && targetSelect.tagName === "SELECT") {
            let index = toggle.selectOptionIndex;
            if (index === undefined) index = 0;
            if (index >= 0 && index < targetSelect.options.length) {
              targetSelect.selectedIndex = index;
              // дополнительно обновляем nice-select и тултипы
              updateNiceSelect(targetSelect);
              updateTooltipsForSelect(targetSelect);
            }
          }
        }
        if (toggle.nested && toggle.nested.length)
          activateNestedToggles(toggle, toggles);
        if (toggle.reveal) showElement(toggle.reveal);
      }
      if (toggle.type === "select" && toggle.currentOption) {
        activateSelectOption(toggle.currentOption, toggles);
        updateNiceSelect(toggle.elementref);
        updateTooltipsForSelect(toggle.elementref);
      }
      if (
        toggle.type === "textfield" &&
        toggle.elementref.value.trim() !== ""
      ) {
        activateTextField(toggle, toggles);
      }
    });

    // --- кнопка отправки (сбор данных) ---
    sendButton.addEventListener("click", () => {
      reviewTotal();
    });

    inputs.forEach((input) => {
      if (input.type === "text" || input.tagName === "TEXTAREA") {
        input.addEventListener("change", () => {
          reviewTotal();
        });

        input.addEventListener("focus", () => {
          reviewTotal();
        });
      }
    });
  }
});

// calculator v1 с жесткими пресетами для типов сайтов + поддержка кастомных select
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("calculator")) {
    const inputs = document
      .getElementById("calculator")
      ?.querySelectorAll(".accordion-content input, .accordion-content select");
    const reset_button = document.getElementById("reset-options-btn");
    const sendButtonsIds = ["#send-calculator-total", "#send-total"];
    const sendButtons = document.querySelectorAll(sendButtonsIds);
    const target = document.getElementById("calculator-total-target");
    const hash = window.location.hash;
    const togglechange = new Event("change");
    const tenderAccordion = document.getElementById("tender-accordion");

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
        const secondTarget = document.getElementById("calculator-total-cost");
        const modalTarget = document.getElementById("calculator-total-modal");
        if (secondTarget) secondTarget.innerText = formatNumber(val);
        if (modalTarget) modalTarget.innerText = formatNumber(val);
      },
      configurable: true,
    });

    // Вспомогательные функции для управления блоками
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

    // Управление аккордеонами
    const deactivateAllAccordions = () => {
      const allAccordionItems = document.querySelectorAll(".accordion-item");
      allAccordionItems.forEach((item) => {
        if (item.id === "site-types") return;
        // item.classList.add("deactive");
        const sectionCheckbox = item.querySelector(
          'input[type="checkbox"][id^="section-"]',
        );
        if (sectionCheckbox) {
          sectionCheckbox.checked = false;
        }
      });
    };
    const activateAllAccordions = () => {
      const allAccordionItems = document.querySelectorAll(".accordion-item");
      allAccordionItems.forEach((item) => {
        item.classList.remove("deactive");
      });
    };
    // Скрывает все аккордеоны, кроме указанных по id
    const hideAllAccordionsExcept = (keepIds) => {
      const allAccordionItems = document.querySelectorAll(".accordion-item");
      allAccordionItems.forEach((item) => {
        if (!keepIds.includes(item.id)) {
          item.classList.add("hidden");
        }
      });
    };
    // Показывает все аккордеоны (убирает класс hidden)
    const showAllAccordions = () => {
      const allAccordionItems = document.querySelectorAll(".accordion-item");
      allAccordionItems.forEach((item) => {
        item.classList.remove("hidden");
      });
    };

    // Функция обновления отображения кастомного селекта (nice-select)
    const updateNiceSelect = (selectEl) => {
      const niceSelect = selectEl.nextElementSibling?.classList.contains(
        "nice-select",
      )
        ? selectEl.nextElementSibling
        : null;
      if (!niceSelect) return;

      const currentSpan = niceSelect.querySelector(".current");
      if (currentSpan) {
        const selectedOption = selectEl.options[selectEl.selectedIndex];
        currentSpan.textContent = selectedOption
          ? selectedOption.textContent
          : selectEl.getAttribute("data-display") || "Выберите...";
      }

      // Обновляем классы у пунктов списка
      niceSelect
        .querySelectorAll(".option")
        .forEach((opt) => opt.classList.remove("selected"));
      if (selectEl.selectedIndex >= 0) {
        const selectedLi =
          niceSelect.querySelectorAll(".option")[selectEl.selectedIndex];
        if (selectedLi) selectedLi.classList.add("selected");
      }
    };

    // Новая функция: управление видимостью tooltip'ов
    const updateTooltipsForSelect = (selectEl) => {
      if (!selectEl) return;

      // Получаем префикс для поиска tooltip'ов
      let prefix = selectEl.getAttribute("data-tooltip-prefix");
      if (!prefix) {
        // Если префикс не задан, пробуем взять id селекта без суффикса "-select"
        const id = selectEl.id;
        if (id && id.endsWith("-select")) {
          prefix = id.slice(0, -7); // убираем "-select"
        } else {
          // Запасной вариант: ищем ближайший контейнер .toggle-line и все .tooltip внутри
          const container = selectEl.closest(".toggle-line");
          if (container) {
            const tooltips = container.querySelectorAll(".tooltip");
            // Скрываем все
            tooltips.forEach((t) => t.classList.add("hidden"));
            // Показываем соответствующий (если индекс валидный)
            const idx = selectEl.selectedIndex;
            if (idx >= 0 && idx < tooltips.length) {
              tooltips[idx].classList.remove("hidden");
            }
          }
          return;
        }
      }

      // Ищем все tooltip'ы, чей id начинается с prefix и тире
      const tooltips = [];
      for (let i = 1; ; i++) {
        const tip = document.getElementById(`${prefix}-${i}`);
        if (!tip) break;
        tooltips.push(tip);
      }

      // Скрываем все
      tooltips.forEach((t) => t.classList.add("hidden"));

      // Показываем нужный по индексу
      const idx = selectEl.selectedIndex;
      // Принудительно отображаем первую подсказку для всех select
      if (idx === -1) {
        tooltips.forEach((t, index) =>
          index === 0 ? t.classList.remove("hidden") : "",
        );
      }
      if (idx >= 0 && idx < tooltips.length) {
        tooltips[idx].classList.remove("hidden");
      }
    };

    // Функция полного сброса калькулятора
    const resetCalculator = (toggles, counters, target) => {
      // Сбрасываем чекбоксы
      toggles.forEach((toggle) => {
        if (toggle.type === "checkbox") {
          toggle.elementref.checked = false;
          if (toggle.reveal) toggle.reveal.classList.add("hidden");
        }
      });

      // Сбрасываем счётчики
      counters.forEach((counter) => {
        if (counter.intendfor === "design-landing") {
          counter.elementref.value = 1;
          counter.total = 1 * counter.price;
        } else {
          counter.elementref.value = 0;
          counter.total = 0;
        }
      });

      // Сбрасываем селекты
      toggles.forEach((toggle) => {
        if (toggle.type === "select") {
          const selectEl = toggle.elementref;
          if (toggle.currentOption) {
            deactivateSelectOption(toggle.currentOption, toggles, target);
          }
          selectEl.selectedIndex = -1;
          toggle.currentOption = null;
          updateNiceSelect(selectEl);
          updateTooltipsForSelect(selectEl); // <-- добавить вызов
        }
      });

      // Сбрасываем текстовые поля
      toggles.forEach((toggle) => {
        if (toggle.type === "textfield") {
          if (toggle.active) {
            deactivateTextField(toggle, target, toggles);
          }
          toggle.elementref.value = "";
          toggle.active = false;
        }
      });

      const tenderSolutionSelect = document.getElementById(
        "tender-solution-select",
      );
      if (tenderSolutionSelect && tenderSolutionSelect.selectedIndex === -1) {
        tenderSolutionSelect.selectedIndex = 0;
        // tenderSolutionSelect.dispatchEvent(
        // 	new Event("change", { bubbles: true }),
        // );
      }

      target.current_value = 0;
      deactivateAllAccordions();
      showAllAccordions();

      if (tenderAccordion) {
        tenderAccordion.classList.add("hidden");
        // tenderAccordion.classList.add("deactive");
      }
    };

    // Сброс всех чекбоксов в блоках тендерной конфигурации
    const resetTenderCheckboxes = (toggles, target) => {
      const tenderConfigBlocks = [
        "tender-portal_config",
        "tender-portal_paying_config",
      ];
      tenderConfigBlocks.forEach((blockId) => {
        const block = document.getElementById(blockId);
        if (block) {
          const checkboxes = block.querySelectorAll('input[type="checkbox"]');
          checkboxes.forEach((checkbox) => {
            const toggleObj = toggles.find(
              (t) => t.type === "checkbox" && t.elementref === checkbox,
            );
            if (toggleObj && toggleObj.elementref.checked) {
              // Снимаем чекбокс и диспатчим событие, чтобы обновить цену
              toggleObj.elementref.checked = false;
              toggleObj.elementref.dispatchEvent(
                new Event("change", { bubbles: true }),
              );
            }
          });
        }
      });
    };

    // Функции для работы с опциями select
    const activateSelectOption = (option, toggles, target) => {
      if (!option) return;
      if (option.selectId === "tender-solution-select") {
        resetTenderCheckboxes(toggles, target);
      }
      target.current_value += option.price;
      if (option.reveal) showElement(option.reveal);
      if (option.nested && option.nested.length > 0) {
        activateNestedToggles({ nested: option.nested }, toggles, target);
      }
      if (option.showAccordionItems)
        showAccordionItems(option.showAccordionItems);
      if (option.hideAccordionItems)
        hideAccordionItems(option.hideAccordionItems);
    };
    const deactivateSelectOption = (option, toggles, target) => {
      if (!option) return;
      target.current_value -= option.price;
      if (option.reveal) hideElement(option.reveal);
      if (option.nested && option.nested.length > 0) {
        deactivateNestedToggles({ nested: option.nested }, toggles, target);
      }
      if (option.showAccordionItems)
        hideAccordionItems(option.showAccordionItems);
      if (option.hideAccordionItems)
        showAccordionItems(option.hideAccordionItems);
    };

    // Инициализация селектов (активируем предустановленные опции)
    const initializeSelects = (toggles, target) => {
      toggles.forEach((toggle) => {
        if (toggle.type === "select" && toggle.currentOption) {
          activateSelectOption(toggle.currentOption, toggles, target);
          updateNiceSelect(toggle.elementref);
          updateTooltipsForSelect(toggle.elementref); // <-- добавить вызов
        }
      });
    };

    // Текстовые поля
    const activateTextField = (textFieldToggle, target, toggles) => {
      if (textFieldToggle.active) return;
      target.current_value += textFieldToggle.price;
      if (textFieldToggle.reveal) showElement(textFieldToggle.reveal);
      if (textFieldToggle.nested && textFieldToggle.nested.length > 0) {
        activateNestedToggles(
          { nested: textFieldToggle.nested },
          toggles,
          target,
        );
      }
      if (textFieldToggle.showAccordionItems)
        showAccordionItems(textFieldToggle.showAccordionItems);
      if (textFieldToggle.hideAccordionItems)
        hideAccordionItems(textFieldToggle.hideAccordionItems);
      textFieldToggle.active = true;
    };
    const deactivateTextField = (textFieldToggle, target, toggles) => {
      if (!textFieldToggle.active) return;
      target.current_value -= textFieldToggle.price;
      if (textFieldToggle.reveal) hideElement(textFieldToggle.reveal);
      if (textFieldToggle.nested && textFieldToggle.nested.length > 0) {
        deactivateNestedToggles(
          { nested: textFieldToggle.nested },
          toggles,
          target,
        );
      }
      if (textFieldToggle.showAccordionItems)
        hideAccordionItems(textFieldToggle.showAccordionItems);
      if (textFieldToggle.hideAccordionItems)
        showAccordionItems(textFieldToggle.hideAccordionItems);
      textFieldToggle.active = false;
    };
    const clearTextFieldsInContainer = (container, toggles, target) => {
      if (!container) return;
      const textFields = container.querySelectorAll(
        "input[data-calculation-textfield]",
      );
      textFields.forEach((field) => {
        const textToggle = toggles.find(
          (t) => t.type === "textfield" && t.elementref === field,
        );
        if (textToggle && textToggle.active) {
          deactivateTextField(textToggle, target, toggles);
          field.value = "";
        } else if (textToggle) {
          field.value = "";
        }
      });
    };

    // Управление аккордеонами для тендеров
    const updateAccordionStateForSiteType = (toggle) => {
      const isTenderSelected =
        toggle &&
        toggle.elementref.checked &&
        (toggle.id === "tender-portal" ||
          toggle.id === "tender-portal-paying" ||
          toggle.id === "tenders_toggle");

      const isUniqueSelected =
        toggle && toggle.elementref.checked && toggle.id === "type-unique";

      if (isTenderSelected) {
        deactivateAllAccordions();
        setTimeout(() => {
          document?.querySelector("#tender-accordion").scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 600);
      } else if (toggle && toggle.elementref.checked) {
        activateAllAccordions();
      }

      // Если выбрана уникальная разработка
      if (isUniqueSelected) {
        syncUniqueFields();
      } else {
        cleanupUniqueField();
      }
    };

    // Функция синхронизации полей для уникальной разработки
    const syncUniqueFields = () => {
      const container = document.getElementById("type-unique_form");
      if (!container) return;

      const textInput = container.querySelector("#type-unique_text");
      const fileInput = container.querySelector('input[type="file"]');

      if (textInput) {
        textInput.removeEventListener("change", exchangeUniqueFields);
        textInput.removeEventListener("input", exchangeUniqueFields);
        textInput.addEventListener("change", (e) =>
          exchangeUniqueFields(e.currentTarget, "text"),
        );
        textInput.addEventListener("input", (e) =>
          exchangeUniqueFields(e.currentTarget, "text"),
        );
      }

      if (fileInput) {
        // Убеждаемся, что у поля есть менеджер
        if (!fileInput.fileInputManager) {
          fileInput.fileInputManager = new FileInputManager(
            fileInput,
            (changedInput) => {
              exchangeUniqueFields(changedInput, "files");
            },
          );
        }
        fileInput.removeEventListener("change", exchangeUniqueFields);
        fileInput.addEventListener("change", (e) =>
          exchangeUniqueFields(e.currentTarget, "files"),
        );
      }
    };
    const exchangeUniqueFields = (elem, type) => {
      const formSelectors = ["#calculator-total form", "#fast-req-form form"];
      const uniqueFieldSelector = '#type-unique_form input[type="file"]';

      if (type === "text") {
        const textValue = elem.value;
        // Обновляем текстовые поля в формах
        formSelectors.forEach((selector) => {
          const form = document.querySelector(selector);
          if (form) {
            const textarea = form.querySelector("textarea");
            if (textarea) textarea.value = textValue;
          }
        });
        // Обновляем текстовое поле в основном блоке (если оно не является источником)
        const uniqueText = document.querySelector("#type-unique_text");
        if (uniqueText && uniqueText !== elem) uniqueText.value = textValue;
      }

      if (type === "files") {
        const sourceManager = elem.fileInputManager;
        if (!sourceManager) return;

        const files = sourceManager.getFiles();

        // Собираем все целевые поля (все синхронизируемые поля, кроме текущего)
        const targetFields = [];

        // Поле из основного блока (если существует и не равно источнику)
        const uniqueFile = document.querySelector(uniqueFieldSelector);
        if (uniqueFile && uniqueFile !== elem && uniqueFile.fileInputManager) {
          targetFields.push(uniqueFile);
        }

        // Поля в формах
        formSelectors.forEach((selector) => {
          const form = document.querySelector(selector);
          if (form) {
            const targetInput = form.querySelector(
              '.input-file input[type="file"]',
            );
            if (
              targetInput &&
              targetInput !== elem &&
              targetInput.fileInputManager
            ) {
              targetFields.push(targetInput);
            }
          }
        });

        // Обновляем все целевые поля
        targetFields.forEach((field) => {
          field.fileInputManager.setFiles(files);
        });
      }
    };
    const cleanupUniqueField = () => {
      const formSelectors = ["#calculator-total form", "#fast-req-form form"];
      const blockSelectors = ["#type-unique_form"];

      // Очищаем текстовые поля в формах
      formSelectors.forEach((selector) => {
        const form = document.querySelector(selector);
        if (form) {
          const textarea = form.querySelector("textarea");
          if (textarea) textarea.value = "";
        }
      });

      // Очищаем текстовое поле в исходном блоке
      blockSelectors.forEach((block) => {
        const blockEl = document.querySelector(block);
        if (blockEl) {
          const textarea = blockEl.querySelector("#type-unique_text");
          if (textarea) textarea.value = "";
        }
      });

      // Функция очистки файлового поля
      const clearFileField = (fileInput) => {
        if (fileInput && fileInput.fileInputManager) {
          fileInput.fileInputManager.clearFiles();
        }
      };

      // Очищаем файловые поля в формах
      formSelectors.forEach((selector) => {
        const form = document.querySelector(selector);
        if (form) {
          const fileInput = form.querySelector(
            '.input-file input[type="file"]',
          );
          clearFileField(fileInput);
        }
      });

      // Очищаем исходное файловое поле
      blockSelectors.forEach((block) => {
        const blockEl = document.querySelector(block);
        if (blockEl) {
          const fileInput = blockEl.querySelector('input[type="file"]');
          clearFileField(fileInput);
        }
      });
    };

    // Применение пресета типа сайта
    const applySiteTypePreset = (selectedToggle, toggles, counters, target) => {
      resetCalculator(toggles, counters, target);

      // Показать все аккордеоны, кроме тендерного (он будет скрыт отдельно)
      showAllAccordions();
      if (tenderAccordion) {
        tenderAccordion.classList.add("hidden");
        // tenderAccordion.classList.add("deactive");
      }

      selectedToggle.elementref.checked = true;
      target.current_value += selectedToggle.price;
      if (selectedToggle.reveal)
        selectedToggle.reveal.classList.remove("hidden");

      if (selectedToggle.nested && selectedToggle.nested.length > 0) {
        selectedToggle.nested.forEach((nestedItem) => {
          const nestedToggleId = nestedItem.id;
          const nestedToggle = toggles.find((t) => t.id === nestedToggleId);
          if (nestedToggle) {
            // Если передан индекс для селекта, сохраняем его временно
            if (nestedItem.optionIndex !== null) {
              nestedToggle._tempSelectIndex = nestedItem.optionIndex;
            }
            nestedToggle.elementref.checked = true;
            nestedToggle.elementref.dispatchEvent(togglechange); // Вызываем обработчик

            if (nestedToggle.counter) {
              const counter = nestedToggle.counter;
              const defaultValue = parseInt(
                counter.elementref.getAttribute("value") || "0",
              );
              counter.elementref.value = defaultValue;
              counter.total = defaultValue * counter.price;
              target.current_value += counter.total;
            }

            const section = document.querySelector(
              `#section-${nestedToggleId.split("-")?.[0]}`,
            );
            if (section) section.checked = true;
          }
        });
      }

      updateAccordionStateForSiteType(selectedToggle);
      if (selectedToggle.showAccordionItems)
        showAccordionItems(selectedToggle.showAccordionItems);
      if (selectedToggle.hideAccordionItems)
        hideAccordionItems(selectedToggle.hideAccordionItems);
    };

    // Обновление счётчиков
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

    // Проверка внутреннего тендерного переключателя
    const isTenderPortalInnerToggle = (toggle) => {
      const tenderConfigIds = [
        "tender-portal_config",
        "tender-portal_paying_config",
      ];
      for (const configId of tenderConfigIds) {
        const configElement = document.getElementById(configId);
        if (configElement && configElement.contains(toggle.elementref))
          return true;
      }
      return false;
    };

    // Функция инициализации переключателя тендерного портала
    function initTenderSwitch() {
      const switchCheckbox = document.getElementById("tender-solution-switch");
      const hiddenSelect = document.getElementById("tender-solution-select");

      if (!switchCheckbox || !hiddenSelect) return;

      // Функция синхронизации переключателя с селектом (по индексу)
      const syncSwitchFromSelect = () => {
        const selectedIndex = hiddenSelect.selectedIndex;
        // Переключатель включён, если выбран индекс 1 (закупки), иначе выключен
        switchCheckbox.checked = selectedIndex === 1;
      };

      // Функция обновления селекта при изменении переключателя
      const updateSelectFromSwitch = () => {
        const newIndex = switchCheckbox.checked ? 1 : 0;
        if (hiddenSelect.selectedIndex !== newIndex) {
          hiddenSelect.selectedIndex = newIndex;
          // Диспатчим событие change, чтобы сработала логика из калькулятора
          hiddenSelect.dispatchEvent(new Event("change", { bubbles: true }));
        }
      };

      // Клик по опциям (спаны "Грузоперевозки" и "Закупки")
      const freightOption = document.querySelector(
        '.switch-option[data-option="freight"]',
      );
      const procurementOption = document.querySelector(
        '.switch-option[data-option="procurement"]',
      );

      const handleOptionClick = (index) => {
        if (hiddenSelect.selectedIndex !== index) {
          hiddenSelect.selectedIndex = index;
          syncSwitchFromSelect(); // обновляем визуальное состояние переключателя
          hiddenSelect.dispatchEvent(new Event("change", { bubbles: true }));
        }
      };

      if (freightOption)
        freightOption.addEventListener("click", () => handleOptionClick(0));
      if (procurementOption)
        procurementOption.addEventListener("click", () => handleOptionClick(1));

      // Обработчик клика на переключатель (ползунок)
      const switchControl = switchCheckbox.closest(".switch-control");
      if (switchControl) {
        switchControl.addEventListener("click", (e) => {
          // Предотвращаем двойное срабатывание (если клик пришёлся на чекбокс)
          e.preventDefault();
          // Переключаем чекбокс, остальное сделает его обработчик change
          switchCheckbox.checked = !switchCheckbox.checked;
          updateSelectFromSwitch();
        });
      }

      // Подписываемся на изменение переключателя
      switchCheckbox.addEventListener("change", updateSelectFromSwitch);

      // Слушаем изменения селекта (может быть изменён программно)
      hiddenSelect.addEventListener("change", syncSwitchFromSelect);

      // Начальная синхронизация
      syncSwitchFromSelect();
    }

    initTenderSwitch();

    // Обработка специального тендерного переключателя
    const handleTendersToggle = (toggle, toggles, counters, target) => {
      const siteTypesAccordion = document.getElementById("site-types");

      if (toggle.elementref.checked) {
        // 1. Полный сброс калькулятора
        resetCalculator(toggles, counters, target);
        toggle.elementref.checked = true; // восстанавливаем состояние (resetCalculator его сбросил)

        // 2. Скрываем все аккордеоны, кроме site-types и tender-accordion
        hideAllAccordionsExcept(["site-types", "tender-accordion"]);

        // 3. Обновляем состояние аккордеонов (деактивируем остальные)
        updateAccordionStateForSiteType(toggle);

        // 4. Убеждаемся, что тендерный аккордеон видим и активен
        if (tenderAccordion) {
          tenderAccordion.classList.remove("hidden");
          tenderAccordion.classList.remove("deactive");
        }

        // 5. Активируем вложенные элементы (tender-solution с индексом 1)
        if (toggle.nested && toggle.nested.length > 0) {
          activateNestedToggles(toggle, toggles, target);

          if (
            tenderAccordion &&
            !tenderAccordion.classList.contains("hidden")
          ) {
            const hiddenSelect = document.getElementById(
              "tender-solution-select",
            );
            if (hiddenSelect) {
              hiddenSelect.dispatchEvent(
                new Event("change", { bubbles: true }),
              );
            }
          }
        }
      } else {
        // 5. Выключение: сброс и показ всех аккордеонов
        resetCalculator(toggles, counters, target);
        showAllAccordions();

        // 6. Скрываем тендерный аккордеон
        if (tenderAccordion) {
          tenderAccordion.classList.add("hidden");
        }

        // 7. Деактивируем вложенные элементы (tender-solution)
        if (toggle.nested && toggle.nested.length > 0) {
          deactivateNestedToggles(toggle, toggles, target);
        }
      }
    };

    // ФУНКЦИИ ДЛЯ АКТИВАЦИИ/ДЕАКТИВАЦИИ NESTED TOGGLES (модифицированы)
    const activateNestedToggles = (toggle, toggles, target) => {
      if (toggle.nested && toggle.nested.length > 0) {
        toggle.nested.forEach((nestedItem) => {
          const nestedToggle = toggles.find((t) => t.id === nestedItem.id);
          if (nestedToggle && !nestedToggle.elementref.checked) {
            // Если передан индекс для селекта, сохраняем его временно
            if (nestedItem.optionIndex !== null) {
              nestedToggle._tempSelectIndex = nestedItem.optionIndex;
            }
            nestedToggle.elementref.checked = true;
            nestedToggle.elementref.dispatchEvent(new Event("change")); // Вызываем обработчик

            const section = document.querySelector(
              `#section-${nestedItem.id.split("-")?.[0]}`,
            );
            if (section) section.checked = true;

            // Рекурсивно активируем вложенные элементы
            activateNestedToggles(nestedToggle, toggles, target);
          }
        });
      }
    };

    const deactivateNestedToggles = (toggle, toggles, target) => {
      if (toggle.nested && toggle.nested.length > 0) {
        toggle.nested.forEach((nestedItem) => {
          const nestedToggle = toggles.find((t) => t.id === nestedItem.id);
          if (nestedToggle && nestedToggle.elementref.checked) {
            nestedToggle.elementref.checked = false;
            nestedToggle.elementref.dispatchEvent(new Event("change")); // Вызываем обработчик

            // Рекурсивно деактивируем вложенные элементы
            deactivateNestedToggles(nestedToggle, toggles, target);
          }
        });
      }
    };

    // Обработка хеша
    const handleToggleByHash = (hash, toggles, counters, target) => {
      const id = hash.replace("#", "");

      const tenderPresets = {
        // Грузоперевозки
        "tender-shipping-standard": {
          solutionSelectIndex: 0,
          extraToggles: [],
        },
        "tender-shipping-extended": {
          solutionSelectIndex: 0,
          extraToggles: [
            "tender-portal_individual-logging",
            "tender-portal_defender",
            "tender-portal_telegram-notify",
            "tender-portal_click",
            "tender-portal_routes-build",
            "tender-portal_choose",
          ],
        },
        "tender-shipping-individual": {
          solutionSelectIndex: 0,
          extraToggles: [
            "tender-portal_defender",
            "tender-portal_telegram-notify",
            "tender-portal_click",
            "tender-portal_routes-build",
            "tender-portal_choose",
            "tender-portal_ai-on",
            "tender-portal_i1crm",
            "tender-portal_long-contracts",
            "tender-portal_priority",
            "tender-portal_individual-logging",
            "tender-portal_match",
            "tender-portal_individual",
          ],
        },
        // Закупки
        "tender-purchases-standard": {
          solutionSelectIndex: 1,
          extraToggles: [],
        },
        "tender-purchases-extended": {
          solutionSelectIndex: 1,
          extraToggles: [
            "tender-portal_paying_individual-logging",
            "tender-portal_paying_telegram-notify",
            "tender-portal_paying_organize",
            "tender-portal_paying_click",
            "tender-portal_paying_choose",
          ],
        },
        "tender-purchases-individual": {
          solutionSelectIndex: 1,
          extraToggles: [
            "tender-portal_paying_telegram-notify",
            "tender-portal_paying_i1crm",
            "tender-portal_paying_click",
            "tender-portal_paying_choose",
            "tender-portal_paying_ai-on",
            "tender-portal_paying_match",
            "tender-portal_paying_organize",
            "tender-portal_paying_long-contracts",
            "tender-portal_paying_priority",
            "tender-portal_paying_individual-logging",
            "tender-portal_paying_individual",
          ],
        },
      };

      const preset = tenderPresets[id];
      if (preset) {
        // 1. Включаем переключатель тендерного портала (вызовет handleTendersToggle)
        const tenderToggle = toggles.find((t) => t.id === "tenders_toggle");
        if (tenderToggle && !tenderToggle.elementref.checked) {
          setTimeout(() => {
            tenderToggle.elementref.checked = true;
            tenderToggle.elementref.dispatchEvent(
              new Event("change", { bubbles: true }),
            );
          }, 1000);
        }

        // 2. Устанавливаем нужную опцию селекта (сама переключит блоки через change)
        const solutionSelect = document.getElementById(
          "tender-solution-select",
        );
        if (
          solutionSelect &&
          solutionSelect.selectedIndex !== preset.solutionSelectIndex
        ) {
          setTimeout(() => {
            solutionSelect.selectedIndex = preset.solutionSelectIndex;
            solutionSelect.dispatchEvent(
              new Event("change", { bubbles: true }),
            );
          }, 1100);
        }

        // 3. Синхронизируем визуальный свитч (для красоты)
        const switchCheckbox = document.getElementById(
          "tender-solution-switch",
        );
        if (switchCheckbox) {
          switchCheckbox.checked = preset.solutionSelectIndex === 1;
        }

        // 4. Даём время на применение переключений, затем добавляем доп. чекбоксы
        setTimeout(() => {
          preset.extraToggles.forEach((toggleId) => {
            const toggle = toggles.find((t) => t.id === toggleId);
            if (toggle && !toggle.elementref.checked) {
              const wasDisabled = toggle.elementref.disabled;
              if (wasDisabled) toggle.elementref.disabled = false;
              toggle.elementref.checked = true;
              toggle.elementref.dispatchEvent(
                new Event("change", { bubbles: true }),
              );
              if (wasDisabled) toggle.elementref.disabled = true;
            }
          });
          if (typeof reviewTotal === "function") reviewTotal();
        }, 1200);

        // Показать калькулятор, скрыть приветствие
        toggleSection(
          null,
          false,
          ["calculator", "calculator-total"],
          ["choose_your_way"],
        );

        setTimeout(() => {
          const calculatorWrapper = document.querySelector(
            ".calculator-wrapper",
          );
          if (calculatorWrapper) calculatorWrapper.classList.add("active");
        }, 600);

        return;
      }

      // --- Обработка обычных хешей (без изменений) ---
      const handle_target = toggles.find((t) => t.id === id);
      if (handle_target) {
        try {
          if (handle_target.isSiteType) {
            applySiteTypePreset(handle_target, toggles, counters, target);
          } else {
            handle_target.elementref.checked = true;
            handle_target.elementref.dispatchEvent(togglechange);
            if (handle_target.nested && handle_target.nested.length > 0) {
              handle_target.nested.forEach((nestedItem) => {
                const nestedToggle = toggles.find(
                  (t) => t.id === nestedItem.id,
                );
                const section = document.querySelector(
                  `#section-${nestedItem.id.split("-")?.[0]}`,
                );
                if (section) section.checked = true;
                if (nestedToggle) {
                  if (nestedItem.optionIndex !== null) {
                    nestedToggle._tempSelectIndex = nestedItem.optionIndex;
                  }
                  nestedToggle.elementref.checked = true;
                  nestedToggle.elementref.dispatchEvent(togglechange);
                }
                if (nestedToggle?.reveal)
                  nestedToggle.reveal.classList.remove("hidden");
              });
            }
          }
          toggleSection(
            null,
            false,
            ["calculator", "calculator-total"],
            ["choose_your_way"],
          );
          setTimeout(() => {
            let calculatorWrapper = document?.querySelector(
              ".calculator-wrapper",
            );
            calculatorWrapper?.classList.add("active");
          }, 600);
        } catch (err) {
          console.log("=> error", err);
        }
      } else {
        console.log("=> toggle not found for hash:", id);
      }
    };

    // Преобразование DOM-элементов во внутренние объекты (модифицировано для nested с параметрами)
    const toggleConverter = (inputs) => {
      const toggles = [];
      const counters = [];
      const texts = [];

      const mainSiteTypes = [
        "type-landing",
        "type-portfolio",
        "type-corporate",
        "type-corporate_catalogue",
        "type-store",
        "type-store_ai",
        "type-portal",
        // "tenders_toggle",
        "type-unique",
      ];

      inputs.forEach((input) => {
        // Текстовые поля с ценой
        if (
          input.type === "text" &&
          input.hasAttribute("data-calculation-textfield")
        ) {
          toggles.push({
            id: input.id,
            elementref: input,
            price: parseInt(input.dataset.price || "0"),
            reveal: document.getElementById(input.dataset.reveal || ""),
            nested: parseNested(input.dataset.nested),
            showAccordionItems: input.dataset.showAccordionItem
              ? input.dataset.showAccordionItem.split(";")
              : [],
            hideAccordionItems: input.dataset.hideAccordionItem
              ? input.dataset.hideAccordionItem.split(";")
              : [],
            type: "textfield",
            active: false,
          });
          return;
        }

        // Селекты
        if (input.tagName === "SELECT") {
          const options = [];
          for (let opt of input.options) {
            options.push({
              value: opt.value,
              price: parseInt(opt.dataset.price || "0"),
              reveal: opt.dataset.reveal
                ? document.getElementById(opt.dataset.reveal)
                : null,
              nested: parseNested(opt.dataset.nested),
              showAccordionItems: opt.dataset.showAccordionItem
                ? opt.dataset.showAccordionItem.split(";")
                : [],
              hideAccordionItems: opt.dataset.hideAccordionItem
                ? opt.dataset.hideAccordionItem.split(";")
                : [],
              selectId: input.id,
            });
          }

          const selectObj = {
            id: input.id,
            elementref: input,
            type: "select",
            options: options.map((opt) => ({
              ...opt,
              selectId: input.id,
            })),
            currentOption: null,
          };

          // Определяем, есть ли предустановленная опция
          let hasSelectedOption = false;
          for (let opt of input.options) {
            if (opt.hasAttribute("selected")) {
              hasSelectedOption = true;
              break;
            }
          }

          if (hasSelectedOption) {
            const selectedIndex = input.selectedIndex;
            if (selectedIndex >= 0 && options[selectedIndex]) {
              selectObj.currentOption = options[selectedIndex];
            }
          } else {
            input.selectedIndex = -1;
          }

          toggles.push(selectObj);
          return;
        }

        // Остальные input'ы
        switch (input.type) {
          case "checkbox": {
            const isMainSiteType = mainSiteTypes.includes(input.id);
            const selectTarget = input.dataset.selectTarget;
            const selectOptionIndex = input.dataset.selectOptionIndex
              ? parseInt(input.dataset.selectOptionIndex)
              : 0;

            toggles.push({
              id: input.id,
              elementref: input,
              price: parseInt(input.dataset.price || "0"),
              nested: parseNested(input.dataset.nested),
              reveal: document.getElementById(input.dataset.reveal || ""),
              radioid: input.dataset.radio?.split(";"),
              showAccordionItems: input.dataset.showAccordionItem?.split(";"),
              hideAccordionItems: input.dataset.hideAccordionItem?.split(";"),
              isSiteType: isMainSiteType,
              type: "checkbox",
              selectTarget: selectTarget,
              selectOptionIndex: selectOptionIndex,
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
            texts.push({ id: input.id, elementref: input });
            break;
          }
        }
      });

      // Связываем счётчики с соответствующими чекбоксами
      toggles.forEach((toggle) => {
        counters.forEach((counter) => {
          if (counter.intendfor === toggle.id) {
            toggle.counter = counter;
          }
        });
      });

      return { toggles, counters, texts };
    };

    // Вспомогательная функция для разбора nested-строки с параметрами
    const parseNested = (str) => {
      if (!str) return [];
      return str.split(";").map((item) => {
        const parts = item.split(":");
        if (parts.length === 2) {
          return { id: parts[0], optionIndex: parseInt(parts[1]) };
        } else {
          return { id: parts[0], optionIndex: null };
        }
      });
    };

    // Основная логика
    if (inputs && target) {
      const { toggles, counters, texts } = toggleConverter(inputs);
      target.innerText = 0;
      target.current_value = 0;
      deactivateAllAccordions();

      // Слушатели для текстовых полей
      toggles.forEach((toggle) => {
        if (toggle.type === "textfield") {
          toggle.elementref.addEventListener("input", () => {
            const value = toggle.elementref.value.trim();
            if (value !== "" && !toggle.active) {
              activateTextField(toggle, target, toggles);
            } else if (value === "" && toggle.active) {
              deactivateTextField(toggle, target, toggles);
            }
            // reviewTotal();
          });
          toggle.elementref.addEventListener("change", () => {
            const value = toggle.elementref.value.trim();
            if (value !== "" && !toggle.active) {
              activateTextField(toggle, target, toggles);
            } else if (value === "" && toggle.active) {
              deactivateTextField(toggle, target, toggles);
            }
            // reviewTotal();
          });
        }
      });

      // Инициализация селектов
      initializeSelects(toggles, target);

      // Обработчики для чекбоксов и селектов
      toggles.forEach((toggle) => {
        if (toggle.type === "checkbox") {
          toggle.elementref.addEventListener("change", () => {
            // Специальные обработчики
            if (toggle.id === "tenders_toggle") {
              handleTendersToggle(toggle, toggles, counters, target);
              return;
            }
            if (toggle.isSiteType) {
              if (toggle.elementref.checked) {
                applySiteTypePreset(toggle, toggles, counters, target);
              } else {
                resetCalculator(toggles, counters, target);
              }
              return;
            }

            const isTenderInnerToggle = isTenderPortalInnerToggle(toggle);

            if (toggle.elementref.checked) {
              // Включение чекбокса
              if (toggle.reveal) toggle.reveal.classList.remove("hidden");
              if (toggle.counter) updateCountersForToggle(toggle, target);
              if (toggle.radioid && toggle.radioid.length > 0) {
                toggle.radioid.forEach((id) => {
                  const radioToggle = toggles.find((t) => t.id === id);
                  if (radioToggle && radioToggle.elementref.checked) {
                    radioToggle.elementref.checked = false;
                    radioToggle.elementref.dispatchEvent(new Event("change"));
                    // Временно удалено
                    // target.current_value -=
                    // 	radioToggle.price;
                    // if (radioToggle.reveal)
                    // 	radioToggle.reveal.classList.add(
                    // 		"hidden",
                    // 	);
                    // if (
                    // 	radioToggle.counter &&
                    // 	radioToggle.counter.total
                    // ) {
                    // 	target.current_value -=
                    // 		radioToggle.counter.total;
                    // 	radioToggle.counter.total = 0;
                    // }
                  }
                });
              }
              if (toggle.nested && toggle.nested.length > 0) {
                activateNestedToggles(toggle, toggles, target);
              }
              target.current_value += toggle.price;

              if (!isTenderInnerToggle) {
                if (toggle.showAccordionItems)
                  showAccordionItems(toggle.showAccordionItems);
                if (toggle.hideAccordionItems)
                  hideAccordionItems(toggle.hideAccordionItems);
              }
            } else {
              // Выключение чекбокса
              if (toggle.reveal) {
                toggle.reveal.classList.add("hidden");
                clearTextFieldsInContainer(toggle.reveal, toggles, target);
              }
              if (toggle.counter?.total) {
                target.current_value -= toggle.counter.total;
                toggle.counter.total = 0;
              }
              if (toggle.nested && toggle.nested.length > 0) {
                deactivateNestedToggles(toggle, toggles, target);
              }
              target.current_value -= toggle.price;

              if (!isTenderInnerToggle) {
                if (toggle.showAccordionItems)
                  hideAccordionItems(toggle.showAccordionItems);
                if (toggle.hideAccordionItems)
                  showAccordionItems(toggle.hideAccordionItems);
              }
            }

            // Управление связанным селектом (с поддержкой временного индекса)
            if (toggle.selectTarget) {
              const targetSelect = document.getElementById(toggle.selectTarget);
              if (targetSelect && targetSelect.tagName === "SELECT") {
                if (toggle.elementref.checked) {
                  // Используем временный индекс, если он есть, иначе стандартный
                  let index =
                    toggle._tempSelectIndex !== undefined
                      ? toggle._tempSelectIndex
                      : toggle.selectOptionIndex;
                  if (index === undefined) index = 0; // по умолчанию
                  if (index >= 0 && index < targetSelect.options.length) {
                    targetSelect.selectedIndex = index;
                    targetSelect.dispatchEvent(new Event("change"));
                  }
                  // Сбрасываем временный индекс после использования
                  delete toggle._tempSelectIndex;
                } else {
                  targetSelect.selectedIndex = -1;
                  targetSelect.dispatchEvent(new Event("change"));
                }
              }
            }

            // reviewTotal();

            if (target.current_value < 0) target.current_value = 0;
          });
        } else if (toggle.type === "select") {
          toggle.elementref.addEventListener("change", (e) => {
            const oldOption = toggle.currentOption;
            const newIndex = toggle.elementref.selectedIndex;
            const newOption = toggle.options[newIndex];

            if (oldOption === newOption) return;

            if (oldOption) {
              deactivateSelectOption(oldOption, toggles, target);
            }
            if (newOption) {
              activateSelectOption(newOption, toggles, target);
            }

            toggle.currentOption = newOption;
            updateNiceSelect(toggle.elementref); // обновляем nice-select
            updateTooltipsForSelect(toggle.elementref); // <-- добавить вызов

            reviewTotal();

            if (target.current_value < 0) target.current_value = 0;
          });
        }

        // Инициализация для уже отмеченных чекбоксов
        if (
          toggle.type === "checkbox" &&
          toggle.elementref.checked &&
          toggle.selectTarget
        ) {
          toggle.elementref.dispatchEvent(new Event("change"));
        }
      });

      // Обработка счётчиков
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
              if (counter.elementref.value > 1) counter.elementref.value--;
            } else if (counter.elementref.value > 0) {
              counter.elementref.value--;
            }
            counter.elementref.dispatchEvent(changeEvent);
          },
        );

        counter.elementref.addEventListener("input", () => {
          const relatedToggle = toggles.find((t) => t.id === counter.intendfor);
          if (relatedToggle && relatedToggle.elementref.checked) {
            const oldTotal = counter.total;
            counter.total =
              parseInt(
                counter.elementref.value === ""
                  ? "0"
                  : counter.elementref.value,
              ) * counter.price;
            target.current_value += counter.total - oldTotal;
          } else {
            counter.total =
              parseInt(
                counter.elementref.value === ""
                  ? "0"
                  : counter.elementref.value,
              ) * counter.price;
          }
          if (target.current_value < 0) target.current_value = 0;
          if (
            counter.elementref.dataset?.intendfor === "design-landing" &&
            counter.elementref.value < 1
          ) {
            counter.elementref.value = 1;
          }
        });

        counter.elementref.addEventListener("keydown", (e) => {
          const blockedkeys = ["-", ",", ".", "+"];
          if (blockedkeys.includes(e.key)) e.preventDefault();
        });

        counter.elementref.addEventListener("blur", () => {
          if (counter.elementref.value === "") counter.elementref.value = 0;
          if (
            counter.elementref.dataset?.intendfor === "design-landing" &&
            counter.elementref.value < 1
          ) {
            counter.elementref.value = 1;
          }
        });
      });

      // Обработчики для остальных текстовых полей
      inputs.forEach((input) => {
        if (input.type === "text" || input.tagName === "TEXTAREA") {
          input.addEventListener("focus", () => {
            reviewTotal();
          });
        } else {
          input.addEventListener("change", () => {
            reviewTotal();
          });
        }
      });

      // Кнопка отправки
      sendButtons?.forEach((button) => {
        button?.addEventListener("click", (e) => {
          reviewTotal();
        });
      });

      // Кнопка сброса
      reset_button?.addEventListener("click", (e) => {
        const calculator = document.getElementById("calculator");
        let icon = e.currentTarget.querySelector("i");
        icon.classList.add("rotateInfinite");
        sendButtons?.forEach((button) => (button.disabled = true));

        setTimeout(() => {
          calculator?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          icon.classList.remove("rotateInfinite");
          sendButtons?.forEach((button) => (button.disabled = false));

          setTimeout(() => {
            resetCalculator(toggles, counters, target);
            reviewTotal();
          }, 200);
        }, 600);
      });

      if (hash) {
        handleToggleByHash(hash, toggles, counters, target);
      }

      function reviewTotal() {
        const checkboxes = toggles
          .filter((t) => t.type === "checkbox" && t.elementref.checked)
          .map((t) => ({ id: t.id, price: t.price }));

        const selects = toggles
          .filter((t) => t.type === "select" && t.currentOption)
          .map((t) => ({
            id: t.id,
            selectedValue: t.currentOption.value,
            price: t.currentOption.price,
          }));

        const textfields = toggles
          .filter((t) => t.type === "textfield" && t.active)
          .map((t) => ({
            id: t.id,
            value: t.elementref.value,
            price: t.price,
          }));

        const countersData = counters
          .filter((c) => c.elementref.value != "")
          .map((c) => ({
            id: c.id,
            value: parseInt(c.elementref.value),
            price: c.price,
          }));

        const extraTexts = texts
          .filter((t) => t.elementref.value !== "")
          .map((t) => ({ id: t.id, value: t.elementref.value }));

        const review = {
          checkboxes,
          selects,
          textfields,
          counters: countersData,
          extra: extraTexts,
          preprice: target.innerText,
          total: target.current_value,
        };
        toggleTotalCost();
        // console.log(review);
      }

      function toggleTotalCost() {
        const totalSelectors = [
          "#calculator-total-cost",
          "#calculator-total-modal",
        ];

        // console.log(target.innerText)

        document.querySelectorAll(totalSelectors).forEach((totalSelector) => {
          let wrapper = totalSelector.closest("p");

          wrapper.classList.toggle("d-none", target.innerText === "0");
        });
      }
    }
  }
});

// Передача состояния блока итоговой стоимости селектором
function setTotalState(state) {
  let wrapper = document.querySelector("#calculator-total.total");

  if (state === "before") {
    wrapper.classList.remove("active");
    setTimeout(() => {
      document.documentElement.classList.remove("calculator-total-before");
    }, 600);
  } else {
    wrapper.classList.add("active");
    setTimeout(() => {
      document.documentElement.classList.add("calculator-total-before");
    }, 600);
  }
}

// Сброс состояния блока итоговой стоимости сайта
function resetTotalState() {
  let isMobileView = window.innerWidth < 1000,
    wrapper = document.querySelector("#calculator-total.total");

  if (isMobileView) {
    wrapper?.classList.remove("active");
    setTimeout(() => {
      document.documentElement.classList.remove("calculator-total-before");
    }, 600);
  }
}

// trigger blocks
const toggleSection = (
  trigger,
  isObject = false,
  showIds = [],
  hideIds = [],
) => {
  let selectorsShowIds = [];
  let selectorsHideIds = [];
  let shouldScroll = true;

  let setShowClass = ["show"];
  let setHideClass = ["fadeOutUp"];

  if (!isObject) {
    // Если переданы явные массивы для показа/скрытия - используем их
    if (showIds.length > 0) {
      selectorsShowIds = showIds;
    } else if (Array.isArray(trigger)) {
      selectorsShowIds = trigger;
    } else if (trigger) {
      selectorsShowIds = [trigger];
    }

    if (hideIds.length > 0) {
      selectorsHideIds = hideIds;
    }
  } else {
    // Старая логика для работы с data-атрибутами
    const triggerShow = trigger.currentTarget.dataset.triggerShow;
    const triggerHide = trigger.currentTarget.dataset.triggerHide;

    const scrollAttr = trigger.currentTarget.dataset.shouldScroll;
    shouldScroll = scrollAttr === undefined || scrollAttr === "true";

    if (triggerShow) {
      selectorsShowIds = triggerShow
        .split(";")
        .filter((id) => id.trim() !== "");
    }

    if (triggerHide) {
      selectorsHideIds = triggerHide
        .split(";")
        .filter((id) => id.trim() !== "");
    }

    // Дополнительно можно добавить showIds/hideIds из параметров
    if (showIds.length > 0) {
      selectorsShowIds = [...selectorsShowIds, ...showIds];
    }
    if (hideIds.length > 0) {
      selectorsHideIds = [...selectorsHideIds, ...hideIds];
    }
  }

  // Показываем элементы
  selectorsShowIds.forEach((id) => {
    const selector = document.getElementById(id);

    if (!selector) {
      console.warn(`Элемент с id="${id}" не найден`);
      return;
    }

    // Удаляем классы для скрытия
    selector.classList.remove(...setHideClass);
    // Добавляем классы для показа
    selector.classList.add(...setShowClass);
    // Восстанавливаем max-height
    selector.style.maxHeight = "";
    // Убираем display: none если был
    selector.style.display = "";

    // Скролл к первому элементу
    if (id === selectorsShowIds[0] && shouldScroll) {
      setTimeout(() => {
        selector.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        console.log("success scroll to #" + id);
      }, 600);
    } else if (id === selectorsShowIds[0] && !shouldScroll) {
      console.log("scroll skipped for #" + id);
    }
  });

  // Скрываем элементы
  selectorsHideIds.forEach((id) => {
    const selector = document.getElementById(id);

    if (!selector) {
      console.warn(`Элемент с id="${id}" не найден`);
      return;
    }

    // Удаляем классы для показа
    selector.classList.remove(...setShowClass);
    // Добавляем классы для скрытия
    selector.classList.add(...setHideClass);

    setTimeout(() => {
      selector.style.maxHeight = 0;

      setTimeout(() => {
        // Проверяем, не нужно ли оставить элемент в DOM
        if (!selector.dataset.keepInDom) {
          selector.remove();
        } else {
          // Если нужно оставить, просто скрываем
          selector.style.display = "none";
        }
      }, 0);
    }, 100);
  });
};

// quick-form
document.addEventListener("DOMContentLoaded", function () {
  const quickForm = document.getElementById("quick-form");
  const bigForm = document.getElementById("bsite-add");
  const bigCalc = document.getElementById("big-calc");

  if (!quickForm) return;

  // --- Обработчик formdata (оставляем без изменений) ---
  quickForm.addEventListener("formdata", (e) => {
    const fd = e.formData;

    // ---- Пылесосим данные из большой формы (bigForm) ----
    if (bigForm) {
      const bigData = new FormData(bigForm);
      for (let [key, value] of bigData.entries()) {
        if (key === "_csrf-frontend" || key === "g-recaptcha-response")
          continue;
        if (!value) continue;
        fd.set(`data[${key}]`, value);
      }
    }

    // ---- Пылесосим данные из калькулятора (bigCalc) ----
    if (bigCalc) {
      const items = [];
      const elements = bigCalc.querySelectorAll("input, select, textarea");
      elements.forEach((el) => {
        const key = el.name || el.id;
        if (!key) return;
        if (key === "_csrf-frontend" || key === "g-recaptcha-response") return;
        if (el.disabled) return;
        if (el.closest(".hidden")) return;

        let value = null;
        let price = "0";
        let label = key;

        if (el.matches('input[type="checkbox"], input[type="radio"]')) {
          if (!el.checked) return;
          const targetId = el.dataset.selectTarget;
          if (targetId) {
            const select = document.getElementById(targetId);
            if (select) {
              const option = select.options[select.selectedIndex];
              label = getLabelText(el) || getGroupTitle(el) || key;
              value =
                option?.textContent?.trim() || select.dataset.display || "Да";
              price = option?.dataset?.price || select.dataset.price || "0";
            } else {
              label = getLabelText(el) || getGroupTitle(el) || key;
              value = "Да";
              price = el.dataset.price || "0";
            }
          } else {
            label = getLabelText(el) || getGroupTitle(el) || key;
            value = el.value && el.value !== "on" ? el.value : "Да";
            price = el.dataset.price || "0";
          }
        } else if (el.tagName === "SELECT") {
          const linkedCheckbox = bigCalc.querySelector(
            `[data-select-target="${el.id}"]`,
          );
          if (linkedCheckbox) return;
          const option = el.options[el.selectedIndex];
          label = getLabelText(el) || getGroupTitle(el) || key;
          value = option?.textContent?.trim() || el.value;
          price = option?.dataset?.price || el.dataset.price || "0";
        } else if (el.type === "text" || el.tagName === "TEXTAREA") {
          if (!el.value || !String(el.value).trim()) return;
          label = getLabelText(el) || getGroupTitle(el) || key;
          value = String(el.value).trim();
          price = el.dataset.price || "0";
        } else {
          return;
        }

        items.push({ key, label, value, price: Number(price) || 0 });
      });

      fd.delete("data");
      fd.append("data", JSON.stringify(items));
    }

    // ---- Убираем дубликаты капчи ----
    const token = fd.get("g-recaptcha-response");
    fd.delete("g-recaptcha-response");
    if (token) fd.append("g-recaptcha-response", token);
  });

  // Вспомогательные функции (если не определены глобально)
  function getLabelText(el) {
    if (el.id) {
      const byFor =
        bigCalc?.querySelector(`label[for="${el.id}"] p`) ||
        bigCalc?.querySelector(`label[for="${el.id}"]`);
      if (byFor) return byFor.textContent.replace(/\s+/g, " ").trim();
    }
    const wrapLabel = el.closest("label");
    if (wrapLabel) {
      const p = wrapLabel.querySelector("p");
      if (p) return p.textContent.replace(/\s+/g, " ").trim();
    }
    return "";
  }

  function getGroupTitle(el) {
    const toggleLine = el.closest(".toggle-line");
    if (!toggleLine) return "";
    let prev = toggleLine.previousElementSibling;
    while (prev) {
      if (
        prev.matches(".title_h5.quote, .title_h5, p.title_h5.quote, p.title_h5")
      ) {
        const text = prev.textContent.replace(/\s+/g, " ").trim();
        if (text) return text;
      }
      prev = prev.previousElementSibling;
    }
    return "";
  }
});

class FileInputManager {
  constructor(inputElement, onChangeCallback = null) {
    this.input = inputElement;
    this.onChangeCallback = onChangeCallback;
    this.container = inputElement.closest(".input-file");
    if (!this.container) {
      console.warn("FileInputManager: не найден родитель .input-file");
      return;
    }

    // Создаём .file-drop-area при необходимости
    let dropArea = this.container.querySelector(".file-drop-area");
    if (!dropArea) {
      dropArea = document.createElement("div");
      dropArea.className = "file-drop-area";
      while (this.container.firstChild) {
        dropArea.appendChild(this.container.firstChild);
      }
      this.container.appendChild(dropArea);
    }
    this.dropArea = dropArea;

    this.fileListContainer = this.dropArea.querySelector(".file-list");
    if (!this.fileListContainer) {
      this.fileListContainer = document.createElement("div");
      this.fileListContainer.className = "file-list";
      this.dropArea.appendChild(this.fileListContainer);
    }

    this.allFiles = [];
    this.init();
  }

  init() {
    this.fileListContainer.style.display = "none";

    // Привязываем методы
    this.addFiles = this.addFiles.bind(this);
    this.updateDisplay = this.updateDisplay.bind(this);
    this.updateInputFiles = this.updateInputFiles.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.preventDefaults = this.preventDefaults.bind(this);

    // Обработчики событий
    this.input.addEventListener("change", this.handleFileChange);
    this.dropArea.addEventListener("dragover", this.handleDragOver);
    this.dropArea.addEventListener("dragleave", this.handleDragLeave);
    this.dropArea.addEventListener("drop", this.handleDrop);
    this.fileListContainer.addEventListener("click", this.handleRemove);

    // Клик по подсказке открывает диалог выбора файлов
    const hint = this.dropArea.querySelector(".drag-drop-hint");
    if (hint) {
      hint.addEventListener("click", (e) => {
        e.stopPropagation();
        this.input.click();
      });
    } else {
      this.dropArea.addEventListener("click", (e) => {
        if (
          !e.target.classList.contains("remove-file") &&
          !e.target.closest(".remove-file")
        ) {
          this.input.click();
        }
      });
    }

    // Глобальные предотвращения для drag‑событий
    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      this.dropArea.addEventListener(eventName, this.preventDefaults);
      document.body.addEventListener(eventName, this.preventDefaults);
    });
  }

  preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    this.dropArea.classList.add("drag-over");
  }

  handleDragLeave(e) {
    if (!e.relatedTarget || !this.dropArea.contains(e.relatedTarget)) {
      this.dropArea.classList.remove("drag-over");
    }
  }

  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    this.dropArea.classList.remove("drag-over");
    const files = Array.from(e.dataTransfer.files);
    if (files.length) this.addFiles(files);
  }

  handleFileChange(e) {
    const files = Array.from(e.target.files);
    if (files.length) {
      this.addFiles(files);
    }
  }

  handleRemove(e) {
    if (!e.target.classList.contains("remove-file")) return;
    e.stopPropagation();
    const index = parseInt(e.target.dataset.index, 10);
    this.allFiles.splice(index, 1);
    this.updateInputFiles();
    this.updateDisplay();
    // Уведомляем внешний мир об изменении (если нужен коллбэк)
    if (this.onChangeCallback) this.onChangeCallback(this.input);
  }

  isDuplicate(newFile) {
    return this.allFiles.some(
      (existing) =>
        existing.name === newFile.name &&
        existing.size === newFile.size &&
        existing.lastModified === newFile.lastModified,
    );
  }

  addFiles(filesArray) {
    let added = false;
    for (const file of filesArray) {
      if (!this.isDuplicate(file)) {
        this.allFiles.push(file);
        added = true;
      }
    }
    if (added) {
      this.updateInputFiles();
      this.updateDisplay();
      if (this.onChangeCallback) this.onChangeCallback(this.input);
    }
  }

  setFiles(filesArray) {
    this.allFiles = [];
    if (filesArray.length === 0) {
      this.updateInputFiles();
      this.updateDisplay();
      if (this.onChangeCallback) this.onChangeCallback(this.input);
    } else {
      this.addFiles(filesArray);
    }
  }

  clearFiles() {
    this.setFiles([]);
  }

  getFiles() {
    return [...this.allFiles];
  }

  updateInputFiles() {
    const dt = new DataTransfer();
    this.allFiles.forEach((file) => dt.items.add(file));
    this.input.files = dt.files;
  }

  updateDisplay() {
    this.fileListContainer.innerHTML = "";
    if (this.allFiles.length === 0) {
      this.fileListContainer.style.display = "none";
      return;
    }
    this.fileListContainer.style.display = "";
    this.allFiles.forEach((file, index) => {
      const fileItem = document.createElement("div");
      fileItem.classList.add("file-item");

      const nameSpan = document.createElement("span");
      nameSpan.textContent = file.name;
      nameSpan.style.cursor = "pointer";
      nameSpan.addEventListener("click", () => {
        const url = URL.createObjectURL(file);
        window.open(url, "_blank");
        URL.revokeObjectURL(url);
      });

      const removeSpan = document.createElement("span");
      removeSpan.textContent = "✖";
      removeSpan.classList.add("remove-file");
      removeSpan.dataset.index = index;

      fileItem.appendChild(nameSpan);
      fileItem.appendChild(removeSpan);
      this.fileListContainer.appendChild(fileItem);
    });
  }
}

// reviews
const reviewsInit = () => {
  // Функция для сброса анимации перед загрузкой
  function resetReviewsAnimation() {
    const wrapper = reviewsContainer.querySelector(".reviews__list");
    if (wrapper && wrapper.classList.contains("show")) {
      wrapper.classList.remove("show");
    }
  }

  // Функция для запуска анимации после загрузки
  function animateReviewsBlock() {
    const wrapper = reviewsContainer.querySelector(".reviews__list");
    if (wrapper && !wrapper.classList.contains("show")) {
      // Небольшая задержка для гарантии, что DOM обновлен
      setTimeout(() => {
        wrapper.classList.add("show");
      }, 50);
    }
  }

  // Обработчик успешной загрузки PJAX
  $(document).on("pjax:end", "#reviews-container", function () {
    // Запускаем анимацию после загрузки контента
    animateReviewsBlock();
  });

  // Показываем блок при первой загрузке (если не через PJAX)
  setTimeout(() => {
    const wrapper = reviewsContainer.querySelector(".reviews__list");
    if (wrapper && !wrapper.classList.contains("show")) {
      wrapper.classList.add("show");
    }
  }, 100);

  reviewsContainer.addEventListener("submit", (event) => {
    if (event.target.matches("form[data-pjax]")) {
      event.preventDefault();

      // Сбрасываем анимацию перед отправкой
      resetReviewsAnimation();

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

      // Сбрасываем анимацию перед загрузкой
      resetReviewsAnimation();

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

      // Сбрасываем анимацию перед загрузкой
      resetReviewsAnimation();

      $.pjax.reload("#reviews-container", {
        type: "POST",
        data: { type: type },
        timeout: 1000,
        push: false,
        replace: true,
      });

      // УБИРАЕМ анимацию отсюда - она будет запущена в pjax:end
    }
  });
};

// comment password and add handling
document.addEventListener("DOMContentLoaded", () => {
  // Helper function to serialize form data (mimics jQuery's serialize())
  function serializeForm(form) {
    const formData = new FormData(form);
    const params = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      params.append(key, value);
    }
    return params.toString();
  }

  // Handle password form submission
  const passwordForm = document.querySelector("#form-comment-password");
  if (passwordForm) {
    passwordForm.addEventListener("submit", function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();

      const btn = this.querySelector('button[type="submit"]');
      showButtonLoader(btn);

      const formData = new FormData(this);

      fetch(this.action, {
        method: "POST",
        body: formData,
        credentials: "same-origin",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      })
        .then(async (response) => {
          // Пытаемся распарсить JSON, если это возможно
          let data = null;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            data = await response.json();
          }

          if (response.ok) {
            if (data && data.status) {
              // Ожидаемая успешная структура
              const popupBody = document.querySelector(
                "#login-review .popup-body",
              );
              if (popupBody) {
                popupBody.innerHTML =
                  '<p class="mb-20">' +
                  data.data.title +
                  "</p>" +
                  data.data.body;
              }
              showFormFeedback(btn, "Пароль принят", "success");
            } else {
              // Успешный ответ, но без явного status – считаем успехом
              showFormFeedback(btn, "Пароль принят", "success");
            }
          } else {
            // HTTP ошибка
            const errorMsg =
              data && data.message ? data.message : "Ошибка проверки пароля";
            showFormFeedback(btn, errorMsg, "error");
          }
        })
        .catch((error) => {
          console.error("Password form error:", error);
          showFormFeedback(btn, "Ошибка соединения с сервером", "error");
        })
        .finally(() => hideButtonLoader(btn));
    });
  }

  // Handle comment add form submission
  const commentForm = document.querySelector("#comment-add");
  if (commentForm) {
    commentForm.addEventListener("submit", function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();

      const btn = this.querySelector('button[type="submit"]');
      showButtonLoader(btn);

      const formData = new FormData(this);

      fetch(this.action, {
        method: "POST",
        body: formData,
        credentials: "same-origin",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      })
        .then(async (response) => {
          let data = null;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            data = await response.json();
          }

          if (response.ok) {
            if (data && data.status) {
              // Успешная структура от сервера
              const popupBody = document.querySelector(
                "#login-review .popup-body",
              );
              if (popupBody) {
                popupBody.innerHTML =
                  '<p class="mb-20">' +
                  data.data.title +
                  "</p>" +
                  data.data.body;
              }
              showFormFeedback(btn, "Комментарий добавлен", "success");

              // Сброс формы (очищаем поля)
              commentForm.reset();

              // Очистка кастомных менеджеров файлов, если они есть в форме
              const fileInputs =
                commentForm.querySelectorAll('input[type="file"]');
              fileInputs.forEach((input) => {
                if (input.fileInputManager) {
                  input.fileInputManager.clearFiles();
                }
              });
            } else {
              // Успешный ответ без явного поля status – считаем успехом
              showFormFeedback(btn, "Комментарий добавлен", "success");
              commentForm.reset();
              const fileInputs =
                commentForm.querySelectorAll('input[type="file"]');
              fileInputs.forEach((input) => {
                if (input.fileInputManager) input.fileInputManager.clearFiles();
              });
            }
          } else {
            // HTTP ошибка (4xx, 5xx)
            const errorMsg =
              data && data.message
                ? data.message
                : "Ошибка добавления комментария";
            showFormFeedback(btn, errorMsg, "error");
          }
        })
        .catch((error) => {
          console.error("Comment form error:", error);
          showFormFeedback(btn, "Ошибка соединения с сервером", "error");
        })
        .finally(() => hideButtonLoader(btn));
    });
  }
});

const observer = new IntersectionObserver(handleIntersection, {
  rootMargin: "100px",
});

function handleIntersection(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      loadLazyElement(entry.target);
      observer.unobserve(entry.target);
    }
  });
}

function loadLazyElement(element) {
  if (!element || !element.dataset.src) {
    return;
  }

  element.src = element.dataset.src;
  element.classList.remove("lazyload");
}

function observeLazyElements(root = document) {
  const lazyElements = root.querySelectorAll(".lazyload");

  lazyElements.forEach((element) => {
    observer.observe(element);
  });
}

window.observeLazyElements = observeLazyElements;

observeLazyElements();

/**
 * Единый класс для работы с оглавлением статьи
 * Поддерживает автоматическую генерацию и управление существующим оглавлением
 */
class TableOfContents {
  /**
   * Конструктор класса
   * @param {Object} options - Настройки оглавления
   * @param {boolean} options.autoGenerate - Автоматически генерировать оглавление
   * @param {string} options.selector - Селектор заголовков для авто-генерации
   * @param {boolean} options.highlightAll - Подсвечивать все видимые заголовки
   * @param {string} options.highlightStrategy - Стратегия подсветки ('multiple', 'closest', 'first')
   * @param {string} options.rootMargin - Настройки rootMargin для IntersectionObserver
   * @param {number} options.scrollOffset - Отступ при скролле к элементу
   */
  constructor(options = {}) {
    // Настройки по умолчанию
    this.options = {
      autoGenerate: false,
      selector: '.blog_page [id^="a"]',
      highlightAll: true,
      highlightStrategy: "multiple",
      rootMargin: "-10% 0px 100% 0px",
      scrollOffset: 80,
      ...options,
    };

    // Основные элементы
    this.nav = document.querySelector(".article-navigation");
    if (!this.nav) {
      console.warn("TableOfContents: Не найден элемент .article-navigation");
      return;
    }

    this.navList = this.nav.querySelector(".nav-list");
    if (!this.navList) {
      console.warn("TableOfContents: Не найден элемент .nav-list");
      return;
    }

    // Данные для работы
    this.links = [];
    this.sections = [];
    this.visibleSections = new Set();
    this.tocData = [];
    this.observer = null;
    this.currentActive = null;

    this.init();
  }

  /**
   * Инициализация оглавления
   */
  init() {
    // Автоматическая генерация оглавления если нужно
    if (this.options.autoGenerate && !this.hasManualTOC()) {
      this.generateTOC();
    } else {
      this.links = this.navList.querySelectorAll('a[href^="#"]');
    }

    // Если нет ссылок - выходим
    if (this.links.length === 0) {
      console.warn("TableOfContents: Не найдены ссылки в оглавлении");
      return;
    }

    // Настройка секций и отслеживания
    this.setupSections();
    this.setupIntersectionObserver();
    this.setupClickHandlers();

    // console.log(
    // 	`TableOfContents: Инициализировано ${this.sections.length} секций`
    // );
  }

  /**
   * Проверяет, есть ли уже созданное вручную оглавление
   */
  hasManualTOC() {
    return this.navList.children.length > 0;
  }

  /**
   * Автоматическая генерация оглавления
   */
  generateTOC() {
    // console.log("TableOfContents: Запуск автоматической генерации...");

    const headings = document.querySelectorAll(this.options.selector);
    if (headings.length === 0) {
      console.warn("TableOfContents: Не найдены заголовки для генерации");
      return;
    }

    // Сортируем заголовки
    const sortedHeadings = this.sortHeadings(Array.from(headings));

    // Строим структуру
    this.buildTOCStructure(sortedHeadings);

    // Рендерим HTML
    this.renderTOC();

    // Получаем ссылки
    this.links = this.navList.querySelectorAll('a[href^="#"]');

    // console.log(
    // 	`TableOfContents: Сгенерировано ${this.links.length} ссылок`
    // );
  }

  /**
   * Сортировка заголовков по ID
   */
  sortHeadings(headings) {
    return headings.sort((a, b) => {
      const idA = a.id;
      const idB = b.id;

      // Разбираем ID типа "a1", "a2-1", "a2-2", "a3"
      const partsA = idA.split("-").map((part) => part.replace("a", ""));
      const partsB = idB.split("-").map((part) => part.replace("a", ""));

      // Сравниваем по уровням вложенности
      for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
        const numA = parseInt(partsA[i] || 0);
        const numB = parseInt(partsB[i] || 0);

        if (numA !== numB) {
          return numA - numB;
        }
      }

      return 0;
    });
  }

  /**
   * Построение структуры оглавления
   */
  buildTOCStructure(headings) {
    const root = { level: 0, children: [] };
    const stack = [root];

    headings.forEach((heading) => {
      const id = heading.id;
      const level = this.getHeadingLevel(id);
      const text = this.getHeadingText(heading);

      const node = {
        id,
        text,
        level,
        children: [],
      };

      // Находим правильного родителя
      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      // Добавляем к родителю
      const parent = stack[stack.length - 1];
      parent.children.push(node);
      stack.push(node);

      this.tocData.push(node);
    });
  }

  /**
   * Определение уровня заголовка по ID
   */
  getHeadingLevel(id) {
    const parts = id.split("-");
    if (parts.length === 1) return 1;
    return 2;
  }

  /**
   * Получение текста заголовка
   */
  getHeadingText(heading) {
    return heading.textContent.trim();
  }

  /**
   * Рендеринг HTML оглавления
   */
  renderTOC() {
    this.navList.innerHTML = "";

    const renderNode = (node) => {
      const li = document.createElement("li");

      // Создаем ссылку
      const link = document.createElement("a");
      link.href = `#${node.id}`;
      link.textContent = node.text;
      link.className = "hover-underline";

      li.appendChild(link);

      // Если есть вложенные элементы
      if (node.children && node.children.length > 0) {
        const subList = document.createElement("ul");
        node.children.forEach((child) => {
          subList.appendChild(renderNode(child));
        });
        li.appendChild(subList);
      }

      return li;
    };

    // Рендерим корневые элементы (уровень 1)
    this.tocData
      .filter((item) => item.level === 1)
      .forEach((item) => {
        this.navList.appendChild(renderNode(item));
      });
  }

  /**
   * Настройка секций для отслеживания
   */
  setupSections() {
    this.links.forEach((link) => {
      const id = link.getAttribute("href").substring(1);
      const section = document.getElementById(id);

      if (section) {
        this.sections.push({
          id,
          link,
          element: section,
          isVisible: false,
        });
      } else {
        console.warn(`TableOfContents: Не найден элемент с id="${id}"`);
      }
    });
  }

  /**
   * Настройка Intersection Observer
   */
  setupIntersectionObserver() {
    if (this.sections.length === 0) {
      console.warn("TableOfContents: Нет секций для отслеживания");
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: this.options.rootMargin,
      threshold: this.calculateThresholds(),
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        const section = this.sections.find((s) => s.id === id);

        if (!section) return;

        // Обновляем состояние видимости
        section.isVisible = entry.isIntersecting;
        section.intersectionRatio = entry.intersectionRatio;

        // Добавляем/удаляем из видимых секций
        if (entry.isIntersecting) {
          this.visibleSections.add(id);
        } else {
          this.visibleSections.delete(id);
        }
      });

      // Обновляем подсветку согласно выбранной стратегии
      this.updateActiveLinks();
    }, observerOptions);

    // Начинаем наблюдение
    this.sections.forEach((section) => {
      this.observer.observe(section.element);
    });
  }

  /**
   * Расчет порогов для Intersection Observer
   */
  calculateThresholds() {
    if (this.options.highlightAll) {
      // Несколько порогов для точного отслеживания
      return [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
    }
    return 0; // Только факт пересечения
  }

  /**
   * Обновление активных ссылок
   */
  updateActiveLinks() {
    // Сбрасываем все активные классы
    this.links.forEach((link) => link.classList.remove("active"));

    // Применяем выбранную стратегию подсветки
    switch (this.options.highlightStrategy) {
      case "multiple":
        this.highlightMultiple();
        break;
      case "closest":
        this.highlightClosest();
        break;
      case "first":
        this.highlightFirstVisible();
        break;
      default:
        this.highlightMultiple();
    }

    // Прокручиваем навигацию к активным элементам
    this.scrollToVisibleInNav();
  }

  /**
   * Подсветка всех видимых секций
   */
  highlightMultiple() {
    this.visibleSections.forEach((id) => {
      const section = this.sections.find((s) => s.id === id);
      if (section && section.intersectionRatio > 0.1) {
        section.link.classList.add("active");
      }
    });
  }

  /**
   * Подсветка ближайшей к центру секции
   */
  highlightClosest() {
    let closestSection = null;
    let minDistance = Infinity;

    this.sections.forEach((section) => {
      if (section.isVisible) {
        const rect = section.element.getBoundingClientRect();
        const viewportCenter = window.innerHeight / 2;
        const elementCenter = rect.top + rect.height / 2;
        const distance = Math.abs(elementCenter - viewportCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestSection = section;
        }
      }
    });

    if (closestSection) {
      closestSection.link.classList.add("active");
    }
  }

  /**
   * Подсветка первой видимой секции
   */
  highlightFirstVisible() {
    // Находим первую секцию, которая видна
    const firstVisible = this.sections.find((s) => s.isVisible);
    if (firstVisible) {
      firstVisible.link.classList.add("active");
    }
  }

  /**
   * Прокрутка навигации к видимым элементам
   */
  scrollToVisibleInNav() {
    const firstVisible = this.sections.find((s) => s.isVisible);
    if (firstVisible) {
      const linkRect = firstVisible.link.getBoundingClientRect();
      const navRect = this.navList.getBoundingClientRect();

      // Если ссылка не видна в навигации - прокручиваем
      if (linkRect.top < navRect.top || linkRect.bottom > navRect.bottom) {
        firstVisible.link.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }

  /**
   * Настройка обработчиков кликов
   */
  setupClickHandlers() {
    this.links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href");
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          // Используем scroll-margin-top из CSS или настройки
          const scrollMargin =
            parseInt(window.getComputedStyle(targetElement).scrollMarginTop) ||
            this.options.scrollOffset;

          window.scrollTo({
            top: targetElement.offsetTop - scrollMargin,
            behavior: "smooth",
          });

          // Обновляем URL
          history.pushState(null, null, targetId);
        }
      });
    });
  }

  /**
   * Получение информации о текущем состоянии
   */
  getState() {
    return {
      totalSections: this.sections.length,
      visibleSections: Array.from(this.visibleSections),
      links: this.links.length,
      options: this.options,
    };
  }

  /**
   * Обновление настроек
   */
  updateOptions(newOptions) {
    this.options = { ...this.options, ...newOptions };

    // Пересоздаем observer если изменились настройки отслеживания
    if (this.observer && (newOptions.rootMargin || newOptions.highlightAll)) {
      this.sections.forEach((section) => {
        this.observer.unobserve(section.element);
      });
      this.setupIntersectionObserver();
    }
  }

  /**
   * Уничтожение экземпляра
   */
  destroy() {
    if (this.observer) {
      this.sections.forEach((section) => {
        this.observer.unobserve(section.element);
      });
    }

    // Удаляем обработчики событий
    this.links.forEach((link) => {
      const newLink = link.cloneNode(true);
      link.parentNode.replaceChild(newLink, link);
    });

    console.log("TableOfContents: Экземпляр уничтожен");
  }
}

// Автоматическая инициализация при загрузке страницы
const articleNavInit = () => {
  // Определяем настройки на основе data-атрибутов
  const autoGenerate = articleNav.dataset.autoGenerate === "true";
  const highlightAll = articleNav.dataset.highlightAll !== "false";
  const highlightStrategy = articleNav.dataset.highlightStrategy || "multiple";
  const rootMargin = articleNav.dataset.rootMargin || "-10% 0px -70% 0px";

  // Создаем экземпляр с настройками
  window.articleTOC = new TableOfContents({
    autoGenerate,
    highlightAll,
    highlightStrategy,
    rootMargin,
    scrollOffset: 100,
  });
};

// Экспорт для использования в модулях
if (typeof module !== "undefined" && module.exports) {
  module.exports = TableOfContents;
}

// Автоматическая генерация
// data-auto-generate="true" (true/false)

// Подсветка нескольких ссылок одновременно
// data-highlight-strategy="multiple" (можно не указывать)
// data-highlight-all="true" (true/false)

// Собственный root-margin observer
// data-root-margin="-15% 0px -65% 0px"

// office-viewer
const officeImage = (elem) => {
  let link = elem.querySelector("img").getAttribute("src"),
    modal = document.getElementById("photo-view"),
    img = modal?.querySelector("img");

  img.setAttribute("src", link);
};

// check url for seo-audit (серверная версия + PageSpeed)
const seoAuditInit = () => {
  const API_KEY = "AIzaSyD80rX_LE4YFfFB7uGRucxxZFCZ0j2IBDI";
  const form = document.getElementById("audit-form");
  if (!form) return;

  const isAjax = form.getAttribute("data-ajax") !== "false";

  const inputs = form.querySelectorAll("input, button");
  const urlInput = document.getElementById("site-url");
  const loader = document.getElementById("audit-loader");
  const errorDiv = document.getElementById("audit-error");
  const resultsContainer = document.getElementById("audit-results");
  const resultsGrid = resultsContainer?.querySelector("#audit-cards");
  const seoAuditFeatures = document.getElementById("seo-audit-features");

  const setFormDisabled = (disabled) => {
    inputs.forEach((i) => {
      if (i.disabled !== undefined) i.disabled = disabled;
    });
  };

  const normalizeAndValidateUrl = () => {
    let url = urlInput.value.trim();
    if (!url) {
      errorDiv.textContent = "Введите адрес сайта";
      errorDiv.style.display = "block";
      return null;
    }
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    try {
      new URL(url);
      return url;
    } catch (_) {
      errorDiv.textContent = "Некорректный адрес сайта.";
      errorDiv.style.display = "block";
      return null;
    }
  };

  // --------------------------------------------------------------
  // AJAX-рендеринг (data-ajax="true" или отсутствует)
  // --------------------------------------------------------------
  const handleAjaxRender = async (submitBtn, url) => {
    resultsContainer.style.display = "none";
    errorDiv.style.display = "none";
    if (resultsGrid) resultsGrid.innerHTML = "";
    setFormDisabled(true);
    loader.style.display = "block";

    let seoData = null;
    let lighthouseData = null;

    try {
      const seoResponse = await fetch("/submit/get-seo-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url }),
      });
      const seoResult = await seoResponse.json();
      if (!seoResult.success)
        throw new Error(seoResult.error || "Ошибка получения SEO-данных");
      seoData = seoResult.data;

      const pagespeedUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${API_KEY}&strategy=mobile`;
      const psResponse = await fetch(pagespeedUrl);
      if (!psResponse.ok)
        throw new Error(`PageSpeed API error: ${psResponse.status}`);
      lighthouseData = await psResponse.json();

      const audits = lighthouseData.lighthouseResult?.audits || {};
      const categories = lighthouseData.lighthouseResult?.categories || {};

      const getStatus = (score, thresholds = { good: 0.9, warn: 0.5 }) => {
        if (score === null || score === undefined)
          return { status: "warning", text: "" };
        if (score >= thresholds.good) return { status: "good", text: "" };
        if (score >= thresholds.warn) return { status: "warning", text: "" };
        return { status: "error", text: "" };
      };

      // ----- Индексация -----
      const crawlScore = audits["is-crawlable"]?.score;
      const crawlStatus = getStatus(crawlScore);
      let indexingText = "";
      if (crawlStatus.status === "good")
        indexingText = "Все важные страницы в индексе";
      else if (crawlStatus.status === "error")
        indexingText = "Сайт не индексируется";
      else indexingText = "Часть важных страниц отсутствует в индексе";
      const indexing = {
        category: "indexing",
        title: "Индексация страниц",
        status: { status: crawlStatus.status, text: indexingText },
        desc: "Проверка доступности страниц для поисковых роботов",
      };

      // ----- Скорость загрузки -----
      const perfScore = categories.performance?.score;
      const perfStatus = getStatus(perfScore, { good: 0.9, warn: 0.5 });
      let speedText = "";
      if (perfStatus.status === "good") speedText = "Сайт загружается быстро";
      else if (perfStatus.status === "error")
        speedText =
          "Сайт загружается медленно, особенно на мобильных устройствах";
      else speedText = "Скорость загрузки можно улучшить";
      const speed = {
        category: "speed",
        title: "Скорость загрузки",
        status: { status: perfStatus.status, text: speedText },
        desc: "Общая производительность по Core Web Vitals",
      };

      // ----- Мета-теги -----
      const titleOk = seoData.title && seoData.title.trim() !== "";
      const descOk = seoData.description && seoData.description.trim() !== "";
      let metaStatus = {
        status: "warning",
        text: "У части страниц отсутствуют title и description",
      };
      if (titleOk && descOk)
        metaStatus = {
          status: "good",
          text: "Title и meta-description заполнены",
        };
      else if (!titleOk && !descOk)
        metaStatus = {
          status: "error",
          text: "Отсутствуют title и description",
        };
      const metaTags = {
        category: "meta",
        title: "Мета-теги",
        status: metaStatus,
        desc: "Корректность заполнения тегов title и meta-description",
      };

      // ----- Мобильная версия -----
      const vpScore = audits["viewport"]?.score;
      const cwScore = audits["content-width"]?.score;
      let mobileText = "",
        mobileStat = "warning";
      if (vpScore === 1 && cwScore === 1) {
        mobileStat = "good";
        mobileText = "Сайт адаптирован, но есть зоны для улучшения UX";
      } else if (vpScore === 0 || cwScore === 0) {
        mobileStat = "error";
        mobileText = "Сайт не адаптирован для мобильных";
      } else mobileText = "Адаптация требует улучшения";
      const mobile = {
        category: "mobile",
        title: "Мобильная версия",
        status: { status: mobileStat, text: mobileText },
        desc: "Проверка viewport и корректности контента на мобильных",
      };

      // ----- Контент -----
      const h1Ok = seoData.h1 && seoData.h1.trim() !== "";
      const h2Count = seoData.h2 ? seoData.h2.length : 0;
      const wordCount = seoData.wordCount || 0;
      const kwOk = seoData.keywords && seoData.keywords.trim() !== "";
      let contentStatus = {
        status: "warning",
        text: "Контент недостаточно раскрывает часть поисковых запросов",
      };
      if (h1Ok && h2Count >= 1 && wordCount > 300 && kwOk)
        contentStatus = {
          status: "good",
          text: "Контент отличный: заголовки, объём и ключевые слова в порядке",
        };
      else if (!h1Ok || wordCount < 100)
        contentStatus = {
          status: "error",
          text: "Критические проблемы с контентом (отсутствие H1 или слишком мало текста)",
        };
      const contentDesc = `H1: ${h1Ok ? "присутствует" : "отсутствует"}, H2: ${h2Count} шт., слов: ${wordCount}, ключевые слова: ${kwOk ? "заданы" : "не заданы"}`;
      const content = {
        category: "content",
        title: "Контент и релевантность",
        status: contentStatus,
        desc: contentDesc,
      };

      // ----- Технические ошибки -----
      const errorsScore = audits["errors-in-console"]?.score;
      let errorsText = "",
        errorsStat = "error";
      if (errorsScore === 1) {
        errorsStat = "good";
        errorsText = "Технических ошибок не найдено";
      } else errorsText = "Найдены битые ссылки и ошибки 404";
      const techErrors = {
        category: "errors",
        title: "Технические ошибки",
        status: { status: errorsStat, text: errorsText },
        desc: "Наличие ошибок JavaScript и проблем рендеринга",
      };

      // ----- Перелинковка -----
      const linkScore = audits["link-text"]?.score;
      const linkStatus = getStatus(linkScore, { good: 0.9, warn: 0.5 });
      let linkText = "";
      if (linkStatus.status === "good") linkText = "Хорошая структура ссылок";
      else if (linkStatus.status === "error")
        linkText = "Нужно усилить связь между ключевыми страницами";
      else linkText = "Перелинковку можно улучшить";
      const internalLinks = {
        category: "links",
        title: "Внутренняя перелинковка",
        status: { status: linkStatus.status, text: linkText },
        desc: "Описательность текстов внутренних ссылок",
      };

      // ----- HTTPS -----
      let sslOk = !!seoData.ssl;
      if (!sslOk && audits["is-on-https"]?.score === 1) sslOk = true;
      const security = {
        category: "security",
        title: "Безопасность / HTTPS",
        status: sslOk
          ? {
              status: "good",
              text: "SSL подключен, критичных проблем не найдено",
            }
          : { status: "error", text: "SSL не подключен или ошибки" },
        desc: "Наличие и корректность SSL-сертификата",
      };

      const metrics = [
        indexing,
        speed,
        metaTags,
        mobile,
        content,
        techErrors,
        internalLinks,
        security,
      ];
      const renderAuditCards = (metrics) => {
        if (!resultsGrid) return;
        resultsGrid.innerHTML = "";
        metrics.forEach((metric) => {
          const card = document.createElement("div");
          card.className = `card card--icon ${metric.status.status}`;
          const statusText =
            metric.status.status === "good"
              ? "Хорошо"
              : metric.status.status === "warning"
                ? "Предупреждение"
                : "Ошибка";
          card.innerHTML = `<img src="/src/icons/metric-${metric.category}.svg" alt="icon"><b>${metric.title}</b><div class="badge mb-16 ${metric.status.status}">${statusText}</div><p>${metric.desc}</p>`;
          resultsGrid.appendChild(card);
        });
      };
      renderAuditCards(metrics);
      resultsContainer.style.display = "block";
      showFormFeedback(submitBtn, "Проверка завершена", "success");
    } catch (err) {
      console.error(err);
      errorDiv.textContent = "Не удалось выполнить проверку. Попробуйте позже.";
      errorDiv.style.display = "block";
      showFormFeedback(submitBtn, "Не удалось выполнить проверку", "error");
    } finally {
      if (seoAuditFeatures) seoAuditFeatures.style.display = "";
      loader.style.display = "none";
      setFormDisabled(false);
      setTimeout(
        () =>
          resultsContainer?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
        600,
      );
    }
  };

  // --------------------------------------------------------------
  // Режим обычной отправки (data-ajax="false") – редирект без AJAX
  // --------------------------------------------------------------
  const handleStandardRedirect = (submitBtn, url) => {
    // Блокируем поля и показываем спиннер
    setFormDisabled(true);
    showButtonLoader(submitBtn);
    // Перенаправляем на GET-версию экшена с параметром site
    window.location.href = `/submit/express-seo-audit?site=${encodeURIComponent(url)}`;
  };

  // --------------------------------------------------------------
  // Основной обработчик
  // --------------------------------------------------------------
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector(
      'button[type="submit"], input[type="submit"]',
    );
    const url = normalizeAndValidateUrl();
    if (!url) {
      if (submitBtn) hideButtonLoader(submitBtn);
      return;
    }
    urlInput.value = url;

    if (isAjax) {
      handleAjaxRender(submitBtn, url);
    } else {
      handleStandardRedirect(submitBtn, url);
    }
  });
};

// domain checker
const domainCheker = () => {
  const form = document.getElementById("test-site-form");
  const inputs = form.querySelectorAll("input, button");
  const domainInput = document.getElementById("domain-name-input");
  const resultDiv = document.getElementById("domain-result");
  const loaderDiv = document.getElementById("domain-loader");
  const errorDiv = document.getElementById("domain-error");

  // Обработчик отправки формы
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitBtn = form.querySelector(
      'button[type="submit"], input[type="submit"]',
    );
    showButtonLoader(submitBtn);

    let domain = domainInput.value.trim();
    if (!domain) {
      errorDiv.textContent = "Пожалуйста, введите домен";
      errorDiv.style.display = "block";
      resultDiv.style.display = "none";
      loaderDiv.style.display = "none";
      showFormFeedback(submitBtn, "Введите домен", "error");
      return;
    }

    // Блокируем поля формы на время проверки
    inputs.forEach((input) => {
      input.disabled = true;
    });

    resultDiv.style.display = "none";
    errorDiv.style.display = "none";
    loaderDiv.style.display = "block";

    try {
      const csrfParam =
        document
          .querySelector('meta[name="csrf-param"]')
          ?.getAttribute("content") || "_csrf";
      const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content");

      const body = new URLSearchParams();
      body.append(csrfParam, csrfToken);
      body.append("domain", domain);

      // Отправляем POST-запрос на серверный экшен /submit/domain
      const response = await fetch(form.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      if (!response.ok) {
        throw new Error(`Сервер ответил с кодом ${response.status}`);
      }

      const data = await response.json();

      // Вставляем готовую HTML-разметку от сервера
      resultDiv.innerHTML = data.text;
      resultDiv.style.display = "block";

      showFormFeedback(submitBtn, "Проверка завершена", "success");
    } catch (err) {
      console.error(err);
      errorDiv.textContent = "Не удалось проверить домен. Попробуйте позже.";
      errorDiv.style.display = "block";
      showFormFeedback(submitBtn, "Не удалось выполнить проверку", "error");
    } finally {
      if (selects) {
        let customSelect = niceSelectJS("select", {
          activeMobile: true,
        });

        initSelectBindings();
        initSelectTooltips();
      }

      setTimeout(() => {
        resultDiv.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 600);

      loaderDiv.style.display = "none";
      inputs.forEach((input) => {
        input.disabled = false;
      });
    }
  });
};

// Функция обновления тултипов (fallback, если глобальная не определена)
function updateTooltipsForSelectFallback(select) {
  let prefix = select.getAttribute("data-tooltip-prefix");
  if (!prefix) {
    const id = select.id;
    if (id && id.endsWith("-select")) {
      prefix = id.slice(0, -7);
    } else {
      const container = select.closest(".toggle-line, .nice-wrapper");
      if (container) {
        const tooltips = container.querySelectorAll(".tooltip");
        tooltips.forEach((t) => t.classList.add("hidden"));
        const idx = select.selectedIndex;
        if (idx >= 0 && idx < tooltips.length) {
          tooltips[idx].classList.remove("hidden");
        }
      }
      return;
    }
  }
  const tooltips = [];
  for (let i = 1; ; i++) {
    const tip = document.getElementById(`${prefix}-${i}`);
    if (!tip) break;
    tooltips.push(tip);
  }
  tooltips.forEach((t) => t.classList.add("hidden"));
  const idx = select.selectedIndex;
  if (idx >= 0 && idx < tooltips.length) {
    tooltips[idx].classList.remove("hidden");
  }
}

// 1. Привязка input к select
function initSelectBindings() {
  const bindings = document.querySelectorAll("[data-select-target]");
  bindings.forEach((trigger) => {
    trigger.removeEventListener("change", handleBindingChange);
    trigger.addEventListener("change", handleBindingChange);

    const targetSelectId = trigger.getAttribute("data-select-target");
    const targetSelect = targetSelectId
      ? document.getElementById(targetSelectId)
      : null;
    if (targetSelect && targetSelect.tagName === "SELECT") {
      if (trigger.checked) {
        // принудительно синхронизируем отмеченный чекбокс
        handleBindingChange({ currentTarget: trigger });
      } else {
        targetSelect.disabled = true;
        syncNiceSelectDisabled(targetSelect); // синхронизируем disabled
      }
    }
  });
}

function handleBindingChange(e) {
  const trigger = e.currentTarget;
  const targetSelectId = trigger.getAttribute("data-select-target");
  if (!targetSelectId) return;
  const targetSelect = document.getElementById(targetSelectId);
  if (!targetSelect || targetSelect.tagName !== "SELECT") return;

  if (trigger.checked) {
    targetSelect.disabled = false;
    syncNiceSelectDisabled(targetSelect); // обновляем кастомный селект
    let index = trigger.getAttribute("data-select-option-index");
    if (index !== null) {
      index = parseInt(index, 10);
      if (!isNaN(index) && index >= 0 && index < targetSelect.options.length) {
        targetSelect.selectedIndex = index;
        targetSelect.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
  } else {
    targetSelect.disabled = true;
    syncNiceSelectDisabled(targetSelect); // обновляем кастомный селект
    const resetOnUncheck =
      trigger.getAttribute("data-reset-on-uncheck") === "true";
    if (resetOnUncheck) {
      targetSelect.selectedIndex = -1;
      targetSelect.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }
}

// 2. Автообновление тултипов при изменении select
function initSelectTooltips() {
  const selects = document.querySelectorAll("select");
  selects.forEach((select) => {
    select.removeEventListener("change", handleSelectChange);
    select.addEventListener("change", handleSelectChange);
    // сразу обновим текущее состояние
    handleSelectChange({ currentTarget: select });
  });
}

function handleSelectChange(e) {
  const select = e.currentTarget;

  // 1. Обновляем тултипы
  if (typeof window.updateTooltipsForSelect === "function") {
    window.updateTooltipsForSelect(select);
  } else {
    updateTooltipsForSelectFallback(select);
  }

  // 2. Обновляем кастомный селект (nice-select)
  const niceSelect = select.nextElementSibling?.classList.contains(
    "nice-select",
  )
    ? select.nextElementSibling
    : null;
  if (!niceSelect) return;

  // Обновляем текст кнопки
  const currentSpan = niceSelect.querySelector(".current");
  if (currentSpan) {
    const selectedOption = select.options[select.selectedIndex];
    currentSpan.textContent = selectedOption
      ? selectedOption.textContent
      : select.getAttribute("data-display") || "Выберите...";
  }

  // Обновляем классы "selected" у пунктов списка
  const items = niceSelect.querySelectorAll(".list .option");
  items.forEach((item, idx) => {
    if (idx === select.selectedIndex) {
      item.classList.add("selected");
      // Также можно добавить aria-selected для доступности
      item.setAttribute("aria-selected", "true");
    } else {
      item.classList.remove("selected");
      item.removeAttribute("aria-selected");
    }
  });
}

// Синхронизация состояния disabled между оригинальным select и кастомным .nice-select
function syncNiceSelectDisabled(selectEl) {
  const niceSelect = selectEl.nextElementSibling?.classList.contains(
    "nice-select",
  )
    ? selectEl.nextElementSibling
    : null;
  if (niceSelect) {
    if (selectEl.disabled) {
      niceSelect.classList.add("disabled");
      niceSelect.setAttribute("tabindex", "-1");
    } else {
      niceSelect.classList.remove("disabled");
      niceSelect.setAttribute("tabindex", "0");
    }
  }
}

// Синхронизация связей между табами и селектами
function initTabsToSelect(root = document) {
  root.querySelectorAll("[data-tabs-to-select]").forEach((component) => {
    if (component.dataset.tabsToSelectInited === "true") return;
    component.dataset.tabsToSelectInited = "true";

    const select = component.querySelector(".nice-select");
    const current = select?.querySelector(".current");
    const options = [
      ...component.querySelectorAll("[data-tabs-buttons] .option[for]"),
    ];
    const radios = [
      ...component.querySelectorAll('.nav-tabs input[type="radio"][id]'),
    ];

    if (!select || !current || !options.length || !radios.length) return;

    const setTooltipByRadio = (radio) => {
      const selectWrapper = component.querySelector("[data-tabs-buttons]");
      const options = [
        ...component.querySelectorAll("[data-tabs-buttons] .option[for]"),
      ];

      if (!selectWrapper || !radio) return;

      const option = options.find(
        (item) => item.getAttribute("for") === radio.id,
      );
      const value = option?.dataset.value;

      selectWrapper.querySelectorAll(".tooltip[id]").forEach((tooltip) => {
        tooltip.classList.add("hidden");
      });

      if (!value) return;

      selectWrapper
        .querySelector(`#${CSS.escape(selectWrapper.id)}-${CSS.escape(value)}`)
        ?.classList.remove("hidden");
    };

    const setSelectByRadio = (radio) => {
      if (!radio) return;

      const option = options.find(
        (item) => item.getAttribute("for") === radio.id,
      );
      if (!option) return;

      options.forEach((item) => {
        item.classList.toggle("selected", item === option);
        item.setAttribute("aria-selected", item === option ? "true" : "false");
      });

      current.textContent = option.textContent.trim();
      setTooltipByRadio(radio);
    };

    const setRadioByOption = (option) => {
      const radioId = option.getAttribute("for");
      const radio = component.querySelector(`#${CSS.escape(radioId)}`);

      if (!radio) return;

      radio.checked = true;
      radio.dispatchEvent(new Event("change", { bubbles: true }));
      setSelectByRadio(radio);
    };

    options.forEach((option) => {
      option.addEventListener("click", () => {
        setRadioByOption(option);
      });
    });

    radios.forEach((radio) => {
      radio.addEventListener("change", () => {
        if (radio.checked) setSelectByRadio(radio);
      });
    });

    const checkedRadio = radios.find((radio) => radio.checked);
    const selectedOption = options.find((option) =>
      option.classList.contains("selected"),
    );

    

    if (checkedRadio) {
      setSelectByRadio(checkedRadio);
    } else if (selectedOption) {
      setRadioByOption(selectedOption);
    } else {
      radios[0].checked = true;
      setSelectByRadio(radios[0]);
    }
  });
}

window.syncTabsToSelect = function (root = document) {
  root.querySelectorAll("[data-tabs-to-select]").forEach((component) => {
    const current = component.querySelector(".nice-select .current");
    const options = [
      ...component.querySelectorAll("[data-tabs-buttons] .option[for]"),
    ];
    const checkedRadio = component.querySelector(
      '.nav-tabs input[type="radio"]:checked',
    );

    if (!current || !checkedRadio) return;

    const option = options.find(
      (item) => item.getAttribute("for") === checkedRadio.id,
    );
    if (!option) return;

    options.forEach((item) => {
      const isActive = item === option;
      item.classList.toggle("selected", isActive);
      item.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    current.textContent = option.textContent.trim();
  });
};

// JS tabs for main/AI sections
const initMainAiTabs = (root = document) => {
  const tabSections = root.querySelectorAll(".tabs.isMain, .tabs.isAi");
  if (!tabSections.length) return;

  const mobileMedia = window.matchMedia("(max-width: 439.98px)");

  const refreshNestedSliders = (container) => {
    if (!container) return;

    setTimeout(() => {
      container.querySelectorAll("[data-slider]").forEach((slider) => {
        delete slider.dataset.initialized;
      });

      if (typeof sliderInitialize === "function") {
        sliderInitialize();
      }
    }, 50);
  };

  tabSections.forEach((tabs) => {
    if (tabs.dataset.mainAiTabsInited === "true") return;
    tabs.dataset.mainAiTabsInited = "true";

    const desktopControls = [
      ...tabs.querySelectorAll('.tabs-buttons .tab-button input[type="radio"]'),
    ];
    const mobileControls = [
      ...tabs.querySelectorAll('.tabs-content .tab-button.mobile input[type="checkbox"]'),
    ];
    const contents = [
      ...tabs.querySelectorAll(":scope > .tabs-content > .tab-content"),
    ];

    if (!contents.length) return;

    const setContentState = (content, isActive) => {
      if (!content) return;
      content.classList.toggle("active", isActive);
      content.setAttribute("aria-hidden", String(!isActive));
    };

    const syncDesktopTab = (activeIndex) => {
      contents.forEach((content, index) => {
        setContentState(content, index === activeIndex);
      });

      mobileControls.forEach((control, index) => {
        control.checked = index === activeIndex;
      });

      refreshNestedSliders(contents[activeIndex]);
    };

    const syncMobileAccordion = () => {
      mobileControls.forEach((control, index) => {
        setContentState(contents[index], control.checked);
      });

      const firstActiveIndex = mobileControls.findIndex((control) => control.checked);
      if (firstActiveIndex !== -1) {
        desktopControls.forEach((control, index) => {
          control.checked = index === firstActiveIndex;
        });
        refreshNestedSliders(contents[firstActiveIndex]);
      }
    };

    const applyCurrentMode = () => {
      if (mobileMedia.matches) {
        syncMobileAccordion();
        return;
      }

      const checkedIndex = desktopControls.findIndex((control) => control.checked);
      syncDesktopTab(checkedIndex === -1 ? 0 : checkedIndex);
    };

    desktopControls.forEach((control, index) => {
      control.addEventListener("change", () => {
        if (!control.checked) return;
        syncDesktopTab(index);
      });
    });

    mobileControls.forEach((control) => {
      control.addEventListener("change", () => {
        syncMobileAccordion();
      });
    });

    if (typeof mobileMedia.addEventListener === "function") {
      mobileMedia.addEventListener("change", applyCurrentMode);
    } else if (typeof mobileMedia.addListener === "function") {
      mobileMedia.addListener(applyCurrentMode);
    }

    applyCurrentMode();
  });
};

// scroll events
window.addEventListener("scroll", pageIsScrolled, { passive: true });

// resize events
window.addEventListener(
  "resize",
  () => {
    handleResize();
  },
  { passive: true },
);

// DOMContentLoaded events
document.addEventListener("DOMContentLoaded", () => {
  if (selects) {
    let customSelect = niceSelectJS("select", {
      activeMobile: true,
    });
  }

  setTimeout(() => {
    preloader.remove();
  }, 3000);

  pageIsScrolled();
  initDropdowns();
  if (footer) moveServiceLinks();
  moveAchievementsSlider();

  if (mockup) updateMockupPlace();
  initPopups();
  if (mapLinks) mapLinksInit();

  textarea_autosize.init();
  sitePreview();
  casesToggleTabs();
  if (techLists) techListInit();
  incrementNumbersInit();
  if (tenderTables) tenderTablesInit();

  if (document.getElementById("gallery-popup")) gallerySelector();
  resetTotalState();

  if (articleNav) articleNavInit();

  tooltipEvents();

  // slider
  tabSlidersStart();
  SliderInIt();
  sliderInitialize();

  if (reviewsContainer) reviewsInit();

  if (webShopDiagram) webShopDiagramHandler();
  if (tenderDiagram) tenderDiagramHandler();

  if (document.getElementById("audit-form")) seoAuditInit();
  if (document.getElementById("test-site-form")) domainCheker();

  // photo cards
  if (photoCards.length > 0) {
    photoCards.forEach((item) => {
      item.addEventListener("click", (e) => {
        openPopup("photo-view");
        officeImage(e.currentTarget);
      });
    });
  }

  // files init
  if (fileInputs) {
    fileInputs.forEach((input) => {
      if (!input.fileInputManager) {
        input.fileInputManager = new FileInputManager(input);
      }
    });
  }

  // Инициализация триггеров остается без изменений
  if (triggerButtons) {
    triggerButtons?.forEach((button) => {
      button?.addEventListener("click", (e) => {
        toggleSection(e, true);

        let calculatorWrapper = document?.querySelector(".calculator-wrapper"),
          wrapperRight = calculatorWrapper?.querySelector(".right"),
          calculator = calculatorWrapper?.querySelector(
            ".calculator-calculator",
          );

        if (
          !(
            calculatorWrapper?.classList.contains("active") ||
            button.dataset.triggerHide === "choose_your_way"
          )
        ) {
          setTimeout(() => {
            wrapperRight?.classList.add("active");
          }, 100);
        }

        if (calculator?.classList.contains("show")) {
          setTimeout(() => {
            calculatorWrapper?.classList.add("active");
          }, 100);
        }
      });
    });
  }

  // Управление состоянием блока итоговой стоимости сайта
  if (totalSwitchButtons) {
    totalSwitchButtons?.forEach((button) => {
      button?.addEventListener("click", (e) => {
        const state = e.currentTarget.dataset.totalSwitch;

        setTotalState(state);
      });
    });
  }

  initTabsToSelect();
});

// Запускаем инициализацию после полной загрузки DOM
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initSelectBindings();
    initSelectTooltips();
    initMainAiTabs();
  });
} else {
  initSelectBindings();
  initSelectTooltips();
  initMainAiTabs();
}

// Предотвращаем открытие disabled кастомного селекта
document.addEventListener(
  "click",
  function (e) {
    const niceSelect = e.target.closest(".nice-select");
    if (niceSelect && niceSelect.classList.contains("disabled")) {
      e.preventDefault();
      e.stopPropagation();
      if (niceSelect.classList.contains("open")) {
        niceSelect.classList.remove("open");
      }
      return false;
    }
  },
  true,
);

// pjax events
document.addEventListener("pjax:end", () => {
  initTabsToSelect();
  initMainAiTabs();
});
