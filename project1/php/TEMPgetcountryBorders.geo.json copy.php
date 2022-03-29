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

	//$countryName= 'nothing';

	foreach($countriesArray as $countryObject) {
		$returningArray[]= array("country" => $countryObject['properties']['name'], "iso" => $countryObject['properties']['iso_a2']);
		};

		//$newReturningArray[]= array("currentCountry" => $countryName , "returningArray" => $returningArray);
	

		//populate($countryName);

		//$returningArray[]= array("currentCountryName" => $countryName);

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
	//$output['data'] = $countriesArray;
	//$output['data'] = $newArray;
	//$output['data']= $whatever;
	//$output['data']= $decode['features'];
	
	$output['data'] = $returningArray;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>
