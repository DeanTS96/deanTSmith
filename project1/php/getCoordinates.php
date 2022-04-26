<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	$result = file_get_contents("../countryBorders.geo.json");

	$decode = json_decode($result,true);
	$countriesArray= $decode['features'];

	$country= $_REQUEST['country'];
	$returnCoords= [];



foreach($countriesArray as $countryObject) {
	if($countryObject['properties']['name'] === $country) {
		$returnCoords= $countryObject['geometry']['coordinates'];
		$returningObject = $countryObject;
		};
	};

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	//$output['data'] = $returnCoords;
	$output['data'] = $returningObject;

	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 
	// GETTING ONLY BORDERS
?>
