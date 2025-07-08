document.addEventListener('DOMContentLoaded', () => {
  let lists = document.querySelectorAll('.tech-we-use-list');

  lists.forEach((list) => {
    let items = list.querySelectorAll('li');

    if (list) {
      list.style = `--list-length: ${items.length}`;
    }
  });
});
