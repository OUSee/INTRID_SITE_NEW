// dynamic mockup place
function updateMockupPlace() {
  let mockup = document.querySelector('.flying-mockup');
  let movementPlace = document.querySelector('.main-section--actions');
  let returnPlace = document.querySelector('.main-section');
  let mainPageSelector = document.querySelector('.main-section--index');
  let mainSectionRight = document.querySelector('.main-section--right');

  if (window.innerWidth < 1000) {
    if (mockup && movementPlace) {
      movementPlace.before(mockup);
    } else if (mainPageSelector) {
      mainSectionRight.before(mockup);
    }
  } else {
    if (mockup && returnPlace) {
      returnPlace.insertBefore(mockup, returnPlace.lastChild);
    } else if (mainPageSelector) {
      mainSectionRight.insertBefore(mockup, mainSectionRight.firstChild);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateMockupPlace();
});

window.addEventListener('resize', () => {
  updateMockupPlace();
});
