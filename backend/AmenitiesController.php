<?php
namespace frontend\controllers;

use Yii;
use yii\web\Controller;



/**
 * Site controller
 */
class AmenitiesController extends AppController
{
    /**
     * {@inheritdoc}
     */
   
    public function actionIndex()
    {
        $this->layout = 'main';
        return $this->render('index');
    }
    
   
}
