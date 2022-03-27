<?php

	// remove for production

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

    $urlCountryInfo='http://api.geonames.org/countryInfoJSON?formatted=true&lang=en&country='.$_REQUEST['countryCode'].'&username=flightltd&style=full';
    //$urlWikiLinks='http://api.geonames.org/wikipediaSearchJSON?q='.$_REQUEST['country'].'&maxRows=10&username=deantsmith';
    $urlWikiLinks='http://api.geonames.org/wikipediaSearchJSON?q=Canada&maxRows=10&username=deantsmith';

    $responses= [];

   /* $ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$urlCountryInfo);

    $resultCountryInfo=curl_exec($ch);
    curl_close($ch);
    $decodeCountryInfo = json_decode($resultCountryInfo,true);*/

    //array_push($responses, $decodeCountryInfo);

    /*$chWikiLinks = curl_init();
	curl_setopt($chWikiLinks, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($chWikiLinks, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($chWikiLinks, CURLOPT_URL,$urlwikiLinks);

    $resultWikiLinks=curl_exec($chWikiLinks);
    curl_close($chWikiLinks);
    $decodeWikiLinks = json_decode($resultWikiLinks,true);*/

    //array_push($responses, $decodeWikiLinks['geonames'][0]['summary']);
    //array_push($responses, "YOOOOOOOOOO");

    $myArray= array("wikilinks" => $decodeWikiLinks, "CountryInfo" => $decodeCountryInfo);





  

   

	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    // working output to use $output['data'] = array("clouds" => $decode2['geonames'][0]['capital'], "clouds2" => $decode['weatherObservation']['clouds']);
    //$output['data'] = $decode;
    $output['data'] = $responses;
    //$output['data'] = $arrayOfReturns;
    //$output['data'] = $array;
    //$output['data'] = $mydecode + $mydecode2;
    //$output['data'] = "{"."clouds:". $decode['weatherObservation']['clouds'].'"'.$decode['weatherObservation']['ICAO']."}";
	//$output['data'] = $decode['weatherObservation'] + $decode2['geonames'];
    //$output['data'] = $decodeTogether;
    //$output['data'] = $decode['geonames'][0]['capital'];
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>