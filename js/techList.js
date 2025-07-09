document.addEventListener('DOMContentLoaded', () => {
  let lists = document.querySelectorAll('.tech-we-use-list'),
    interval = 0.6;

  lists.forEach((list) => {
    let items = list.querySelectorAll('li');

    if (list) {
      list.style.setProperty('--list-length', items.length);

      items.forEach((item, index) => {
        item.querySelector('.tech-tag').style.animation = `list-glow ${
          items.length * interval
        }s linear infinite`;
        item.querySelector('.tech-tag').style.animationDelay = `${
          index * interval
        }s`;
      });
    }
  });
});
