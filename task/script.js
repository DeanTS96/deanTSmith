 $('#butOne').click(function() {
		console.log("hi 1")

		$.ajax({
			url:  "getWeather.php",
			type: 'POST',
			dataType: 'json',
			data: {
				icao: $('#inputOne').val(),
			},
			success: function(result) {
				console.log("hi 2")

				console.log(JSON.stringify(result));

				if (result.status.name == "ok") {
					console.log("hi 3")

					$('#results').html("<p>" + 
					"Clouds: " + result['data']['clouds'] + "<br>" + 
					"Wind Speed: " + result['data']['windSpeed'] + "<br>" + 
					"Humidity: " + result['data']['humidity'] + "<br>" + 
					"Temperature: " + result['data']['temperature'] + "<br>" + 
					"Date & Time: " + result['data']['datetime'] + 
					"</p>");
				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
				console.log("error");
			}
		}); 
	
	});








	$('#butTwo').click(function() {
		console.log("hi 1")

		$.ajax({
			url:  "getWeatherStation.php",
			type: 'POST',
			dataType: 'json',
			data: {
				lat: $('#inputTwoA').val(),
				lng: $('#inputTwoB').val()
			},
			success: function(result) {
				console.log("hi 2")

				console.log(JSON.stringify(result));

				if (result.status.name == "ok") {
					console.log("hi 3")

					//$('#results').html("hi");
					$('#results').html(result['data']['clouds']);
					/*$('#results').html("<p>" + 
					
					"</p>");*/
				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
				console.log("error");
			}
		}); 
	
	});








	$('#butThree').click(function() {
		console.log("hi 1")

		$.ajax({
			url:  "getEarthquakes.php",
			type: 'POST',
			dataType: 'json',
			data: {
				north: $('#inputThreeA').val(),
				south: $('#inputThreeB').val(),
				east: $('#inputThreeC').val(),
				west: $('#inputThreeD').val()
			},
			success: function(result) {
				console.log("hi 2")

				console.log(JSON.stringify(result));

				if (result.status.name == "ok") {
					console.log("hi 3")

					$('#results').html(result['data'][0]['datetime']);

					/*$('#results').html("<p>" + 
					"Clouds: " + result['data']['clouds'] + "<br>" + 
					"Wind Speed: " + result['data']['windSpeed'] + "<br>" + 
					"Humidity: " + result['data']['humidity'] + "<br>" + 
					"Temperature: " + result['data']['temperature'] + "<br>" + 
					"Date & Time: " + result['data']['datetime'] + 
					"</p>");*/
				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
				console.log("error");
			}
		}); 
	
	});

