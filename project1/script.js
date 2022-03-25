    /*$('#butOne').click(function() {
        navigator.geolocation.getCurrentPosition((position) => {
            console.log(position);
        });
    });*/

	let countryInfoResult = "country info";
	let countryCodeResult = "country code";
	let wikiLinksResult = "wiki Results";


    let lat = 0;
    let lng = 0;
	let map;
    let countryCode;
	let datapolygon;
	//let swappedArray = [];

    console.log(lat);


    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        lat = position.coords.latitude; 
        lng = position.coords.longitude;
        console.log(lat, lng);

        map = L.map('map').setView([lat, lng], 13);
        L.tileLayer.provider('OpenStreetMap.Mapnik').addTo(map);
		
		var polygon = L.polygon([
			[-3.404856459164713, -80.30256059438722],[-2.65751189535964, -79.77029334178093],[-2.220794366061014, -79.98655921092241]
		]).addTo(map);

		/*var mypolygon = L.polygon([
			[-82.96578304719736,8.225027980985985],[-83.50843726269431,8.446926581247283],[-83.71147396516908,8.656836249216866]
		]).addTo(map);*/

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
	// getting countryInfo and Weather rn
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
					//countryInfoResult =  result.data[0].continent;
					countryInfoResult = result.data[0];

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
				currency: 'MXN'
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
					console.log(' ---> dataLength');
					console.log(result.data.length);
					console.log("hi, result dot data");
					console.log(result.data);
					//let array = result.data.length;

					//map = L.map('map').setView([lat, lng], 13);
        			//L.tileLayer.provider('OpenStreetMap.Mapnik').addTo(map);

					//let swappedArray = [];

					if(result.data.length > 1) {
						let fullArray = [];
						let madeUpArray = [1, 2, 3];
						
						function swapLatLng(array) { 
							console.log(array.length + " in function length");
							for(let i = 0; i < array.length; i++) {
								let swappedArray = [];
								console.log(array[i]);

								array[i].forEach((coords) => {
									/*console.log(coords, " before swap");
										temp = coords[0];
										coords[0] = coords[1];
										coords[1] = temp;
										console.log(coords, " after swap");*/

										coords.forEach((setOfTwo) => {

											console.log(setOfTwo, " before swap");
											temp = setOfTwo[0];
											setOfTwo[0] = setOfTwo[1];
											setOfTwo[1] = temp;
											console.log(setOfTwo, " after swap");
										});
							
										swappedArray.push(coords);
								});
								/*for(let j = 0; j < array[0][0].length; j++) {
									console.log("hi");
								}*/

								/*array[0][i].forEach( (arrayNum) => {
									console.log(arrayNum, "YO");
									console.log(array[0][i].length);
								});*/

								
								/*() => {
									let swappedArray = [];
								array[0][i].forEach((coords) => {
					
									temp = coords[0];
									coords[0] = coords[1];
									coords[1] = temp;
									//console.log(coords)
						
									swappedArray.push(coords);
								});
								console.log(swappedArray, "hi");
							 }*/
								fullArray.push(swappedArray);
							}
							
						};

						console.log("full array > ", fullArray);
						

						swapLatLng(result.data);

						var mypolygon = L.polygon([
							fullArray
						]).addTo(map);

					} else {

						let swappedArray = [];

					function swapLatLng(array) { 
						
						array[0].forEach((coords) => {
				
							temp = coords[0];
							coords[0] = coords[1];
							coords[1] = temp;
							//console.log(coords)
				
							swappedArray.push(coords);
							});
						};
						swapLatLng(result.data);

						var mypolygon = L.polygon([
							swappedArray
						]).addTo(map);
					};

					//swapLatLng(result.data);
					//console.log(swappedArray);

					//let swappedCoords= swapLatLng(result.data);


					/*var mypolygon = L.polygon([
						swappedArray
					]).addTo(map);*/
			



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

	$('#contentBoxButton').click(function () {
		console.log("content box pressed");
		//let myDiv = $()
		$('#fakeDiv').append('<div id="contentBox">YOYYOOO</div>');
		$('#contentBox').css({

			"font-size": "40px",
			"position": "relative",
			"z-index": "2",
			"margin": "auto",
			"width": "30%",
			"border": "solid black 5px"

		}).html(
			"<h>" + countryCodeResult + "</h>" + "<br>" + 
			"<p>" + wikiLinksResult + "</p>" + "<br>" + 
			"<p>" + 
				"Capital: " + countryInfoResult.capital + "<br>" +
				"Spoken Languages: " + countryInfoResult.languages + "<br>" +
				"Continent: " + countryInfoResult.continentName + "<br>" +
				"Popluation: " + countryInfoResult.population + "<br>" +
				"Area in" + "<sup>SqKm</sup>" + ": " + countryInfoResult.areaInSqKm +
			"</p>");
	});










	let array = [[[[-3.404856459164713, -80.30256059438722],[-2.65751189535964, -79.77029334178093],[-2.220794366061014, -79.98655921092241]],[[-80.36878394236925,-2.685158786635788],[-80.96776546906436,-2.246942640800704],[-80.76480628123804,-1.965047702648533]]]];
	//let array = [1,2,3];
	console.log(array[0] + "first array");
	console.log(array[0].length + " array length");
	//let swappedArray = [];
	//let realArray = [];

	//let anotherArray = [1, 2, 3];
	//console.log(anotherArray);
	//console.log(anotherArray.length);

	/*function swapLatLng(array) {
		for(let i = 0; i < 2; i++){
			let swappedArray = [];
		array[0][i].forEach((coords) => {

			temp = coords[0];
			coords[0] = coords[1];
			coords[1] = temp;

			//[[[[0, 0],[0, 0]]]]

			swappedArray.push(coords);
		});
		realArray.push(swappedArray);
	  };
	};

	swapLatLng(array);
	console.log(realArray);
	console.log("here");*/

	
	
        /*map = L.map('map').setView([lat, lng], 13);
        L.tileLayer.provider('OpenStreetMap.Mapnik').addTo(map);
		
		var polygon = L.polygon([
			[-3.404856459164713, -80.30256059438722],[-2.65751189535964, -79.77029334178093],[-2.220794366061014, -79.98655921092241]
		]).addTo(map);*/

	
        console.log(lat)

		/*var mypolygon = L.polygon([
			[-82.96578304719736,8.225027980985985],[-83.50843726269431,8.446926581247283],[-83.71147396516908,8.656836249216866]
		]).addTo(map);*/
    

	


	/*let newOption = document.createElement("option");
	newOption.value = "GB";
	newOption.innerHTML = "Britain";
	document.getElementById("countries").appendChild(newOption);*/
	
        