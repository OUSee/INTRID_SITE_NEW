<?php
namespace frontend\controllers;

use Yii;
use yii\web\Controller;
use common\models\Calculator;
use yii\web\Response;


/**
 * Site controller
 */
class CalculatorController extends AppController
{
    /**
     * {@inheritdoc}
     */
    
   
   public function actionArrayPrice(){
       Yii::$app->response->format = Response::FORMAT_JSON;

       $data = Calculator::getPrice();
        // print_r($data->price);
       $df = $this->massiv($data);
       return[
        'price' => $df[0],
        'name' => $df[1],
       ] ;
      
   }
   
    public function actionCheked(){
        Yii::$app->response->format = Response::FORMAT_JSON;
        $session = Yii::$app->session;
        $test = $session['checked'];
        //$test = isset($test) ? $test : 'page';
        return $this->massiv(Calculator::getChecked($test))[0];
        
    }
    
    private function massiv($data){
        $d = []; $k = [];
        for($i = 0; $i < count($data);$i++){
            $d['a_'.$data[$i]['type'].'_'.$data[$i]['sort']] = (int)$data[$i]['price'];
            $k[$i] = 'a_'.$data[$i]['type'].'_'.$data[$i]['sort']." - ".$data[$i]['price']." - ".$data[$i]['name'];
        }
        return [ $d,$k ];
    }
    public function actionAnalizPrice(){
      Yii::$app->response->format = Response::FORMAT_JSON;
      return [
        'data_1' => 1500,
        'data_2' => 1500,
        'data_3' => 2000,
        'data_4' => 500,
        'data_5' => 1000,
        'data_6' => 300,
        'data_7' => 300,
        'data_8' => 200,
        'data_9' => 200,
      ];
    }
   
}
