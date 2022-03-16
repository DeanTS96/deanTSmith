 $('#butOne').click(function() {

		$.ajax({
			url:  "getWeather.php",
			type: 'POST',
			dataType: 'json',
			data: {
				icao: $('#inputOne').val(),
			},
			success: function(result) {

				console.log(JSON.stringify(result));

				if (result.status.name == "ok") {

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
				console.log("error");
				$("#results").html("Invalid location");
			}
		}); 
	
	});








	$('#butTwo').click(function() {

		$.ajax({
			url:  "getWeatherStation.php",
			type: 'POST',
			dataType: 'json',
			data: {
				lat: $('#inputTwoA').val(),
				lng: $('#inputTwoB').val()
			},
			success: function(result) {

				console.log(JSON.stringify(result));

				if (result.status.name == "ok") {

					$('#results').html("<p>" + 
					"ICAO: " + result['data']['ICAO'] + "<br>" + 
					"Date & Time: " + result['data']['datetime'] + "<br>" + 
					"Country Code: " + result['data']['countryCode'] + "<br>" + 
					"Station Name: " + result['data']['stationName'] + "<br>" + 
					"</p>");
					
				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log("error");
				$("#results").html("Invalid location");
			}
		}); 
	
	});








	$('#butThree').click(function() {

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

				console.log(JSON.stringify(result));

				if (result.status.name == "ok") {

					$('#results').html("<p>" + 
					"Date & Time: " + result['data'][0]['datetime'] + "<br>" + 
					"Latitude: " + result['data'][0]['lat'] + "<br>" + 
					"Longitude: " + result['data'][0]['lng'] + "<br>" + 
					"Magnitude: " + result['data'][0]['magnitude'] + "<br>" + 
					"</p>");
				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log("error");
				$("#results").html("Invalid location");
			}
		}); 
	
	});

