<?php
namespace frontend\controllers;

use Yii;
use yii\web\Controller;
use common\models\Catalog;
use common\models\Rubric;
use common\models\Page;
use yii\helpers\Url;



/**
 * Site controller
 */
class AppController extends Controller
{
    
   
    public function init(){
        
        parent::init();
        
        
        $title = Yii::$app->settings->get('Settings.name');
        $description = Yii::$app->settings->get('Settings.description');
        $keywords = Yii::$app->settings->get('Settings.keywords'); 
        
       
        if(empty($this->view->title) && !Yii::$app->request->isAjax){
            
            if(Yii::$app->request->pathInfo  !== ''){
//                echo Yii::$app->request->pathInfo;
                if(Yii::$app->request->pathInfo != 'page/index'){
                    if(($model = Catalog::find()->where(['dynamic_id' =>Yii::$app->request->pathInfo])->one()) != null){
                        $title = $model->title;
                        $description = $model->description;
                        $keywords =  $model->keywords;
                    }else{
                        if(($model = Rubric::find()->where(['dynamic_id' => Yii::$app->request->pathInfo])->one()) !== null){
                            $title = $model->title;
                            $description = $model->description;
                            $keywords =  $model->keywords;
                        }else{
                            if(strpos( Yii::$app->request->pathInfo, '/') !== false) {
                                $url = explode('/', Yii::$app->request->pathInfo);
                                if(($model = Page::find()->where(['slug' => $url[count($url)-1]])->limit(1)->one()) !== null){
                                    $title = $model->title  == '' ? $model->name: $model->title;
                                    $description = $model->description;
                                    $keywords =  $model->keywords;
                                }
                            }else{
                                if(($model = Page::find()->where(['slug' => Yii::$app->request->pathInfo])->limit(1)->one()) !== null){
                                    $title = $model->title  == '' ? $model->name: $model->title;
                                    $description = $model->description;
                                    $keywords =  $model->keywords;
                                }
                            }
                            
                        }
                    }
                }else{
                    $model = Page::findOne(Yii::$app->request->get('id'));
                    $title = $model->title;
                    $description = $model->description;
                    $keywords =  $model->keywords;
                }
            }else{
                $title = Yii::$app->settings->get('Settings.nameindex');
                $description = Yii::$app->settings->get('Settings.descriptionindex');
                $keywords = Yii::$app->settings->get('Settings.keywordsindex'); 
            }
            
            $array['title'] = $title == '' ? Yii::$app->settings->get('Settings.name'): $title;
            $array['description'] = $description == '' ? Yii::$app->settings->get('Settings.description'): $description;
            $array['keywords'] = $keywords == '' ? Yii::$app->settings->get('Settings.keywords'): $keywords;

            $this->setSeoView($array);
        }
        
//        $this->params['breadcrumbs'][] = ['label' => 'Корневой раздел меню', 'url' => ['index']];
//        $this->params['breadcrumbs'][] = $this->title;
        
        $data = Yii::$app->request->pathInfo;
        if(strpos($data, '/') !== false){
            $data = explode('/', $data);
            if(count($data) > 1){
                if(!in_array($data[0], ['blog', 'comment', 'article', 'portfolio'])){
                    for($i = 0; $i < count($data); $i++){
                        if($i == count($data)-1){
                           $page = Page::find()->where(['slug'=> $data[$i]])->limit(1)->one();
                           Yii::$app->view->params['breadcrumbs'][] = ['label' => $page->name];
                        }else{
                           if(($model = Rubric::find()->where(['slug' => $data[$i]])->limit(1)->one() )!== null){
                                $pageModel = Page::findOne($model->page_id);
                                Yii::$app->view->params['breadcrumbs'][] = [
                                    'label' => $model->name,
                                    'url' => Url::to(['page/index', 'slug' => $pageModel->slug]),
                                    'title' => $model->name,
                                ];
                           }
                        } 
                    }  
                }
                
                
            }
        }else{
//           
        }
       
    }
    
    
    // public function afterAction($action, $result) {
    //     parent::afterAction($action, $result);
    //     $reg = '/\[\%.\S*\%\]/';
    //     // var_dump($result);
    //     // die;
    //     if(!is_array($result) && !is_object($result)){

    //         preg_match_all($reg, $result, $array,PREG_PATTERN_ORDER);
        
    //         for($i = 0; $i < count($array[0]); $i++){
    //             $arr[$i] = substr(substr($array[0][$i],2), 0, -2); 
    //             $page = explode('_',$arr[$i]);
    //             if(count($page) > 0){
    //                 if($page[0] == 'page'){
    //                     if(isset($page[2])){
    //                         $page[2]= explode('*', $page[2]);
    //                         if(count($page[2]) > 0){
    //                             $name = implode(' ', $page[2]);
    //                         }else{
    //                              $name = $page[2];
    //                         }
                           
    //                     }else{
    //                         $d = Page::findOne ($page[1]);    
    //                         $name = $d->name;
    //                     }
    //                     $arr[$i] = \yii\helpers\Html::a($name,\yii\helpers\Url::to(['page/index', 'slug'=>$page[1]]),['title'=>$d->name]);
    //                 }else{
    //                     if(file_exists(Yii::getAlias('@frontend').'/views/short/'.$arr[$i].'.php')){
    //                         $arr[$i] = $this->renderPartial('/short/'.$arr[$i]);
    //                     }else{
    //                         $arr[$i] = '';
    //                     }
    //                 }
    //             }else{
    //                 if(file_exists(Yii::getAlias('@frontend').'/views/short/'.$arr[$i].'.php')){
    //                     $arr[$i] = $this->renderPartial('/short/'.$arr[$i]);
    //                 }else{
    //                     $arr[$i] = '';
    //                 }
    //             }
    //         }
        
    //         $result = str_replace($array[0], $arr, $result);
    //     }
    //     return $result;
    // }
    
    protected function setSeoView($array){
        $this->view->title = $array['title'];
        $this->view->registerMetaTag(['name' => 'description', 'content' => $array['description']], 'description');
        $this->view->registerMetaTag(['name' => 'keywords', 'content' => $array['keywords']],'keywords'); 
    }
    
    protected function dbg($data){
        echo "<pre>".print_r($data, true)."</pre>";
    }
    
    
   
}
