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

					//$('#results').html("hi");
					$('#results').html(result['data']['clouds']);
					$('#results').html(result['data']['datetime']);
					$('#results').html(result['data']['temperature']);
					$('#results').html(result['data']['humidity']);
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

