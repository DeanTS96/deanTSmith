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
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}	

	$another = array();

	$query = 'SELECT p.firstName, p.lastName, p.email, p.id, d.id as departmentID, d.name as department, l.id as locationID, l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE';

	$firstName = $_REQUEST['firstName'];
	$lastName = $_REQUEST['lastName'];
	$email = $_REQUEST['email'];
	$departmentID = $_REQUEST['department'];
	$locationID = $_REQUEST['location'];

	$bindingString = '';

	$count = 0;

	if($firstName) {
		$count += 1;
		$query .= " p.firstName = ?";
		$params[] = $firstName;
		if(!$bindingString) {
			$bindingString = "s";
		} else {
			$bindingString .= "s";
		};
	};

	if($lastName) {
		if($count > 0) {
			$query .= ' AND';
		};
		$count += 1;
		$query .= " p.lastName = ?";
		$params[] = $lastName;
		if(!$bindingString) {
			$bindingString = "s";
		} else {
			$bindingString .= "s";
		};
	};

	if($email) {
		if($count > 0) {
			$query .= ' AND';
		};
		$count += 1;
		$query .= " p.email = ?";
		$params[] = $email;
		if(!$bindingString) {
			$bindingString = "s";
		} else {
			$bindingString .= "s";
		};
	};

	if($departmentID) {
		if($count > 0) {
			$query .= ' AND';
		};
		$count += 1;
		$query .= " d.id = ?";
		$params[] = $departmentID;
		if(!$bindingString) {
			$bindingString = "i";
		} else {
			$bindingString .= "i";
		};
	};

	if($locationID) {
		if($count > 0) {
			$query .= ' AND';
		};
		$count += 1;
		$query .= " l.id = ?";
		$params[] = $locationID;
		if(!$bindingString) {
			$bindingString = "i";
		} else {
			$bindingString .= "i";
		};
	};

	$query .= ' ORDER BY p.lastName, p.firstName, d.name, l.name';

	if($count == 0) {
		$query = 'SELECT p.firstName, p.lastName, p.email, p.id, d.name as department, l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) ORDER BY p.lastName, p.firstName, d.name, l.name';
		$result = $conn->query($query);
	} else {
		$stmt = $conn->prepare($query);

		$stmt->bind_param($bindingString, ...$params);
		$stmt->execute();

		$result = $stmt->get_result();

		$count = 0;
	};

	$data = [];
	
	while ($row = mysqli_fetch_assoc($result)) {

		array_push($data, $row);

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;
	
	mysqli_close($conn);

	echo json_encode($output); 

?>