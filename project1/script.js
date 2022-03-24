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

	//populate dropdownbox
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
					//$('#countries').append($("<option>").val("HI").text("NONO"));
					//$('#paragraph').html(result['data'][0]['languages']);
					result.data.forEach(
						function(countryObject) {
							$('#countries').append($("<option>").val(countryObject.iso).text(countryObject.country));
							//let newOption = document.createElement("option");
							//newOption.innerHTML = countryObject.country;
							//document.getElementById("countries").appendChild(newOption);

							//$('#countries').append($("<option>").val("GB").text("Britain"));
							
							//console.log(countryObject.country);
							//console.log(countryObject);
					});
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

	$('#butThree').click(function() {
		console.log('pressed 3');

		$.ajax({
			url: "TEMPgetCountryInfo.php",
			type: 'POST',
			dataType: 'json',
			data: {
				country: $('select').val(),
				lang: 'en'
			},
			success: function(result) {
				console.log(JSON.stringify(result));
				console.log(result);

				if (result.status.name == "ok") {

					/*$('#txtContinent').html(result['data'][0]['continent']);
					$('#txtCapital').html(result.data);
					console.log(result);
					$('#txtLanguages').html(result['data'][0]['languages']);
					$('#txtPopulation').html(result['data'][0]['population']);
					$('#txtArea').html(result['data'][0]['areaInSqKm']);*/

				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
		}); 
	
	});

	$('#butFour').click(function() {
		console.log('pressed 4, exchange rates');

		$.ajax({
			url: "TEMPgetExchangeRates.php",
			type: 'POST',
			dataType: 'json',
			data: {
				currency: 'MEX'
			},
			success: function(result) {
				console.log(JSON.stringify(result));
				console.log(result);

				if (result.status.name == "ok") {

					/*$('#txtContinent').html(result['data'][0]['continent']);
					$('#txtCapital').html(result.data);
					console.log(result);
					$('#txtLanguages').html(result['data'][0]['languages']);
					$('#txtPopulation').html(result['data'][0]['population']);
					$('#txtArea').html(result['data'][0]['areaInSqKm']);*/

				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
		}); 
	
	});

	$('#butFive').click(function() {
		console.log('pressed 5, wikilinks');

		$.ajax({
			url: "TEMPgetWikiLinks.php",
			type: 'POST',
			dataType: 'json',
			data: {
				country: $("select option:selected").html()
			},
			success: function(result) {
				console.log(JSON.stringify(result));
				console.log(result);

				if (result.status.name == "ok") {

					/*$('#txtContinent').html(result['data'][0]['continent']);
					$('#txtCapital').html(result.data);
					console.log(result);
					$('#txtLanguages').html(result['data'][0]['languages']);
					$('#txtPopulation').html(result['data'][0]['population']);
					$('#txtArea').html(result['data'][0]['areaInSqKm']);*/

				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
		}); 
	
	});

	$('#butSix').click(function() {
        console.log("preessed button 6, country border coords");

		$.ajax({
			url: "TEMPgetCountryBorders.php",
			type: 'POST',
			dataType: 'json',
			data: {
                country: $("select option:selected").html()
			},
			success: function(result) {
				console.log(JSON.stringify(result));

				if (result.status.name == "ok") {

					//$('#paragraph').html(result.data);
					//$('#countries').append($("<option>").val("HI").text("NONO"));
					//$('#paragraph').html(result['data'][0]['languages']);
					/*result.data.forEach(
						function(countryObject) {
							$('#countries').append($("<option>").val(countryObject.iso).text(countryObject.country));
							//let newOption = document.createElement("option");
							//newOption.innerHTML = countryObject.country;
							//document.getElementById("countries").appendChild(newOption);

							//$('#countries').append($("<option>").val("GB").text("Britain"));
							
							//console.log(countryObject.country);
							//console.log(countryObject);
					});*/
				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
		}); 	
	});


	$('#butSeven').click(function() {
        console.log("preessed button 7, get lat, lng");

		$.ajax({
			url: "TEMPgetLatLng.php",
			type: 'POST',
			dataType: 'json',
			data: {
                country: $("select option:selected").html(),
				code: $("select").val()
			},
			success: function(result) {
				console.log(JSON.stringify(result));

				if (result.status.name == "ok") {

					//$('#paragraph').html(result.data);
					//$('#countries').append($("<option>").val("HI").text("NONO"));
					//$('#paragraph').html(result['data'][0]['languages']);
					/*result.data.forEach(
						function(countryObject) {
							$('#countries').append($("<option>").val(countryObject.iso).text(countryObject.country));
							//let newOption = document.createElement("option");
							//newOption.innerHTML = countryObject.country;
							//document.getElementById("countries").appendChild(newOption);

							//$('#countries').append($("<option>").val("GB").text("Britain"));
							
							//console.log(countryObject.country);
							//console.log(countryObject);
					});*/
				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
		}); 	
	});


	/*let newOption = document.createElement("option");
	newOption.value = "GB";
	newOption.innerHTML = "Britain";
	document.getElementById("countries").appendChild(newOption);*/
	
        

  