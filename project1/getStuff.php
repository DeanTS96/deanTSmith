<?php

	// remove for production

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

    $url='http://api.geonames.org/weatherIcaoJSON?formatted=true&ICAO=' .  $_REQUEST['icao'] . '&username=deantsmith&style=full';
    $url2='http://api.geonames.org/countryInfoJSON?formatted=true&lang=en&country=GB&username=flightltd&style=full';




    $ch2 = curl_init();
	curl_setopt($ch2, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch2, CURLOPT_URL,$url2);
    $result2=curl_exec($ch2);
    curl_close($ch2);
    $decode2 = json_decode($result2,true);


	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);
    $result=curl_exec($ch);
    curl_close($ch);
    $decode = json_decode($result,true);

    $strdecode = $decode['weatherObservation']['clouds'].$decode['weatherObservation']['clouds'];


    //$array = array("clouds" => $decode['weatherObservation']['clouds'], "clouds2" => $decode['weatherObservation']['clouds']);

    //class foo 
    //{
      //  function do_foo()
      //  {
        //    echo "doing foo.";
      //  }
 //   }

   //$bar = new foo;
   // $bar->do_foo();*/


        //$mydecode = $decode['weatherObservation']['ICAO'];
       // $mydecode2 = $decode2['geonames'][0]['capital'];

        //$decodeTogether = $result.$result2;


	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = array("clouds" => $decode['weatherObservation']['clouds'], "clouds2" => $decode['weatherObservation']['clouds']);
    //$output['data'] = $array;
    //$output['data'] = $mydecode + $mydecode2;
    //$output['data'] = "{"."clouds:". $decode['weatherObservation']['clouds'].'"'.$decode['weatherObservation']['ICAO']."}";
	//$output['data'] = $decode['weatherObservation'] + $decode2['geonames'];
    //$output['data'] = $decodeTogether;
    //$output['data'] = $decode['geonames'][0]['capital'];
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>