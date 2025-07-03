document.addEventListener('DOMContentLoaded', () => {
  const reviewsContainer = document.querySelector('#reviews-container');

  reviewsContainer.addEventListener('submit', (event) => {
    if (event.target.matches('form[data-pjax]')) {
      event.preventDefault();

      pjaxSubmit(event, {
        push: true,
        replace: false,
        timeout: 1000,
        scrollTo: false,
        container: '#reviews-container',
      });
    }
  });
  // Обработка клика по элементам с классом 'filter'
  document.addEventListener('click', (event) => {
    if (event.target.matches('.filter')) {
      const rating = event.target.dataset.rating;
      const type = document.querySelector('.reviews__button.active').dataset
        .type;
      // Здесь должен быть вызов функции pjax.reload
      pjaxReload({
        container: '#reviews-container',
        type: 'POST',
        data: { rating: rating, type: type },
        timeout: 1000,
        push: false,
        replace: true,
      });
    }
  });
});
