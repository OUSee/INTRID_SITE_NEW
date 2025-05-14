// MAP LOGIC
document.addEventListener('DOMContentLoaded', () => {
  // console.log('=> map script started', )
  try{
    const mapLinks = document.querySelectorAll('.map-link')
    // console.log('=> links found', mapLinks)

    const mapData = {
      prague: {frame: '<iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3A596c110a6e67b7ecf53baf573cb97950916b7bfb81fe164b7ec895af9864ccb8&amp;source=constructor" width="775" height="484" frameborder="0"></iframe>', link: 'https://yandex.com/maps/-/CHfqQD44'},
      vrn: {frame: '<iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3Ade02f3d1f93ca59ddbc7669962c5e7f350cec0968beae8e096d86287b227d6b1&amp;source=constructor" width="674" height="534" frameborder="0"></iframe>',  link: 'https://yandex.com/maps/-/CHfmvO6X'}
    }
  
    mapLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        loadMap(e, e?.target?.dataset.map);
      });
    });
  
    function loadMap(e, value) {
      e.preventDefault();
      // console.log('=> enter func loadMap', e, value)
      const map = document.querySelector('#map');
      const container = map.querySelector('.map-container')
      const linkBtn = map.querySelector('.button-link')
      container.innerHTML = mapData[value].frame
      linkBtn.href = mapData[value].link
    }
  }catch(error){
    console.error('=> error', error.message)
  }
  
})

