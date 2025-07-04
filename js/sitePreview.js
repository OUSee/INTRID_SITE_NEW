let popup = document.querySelector('#site-preview'),
  buttons = document.querySelectorAll('[data-site-preview]'),
  iframe = document.createElement('iframe');

if (buttons.length > 0) {
  buttons.forEach((button) => {
    button.addEventListener('click', (e) => {
      iframe.src = e.currentTarget.dataset.sitePreview;
      popup.querySelector('.iframe-window').appendChild(iframe);
      popup.querySelector('.iframe-tab-link').innerText = e.currentTarget
        .closest('.recent-work-card, .support-card')
        .querySelector('.title_h4').innerText;
      popup.querySelector('.iframe-url-input').innerText =
        e.currentTarget.dataset.sitePreview;
    });
  });
}
