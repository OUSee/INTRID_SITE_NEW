<?php
namespace frontend\controllers;

use Yii;
use yii\web\Controller;
use yii\web\NotFoundHttpException;
use common\models\Page;
use common\models\Portfolio;
use common\models\TypeSite;
use backend\models\Sites;
use backend\models\News;


/**
 * Site controller
 */
class PageController extends AppController
{
    private ?array $portfolioCounts = null;
    private ?int $tenderPortalsCount = null;
    private ?array $siteTypeIds = null;

    /**
     * {@inheritdoc}
     */

    public function actionIndex($slug)
    {
        $d = Page::findOne(['slug' => $slug]);
        if ($d === null) {
            throw new NotFoundHttpException('Страница не найдена');
        }

        $view = $slug === 'seo-audit' ? 'seo-audit' : 'index';

        $content = $this->applyPageContentMasks((string) $d->text);

        return $this->render($view, ['data' => $content, 'side' => $d->side_menu]);
    }

    public function actionAbout(){
        return $this->render('about');
    }

    public function actionTestpage(){
        return $this->render('testpage');
    }


    private const PAGE_CONTENT_MASK_METHODS = [
        'sites_count' => 'getSitesCount',
        'sites_developed' => 'getSitesDevelopedCount',
        'brands_developed' => 'getBrandsDevelopedCount',
        'sites_promoted' => 'getSitesPromotedCount',
        'tender_portals_built' => 'getTenderPortalsDevelopedCount',
        'latest_sites_slider' => 'getLatestSitesSlider',
        'landing_page_sites_slider' => 'getLandingPageSitesSlider',
        'landig_page_sites_slider' => 'getLandingPageSitesSlider',
        'landing_page_sites_slider_pagination' => 'getLandingPageSitesSliderPagination',
        'landig_page_sites_slider_pagination' => 'getLandingPageSitesSliderPagination',
        'corporate_sites_slider' => 'getCorporateSitesSlider',
        'corporate_sites_slider_pagination' => 'getCorporateSitesSliderPagination',
        'internet_shop_sites_slider' => 'getInternetShopSitesSlider',
        'internet_shops_slider' => 'getInternetShopSitesSlider',
        'internet_shop_sites_slider_pagination' => 'getInternetShopSitesSliderPagination',
        'internet_shops_slider_pagination' => 'getInternetShopSitesSliderPagination',
        'tender_portals_sites_slider' => 'getTenderPortalsSitesSlider',
        'tender_portals_sites_slider_pagination' => 'getTenderPortalsSitesSliderPagination',
    ];

    /**
     * Applies page content masks.
     *
     * Add masks to page content as %mask_variable%.
     * The mask variable name must be written in English snake_case.
     */
    private function applyPageContentMasks(string $content): string
    {
        foreach (self::PAGE_CONTENT_MASK_METHODS as $maskVariable => $method) {
            $placeholders = [
                '%' . $maskVariable . '%',
                '%%' . $maskVariable . '%%',
                '[%' . $maskVariable . '%]',
            ];

            $containsPlaceholder = false;
            foreach ($placeholders as $placeholder) {
                if (strpos($content, $placeholder) !== false) {
                    $containsPlaceholder = true;
                    break;
                }
            }

            if (!$containsPlaceholder) {
                continue;
            }

            $content = str_replace($placeholders, (string) $this->$method(), $content);
        }

        return $content;
    }

    private function getPortfolioCounts(): array
    {
        if ($this->portfolioCounts === null) {
            $counts = Portfolio::find()
                ->select(['site_id', 'cnt' => 'COUNT(*)'])
                ->groupBy('site_id')
                ->asArray()
                ->all();

            $this->portfolioCounts = [];
            foreach ($counts as $count) {
                $siteId = (int) $count['site_id'];
                $this->portfolioCounts[$siteId] = (int) $count['cnt'];
            }
        }

        return $this->portfolioCounts;
    }

    private function getSitesCount(): int
    {
        return $this->getSitesDevelopedCount();
    }

    private function getSitesDevelopedCount(): int
    {
        $counts = $this->getPortfolioCounts();

        return $counts[1] ?? 0;
    }

    private function getBrandsDevelopedCount(): int
    {
        $counts = $this->getPortfolioCounts();

        return $counts[2] ?? 0;
    }

    private function getSitesPromotedCount(): int
    {
        $counts = $this->getPortfolioCounts();

        return ($counts[3] ?? 0) + ($counts[4] ?? 0);
    }

    private function getTenderPortalsDevelopedCount(): int
    {
        if ($this->tenderPortalsCount !== null) {
            return $this->tenderPortalsCount;
        }

        $typeIds = TypeSite::find()
            ->select('id')
            ->where(['like', 'name', 'тендер'])
            ->column();

        if (empty($typeIds)) {
            $this->tenderPortalsCount = 0;

            return $this->tenderPortalsCount;
        }

        $this->tenderPortalsCount = (int) Portfolio::find()
            ->where(['site_id' => 1])
            ->andWhere(['type' => $typeIds])
            ->count();

        return $this->tenderPortalsCount;
    }

    private function getLatestSitesSlider(): string
    {
        $query = Sites::find()
            ->where(['site_id' => 1]);
        $totalCount = (int) $query->count();
        $sites = $query
            ->orderBy(['date' => SORT_DESC, 'id' => SORT_DESC])
            ->limit(12)
            ->all();

        return $this->renderPartial('masks/_latest_sites_slider', [
            'sites' => $sites,
            'totalCount' => $totalCount,
        ]);
    }

    private function getLandingPageSitesSlider(): string
    {
        return $this->renderSitesSliderByTypeNames(
            ['landing', 'лендинг'],
            [1]
        );
    }

    private function getCorporateSitesSlider(): string
    {
        return $this->renderSitesSliderByTypeNames(
            ['корпоратив'],
            [4]
        );
    }

    private function getInternetShopSitesSlider(): string
    {
        return $this->renderSitesSliderByTypeNames(
            ['интернет', 'магазин', 'shop'],
            [2]
        );
    }

    private function getTenderPortalsSitesSlider(): string
    {
        return $this->renderSitesSliderByTypeNames(
            ['тендер', 'портал'],
            [3]
        );
    }

    private function getLandingPageSitesSliderPagination(): string
    {
        return $this->renderSitesSliderByTypeNames(
            ['landing', 'лендинг'],
            [1],
            'landing-page-sites-slider',
            'masks/_latest_sites_slider_with_pagination'
        );
    }

    private function getCorporateSitesSliderPagination(): string
    {
        return $this->renderSitesSliderByTypeNames(
            ['корпоратив'],
            [4],
            'corporate-sites-slider',
            'masks/_latest_sites_slider_with_pagination'
        );
    }

    private function getInternetShopSitesSliderPagination(): string
    {
        return $this->renderSitesSliderByTypeNames(
            ['интернет', 'магазин', 'shop'],
            [2],
            'internet-shop-sites-slider',
            'masks/_latest_sites_slider_with_pagination'
        );
    }

    private function getTenderPortalsSitesSliderPagination(): string
    {
        return $this->renderSitesSliderByTypeNames(
            ['тендер', 'портал'],
            [3],
            'tender-portals-sites-slider',
            'masks/_latest_sites_slider_with_pagination'
        );
    }

    private function renderSitesSliderByTypeNames(
        array $keywords,
        array $fallbackTypeIds,
        string $sliderId = 'noncommercial-slider',
        string $view = 'masks/_latest_sites_slider'
    ): string
    {
        $query = Sites::find()
            ->where(['site_id' => 1])
            ->andWhere(['type' => $this->getTypeIdsByKeywords($keywords, $fallbackTypeIds)]);
        $totalCount = (int) $query->count();
        $sites = $query
            ->orderBy(['date' => SORT_DESC, 'id' => SORT_DESC])
            ->limit(12)
            ->all();

        return $this->renderPartial($view, [
            'sites' => $sites,
            'totalCount' => $totalCount,
            'sliderId' => $sliderId,
        ]);
    }

    private function getTypeIdsByKeywords(array $keywords, array $fallbackTypeIds): array
    {
        if ($this->siteTypeIds === null) {
            $types = TypeSite::find()->select(['id', 'name'])->asArray()->all();
            $this->siteTypeIds = [];
            foreach ($types as $type) {
                $this->siteTypeIds[(int) $type['id']] = mb_strtolower((string) $type['name'], 'UTF-8');
            }
        }

        $matchedIds = [];
        foreach ($this->siteTypeIds as $id => $typeName) {
            foreach ($keywords as $keyword) {
                if (mb_strpos($typeName, mb_strtolower($keyword, 'UTF-8')) !== false) {
                    $matchedIds[] = $id;
                    break;
                }
            }
        }

        $matchedIds = array_values(array_unique($matchedIds));
        if (!empty($matchedIds)) {
            return $matchedIds;
        }

        return $fallbackTypeIds;
    }
}
