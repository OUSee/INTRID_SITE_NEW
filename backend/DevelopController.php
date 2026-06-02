<?php
namespace frontend\controllers;

use yii\base\Controller;
use backend\models\Sites;
use kartik\mpdf\Pdf;
use Yii;


class DevelopController extends AppController{
    
     
    
    public function actionIndex(){
        
        return $this->render('index');
    }
    
    public static function getSiteLP(){
         $page = Sites::getSitePage();
         return $page;
    }
    public static function getSiteKS(){
         $site = Sites::getSiteSite();
         return $site;
    }
    public static function getSiteSS(){
         $site = Sites::getSiteShop();
         return $site;
    }
    public static function getSitePS(){
         $site = Sites::getSitePortal();
         return $site;
    }
    
    
    public function actionCalculator($type = null){
        $session = Yii::$app->session;
        if($type !== null){
            $session['checked'] = $type;   
        }else {
            $session['checked'] = null;    
        }
        return $this->render('calculator');
    }
    
    public function actionBsite()
    {
        return $this->render('bsite');
    }
    
    public function actionBsiteAdd(){
        
    }
    
    public function actionBlogo()
    {
        return $this->render('brief-logo');
    }


    public function actionCalculator2($type = null){
        $session = Yii::$app->session;
        if($type !== null){
            $session['checked'] = $type;   
        }else {
            $session['checked'] = null;    
        }
        return $this->render('calculator2');
    }
    
}
?>
