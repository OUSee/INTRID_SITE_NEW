// dynamic mockup place
function updateMockupPlace() {
  const mockup = document.querySelector('.flying-mockup');
  if (!mockup) return; // Если мокап не найден, выходим из функции

  const mainPageSelector = document.querySelector('.main-section--index');
  const isMainPage = !!mainPageSelector;
  let isMobileView = window.innerWidth < 1000;

  if (isMainPage) {
    const mainSectionRight = document.querySelector('.main-section--right');
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
    const movementPlace = document.querySelector('.main-section--actions');
    const returnPlace = document.querySelector('.main-section');

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

document.addEventListener('DOMContentLoaded', updateMockupPlace);
window.addEventListener('resize', handleResize);
