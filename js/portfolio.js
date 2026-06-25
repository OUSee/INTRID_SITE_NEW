$(function () {
	var $filters = $('input[name="portfolio-filter"]');
	var params = new URLSearchParams(window.location.search);
	var currentType = params.get("data");

	// Определяем страницу и тип по умолчанию
	var defaultType;
	var pathname = window.location.pathname;

	if (pathname.includes("/portfolio/logo")) {
		defaultType = "rekl";
	} else {
		defaultType = "all";
	}

	// Если параметра data нет в URL — устанавливаем тип по умолчанию
	if (!currentType) {
		currentType = "#" + defaultType;
		params.set("data", currentType);
		var newUrl = window.location.pathname + "?" + params.toString();
		window.history.replaceState({}, "", newUrl);
	}

	// Обрабатываем текущий тип
	var type = currentType.replace("#", "");
	var $target = $filters.filter('[data-type="' + type + '"]');

	if ($target.length) {
		$target.prop("checked", true);
	}

	window.syncTabsToSelect?.();

	// Проверяем, нужно ли выполнить начальный PJAX
	// Выполняем только если есть параметр data, но нет page
	if (params.has("data") && !params.has("page")) {
		params.set("page", 1);
		var url = window.location.pathname + "?" + params.toString();

		// Удаляем класс show перед начальной загрузкой
		const container = document.querySelector(".portfolio");
		const wrapper = container?.querySelector(".portfolio-block");
		if (wrapper && wrapper.classList.contains("show")) {
			wrapper.classList.remove("show");
		}

		$.pjax.reload({
			container: "#porfolio-body-content",
			url: url,
			push: false,
			replace: true,
			timeout: 5000,
		});
	}

	// Обработчик изменений переключателей
	$filters.on("change", function () {
		var $this = $(this);
		params = new URLSearchParams(window.location.search);

		// Удаляем класс show перед отправкой PJAX-запроса
		const container = document.querySelector(".portfolio");
		const wrapper = container?.querySelector(".portfolio-block");
		if (wrapper && wrapper.classList.contains("show")) {
			wrapper.classList.remove("show");
		}

		if ($this.is(":checked")) {
			$filters.not($this).prop("checked", false);
			params.set("data", "#" + $this.data("type"));
		} else {
			params.delete("data");
		}

		params.set("page", 1);
		var url = window.location.pathname + "?" + params.toString();

		$.pjax.reload({
			container: "#porfolio-body-content",
			url: url,
			push: true,
			replace: false,
			timeout: 5000,
		});
	});

	$(document).on("pjax:end", "#porfolio-body-content", function () {
		window.scrollTo({ top: 0, behavior: "smooth" });
		console.log("pjax end");

		// Запускаем анимацию после загрузки контента
		setTimeout(function () {
			const container = document.querySelector(".portfolio");
			const wrapper = container?.querySelector(".portfolio-block");
			if (wrapper && !wrapper.classList.contains("show")) {
				wrapper.classList.add("show");
			}
		}, 50);

		gallerySelector();
		initPopups();
		sitePreview();
		sliderInitialize();
	});

	// Если не было PJAX-загрузки, все равно показываем контент с анимацией
	setTimeout(function () {
		if (!params.has("data") || params.has("page")) {
			const container = document.querySelector(".portfolio");
			const wrapper = container?.querySelector(".portfolio-block");
			if (wrapper && !wrapper.classList.contains("show")) {
				wrapper.classList.add("show");
			}
		}
	}, 100);
});
