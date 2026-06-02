<?php
namespace frontend\controllers;

use Yii;
use yii\web\Controller;
use common\models\Portfolio;
use common\models\BannerCascade;
use backend\models\Seo;
use backend\models\Smm;
use backend\models\Logo;
use backend\models\Sites;
use yii\data\Pagination;



/**
 * Site controller
 */
class PortfolioController extends AppController
{
    
    private $types = [
       1 => 'landing-page',
       2 =>  'online-store',
       3 => 'informational-portal',
       4 => 'corporate-website',
       5 => 'tender-portal',
//        corporate-website
    ];
    private $site_types = [
        'all' => 0,
        'landing-page' => 1,
        'online-store' => 2,
        'informational-portal' => 3,
        'corporate-website' => 4,
        'tender-portal' => 5,
    ];
    
    const PORTFOLIO_COUNT = 18;
    const PORTFOLIO_SEO_COUNT = 5;
    
    private $types_logo = [
        1 => 'log',
        2 => 'firstil',
        3 => 'rekl',
    ];
    
     private $logo_type = [
       'log' => 1,
        'firstil' => 2,
        'rekl' => 3,
    ];
    /**
     * {@inheritdoc}
     */
   
    public function actionIndex()
    {
       
        // $site = BannerCascade::getBannerTypeSite();
        $site = Sites::find()->where(['site_id'=> 1])->orderBy(['date' =>SORT_DESC])->limit(6)->all();
        $logo = Logo::find()->where(['site_id'=> 2])->orderBy(['date' =>SORT_DESC])->limit(8)->all();
        $logoImg = BannerCascade::getBannerTypeLogoInPortfolio();
        $seo  = Seo::getListSeoForSlider();//Seo::getImportantSeo(); 
        $smm  = Smm::getSliderSmm();//Smm::getImportantSmm();
        $count = Portfolio::getAllInfoCount();
        return $this->render('index',[
            'data'=>[
                'site' => $site,
                'logo' => $logo,
                'seo'  => $seo,
                'smm'  => $smm,
                'logoImg'  => $logoImg,
            ],
            'count' => $count,
            ]);
    }
    
    public function actionLogo(){

        $request = Yii::$app->request;
        $render = $request->isAjax ? 'renderAjax' : 'render';
        $filter = $this->normalizePortfolioFilter($request->get('data'));

        if ($filter === 'rekl') {
            $query = Sites::find()
                ->where(['site_id'=> 1])
                ->orderBy(['date' => SORT_DESC]);

            $countQuery = clone $query;
            $paginator = new \yii\data\Pagination([
                'totalCount' => $countQuery->count(),
                'pageSize' => self::PORTFOLIO_COUNT,
            ]);
            $data = $query->offset($paginator->offset)->limit($paginator->limit)->all();

            foreach ($data as $d){
                if (isset($this->types[$d->type])) {
                    $d->type = $this->types[$d->type];
                }
            }

            if ($request->isAjax) {
                return $this->renderAjax('_site', [
                    'sites' => $data,
                    'paginator' => $paginator,
                ]);
            }

            return $this->render('logo', [
                'logo' => $data,
                'sites' => $data,
                'paginator' => $paginator,
                'activeType' => 'rekl',
                'portfolioPartial' => '_site',
                'isSiteCatalog' => true,
            ]);
        }

        $query = Logo::find()->where(['site_id'=> 2]);
        if ($filter !== null && isset($this->logo_type[$filter])) {
            $query = $query->andWhere(['type'=>  $this->logo_type[$filter]]);
        }

        $query = $query->orderBy(['date' => SORT_DESC]);

        $countQuery = clone $query;
        $paginator = new \yii\data\Pagination([
            'totalCount' => $countQuery->count(),
            'pageSize' => self::PORTFOLIO_COUNT,
        ]);
        $data = $query->offset($paginator->offset)->limit($paginator->limit)->all();
        foreach ($data as $d){
            if (isset($this->types_logo[$d->type])) {
                $d->type = $this->types_logo[$d->type];
            }
        }
        return $this->$render($request->isAjax ? '_logo' : 'logo', [
            'logo' => $data,
            'paginator' => $paginator,
        ]);
    }

    private function normalizePortfolioFilter($value): ?string
    {
        if ($value === null) {
            return null;
        }

        $value = trim((string)$value);
        if ($value === '') {
            return null;
        }

        return trim($value, "/# \t\n\r\0\x0B");
    }
    
    public function actionSeo($id = null)
    {
        $query = Seo::getAllSeoPagination();
        $selected = null;

        if ($id !== null) {
            $selected = Seo::findOne((int) $id);
            if ($selected !== null) {
                $query = $query->andWhere(['<>', 'id', $selected->id]);
            }
        }

        $countQuery = clone $query;
        $totalCount = $countQuery->count();
        if ($selected !== null) {
            $totalCount += 1;
        }

        $pages = new Pagination([
            'totalCount' => $totalCount,
            'pageSize' => self::PORTFOLIO_SEO_COUNT,
        ]);

        if ($selected !== null) {
            if ($pages->offset === 0) {
                $limit = $pages->limit - 1;
                $data = $query->limit($limit)->all();
                array_unshift($data, $selected);
            } else {
                $offset = $pages->offset - 1;
                $data = $query->offset($offset)->limit($pages->limit)->all();
            }
        } else {
            $data = $query->offset($pages->offset)->limit($pages->limit)->all();
        }

        return $this->render('seo', ['seo' => $data, 'pages' => $pages]);
    }
      
      
    public function actionSite(){
        $query = Sites::find()->where(['site_id'=> 1]);
        if(!Yii::$app->request->isAjax){
            if(Yii::$app->request->get('data') !== null){
                $post = substr(Yii::$app->request->get('data'), 1);
                if($post !== false && $post !== 'all'){
                    $query = $query->andWhere(['type'=> $this->site_types[$post]]);
                }
            }
            $render = 'render';
            $l = 'site';

        }else{
            $post = substr(Yii::$app->request->get('data'), 1);
            if($post !== false && $post !== 'all'){
                $query = $query->andWhere(['type'=> $this->site_types[$post]]);
            }
            $render = 'renderAjax';
            $l = '_site';
        }
        $query = $query->orderBy(['date' =>SORT_DESC]);
        
        $countQuery = clone $query;
        $paginator = new \yii\data\Pagination(['totalCount' => $countQuery->count(),'pageSize' => self::PORTFOLIO_COUNT]);
        $data = $query->offset($paginator->offset)->limit($paginator->limit)->all();
        
        foreach ($data as $d){
            $d->type = $this->types[$d->type];
        }
        
        return $this->$render($l, [
	    'sites' => $data,
	    'paginator' => $paginator,
	]);
        
        
        
        
//        $data = Sites::getAllSites();
        
//        return $this->render('site',['sites'=> $data]);
    }
    
    public function actionSmm(){
        $data = Smm::getAllSmm();
        return $this->render('smm',['smm'=>$data]);
    }
   
    
    
    
}
