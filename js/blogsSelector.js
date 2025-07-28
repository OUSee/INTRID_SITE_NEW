document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('[data-selector]');
  const titleTarget = document.getElementById('blogs-title');
  const slider = document.getElementById('blog-slider');

  const titles = {
    'blog-site': { title: 'Статьи Разработка сайтов' },
    'digital-design': { title: 'Статьи Digital-дизайн' },
    'seo-promotion': { title: 'Статьи SEO-продвижение' },
    'internet-marketing': { title: 'Статьи Интернет-маркетинг' },
  };

  const articles = {
    'blog-site': [
      {
        img: './src/images/image-by-item-and-alias.webp',
        link: './blog/landing-page.html',
        title: 'Отличия Landing Page от сайта',
        description: `Прежде чем заказать лендинг, нужно понимать, что это и для чего он нужен. 
                              А также нужно разобраться, в чем его отличия от обычного сайте. 
                              Суть обоих понятий довольно близка - немного отличается лишь разнообразие. 
                              Выбор должен основываться на преследуемых целях и особенностей бизнеса.`,
        date: '2022-01-01',
      },
      {
        img: './src/images/blog/kontent_sayta.webp',
        link: './blog/unikalnyj-kontent-dla-vasego-internet-magazina.html',
        title: 'Уникальный контент для Вашего интернет-магазина',
        description: `Интернет-магазин - удобная и современная платформа для реализации товаров. 
                              Однако, для удачной работы недостаточно просто создать сайт или страницу в соцсетях. 
                              Нужно наполнить его качественным контентом: статьями, заметками и описаниями товаров.`,
        date: '2022-01-02',
      },
      {
        img: './src/images/blog/cms-blog-preview.webp',
        link: './blog/vozmoznosti-nasej-cms-i-sms.html',
        title: 'Возможности нашей CMS – "i-сms"',
        description: `Наша компания разрабатывает и устанавливает уникальные CMS, под конкретные веб-ресурсы с индивидуальными функциональными возможностями. 
                              Каждый такой сайт оснащается также надёжной системой защиты от несанкционированного доступа.`,
        date: '2022-01-02',
      },
      {
        img: './src/images/blog/viz02.webp',
        link: './blog/manual-dla-licnogo-kabineta.html',
        title: 'Мануал для личного кабинета',
        description: `В этой инструкции мы расскажем для чего нужен личный кабинет и как пользоваться его инструментами.`,
        date: '2022-01-02',
      },
      {
        img: './src/images/blog/cms-zoom.webp',
        link: './blog/pocemu-nelza-sozdavat-internet-magaziny-na-sablonah.html',
        title: 'Почему нельзя создавать интернет-магазины на шаблонах',
        description: `Основные проблемы, с которыми сталкиваются пользователи при создании сайтов на шаблонах`,
        date: '2022-01-02',
      },
      {
        img: './src/images/blog/list-preview.webp',
        link: './blog/pamatka-zakazciku.html',
        title: 'Памятка заказчику',
        description: `Ни для кого не секрет, что коммерческий сайт – это современный инструмент бизнеса, позволяющий получать большой поток клиентов из сети. 
                              Основные задачи сайта: привлекать клиентов, приносить прибыль, способствовать продвижению торговой марки, улучшать имидж компании, обеспечивать обратную связь с потребителями и т.д., и т.п.                        `,
        date: '2022-01-02',
      },
    ],
    'digital-design': [
      {
        img: './src/images/blog/UX_UI_dis.webp',
        link: './blog/uxui_design.html',
        title: 'UX и UI-дизайн — что это и зачем нужно?',
        description: `Доступно и кратко рассказываем о самой эффективной технологии web-дизайна.`,
        date: '2022-01-02',
      },
      {
        img: './src/images/blog/visitka.webp',
        link: './blog/vizitka-vaznyj-element-delovogo-imidza.html',
        title: 'Визитка – важный элемент делового имиджа',
        description: `Облегчая общение, визитка служит неназойливым напоминанием о деловом человеке. 
                              Просматривая свою визитницу, ее обладатель будет постоянно видеть Вашу визитку, и не исключено, что, подыскивая деловых партнеров, вспомнит о Вашем существовании. 
                              Многие из нас к самому процессу изготовления визиток подходят не совсем ответственно и взвешенно, и напрасно.`,
        date: '2022-01-02',
      },
      {
        img: './src/images/blog/kreative-design.webp',
        link: './blog/kreativ-v-reklamnom-dizajne.html',
        title: 'Креатив в рекламном дизайне',
        description: `Процесс рекламного дизайна заключается в непрерывном поиске новых средств, которые могли бы привлечь внимание читателя и заинтересовать его в предмете рекламы. 
                              Дизайн процесс творческий.`,
        date: '2022-01-02',
      },
      {
        img: './src/images/blog/ponyatie-logotipa.webp',
        link: './blog/ponatie-logotipa.html',
        title: 'Понятие логотипа',
        description: `Логотип это официально принятый термин, означающий зарегистрированное в порядке оригинально оформленное художественное изображение, для отличия товаров и услуг и их рекламы.`,
        date: '2022-01-02',
      },
    ],
    'seo-promotion': [
      {
        img: './src/images/blog/eseo.webp',
        link: './blog/etapy-seo-prodvijenia.html',
        title: 'Этапы SEO-продвижения сайта',
        description: `Чтобы стать успешным предпринимателем, просто создать сайт недостаточно. 
                              Интернет-ресурс должен быть заметен потенциальной клиентуре. 
                              Для этого требуется продвинуть его вверх в поисковых системах.`,
        date: '2022-01-02',
      },
      {
        img: './src/images/blog/seo-circle.webp',
        link: './blog/kratkij-gajd-po-faktoram-ranzirovania-v-seo.html',
        title: 'Краткий гайд по факторам ранжирования в SEO ',
        description: `Факторы, на которые роботы смотрят при ранжировании сайтов в поисковой системе. 
                              Основная информация.`,
        date: '2022-01-02',
      },
      {
        img: './src/images/blog/orig.webp',
        link: './blog/filtry-andeksa-priznaki-popadania-sroki-sankcij-i-sposoby-vyhoda.html',
        title: 'Фильтры Яндекса',
        description: `Признаки попадания, сроки санкций и способы выхода.
                              Кратко о том, что такое санкции Яндекса и с чем их едят.`,
        date: '2022-01-02',
      },
      {
        img: './src/images/blog/link-building.webp',
        link: './blog/linkbilding-v-2019-rabocie-metody.html',
        title: 'Линкбилдинг в 2019: рабочие методы',
        description: `Статья о том, как продвигать сайт с помощью ссылок в 2019 году и не попадать под фильтры.`,
        date: '2022-01-02',
      },
    ],
    'internet-marketing': [
      {
        img: './src/images/blog/reputation-preview.webp',
        link: './blog/upravlenie-reputaciej-v-internete-zacem-i-kak.html',
        title: 'Управление репутацией в интернете: зачем и как',
        description: `О том, почему так важно поддерживать репутацию бренда в интернете.`,
        date: '2022-01-02',
      },
      {
        img: './src/images/blog/typewriter.webp',
        link: './blog/korporativnyj-blog-dan-mode-ili-effektivnaa-reklama.html',
        title: 'Корпоративный блог: дань моде или эффективная реклама?',
        description: `Зачем нужно вести корпоративный блог и что он Вам даст?`,
        date: '2022-01-02',
      },
      {
        img: './src/images/blog/cursor-preview.webp',
        link: './blog/kontekstnaa-reklama-8-sovetov-novickam.html',
        title: 'Контекстная реклама: 8 советов новичкам',
        description: `Настройка КР для чайников – больше конверсии, меньше трат бюджета!`,
        date: '2022-01-02',
      },
      {
        img: './src/images/blog/mic-preview.webp',
        link: './blog/intervu.html',
        title:
          'Интервью как способ громко заявить о своём бизнесе с помощью прессы',
        description: `Одно хорошее интервью может быть эффективнее десяти щедро проплаченных рекламных кампаний. Почему? Читайте в этой статье.`,
        date: '2022-01-02',
      },
    ],
  };

  if (buttons && titleTarget && slider) {
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        titleTarget.innerText = titles[button.dataset.selector].title;
        while (slider.lastChild) {
          slider.removeChild(slider.lastChild);
        }
        articles[button.dataset.selector].forEach((article) => {
          const slide = document.createElement('div');
          slide.classList.add('card');
          slide.classList.add('card--recent');
          slide.classList.add('card--newsletter');
          slide.classList.add('active');
          const slideHtml = `
                        <a href="${article.link}">
                            <div class="img-wrapper"><img src="${article.img}" alt="${article.title}"></div>
                            <div class="card-body">
                                <b>${article.title}</b>
                                <p>
                                    ${article.description}
                                </p>
                                <span class="card-date">
                                    ${article.date}
                                </span>
                            </div>
                        </a>`;
          slide.innerHTML = slideHtml;
          slider.appendChild(slide);
        });
      });
    });

    const handleToggleByHash = (hash) => {
      const id = hash.replace('#', '');
      const button = document.querySelector(
        `.tab-slider-card[data-selector=${id}]`
      );

      button.click();
    };

    setTimeout(() => {
      handleToggleByHash(window.location.hash);
    }, 300);
  }
});
