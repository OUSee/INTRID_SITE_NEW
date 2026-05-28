<?php

use common\models\TypeBlog;
use common\models\Seo;
use yii\helpers\Html;
use yii\helpers\Url;
use yii\widgets\Pjax;
use yii\web\View;
use frontend\widgets\PaginationWidget;

/* @var $this yii\web\View */
/* @var $dataProvider yii\data\ActiveDataProvider */
/* @var $types common\models\TypeBlog[] */
/* @var $currentType common\models\TypeBlog|null */

$models = $dataProvider->getModels();
Yii::error($dataProvider->query->createCommand()->rawSql);

$this->title = $currentType && $currentType->title ? $currentType->title : 'Блог веб-студии INTRID| Веб-разработка по полочкам';
$activeSlug = $currentType?->slug;
$sectionTitle = $currentType ? 'Статьи ' . $currentType->name : 'Свежие публикации';


$this->registerMetaTag([
    'name' => 'description',
    'content' => $currentType && $currentType->description ? $currentType->description : 'Самые свежие и актуальные статьи на тему веб-разработки в блоге веб-студии INTRID',
], 'description');

$this->registerMetaTag([
    'name' => 'keywords',
    'content' => $currentType && $currentType->keywords ? $currentType->keywords : 'INTRID, блог, сайты, веб-студия, новости',
], 'keywords');

$h1 = $currentType && $currentType->h1 ? $currentType->h1 : 'Веб-разработка по полочкам';

$tabConfigs = [
    'blog-site' => [
        'selector' => 'blog-site',
        'title' => 'Разработка сайтов',
        'description' => 'Материалы о важнейших и новейших программных разработках в сфере WEB специально для Вас!',
        'image' => '/src/images/corp-site-services.webp',
    ],
    'blog-design' => [
        'selector' => 'digital-design',
        'title' => 'Digital-дизайн',
        'description' => 'Раскрываем секреты качественного веб-дизайна и рассказываем о новейших креативных подходах',
        'image' => '/src/images/site-design-services.webp',
    ],
    'blog-seo' => [
        'selector' => 'seo-promotion',
        'title' => 'SEO-продвижение',
        'description' => 'Полезные материалы о непростом деле SEO-оптимизации кода страницы. Все о продвижении и ещё чуть-чуть',
        'image' => '/src/icons/seo-services.svg',
    ],
    'blog-marketing' => [
        'selector' => 'internet-marketing',
        'title' => 'Интернет-маркетинг',
        'description' => 'Современные инструменты интернет-маркетинга и методы преобразования посетителей в покупателей',
        'image' => '/src/images/tg-target-services.webp',
    ],
    'blog-technologies' => [
        'selector' => 'ispolzuemye-tehnologii',
        'title' => 'Используемые технологии',
        'description' => 'В современных реалиях практически любая информационная система может стать объектом атаки. Даже крупные сервисы с продуманной архитектурой и многоуровневой защитой регулярно подвергаются взломам. Практика показывает: вопрос уже не в том, «взломают или нет», а в том, «когда и с какими последствиями».',
        'image' => '/src/images/tg-target-services.webp',
    ],
];

$typesBySlug = [];
foreach ($types as $type) {
    if ($type->id === TypeBlog::CASE_TYPE_ID) {
        continue;
    }
    $typesBySlug[$type->slug] = $type;
}

$orderedTypes = [];
foreach ($tabConfigs as $slug => $config) {
    if (isset($typesBySlug[$slug])) {
        $orderedTypes[$slug] = $typesBySlug[$slug];
        unset($typesBySlug[$slug]);
    }
}

if (!empty($typesBySlug)) {
    foreach ($typesBySlug as $slug => $type) {
        $orderedTypes[$slug] = $type;
    }
}

if ($activeSlug !== null && !isset($orderedTypes[$activeSlug])) {
    $activeSlug = null;
}

if ($activeSlug === null && !empty($orderedTypes)) {
    $slugKeys = array_keys($orderedTypes);
    $activeSlug = reset($slugKeys);
}

$activeSelector = null;
if ($activeSlug !== null) {
    $activeSelector = $tabConfigs[$activeSlug]['selector'] ?? $activeSlug;
}
?>

<section class="main-section main-section--blog container">
    <div class="breadcrumbs">
        <a href="/">Главная</a>
        <span>-</span>
        <a href="<?= $currentType ? '/blog' : '#' ?>" class="<?= $currentType ? '' : 'link-disabled' ?>">Блог</a>
        <?php if ($currentType) : ?>
            <span>-</span>
            <a href="#" class="link-disabled"><?= $currentType->name ?></a>
        <?php endif; ?>
    </div>

    <h1 class="w-fit m-center text-center underlined">
        <?= $h1 ?>
    </h1>
</section>


<section class="bg-gradient blogs" id="blogs-blog">
    <div class="blogs__inner">
        <div class="tabs-to-select isBlogs container w-100" data-tabs-to-select="">
            <!-- select for tabs-buttons -->
            <div class="nice-wrapper nice-wrapper--simple align-center js-blog-tabs gap-12 mw-400 ml-auto mr-auto mb-32" data-tabs-buttons="" id="select-tender">
                <div class="nice-select w-100" tabindex="0">
                    <span class="current">Все статьи</span>
                    <ul class="list">
                        <label class="option d-flex w-100 h-100 <?= $currentType ? '' : 'selected' ?>">
                            <input
                                type="radio"
                                name="blog-tabs-radio"
                                data-url="<?= Url::to(['/blog/index']) ?>"
                                <?= $currentType ? '' : 'checked' ?>>
                            Все статьи
                        </label>

                        <?php foreach ($orderedTypes as $slug => $type): ?>
                            <?php if ($type->id === TypeBlog::CASE_TYPE_ID) continue; ?>
                            <label class="option d-flex w-100 h-100 <?= $currentType && $currentType->slug === $type->slug ? 'checked' : '' ?>">
                                <input
                                    type="radio"
                                    name="blog-tabs-radio"
                                    data-url="<?= Url::to(['/blog/view', 'slug' => $type->slug]) ?>"
                                    <?= $currentType && $currentType->slug === $type->slug ? 'checked' : '' ?>>
                                <?= Html::encode($tabConfigs[$slug]['title'] ?? $type->name) ?>
                            </label>
                        <?php endforeach; ?>
                    </ul>
                </div>
            </div>

            <!-- tabs -->
            <div class="blogs__buttons js-blog-tabs">
                <label class="blogs__button">
                    <input
                        type="radio"
                        name="blog-tabs-radio"
                        data-url="<?= Url::to(['/blog/index']) ?>"
                        <?= $currentType ? '' : 'checked' ?>>
                    <i class="icon-arrow_wide"></i>
                    <span>
                        <span>Все</span>
                        <span class="d-xs-none d-sm-none d-md-none">статьи</span>
                    </span>
                </label>

                <?php foreach ($orderedTypes as $slug => $type): ?>
                    <?php if ($type->id === TypeBlog::CASE_TYPE_ID) continue; ?>
                    <label class="blogs__button">
                        <input
                            type="radio"
                            name="blog-tabs-radio"
                            data-url="<?= Url::to(['/blog/view', 'slug' => $type->slug]) ?>"
                            <?= $currentType && $currentType->slug === $type->slug ? 'checked' : '' ?>>
                        <span><?= Html::encode($tabConfigs[$slug]['title'] ?? $type->name) ?></span>
                    </label>
                <?php endforeach; ?>
            </div>
        </div>

        <?php Pjax::begin([
            'id' => 'blog-tabs',
            'timeout' => 1000,
            'enablePushState' => true,
            'options' => ['class' => 'blogs__wrapper'],
        ]); ?>
        <div class="container">
            <h2 class="underlined w-fit m-center text-center" id="blogs-title">
                <?= Html::encode($sectionTitle) ?>
            </h2>

            <?php if (!empty($models)): ?>
                <div class="d-flex flex-column gap-20 blogs__list" id="blogs-list">
                    <?php foreach ($models as $model): ?>
                        <a href="<?= Url::to(['/blog/view', 'slug' => $model->slug]) ?>"
                            class="card card--recent card--blog card--blog-stacked">
                            <div class="img-wrapper">
                                <img src="<?= $model->getImage()?->getPath('180x') ?>"
                                    alt="<?= Html::encode($model->name) ?>">
                            </div>
                            <div class="card-body">
                                <h3><?= Html::encode($model->name) ?></h3>
                                <?= $model->short_text ?>
                                <span class="card-date">
                                    <?= Yii::$app->formatter->asDate($model->created_at, 'php:d.m.Y') ?>
                                </span>
                            </div>
                        </a>
                    <?php endforeach; ?>
                </div>
            <?php else: ?>
                <div class="card card--newsletter empty">
                    <div class="card-body">
                        <b>Материалы появятся скоро</b>
                        <p>Мы уже работаем над новыми публикациями для этой категории. Загляните позже!</p>
                    </div>
                </div>
            <?php endif; ?>

            <?php $paginationHtml = PaginationWidget::widget([
                'pagination' => $dataProvider->pagination,
                'linkOptions' => ['data-pjax' => 1],
            ]); ?>

            <?php if (!empty($paginationHtml)): ?>
                <div class="portfolio-block__pagination pagination-panel">
                    <?= $paginationHtml ?>
                </div>
            <?php endif; ?>
        </div>

        <?php Pjax::end(); ?>
    </div>
</section>

<!-- <section>
    <div class="container">
        <h2 class="w-fit m-center">
            Выбирайте статьи по темам
        </h2>

        <div class="flex-layout flex-layout--tab gap-20">
            <?php foreach ($orderedTypes as $slug => $type): ?>
                <?php if ($type->id === TypeBlog::CASE_TYPE_ID) {
                    continue;
                } ?>
                <?php
                $config = $tabConfigs[$slug] ?? [];
                $isActive = $activeSlug === $slug;
                $selector = $config['selector'] ?? $slug;
                $cardTitle = $config['title'] ?? $type->name;
                $cardDescription = $config['description'] ?? $type->text;
                $cardImage = $config['image'] ?? $type->getImage()?->getPath();
                ?>
                <a href="<?= Url::to(['/blog/view', 'slug' => $type->slug]) ?>"
                    class="card card--tab tab-slider-card js-blog-tab<?= $isActive ? ' active' : '' ?>"
                    data-selector="<?= Html::encode($selector) ?>"
                    data-slug="<?= Html::encode($type->slug) ?>">
                    <?php if (!empty($cardImage)): ?>
                        <div class="card-icon">
                            <img src="<?= Html::encode($cardImage) ?>" alt="<?= Html::encode($cardTitle) ?>">
                        </div>
                    <?php endif; ?>
                    <b><?= Html::encode($cardTitle) ?></b>
                    <?php if (!empty($cardDescription)): ?>
                        <?= $cardDescription ?>
                    <?php endif; ?>
                </a>

            <?php endforeach; ?>
        </div>
    </div>
</section> -->

<?php
$blogTabsJs = <<<JS
(function () {
    const containerId = '#blog-tabs';
    const listId = 'blogs-list';

    const runBlogAnimation = () => {
        const list = document.getElementById(listId);

        if (!list) {
            return;
        }

        list.classList.remove('show');

        requestAnimationFrame(() => {
            list.classList.add('show');
        });
    };

    document.addEventListener('change', function (event) {
        const input = event.target.closest('.js-blog-tabs input[data-url]');

        if (!input) {
            return;
        }

        const url = input.dataset.url;

        if (window.jQuery && typeof window.jQuery.pjax === 'function') {
            window.jQuery.pjax.reload({
                container: containerId,
                url: url,
                push: true,
                replace: false,
                timeout: 1000,
                scrollTo: false
            });
        } else {
            window.location.href = url;
        }
    });

    if (window.jQuery) {
        window.jQuery(document).on('pjax:end', function (event) {
            if (event.target && event.target.id === 'blog-tabs') {
                requestAnimationFrame(() => {
                    runBlogAnimation();
                });
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        runBlogAnimation();
    });

    document.addEventListener('pjax:end', function (event) {
        if (event.target && event.target.id === 'blog-tabs') {
            if (typeof window.observeLazyElements === 'function') {
                window.observeLazyElements(event.target);
            }

            const list = event.target.querySelector('#blogs-list');

            if (list) {
                list.classList.remove('show');

                setTimeout(() => {
                    list.classList.add('show');
                }, 50);
            }
        }
    });
})();
JS;

$this->registerJs($blogTabsJs, View::POS_READY);
?>

<section>
    <div class="container">
        <h3 class="underlined w-fit m-center text-center">
            Заказать разработку сайта или создание бренда
        </h3>

        <div class="flex-layout flex-layout--use">
            <a href="<?= Url::to(['/develop/calculator']) ?>" class="card card--service use">
                <div class="card-icon">
                    <img src="/src/icons/site-calc.svg" alt="landig-page">
                </div>
                <b>Калькулятор сайта</b>
            </a>
            <a href="<?= Url::to(['/develop/bsite']) ?>" class="card card--service use">
                <div class="card-icon">
                    <img src="/src/icons/brif-site.svg" alt="landig-page">
                </div>
                <b>Бриф на сайт</b>
            </a>
            <a href="<?= Url::to(['/develop/blogo']) ?>" class="card card--service use">
                <div class="card-icon">
                    <img src="/src/icons/brif-logo.svg" alt="landig-page">
                </div>
                <b>Бриф на бренд</b>
            </a>
            <a href="<?= Url::to(['/seo']) ?>#seo_application" class="card card--service use">
                <div class="card-icon">
                    <img src="/src/icons/promotion-request.svg" alt="landig-page">
                </div>
                <b>Заявка на раскрутку</b>
            </a>
        </div>
    </div>
</section>