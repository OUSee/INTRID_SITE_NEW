<?php
namespace frontend\controllers;

use backend\models\News;
use common\models\Page;
use common\models\TypeBlog;
use Yii;
use yii\data\ActiveDataProvider;
use yii\helpers\ArrayHelper;
use yii\web\NotFoundHttpException;
use yii\db\Query;
use yii\db\Expression;

/**
 * Blog controller
 */
class BlogController extends AppController
{
    /**
     * Displays blog index page.
     *
     * @return string
     */
    public function actionIndex(?string $type = null)
    {
        // 1) Типы: грузим только сами типы (без with('news')!)
        $types = TypeBlog::find()
            ->alias('tb')
            ->where(['<>', 'tb.id', TypeBlog::CASE_TYPE_ID])
            ->orderBy(['tb.id' => SORT_DESC]) // если нет sort — можно убрать
            ->all();

        $typesBySlug = ArrayHelper::index($types, 'slug');
        $typesById   = ArrayHelper::index($types, 'id');

        // 2) Определяем текущий тип
        $currentType = null;

        if ($type !== null) {
            $currentType = $typesBySlug[$type] ?? null;
        } else {
            $typeId = Yii::$app->request->get('id');
            if ($typeId !== null) {
                $currentType = $typesById[$typeId] ?? null;
            }
        }

        // 3) Базовый запрос страниц
        $query = News::find()
            ->alias('n')
            ->where([
                'n.news' => 1,
                'n.visibility' => 1,
            ])
            ->orderBy(['n.created_at' => SORT_DESC]);

        // Если реально нигде в списке не используешь typeBlogs — убери строку ниже.
        // $query->with('typeBlogs');

        // 4) Фильтруем по выбранной рубрике или исключаем CASE-рубрику
        if ($currentType !== null) {
            $query->innerJoin('{{%page_type_blog}} ptb', 'ptb.page_id = n.id')
                  ->andWhere(['ptb.type_blog_id' => (int)$currentType->id]);

            // страховка от дублей (обычно не нужно, но безопасно)
            $query->distinct();
        } else {
            // ИСКЛЮЧАЕМ те страницы, которые привязаны к CASE_TYPE_ID
            // Никаких leftJoin -> нет раздувания строк -> пагинация корректная
            $sub = (new Query())
                ->from('{{%page_type_blog}} ptb2')
                ->select(new Expression('1'))
                ->where('ptb2.page_id = n.id')
                ->andWhere(['ptb2.type_blog_id' => (int)TypeBlog::CASE_TYPE_ID]);

            $query->andWhere(['not exists', $sub]);
        }

        $dataProvider = new ActiveDataProvider([
            'query' => $query,
            'pagination' => [
                'pageSize' => 12,
            ],
        ]);

        return $this->render('index', [
            'dataProvider' => $dataProvider,
            'types' => $types,
            'currentType' => $currentType,
        ]);//;love vladik;
    }

    /**
     * Displays a single blog post.
     *
     * @param string $slug
     * @return string
     * @throws NotFoundHttpException if the post cannot be found
     */
    public function actionView(string $slug)
    {
        if ($slug === 'pamatka-zakazciku-old') {
            return $this->redirect(['/page/index', 'slug' => 'pamatka-zakazciku'], 301);
        }

        $model = News::findOne(['slug' => $slug]);

        if ($model !== null) {
            return $this->render('view', [
                'model' => $model,
            ]);
        }

        // Если новости нет — проверяем, не является ли slug слагом рубрики (TypeBlog)
        $type = TypeBlog::find()
            ->where(['slug' => $slug])
            ->andWhere(['<>', 'id', TypeBlog::CASE_TYPE_ID])
            ->one();

        if ($type !== null) {
            // Показываем список по рубрике (как будто /blog/<typeSlug>)
            return $this->actionIndex($type->slug);
            // или так, если хочешь 302 редирект на канонический URL:
            // return $this->redirect(['index', 'type' => $type->slug], 302);
        }

        throw new NotFoundHttpException('Страница не найдена');
    }
}
