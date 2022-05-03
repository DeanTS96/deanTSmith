<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	//$url='http://api.geonames.org/countryInfoJSON?formatted=true&lang=en&country='.$_REQUEST['country'].'&username=flightltd&style=full';
	$url='https://api.windy.com/api/webcams/v2/list/country='.$_REQUEST['countryCode'].'?key=hS9g1WuGvRcgf4GmYaNeczwXtGQLdQh1&show=webcams:location,player';
	//https://api.windy.com/api/webcams/v2/list/limit=20/country=GB?key=hS9g1WuGvRcgf4GmYaNeczwXtGQLdQh1&show=webcams:location

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

	$output['data'] = $decode['result'];
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>