<?php
namespace frontend\controllers;

use Yii;
use yii\web\Controller;
use yii\filters\VerbFilter;
use yii\filters\AccessControl;
use yii\httpclient\Client;
use ZipArchive;

/**
 * Site controller
 */
class MoabController extends AppController
{
	use \common\components\TraitRequest;
	private $path;
	private $log;

	 public function behaviors()
    {
        return [
            'verbs' => [
                'class' => VerbFilter::className(),
                'actions' => [
                    'index' => ['post'],
                ],
            ],
        ];
    }

	public function actionIndex(){
		
		$post = $this->setAjaxRequest();
		if(!isset($post['word']) and !isset($post['count'])){
			return [
				'status' => false,
			];
		}
		$word =  $post['word'];
		$count = $post['count'];
		$this->path = Yii::getAlias('@app') . "/flagMoab.txt";
		$this->log = Yii::getAlias('@app') . "/log.txt";
		$path = $this->path;
		
		
		if(!file_exists($path)){
			file_put_contents($path, '');
			$this->moab($word.' отзывы');
			file_put_contents($this->log, "\nЗапуск ".date('d.m.Y H:i:s', time())."\n", FILE_APPEND);
			return [
				'status' => false,
			];
		}else{
			
			$str = file_get_contents($path);
			//var_dump(strlen($str));
			if(strlen($str) > 0){
			
				unlink($path);
				return [
					'status' => true,
					'text' => number_format($str, 0, '.', ' '),
					'number' => $str,
					'result' => number_format((($str * $count) / 100), 0, '.', ' '),

				];
			}else{
				return [
					'status' => false,
				];
				return false;
			}
			
		}
		
	}


	private function moab($word) {

		
			
				$f = [
					'-',
					'/',
					',',
					'.',
					':',
					';',
					'"',
					'\'',
					'+',
					'?',
					'!',
					'*',
					')',
					'(',
					'#',
					'№',
					'&',
				];
				$request[] = str_replace($f,' ',$word);
		


			
			
			$client = new Client();
			$response = $client->createRequest()
			->setMethod('POST')
			->setUrl('https://tools.moab.pro/api/Parse/AddTasks')
			->setFormat($client::FORMAT_JSON)
			->setData([
                        // 'api_key' => '734cc0fe-cb15-4102-ae00-f2acaab0ded3',
				'api_key' => 'e3063858-878b-4f3c-83cd-385aee7e1100',
				'partner_code' => null,
				'task' => [
					"phrases_list" => $request,
					"regions" => 225,
					"syntax" => 2,
					"depth" => 1,
					"db" => 0,
					"group_id" => null,
					"also_suggests" => false,
					"also_check" => false,
					"fix_words_order" => false,
					"type" => 1,
					"minus_words" => [],
					"suggests_types" => [],
					"suggests_depth" => 1
				],
			])
			->send()
			;

			if ($response->isOk) {
				file_put_contents($this->log, print_r($response->data, true), FILE_APPEND);
				return $this->getRequestMoab(!empty($response->data['added_ids']) ? $response->data['added_ids'] : $response->data['exists_ids'], 225);
			}
			
		
	}

	private function getRequestMoab($id, $region) {

		$client = new Client();
		$response = $client->createRequest()
		->setMethod('POST')
		->setUrl('https://tools.moab.pro/api/Parse/Check')
		->setFormat($client::FORMAT_JSON)
		->setData([
			'api_key' => 'e3063858-878b-4f3c-83cd-385aee7e1100',
			'id' => $id[0],
		])
		->send();

		if ($response->isOk) {
			if ($response->data['progress'] != 100) {
				sleep(6);
				file_put_contents($this->log, "\nЖДЕМ\n", FILE_APPEND);
				$this->getRequestMoab($id, $region);
			} else {

				if(!is_null($response->data['download_zip'])){
					file_put_contents($this->log, "\nЖДЕМ Запись в файл\n", FILE_APPEND);
					$this->setChastota($response->data['download_zip'], $region);
				}else{
					sleep(2);
					file_put_contents($this->log, "\nЖДЕМ АРХИВ\n", FILE_APPEND);
					$this->getRequestMoab($id, $region);
				}

			}
		}
	}

	private function setChastota($urlZip, $region) {

		$urlc = explode('/', $urlZip);
		$url = urlencode($urlc[count($urlc) - 1]);
		unset($urlc[count($urlc) - 1]);
		$u = implode('/', $urlc);
		file_put_contents(Yii::getAlias('@app') . "/1.zip", file_get_contents($u . '/' . $url));
		$zip = new ZipArchive();
		$res = $zip->open(Yii::getAlias('@app') . "/1.zip");

		if ($res === TRUE) {

			$zip->extractTo(Yii::getAlias('@app') . "/e/");
			$zip->close();

			$files = scandir(Yii::getAlias('@app') . "/e/");
            array_shift($files); // удаляем из массива '.'
            array_shift($files); // удаляем из массива '..'
            for ($i = 0; $i < sizeof($files); $i++) {
            	if (strpos($files[$i], '.csv')) {
            		$len = $files[$i];
            	}
            }

            $d = $this->parse_csv_file(Yii::getAlias('@app') . "/e/" . $len);
			file_put_contents($this->log, print_r($d, true), FILE_APPEND);
            $res = 0;
            for ($i = 1; $i < count($d); $i++) {
            	$res = $d[$i][1];
            }
           

            unlink(Yii::getAlias('@app') . "/1.zip");
            $files = scandir(Yii::getAlias('@app') . "/e/");
            array_shift($files); // удаляем из массива '.'
            array_shift($files); // удаляем из массива '..'
            for ($i = 0; $i < sizeof($files); $i++) {
            	unlink(Yii::getAlias('@app') . "/e/" . $files[$i]);
            }
        }
        // unlink(Yii::getAlias('@app') . "/../flag.txt");
        file_put_contents($this->path, $res);
    }

    private function parse_csv_file($file_path, $file_encodings = ['windows-1251', 'UTF-8'], $col_delimiter = '', $row_delimiter = "") {

    	if (!file_exists($file_path))
    		return false;

    	$cont = trim(file_get_contents($file_path));

//        $encoded_cont = mb_convert_encoding($cont, 'UTF-8', mb_detect_encoding($cont, $file_encodings));
    	$encoded_cont = mb_convert_encoding($cont, 'UTF-8', 'windows-1251');

    	unset($cont);

// определим разделитель
    	if (!$row_delimiter) {
    		$row_delimiter = "\r\n";
    		if (false === strpos($encoded_cont, "\r\n"))
    			$row_delimiter = "\n";
    	}

    	$lines = explode($row_delimiter, trim($encoded_cont));
    	$lines = array_filter($lines);
    	$lines = array_map('trim', $lines);

// авто-определим разделитель из двух возможных: ';' или ','. 
// для расчета берем не больше 30 строк
    	if (!$col_delimiter) {
    		$lines10 = array_slice($lines, 0, 30);

// если в строке нет одного из разделителей, то значит другой точно он...
    		foreach ($lines10 as $line) {
    			if (!strpos($line, ','))
    				$col_delimiter = ';';
    			if (!strpos($line, ';'))
    			$col_delimiter = ',';

    			if ($col_delimiter)
    				break;
    		}

// если первый способ не дал результатов, то погружаемся в задачу и считаем кол разделителей в каждой строке.
// где больше одинаковых количеств найденного разделителя, тот и разделитель...
    		if (!$col_delimiter) {
    			$delim_counts = array(';' => array(), ',' => array());
    			foreach ($lines10 as $line) {
    				$delim_counts[','][] = substr_count($line, ',');
    				$delim_counts[';'][] = substr_count($line, ';');
    			}

                $delim_counts = array_map('array_filter', $delim_counts); // уберем нули
// кол-во одинаковых значений массива - это потенциальный разделитель
                $delim_counts = array_map('array_count_values', $delim_counts);

                $delim_counts = array_map('max', $delim_counts); // берем только макс. значения вхождений

                if ($delim_counts[';'] === $delim_counts[','])
                return array('Не удалось определить разделитель колонок.');

                $col_delimiter = array_search(max($delim_counts), $delim_counts);
            }
        }

        $data = [];
        foreach ($lines as $key => $line) {
            $data[] = str_getcsv($line, $col_delimiter); // linedata
            unset($lines[$key]);
        }

        return $data;
    }
    

}
