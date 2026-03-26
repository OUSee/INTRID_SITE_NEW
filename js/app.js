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
	if (preloader) {
		if (window.location.pathname == "/") {
			setTimeout(() => {
				preloader.style.display = "none";
			}, 3000);
		} else {
			preloader.style.display = "none";
		}
		setTimeout(() => {
			preloader.remove();
		}, 3000);
	}
	// setTimeout(() => {
	// preloader.style.display = "none";
	// }, 3000);
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
	document
		.querySelector(".header-burger")
		.setAttribute("data-menu", "closed");
	mainMenu.classList.remove("open");
	document.documentElement.classList.remove("menu-open");
}

function initDropdowns() {
	const menuDropdowns = document.querySelectorAll(".menu-dropdown");
	let activeDropdown = null;

	// Обработчик для главных ссылок меню
	document
		.querySelectorAll(".menu-dropdown > a.menu-link")
		.forEach((link) => {
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
	const aboutPageSelector = document.querySelector(".main-section--about");
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

let resizeTimeout;
let resizeRunning = false;

function handleResize() {
	if (resizeRunning) return;

	clearTimeout(resizeTimeout);
	resizeTimeout = setTimeout(() => {
		resizeRunning = true;

		requestAnimationFrame(() => {
			updateMockupPlace();
			sliderInitialize();
			SliderInIt();
			resizeRunning = false;
		});
	}, 250);
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
	if (
		!popup.querySelector(".popup-close") &&
		typeof popup.id !== "undefined"
	) {
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

document.addEventListener("DOMContentLoaded", initPopups);

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
			if (
				typeof payload.data === "string" &&
				payload.data.trim() !== ""
			) {
				return payload.data;
			}

			if (Array.isArray(payload.data)) {
				const prepared = payload.data
					.map((item) =>
						typeof item === "string" ? item.trim() : "",
					)
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
			typeof message === "string" && message.trim() !== ""
				? message
				: fallback;

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
				if (
					e.target.tagName &&
					e.target.tagName.toLowerCase() !== "a"
				) {
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
		const formData = new FormData(form);

		return fetch(form.action, {
			method: "POST",
			body: formData,
			credentials: "same-origin",
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
					const errorMessage = extractMessage(
						parsedData,
						defaultErrorMessage,
					);
					throw new Error(errorMessage);
				}

				return parsedData;
			})
			.then((data) => {
				const isSuccess = Boolean(data && data.status);
				const message = extractMessage(
					data,
					isSuccess ? defaultSuccessMessage : defaultErrorMessage,
				);

				if (isSuccess) {
					closeFormPopup(form);
					form.reset();
					resetAutosizeTextareas(form);
				}

				showNotificationPopup(message, isSuccess ? "success" : "error");
				return data;
			})
			.catch((error) => {
				const message =
					error &&
					typeof error.message === "string" &&
					error.message.trim() !== ""
						? error.message
						: defaultErrorMessage;
				showNotificationPopup(message, "error");
			});
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
					grecaptcha.reset(formData.widgetId);
					grecaptcha.execute(formData.widgetId);
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
		const defaultSiteKey = "6LcHRVkUAAAAANL8BaZHbKeQ5gOJ47gXWgnfDcfX";
		const initializeRecaptcha = () => {
			recaptchaForms.forEach((item) => {
				if (item.initialized || typeof grecaptcha === "undefined") {
					return;
				}

				const sitekey =
					item.recaptchaContainer.dataset.sitekey &&
					item.recaptchaContainer.dataset.sitekey.length > 0
						? item.recaptchaContainer.dataset.sitekey
						: defaultSiteKey;

				const widgetId = grecaptcha.render(item.recaptchaContainer, {
					sitekey,
					size: item.recaptchaContainer.dataset.size || "invisible",
					callback: (token) => {
						item.recaptchaInput.value = token;

						submitAjaxForm(item.form).finally(() => {
							item.recaptchaInput.value = "";
							grecaptcha.reset(widgetId);
						});
					},
				});

				item.widgetId = widgetId;
				item.initialized = true;

				if (item.pendingSubmit) {
					item.pendingSubmit = false;
					grecaptcha.execute(widgetId);
				}
			});
		};

		if (typeof grecaptcha !== "undefined") {
			initializeRecaptcha();
		} else {
			const callbackName = "initAjaxFormRecaptcha";
			const previousCallback = window[callbackName];

			window[callbackName] = () => {
				if (typeof previousCallback === "function") {
					previousCallback();
				}
				initializeRecaptcha();
			};

			const scriptId = "google-recaptcha-script";
			if (!document.getElementById(scriptId)) {
				const script = document.createElement("script");
				script.id = scriptId;
				script.src =
					"https://www.google.com/recaptcha/api.js?onload=" +
					callbackName +
					"&render=explicit";
				script.async = true;
				script.defer = true;
				document.head.appendChild(script);
			}
		}
	}
});

// MAP LOGIC
document.addEventListener("DOMContentLoaded", () => {
	// console.log('=> map script started', )
	try {
		const mapLinks = document.querySelectorAll(".map-link");
		// console.log('=> links found', mapLinks)

		const mapData = {
			prague: {
				frame: '<iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3A596c110a6e67b7ecf53baf573cb97950916b7bfb81fe164b7ec895af9864ccb8&amp;source=constructor" width="835" height="516" frameborder="0"></iframe>',
				link: "https://yandex.ru/maps/-/CHvuzWlD",
				adress: "Poděbradská 52, 19000 Praha 9",
				phone: "420777749719",
				wa: "79518587172",
				tg: "lionvdv",
			},
			vrn: {
				frame: '<iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3Ade02f3d1f93ca59ddbc7669962c5e7f350cec0968beae8e096d86287b227d6b1&amp;source=constructor" width="674" height="534" frameborder="0"></iframe>',
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
			const map = document.querySelector("#map");

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
			whatsapp.setAttribute(
				"href",
				"https://wa.me/" + mapData[value]?.wa,
			);
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
				.querySelector(
					".card-body b, b, .card-header div span",
				).innerText;
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
					(slideIndex - 2 + originalSlides.length) %
					originalSlides.length;

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
		const lastClone =
			originalSlides[originalSlides.length - 1].cloneNode(true);
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
			// Используем requestAnimationFrame для безопасного доступа к свойствам DOM
			requestAnimationFrame(() => {
				const newIsHorizontal = window.innerWidth <= 600;
				if (newIsHorizontal !== isHorizontal) {
					isHorizontal = newIsHorizontal;
					slidesContainer.style.flexDirection = isHorizontal
						? "row"
						: "column";
					updateSlider(true); // Принудительное обновление без анимации
				}
			});
		};

		// Настройки автопрокрутки
		let isAutoScrollPaused = false;
		let autoScrollIntervalId = null;
		let isAnimating = false;

		// Функция обновления позиции слайдера
		function updateSlider(instant = false) {
			// Используем requestAnimationFrame для синхронизации с браузером
			requestAnimationFrame(() => {
				// Проверка на видимость элемента
				if (!slidesContainer.offsetParent) return;

				// Получаем актуальные размеры слайда
				const slideSize = isHorizontal
					? originalSlides[0].offsetWidth
					: originalSlides[0].offsetHeight;

				// Если размеры нулевые (слайдер скрыт), не обновляем
				if (!slideSize) return;

				const translateValue = isHorizontal
					? `translateX(-${currentIndex * slideSize}px)`
					: `translateY(-${currentIndex * slideSize}px)`;

				if (instant) {
					slidesContainer.style.transition = "none";
				} else {
					slidesContainer.style.transition = "transform 0.5s ease";
				}

				slidesContainer.style.transform = translateValue;
			});
		}

		// Обработчики навигации
		function goNext() {
			if (isAnimating) return;
			isAnimating = true;

			clearInterval(autoScrollIntervalId);
			currentIndex++;
			updateSlider();

			setTimeout(() => {
				isAnimating = false;
			}, 500);

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
			if (isAnimating) return;
			isAnimating = true;

			clearInterval(autoScrollIntervalId);
			currentIndex--;
			updateSlider();

			setTimeout(() => {
				isAnimating = false;
			}, 500);

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
			if (isAutoScrollPaused || autoScrollIntervalId) return;
			// Очищаем предыдущий интервал перед установкой нового
			clearInterval(autoScrollIntervalId);
			autoScrollIntervalId = setInterval(goNext, 3000);
		}

		function stopAutoScroll() {
			if (autoScrollIntervalId) {
				clearInterval(autoScrollIntervalId);
				autoScrollIntervalId = null; // сбрасываем идентификатор
			}
		}

		function resetAutoScroll() {
			stopAutoScroll();
			// Добавить задержку перед запуском нового интервала
			setTimeout(() => {
				if (!isAutoScrollPaused) {
					startAutoScroll();
				}
			}, 10);
		}

		// Обработчики событий
		nextBtn.addEventListener("click", goNext);
		prevBtn.addEventListener("click", goPrev);

		prevBtn.setAttribute("aria-label", "Предыдущий слайд");
		prevBtn.setAttribute("role", "button");

		nextBtn.setAttribute("aria-label", "Следующий слайд");
		nextBtn.setAttribute("role", "button");

		slidesContainer.addEventListener("mouseenter", () => {
			isAutoScrollPaused = true;
			stopAutoScroll();
		});

		slidesContainer.addEventListener("mouseleave", () => {
			isAutoScrollPaused = false;
			startAutoScroll();
		});

		// Обработчики для управления автопрокруткой при потере фокуса окна/вкладки
		window.addEventListener("blur", stopAutoScroll);
		window.addEventListener("focus", startAutoScroll);

		// Обработчик для события visibilitychange (переключение вкладок)
		document.addEventListener("visibilitychange", () => {
			if (document.hidden) {
				stopAutoScroll();
			} else {
				startAutoScroll();
			}
		});

		let xDown = null;
		let yDown = null;

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
					goNext();
				} else {
					goPrev();
				}
			} else {
				return;
			}
			xDown = null;
			yDown = null;
		}
		slidesContainer.addEventListener("touchstart", handleTouchStart, false);
		slidesContainer.addEventListener("touchmove", handleTouchMove, false);

		// Инициализация
		checkOrientation();
		updateSlider(true);
		startAutoScroll();

		// Обработка ресайза с троттлингом
		let isResizing = false;
		window.addEventListener("resize", () => {
			if (isResizing) return;
			isResizing = true;

			stopAutoScroll(); // останавливаем перед ресайзом

			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => {
				checkOrientation();
				updateSlider(true);

				// Запускаем с задержкой
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

tabSlidersStart();
// SLIDER END

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

				// Обновляем видимость кнопок
				updateSlider();
			}
		};

		setupButtons();
		// window.addEventListener("resize", updateSlider);
		updateSlider();
	};

	// Общая функция инициализации
	const initializeSlider = () => {
		if (window.innerWidth > 600) {
			tabButtonsList.forEach((tabButton, index) => {
				const input = tabButton.querySelector(
					`#tab-slide-btn-${index + 1}`,
				);
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
			(tabButton) =>
				tabButton.querySelector('input[type="radio"]') === this,
		);
		if (index !== -1) {
			const activeSlider = document.querySelector(
				`#tab-slide-${index + 1}`,
			);
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
		'.prices-block--buttons input[type="radio"], .table-tabs--buttons input[type="radio"], [data-tabs-buttons]  input[type="radio"]',
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
			const webShopTarget =
				webShopDiagram.querySelector(".store-text-target");
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
					console.error(
						`Label for input with id "${tabId}" not found`,
					);
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

			const anyChecked = Array.from(inputs).some(
				(input) => input.checked,
			);

			if (!anyChecked) {
				setTabContent("ai-benefit-1");
				toggleLineShopAI("1");
			}
		}
	};

	webShopDiagramHandler();

	const tenderDiagramHandler = () => {
		const tenderDiagram = document.querySelector(".tender-diagram");
		if (!tenderDiagram) {
			return;
		} else {
			const tenderTarget = tenderDiagram.querySelector(
				".tender-text-target",
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
							"Автоматическая генерация документов для полностью автоматизированного процесса закупок",
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

				const newContent = content.find(
					(item) => item.id === tabId,
				).content;

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

			const anyChecked = Array.from(inputs).some(
				(input) => input.checked,
			);
			if (!anyChecked) {
				setTenderTabContent("tender-radio-1");
			}
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

		if (!id) return;

		let slider = document.getElementById(`${id}`);

		if (!slider) return;

		// Проверяем, был ли уже инициализирован слайдер
		if (slider.dataset.initialized === "true") {
			// Только обновляем размеры, не сбрасываем позицию
			updateSliderDimensions(slider);
			return;
		}

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
		let gap;
		requestAnimationFrame(() => {
			gap = parseInt(window.getComputedStyle(slider).gap);
		});
		const visibleWidth = slider.parentElement.clientWidth;

		if (fill) {
			const breaks = fill.split(",");
			const windowWidth = window.innerWidth;

			if (windowWidth > 1200) {
				const slideWidth = visibleWidth / breaks[0] - gap / 2;
				[].forEach.call(slides, function (slide) {
					slide.style.minWidth = `${slideWidth}px`;
				});
			} else if (windowWidth > 900) {
				const slideWidth = visibleWidth / breaks[1] - gap / 2;
				[].forEach.call(slides, function (slide) {
					slide.style.minWidth = `${slideWidth}px`;
				});
			} else if (windowWidth > 600) {
				const slideWidth = visibleWidth / breaks[2] - gap / 2;
				[].forEach.call(slides, function (slide) {
					slide.style.minWidth = `${slideWidth}px`;
				});
			} else {
				const slideWidth = visibleWidth / breaks[3] - gap / 2;
				[].forEach.call(slides, function (slide) {
					slide.style.minWidth = `${slideWidth}px`;
				});
			}
		}

		const visibleSlidesCount = Math.round(
			visibleWidth / slides[0].offsetWidth,
		);

		if (!!navLeft && !!navRight) {
			prevBtn.push(navLeft);
			nextBtn.push(navRight);

			navLeft.style =
				"position: absolute; left: 5px; top: 50%; transform: translateY(-50%)";
			navRight.style = `position: absolute; right: 5px; top: 50%; transform: translateY(-50%)`;

			prevBtn.setAttribute("aria-label", "Предыдущий слайд");
			prevBtn.setAttribute("role", "button");

			nextBtn.setAttribute("aria-label", "Следующий слайд");
			nextBtn.setAttribute("role", "button");
		}

		if (id === `cases-tabs-slider`) {
			slides = slider.querySelectorAll(".tab-content");
			gap = parseInt(
				window.getComputedStyle(slider.querySelector(".cases-content"))
					.gap,
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
						const slideWidth = visibleWidth / breaks[0] - gap / 2;
						[].forEach.call(slides, function (slide) {
							slide.style.minWidth = `${slideWidth}px`;
						});
					} else if (windowWidth > 900) {
						const slideWidth = visibleWidth / breaks[1] - gap / 2;
						[].forEach.call(slides, function (slide) {
							slide.style.minWidth = `${slideWidth}px`;
						});
					} else if (windowWidth > 600) {
						const slideWidth = visibleWidth / breaks[2] - gap / 2;
						[].forEach.call(slides, function (slide) {
							slide.style.minWidth = `${slideWidth}px`;
						});
					} else {
						const slideWidth = visibleWidth / breaks[3] - gap / 2;
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
						btn.style.pointerEvents = "none";
					} else {
						btn.style.opacity = "1";
						btn.style.pointerEvents = "";
					}

					btn.setAttribute("aria-label", "Предыдущий слайд");
					btn.setAttribute("role", "button");
				});

				// Disable next button if at end
				nextBtn.forEach((btn) => {
					if (
						currentIndex + visibleSlidesCount >= slides.length ||
						currentIndex >= slides.length - 1
					) {
						btn.style.opacity = "0";
						btn.style.pointerEvents = "none";
					} else {
						btn.style.opacity = "1";
						btn.style.pointerEvents = "";
					}

					btn.setAttribute("aria-label", "Следующий слайд");
					btn.setAttribute("role", "button");
				});

				if (!!pagination) {
					const btncount = slides.length - (visibleSlidesCount - 1);
					if (btncount < 2) {
						pagination.style.display = "none";
					} else if (
						pagination.style.display === "none" &&
						btncount > 1
					) {
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
				".pagination--buttons-dots",
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
							window.innerWidth > 600 ? `15px` : `-5px`
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
							window.innerWidth > 600 ? `15px` : `-5px`
						}; color: var(--blue-main);`;
					}
				});
			};

			if (navButtons.length !== btncount && visibleSlidesCount > 0) {
				navButtons.forEach((button) =>
					dotsContainer.removeChild(button),
				);
				for (let index = 0; index < btncount; index++) {
					const btnDot = document.createElement("button");
					btnDot.classList.add("pagination--btn-dot");
					dotsContainer.appendChild(btnDot);
				}
				navButtons = pagination.querySelectorAll(
					".pagination--btn-dot",
				);
				navButtons.forEach((button) => {
					button.classList.remove("highlight");
				});
				navButtons[currentIndex].classList.add("highlight");
				if (currentIndex === 0) {
					prevBtn.forEach((btn) => {
						if (currentIndex === 0) {
							btn.style.opacity = "0";
							btn.style.pointerEvents = "none";
						} else {
							btn.style.opacity = "1";
							btn.style.pointerEvents = "";
						}
					});
				}
			}
			handleSliderArrows();
		}

		const nextSlide = () => {
			if (
				navButtons[currentIndex + 1] &&
				window.getComputedStyle(navButtons[currentIndex + 1])
					.display === "none"
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
							(mutation) => mutation.type === "childList",
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

function updateSliderDimensions(slider) {
	// Только обновляем размеры без сброса позиции
	// const computedStyle = window.getComputedStyle(slider);
	// const gap = parseInt(computedStyle.gap) || 0;
	// const visibleWidth = slider.parentElement?.clientWidth || 0;
	const slides = slider.children;

	if (slides.length === 0) return;

	// const slideWidth = calculateSlideWidth(slider, visibleWidth, gap);

	requestAnimationFrame(() => {
		Array.from(slides).forEach((slide) => {
			slide.style.minWidth = `${slideWidth}px`;
		});
		// Не обновляем transform - сохраняем текущую позицию
	});
}

sliderInitialize();

// vakansies
window.addEventListener("hashchange", () => {
	console.log("=> ", location.hash);
	if (location.hash === "#apply") {
		document.getElementById("apply_link").classList.add("infinite-glow");

		setTimeout(() => {
			history.replaceState(
				"",
				document.title,
				window.location.pathname + window.location.search,
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
				if (!counter) return;

				let hasAnimated = false;

				const animateCounter = (counter, duration = 4000) => {
					// Убираем пробелы и преобразуем в число
					const targetValue = parseInt(
						counter
							.getAttribute("data-counter-value")
							.replace(/\s+/g, ""),
						10,
					);
					const blankValue =
						counter.getAttribute("data-counter-value").length;
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
			if (
				event.target &&
				event.target.matches("textarea[data-autosize]")
			) {
				textarea_autosize.resize(event.target);
			}
		});
		document.addEventListener("change", function (event) {
			if (
				event.target &&
				event.target.matches("textarea[data-autosize]")
			) {
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
function gallerySelector() {
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
			console.log("=> setUpGallery", info);
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
}
document.addEventListener("DOMContentLoaded", gallerySelector);

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
		divSelect.innerHTML =
			'<span class="current"></span><ul class="list"></ul>';
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
				listItem.setAttribute(
					"data-price",
					child.getAttribute("data-price"),
				);
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
		console.log(
			`dispatched change on ${originalSelect.id}, value=${originalSelect.value}`,
		);
	});

	return this;
};

document.addEventListener("DOMContentLoaded", function () {
	let customSelect = niceSelectJS("select", {
		activeMobile: true,
	});
});

// tooltip handler
document.addEventListener("DOMContentLoaded", () => {
	document.querySelectorAll("[data-tooltip]").forEach((el) => {
		if (!el) return;

		el.addEventListener("mouseenter", () => {
			requestAnimationFrame(() => {
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
				if (
					left + tooltipRect.width >
					window.scrollX + window.innerWidth
				) {
					left =
						window.scrollX +
						window.innerWidth -
						tooltipRect.width -
						8;
				}
				// Check left overflow
				if (left < window.scrollX) {
					left = window.scrollX + 8;
				}
				// Check bottom overflow
				if (
					top + tooltipRect.height >
					window.scrollY + window.innerHeight
				) {
					top = window.scrollY + rect.top - tooltipRect.height - 8;
				}
				// Check top overflow
				if (top < window.scrollY) {
					top = window.scrollY + 8;
				}

				tooltip.style.top = `${top}px`;
				tooltip.style.left = `${left}px`;
			});
		});

		el.addEventListener("mouseleave", () => {
			let tooltip = document.getElementById("custom-tooltip");
			if (tooltip) tooltip.classList.remove("visible");
		});
	});
});

// brif
document.addEventListener("DOMContentLoaded", () => {
	if (document.getElementById("calculator-sitebrif")) {
		const inputs = document
			.getElementById("calculator-sitebrif")
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
							reveal: document.getElementById(
								input.dataset.reveal || "",
							),
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
								if (
									toggle.radioid &&
									toggle.radioid.length > 0
								) {
									toggles.map((el) => {
										toggle.radioid?.forEach((id) => {
											if (
												el.id === id &&
												el.elementref.checked
											) {
												el.elementref.checked = false;
												el.reveal?.classList.add(
													"hidden",
												);
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
					options: toggles.filter(
						(toggle) => toggle.elementref.checked,
					),
					extra: texts.filter((text) => text.elementref.value !== ""),
				};
				console.log(review);
			});
		}
	}
});

// calculator v1 с жесткими пресетами для типов сайтов + поддержка кастомных select
document.addEventListener("DOMContentLoaded", () => {
	if (document.getElementById("calculator")) {
		const inputs = document
			.getElementById("calculator")
			?.querySelectorAll(
				".accordion-content input, .accordion-content select",
			);
		const reset_button = document.getElementById("reset-options-btn");
		const sentButton = document.getElementById("send-calculator-total");
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
			const allAccordionItems =
				document.querySelectorAll(".accordion-item");
			allAccordionItems.forEach((item) => {
				if (item.id === "site-types") return;
				item.classList.add("deactive");
				const sectionCheckbox = item.querySelector(
					'input[type="checkbox"][id^="section-"]',
				);
				if (sectionCheckbox) {
					sectionCheckbox.checked = false;
				}
			});
		};
		const activateAllAccordions = () => {
			const allAccordionItems =
				document.querySelectorAll(".accordion-item");
			allAccordionItems.forEach((item) => {
				item.classList.remove("deactive");
			});
		};
		// Скрывает все аккордеоны, кроме указанных по id
		const hideAllAccordionsExcept = (keepIds) => {
			const allAccordionItems =
				document.querySelectorAll(".accordion-item");
			allAccordionItems.forEach((item) => {
				if (!keepIds.includes(item.id)) {
					item.classList.add("hidden");
				}
			});
		};
		// Показывает все аккордеоны (убирает класс hidden)
		const showAllAccordions = () => {
			const allAccordionItems =
				document.querySelectorAll(".accordion-item");
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
					niceSelect.querySelectorAll(".option")[
						selectEl.selectedIndex
					];
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
						deactivateSelectOption(
							toggle.currentOption,
							toggles,
							target,
						);
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
			if (
				tenderSolutionSelect &&
				tenderSolutionSelect.selectedIndex === -1
			) {
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
				tenderAccordion.classList.add("deactive");
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
					const checkboxes = block.querySelectorAll(
						'input[type="checkbox"]',
					);
					checkboxes.forEach((checkbox) => {
						const toggleObj = toggles.find(
							(t) =>
								t.type === "checkbox" &&
								t.elementref === checkbox,
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
				console.log(target.id);
				resetTenderCheckboxes(toggles, target);
			}
			target.current_value += option.price;
			if (option.reveal) showElement(option.reveal);
			if (option.nested && option.nested.length > 0) {
				activateNestedToggles(
					{ nested: option.nested },
					toggles,
					target,
				);
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
				deactivateNestedToggles(
					{ nested: option.nested },
					toggles,
					target,
				);
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
			if (isTenderSelected) {
				deactivateAllAccordions();
				setTimeout(() => {
					document
						?.querySelector("#tender-accordion")
						.scrollIntoView({
							behavior: "smooth",
							block: "start",
						});
				}, 600);
			} else if (toggle && toggle.elementref.checked) {
				activateAllAccordions();
			}
		};

		// Применение пресета типа сайта
		const applySiteTypePreset = (
			selectedToggle,
			toggles,
			counters,
			target,
		) => {
			resetCalculator(toggles, counters, target);

			// Показать все аккордеоны, кроме тендерного (он будет скрыт отдельно)
			showAllAccordions();
			if (tenderAccordion) {
				tenderAccordion.classList.add("hidden");
				tenderAccordion.classList.add("deactive");
			}

			selectedToggle.elementref.checked = true;
			target.current_value += selectedToggle.price;
			if (selectedToggle.reveal)
				selectedToggle.reveal.classList.remove("hidden");

			if (selectedToggle.nested && selectedToggle.nested.length > 0) {
				selectedToggle.nested.forEach((nestedItem) => {
					const nestedToggleId = nestedItem.id;
					const nestedToggle = toggles.find(
						(t) => t.id === nestedToggleId,
					);
					if (nestedToggle) {
						// Если передан индекс для селекта, сохраняем его временно
						if (nestedItem.optionIndex !== null) {
							nestedToggle._tempSelectIndex =
								nestedItem.optionIndex;
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
			const switchCheckbox = document.getElementById(
				"tender-solution-switch",
			);
			const hiddenSelect = document.getElementById(
				"tender-solution-select",
			);

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
					hiddenSelect.dispatchEvent(
						new Event("change", { bubbles: true }),
					);
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
					hiddenSelect.dispatchEvent(
						new Event("change", { bubbles: true }),
					);
				}
			};

			if (freightOption)
				freightOption.addEventListener("click", () =>
					handleOptionClick(0),
				);
			if (procurementOption)
				procurementOption.addEventListener("click", () =>
					handleOptionClick(1),
				);

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
					const nestedToggle = toggles.find(
						(t) => t.id === nestedItem.id,
					);
					if (nestedToggle && !nestedToggle.elementref.checked) {
						// Если передан индекс для селекта, сохраняем его временно
						if (nestedItem.optionIndex !== null) {
							nestedToggle._tempSelectIndex =
								nestedItem.optionIndex;
						}
						nestedToggle.elementref.checked = true;
						nestedToggle.elementref.dispatchEvent(
							new Event("change"),
						); // Вызываем обработчик

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
					const nestedToggle = toggles.find(
						(t) => t.id === nestedItem.id,
					);
					if (nestedToggle && nestedToggle.elementref.checked) {
						nestedToggle.elementref.checked = false;
						nestedToggle.elementref.dispatchEvent(
							new Event("change"),
						); // Вызываем обработчик

						// Рекурсивно деактивируем вложенные элементы
						deactivateNestedToggles(nestedToggle, toggles, target);
					}
				});
			}
		};

		// Обработка хеша
		const handleToggleByHash = (hash, toggles, counters, target) => {
			const id = hash.replace("#", "");
			const handle_target = toggles.find((t) => t.id === id);
			if (handle_target) {
				try {
					if (handle_target.isSiteType) {
						applySiteTypePreset(
							handle_target,
							toggles,
							counters,
							target,
						);
					} else {
						handle_target.elementref.checked = true;
						handle_target.elementref.dispatchEvent(togglechange);
						if (
							handle_target.nested &&
							handle_target.nested.length > 0
						) {
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
										nestedToggle._tempSelectIndex =
											nestedItem.optionIndex;
									}
									nestedToggle.elementref.checked = true;
									nestedToggle.elementref.dispatchEvent(
										togglechange,
									);
								}
								if (nestedToggle?.reveal)
									nestedToggle.reveal.classList.remove(
										"hidden",
									);
							});
						}
					}
					toggleSection(
						null,
						false,
						["calculator", "calculator-total"],
						["choose_your_way"],
					);
					console.log("=> success");
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
				"tenders_toggle",
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
						reveal: document.getElementById(
							input.dataset.reveal || "",
						),
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
						const selectOptionIndex = input.dataset
							.selectOptionIndex
							? parseInt(input.dataset.selectOptionIndex)
							: 0;

						toggles.push({
							id: input.id,
							elementref: input,
							price: parseInt(input.dataset.price || "0"),
							nested: parseNested(input.dataset.nested),
							reveal: document.getElementById(
								input.dataset.reveal || "",
							),
							radioid: input.dataset.radio?.split(";"),
							showAccordionItems:
								input.dataset.showAccordionItem?.split(";"),
							hideAccordionItems:
								input.dataset.hideAccordionItem?.split(";"),
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
					});
					toggle.elementref.addEventListener("change", () => {
						const value = toggle.elementref.value.trim();
						if (value !== "" && !toggle.active) {
							activateTextField(toggle, target, toggles);
						} else if (value === "" && toggle.active) {
							deactivateTextField(toggle, target, toggles);
						}
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
							handleTendersToggle(
								toggle,
								toggles,
								counters,
								target,
							);
							return;
						}
						if (toggle.isSiteType) {
							if (toggle.elementref.checked) {
								applySiteTypePreset(
									toggle,
									toggles,
									counters,
									target,
								);
							} else {
								resetCalculator(toggles, counters, target);
							}
							return;
						}

						const isTenderInnerToggle =
							isTenderPortalInnerToggle(toggle);

						if (toggle.elementref.checked) {
							// Включение чекбокса
							if (toggle.reveal)
								toggle.reveal.classList.remove("hidden");
							if (toggle.counter)
								updateCountersForToggle(toggle, target);
							if (toggle.radioid && toggle.radioid.length > 0) {
								toggle.radioid.forEach((id) => {
									const radioToggle = toggles.find(
										(t) => t.id === id,
									);
									if (
										radioToggle &&
										radioToggle.elementref.checked
									) {
										radioToggle.elementref.checked = false;
										radioToggle.elementref.dispatchEvent(
											new Event("change"),
										);
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
									showAccordionItems(
										toggle.showAccordionItems,
									);
								if (toggle.hideAccordionItems)
									hideAccordionItems(
										toggle.hideAccordionItems,
									);
							}
						} else {
							// Выключение чекбокса
							if (toggle.reveal) {
								toggle.reveal.classList.add("hidden");
								clearTextFieldsInContainer(
									toggle.reveal,
									toggles,
									target,
								);
							}
							if (toggle.counter?.total) {
								target.current_value -= toggle.counter.total;
								toggle.counter.total = 0;
							}
							if (toggle.nested && toggle.nested.length > 0) {
								deactivateNestedToggles(
									toggle,
									toggles,
									target,
								);
							}
							target.current_value -= toggle.price;

							if (!isTenderInnerToggle) {
								if (toggle.showAccordionItems)
									hideAccordionItems(
										toggle.showAccordionItems,
									);
								if (toggle.hideAccordionItems)
									showAccordionItems(
										toggle.hideAccordionItems,
									);
							}
						}

						// Управление связанным селектом (с поддержкой временного индекса)
						if (toggle.selectTarget) {
							const targetSelect = document.getElementById(
								toggle.selectTarget,
							);
							if (
								targetSelect &&
								targetSelect.tagName === "SELECT"
							) {
								if (toggle.elementref.checked) {
									// Используем временный индекс, если он есть, иначе стандартный
									let index =
										toggle._tempSelectIndex !== undefined
											? toggle._tempSelectIndex
											: toggle.selectOptionIndex;
									if (index === undefined) index = 0; // по умолчанию
									if (
										index >= 0 &&
										index < targetSelect.options.length
									) {
										targetSelect.selectedIndex = index;
										targetSelect.dispatchEvent(
											new Event("change"),
										);
									}
									// Сбрасываем временный индекс после использования
									delete toggle._tempSelectIndex;
								} else {
									targetSelect.selectedIndex = -1;
									targetSelect.dispatchEvent(
										new Event("change"),
									);
								}
							}
						}

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
				counter.elementref.nextElementSibling?.addEventListener(
					"click",
					() => {
						counter.elementref.value++;
						counter.elementref.dispatchEvent(changeEvent);
					},
				);
				counter.elementref.previousElementSibling?.addEventListener(
					"click",
					() => {
						if (
							counter.elementref.dataset?.intendfor ===
							"design-landing"
						) {
							if (counter.elementref.value > 1)
								counter.elementref.value--;
						} else if (counter.elementref.value > 0) {
							counter.elementref.value--;
						}
						counter.elementref.dispatchEvent(changeEvent);
					},
				);

				counter.elementref.addEventListener("input", () => {
					const relatedToggle = toggles.find(
						(t) => t.id === counter.intendfor,
					);
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
						counter.elementref.dataset?.intendfor ===
							"design-landing" &&
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
					if (counter.elementref.value === "")
						counter.elementref.value = 0;
					if (
						counter.elementref.dataset?.intendfor ===
							"design-landing" &&
						counter.elementref.value < 1
					) {
						counter.elementref.value = 1;
					}
				});
			});

			// Кнопка отправки
			sentButton?.addEventListener("click", (e) => {
				const checkboxes = toggles
					.filter(
						(t) => t.type === "checkbox" && t.elementref.checked,
					)
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
				console.log(review);

				toggleAuthScreen("after");
			});

			// Кнопка сброса
			reset_button?.addEventListener("click", (e) => {
				const calculator = document.getElementById("calculator");
				let icon = e.currentTarget.querySelector("i");
				icon.classList.add("rotateInfinite");
				sentButton.disabled = true;

				setTimeout(() => {
					calculator?.scrollIntoView({
						behavior: "smooth",
						block: "start",
					});
					icon.classList.remove("rotateInfinite");
					sentButton.disabled = false;

					setTimeout(() => {
						resetCalculator(toggles, counters, target);
					}, 200);
				}, 600);
			});

			if (hash) {
				handleToggleByHash(hash, toggles, counters, target);
			}
		}
	}
});

document.querySelectorAll("[data-total-switch]").forEach((button) => {
	button.addEventListener("click", (e) => {
		const state = e.currentTarget.dataset.totalSwitch;

		toggleAuthScreen(state);
	});
});

function toggleAuthScreen(state) {
	let wrapper = document.querySelector("#calculator-total.total");

	if (wrapper) wrapper.classList.toggle("active");

	// after state = 'after'; before state = 'before';
	const isActive = wrapper.classList.contains("active");

	if (isActive) {
		state = "before";
	} else {
		state = "after";
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
		}, 600);
	});
};

// Инициализация триггеров остается без изменений
const triggerButtons = document?.querySelectorAll("[data-trigger]");
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
			}, 600);
		}

		if (calculator?.classList.contains("show")) {
			setTimeout(() => {
				calculatorWrapper?.classList.add("active");
			}, 600);
		}
	});
});

// input type file logic with drag-n-drop
document.addEventListener("DOMContentLoaded", function () {
	const inputFiles = document.querySelectorAll(
		".input-file input[type=file]",
	);

	if (inputFiles.length > 0) {
		inputFiles.forEach((input) => {
			const fileDropArea = input
				.closest(".input-file")
				.querySelector(".file-drop-area");
			const fileListContainer = fileDropArea.querySelector(".file-list");

			fileListContainer.style.display = "none";

			// Массив для хранения всех выбранных файлов
			let allFiles = [];

			// Функция для проверки дубликатов
			const isDuplicateFile = (newFile, existingFiles) => {
				return existingFiles.some(
					(existingFile) =>
						existingFile.name === newFile.name &&
						existingFile.size === newFile.size &&
						existingFile.lastModified === newFile.lastModified,
				);
			};

			// Функция обновления отображения файлов
			const updateFileDisplay = () => {
				fileListContainer.innerHTML = ""; // Очищаем список

				if (allFiles.length === 0) {
					fileListContainer.style.display = "none";
					return;
				}

				fileListContainer.style.display = "";

				allFiles.forEach((file, index) => {
					const fileItem = document.createElement("div");
					fileItem.classList.add("file-item");

					// Создаем элемент span для названия файла
					const fileNameSpan = document.createElement("span");
					fileNameSpan.textContent = file.name;
					fileNameSpan.style.cursor = "pointer";

					// Добавляем обработчик события для открытия файла
					fileNameSpan.addEventListener("click", () => {
						const reader = new FileReader();
						reader.onload = (e) => {
							const fileUrl = URL.createObjectURL(file);
							window.open(fileUrl, "_blank");
						};
						reader.readAsDataURL(file);
					});

					const removeButton = document.createElement("span");
					removeButton.textContent = "✖";
					removeButton.classList.add("remove-file");
					removeButton.dataset.index = index;

					fileItem.appendChild(fileNameSpan);
					fileItem.appendChild(removeButton);
					fileListContainer.appendChild(fileItem);
				});
			};

			// Функция обновления input.files
			const updateInputFiles = () => {
				const dataTransfer = new DataTransfer();
				allFiles.forEach((file) => {
					dataTransfer.items.add(file);
				});
				input.files = dataTransfer.files;

				// Триггерим событие change для обновления формы
				const event = new Event("change", { bubbles: true });
				input.dispatchEvent(event);
			};

			// Функция добавления файлов (общая для input и drag-n-drop)
			const addFiles = (files) => {
				const newFiles = Array.from(files);
				let hasNewFiles = false;

				// Проверяем каждый новый файл на дубликаты
				newFiles.forEach((file) => {
					if (!isDuplicateFile(file, allFiles)) {
						allFiles.push(file);
						hasNewFiles = true;
					} else {
						console.log(`Файл "${file.name}" уже добавлен`);
						// Можно показать уведомление пользователю
					}
				});

				if (hasNewFiles) {
					// Обновляем input.files
					updateInputFiles();

					// Обновляем отображение
					updateFileDisplay();
				}
			};

			// Обработчик выбора файлов через input
			input.addEventListener("change", function () {
				addFiles(this.files);

				// Сбрасываем значение input, чтобы можно было выбрать тот же файл повторно
				this.value = "";
			});

			// Drag-and-drop события
			fileDropArea.addEventListener("dragover", function (e) {
				e.preventDefault();
				e.stopPropagation();
				this.classList.add("drag-over");
			});

			fileDropArea.addEventListener("dragleave", function (e) {
				e.preventDefault();
				e.stopPropagation();
				// Проверяем, покинули ли мы именно drop-зону, а не её детей
				if (!this.contains(e.relatedTarget)) {
					this.classList.remove("drag-over");
				}
			});

			fileDropArea.addEventListener("drop", function (e) {
				e.preventDefault();
				e.stopPropagation();
				this.classList.remove("drag-over");

				// Получаем файлы из события drop
				const droppedFiles = e.dataTransfer.files;

				if (droppedFiles.length > 0) {
					addFiles(droppedFiles);
				}
			});

			// ВАЖНОЕ ИЗМЕНЕНИЕ: Обработчик клика только для подсказки drag-and-drop
			// Находим элемент с подсказкой и добавляем обработчик только к нему
			const dragDropHint = fileDropArea.querySelector(".drag-drop-hint");
			if (dragDropHint) {
				dragDropHint.addEventListener("click", function (e) {
					e.stopPropagation(); // Останавливаем всплытие
					input.click();
				});
			}

			// Удаление файлов
			fileListContainer.addEventListener("click", function (e) {
				if (e.target.classList.contains("remove-file")) {
					e.stopPropagation(); // Предотвращаем срабатывание клика на fileDropArea
					const index = parseInt(e.target.dataset.index);
					allFiles.splice(index, 1); // Удаляем файл из массива

					// Обновляем input.files
					updateInputFiles();

					// Обновляем отображение файлов
					updateFileDisplay();
				}
			});

			// Предотвращаем стандартное поведение браузера для drag событий
			["dragenter", "dragover", "dragleave", "drop"].forEach(
				(eventName) => {
					fileDropArea.addEventListener(
						eventName,
						preventDefaults,
						false,
					);
					document.body.addEventListener(
						eventName,
						preventDefaults,
						false,
					);
				},
			);

			function preventDefaults(e) {
				e.preventDefault();
				e.stopPropagation();
			}
		});
	}
});

document.addEventListener("DOMContentLoaded", () => {
	const reviewsContainer = document.getElementById("reviews-container");

	if (reviewsContainer) {
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
	}
});

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
			const url = this.action;
			const data = serializeForm(this);

			fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: data,
			})
				.then((response) => response.json())
				.then((res) => {
					if (res.status) {
						const popupBody = document.querySelector(
							"#login-review .popup-body",
						);
						if (popupBody) {
							popupBody.innerHTML =
								'<p class="mb-20">' +
								res.data.title +
								"</p>" +
								res.data.body;
						}
					} else {
						alert(res.data);
					}
				})
				.catch((error) => {
					console.error("Error:", error);
				});
		});
	}

	// Handle comment add form submission
	const commentForm = document.querySelector("#comment-add");
	if (commentForm) {
		commentForm.addEventListener("submit", function (e) {
			e.preventDefault();
			const url = this.action;
			const data = serializeForm(this);

			fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: data,
			})
				.then((response) => response.json())
				.then((res) => {
					if (res.status) {
						const popupBody = document.querySelector(
							"#login-review .popup-body",
						);
						if (popupBody) {
							popupBody.innerHTML =
								'<p class="mb-20">' +
								res.data.title +
								"</p>" +
								res.dataEnd.body;
						}
					} else {
						alert(res.data);
					}
				})
				.catch((error) => {
					console.error("Error:", error);
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
			console.warn(
				"TableOfContents: Не найден элемент .article-navigation",
			);
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

		console.log(
			`TableOfContents: Инициализировано ${this.sections.length} секций`,
		);
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
		console.log("TableOfContents: Запуск автоматической генерации...");

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

		console.log(
			`TableOfContents: Сгенерировано ${this.links.length} ссылок`,
		);
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
			if (
				linkRect.top < navRect.top ||
				linkRect.bottom > navRect.bottom
			) {
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
						parseInt(
							window.getComputedStyle(targetElement)
								.scrollMarginTop,
						) || this.options.scrollOffset;

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
		if (
			this.observer &&
			(newOptions.rootMargin || newOptions.highlightAll)
		) {
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
document.addEventListener("DOMContentLoaded", () => {
	// Проверяем наличие навигации
	const nav = document.querySelector(".article-navigation");
	if (!nav) return;

	// Определяем настройки на основе data-атрибутов
	const autoGenerate = nav.dataset.autoGenerate === "true";
	const highlightAll = nav.dataset.highlightAll !== "false";
	const highlightStrategy = nav.dataset.highlightStrategy || "multiple";
	const rootMargin = nav.dataset.rootMargin || "-10% 0px -70% 0px";

	// Создаем экземпляр с настройками
	window.articleTOC = new TableOfContents({
		autoGenerate,
		highlightAll,
		highlightStrategy,
		rootMargin,
		scrollOffset: 100,
	});

	// Дебаг информация в консоль
	if (window.articleTOC && window.articleTOC.getState) {
		console.log(
			"TableOfContents: Автоматически инициализирован",
			window.articleTOC.getState(),
		);
	}
});

// Экспорт для использования в модулях
if (typeof module !== "undefined" && module.exports) {
	module.exports = TableOfContents;
}

// office-viewer
const officeImage = (elem) => {
	let link = elem.querySelector("img").getAttribute("src"),
		modal = document.getElementById("photo-view"),
		img = modal?.querySelector("img");

	img.setAttribute("src", link);
};

let photoCards = document?.querySelectorAll(".card--photo");

if (photoCards.length > 0) {
	photoCards.forEach((item) => {
		item.addEventListener("click", (e) => {
			openPopup("photo-view");
			officeImage(e.currentTarget);
		});
	});
}
