// in tab webshop content show
document.addEventListener('DOMContentLoaded', () => {

  const webShopDiagram = document.querySelector('.web-shop-diagram')
const webShopTarget = webShopDiagram.querySelector('.store-text-target')
console.log('=> webshop', webShopDiagram, webShopTarget)
webShopDiagram.querySelectorAll('input').forEach((input)=>
  input.addEventListener('click', ()=>{
    console.log('=> input', input)
    setTabContent(input.id)
    toggleLineShopAI(input.id)
  })
)

const toggleLineShopAI = (id) => {
  console.log('=> enter', )
  const lines = webShopDiagram.querySelectorAll('.line')
  console.log('=> lines', lines)
  lines.forEach(line => {
    line.classList.remove('active-left');
    line.classList.remove('active-right');
  });
  const lastChar = id.slice(-1);
  switch (lastChar){
    default:{
      lines[1].classList.add('active-left')
      break
    }
    case '2':{
      lines[0].classList.add('active-left')
      break
    }
    case '3':{
      lines[2].classList.add('active-left')
      break
    }
    case '4':{
      lines[2].classList.add('active-right')
      break
    }
    case '5':{
      lines[0].classList.add('active-right')
      break
    }
    case '6':{
      lines[1].classList.add('active-right')
      break
    }
  }
}


const setTabContent = (tabId) => {
  const content = [
    {id: 'ai-benefit-1', content: 'ИИ анализирует поведение пользователей и предлагает релевантные товары в нужный момент'},
    {id: 'ai-benefit-2', content: 'Персонализированные рекомендации, умный поиск и автоматизированная поддержка выделят вас среди конкурентов'},
    {id: 'ai-benefit-3', content: 'Подбирает сопутствующие товары, которые покупатели часто добавляют в корзину, тем самым увеличивают средний чек'},
    {id: 'ai-benefit-4', content: 'Умные системы предсказывают потребности клиента и показывают ему именно то, что он ищет'},
    {id: 'ai-benefit-5', content: 'Покупатели могут искать товары голосом, что ускоряет процесс и делает магазин удобнее для пользователей смартфонов и умных устройств'},
    {id: 'ai-benefit-6', content: 'Телеграм-бот помогает с подбором товаров, оформлением заказов и отвечает на вопросы 24/7, увеличивая вовлеченность и лояльность клиентов'},
  ]

  const newText = content.find((item)=> item.id === tabId).content
  webShopTarget.innerHTML = newText
}

setTabContent('ai-benefit-1')
toggleLineShopAI('1')

const tenderDiagram = document.querySelector('.tender-diagram')
const tenderTarget = tenderDiagram.querySelector('.tender-text-target')
tenderDiagram.querySelectorAll('input').forEach((input)=>
  input.addEventListener('click', ()=>{
    setTenderTabContent(input.id)
  })
)

const setTenderTabContent = (tabId) => {
  
  const content = [
    {
      id: 'tender-radio-1', 
      content: [
      'Поставщики конкурируют за ваши тендеры на закупки и предлагают минимальную цену.',
      'Вы приобретаете сырье и материалы по самым выгодным ценам',
      'Усредненная экономия - 5% с каждой закупки'
    ]},
    {
      id: 'tender-radio-2', 
      content: [
        'Гибкая настройка интерфейса портала под ваши задачи',
        'Система разрабатывается с учетом навыков обычного пользователя ПК',
        'Быстрое освоение всего функционала портала'
      ]},
    {
      id: 'tender-radio-3', 
      content: [
        'Полная совместимость с ПО от 1С',
        'Возможность интеграции с любым другим офисным ПО и БД',
        'Тендеры выгружаются из БД в один клик, а поставщики могут выгружать свои предложения при синхронизации артикулов',
      ]},
    {

      id: 'tender-radio-4', 
      content:[
        'Менеджерам больше не нужно обзванивать сотни поставщиков и изучать их прайсы и КП.',
        'Формирование тендеров в автоматическом режиме исходя из текущих потребностей компании.',
        'Синхронизация с бухгалтерией поставщиков.',
        'Выбор лучших предложений по цене, условиям поставки и качеству продукции для тысяч наименований от сотен поставщиков. ',
        'Автоматически генерируется необходимый пакет документов. Полностью автоматизированный процесс закупок'
      ] },
    {

      id: 'tender-radio-5', 
      content: [
        'При создании портала учитывается каждый бизнес-процесс компании',
        'Роли пользователей распределяются согласно вашим требованиям',
        'Максимум эффективности и удобства при эксплуатации'
      ]},
    {

      id: 'tender-radio-6', 
      content: [
        'Фиксация и учет всех действий, которые совершались на портале',
        'Данные станут неопровержимым доказательством при разрешении спорных ситуаций',
        'Возможность составления необходимых отчетов и графиков по закупкам, ценам, поставщикам и т. д. в динамике'
      ]},
    {

      id: 'tender-radio-7',
      content: [
        'Минимизация количества сотрудников, задействованных в процессе закупок',
        'Автоматизация всех процессов организации закупок',
        'Сотрудники могут сосредоточиться на стратегических задачах, так как рутинные процессы выполняются системой'
      ]}, 
      
    {

      id: 'tender-radio-8', 
      content: [
        'Прозрачная процедура определения победителя тендера',
        'Защита от несанкционированного вмешательства',
        'Невозможность использования “откатов” и прочих теневых схем'
      ]},
      
  ]

  const newContent = content.find((item) => 
    item.id === tabId
  ).content
  
  tenderTarget.innerHTML = newContent.map((item) => {
    return(`<li>${item}</li>`)
  }).join('')
}

setTenderTabContent('tender-radio-1')

})
