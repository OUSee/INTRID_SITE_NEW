// dynamic mockup place
function updateMockupPlace() {
    const mockup = document.querySelector('.flying-mockup');
    const movementPlace = document.querySelector('.left-block');
    const returnPlace = movementPlace.parentElement;

    if (window.innerWidth < 1000) {
        if (mockup && movementPlace) {
            movementPlace.insertBefore(mockup, movementPlace.lastChild);
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

document.addEventListener('resize', () => {
    updateMockupPlace();
});