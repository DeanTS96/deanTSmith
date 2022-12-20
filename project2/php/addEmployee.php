<?php

    ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
		
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = ['Should not break here'];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}	

	$stmt = $conn->prepare('INSERT INTO personnel(id, firstName, lastName, jobTitle, email, departmentID) VALUES (DEFAULT, ?, ?, ?, ?, ?)');

	$firstName = $_REQUEST['firstName'];
	$lastName = $_REQUEST['lastName'];
	$jobTitle = '';
	$email = $_REQUEST['email'];
	$departmentID = $_REQUEST['department'];

	$stmt->bind_param("ssssi", $firstName, $lastName, $jobTitle, $email, $departmentID);
	$stmt->execute();
   
	$data = 'success';

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;
	
	mysqli_close($conn);

	echo json_encode($output); 

?>