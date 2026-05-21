<?php

use yii\helpers\Url;
use common\models\Seo;
use yii\widgets\Pjax;

Yii::$app->view->params['breadcrumbs'][] = ['label' => 'Портфолио', 'url' => Url::to(['/portfolio']), 'title' => 'Портфолио'];
Yii::$app->view->params['breadcrumbs'][] = ['label' => 'Разработка сайтов'];
$this->registerLinkTag(['rel' => 'canonical', 'href' => 'https://intrid.ru/portfolio/site']);

$seo = Seo::findOne(2);

/*
 * title
 */
if ($seo->title !== '') {
    $this->title = $seo->title;
} else {
    $this->title = 'Портфолио INTRID: разработка сайтов';
}

/*
 * description
 */
if ($seo->descriptions !== '') {
    $this->registerMetaTag([
        'name' => 'description',
        'content' => $this->title . '-' . $seo->descriptions,
    ], 'description');
} else {
    $this->registerMetaTag([
        'name' => 'description',
        'content' => $this->title,
    ], 'description');
}

/*
 * keywords
 */
if ($seo->keywords !== '') {
    $this->registerMetaTag([
        'name' => 'keywords',
        'content' => $seo->keywords,
    ], 'keywords');
} else {
    $this->registerMetaTag([
        'name' => 'keywords',
        'content' => $this->title,
    ], 'keywords');
}
?>

<section class="main-section portfolio">
    <div class="container">
        <div class="breadcrumbs">
            <a href="<?= Url::to(['/']) ?>">Главная</a>
            <span>-</span>
            <a href="<?= Url::to(['/portfolio']) ?>">Портфолио</a>
            <span>-</span>
            <a href="#" class="link-disabled">Разработка сайтов</a>
        </div>

        <h1>
            <span class="title_h1 underlined">Портфолио INTRID: разработка сайтов</span>
        </h1>


        <div class="tabs-to-select" data-tabs-to-select="">
            <!-- select for tabs-buttons -->
            <div class="nice-wrapper nice-wrapper--simple mw-400 mb-32" data-tabs-buttons="">
                <div class="nice-select w-100" tabindex="0">
                    <span class="current">Все сайты</span>
                    <ul class="list">
                        <label data-value="0" for="portfolio-filter-0"
                            class="option d-flex w-100 h-100 selected" aria-selected="true" data-type="all">Все сайты</label>
                        <label data-value="1" for="portfolio-filter-1"
                            class="option d-flex w-100 h-100" data-type="corporate-website">Landing Page</label>
                        <label data-value="2" for="portfolio-filter-2"
                            class="option d-flex w-100 h-100" data-type="landing-page">Корпоративный сайт</label>
                        <label data-value="3" for="portfolio-filter-3"
                            class="option d-flex w-100 h-100" data-type="online-store">Интернет-магазин</label>
                        <label data-value="4" for="portfolio-filter-4"
                            class="option d-flex w-100 h-100" data-type="informational-portal">Информационный портал</label>
                        <label data-value="5" for="portfolio-filter-5"
                            class="option d-flex w-100 h-100" data-type="tender-portal">Тендерный портал</label>
                    </ul>
                </div>
            </div>

            <!-- tabs-buttons -->
            <div class="nav-tabs">
                <div class="nav-tabs--buttons">
                    <label for="portfolio-filter-0" class="button--tab">
                        <input type="radio" name="portfolio-filter" id="portfolio-filter-0" data-type="all">
                        <img src="/src/images/web-dev-btn.webp" alt="all-site" loading="lazy">
                        <span>Все сайты</span>
                    </label>
                    <label for="portfolio-filter-2" class="button--tab">
                        <input type="radio" name="portfolio-filter" id="portfolio-filter-2" data-type="corporate-website">
                        <img src="/src/icons/corp-site-services.svg" alt="corp-site" loading="lazy">
                        <span>Корпоративный сайт</span>
                    </label>
                    <label for="portfolio-filter-1" class="button--tab">
                        <input type="radio" name="portfolio-filter" id="portfolio-filter-1" data-type="landing-page">
                        <img src="/src/icons/l-page-services.svg" alt="landig-page" loading="lazy">
                        <span>Landing Page</span>
                    </label>
                    <label for="portfolio-filter-3" class="button--tab">
                        <input type="radio" name="portfolio-filter" id="portfolio-filter-3" data-type="online-store">
                        <img src="/src/icons/web-shop-services.svg" alt="web-shop" loading="lazy">
                        <span>Интернет-магазин</span>
                    </label>
                    <label for="portfolio-filter-4" class="button--tab">
                        <input type="radio" name="portfolio-filter" id="portfolio-filter-4" data-type="informational-portal">
                        <img src="/src/icons/web-portal-services.svg" alt="img" loading="lazy">
                        <span>Информационный портал</span>
                    </label>
                    <label for="portfolio-filter-5" class="button--tab">
                        <input type="radio" name="portfolio-filter" id="portfolio-filter-5" data-type="tender-portal">
                        <img src="/src/icons/tender-services.svg" alt="img" loading="lazy">
                        <span>Тендерный портал</span>
                    </label>
                </div>
            </div>
        </div>
    </div>

    <?php Pjax::begin([
        'id' => 'porfolio-body-content',
        'linkSelector' => 'a[data-link-page]',
        'enablePushState' => true,
        'options' => ['class' => 'portfolio-block'],
    ]); ?>
    <?= $this->render('_site', ['sites' => $sites, 'paginator' => $paginator]) ?>
    <?php Pjax::end(); ?>
</section>

<section>
    <div class="container">
        <h3 class="underlined w-fit m-center text-center">
            Заказать разработку сайта или создание бренда
        </h3>

        <div class="flex-layout flex-layout--use">
            <a href="<?= Url::to(['/calculator']) ?>" class="card card--service use">
                <div class="card-icon">
                    <img src="/src/icons/site-calc.svg" alt="landig-page">
                </div>
                <b>Калькулятор сайта</b>
            </a>
            <a href="<?= Url::to(['/brif-site']) ?>" class="card card--service use">
                <div class="card-icon">
                    <img src="/src/icons/brif-site.svg" alt="landig-page">
                </div>
                <b>Бриф на сайт</b>
            </a>
            <a href="<?= Url::to(['/brif-logo']) ?>" class="card card--service use">
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

<?php

/**
 * Register portfolio filter script
 */
$this->registerJsFile('/js/portfolio.js', [
    'depends' => [\frontend\assets\AppAsset::class],
]);

?>