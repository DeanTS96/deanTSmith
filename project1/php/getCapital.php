<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	$url='https://api.myptv.com/geocoding/v1/locations/by-text?searchText='.$_REQUEST['capital'].'&apiKey=MGE3Y2RlMDJlOWE5NGMzMGE4ZjQ0MDNkOWQwOWYzZTE6OWE3YWJiN2YtYzc1My00MjI5LWFjZjktMGE3OWI1NzUxNjgy';

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

	$output['data'] = $decode['locations'][0]['referencePosition'];
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>
