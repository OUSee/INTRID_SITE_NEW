document.addEventListener('DOMContentLoaded', () => {
  const reviewsContainer = document.querySelector('#reviews-container');

  reviewsContainer.addEventListener('submit', (event) => {
    if (event.target.matches('form[data-pjax]')) {
      event.preventDefault();

      $.pjax.submit(event, '#reviews-container', {
        push: true,
        replace: false,
        timeout: 1000,
        scrollTo: false,
      });
    }
  });

  // Обработка кликов по фильтрам, источникам и пагинации
  document.addEventListener('click', (event) => {
    const filter = event.target.matches('.filter') ? event.target : null;
    const sourceBtn = event.target.closest('.reviews__button');
    const pageLink = event.target.closest('.pagination a');

    if (pageLink) {
      event.preventDefault();
      $.pjax.reload('#reviews-container', {
        url: pageLink.href,
        type: 'GET',
        timeout: 1000,
        push: false,
        replace: true,
        scrollTo: false,
      });
      return;
    }

    if (filter) {
      const rating = filter.dataset.rating;
      const type = document.querySelector('.reviews__button.active').dataset.type;
      $.pjax.reload('#reviews-container', {
        type: 'POST',
        data: { rating: rating, type: type },
        timeout: 1000,
        push: false,
        replace: true,
      });
    }

    if (sourceBtn) {
      const type = sourceBtn.dataset.type;
      const rating = document.querySelector('.filter.active').dataset.rating;
      $.pjax.reload('#reviews-container', {
        type: 'POST',
        data: { rating: rating, type: type },
        timeout: 1000,
        push: false,
        replace: true,
      });
    }
  });
});
