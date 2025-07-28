// dynamic mockup place
function updateMockupPlace() {
  const mockup = document.querySelector('.flying-mockup');
  const movementPlace = document.querySelector('.main-section--actions');
  const returnPlace = document.querySelector('.main-section');

  if (window.innerWidth < 1000) {
    if (mockup && movementPlace) {
      movementPlace.before(mockup);
    }
  } else {
    if (mockup && returnPlace) {
      returnPlace.insertBefore(mockup, returnPlace.lastChild);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateMockupPlace();
});

window.addEventListener('resize', () => {
  updateMockupPlace();
});
