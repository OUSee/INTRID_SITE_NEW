// MAP LOGIC
document.addEventListener('DOMContentLoaded', () => {
  // console.log('=> map script started', )
  try {
    const mapLinks = document.querySelectorAll('.map-link');
    // console.log('=> links found', mapLinks)

    const mapData = {
      prague: {
        frame:
          '<iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3A596c110a6e67b7ecf53baf573cb97950916b7bfb81fe164b7ec895af9864ccb8&amp;source=constructor" width="835" height="516" frameborder="0"></iframe>',
        link: 'https://yandex.ru/maps/-/CHvuzWlD',
        adress: 'Poděbradská 52, 19000 Praha 9',
        phone: '420777749719',
        wa: '79518587172',
        tg: 'lionvdv',
      },
      vrn: {
        frame:
          '<iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3Ade02f3d1f93ca59ddbc7669962c5e7f350cec0968beae8e096d86287b227d6b1&amp;source=constructor" width="674" height="534" frameborder="0"></iframe>',
        link: 'https://yandex.com/maps/-/CHfmvO6X',
        adress: 'г. Воронеж ул. Пятницкого, 40',
        schedule: 'Пн-Пт: 9:00-18:00',
        phone: '74732540796',
        wa: '74732540796',
        tg: 'webintrid',
      },
    };

    mapLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        loadMap(e, e?.target?.dataset.map);
      });
    });

    function loadMap(e, value) {
      e.preventDefault();
      // console.log('=> enter func loadMap', e, value)
      const map = document.querySelector('#map');
      const container = map.querySelector('.map-container');
      const linkBtn = map.querySelector('.button-link');
      const paragraph = map.querySelector('p.color-white');
      const social = map.querySelector('#map-social');
      const whatsapp = map.querySelector('#map-whatsapp');
      const telegram = map.querySelector('#map-telegram');
      paragraph.innerHTML =
        mapData[value].adress +
        (mapData[value]?.schedule
          ? '<span class="separator">|</span><span> ' +
            mapData[value].schedule +
            '</span><span class="separator">|</span>'
          : '<span class="separator">|</span>');
      container.innerHTML = mapData[value].frame;

      social.style.display =
        mapData[value]?.wa || mapData[value]?.tg ? 'flex' : 'none';

      whatsapp.style.display = mapData[value].wa ? 'flex' : 'none';
      whatsapp.setAttribute('href', mapData[value].wa ?? mapData[value]?.wa);

      telegram.style.display = mapData[value].tg ? 'flex' : 'none';
      telegram.setAttribute('href', mapData[value].tg ?? mapData[value]?.tg);

      linkBtn.href = mapData[value].link;
    }
  } catch (error) {
    console.error('=> error', error.message);
  }
});
