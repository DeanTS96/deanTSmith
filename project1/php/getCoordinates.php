<?php

	// remove for production

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	$result = file_get_contents("../countryBorders.geo.json");

	$decode = json_decode($result,true);
	$countriesArray= $decode['features'];
	//$returningArray= [];
	//$whatever= $countriesArray[0]['properties']['name'];
	$country= $_REQUEST['country'];
	$returnCoords= [];

/*function getCoords(&$returnCoords) {
	foreach($countriesArray as $countryObject) {
		if($countryObject['properties']['name'] === $country) {
			$returnCoords= $countryObject['geometry']['coordinates'];
			//$returningArray[]= array("country" => $countryObject['properties']['name'], "iso" => $countryObject['properties']['iso_a2']);
			};
		};
};*/

foreach($countriesArray as $countryObject) {
	if($countryObject['properties']['name'] === $country) {
		$returnCoords= $countryObject['geometry']['coordinates'];
		//$returningArray[]= array("country" => $countryObject['properties']['name'], "iso" => $countryObject['properties']['iso_a2']);
		};
	};

	//getCoords($returnCoords);

		//$returnCoords= $countriesArray[0]['geometry']['coordinates'];

	/*$newArray= [];
	$newArray[]= array("tree" => "me");
	$newArray[]= "tree";
	$newArray[]= "tree";
	$newArray[]= "tree";*/


	/*$array= array('red', 'green');
	array_push($array, 'blue', 'yellow');*/

	


	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	//$output['data'] = $decode['features'];
	$output['data'] = $returnCoords;
	//$output['data'] = $newArray;
	//$output['data']= $whatever;
	//$output['data'] = $returningArray;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 
	// GETTING ONLY BORDERS
?>
