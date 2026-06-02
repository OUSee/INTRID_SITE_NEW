<?php
namespace frontend\controllers;

use Yii;
use yii\web\Controller;
use frontend\models\Comments;
use common\models\Portfolio;
use common\models\Comment;



/**
 * Site controller
 */
class CommentController extends AppController
{
    
    const COMMENT_COUNT = 10;
    /**
     * {@inheritdoc}
     */
   
    public function actionIndex()
    {
        $request = Yii::$app->request;
        $rating = $request->post('rating', $request->get('rating', 'all'));
        $type = $request->post('type', $request->get('type', 'all'));

        $query = Comment::find()
            ->where(['active' => 1])
            ->orderBy(['date' => SORT_DESC]);

        if ($rating !== 'all') {
            $query->andWhere(['rating' => (int) $rating]);
        }

        if ($type !== 'all') {
            $query->andWhere(['source' => (int) $type]);
        }

        $countQuery = clone $query;
        $params = $request->get();
        $params['rating'] = $rating;
        $params['type'] = $type;

        $paginator = new \yii\data\Pagination([
            'totalCount' => $countQuery->count(),
            'pageSize' => self::COMMENT_COUNT,
            'params' => $params,
        ]);

        $model = $query->offset($paginator->offset)->limit($paginator->limit)->all();

        $ratingsStatQuery = Comment::find()
            ->select(['rating', 'COUNT(*) AS count'])
            ->where(['active' => 1]);

        if ($type !== 'all') {
            $ratingsStatQuery->andWhere(['source' => (int) $type]);
        }

        $ratingsStat = $ratingsStatQuery
            ->groupBy('rating')
            ->indexBy('rating')
            ->asArray()
            ->all();

        $totalRatings = array_sum(array_column($ratingsStat, 'count'));
        $ratingSum = 0;
        foreach ($ratingsStat as $rate => $data) {
            $ratingSum += $rate * (int) $data['count'];
        }
        $averageRating = $totalRatings > 0 ? round($ratingSum / $totalRatings, 1) : 0;

        $percentages = [];
        for ($i = 5; $i >= 1; $i--) {
            $count = $ratingsStat[$i]['count'] ?? 0;
            $percentages[$i] = $totalRatings > 0 ? round($count / $totalRatings * 100) : 0;
        }

        $sourceRatingsRaw = Comment::find()
            ->select([
                'source',
                'AVG(rating) AS average_rating',
                'COUNT(*) AS count',
            ])
            ->where(['active' => 1])
            ->groupBy('source')
            ->indexBy('source')
            ->asArray()
            ->all();

        $sourceRatings = [];

        foreach ($sourceRatingsRaw as $source => $data) {
            $sourceRatings[$source] = [
                'average' => round((float) $data['average_rating'], 1),
                'count' => (int) $data['count'],
            ];
        }

        $reviewsCount = Comment::find()
            ->where(['active' => 1])
            ->andWhere(['!=', 'text', ''])
            ->count();

        return $this->render('index', [
            'model' => $model,
            'paginator' => $paginator,
            'rating' => $rating,
            'type' => $type,
            'averageRating' => $averageRating,
            'ratingsCount' => $totalRatings,
            'reviewsCount' => $reviewsCount,
            'percentages' => $percentages,
            'sourceRatings'  => $sourceRatings,
        ]);
    }
    
    public function actionAdd() {

        $model = new Comments();
        Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
        $render2 = $this->renderAjax('_modal');
        if (Yii::$app->request->isAjax) {

            if ($model->load(Yii::$app->request->post())) {
                $session = Yii::$app->session;
                if ($model->validate()) {
                    $d = $session['portfolio_id'];
                    $model->portfolio_id = $d;
                    $model->active = 0;
                    $model->date = time();
                    if ($model->save()) {
                       return $data = [
                            'status' => true,
                            'data' => [
                                'title' => 'Отзыв добавлен',
                                'body' => ''
                            ],
                            'dataEnd' => [
                                'title' => 'Введите пароль, что бы оставить отзыв',
                                'body' => $render2
                            ],
                        ];
                    } 
                }
            }
            return $data =[
            'status' => false,
            'data' => 'Ошибка добавления отзыва',
            'dataEnd' => [
                'title' => 'Введите пароль, что бы оставить отзыв',
                'body' => $render2
            ],
        ];
        }
    }

    public function actionPassword(){
        $post = Yii::$app->request->post('pass');
        Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
        $render2 = $this->renderAjax('_modal');
        
        if($post){
            $post = \yii\helpers\Html::encode($post);
            // $post = md5($post);
            if(($portfolio = Portfolio::find()->where(['passwords' => $post])->limit(1)->one()) !== null){
                $session = Yii::$app->session;
                $session['portfolio_id'] = $portfolio->id;
                $model = new Comments(); 
                Yii::$app->assetManager->bundles = [
                    'yii\bootstrap\BootstrapPluginAsset' => false,
                    'yii\bootstrap\BootstrapAsset' => false,
                    'yii\web\JqueryAsset' => false
                ];
                $render1 = $this->renderAjax('_form',['model'=> $model]);
                $title = 'Вы успешно авторизовались как '.$portfolio->owner;
                return $data = [
                    'status' => true,
                    'data' =>  [
                        'title' => $title,
                        'body' => $render1
                    ],
                    'dataEnd' => [
                        'title' => 'Введите пароль, что бы оставить отзыв',
                        'body' => $render2
                    ],
                ];
            }
        }
        return $data =[
            'status' => false,
            'data' => 'Простите пароль введен не верно',
            'dataEnd' => [
                'title' => 'Введите пароль, что бы оставить отзыв',
                'body' => $render2
            ],
        ];
    }
    
    
    
   
}
