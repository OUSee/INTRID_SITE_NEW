document.addEventListener('DOMContentLoaded', () => {
  const counters = document.querySelectorAll('[data-counter-value]');

  if (counters) {
    counters.forEach((counter) => {
      let hasAnimated = false;

      const animateCounters = (duration = 4000) => {
        counters.forEach((counter) => {
          // Убираем пробелы и преобразуем в число
          const targetValue = parseInt(
            counter.getAttribute('data-counter-value').replace(/\s+/g, ''),
            10
          );
          const blankValue = counter.getAttribute('data-counter-value').length;
          let currentValue = 0;
          const startTime = performance.now();

          // Устанавливаем начальное значение в виде нулей
          counter.textContent = '0'.repeat(blankValue);

          const updateCounter = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);

            currentValue = Math.floor(progress * targetValue);
            // Форматируем текущее значение с пробелами
            counter.textContent = currentValue
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ' ') // Добавляем пробелы
              .padStart(blankValue, '0'); // Добавляем нули слева

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              // Форматируем конечное значение с пробелами
              counter.textContent = targetValue
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ' ') // Добавляем пробелы
                .padStart(blankValue, '0'); // Устанавливаем конечное значение с нулями
            }
          };

          requestAnimationFrame(updateCounter);
        });
      };

      const resetCounters = () => {
        counters.forEach((counter) => {
          counter.textContent = '0'.repeat(
            counter.getAttribute('data-counter-value').length
          ); // Сбрасываем к нулям
        });
      };

      const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      };

      const observerCallback = (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!hasAnimated) {
              setTimeout(() => {
                animateCounters(1200);
              }, 250);
              hasAnimated = true;
            }
          } else {
            if (hasAnimated) {
              resetCounters();
              hasAnimated = false;
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
});
