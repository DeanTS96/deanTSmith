    /*$('#butOne').click(function() {
        navigator.geolocation.getCurrentPosition((position) => {
            console.log(position);
        });
    });*/

    let lat = 0;
    let lng = 0;
    let countryCode;
    console.log(lat);

    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        lat = position.coords.latitude; 
        lng = position.coords.longitude;
        console.log(lat, lng);

        let map = L.map('map').setView([lat, lng], 13);
        L.tileLayer.provider('OpenStreetMap.Mapnik').addTo(map);

        $.ajax({
			url: "getCountryCode.php",
			type: 'POST',
			dataType: 'json',
			data: {
                lat: lat,
                lng: lng
			},
			success: function(result) {
				console.log(JSON.stringify(result));

				if (result.status.name == "ok") {

					$('#heading').html(result.data);
					//$('#heading').html(result['data'][0]['languages']);
                    /*$('#heading').html("<p>" + 
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
			}
		}); 
    });

    console.log(lat);

    setTimeout(function(){
        console.log(lat)
    }, 1000);


	$('#butTwo').click(function() {
        console.log("preessed button two");

		$.ajax({
			url: "getcountryBorders.geo.json.php",
			type: 'POST',
			dataType: 'json',
			data: {
                icao: "LSZH"
			},
			success: function(result) {
				console.log(JSON.stringify(result));

				if (result.status.name == "ok") {

					$('#paragraph').html(result.data);
					//$('#paragraph').html(result['data'][0]['languages']);
				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
		}); 
	
	});


	//GET STUFF
    $('#butOne').click(function() {
        console.log("preessed");

		$.ajax({
			url: "getStuff.php",
			type: 'POST',
			dataType: 'json',
			data: {
                icao: "LSZH"
			},
			success: function(result) {
				console.log(JSON.stringify(result));

				if (result.status.name == "ok") {

					//$('#heading').html(result.data);
					//$('#heading').html(result['data'][0]['languages']);
                    $('#heading').html("<p>" + 
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
			}
		}); 
	
	});

	
        

  