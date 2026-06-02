<?php

namespace frontend\controllers;

use Yii;
use Throwable;
use backend\models\Sites;
use common\models\MailQueue;
use common\models\Analiz;
use yii\caching\TagDependency;
use yii\helpers\FileHelper;
use yii\helpers\Html;
use yii\httpclient\Client;
use yii\httpclient\Exception as HttpClientException;
use yii\web\Controller;
use yii\web\UploadedFile;

/**
 * Site controller
 */
class SubmitController extends Controller
{
    private const HACKERTARGET_BACKLINKS_URL = 'https://api.hackertarget.com/backlinks/';
    private const GOOGLE_SEARCH_URL = 'https://www.google.com/search';
    private const YANDEX_SEARCH_URL = 'https://yandex.com/search/';
    private const YANDEX_TOUCH_SEARCH_URL = 'https://yandex.com/search/touch/';
    private const SEO_AUDIT_DESKTOP_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36';
    private const SEO_AUDIT_MOBILE_USER_AGENT = 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Mobile Safari/537.36';
    private const SEO_AUDIT_ACCEPT_LANGUAGE = 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7';
    private const SEO_AUDIT_ACCEPT_HEADER = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8';

    private const SITE_BRIF_SECTIONS = [
        [
            'title' => 'Общая информация',
            'fields' => [
                'general-name' => 'Название компании (полное)*',
                'general-buisness_type' => 'Сфера деятельности компании',
                'general-geography' => 'География компании',
                'general-audience' => 'Целевая аудитория',
                'general-services' => 'Основные продукты/услуги',
                'general-competitors' => 'Конкуренты (оставьте ссылки на их сайты, если есть)',
                'general-link' => 'Ссылки на текущий сайт/соцсети (если есть)',
            ],
        ],
        [
            'title' => 'Цели создания сайта',
            'fields' => [
                'strategy-org_promo' => 'Распространение информации о компании и о товарах / услугах в сети Интернет',
                'strategy-brand_promo' => 'Проведение рекламных акций в Интернет, продвижение бренда',
                'strategy-review' => 'Обеспечение обратной связи с клиентами и партнёрами',
                'strategy-blog' => 'Публикация новостей, отчётов, пресс-релизов',
                'strategy-services' => 'Онлайн-сервисы для пользователей (форумы, социальные сети, биржи услуг и т.д.)',
                'strategy-indirect_sales' => 'Непрямые продажи (привлечение новых клиентов, укрепление связей со старыми)',
                'strategy-direct_sales' => 'Прямые продажи через Web-сайт (интернет-магазин)',
                'strategy-corporate' => 'Сайт внутрикорпоративного пользования (предназначен только для сотрудников Вашей организации)',
                'strategy-aims' => 'Целевая аудитория сайта (Каких результатов Вы хотите добиться с помощью Вашего нового сайта?)',
            ],
        ],
        [
            'title' => 'Дизайн сайта',
            'fields' => [
                'design-landing' => 'LandingPage',
                'design-base' => 'Современный уникальный дизайн',
                'design-premium' => 'Премиум-дизайн',
                'design-similar_cites' => 'Укажите сайты с понравившемся дизайном, сайты конкурентов',
                'design-additional-logobook' => 'Логотип + логобук',
                'design-additional-firmstyle' => 'Фирменный стиль + Логотип + логобук',
                'design-additional-3d' => '3D-обьекты',
                'design-additional-vector' => 'Векторная графика',
                'design-additional-interaction' => 'Интерактивность и анимация средствами HTML5/CSS3 ',
            ],
        ],
        [
            'title' => 'Ядро сайта и CMS',
            'fields' => [
                'core-icms' => 'iCMS — система управления контентом',
                'core-icms-select' => [
                    'core-icms_standart' => 'Стандартное решение',
                    'core-icms_individual' => 'Индивидуальная разработка',
                ],
                'core-site' => 'Ядро сайта',
                'core-site-select' => [
                    'core-site_standart' => 'Стандартное защищённое ядро',
                    'core-site_individual' => 'Усиленное ядро с шифрованием данных',
                ],

                // Старые поля оставлены для совместимости с предыдущей версией формы.
                'management-icms' => 'Стандартная система администрирования и управления контентом сайта i-cms',
                'management-other' => 'Другая система (Bitrix, Drupal и т.д.)',
                'other-cms-extra' => 'Название системы',
                'management-custom' => 'Уникальная разработка под индивидуальные задачи и нестандартные решения любой сложности',
                'custom-cms-extra' => 'Опишите требования и пожелания',
            ],
        ],
        [
            'title' => 'Структура и функционал сайта',
            'fields' => [
                'structure-blocks_mainscreen' => 'Главный экран',
                'structure-blocks_goods' => 'Продукция',
                'structure-blocks_about' => 'О компании',
                'structure-blocks_benefits' => 'Преимущества',
                'structure-blocks_reviews' => 'Отзывы',
                'structure-blocks_services' => 'Услуги',
                'structure-blocks_tariffs' => 'Тарифы',
                'structure-blocks_howitworks' => 'Как это работает',
                'structure-blocks_portfolio' => 'Портфолио / Кейсы',
                'structure-blocks_faq' => 'FAQ',
                'structure-blocks_promo' => 'Акции / Хиты / Новинки',
                'structure-blocks_news' => 'Новости',
                'functions-blocks_custom' => 'Укажите свои блоки',

                'structure-section_goods' => 'Продукция',
                'structure-section_services' => 'Услуги',
                'structure-section_about' => 'О компании',
                'structure-section_news' => 'Новости',
                'structure-blog' => 'Блог',
                'structure-blog-select' => [
                    'structure-blog_standart' => 'Блог (линейный)',
                    'structure-blog_categories' => 'Блог с подкатегориями',
                ],
                'structure-portfolio' => 'Портфолио',
                'structure-portfolio-select' => [
                    'structure-portfolio_standart' => 'Простое портфолио (галерея)',
                    'structure-portfolio_expanded' => 'Расширенное портфолио',
                ],
                'structure-section_toclients' => 'Клиентам',
                'structure-section_tocontributors' => 'Партенерам',
                'structure-section_contacts' => 'Контакты',
                'structure-section_payment' => 'Оплата и доставка ',
                'structure-section_vacansies' => 'Вакансии',
                'structure-section_custom' => 'Укажите свои разделы',
            ],
        ],
        [
            'title' => 'Искусственный интеллект',
            'fields' => [
                'ai-design_check' => 'Подбор дизайна карточки товара с наибольшей конверсией',
                'ai-autosearch' => 'Автоматический подбор аналогичных и сопутствующих товаров',
                'ai-recommended_selection' => 'Автоматическое формирование выборки популярных и рекомендованных товаров',
                'ai-competitor_monitor' => 'Мониторинг конкурентов и выявление сильных сторон',
                'ai-voice_search' => 'Голосовой поиск',
                'ai-auto_promotion' => 'Автоматизация маркетинговых компаний',
                'ai-dynamic_pricing' => 'Динамическое ценообразование на основе анализа цен конкурентов',
                'ai-image_search' => 'Обработка изображений и визуальный поиск',
                'ai-order_management' => 'Автоматическая обработка заказов и логистики',
            ],
        ],
        [
            'title' => 'Продвижение и раскрутка сайта',
            'fields' => [
                'promotion-seo' => 'SEO-оптимизация сайта',
                'promotion-seo-base' => 'SEO-оптимизация сайта',
                'promotion-seo-base-select' => [
                    'promotion-seo_reg' => 'Город / Область',
                    'promotion-seo_ctr' => 'По всей России',
                ],
                'promotion-seo_reg' => 'Город, область',
                'promotion-seo_ctr' => 'По всей России',
                'promotion-max' => 'Максимальная стартовая раскрутка',
                'promotion-max-base' => 'Максимальная стартовая раскрутка',
                'promotion-max-base-select' => [
                    'promotion-max_start_reg' => 'Город / Область',
                    'promotion-max_start_ctr' => 'По всей России',
                ],
                'promotion-max_start_reg' => 'Город, область',
                'promotion-max_start_ctr' => 'По всей России',
            ],
        ],
        [
            'title' => 'Дополнительные опции',
            'fields' => [
                'extra-domain' => 'Подбор и регистрация домена',
                'extra-server' => 'Хостинг',
                'extra-hosting' => [
                    '__label' => 'Хостинг',
                    'extra-server_start' => 'Хостинг старт (12 месяцев)',
                    'extra-server_standart' => 'Хостинг стандарт (12 месяцев)',
                    'extra-server_virtual' => 'Виртуальный сервер / VDS (12 месяцев)',
                ],
                'extra-ssl' => 'SSL (12 месяцев)',

                'extra-management-consulting' => 'Консультирование по работе с сайтом',
                'extra-creating-favicon' => 'Создание уникальной иконки сайта ',
                'extra-integration-social' => 'Интегрирование с соцсетями (поделиться в различных соцсетях или месенджерах)',
                'extra-install-ymaps' => 'Установка интерактивной карты Яндекс.Карты',
                'extra-creating-mailing' => 'Создание почтовых ящиков, относящихся к сайту',
                'extra-install-ssl' => 'Установка и настройка защищённого соединения (SSL-сертификат)',
            ],
        ],
    ];
    private const LOGO_BRIF_SECTIONS = [
        [
            'title' => 'Общая информация',
            'fields' => [
                'general-name' => 'Название компании (полное)*',
                'general-buisness_type' => 'Область деятельности, направление бизнеса компании',
                'general-competitors' => 'Конкуренты (прямые и косвенные, оставьте ссылки на их сайты, если есть)',
                'general-distribution' => 'Способы реализации товаров/услуг (Опт, розница, магазины, офисы, торговые точки, выставочные залы, интернет-магазины и т.д.)',
                'general-geography' => 'География компании',
                'general-audience' => 'Целевая аудитория',
                'general-services' => 'Основные продукты/услуги',
                'general-slogan' => 'Слоган/девизы',
                'general-aims' => 'Маркетинговые цели и задачи',
                'general-link' => 'Ссылки на текущий сайт/соцсети (если есть)',
            ],
        ],
        [
            'title' => 'Элементы фирменного стиля',
            'fields' => [
                'elements-logo' => 'Логотип с детализацией построения',
                'elements-fonts' => 'Фирменные шрифты',
                'elements-colors' => 'Фирменные цвета в палитрах CMYK, RGB',
                'elements-businessсard' => 'Визитные карточки',
                'elements-flyer' => 'Флайеры',
                'elements-corp_blank' => 'Корпоративные бланки',
                'elements-folders' => 'Фирменные папки',
                'elements-envelope' => 'Фирменные конверты',
                'elements-souvenir' => 'Сувенирная продукция (перечислите элементы)',
                'elements-extra' => 'Дополнительные элементы (перечислите элементы)',
            ],
        ],
        [
            'title' => 'Стилистика и цветовое решение',
            'fields' => [
                'style-logo_formal' => 'Строгий стиль',
                'style-logo_elegant' => 'Изящный стиль',
                'style-logo_3D' => '3D стиль, объёмный',
                'style-logo_herb' => 'Гербовый стиль',
                'style-logo_youth' => 'Молодёжный стиль',
                'style-logo_maskot' => 'С персонажем',
                'style-colors' => 'Используемые цвета (перечислите желаемые и не желаемые цвета)',
                'style-color_vibrant' => 'Яркие, кричащие, динамические цвета (красный, синий, желтый, зелёный)',
                'style-color_neon' => 'Кислотные флуорисцентные цвета',
                'style-color_pastel' => 'Только мягкие пастельные цвета',
                'style-color_mono' => 'Монохромная: 2 основных цвета и их оттенки',
                'style-color_none' => 'На усмотрение дизайнера',
                'style-format_minimal' => 'Только модернизированный шрифт названия, минимализм',
                'style-format_icon' => 'Логотип со значком/графической иконкой',
                'style-extra' => 'Дополнительные пожелания',
                'style-font_serif' => 'Классические шрифты с засечками',
                'style-font_sans' => 'Шрифты без засечек',
                'style-font_handwritten' => 'Рукописные шрифты',
                'style-font_fancy' => 'Декоративные шрифты',
                'style-font_gothic' => 'Готические шрифты',
                'style-font_slavic' => 'Старословянские шрифты',
                'style-logo_good' => 'Примеры логотипов которые вам нравятся',
                'style-logo_bad' => 'Примеры логотипов которые вам НЕ нравятся',
            ],
        ],
    ];
    private const QUEUE_ERROR_MESSAGE = 'Не удалось поставить письмо в очередь. Попробуйте позже.';

    private bool $queueRunnerScheduled = false;

    private $dataCalc = [
        'a_9' => 'Дизайн сайта',
        'a_12' => 'Дизайн сайта',
        'a_13' => 'Соотношение текстовго содержание и графики',
        'a_18' => 'Система управления сайтом',
        'a_19' => 'Предполагаемый тип сайта',
        'a_67' => 'Интеграция с 1С или другой локальной базой',
    ];
    private $calcSections = [
        'type' => 'Предполагаемый тип сайта',
        'design' => 'Дизайн сайта',
        'structure' => 'Структура сайта',
        'core' => 'Ядро сайта и CMS',
        'modules' => 'Необходимые программные модули',
        'integrations' => 'Интеграция программного обеспечения',
        'ai' => 'Искусственный интеллект',
        'promotion' => 'Продвижение и раскрутка сайта',
        'extra' => 'Дополнительные опции',
        'tender' => 'Тендерные порталы',
    ];
    private function detectCalcSection(string $key): ?string
    {
        $prefixes = [
            'type-' => 'type',
            'design-' => 'design',
            'structure-' => 'structure',
            'core-' => 'core',
            'modules-' => 'modules',
            'integrations-' => 'integrations',
            'ai-' => 'ai',
            'promotion-' => 'promotion',
            'extra-' => 'extra',
            'tender-' => 'tender',
            'tenders_' => 'tender', // на случай tenders_toggle
        ];

        foreach ($prefixes as $prefix => $section) {
            if (strpos($key, $prefix) === 0) {
                return $section;
            }
        }

        return null;
    }

    private function normaliseBrifData(array $data): array
    {
        $normalised = [];

        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $value = array_filter($value, static function ($item) {
                    return $item !== null && $item !== '';
                });
                $value = implode(', ', $value);
            }

            if (is_string($value)) {
                $value = trim($value);
            }

            if ($value === '' || $value === null) {
                $value = 'Да';
            }

            $normalised[$key] = $value;
        }

        return $normalised;
    }

    private function buildBrifSections(array $data, array $structure): array
    {
        $sections = [];
        $handledKeys = [];

        foreach ($structure as $section) {
            $fields = [];

            foreach ($section['fields'] as $fieldKey => $label) {
                if (!array_key_exists($fieldKey, $data)) {
                    continue;
                }

                $value = $data[$fieldKey];

                if (is_string($value)) {
                    $value = trim($value);
                }

                if ($value === '' || $value === null) {
                    continue;
                }

                if (is_array($label)) {
                    $selectedLabel = $label[$value] ?? $value;
                    $parentKey = preg_replace('/-select$/', '', $fieldKey);
                    $parentLabel = $label['__label'] ?? ($section['fields'][$parentKey] ?? null);

                    if (!is_string($parentLabel)) {
                        $parentLabel = $fieldKey;
                    }

                    unset($fields[$parentLabel]);
                    $fields[$parentLabel] = $selectedLabel ?? 'Да';
                    $handledKeys[$fieldKey] = true;
                    $handledKeys[$parentKey] = true;
                    continue;
                }

                $fields[$label] = $value;
                $handledKeys[$fieldKey] = true;
            }

            if (!empty($fields)) {
                $sections[] = [
                    'title' => $section['title'],
                    'fields' => $fields,
                ];
            }
        }

        $remaining = array_diff_key($data, $handledKeys);

        if (!empty($remaining)) {
            $fields = [];
            foreach ($remaining as $key => $value) {
                if ($value === '' || $value === null) {
                    continue;
                }
                $fields[$key] = $value;
            }

            if (!empty($fields)) {
                $sections[] = [
                    'title' => 'Дополнительные данные',
                    'fields' => $fields,
                ];
            }
        }

        return $sections;
    }

    public function actionKontakt()
    {
        Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
        $post = Yii::$app->request->post();
        $status = $this->reGoogle($this->extractCaptchaToken($post));
        //        $this->dbg($post);
        $name = $post['name'] == '' ? 'NO' : $post['name'];
        $email = $post['email'] == '' ? 'NO' : $post['email'];
        $tel = $post['tel'] == '' ? 'NO' : $post['tel'];
        $mess = $post['mess'] == '' ? 'NO' : $post['mess'];
        $formSource = $post['form_page'] ?? Yii::$app->request->referrer ?? 'NO';
        $formSource = trim((string)$formSource) === '' ? 'NO' : trim((string)$formSource);
        $text = "<p><b>Имя:</b> $name</p>"
            . "<p><b>E-mail:</b> $email</p>"
            . "<p><b>Телефон:</b> $tel</p>"
            . "<p><b>Сообщение:</b> $mess</p>"
            . "<p><b>Источник:</b> $formSource</p>"
            . "";

        $validator = new \yii\validators\FileValidator([
            'extensions' => ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png'],
            'checkExtensionByMimeType' => true,
            'maxSize' => 10 * 1024 * 1024,
            'maxFiles' => 5,
            'wrongExtension' => 'Этот формат файла запрещен.',
            'wrongMimeType' => 'Содержимое файла не соответствует расширению.',
        ]);

        $uploadedFiles = UploadedFile::getInstancesByName('file');
        $userFilePaths = [];

        if (!empty($uploadedFiles)) {
            if (count($uploadedFiles) > 5) {
                return [
                    'status' => false,
                    'data' => 'Можно загрузить не более 5 файлов.',
                ];
            }

            $uploadDir = Yii::getAlias('@frontend/../files/uploads');

            if (!is_dir($uploadDir)) {
                FileHelper::createDirectory($uploadDir);
            }

            foreach ($uploadedFiles as $uploadedFile) {
                if (!$validator->validate($uploadedFile, $error)) {
                    return [
                        'status' => false,
                        'data' => "Файл {$uploadedFile->name}: {$error}",
                    ];
                }

                $fileName = $uploadedFile->baseName . '_' . uniqid() . '.' . $uploadedFile->extension;
                $filePath = $uploadDir . '/' . $fileName;

                if ($uploadedFile->saveAs($filePath)) {
                    $userFilePaths[] = $filePath;
                }
            }
        }

        if ($status->status == 'ok') {
            if (!$this->enqueueEmail($text, 'Контакты', Yii::$app->params['emailTo'], null, null, null, $userFilePaths)) {
                return [
                    'status' => false,
                    'data' => self::QUEUE_ERROR_MESSAGE,
                ];
            }

            return [
                'status' => true,
                'data' => 'Ваше письмо успешно отправлено',
            ];
        }

        return [
            'status' => false,
        ];
    }

    protected function processBrif($config)
    {
        $variable = new \yii\validators\EmailValidator();

        if (!Yii::$app->request->isPost) {
            return false;
        }

        $post = Yii::$app->request->post();

        // Валидация email
        if ($config['emailRequired']) {
            if (!$variable->validate($post['email'], $error)) {
                return false;
            }
        } else {
            if ($post['email'] != '') {
                if (!$variable->validate($post['email'], $error)) {
                    return false;
                }
            } else {
                $post['email'] = null;
            }
        }

        // reCAPTCHA проверка
        if (!$this->verifyRecaptcha($post)) {
            return ['status' => false, 'data' => 'Капча введена неверно'];
        }
        $validator = new \yii\validators\FileValidator([
            'extensions' => ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png'], // Только белый список!
            'checkExtensionByMimeType' => true, // Проверяет содержимое файла (magic bytes), а не просто расширение
            'maxSize' => 10 * 1024 * 1024, // Лимит 10 МБ (защита от DoS диска)
            'maxFiles' => 5, // Лимит количества файлов
            'wrongExtension' => 'Этот формат файла запрещен.',
            'wrongMimeType' => 'Содержимое файла не соответствует расширению.'
        ]);

        $uploadedFiles = UploadedFile::getInstancesByName('file');
        $userFilePaths = [];

        if (!empty($uploadedFiles)) {
            $uploadDir = Yii::getAlias('@frontend/../files/uploads');

            if (!is_dir($uploadDir)) {
                FileHelper::createDirectory($uploadDir);
            }

            foreach ($uploadedFiles as $uploadedFile) {
                if (!$validator->validate($uploadedFile, $error)) {
                    return [
                        'status' => false,
                        'data' => "Файл {$uploadedFile->name}: {$error}",
                    ];
                }

                $fileName = $uploadedFile->baseName . '_' . uniqid() . '.' . $uploadedFile->extension;
                $filePath = $uploadDir . '/' . $fileName;

                if ($uploadedFile->saveAs($filePath)) {
                    $userFilePaths[] = $filePath;
                }
            }
        }

        Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;

        $normalisedData = $this->normaliseBrifData($post['data'] ?? []);
        $sections = $this->buildBrifSections($normalisedData, $config['sections']);

        $renderData = [
            'name' => $post['name'],
            'sections' => $sections,
        ];

        // Генерация PDF
        $pdfAlias = $this->generateUniquePdfPath(
            '@frontend/../files/brif',
            $config['pdfNameCallback']($post)
        );

        $text = $this->buildEmailText($post);
        $replayTo = !empty($post['email']) ? $post['email'] : null;

        $queued = $this->enqueueEmail(
            $text,
            $config['emailSubject'],
            $post['email'] ?? null,
            null,
            [
                'filename' => $pdfAlias,
                'view' => $config['pdfView'],
                'params' => $renderData,
                'options' => ['title' => 'Krajee Report Title'],
            ],
            $replayTo,
            $userFilePaths
        );

        if (!$queued) {
            return [
                'status' => false,
                'data' => self::QUEUE_ERROR_MESSAGE,
            ];
        }

        return [
            'status' => true,
            'data' => 'Ваше письмо успешно отправлено',
            'file' => Yii::getAlias($pdfAlias),
        ];
    }

    protected function verifyRecaptcha($post)
    {
        $status = $this->reGoogle($this->extractCaptchaToken($post));
        return $status->status == 'ok';
    }

    protected function buildEmailText($post)
    {
        return "<p><b>Имя:</b> " . $post['name'] . "</p>"
            . "<p><b>E-mail:</b> " . $post['email'] . "</p>"
            . "<p><b>Телефон:</b> " . $post['tel'] . "</p>"
            . "<p><b>Сообщение:</b> " . $post['mess'] . "</p>";
    }



    public function actionBrifs()
    {
        return $this->processBrif([
            'emailRequired' => false,
            'sections' => self::SITE_BRIF_SECTIONS,
            'pdfNameCallback' => function ($post) {
                $companyName = $post['data']['general-name'] ?? $post['tel'] ?? '';
                return 'Бриф_на_создание_сайта_' . $companyName . '_от_INTRID';
            },
            'pdfView' => '@frontend/views/submit/pdf.php',
            'emailSubject' => 'Бриф на разработку сайта',
        ]);
    }

    public function actionBrifl()
    {
        return $this->processBrif([
            'emailRequired' => false,
            'sections' => self::LOGO_BRIF_SECTIONS,
            'pdfNameCallback' => function ($post) {
                $companyName = $post['data']['general-name'] ?? $post['tel'] ?? '';
                return 'Бриф_на_создание_бренда_' . $companyName . '_от_INTRID';
            },
            'pdfView' => '@frontend/views/submit/pdfl.php',
            'emailSubject' => 'Бриф на разработку логотипа и фирменного стиля',
        ]);
    }


    public function actionReklama()
    {
        Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
        $post = Yii::$app->request->post();
        $status = $this->reGoogle($this->extractCaptchaToken($post));
        if ($status->status == 'ok') {
            $replayTo = !empty($post['email']) ?  $post['email'] : null;
            if (!$this->enqueueEmail(['reklama_email', $post], 'Reklama', null, null, null, $replayTo)) {
                return [
                    'status' => false,
                    'data' => self::QUEUE_ERROR_MESSAGE,
                ];
            }
            return [
                'status' => true,
                'data' => 'Ваше письмо успешно отправлено',
            ];
        } else {
            return [
                'status' => false,
            ];
        }
    }

    public function actionSeo()
    {
        Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
        $post = Yii::$app->request->post();
        $status = $this->reGoogle($this->extractCaptchaToken($post));
        // if ($status->success == 1) {
        $replayTo = !empty($post['email']) ?  $post['email'] : null;
        if (!$this->enqueueEmail(['seo_email', $post], 'SEO', null, null, null, $replayTo)) {
            return [
                'status' => false,
                'data' => self::QUEUE_ERROR_MESSAGE,
            ];
        }
        return [
            'status' => true,
            'data' => 'Ваше письмо успешно отправлено',
        ];
        // } else {
        //     return [
        //         'status' => false,
        //     ];
        // }
    }

    public function actionSs()
    {
        Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
        $post = Yii::$app->request->post();
        $status = $this->reGoogle($this->extractCaptchaToken($post));
        if ($status->status == 'ok') {
            $replayTo = !empty($post['email']) ?  $post['email'] : null;
            if (!$this->enqueueEmail(['ss_email', $post], 'Социальные сети', null, null, null, $replayTo)) {
                return [
                    'status' => false,
                    'data' => self::QUEUE_ERROR_MESSAGE,
                ];
            }
            return [
                'status' => true,
                'data' => 'Ваше письмо успешно отправлено',
            ];
        } else {
            return [
                'status' => false,
            ];
        }
    }

    public function actionHost()
    {
        Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
        $post = Yii::$app->request->post();

        // $status = $this->reGoogle($this->extractCaptchaToken($post));
        //if ($status->success == 1) {
        $replayTo = !empty($post['email']) ?  $post['email'] : null;
        if (!$this->enqueueEmail(['hosting_email', $post], 'Хостинг', null, null, null, $replayTo)) {
            return [
                'status' => false,
                'data' => self::QUEUE_ERROR_MESSAGE,
            ];
        }
        return [
            'status' => true,
            'data' => 'Ваше письмо успешно отправлено',
        ];
        /*} else {
            return [
                'status' => false,
            ];
        }*/
    }

    public function actionRep()
    {
        Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
        $post = Yii::$app->request->post();

        $status = $this->reGoogle($this->extractCaptchaToken($post));
        if ($status->status == 'ok') {
            $replayTo = !empty($post['email']) ?  $post['email'] : null;
            if (!$this->enqueueEmail(['rep_email', $post], 'Улучшение репутации', null, null, null, $replayTo)) {
                return [
                    'status' => false,
                    'data' => self::QUEUE_ERROR_MESSAGE,
                ];
            }
            return [
                'status' => true,
                'data' => 'Ваше письмо успешно отправлено',
            ];
        } else {
            return [
                'status' => false,
            ];
        }
    }

    public function actionVhost()
    {
        Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
        $post = Yii::$app->request->post();

        $status = $this->reGoogle($this->extractCaptchaToken($post));
        if ($status->status == 'ok') {
            $replayTo = !empty($post['email']) ?  $post['email'] : null;
            if (!$this->enqueueEmail(['vhosting_email', $post], 'Виртуальный хостинг', null, null, null, $replayTo)) {
                return [
                    'status' => false,
                    'data' => self::QUEUE_ERROR_MESSAGE,
                ];
            }
            return [
                'status' => true,
                'data' => 'Ваше письмо успешно отправлено',
            ];
        } else {
            return [
                'status' => false,
            ];
        }
    }


    public function actionAudit($data = null, $arr = null)
    {
        Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
        $post = Yii::$app->request->post();
        $status = $this->reGoogle($this->extractCaptchaToken($post));
        $replayTo = !empty($post['email']) ?  $post['email'] : null;
        if (!$this->enqueueEmail(['audit_email', $post], 'Комплексный SEO-аудит', null, null, null, $replayTo)) {
            return [
                'status' => false,
                'data' => self::QUEUE_ERROR_MESSAGE,
            ];
        }

        return [
            'status' => true,
            'data' => 'Ваше письмо успешно отправлено',
        ];
    }


    public function actionFast()
    {
        Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
        $post = Yii::$app->request->post();

        $name    = $post['name'] ?? $post['customer-name'] ?? '';
        $email   = $post['mail'] ?? $post['customer-mail'] ?? '';
        $phone   = $post['phone'] ?? $post['customer-phone'] ?? '';
        $message = $post['list'] ?? $post['message'] ?? '';
        $url     = $post['url'] ?? '';
        $target  = $post['target'] ?? '';

        $aim                     = $post['aim'] ?? '';
        $followerBoosting        = $post['follower-boosting'] ?? '';
        $socialMediaAdministration = $post['social-media-administration'] ?? '';
        $tgAudienceEngagement    = $post['tg-audience-engagement'] ?? '';

        $replayTo = $email ?: null;

        // Хелпер для добавления строки, только если значение не пустое
        $addLine = static function (array &$lines, string $label, $value): void {
            $value = trim((string)$value);
            if ($value !== '') {
                $lines[] = '<p><b>' . $label . ':</b> ' . Html::encode($value) . '</p>';
            }
        };

        $lines = [];

        // Основные поля
        $addLine($lines, 'Имя', $name);
        $addLine($lines, 'E-mail', $email);
        $addLine($lines, 'Телефон', $phone);
        $addLine($lines, 'Сообщение', $message);
        $addLine($lines, 'Страница', $url);
        $addLine($lines, 'География', $target);

        // Блок с целями и опциями
        if ($aim || $followerBoosting || $socialMediaAdministration || $tgAudienceEngagement) {
            $addLine($lines, 'Цель', $aim);

            // Эти строки не считаются "пустыми", т.к. всегда содержат "Да"/"Нет"
            $addLine(
                $lines,
                'Накрутка подписчиков',
                $followerBoosting ? 'Да' : 'Нет'
            );
            $addLine(
                $lines,
                'Привлечение целевой аудитории',
                $tgAudienceEngagement ? 'Да' : 'Нет'
            );
            $addLine(
                $lines,
                'Ведение группы/сообщества',
                $socialMediaAdministration ? 'Да' : 'Нет'
            );
        }

        $text = implode("\n", $lines);

        if (!$this->enqueueEmail($text, 'Быстрая заявка', null, null, null, $replayTo)) {
            return [
                'status' => false,
                'data'   => self::QUEUE_ERROR_MESSAGE,
            ];
        }

        return [
            'status' => true,
            'data'   => 'Ваше письмо успешно отправлено',
        ];
    }


    private function enqueueEmail(
        $message,
        ?string $subject = null,
        $to = null,
        $from = null,
        ?array $pdfConfig = null,
        $replyTo = null,
        array $attachments = []
    ): bool {
        try {
            MailQueue::push($message, $subject, $to, $from, $pdfConfig, $replyTo, $attachments);
            return true;
        } catch (Throwable $exception) {
            Yii::error([
                'exception' => [
                    'class' => get_class($exception),
                    'message' => $exception->getMessage(),
                ],
            ], __METHOD__);

            return false;
        }
    }

    private function startMailQueueRunner(): void
    {
        if ($this->queueRunnerScheduled) {
            return;
        }

        $this->queueRunnerScheduled = true;

        try {
            $yiiPath = Yii::getAlias('@app/../yii');
            $command = '/opt/php81/bin/php' . ' ' . escapeshellarg($yiiPath) . ' mail-queue/run';

            if (stripos(PHP_OS, 'WIN') === 0) {
                pclose(popen('start /B "" ' . $command, 'r'));
            } else {
                Yii::error('Starting mail queue runner: ' . $command, __METHOD__);
                exec($command . ' > log.log 2>error.log &');
            }
        } catch (Throwable $exception) {
            $this->queueRunnerScheduled = false;

            Yii::warning([
                'message' => 'Unable to start mail queue console command.',
                'exception' => [
                    'class' => get_class($exception),
                    'message' => $exception->getMessage(),
                ],
            ], __METHOD__);
        }
    }

    private function generateUniquePdfPath(string $directoryAlias, string $baseName, string $extension = 'pdf'): string
    {
        $directoryPath = Yii::getAlias($directoryAlias);
        FileHelper::createDirectory($directoryPath);

        $sanitizedBase = preg_replace('/[^\pL\pN _-]+/u', ' ', $baseName);
        $sanitizedBase = trim(preg_replace('/\s+/', ' ', $sanitizedBase));

        if ($sanitizedBase === '') {
            $sanitizedBase = 'document';
        }

        $counter = 0;
        do {
            $suffix = $counter > 0 ? ' ' . $counter : '';
            $candidate = $sanitizedBase . $suffix . '.' . $extension;
            $candidatePath = $directoryPath . DIRECTORY_SEPARATOR . $candidate;
            $counter++;
        } while (file_exists($candidatePath));

        return $directoryAlias . '/' . $candidate;
    }

    private function reGoogle($p)
    {
        if (!is_string($p) || trim($p) === '') {
            return (object)['success' => 0];
        }

        $serverKey = (string)(Yii::$app->params['smartcaptchaServerKey'] ?? '');
        if (trim($serverKey) === '') {
            Yii::warning('SmartCaptcha server key is not configured.', __METHOD__);
            return (object)['success' => 0];
        }

        $client = new Client();
        $response = $client->createRequest()
            ->setMethod('POST')
            ->setUrl('https://smartcaptcha.yandexcloud.net/validate')
            ->setData([
                'secret' => $serverKey,
                'token' => $p,
                'ip' => Yii::$app->request->userIP,
            ])
            ->send();

        if (!$response->isOk) {
            Yii::warning('SmartCaptcha validate request failed: ' . $response->statusCode, __METHOD__);
            return (object)['success' => 0];
        }


        $status = json_decode((string)$response->content);
        Yii::error(json_decode((string)$response->content, true), 'recapcha');

        return is_object($status) ? $status : (object)['success' => 'failed'];
    }

    private function extractCaptchaToken(array $post): string
    {
        $token = $post['g-recaptcha-response']
            ?? $post['smart-token']
            ?? $post['smartcaptcha-token']
            ?? '';

        return trim((string)$token);
    }

    public function actionCalc($data = null, $arr = null)
    {
        $post = Yii::$app->request->post();

        if (Yii::$app->request->isPost) {
            Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
            $post = Yii::$app->request->post();

            $status = $this->reGoogle($this->extractCaptchaToken($post));
            if ($status->status == 'ok') {
                // Приём и валидация файлов
                $validator = new \yii\validators\FileValidator([
                    'extensions' => ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png'],
                    'checkExtensionByMimeType' => true,
                    'maxSize' => 10 * 1024 * 1024,
                    'maxFiles' => 5,
                    'wrongExtension' => 'Этот формат файла запрещен.',
                    'wrongMimeType' => 'Содержимое файла не соответствует расширению.',
                ]);

                $uploadedFiles = \yii\web\UploadedFile::getInstancesByName('file');
                $userFilePaths = [];

                if (!empty($uploadedFiles)) {
                    if (count($uploadedFiles) > 5) {
                        return [
                            'status' => false,
                            'data' => 'Можно загрузить не более 5 файлов.',
                        ];
                    }

                    $uploadDir = Yii::getAlias('@frontend/../files/uploads');

                    if (!is_dir($uploadDir)) {
                        \yii\helpers\FileHelper::createDirectory($uploadDir);
                    }

                    foreach ($uploadedFiles as $uploadedFile) {
                        if (!$validator->validate($uploadedFile, $error)) {
                            return [
                                'status' => false,
                                'data' => "Файл {$uploadedFile->name}: {$error}",
                            ];
                        }

                        $fileName = uniqid('', true) . '_' . $uploadedFile->baseName . '.' . $uploadedFile->extension;
                        $filePath = $uploadDir . '/' . $fileName;

                        if ($uploadedFile->saveAs($filePath)) {
                            $userFilePaths[] = $filePath;
                        }
                    }
                }

                $sections = [];
                $table = [];

                if (!empty($post['data'])) {
                    $items = json_decode($post['data'], true);

                    if (json_last_error() === JSON_ERROR_NONE && is_array($items)) {
                        foreach ($items as $item) {
                            $key = $item['key'] ?? '';
                            $label = trim((string)($item['label'] ?? ''));
                            $value = trim((string)($item['value'] ?? ''));
                            $price = (float)($item['price'] ?? 0);

                            if ($label === '') {
                                continue;
                            }

                            $sectionKey = $this->detectCalcSection($key);
                            if (!$sectionKey || !isset($this->calcSections[$sectionKey])) {
                                continue;
                            }

                            if (!isset($sections[$sectionKey])) {
                                $sections[$sectionKey] = [
                                    'title' => $this->calcSections[$sectionKey],
                                    'rows' => [],
                                    'subtotal' => 0,
                                ];
                            }

                            $sections[$sectionKey]['rows'][] = [
                                'key' => $key,
                                'name' => $label,
                                'value' => $value,
                                'price' => $price,
                            ];

                            $sections[$sectionKey]['subtotal'] += $price;
                        }
                    }
                }

                $pdfAlias = $this->generateUniquePdfPath('@frontend/../files/brif', 'Web Studio INTRID ' . ($post['tel'] ?? ''));
                $renderData = [
                    'name' => !empty($post['name']) ? $post['name'] : 'Не укзан',
                    'table' => $sections,
                    'sum' => ($post['calc-sum'] ?? '') . ' ₽ ',
                ];

                $text = "<p>Расчет калькулятора данные во вложении</p>"
                    . "<p><b>Имя:</b> " . $post['name'] . "</p>"
                    . "<p><b>E-mail:</b> <a >" . $post['email'] . "</a></p>"
                    . "<p><b>Телефон:</b> " . $post['tel'] . "</p>"
                    . "<p><b>Сообщение:</b> " . $post['mess'] . "</p>"
                    . "";
                $replayTo = !empty($post['email']) ? $post['email'] : null;

                $queued = $this->enqueueEmail(
                    $text,
                    'Калькулятор',
                    null,
                    null,
                    [
                        'filename' => $pdfAlias,
                        'view' => '@frontend/views/submit/pdfc.php',
                        'params' => $renderData,
                        'options' => ['title' => 'Krajee Report Title'],
                    ],
                    $replayTo,
                    $userFilePaths
                );

                if (!$queued) {
                    return [
                        'status' => false,
                        'data' => self::QUEUE_ERROR_MESSAGE,
                    ];
                }

                return [
                    'status' => true,
                    'data' => 'Успешно отправлено. <br>В ближайшее время мы сформируем и пришлём Вам индивидуальный проект.',
                ];
            } else {
                return ['status' => false, 'data' => 'Капча введена неверно'];
            }
        } else {
            return false;
        }
    }

    public function actionTestPdf()
    {
        Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;

        // 1. МОК-МАССИВ ДАННЫХ (имитация расчета)
        // Итоговые суммы
        $totalMin = 60500;
        $totalMax = 145500;

        $sections = [
            [
                'title' => 'Программное обеспечение',
                'rows' => [
                    ['name' => 'Движок сайта с защитой от взлома iCMS, для лендинга', 'min' => 10000, 'max' => 30000],
                    ['name' => 'Форма обратной связи с отправкой на email', 'min' => 4500, 'max' => 4500],
                ],
                'subtotal' => ['min' => 14500, 'max' => 34500],
            ],
            [
                'title' => 'Общая стоимость работ:',
                'rows' => [
                    ['name' => 'Аналитическая работа, детальная проработка ТЗ и прототипирование основных страниц', 'min' => 0, 'max' => 15000],
                    [
                        // Многострочный текст передаем как HTML с <br> или <ul> внутри
                        'name' => 'Разработка современного уникального дизайна сайта, включая:<br>'
                            . '• UI/UX исследование тематики и предпочтений целевой аудитории.<br>'
                            . '• Разработка оптимальной структуры лэндинга<br>'
                            . '• Предоставляется несколько концепций дизайн-макетов<br>'
                            . '• Неограниченное кол-во правок и доработок, до полного одобрения Заказчиком',
                        'min' => 25000,
                        'max' => 45000
                    ],
                    ['name' => 'Верстка каркасной страницы с элементами инфографики', 'min' => 10000, 'max' => 15000],
                    ['name' => 'Разработка и вёрстка интерфейсов', 'min' => 2000, 'max' => 2000],
                    ['name' => 'Разработка и внедрение слайдеров (2 типа)', 'min' => 0, 'max' => 6000],
                    ['name' => 'Разработка визуальных эффектов методами HTML5 и CSS3', 'min' => 0, 'max' => 10000],
                    ['name' => 'Адаптивный дизайн и вёрстка под мобильные устройства', 'min' => 9000, 'max' => 9000],
                    ['name' => 'СЕО-анализ и оптимизация сайта', 'min' => 0, 'max' => 9000],
                    ['name' => 'Установка и настройка защищённого соединения (SSL-сертификат)', 'min' => 0, 'max' => 0],
                    ['name' => 'Консультирование по работе с сайтом', 'min' => 0, 'max' => 0],
                    ['name' => 'Создание уникальной иконки сайта', 'min' => 0, 'max' => 0],
                    ['name' => 'Интегрирование с соцсетями', 'min' => 0, 'max' => 0],
                    ['name' => 'Приведение форм обратной связи в соответствии с 152-ФЗ', 'min' => 0, 'max' => 0],
                    ['name' => 'Установка интерактивной карты Яндекс.Карты', 'min' => 0, 'max' => 0],
                ],
                // У второй секции на скрине нет отдельной строки "Итого по разделу", 
                // поэтому subtotal здесь можно оставить пустым или не передавать вовсе
                'subtotal' => null,
            ],
        ];


        // 2. ПОДГОТОВКА ДАННЫХ ДЛЯ VIEW (pdfc.php)
        // Используем уникальное имя файла
        $pdfAlias = $this->generateUniquePdfPath('@frontend/../files/brif', 'Test_Calculation_' . time());

        $renderData = [
            'name' => 'Тестовый Клиент (Admin Check)', // Имя заказчика
            'sections' => $sections,                   // Структура секций
            'totalMin' => $totalMin,                   // Общий Min
            'totalMax' => $totalMax,                   // Общий Max
        ];

        // 3. ОТПРАВКА ЧЕРЕЗ ОЧЕРЕДЬ
        // Укажите здесь реальный email админа, куда должно прийти письмо
        $text = "<p>Это тестовое письмо для проверки верстки PDF.</p>"
            . "<p>Данные сформированы мок-методом actionTestPdf.</p>";

        $queued = $this->enqueueEmail(
            $text,
            'ТЕСТ: PDF Расчет (Mock Data)',  // Тема письма
            null,                     // Кому (если null, уйдет на дефолтный из конфига)
            null,                            // От кого (имя)
            [
                'filename' => $pdfAlias,
                'view' => '@frontend/views/submit/pdfc.php', // Путь к вашему view
                'params' => $renderData,
                'options' => ['title' => 'Коммерческое предложение INTRID'],
            ],
            null // Reply-To
        );

        if (!$queued) {
            return [
                'status' => false,
                'data' => self::QUEUE_ERROR_MESSAGE,
            ];
        }

        return [
            'status' => true,
            'data' => 'Тестовый PDF успешно поставлен в очередь на отправку',
        ];
    }



    public function actionDomain()
    {
        $request = Yii::$app->request;
        $post = $request->post();
        $inputDomain = trim((string)($post['domain'] ?? $request->get('domain', '')));
        $result = $this->checkDomainAvailability($inputDomain);

        $fields = [
            'domain' => 'Domain',
            'nserver' => 'NS-серверы',
            'state' => 'Состояние',
            'person' => 'Владелец',
            'registrar' => 'Регистратор',
            'admin-contact' => 'Контакт администратора',
            'created' => 'Дата создания',
            'paid-till' => 'Оплачен до',
            'free-date' => 'Дата освобождения',
            'status' => 'Статус',
            'expiration' => 'Истекает',
        ];

        $infoRows = [];
        foreach ($fields as $key => $label) {
            if (empty($result[$key])) {
                continue;
            }

            $value = $result[$key];
            if (is_array($value)) {
                $value = implode(', ', $value);
            }

            $infoRows[] = [
                'key' => $key,
                'label' => $label,
                'value' => $value,
            ];
        }

        if ($request->isPost) {
            $free = '<div class="success-domain">Домен свободен</div>';
            $free .= $this->renderPartial('/short/form_domen', ['domain' => $inputDomain]);

            if (!$result['valid']) {
                $data['text'] = "<div class='error-domain'>Укажите корректный домен</div>";
            } elseif ($result['available']) {
                $data['text'] = $free;
            } else {
                $rows = [];
                foreach ($infoRows as $row) {
                    $rows[] = "<tr><td>{$row['label']}</td><td>{$row['value']}</td></tr>";
                }
                $table = implode('', $rows);
                $data['text'] = "<span class='error-domain'>Домен занят</span> <div class='table-block table--beauty table--wrap overflow-hidden mt-16'><table class='table table--noborder table--responsive'>{$table}</table></div>";
            }

            Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
            return $data;
        }

        $displayDomain = $result['domain'] ?: ($result['asciiDomain'] ?? '');
        if ($displayDomain === '' && $inputDomain !== '') {
            $displayDomain = $inputDomain;
        }

        return $this->render('domain', [
            'query' => $inputDomain,
            'result' => $result,
            'infoRows' => $infoRows,
            'displayDomain' => $displayDomain,
        ]);
    }


    public function actionHostDomain()
    {
        Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
        $post = Yii::$app->request->post();

        // print_r($post);
        $replayTo = !empty($post['email']) ?  $post['email'] : null;
        if (!$this->enqueueEmail(['domain_email', $post], 'Регистрация домена', null, null, null, $replayTo)) {
            return [
                'status' => false,
                'data' => self::QUEUE_ERROR_MESSAGE,
            ];
        }
        return [
            'status' => true,
            'data' => 'Ваше письмо успешно отправлено',
        ];
    }

    private function checkDomainAvailability(string $domain): array
    {
        $result = [
            'available'     => false,
            'domain'        => trim($domain),
            'asciiDomain'   => '',
            'status'        => [],
            'registrar'     => null,
            'expiration'    => null,
            'valid'         => false,

            // дополнительные WHOIS-поля
            'nserver'       => [],
            'state'         => null,
            'person'        => null,
            'admin-contact' => null,
            'created'       => null,
            'paid-till'     => null,
            'free-date'     => null,
        ];

        $normalized = $this->normalizeDomain($domain);

        if ($normalized === '') {
            $result['status'] = ['Некорректный формат домена'];
            return $result;
        }

        $result['asciiDomain'] = $normalized;
        $result['valid'] = true;

        $info = $this->getDomainInfo($normalized);

        if ($info === false) {
            $result['available'] = true;

            if ($result['domain'] === '') {
                $result['domain'] = $normalized;
            }

            return $result;
        }

        $display = $info['unicodeName'] ?? $info['domain'] ?? $normalized;

        if ($display === null || $display === '') {
            $display = $normalized;
        }

        if ($display === $normalized && function_exists('idn_to_utf8')) {
            $unicode = idn_to_utf8($normalized, IDNA_DEFAULT, INTL_IDNA_VARIANT_UTS46);

            if ($unicode !== false && $unicode !== '') {
                $display = $unicode;
            }
        }

        $status = $info['status'] ?? [];

        if (!is_array($status)) {
            $status = $status !== null ? [$status] : [];
        }

        $result['domain'] = $display;
        $result['status'] = $status;
        $result['registrar'] = $info['registrar'] ?? null;
        $result['expiration'] = $info['events']['expiration'] ?? null;

        // дополнительные данные из WHOIS/RDAP
        $result['nserver'] = $info['nserver']
            ?? $info['nameServers']
            ?? $info['nameservers']
            ?? [];

        if (!is_array($result['nserver'])) {
            $result['nserver'] = [$result['nserver']];
        }

        $result['state'] = $info['state']
            ?? (!empty($status) ? implode(', ', $status) : null);

        $result['person'] = $info['person']
            ?? $info['registrant']
            ?? $info['owner']
            ?? null;

        $result['admin-contact'] = $info['admin-contact']
            ?? $info['adminContact']
            ?? null;

        $result['created'] = $info['created']
            ?? $info['events']['registration']
            ?? $info['events']['created']
            ?? null;

        $result['paid-till'] = $info['paid-till']
            ?? $info['paidTill']
            ?? $info['events']['expiration']
            ?? null;

        $result['free-date'] = $info['free-date']
            ?? $info['freeDate']
            ?? null;

        return $result;
    }

    public function actionAnalizSite()
    {
        $post = Yii::$app->request->post();
        $raw = $post['site'] ?? '';

        if (isset($_GET['domain'])) {
            $raw = (string)$_GET['domain'];
        }

        Yii::error(['stage' => 'input', 'raw' => $raw], 'analiz');

        $site = $this->normalizeDomain($raw);

        Yii::error(['stage' => 'afterNormalize', 'site' => $site], 'analiz');

        if ($site === '') {
            Yii::$app->session->setFlash('error', Yii::$app->params['message_analiz_error_site']);
            return $this->redirect(Yii::$app->request->referrer);
        }

        $cache = Yii::$app->cache;
        $domainTag = "domain:{$site}";

        // Позволяем руками сбросить кэш: /submit/analiz-site?domain=example.ru&refresh=1
        if ((int)Yii::$app->request->get('refresh', 0) === 1) {
            TagDependency::invalidate($cache, $domainTag);
            Yii::error(['stage' => 'cache.invalidate', 'tag' => $domainTag], 'analiz');
        }

        // ---- 1) Кэшируем RDAP/WHOIS
        $rdapKey = "analiz:rdap:{$site}";
        $info = $cache->get($rdapKey);
        $cachedRdap = $info !== false;

        if (!$cachedRdap) {
            // Пытаемся получить «настоящие» данные
            $freshInfo = $this->getDomainInfo($site);
            if ($freshInfo === false) {
                $info = $this->createFallbackDomainInfo($site);
                // Кэшируем фолбэк, чтобы не долбить источники WHOIS/RDAP
                $cache->set($rdapKey, $info, 600, new TagDependency(['tags' => [$domainTag, 'rdap']]));
                Yii::warning(['stage' => 'rdap', 'cached' => false, 'info' => 'fallback'], 'analiz');
            } else {
                // Пишем в кэш на сутки
                $cache->set($rdapKey, $freshInfo, 86400, new TagDependency(['tags' => [$domainTag, 'rdap']]));
                $info = $freshInfo;
            }
        }

        if (!is_array($info)) {
            $info = $this->createFallbackDomainInfo($site);
        }

        Yii::error(['stage' => 'rdap', 'cached' => $cachedRdap, 'info' => $info], 'analiz');

        // ---- 2) Кэшируем разбор страницы сайта (title/h1/meta/ssl/и т. д.)
        $pageKey = "analiz:page:{$site}";
        $data = $cache->get($pageKey);
        $cachedPage = $data !== false;

        if (!$cachedPage) {
            $freshData = $this->infoSite($site, $info);
            if (empty($freshData) || ($freshData['status'] ?? false) === false) {
                // Негативный кэш на 60 сек, чтобы не долбить сайт при временной ошибке
                $cache->set($pageKey, ['status' => false], 60, new TagDependency(['tags' => [$domainTag, 'page']]));
                Yii::error(['stage' => 'infoSite', 'cached' => false, 'data' => ['status' => false]], 'analiz');

                Yii::$app->session->setFlash('error', Yii::$app->params['message_analiz_error_site']);
                return $this->redirect(Yii::$app->request->referrer);
            }
            // Успешный ответ — кэшируем на 15 минут
            $cache->set($pageKey, $freshData, 900, new TagDependency(['tags' => [$domainTag, 'page']]));
            $data = $freshData;
        }

        Yii::error(['stage' => 'infoSite', 'cached' => $cachedPage, 'data' => $data], 'analiz');

        if (empty($data) || ($data['status'] ?? false) === false) {
            Yii::$app->session->setFlash('error', Yii::$app->params['message_analiz_error_site']);
            return $this->redirect(Yii::$app->request->referrer);
        }

        $this->searchEnginesCheck($site, $data);

        Yii::error(['stage' => 'afterSearchEngines', 'data' => $data], 'analiz');

        $report = $this->generateReport($info, $data);

        return $this->render('analiz-site', ['model' => $data, 'report' => $report]);
    }

    // actionGetSeoData — новый экшен для AJAX-запросов, возвращает только SEO-данные в JSON
    public function actionGetSeoData()
    {
        $this->enableCsrfValidation = false;
        Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;

        $url = Yii::$app->request->post('url');
        if (!$url) {
            $raw = Yii::$app->request->getRawBody();
            $data = json_decode($raw, true);
            $url = $data['url'] ?? null;
        }

        if (!$url) {
            return ['success' => false, 'error' => 'URL не указан'];
        }

        $site = $this->normalizeDomain($url);
        if (!$site) {
            return ['success' => false, 'error' => 'Некорректный URL'];
        }

        $cache = Yii::$app->cache;
        $domainTag = "domain:{$site}";
        $pageKey = "analiz:page:{$site}";
        $data = $cache->get($pageKey);

        if ($data === false) {
            $rdapKey = "analiz:rdap:{$site}";
            $info = $cache->get($rdapKey);
            if ($info === false) {
                $info = $this->getDomainInfo($site);
                if ($info === false) {
                    $info = $this->createFallbackDomainInfo($site);
                }
                $cache->set($rdapKey, $info, 86400, new TagDependency(['tags' => [$domainTag, 'rdap']]));
            }

            $freshData = $this->infoSite($site, $info);
            if (empty($freshData) || ($freshData['status'] ?? false) === false) {
                return ['success' => false, 'error' => 'Не удалось получить данные о сайте'];
            }
            $cache->set($pageKey, $freshData, 900, new TagDependency(['tags' => [$domainTag, 'page']]));
            $data = $freshData;
        }

        $first = function ($arr, $idx = 1) {
            return (!empty($arr[$idx][0]) && is_string($arr[$idx][0])) ? trim($arr[$idx][0]) : '';
        };

        $h2List = [];
        if (isset($data['h2']) && is_array($data['h2'])) {
            for ($i = 1; $i <= count($data['h2']); $i++) {
                if (!empty($data['h2'][$i][0])) {
                    $h2List[] = trim($data['h2'][$i][0]);
                }
            }
        }

        $wordCount = (int)($data['wordCount'] ?? 0);

        return [
            'success' => true,
            'data' => [
                'title'       => $first($data['title'] ?? []),
                'description' => isset($data['description'][0]) ? trim($data['description'][0]) : '',
                'h1'          => $first($data['h1'] ?? []),
                'h2'          => $h2List,
                'keywords'    => isset($data['keywords'][0]) ? trim($data['keywords'][0]) : '',
                'wordCount'   => $wordCount,
                'ssl'         => (bool)($data['ssl'] ?? false),
                'ip'          => $data['ip'] ?? null,
                'status'      => $data['status'] ?? false,
            ]
        ];
    }

    // beforeAction
    public function beforeAction($action)
    {
        if ($action->id === 'get-seo-data') {
            $this->enableCsrfValidation = false;
        }
        return parent::beforeAction($action);
    }

    private function searchEnginesCheck(string $site, array &$data)
    {
        $cache = Yii::$app->cache;
        $domainTag = "domain:{$site}";
        if (($data['search']['status'] ?? -1) < 0) {
            $idxKey = "analiz:index:{$site}";
            $searchData = $cache->get($idxKey);
            if ($searchData === false) {
                $searchData = $this->estimateIndexing($site); // ниже хелпер
                // Кэш на 12 часов, чтобы не долбить выдачу
                $cache->set($idxKey, $searchData, 3600, new TagDependency(['tags' => [$domainTag, 'index']]));
            }
            // Приводим к твоему формату
            $data['search'] = [
                'status' => 1,
                'data'   => [
                    'google' => (int)($searchData['google'] ?? 0),
                    'yandex' => (int)($searchData['yandex'] ?? 0),
                ],
            ];
        }

        // Ссылочный профиль (упоминания как прокси для бэков)
        if (($data['back']['status'] ?? -1) < 0) {
            $backKey = "analiz:back:{$site}";
            $backData = $cache->get($backKey);
            if ($backData === false) {
                $backData = $this->estimateMentions($site); // ниже хелпер
                // Кэш на 24 часа
                $cache->set($backKey, $backData, 3600, new TagDependency(['tags' => [$domainTag, 'back']]));
            }
            // Маппинг к структуре, ожидаемой твоим view
            $data['back'] = [
                'status' => 1,
                'data'   => [
                    'total' => [
                        'links'               => (int)($backData['total_mentions'] ?? 0),
                        'links_dofollow_total' => (int)($backData['estimated_indexed'] ?? 0), // очень грубо
                        'links_unique'        => (int)($backData['unique_urls'] ?? 0),
                        'anchors_unique'      => (int)($backData['unique_anchors'] ?? 0),
                    ],
                    'donors' => [
                        'ips'     => (int)($backData['ref_ips'] ?? 0),      // оценка по хостам
                        'domains' => (int)($backData['ref_domains'] ?? 0),  // кол-во уникальных доменов-источников
                        'zones'   => array_map(fn($tld) => ['z' => $tld], $backData['zones'] ?? []),
                    ],
                ],
            ];
        }
    }

    private function generateReport($info, $data)
    {
        // --- Возраст по RDAP
        $ageYears = 0;
        $ageMonths = 0;
        if (!empty($info['events']['registration'])) {
            try {
                $reg = new \DateTime($info['events']['registration']);
                $now = new \DateTime('now');
                $diff = $reg->diff($now);
                $ageYears = (int)$diff->y;
                $ageMonths = (int)$diff->m;
            } catch (\Throwable $e) {
                Yii::error(['stage' => 'age_calc_error', 'err' => $e->getMessage()], 'analiz');
            }
        }

        // --- SEO-поля
        $first = static function ($arr, $idx = 1) {
            return (!empty($arr[$idx][0]) && is_string($arr[$idx][0])) ? trim($arr[$idx][0]) : '';
        };
        $title = $first($data['title'] ?? []);
        $h1    = $first($data['h1'] ?? []);
        $desc  = (!empty($data['description'][0]) && is_string($data['description'][0])) ? trim($data['description'][0]) : '';
        $keys  = (!empty($data['keywords'][0])   && is_string($data['keywords'][0]))   ? trim($data['keywords'][0])   : '';

        $len = static function (string $s): int {
            return function_exists('mb_strlen') ? mb_strlen($s) : strlen($s);
        };

        // --- Нормализация "Ссылочного профиля"
        $linksBlock = [
            'total'         => 0,
            'indexed'       => 0,
            'uniqueUrls'    => 0,
            'uniqueAnchors' => 0,
            'refIps'        => 0,
            'refDomains'    => 0,
            'zones'         => [],
        ];

        $back = $data['back'] ?? [];
        if (($back['status'] ?? -1) >= 0) {
            // Вариант А: как в твоём логе (data->total / data->donors)
            if (isset($back['data']['total']) || isset($back['data']['donors'])) {
                $total  = $back['data']['total']  ?? [];
                $donors = $back['data']['donors'] ?? [];

                $linksBlock['total']         = (int)($total['links']                ?? 0);
                $linksBlock['indexed']       = (int)($total['links_dofollow_total'] ?? 0);
                $linksBlock['uniqueUrls']    = (int)($total['links_unique']         ?? 0);
                $linksBlock['uniqueAnchors'] = (int)($total['anchors_unique']       ?? 0);
                $linksBlock['refIps']        = (int)($donors['ips']                  ?? 0);
                $linksBlock['refDomains']    = (int)($donors['domains']              ?? 0);

                // zones могут быть как ['com','ru'] либо [ ['z'=>'com'], ['z'=>'ru'] ]
                $zones = $donors['zones'] ?? [];
                $linksBlock['zones'] = array_values(array_filter(array_map(function ($z) {
                    if (is_array($z) && isset($z['z'])) return (string)$z['z'];
                    return is_string($z) ? $z : null;
                }, $zones)));
            }
            // Вариант Б: плоская схема (на всякий случай)
            else {
                $linksBlock['total']         = (int)($back['total']          ?? 0);
                $linksBlock['indexed']       = (int)($back['indexed']        ?? 0);
                $linksBlock['uniqueUrls']    = (int)($back['unique_urls']    ?? 0);
                $linksBlock['uniqueAnchors'] = (int)($back['unique_anchors'] ?? 0);
                $linksBlock['refIps']        = (int)($back['ref_ips']        ?? 0);
                $linksBlock['refDomains']    = (int)($back['ref_domains']    ?? 0);
                $linksBlock['zones']         = array_values(array_filter((array)($back['zones'] ?? [])));
            }
        }

        // --- Нормализация "Индексации"
        $indexBlock = [
            'google' => 0,
            'yandex' => 0,
        ];
        $srch = $data['search'] ?? [];
        if (($srch['status'] ?? -1) >= 0) {
            if (isset($srch['data'])) {
                $indexBlock['google'] = (int)($srch['data']['google'] ?? 0);
                $indexBlock['yandex'] = (int)($srch['data']['yandex'] ?? 0);
            } else {
                $indexBlock['google'] = (int)($srch['google'] ?? 0);
                $indexBlock['yandex'] = (int)($srch['yandex'] ?? 0);
            }
        }

        // --- SSL
        $sslOk = !empty($data['ssl']);

        // --- Собираем отчёт
        return [
            'domainData' => [
                'ageYears'   => $ageYears,
                'ageMonths'  => $ageMonths,
                'ip'         => $data['ip'] ?? null,
                'sslOk'      => $sslOk,
            ],
            'seo' => [
                'title'          => $title,
                'titleLen'       => $len($title),
                'description'    => $desc,
                'descriptionLen' => $len($desc),
                'keywords'       => $keys,
                'keywordsLen'    => $len($keys),
                'h1'             => $h1,
                'h1Len'          => $len($h1),
            ],
            'links' => $linksBlock,
            'index' => $indexBlock,
            'raw'   => [
                'info' => $info,
                'data' => $data,
            ],
        ];
    }


    private function estimateIndexing(string $domain): array
    {
        $client = new \yii\httpclient\Client(['transport' => \yii\httpclient\CurlTransport::class]);
        $ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

        $res = ['google' => 0, 'yandex' => 0];

        $requests = [
            'google' => $client->createRequest()->setMethod('GET')
                ->setUrl('https://www.google.com/search?q=' . rawurlencode('site:' . $domain) . '&hl=ru')
                ->addHeaders(['User-Agent' => $ua, 'Accept-Language' => 'ru-RU,ru;q=0.9,en;q=0.8'])
                ->setOptions([CURLOPT_TIMEOUT => 10, CURLOPT_CONNECTTIMEOUT => 5, CURLOPT_FOLLOWLOCATION => true, CURLOPT_MAXREDIRS => 3]),
            'yandex' => $client->createRequest()->setMethod('GET')
                ->setUrl('https://yandex.ru/search/?text=' . rawurlencode('site:' . $domain))
                ->addHeaders(['User-Agent' => $ua, 'Accept-Language' => 'ru-RU,ru;q=0.9,en;q=0.8'])
                ->setOptions([CURLOPT_TIMEOUT => 10, CURLOPT_CONNECTTIMEOUT => 5, CURLOPT_FOLLOWLOCATION => true, CURLOPT_MAXREDIRS => 3]),
        ];

        try {
            $responses = $client->batchSend($requests);
        } catch (\Throwable $e) {
            Yii::error(['stage' => 'estimateIndexing.batch', 'err' => $e->getMessage()], 'analiz');
            $responses = [];
        }

        $g = $responses['google'] ?? null;
        if ($g instanceof \yii\httpclient\Response && $g->isOk) {
            $html = (string)$g->content;
            if (preg_match('/id="result-stats"[^>]*>(.*?)<\/div>/su', $html, $m)) {
                $num = preg_replace('/[^\d]/u', '', $m[1]);
                if ($num !== '') {
                    $res['google'] = (int)$num;
                }
            }
            if ($res['google'] === 0) {
                $text = strip_tags($html);
                if (preg_match('/\d[\d \x{00A0}\.,]*/u', $text, $m2)) {
                    $num = preg_replace('/[^\d]/u', '', $m2[0]);
                    if ($num !== '') {
                        $res['google'] = (int)$num;
                    }
                }
            }
        } elseif ($g === null) {
            Yii::error(['stage' => 'estimateIndexing.google', 'err' => 'no response'], 'analiz');
        }
        Yii::error(['stage' => 'estimateIndexing.google', 'res' => $res['google']], 'analiz');

        $y = $responses['yandex'] ?? null;
        if ($y instanceof \yii\httpclient\Response && $y->isOk) {
            $html = (string)$y->content;
            if (preg_match('/(?:Нашлось|Найдено)[^0-9]*([\d \x{00A0}]+)/u', strip_tags($html), $m)) {
                $num = preg_replace('/[^\d]/u', '', $m[1]);
                if ($num !== '') {
                    $res['yandex'] = (int)$num;
                }
            }
            if ($res['yandex'] === 0) {
                if (preg_match('/\d[\d \x{00A0}]{2,}/u', strip_tags($html), $m2)) {
                    $num = preg_replace('/[^\d]/u', '', $m2[0]);
                    if ($num !== '') {
                        $res['yandex'] = (int)$num;
                    }
                }
            }
        } elseif ($y === null) {
            Yii::error(['stage' => 'estimateIndexing.yandex', 'err' => 'no response'], 'analiz');
        }
        Yii::error(['stage' => 'estimateIndexing.result', 'res' => $res], 'analiz');

        return $res;
    }

    private function estimateMentions(string $domain): array
    {
        $client = new \yii\httpclient\Client(['transport' => \yii\httpclient\CurlTransport::class]);
        $ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

        $accumUrls  = [];
        $accumHosts = [];
        $totalEstimate = 0;

        // утилиты
        $addUrl = static function (string $url, string $domain) use (&$accumUrls, &$accumHosts) {
            if (!preg_match('~^https?://~i', $url)) return;
            $host = parse_url($url, PHP_URL_HOST);
            if (!$host) return;
            // пропускаем свой домен и поддомены
            if ($host === $domain || str_ends_with($host, '.' . $domain)) return;

            $accumUrls[$url]  = true;
            $accumHosts[$host] = true;
        };

        $extractNumber = static function (string $text): int {
            $text = strip_tags($text);
            if (preg_match('/\d[\d \x{00A0}\.,]*/u', $text, $m)) {
                $num = preg_replace('/[^\d]/u', '', $m[0]);
                if ($num !== '') return (int)$num;
            }
            return 0;
        };

        $q = '"' . $domain . '" -site:' . $domain;

        $requests = [];
        for ($start = 0; $start <= 20; $start += 10) {
            $url = 'https://www.google.com/search?udm=14&q=' . rawurlencode($q) . '&hl=ru&num=10&start=' . $start;
            $requests['g' . $start] = $client->createRequest()->setMethod('GET')->setUrl($url)
                ->addHeaders(['User-Agent' => $ua, 'Accept-Language' => 'ru-RU,ru;q=0.9,en;q=0.8'])
                ->setOptions([CURLOPT_TIMEOUT => 10, CURLOPT_CONNECTTIMEOUT => 5, CURLOPT_FOLLOWLOCATION => true, CURLOPT_MAXREDIRS => 3]);
        }

        // Bing и Яндекс
        $requests['bing'] = $client->createRequest()->setMethod('GET')
            ->setUrl('https://www.bing.com/search?q=' . rawurlencode($q) . '&count=50&setlang=ru')
            ->addHeaders(['User-Agent' => $ua, 'Accept-Language' => 'ru-RU,ru;q=0.9,en;q=0.8'])
            ->setOptions([CURLOPT_TIMEOUT => 10, CURLOPT_CONNECTTIMEOUT => 5, CURLOPT_FOLLOWLOCATION => true, CURLOPT_MAXREDIRS => 3]);

        $requests['yandex'] = $client->createRequest()->setMethod('GET')
            ->setUrl('https://yandex.ru/search/?text=' . rawurlencode($q) . '&lr=213')
            ->addHeaders(['User-Agent' => $ua, 'Accept-Language' => 'ru-RU,ru;q=0.9,en;q=0.8'])
            ->setOptions([CURLOPT_TIMEOUT => 10, CURLOPT_CONNECTTIMEOUT => 5, CURLOPT_FOLLOWLOCATION => true, CURLOPT_MAXREDIRS => 3]);

        try {
            $responses = $client->batchSend($requests);
        } catch (\Throwable $e) {
            Yii::error(['stage' => 'estimateMentions.batch', 'err' => $e->getMessage()], 'analiz');
            $responses = [];
        }

        // Google
        foreach ([0, 10, 20] as $start) {
            $key = 'g' . $start;
            $r = $responses[$key] ?? null;
            if ($r instanceof \yii\httpclient\Response && $r->isOk) {
                $html = (string)$r->content;
                if ($start === 0) {
                    $totalEstimate = max($totalEstimate, $extractNumber($html));
                }
                if (preg_match_all('/<a\s+[^>]*href="([^"]+)"[^>]*>/u', $html, $mm)) {
                    foreach ($mm[1] as $href) {
                        if (str_starts_with($href, '/url?')) {
                            if (preg_match('/[?&]q=([^&]+)/', $href, $mQ)) {
                                $href = urldecode($mQ[1]);
                            } else {
                                continue;
                            }
                        }
                        $addUrl($href, $domain);
                    }
                }
            } else {
                Yii::error(['stage' => 'estimateMentions.google', 'start' => $start, 'err' => 'no response'], 'analiz');
            }
        }

        // Bing
        $r = $responses['bing'] ?? null;
        if ($r instanceof \yii\httpclient\Response && $r->isOk) {
            $html = (string)$r->content;
            if (preg_match('/<span[^>]*class="sb_count"[^>]*>(.*?)<\/span>/su', $html, $m)) {
                $totalEstimate = max($totalEstimate, $extractNumber($m[1]));
            }
            if (preg_match_all('/<li[^>]*class="b_algo"[^>]*>.*?<h2>.*?<a\s+href="([^"]+)"/su', $html, $mm)) {
                foreach ($mm[1] as $href) {
                    $addUrl($href, $domain);
                }
            } elseif (preg_match_all('/<a\s+[^>]*href="(https?:\/\/[^"]+)"/u', $html, $mma)) {
                foreach ($mma[1] as $href) {
                    $addUrl($href, $domain);
                }
            }
        } else {
            Yii::error(['stage' => 'estimateMentions.bing', 'err' => 'no response'], 'analiz');
        }

        // Yandex
        $r = $responses['yandex'] ?? null;
        if ($r instanceof \yii\httpclient\Response && $r->isOk) {
            $html = (string)$r->content;
            if (preg_match('/(?:Нашлось|Найдено)[^0-9]*([\d \x{00A0}]+)/u', strip_tags($html), $m)) {
                $n = (int)preg_replace('/[^\d]/u', '', $m[1]);
                $totalEstimate = max($totalEstimate, $n);
            }
            if (preg_match_all('/<a\s+[^>]*href="(https?:\/\/[^"]+)"[^>]*>/u', $html, $mm)) {
                foreach ($mm[1] as $href) {
                    $addUrl($href, $domain);
                }
            }
        } else {
            Yii::error(['stage' => 'estimateMentions.yandex', 'err' => 'no response'], 'analiz');
        }

        // агрегирование
        $uniqueUrls  = array_keys($accumUrls);
        $uniqueHosts = array_keys($accumHosts);

        // Зоны доноров (TLD)
        $tlds = [];
        foreach ($uniqueHosts as $h) {
            $parts = explode('.', $h);
            $tld = count($parts) > 1 ? end($parts) : $h;
            $tlds[$tld] = true;
        }

        // грубая «индексируются»: доля от уникальных URL, но не больше общего эстимейта
        $estimatedIndexed = min(max($totalEstimate, count($uniqueUrls)), (int)round(count($uniqueUrls) * 0.7));

        $result = [
            'total_mentions'    => max($totalEstimate, count($uniqueUrls)), // чтобы не было 0
            'unique_urls'       => count($uniqueUrls),
            'ref_domains'       => count($uniqueHosts),
            'ref_ips'           => count($uniqueHosts), // без отдельного DNS-резолва — прокси
            'zones'             => array_keys($tlds),
            'estimated_indexed' => $estimatedIndexed,
            'unique_anchors'    => 0, // без парсинга страниц не посчитать
        ];

        Yii::error(['stage' => 'estimateMentions.result', 'res' => $result], 'analiz');
        return $result;
    }


    private function normalizeDomain(string $input): string
    {
        Yii::error(['stage' => 'normalize.start', 'input' => $input], 'analiz');

        $input = trim($input);
        for ($i = 0; $i < 3 && preg_match('/%[0-9A-Fa-f]{2}/', $input); $i++) {
            $input = rawurldecode($input);
            Yii::error(['stage' => 'normalize.decode', 'step' => $i, 'input' => $input], 'analiz');
        }

        if (preg_match('~^[a-z][a-z0-9+.-]*://~i', $input)) {
            $host = parse_url($input, PHP_URL_HOST);
            Yii::error(['stage' => 'normalize.parse_url', 'host' => $host], 'analiz');
            if ($host) $input = $host;
        }

        $input = preg_replace('~^www\.~i', '', $input);
        $input = preg_replace('~[:/].*$~', '', $input);

        $ascii = idn_to_ascii($input, IDNA_DEFAULT, INTL_IDNA_VARIANT_UTS46);
        Yii::error(['stage' => 'normalize.final', 'ascii' => $ascii], 'analiz');

        return $ascii ? strtolower($ascii) : '';
    }

    private function createFallbackDomainInfo(string $domain): array
    {
        return [
            'domain'      => $domain,
            'unicodeName' => null,
            'status'      => [],
            'nameservers' => [],
            'events'      => [
                'registration' => null,
                'expiration'   => null,
                'lastChanged'  => null,
            ],
            'registrar'   => null,
            'registrant'  => null,
            'raw'         => [],
            'fallback'    => true,
        ];
    }


    protected function getDomainInfo(string $domain)
    {
        // --- IDN → ASCII (punycode)
        $orig = trim($domain);
        if (function_exists('idn_to_ascii')) {
            $ascii = idn_to_ascii($orig, IDNA_DEFAULT, INTL_IDNA_VARIANT_UTS46);
            if ($ascii !== false) {
                $domain = $ascii;
            }
        }
        $domain = strtolower($domain);

        // --- 1) Пробуем RDAP через bootstrap (универсально и бесплатно)
        $rdap = $this->rdapFetch($domain);
        if (is_array($rdap)) {
            return $this->rdapNormalize($rdap, $domain);
        }

        // --- 2) Если это .ru или .рф → фолбэк на порт-43 WHOIS whois.tcinet.ru
        $isRu   = str_ends_with($domain, '.ru');
        $isRfn  = str_ends_with($domain, '.xn--p1ai'); // .рф
        if ($isRu || $isRfn) {
            $whoisText = $this->whoisFetchTcinet($domain);
            if ($whoisText !== false) {
                return $this->whoisNormalizeTcinet($whoisText, $domain, $orig);
            }
        }

        // Можно добавить другие фолбэки (например, публичные web-страницы whois конкретных реестров).
        return false;
    }

    /** ---------------- RDAP helpers ---------------- */

    private function rdapFetch(string $domain): array|false
    {
        $client = new Client();

        $endpoints = [];

        if (preg_match('/\.(ru|su|xn--p1ai)$/i', $domain)) {
            $endpoints[] = "https://rdap.nic.ru/domain/{$domain}";
        }

        $endpoints = array_merge($endpoints, [
            "https://rdap.org/domain/{$domain}",
            "https://www.rdap.net/domain/{$domain}",
            "https://rdap.iana.org/domain/{$domain}",
        ]);

        $endpoints = array_values(array_unique($endpoints));

        $requests = [];
        foreach ($endpoints as $url) {
            $requests[$url] = $client->createRequest()
                ->setMethod('GET')
                ->setUrl($url)
                ->addHeaders([
                    'Accept' => 'application/rdap+json, application/json;q=0.9',
                    'User-Agent' => 'AnalizSite/1.0',
                ])
                ->setOptions([
                    CURLOPT_TIMEOUT => 10,
                    CURLOPT_CONNECTTIMEOUT => 5,
                    CURLOPT_FOLLOWLOCATION => true,
                    CURLOPT_MAXREDIRS => 5,
                ]);
        }

        try {
            $responses = $client->batchSend($requests);
        } catch (\Throwable $e) {
            Yii::error(['stage' => 'rdap_error', 'err' => $e->getMessage()], 'analiz');
            $responses = [];
        }

        foreach ($endpoints as $url) {
            $resp = $responses[$url] ?? null;
            if ($resp instanceof \yii\httpclient\Response && $resp->isOk && is_array($resp->getData())) {
                $data = $resp->getData();
                if (!empty($data['ldhName']) || !empty($data['handle'])) {
                    return $data;
                }
            } else {
                Yii::error(['stage' => 'rdap_error', 'url' => $url, 'err' => 'no response'], 'analiz');
            }
        }

        return false;
    }

    private function rdapNormalize(array $raw, string $domain): array
    {
        $getFn = static function (array $entity): ?string {
            if (empty($entity['vcardArray'][1])) return null;
            foreach ($entity['vcardArray'][1] as $v) {
                if (is_array($v) && ($v[0] ?? null) === 'fn' && isset($v[3]) && is_string($v[3])) {
                    return $v[3];
                }
            }
            return null;
        };

        $events = ['registration' => null, 'expiration' => null, 'lastChanged' => null];
        foreach (($raw['events'] ?? []) as $ev) {
            $a = $ev['eventAction'] ?? '';
            $d = $ev['eventDate'] ?? null;
            if (!$d) continue;
            if ($a === 'registration') $events['registration'] = $d;
            elseif ($a === 'expiration') $events['expiration'] = $d;
            elseif (in_array($a, ['last changed', 'last update of RDAP database'], true)) $events['lastChanged'] = $d;
        }

        $registrar = $registrant = null;
        foreach (($raw['entities'] ?? []) as $e) {
            $roles = $e['roles'] ?? [];
            if (in_array('registrar', $roles, true))  $registrar  = $getFn($e) ?: ($e['handle'] ?? $registrar);
            if (in_array('registrant', $roles, true)) $registrant = $getFn($e) ?: ($e['handle'] ?? $registrant);
        }

        $ns = [];
        foreach (($raw['nameservers'] ?? []) as $n) {
            if (!empty($n['ldhName'])) $ns[] = strtolower($n['ldhName']);
        }

        return [
            'domain'      => $raw['ldhName'] ?? $domain,
            'unicodeName' => $raw['unicodeName'] ?? null,
            'status'      => $raw['status'] ?? [],
            'nameservers' => $ns,
            'events'      => $events,
            'registrar'   => $registrar,
            'registrant'  => $registrant,
            'raw'         => $raw,
        ];
    }

    /** ---------------- WHOIS (tcinet.ru) helpers ---------------- */

    private function whoisFetchTcinet(string $domain): string|false
    {
        $response = $this->whoisFetchTcinetSocket($domain);
        if (is_string($response) && $response !== '') {
            return $response;
        }

        $httpFallback = $this->whoisFetchTcinetHttp($domain);
        if (is_string($httpFallback) && $httpFallback !== '') {
            return $httpFallback;
        }

        return false;
    }

    private function whoisFetchTcinetSocket(string $domain): string|false
    {
        $server = 'whois.tcinet.ru';
        $port   = 43;
        $fp = @stream_socket_client("tcp://{$server}:{$port}", $errno, $errstr, 5, STREAM_CLIENT_CONNECT);
        if (!$fp) {
            Yii::error(['stage' => 'whois_connect_error', 'errno' => $errno, 'err' => $errstr], 'analiz');
            return false;
        }
        stream_set_timeout($fp, 10);
        fwrite($fp, $domain . "\r\n"); // стандарт WHOIS
        $response = stream_get_contents($fp);
        fclose($fp);
        if (!is_string($response) || $response === '') return false;
        return $response;
    }

    private function whoisFetchTcinetHttp(string $domain): string|false
    {
        $client = new Client([
            'transport' => \yii\httpclient\CurlTransport::class,
        ]);

        $urls = [
            'https://www.tcinet.ru/cgi-bin/whois?query=' . urlencode($domain),
            'https://www.tcinet.ru/cgi-bin/whois/?query=' . urlencode($domain),
            'https://www.tcinet.ru/whois/?domain=' . urlencode($domain),
        ];

        foreach ($urls as $url) {
            try {
                $response = $client->createRequest()
                    ->setMethod('GET')
                    ->setUrl($url)
                    ->addHeaders([
                        'User-Agent'      => self::SEO_AUDIT_DESKTOP_USER_AGENT,
                        'Accept'          => 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                        'Accept-Language' => self::SEO_AUDIT_ACCEPT_LANGUAGE,
                    ])
                    ->setOptions([
                        CURLOPT_TIMEOUT        => 10,
                        CURLOPT_CONNECTTIMEOUT => 5,
                        CURLOPT_FOLLOWLOCATION => true,
                        CURLOPT_MAXREDIRS      => 3,
                    ])
                    ->send();
            } catch (\Throwable $e) {
                Yii::error(['stage' => 'whois_http_error', 'url' => $url, 'err' => $e->getMessage()], 'analiz');
                continue;
            }

            if (!$response->isOk) {
                $status = $this->getResponseStatusCode($response, 'whois_http_error', ['url' => $url]);
                Yii::error(['stage' => 'whois_http_error', 'url' => $url, 'status' => $status], 'analiz');
                continue;
            }

            $content = (string)$response->content;
            $text = $this->whoisExtractTcinetText($content);
            if ($text !== '') {
                return $text;
            }
        }

        return false;
    }

    private function whoisExtractTcinetText(string $html): string
    {
        $decoded = html_entity_decode($html, ENT_QUOTES | ENT_HTML5, 'UTF-8');

        $fragments = [];
        if (preg_match('/<pre[^>]*>(.*?)<\/pre>/is', $decoded, $m)) {
            $fragments[] = $m[1];
        }
        if (preg_match('/<textarea[^>]*>(.*?)<\/textarea>/is', $decoded, $m)) {
            $fragments[] = $m[1];
        }
        $fragments[] = $decoded;

        foreach ($fragments as $fragment) {
            $plain = strip_tags($fragment);
            $plain = html_entity_decode($plain, ENT_QUOTES | ENT_HTML5, 'UTF-8');
            $plain = preg_replace('/\r\n?/', "\n", $plain);

            $lines = array_map(static function (string $line): string {
                $line = preg_replace('/\x{00A0}+/u', ' ', $line);
                return trim($line);
            }, explode("\n", (string)$plain));

            $filtered = array_values(array_filter($lines, static function (string $line): bool {
                if ($line === '') {
                    return false;
                }
                if (str_starts_with($line, '%')) {
                    return true;
                }
                return str_contains($line, ':');
            }));

            $text = trim(implode("\n", $filtered));
            if ($text !== '') {
                return $text;
            }
        }

        return '';
    }

    private function whoisNormalizeTcinet(string $text, string $domain, string $orig): array|false
    {
        // Простенький парсер "ключ: значение" + списки
        $lines = preg_split('/\r\n|\r|\n/u', $text);
        if (!$lines) return false;

        $kv = [];
        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '' || str_starts_with($line, '%')) continue; // комментарии в whois tcinet
            if (preg_match('/^([^:]+):\s*(.+)$/u', $line, $m)) {
                $key = mb_strtolower(trim($m[1]));
                $val = trim($m[2]);
                $kv[$key][] = $val; // допускаем повторяющиеся ключи
            }
        }

        // Примеры ключей у ТЦИ: "domain:", "nserver:", "state:", "admin-c:", "registrar:", "created:", "paid-till:", "free-date:", "source:"
        $ns = array_map(static fn($s) => strtolower(preg_replace('/\s+.+$/', '', $s)), $kv['nserver'] ?? []);

        $created = $kv['created'][0]   ?? null;
        $paidTill = $kv['paid-till'][0] ?? null; // аналог expiration
        $updated = $kv['last updated on'][0] ?? null;

        $registrar = $kv['registrar'][0]  ?? null;
        $status    = $kv['state']         ?? []; // может быть несколько

        // Для IDN вернём и Unicode имя (оригинальный ввод)
        $unicode = $orig;

        return [
            'domain'      => $domain,
            'unicodeName' => $unicode !== $domain ? $unicode : null,
            'status'      => $status,
            'nameservers' => $ns,
            'events'      => [
                'registration' => $created,
                'expiration'   => $paidTill,
                'lastChanged'  => $updated,
            ],
            'registrar'   => $registrar,
            'registrant'  => null, // в .RU/.РФ персональные данные часто скрыты; можно дообогащать по handle при необходимости
            'raw'         => ['whois' => $text],
        ];
    }

    public function actionLostProfit()
    {
        Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;

        try {
            $company = trim(Yii::$app->request->post('company', ''));
            $averageCheck = (float) Yii::$app->request->post('average_check', 0);
            $margin = (float) Yii::$app->request->post('margin', 0);

            if ($company === '' || $averageCheck <= 0 || $margin <= 0) {
                return ['success' => false, 'error' => 'Некорректные данные формы'];
            }

            $query = $company . ' отзыв';

            $apiKey = Yii::$app->params['yandexSearchApiKey'];
            $folderId = Yii::$app->params['yandexSearchFolderId'];

            $client = new \yii\httpclient\Client();

            $response = $client->createRequest()
                ->setMethod('POST')
                ->setUrl('https://searchapi.api.cloud.yandex.net/v2/wordstat/topRequests')
                ->addHeaders([
                    'Authorization' => 'Api-Key ' . $apiKey,
                    'Content-Type' => 'application/json',
                ])
                ->setContent(json_encode([
                    'phrase' => $query,
                    'numPhrases' => '1',
                    'regions' => [], // можно указать регион, например ['213'] для Москвы
                    'devices' => ['DEVICE_ALL'],
                    'folderId' => $folderId,
                ], JSON_UNESCAPED_UNICODE))
                ->send();

            if (!$response->isOk) {
                Yii::error($response->content, 'lost-profit-wordstat');

                return [
                    'success' => false,
                    'error' => 'Wordstat API вернул ошибку',
                ];
            }

            $data = $response->data;

            $frequency = isset($data['totalCount'])
                ? (int) $data['totalCount']
                : 0;

            $lostProfit = $frequency * $averageCheck * ($margin / 100);

            return [
                'success' => true,
                'query' => $query,
                'frequency' => $frequency,
                'average_check' => $averageCheck,
                'margin' => $margin,
                'lost_profit' => round($lostProfit),
            ];
        } catch (\Throwable $e) {
            Yii::error($e->getMessage() . "\n" . $e->getTraceAsString(), 'lost-profit');

            return [
                'success' => false,
                'error' => 'Ошибка расчета. Подробности записаны в лог.',
            ];
        }
    }



    // private function infoSite(string $site, ?array $domainInfo = null)
    // {
    //     // $site уже должен быть нормализован в ASCII (punycode) и без схемы.
    //     $host = trim($site);

    //     $client = new \yii\httpclient\Client([
    //         'transport' => \yii\httpclient\CurlTransport::class,
    //     ]);

    //     // 1) Пытаемся HTTPS и HTTP параллельно
    //     $httpsUrl = 'https://' . $host;
    //     $httpUrl  = 'http://' . $host;
    //     $urls = [$httpsUrl, $httpUrl];

    //     $requests = [];
    //     foreach ($urls as $u) {
    //         $requests[$u] = $client->createRequest()
    //             ->setMethod('GET')
    //             ->setUrl($u)
    //             ->setOptions([
    //                 CURLOPT_TIMEOUT        => 10,
    //                 CURLOPT_CONNECTTIMEOUT => 5,
    //                 // редиректы не обязаны; мы просто примем 301/302 как валидный статус ниже
    //                 CURLOPT_FOLLOWLOCATION => false,
    //             ]);
    //     }

    //     try {
    //         $responses = $client->batchSend($requests);
    //     } catch (\Throwable $e) {
    //         Yii::error(['stage' => 'http_error', 'err' => $e->getMessage()], 'analiz');
    //         $responses = [];
    //     }

    //     $response = null;
    //     foreach ($urls as $u) {
    //         $resp = $responses[$u] ?? null;
    //         if ($resp instanceof \yii\httpclient\Response) {
    //             $response = $resp;
    //             break;
    //         } else {
    //             Yii::error(['stage' => 'http_error', 'url' => $u, 'err' => 'no response'], 'analiz');
    //         }
    //     }

    //     $httpResponse = $responses[$httpUrl] ?? null;
    //     if (!$httpResponse instanceof \yii\httpclient\Response) {
    //         $httpResponse = null;
    //     }

    //     if ($response === null) {
    //         return $this->responseFalse();
    //     }

    //     // ВАЖНО: статус берём безопасно, чтобы избежать исключений из-за отсутствия заголовков
    //     $statusCode = $this->getResponseStatusCode($response, 'http_error', ['url' => $host]);
    //     if ($statusCode === 0) {
    //         return $this->responseFalse();
    //     }

    //     // Считаем допустимыми к «успеху» любые 2xx/3xx, а также 401/403 (частые ответы от WAF)
    //     if (($statusCode >= 200 && $statusCode < 400) || in_array($statusCode, [401, 403], true)) {
    //         $session = Yii::$app->session;
    //         $session['domain'] = $host; // без urlencode

    //         $data               = [];
    //         $data['status']     = true;
    //         $data['ip']         = gethostbyname($host);

    //         $content = (string)$response->content;

    //         // --- безопасные парсеры тегов
    //         $tag = [
    //             'title' => 'title',
    //             'h1'    => 'h1',
    //         ];

    //         $reg = [
    //             'title' => '{<' . $tag['title'] . '[^>]*>(.*?)</' . $tag['title'] . '>}is',
    //             'h1'    => '{<' . $tag['h1'] . '[^>]*>(.*?)</' . $tag['h1'] . '>}is',
    //             'd'     => '{<meta[^>]+name=["\']description["\'][^>]*>}is',
    //             'k'     => '{<meta[^>]+name=["\']keywords["\'][^>]*>}is',
    //         ];

    //         // title
    //         $array_1 = [];
    //         @preg_match_all($reg['title'], $content, $array_1, PREG_PATTERN_ORDER);
    //         $data['title'] = $array_1 ?? [];

    //         // h1
    //         $array_2 = [];
    //         @preg_match_all($reg['h1'], $content, $array_2, PREG_PATTERN_ORDER);
    //         $data['h1'] = $array_2 ?? [];

    //         // description
    //         $array_3 = [];
    //         @preg_match_all($reg['d'], $content, $array_3, PREG_PATTERN_ORDER);
    //         $desc = [];
    //         if (!empty($array_3[0])) {
    //             // вытаскиваем значение атрибута content="..."
    //             if (preg_match('/content\s*=\s*"(.*?)"/is', $array_3[0][0], $m)) {
    //                 $desc[] = $m[1];
    //             } elseif (preg_match("/content\s*=\s*'(.*?)'/is", $array_3[0][0], $m)) {
    //                 $desc[] = $m[1];
    //             }
    //         }
    //         $data['description'] = $desc;

    //         // keywords
    //         $array_5 = [];
    //         @preg_match_all($reg['k'], $content, $array_5, PREG_PATTERN_ORDER);
    //         $keys = [];
    //         if (!empty($array_5[0])) {
    //             if (preg_match('/content\s*=\s*"(.*?)"/is', $array_5[0][0], $m)) {
    //                 $keys[] = $m[1];
    //             } elseif (preg_match("/content\s*=\s*'(.*?)'/is", $array_5[0][0], $m)) {
    //                 $keys[] = $m[1];
    //             }
    //         }
    //         $data['keywords'] = $keys;

    //         // Остальное — как у вас
    //         $data['search'] = $this->visionSite($host);
    //         $data['back']   = $this->bankLink($host);
    //         $data['ssl']    = $this->getSSL($host, $httpResponse);

    //         $h = $this->getDateSite($host, $domainInfo);
    //         $data['srok'] = [
    //             'year'   => $h['year']   ?? null,
    //             'mounth' => $h['mounth'] ?? null,
    //         ];

    //         // Покажем красивое имя для IDN
    //         if (function_exists('idn_to_utf8')) {
    //             $utf = idn_to_utf8($host, IDNA_DEFAULT, INTL_IDNA_VARIANT_UTS46);
    //             $data['site-name'] = $utf !== false ? $utf : $host;
    //         } else {
    //             $data['site-name'] = $host;
    //         }

    //         return $data;
    //     }

    //     // Если код не из допустимых — считаем неуспехом
    //     return $this->responseFalse();
    // }

    // Новый метод infoSite
    private function infoSite(string $site, ?array $domainInfo = null)
    {
        $host = trim($site);
        $client = new \yii\httpclient\Client(['transport' => \yii\httpclient\CurlTransport::class]);
        $httpsUrl = 'https://' . $host;
        $httpUrl  = 'http://' . $host;
        $urls = [$httpsUrl, $httpUrl];

        $requests = [];
        foreach ($urls as $u) {
            $requests[$u] = $client->createRequest()
                ->setMethod('GET')
                ->setUrl($u)
                ->setOptions([
                    CURLOPT_TIMEOUT        => 10,
                    CURLOPT_CONNECTTIMEOUT => 5,
                    CURLOPT_FOLLOWLOCATION => false,
                ]);
        }

        try {
            $responses = $client->batchSend($requests);
        } catch (\Throwable $e) {
            Yii::error(['stage' => 'http_error', 'err' => $e->getMessage()], 'analiz');
            $responses = [];
        }

        $response = null;
        foreach ($urls as $u) {
            $resp = $responses[$u] ?? null;
            if ($resp instanceof \yii\httpclient\Response) {
                $response = $resp;
                break;
            }
        }

        $httpResponse = $responses[$httpUrl] ?? null;
        if (!$httpResponse instanceof \yii\httpclient\Response) {
            $httpResponse = null;
        }

        if ($response === null) {
            return $this->responseFalse();
        }

        $statusCode = $this->getResponseStatusCode($response, 'http_error', ['url' => $host]);
        if ($statusCode === 0) {
            return $this->responseFalse();
        }

        if (($statusCode >= 200 && $statusCode < 400) || in_array($statusCode, [401, 403], true)) {
            $session = Yii::$app->session;
            $session['domain'] = $host;

            $data = [];
            $data['status'] = true;
            $data['ip'] = gethostbyname($host);
            $content = (string)$response->content;

            // Парсим HTML через DOMDocument
            $dom = new \DOMDocument();
            $internalErrors = libxml_use_internal_errors(true);
            $dom->loadHTML('<?xml encoding="UTF-8">' . $content);
            libxml_use_internal_errors($internalErrors);
            $xpath = new \DOMXPath($dom);

            // Title
            $titleNodes = $xpath->query('//title');
            $title = $titleNodes->length > 0 ? trim($titleNodes->item(0)->textContent) : '';
            $data['title'] = $title ? [1 => [0 => $title]] : [];

            // H1
            $h1Nodes = $xpath->query('//h1');
            $h1List = [];
            foreach ($h1Nodes as $node) {
                $h1List[] = trim($node->textContent);
            }
            $data['h1'] = [];
            if (!empty($h1List)) {
                foreach ($h1List as $idx => $h1) {
                    $data['h1'][$idx + 1] = [0 => $h1];
                }
            }

            // H2
            $h2Nodes = $xpath->query('//h2');
            $h2List = [];
            foreach ($h2Nodes as $node) {
                $h2List[] = trim($node->textContent);
            }
            $data['h2'] = [];
            if (!empty($h2List)) {
                foreach ($h2List as $idx => $h2) {
                    $data['h2'][$idx + 1] = [0 => $h2];
                }
            }

            // Meta description
            $descNodes = $xpath->query('//meta[@name="description"]/@content');
            $description = $descNodes->length > 0 ? trim($descNodes->item(0)->value) : '';
            $data['description'] = $description ? [0 => $description] : [];

            // Meta keywords
            $kwNodes = $xpath->query('//meta[@name="keywords"]/@content');
            $keywords = $kwNodes->length > 0 ? trim($kwNodes->item(0)->value) : '';
            $data['keywords'] = $keywords ? [0 => $keywords] : [];

            // Количество слов в body
            $bodyNodes = $xpath->query('//body');
            $bodyText = '';
            if ($bodyNodes->length > 0) {
                $bodyText = $bodyNodes->item(0)->textContent;
            }
            $wordCount = str_word_count(strip_tags($bodyText), 0);
            $data['wordCount'] = $wordCount;

            // Остальные данные
            $data['search'] = $this->visionSite($host);
            $data['back']   = $this->bankLink($host);
            $data['ssl']    = $this->getSSL($host, $httpResponse);

            $h = $this->getDateSite($host, $domainInfo);
            $data['srok'] = [
                'year'   => $h['year']   ?? null,
                'mounth' => $h['mounth'] ?? null,
            ];

            if (function_exists('idn_to_utf8')) {
                $utf = idn_to_utf8($host, IDNA_DEFAULT, INTL_IDNA_VARIANT_UTS46);
                $data['site-name'] = $utf !== false ? $utf : $host;
            } else {
                $data['site-name'] = $host;
            }

            return $data;
        }

        return $this->responseFalse();
    }

    /**
     * Возвращает HTTP-статус ответа, перехватывая исключения клиента.
     *
     * @param \yii\httpclient\Response $response
     * @param string $stage
     * @param array<string, mixed> $context
     */
    private function getResponseStatusCode(\yii\httpclient\Response $response, string $stage, array $context = []): int
    {
        try {
            return (int)$response->getStatusCode();
        } catch (HttpClientException $exception) {
            $context['stage'] = $stage;
            $context['err'] = $exception->getMessage();
            Yii::error($context, 'analiz');
        }

        return 0;
    }


    private function getDateSite($site, ?array $domainInfo = null)
    {
        $info = $domainInfo ?? $this->getDomainInfo($site);
        if (!is_array($info) || empty($info['events'])) {
            return [
                'year' => 0,
                'mounth' => 0,
            ];
        }

        $events = $info['events'];
        $created = null;

        if (is_array($events) && array_key_exists('registration', $events)) {
            $created = $events['registration'];
        } elseif (is_array($events)) {
            foreach ($events as $event) {
                if (isset($event['eventAction'], $event['eventDate']) && $event['eventAction'] === 'registration') {
                    $created = $event['eventDate'];
                    break;
                }
            }
        }

        if (!is_string($created) || $created === '') {
            return [
                'year' => 0,
                'mounth' => 0,
            ];
        }

        try {
            $createdAt = new \DateTimeImmutable($created);
            $now = new \DateTimeImmutable('now');
            $diff = $createdAt->diff($now);
        } catch (\Exception $e) {
            return [
                'year' => 0,
                'mounth' => 0,
            ];
        }

        return [
            'year' => max(0, (int)$diff->y),
            'mounth' => max(0, (int)$diff->m),
        ];
    }

    private function getSSL($site, ?\yii\httpclient\Response $httpResponse = null)
    {
        if ($httpResponse instanceof \yii\httpclient\Response) {
            $headers = $httpResponse->getHeaders();
            if ($headers->has('location')) {
                preg_match("/.*src=[\"|\']http:\/\/.*/", (string)$httpResponse->content, $array1);

                return !empty($array1) ? 0 : 1;
            }

            return -1;
        }

        $client = new Client();
        $response = $client->createRequest()
            ->setMethod('GET')
            ->setUrl('http://' . urlencode($site))
            ->send();

        if (isset($response->headers['location'])) {
            preg_match("/.*src=[\"|\']http:\/\/.*/", $response->content, $array1);

            return !empty($array1) ? 0 : 1;
        }

        return -1;
    }

    private function tic($site)
    {
        $urlXml = "http://bar-navig.yandex.ru/u?ver=2&url=http://" . urlencode($site) . "&show=1";
        $result = @simplexml_load_file($urlXml);
        if ($result) {
            $arrData = array();
            foreach ($result as $one) {
                $arrData[] = $one;
            }
            return (int) $arrData[2]["value"];
        }
        return false;
    }

    /*
     * AIzaSyBBhXy-QyeHukPO8viz4I_Q11kD2dy1jdo
     */

    private function pageSpeed($site)
    {
        $client_desktop = new Client();
        $response_desktop = $client_desktop->createRequest()
            ->setMethod('GET')
            ->setUrl('https://www.googleapis.com/pagespeedonline/v4/runPagespeed?url=http://' . urlencode($site) . '&strategy=desktop&key=AIzaSyBBhXy-QyeHukPO8viz4I_Q11kD2dy1jdo')
            ->send();
        $data_desktop = json_decode($response_desktop->content, true);
        $client_mobile = new Client();
        $response_mobile = $client_mobile->createRequest()
            ->setMethod('GET')
            ->setUrl('https://www.googleapis.com/pagespeedonline/v4/runPagespeed?url=http://' . urlencode($site) . '&strategy=mobile&key=AIzaSyBBhXy-QyeHukPO8viz4I_Q11kD2dy1jdo')
            ->send();
        $data_mobile = json_decode($response_mobile->content, true);

        if (isset($data_desktop['error'])) {
            return false;
        } else {
            return [
                'desctop' => $data_desktop['ruleGroups']['SPEED']['score'],
                'mobile' => $data_mobile['ruleGroups']['SPEED']['score'],
            ];
        }
        return false;
    }

    private function responseFalse()
    {
        return ['status' => false];
    }

    private function fetchBacklinksFromHackertarget(string $site): ?array
    {
        $client = new Client([
            'transport' => \yii\httpclient\CurlTransport::class,
        ]);

        try {
            $response = $client->createRequest()
                ->setMethod('GET')
                ->setUrl(self::HACKERTARGET_BACKLINKS_URL)
                ->setData(['q' => $site])
                ->setOptions([
                    CURLOPT_TIMEOUT => 10,
                    CURLOPT_CONNECTTIMEOUT => 5,
                ])
                ->send();
        } catch (\Throwable $exception) {
            Yii::error([
                'stage' => 'hackertarget_backlinks_request',
                'domain' => $site,
                'err' => $exception->getMessage(),
            ], 'analiz');

            return null;
        }

        $statusCode = $this->getResponseStatusCode($response, 'hackertarget_backlinks_response', ['domain' => $site]);
        if ($statusCode < 200 || $statusCode >= 300) {
            return null;
        }

        $body = trim((string)$response->content);
        if ($body === '' || stripos($body, 'error') !== false) {
            Yii::error([
                'stage' => 'hackertarget_backlinks_body',
                'domain' => $site,
                'body' => $body,
            ], 'analiz');
            return null;
        }

        $lines = preg_split('/\r?\n/', $body);
        if (!is_array($lines) || $lines === []) {
            return null;
        }

        if (isset($lines[0]) && stripos($lines[0], 'source url') !== false) {
            array_shift($lines);
        }

        $totalLinks = 0;
        $uniqueUrls = [];
        $anchors = [];
        $refDomains = [];
        $zones = [];

        foreach ($lines as $line) {
            $line = trim((string)$line);
            if ($line === '') {
                continue;
            }

            $columns = str_getcsv($line);
            $source = isset($columns[0]) ? trim((string)$columns[0]) : '';
            if ($source === '' || !preg_match('~^https?://~i', $source)) {
                continue;
            }

            $totalLinks++;
            $uniqueUrls[$source] = true;

            $anchor = isset($columns[1]) ? trim((string)$columns[1]) : '';
            if ($anchor !== '') {
                $anchorKey = function_exists('mb_strtolower') ? mb_strtolower($anchor) : strtolower($anchor);
                if ($anchorKey !== '') {
                    $anchors[$anchorKey] = true;
                }
            }

            $host = (string)parse_url($source, PHP_URL_HOST);
            if ($host !== '') {
                $host = strtolower($host);
                $refDomains[$host] = true;

                $parts = explode('.', $host);
                $zone = count($parts) > 1 ? end($parts) : $host;
                if ($zone !== '') {
                    $zones[$zone] = true;
                }
            }
        }

        if ($totalLinks === 0) {
            Yii::error([
                'stage' => 'hackertarget_backlinks_empty',
                'domain' => $site,
            ], 'analiz');
            return null;
        }

        return [
            'total_links' => $totalLinks,
            'unique_urls' => count($uniqueUrls),
            'unique_anchors' => count($anchors),
            'ref_domains' => count($refDomains),
            'ref_ips' => count($refDomains),
            'zones' => array_keys($zones),
        ];
    }

    private function bankLink($site)
    {
        $stats = $this->fetchBacklinksFromHackertarget($site);
        if ($stats === null) {
            return ['status' => -1];
        }

        return [
            'status' => 1,
            'data' => [
                'total' => [
                    'links' => (int)$stats['total_links'],
                    'links_dofollow_total' => (int)$stats['total_links'],
                    'links_unique' => (int)$stats['unique_urls'],
                    'anchors_unique' => (int)$stats['unique_anchors'],
                ],
                'donors' => [
                    'ips' => (int)$stats['ref_ips'],
                    'domains' => (int)$stats['ref_domains'],
                    'zones' => array_map(static fn($zone) => ['z' => $zone], $stats['zones']),
                ],
            ],
        ];
    }

    private function fetchSearchVisibilityFromOpenSources(string $site): ?array
    {
        $result = [];

        $google = $this->requestGoogleSearchTotalResults($site);
        if ($google !== null) {
            $result['google'] = $google;
        }

        $yandex = $this->requestYandexSearchTotalResults($site);
        if ($yandex !== null) {
            $result['yandex'] = $yandex;
        }

        return $result === [] ? null : $result;
    }

    private function visionSite($site)
    {
        $data = $this->fetchSearchVisibilityFromOpenSources($site);
        if ($data === null) {
            return ['status' => -1];
        }

        return [
            'status' => 1,
            'data' => [
                'google' => (int)($data['google'] ?? 0),
                'yandex' => (int)($data['yandex'] ?? 0),
            ],
        ];
    }

    private function requestGoogleSearchTotalResults(string $domain): ?int
    {
        $body = $this->sendSearchRequest(
            self::GOOGLE_SEARCH_URL,
            [
                'q' => 'site:' . $domain,
                'num' => 1,
                'hl' => 'ru',
                'gl' => 'ru',
            ],
            $domain,
            'google_index',
            $this->buildSearchHeaders(self::SEO_AUDIT_DESKTOP_USER_AGENT)
        );

        if ($body === null) {
            return null;
        }

        $count = $this->parseSearchResultCount(
            $body,
            [
                '~id="result-stats"[^>]*>(.*?)</div>~si',
                '~<div[^>]+class="LHJvCe"[^>]*>(.*?)</div>~si',
                '~<div[^>]+data-testid="result-stats"[^>]*>(.*?)</div>~si',
            ],
            [
                '~результат(?:ов|а)?[^\d]*([\d\s\x{00A0}\x{202F},.]+)~iu',
                '~about\s*([\d\s\x{00A0}\x{202F},.]+)\s*results~iu',
            ]
        );

        if ($count === null) {
            $this->logSearchParseError('google_index_parse', $domain, $body);
        }

        return $count;
    }

    private function requestYandexSearchTotalResults(string $domain): ?int
    {
        $query = [
            'text' => 'site:' . $domain,
            'lr' => 213,
            'lang' => 'ru',
        ];

        $body = $this->sendSearchRequest(
            self::YANDEX_SEARCH_URL,
            $query,
            $domain,
            'yandex_index',
            $this->buildSearchHeaders(self::SEO_AUDIT_DESKTOP_USER_AGENT)
        );

        $count = $body === null ? null : $this->parseSearchResultCount(
            $body,
            [
                '~<span[^>]+class="serp-FoundText"[^>]*>(.*?)</span>~si',
                '~<div[^>]+class="serp__found"[^>]*>(.*?)</div>~si',
            ],
            [
                '~Нашлось[^\d]*([\d\s\x{00A0}\x{202F},.]+)~iu',
                '~Found[^\d]*([\d\s\x{00A0}\x{202F},.]+)~iu',
                '~([\d\s\x{00A0}\x{202F},.]+)\s*(?:результат|ответ)~iu',
            ]
        );

        if ($count !== null) {
            return $count;
        }

        $bodyTouch = $this->sendSearchRequest(
            self::YANDEX_TOUCH_SEARCH_URL,
            $query,
            $domain,
            'yandex_index_touch',
            $this->buildSearchHeaders(self::SEO_AUDIT_MOBILE_USER_AGENT)
        );

        if ($bodyTouch === null) {
            if ($body !== null) {
                $this->logSearchParseError('yandex_index_parse', $domain, $body);
            }

            return null;
        }

        $count = $this->parseSearchResultCount(
            $bodyTouch,
            [
                '~<span[^>]+class="serp-FoundText"[^>]*>(.*?)</span>~si',
                '~<div[^>]+class="serp__found"[^>]*>(.*?)</div>~si',
            ],
            [
                '~Нашлось[^\d]*([\d\s\x{00A0}\x{202F},.]+)~iu',
                '~Found[^\d]*([\d\s\x{00A0}\x{202F},.]+)~iu',
                '~([\d\s\x{00A0}\x{202F},.]+)\s*(?:результат|ответ)~iu',
            ]
        );

        if ($count === null) {
            $this->logSearchParseError('yandex_index_parse_touch', $domain, $bodyTouch);
        }

        return $count;
    }

    private function sendSearchRequest(string $url, array $query, string $domain, string $stage, array $headers = []): ?string
    {
        $client = new Client([
            'transport' => \yii\httpclient\CurlTransport::class,
        ]);

        try {
            $request = $client->createRequest()
                ->setMethod('GET')
                ->setUrl($url)
                ->setData($query)
                ->setOptions([
                    CURLOPT_TIMEOUT => 10,
                    CURLOPT_CONNECTTIMEOUT => 5,
                    CURLOPT_FOLLOWLOCATION => true,
                    CURLOPT_ENCODING => '',
                ]);

            if ($headers === []) {
                $headers = $this->buildSearchHeaders(self::SEO_AUDIT_DESKTOP_USER_AGENT);
            }

            $request->addHeaders($headers);

            $response = $request->send();
        } catch (\Throwable $exception) {
            Yii::error([
                'stage' => $stage . '_request',
                'domain' => $domain,
                'url' => $url,
                'err' => $exception->getMessage(),
            ], 'analiz');

            return null;
        }

        $statusCode = $this->getResponseStatusCode($response, $stage . '_response', ['domain' => $domain, 'url' => $url]);
        if ($statusCode < 200 || $statusCode >= 300) {
            return null;
        }

        $body = (string)$response->content;
        if ($body === '') {
            Yii::error([
                'stage' => $stage . '_empty',
                'domain' => $domain,
                'url' => $url,
            ], 'analiz');

            return null;
        }

        return $body;
    }

    private function parseSearchResultCount(string $html, array $htmlPatterns, array $textPatterns): ?int
    {
        foreach ($htmlPatterns as $pattern) {
            if (preg_match($pattern, $html, $matches)) {
                $value = $matches[1] ?? $matches[0];
                $count = $this->convertNumberStringToInt($value);
                if ($count !== null) {
                    return $count;
                }
            }
        }

        $text = strip_tags($html);
        foreach ($textPatterns as $pattern) {
            if (preg_match($pattern, $text, $matches)) {
                $value = $matches[1] ?? $matches[0];
                $count = $this->convertNumberStringToInt($value);
                if ($count !== null) {
                    return $count;
                }
            }
        }

        return null;
    }

    private function convertNumberStringToInt(string $value): ?int
    {
        $flags = ENT_QUOTES;
        if (defined('ENT_HTML5')) {
            $flags |= ENT_HTML5;
        }

        $decoded = html_entity_decode($value, $flags, 'UTF-8');
        $digits = preg_replace('~[^0-9]~u', '', $decoded);
        if ($digits === '') {
            return null;
        }

        return (int)$digits;
    }

    private function buildSearchHeaders(string $userAgent): array
    {
        return [
            'User-Agent' => $userAgent,
            'Accept-Language' => self::SEO_AUDIT_ACCEPT_LANGUAGE,
            'Accept' => self::SEO_AUDIT_ACCEPT_HEADER,
        ];
    }

    private function logSearchParseError(string $stage, string $domain, string $body): void
    {
        $snippet = strip_tags($body);
        if (function_exists('mb_substr')) {
            $snippet = mb_substr($snippet, 0, 300);
        } else {
            $snippet = substr($snippet, 0, 300);
        }

        Yii::error([
            'stage' => $stage,
            'domain' => $domain,
            'snippet' => trim((string)$snippet),
        ], 'analiz');
    }

    public function actionPageSpeedAjax()
    {
        $session = Yii::$app->session;
        $data = $this->pageSpeed($session['domain']);
        Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
        return $data;
    }



    public function actionAnalizForm()
    {
        Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
        $post = Yii::$app->request->post();
        // print_r($post);
        $replayTo = !empty($post['email']) ?  $post['email'] : null;
        if (!$this->enqueueEmail(['analiz_email', $post], 'Анализ сайта', null, null, null, $replayTo)) {
            return [
                'status' => false,
                'data' => self::QUEUE_ERROR_MESSAGE,
            ];
        }
        return [
            'status' => true,
            'data' => 'Успешно отправлено. <br>В ближайшее время мы сформируем и пришлём Вам индивидуальный проект.',
        ];
    }

    public function actionDomainKlient()
    {
        $post = Yii::$app->request->post();
        $session = Yii::$app->session;
        $session['get_domain'] = $post['domain'];
        return 'https://intrid.ru/hosting-domeny-ssl/registracia-domenov';
    }

    public function actionTestSubmit()
    {
        /*
            $message = Yii::$app->mailer->compose()
            ->setHtmlBody('test');
        

        $message->setFrom('mail@intrid.ru')
                ->setTo('shibar89@bk.ru')
                ->setSubject('test');
          
      
        return var_dump($message->send());
        */
    }

    /**
     * Обработчик новогодней формы https://intrid.ru/novogodnee-pismo
     * @return array
     */
    public function actionNewyear()
    {
        Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
        $post = Yii::$app->request->post();
        //$status = $this->reGoogle($this->extractCaptchaToken($post));
        // if ($status->success == 1) {
        $replayTo = !empty($post['email']) ?  $post['email'] : null;

        $text = 'Имя: ' . $post['name'] . '<br>';
        $text .= 'Сайт: ' . $post['site'] . '<br>';
        $done = $post['done'];
        $text .= 'Что сделано: <br>' . $done . '<br>';
        $needDone = $post['need'];
        $text .= '<br> Что планирую сделать: <br>' . $needDone . '<br>';
        $text .= 'Дополнительно: ' . $post['appendix'] . '<br>';


        if (!$this->enqueueEmail($text, 'Новогодняя заявка', null, null, null, $replayTo)) {
            return [
                'status' => false,
                'data' => self::QUEUE_ERROR_MESSAGE,
            ];
        }
        return [
            'status' => true,
            'data' => 'Ваше письмо успешно отправлено',
        ];
        // } else {
        //     return [
        //         'status' => false,
        //     ];
        // }
    }




    /*Это нужно для susp не удалять, это для api*/
    public function actionGetLinksApi()
    {
        Yii::$app->response->format = 'json';

        $queryParams = Yii::$app->request->queryParams;


        if ($queryParams['action'] === 'get_html') {
            $link = \common\models\CmsLinksList::find()->where(['eneble' => 1, 'name_in_latin' => $queryParams['name']])->one();


            //            $link->name_in_latin = $this->generateTextWithConcreteWords($link->name_in_latin);
            $link->name = $this->generateTextWithConcreteWords($link->name);
            $link->htmlcode = $this->generateTextWithConcreteWords($link->htmlcode);
            $link->html_short_description = $this->generateTextWithConcreteWords($link->html_short_description);

            return $link;
        }

        $links = \common\models\CmsLinksList::find()->select('id, name, name_in_latin, html_short_description, updated_at')->where(['eneble' => 1])->all();

        foreach ($links as $key => $link) {
            $links[$key]->name = $this->generateTextWithConcreteWords($link->name);
            $links[$key]->htmlcode = $this->generateTextWithConcreteWords($link->htmlcode);
            $links[$key]->html_short_description = $this->generateTextWithConcreteWords($link->html_short_description);
        }

        return $links;
    }

    /*
 * Берет текст, заменяет конструкции вида {профессиональная|качественная|перокласная} на конкретные слова
 */
    private function generateTextWithConcreteWords($text)
    {
        mb_ereg('\{([^\}]*)\}', $text, $curly_brackets_matches);

        while (!empty($curly_brackets_matches)) {
            $curly_expression = $curly_brackets_matches[1];
            $words = explode('|', $curly_expression);
            $concrete_word = $words[rand(0, count($words) - 1)];
            $text = $this->mb_replace($curly_brackets_matches[0], $concrete_word, $text);

            $curly_brackets_matches = [];
            mb_ereg('\{([^\}]*)\}', $text, $curly_brackets_matches);
        }

        return $text;
    }

    private function mb_replace($search, $replace, $subject, &$count = 0)
    {
        if (!is_array($search) && is_array($replace)) {
            return false;
        }
        if (is_array($subject)) {
            // call mb_replace for each single string in $subject
            foreach ($subject as &$string) {
                $string = &mb_replace($search, $replace, $string, $c);
                $count += $c;
            }
        } elseif (is_array($search)) {
            if (!is_array($replace)) {
                foreach ($search as &$string) {
                    $subject = mb_replace($string, $replace, $subject, $c);
                    $count += $c;
                }
            } else {
                $n = max(count($search), count($replace));
                while ($n--) {
                    $subject = mb_replace(current($search), current($replace), $subject, $c);
                    $count += $c;
                    next($search);
                    next($replace);
                }
            }
        } else {
            $parts = mb_split(preg_quote($search), $subject);
            $count = count($parts) - 1;
            $subject = implode($replace, $parts);
        }
        return $subject;
    }

    public function actionExpressSeoAudit()
    {
        $site = Yii::$app->request->get('site', '');
        $site = trim($site);

        if ($site === '') {
            // Просто показываем страницу с формой (без результатов)
            return $this->render('express-seo-audit', [
                'metrics' => null,
                'site' => null,
            ]);
        }

        $domain = $this->normalizeDomain($site);
        if ($domain === '') {
            Yii::$app->session->setFlash('error', 'Некорректный адрес сайта');
            return $this->redirect(['/seo-audit']);
        }

        $cache = Yii::$app->cache;
        $domainTag = "domain:{$domain}";

        // Получаем SEO-данные (аналогично actionGetSeoData)
        $pageKey = "analiz:page:{$domain}";
        $seoData = $cache->get($pageKey);
        if ($seoData === false) {
            $rdapKey = "analiz:rdap:{$domain}";
            $info = $cache->get($rdapKey);
            if ($info === false) {
                $info = $this->getDomainInfo($domain);
                if ($info === false) $info = $this->createFallbackDomainInfo($domain);
                $cache->set($rdapKey, $info, 86400, new TagDependency(['tags' => [$domainTag, 'rdap']]));
            }
            $freshData = $this->infoSite($domain, $info);
            if (empty($freshData) || ($freshData['status'] ?? false) === false) {
                Yii::$app->session->setFlash('error', 'Не удалось получить данные о сайте');
                return $this->redirect(['/seo-audit']);
            }
            $cache->set($pageKey, $freshData, 900, new TagDependency(['tags' => [$domainTag, 'page']]));
            $seoData = $freshData;
        }

        $first = fn($arr, $idx = 1) => (!empty($arr[$idx][0]) && is_string($arr[$idx][0])) ? trim($arr[$idx][0]) : '';
        $title = $first($seoData['title'] ?? []);
        $description = isset($seoData['description'][0]) ? trim($seoData['description'][0]) : '';
        $h1 = $first($seoData['h1'] ?? []);
        $h2List = [];
        if (isset($seoData['h2']) && is_array($seoData['h2'])) {
            for ($i = 1; $i <= count($seoData['h2']); $i++) {
                if (!empty($seoData['h2'][$i][0])) $h2List[] = trim($seoData['h2'][$i][0]);
            }
        }
        $h2Count = count($h2List);
        $wordCount = (int)($seoData['wordCount'] ?? 0);
        $keywords = isset($seoData['keywords'][0]) ? trim($seoData['keywords'][0]) : '';
        $sslOk = (bool)($seoData['ssl'] ?? false);

        // Google PageSpeed (mobile)
        $pagespeedKey = "analiz:pagespeed:{$domain}";
        $pagespeedData = $cache->get($pagespeedKey);
        if ($pagespeedData === false) {
            $apiKey = 'AIzaSyD80rX_LE4YFfFB7uGRucxxZFCZ0j2IBDI';
            $url = 'https://' . $domain;
            $apiUrl = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=" . urlencode($url) . "&key={$apiKey}&strategy=mobile";
            $client = new \yii\httpclient\Client(['transport' => \yii\httpclient\CurlTransport::class]);
            try {
                $response = $client->createRequest()->setMethod('GET')->setUrl($apiUrl)->setOptions([CURLOPT_TIMEOUT => 10, CURLOPT_CONNECTTIMEOUT => 5])->send();
                if ($response->isOk) {
                    $pagespeedData = $response->getData();
                    $cache->set($pagespeedKey, $pagespeedData, 3600, new TagDependency(['tags' => [$domainTag, 'pagespeed']]));
                } else $pagespeedData = null;
            } catch (\Throwable $e) {
                $pagespeedData = null;
            }
        }

        $audits = $pagespeedData['lighthouseResult']['audits'] ?? [];
        $categories = $pagespeedData['lighthouseResult']['categories'] ?? [];

        $scoreToStatus = fn($score, $good = 0.9, $warn = 0.5) => $score === null ? 'warning' : ($score >= $good ? 'good' : ($score >= $warn ? 'warning' : 'error'));

        $indexingStatus = $scoreToStatus($audits['is-crawlable']['score'] ?? null);
        $indexingText = $indexingStatus === 'good' ? 'Все важные страницы в индексе' : ($indexingStatus === 'error' ? 'Сайт не индексируется' : 'Часть важных страниц отсутствует в индексе');

        $perfScore = $categories['performance']['score'] ?? null;
        $speedStatus = $scoreToStatus($perfScore);
        $speedText = $speedStatus === 'good' ? 'Сайт загружается быстро' : ($speedStatus === 'error' ? 'Сайт загружается медленно, особенно на мобильных устройствах' : 'Скорость загрузки можно улучшить');

        $titleOk = !empty($title);
        $descOk = !empty($description);
        if ($titleOk && $descOk) {
            $metaStatus = 'good';
            $metaText = 'Title и meta-description заполнены';
        } elseif (!$titleOk && !$descOk) {
            $metaStatus = 'error';
            $metaText = 'Отсутствуют title и description';
        } else {
            $metaStatus = 'warning';
            $metaText = 'У части страниц отсутствуют title и description';
        }

        $vpScore = $audits['viewport']['score'] ?? null;
        $cwScore = $audits['content-width']['score'] ?? null;
        if ($vpScore === 1 && $cwScore === 1) {
            $mobileStatus = 'good';
            $mobileText = 'Сайт адаптирован, но есть зоны для улучшения UX';
        } elseif ($vpScore === 0 || $cwScore === 0) {
            $mobileStatus = 'error';
            $mobileText = 'Сайт не адаптирован для мобильных';
        } else {
            $mobileStatus = 'warning';
            $mobileText = 'Адаптация требует улучшения';
        }

        $h1Ok = !empty($h1);
        $kwOk = !empty($keywords);
        if ($h1Ok && $h2Count >= 1 && $wordCount > 300 && $kwOk) {
            $contentStatus = 'good';
            $contentText = 'Контент отличный: заголовки, объём и ключевые слова в порядке';
        } elseif (!$h1Ok || $wordCount < 100) {
            $contentStatus = 'error';
            $contentText = 'Критические проблемы с контентом (отсутствие H1 или слишком мало текста)';
        } else {
            $contentStatus = 'warning';
            $contentText = 'Контент недостаточно раскрывает часть поисковых запросов';
        }
        $contentDesc = "H1: " . ($h1Ok ? "присутствует" : "отсутствует") . ", H2: {$h2Count} шт., слов: {$wordCount}, ключевые слова: " . ($kwOk ? "заданы" : "не заданы");

        $errorsScore = $audits['errors-in-console']['score'] ?? null;
        if ($errorsScore === 1) {
            $errorsStatus = 'good';
            $errorsText = 'Технических ошибок не найдено';
        } else {
            $errorsStatus = 'error';
            $errorsText = 'Найдены битые ссылки и ошибки 404';
        }

        $linkScore = $audits['link-text']['score'] ?? null;
        $linkStatus = $scoreToStatus($linkScore);
        $linkText = $linkStatus === 'good' ? 'Хорошая структура ссылок' : ($linkStatus === 'error' ? 'Нужно усилить связь между ключевыми страницами' : 'Перелинковку можно улучшить');

        $httpsScore = $audits['is-on-https']['score'] ?? null;
        if ($sslOk || $httpsScore === 1) {
            $securityStatus = 'good';
            $securityText = 'SSL подключен, критичных проблем не найдено';
        } else {
            $securityStatus = 'error';
            $securityText = 'SSL не подключен или ошибки';
        }

        $metrics = [
            ['category' => 'indexing', 'title' => 'Индексация страниц', 'status' => ['status' => $indexingStatus, 'text' => $indexingText], 'desc' => 'Проверка доступности страниц для поисковых роботов'],
            ['category' => 'speed', 'title' => 'Скорость загрузки', 'status' => ['status' => $speedStatus, 'text' => $speedText], 'desc' => 'Общая производительность по Core Web Vitals'],
            ['category' => 'meta', 'title' => 'Мета-теги', 'status' => ['status' => $metaStatus, 'text' => $metaText], 'desc' => 'Корректность заполнения тегов title и meta-description'],
            ['category' => 'mobile', 'title' => 'Мобильная версия', 'status' => ['status' => $mobileStatus, 'text' => $mobileText], 'desc' => 'Проверка viewport и корректности контента на мобильных'],
            ['category' => 'content', 'title' => 'Контент и релевантность', 'status' => ['status' => $contentStatus, 'text' => $contentText], 'desc' => $contentDesc],
            ['category' => 'errors', 'title' => 'Технические ошибки', 'status' => ['status' => $errorsStatus, 'text' => $errorsText], 'desc' => 'Наличие ошибок JavaScript и проблем рендеринга'],
            ['category' => 'links', 'title' => 'Внутренняя перелинковка', 'status' => ['status' => $linkStatus, 'text' => $linkText], 'desc' => 'Описательность текстов внутренних ссылок'],
            ['category' => 'security', 'title' => 'Безопасность / HTTPS', 'status' => ['status' => $securityStatus, 'text' => $securityText], 'desc' => 'Наличие и корректность SSL-сертификата'],
        ];

        return $this->render('express-seo-audit', [
            'metrics' => $metrics,
            'site' => $domain,
        ]);
    }
}
