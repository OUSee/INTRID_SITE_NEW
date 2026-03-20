// in tab  content show
document.addEventListener('DOMContentLoaded', () => {
  const diagramHandler = () => {
    const diagram = document.querySelector('.custom-diagram');
    if (!diagram) {
      return;
    } else {
      const targetStore = diagram.querySelector('.store-text-target');
      diagram.querySelectorAll('input').forEach((input) =>
        input.addEventListener('click', () => {
          setTabContent(input.id);
          toggleLineShopAI(input.id);
        })
      );

      const toggleLineShopAI = (id) => {
        const lines = diagram.querySelectorAll('.line');
        lines.forEach((line) => {
          line.classList.remove('active-left');
          line.classList.remove('active-right');
        });
        const lastChar = id.slice(-1);
        switch (lastChar) {
          default: {
            lines[1].classList.add('active-left');
            break;
          }
          case '2': {
            lines[0].classList.add('active-left');
            break;
          }
          case '3': {
            lines[2].classList.add('active-left');
            break;
          }
          case '4': {
            lines[2].classList.add('active-right');
            break;
          }
          case '5': {
            lines[0].classList.add('active-right');
            break;
          }
          case '6': {
            lines[1].classList.add('active-right');
            break;
          }
        }
      };

      const setTabContent = (tabId) => {
        const contentElement = diagram.querySelector(
          `label[for="${tabId}"] .content-hidden`
        );
        if (contentElement) {
          targetStore.innerHTML = contentElement.innerHTML;
        }
      };

      const defaultChecked = diagram.querySelector(
        'input[type="radio"]:checked'
      );
      if (defaultChecked) {
        setTabContent(defaultChecked.id);
        toggleLineShopAI(defaultChecked.id);
      }
    }
  };

  diagramHandler();
});
