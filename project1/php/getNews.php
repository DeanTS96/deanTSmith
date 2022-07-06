<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	$url='https://newsapi.org/v2/top-headlines?country='.$_REQUEST['countryCode'].'&apiKey=4f8ccd8433534765a5976445526d92e0';
	//$url='https://newsapi.org/v2/top-headlines?country=GB&apiKey=4f8ccd8433534765a5976445526d92e0';
	//$url='https://newsapi.org/v2/top-headlines?country=US&apiKey=4f8ccd8433534765a5976445526d92e0';
	//$URL='https://newsapi.org/v2/top-headlines?country=us&apiKey=4f8ccd8433534765a5976445526d92e0';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

	$output['data'] = $decode;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>
