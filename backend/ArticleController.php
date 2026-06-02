<?php
namespace frontend\controllers;

use Yii;
use yii\web\Controller;
use common\models\Calculator;
use yii\web\Response;
use backend\models\News;
use yii\web\NotFoundHttpException;
use common\models\Page;
use common\models\TypeBlog;
use yii\data\Pagination;


/**
 * Site controller
 */
class ArticleController extends AppController
{

    const BLOG_COUNT = 7;
    /**
     * {@inheritdoc}
     */
    public function actionIndex($id){
        // $post = Yii::$app->request->get();
        $query = News::find()->where(['type' => $id])->orderBy(['created_at' => SORT_DESC]);
        $countQuery = clone $query;
        $pages = new Pagination(['totalCount' => $countQuery->count(), 'pageSize' => self::BLOG_COUNT]);
        $model = $query->offset($pages->offset)->limit($pages->limit)->all();


        $name = TypeBlog::find()->where(['id' => $id])->limit(1)->one();

        if( !empty($model)){
            
            return $this->render('index',['data' => $model, 'name' => $name, 'pages' => $pages]);
        }
        
        throw new NotFoundHttpException('Страница не найдена');



    }
    
    public function actionView(){
        $post = Yii::$app->request->get();

        $model = Page::find()->where(['id'=>$post['id']])->limit(1)->one();
        if(!empty($model)){
            if((count($post) >= 1)){
                Yii::$app->response->redirect('/'.$model->slug, 301);
                Yii::$app->end();
            }
            return $this->render('view', ['model' => $model]);
        }
        throw new NotFoundHttpException('Страница не найдена');
    }


    public function actionBlog(){
    	$models = News::find()->where(['news' => 1])->limit(3)->orderBy(['created_at' => SORT_DESC])->all();
        return $this->render('_blog', ['models' => $models]);
    }
 
   
}
