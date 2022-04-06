	let polyToRemove;
	let newPoly;
	let num = 1;
	let layerGroup;

	let homeLat = 0;
	let homeLng = 0;
	
	let currency;
	let currentCountry;
	let country;
	let countryWithoutSpaces;

	let countryInfoResult;
	let wikiLinksResult;
	let polygonCoords;

	let exchangeRateResult;

    let lat = 0;
    let lng = 0;
	let map;
    let countryCode;
	let datapolygon;

	let currentTemp;
	let tomorrowTemp;	

	// ON PAGE LOAD
  

	map = L.map('map').setView([lat, lng], 3);
	L.tileLayer.provider('OpenStreetMap.Mapnik').addTo(map);


	$.ajax({
		url: "php/TEMPgetcountryBorders.geo.json copy.php",
		type: 'POST',
		dataType: 'json',
		data: {
			isoCode: countryCode
		},
		success: function(result) {
			console.log(JSON.stringify(result));

			if (result.status.name == "ok") {
				let pushingNewArray = []; 
				
				result.data.forEach(function(newCountryObject) {
					pushingNewArray.push(newCountryObject.country);
				});

				pushingNewArray.sort();
				let theFinalSortedArray = [];

				let arrayToObject = pushingNewArray.forEach(function(arrayCountry) {
					result.data.forEach(function(countryObject) {
						if(arrayCountry === countryObject.country){
							theFinalSortedArray.push(countryObject);
							return;
						}
					})
				});

				theFinalSortedArray.forEach(
					function(countryObject) {
						$('#countries').append($("<option>").val(countryObject.iso).text(countryObject.country));
					
				});	
			};
		}
	});


    navigator.geolocation.getCurrentPosition((position) => {
        lat = position.coords.latitude; 
		homeLat = position.coords.latitude;
		lng = position.coords.longitude; 
        homeLng = position.coords.longitude;

		map.setZoomAround([lat, lng],11);

		$.ajax({
			url: "php/getCountryCode.php",
			type: 'POST',
			dataType: 'json',
			data: {
                lat: lat,
                lng: lng
			},
			success: function(result) {
				console.log(JSON.stringify(result));

				if (result.status.name == "ok") {

					let characters = result.data.split("");
					countryCode = characters[0]+characters[1];

					$('#countries').val(countryCode);
					$('#countries').trigger('change');

					//TRIGGER ON CHANGE
				}
			}
		});

	});



	//TRIGGERED BY ON CHANGE

	
	
	
	

	$('#countries').change(function(){


		countryCode = $('#countries').val();
		currentCountry = $("select option:selected").html();
		countryWithoutSpaces = currentCountry;
	
	
		let splitCountry = currentCountry.split(' ');
	
		if(splitCountry.length > 1) {
			countryWithoutSpaces = splitCountry[0];
			for(let i = 1; i < splitCountry.length; i++) {
				countryWithoutSpaces += "%20" + splitCountry[i];
			};
		};


		$.ajax({
			url: "php/getCoordinates.php",
			type: 'POST',
			dataType: 'json',
			data: {
				country: $("select option:selected").html(),
				countryCode: countryCode
			},
			success: function(result) {
				console.log(JSON.stringify(result));
	
				if (result.status.name == "ok") {
		
	
					if(result.data.length > 1) {
						let fullArray = [];
						let madeUpArray = [1, 2, 3];
						
						function swapLatLng(array) { 
							for(let i = 0; i < array.length; i++) {
								let swappedArray = [];	
								array[i].forEach((coords) => {	
	
										coords.forEach((setOfTwo) => {
											temp = setOfTwo[0];
											setOfTwo[0] = setOfTwo[1];
											setOfTwo[1] = temp;
										});
							
										swappedArray.push(coords);
								});
						
								fullArray.push(swappedArray);
							}
							
						};						
	
						swapLatLng(result.data);

						if(newPoly) {
							newPoly.remove();
						};

						newPoly = L.polygon([
							fullArray
						]);
	
						var mypolygon = newPoly.addTo(map);

						//polyToremove = mypolygon;
	
					} else {
	
						let swappedArray = [];
	
					function swapLatLng(array) { 
						
						array[0].forEach((coords) => {
				
							temp = coords[0];
							coords[0] = coords[1];
							coords[1] = temp;
				
							swappedArray.push(coords);
							});
						};
						swapLatLng(result.data);

						if(newPoly) {
							newPoly.remove();
						};


						newPoly = L.polygon([
							swappedArray
						]);
						var mypolygon = newPoly.addTo(map);
					};
				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
		});


		$.ajax({
			url: "php/getWikiLinks.php",
			type: 'POST',
			dataType: 'json',
			data: {
				country: countryWithoutSpaces
			},
			success: function(result) {
				console.log(JSON.stringify(result));

				if (result.status.name == "ok") {
					wikiLinksResult = result.data;
					$('#wikiLinks').html("<p>" + wikiLinksResult + "</p>");					
				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
		});
	
		
	
		$.ajax({
			url: "php/getCountryInfo.php",
			type: 'POST',
			dataType: 'json',
			data: {
				country: $('#countries').val(),
				lang: 'en'
			},
			success: function(result) {
				console.log(JSON.stringify(result));
	
				if (result.status.name == "ok") {

					countryInfoResult = result.data[0];
					currency = result.data[0].currencyCode;

					$('#capital').html(result.data[0].capital);
					$('#continent').html(result.data[0].continentName);
					$('#languages').html(result.data[0].languages);
					$('#population').html(result.data[0].population);
					$('#area').html(result.data[0].areaInSqKm);
					$('#currency').html(result.data[0].currencyCode);
	
					$.ajax({
						url: "php/getExchangeRates.php",
						type: 'POST',
						dataType: 'json',
						data: {
							currency: currency
						},
						success: function(result) {
							console.log(JSON.stringify(result));
			
							if (result.status.name == "ok") {		
								exchangeRateResult = result.data;	
								$('#exchangeRate').html(result.data);											
							}
						
						},
						error: function(jqXHR, textStatus, errorThrown) {
							// your error code
						}
					}); 

					$.ajax({
						url:  "php/getEarthquakes.php",
						type: 'POST',
						dataType: 'json',
						data: {
							north: countryInfoResult.north,
							south: countryInfoResult.south,
							east: countryInfoResult.east,
							west: countryInfoResult.west
						},
						success: function(result) {	
							console.log(JSON.stringify(result));
								
							  if(layerGroup) {
								  map.removeLayer(layerGroup);
							  };

							  layerGroup = L.layerGroup().addTo(map);

							  let redMarker = L.AwesomeMarkers.icon({
								icon: 'activity',
								prefix: 'bi',
								markerColor: 'green',
								iconColor: 'white'
							  }); 

							result.data.forEach(function(earthquake) {							  
								  layerGroup.addLayer(L.marker([earthquake.lat,earthquake.lng], {icon: redMarker}).bindPopup("<h5>Earthquake</h1>" + "<br>" + "Date & time: " + earthquake.datetime + ". Magnitude: " + earthquake.magnitude + "."));								  								  							 
							});							
						}
					});

					$.ajax({
						url:  "php/latLng.php",
						type: 'POST',
						dataType: 'json',
						data: {
							north: countryInfoResult.north,
							south: countryInfoResult.south,
							east: countryInfoResult.east,
							west: countryInfoResult.west
						},
						success: function(result) {	
							console.log(JSON.stringify(result));
		
							if (result.status.name == "ok") {	
								
								if(homeLat === lat && homeLng === lng){
									console.log("Does")
								} else {
									console.log("Doesn't")
									map.flyTo([result.data.lat, result.data.lng], 6);
								};
		
								lat = result.data.lat;
								lng = result.data.lng;
		
								$.ajax({
									url:  "php/getForcastInfo.php",
									type: 'POST',
									dataType: 'json',
									data: {
										lat: lat,
										lng: lng
									},
									success: function(result) {
						
										console.log(JSON.stringify(result));
						
										if (result.status.name == "ok") {

											let weatherDescription;
											let cloudy = 'cloudy';											
		
											$('#tempNum').html("<p>" + result.data.current.temp + "<sup>" + "o" + "</sup>" + "</p>");
											$('#wind').html(result.data.current.wind_speed + "<sup>" + "mps" + "</sup>" + " " +  + result.data.current.wind_deg + "<sup>" + "o" + "</sup>");
											$('#clouds').html(result.data.current.weather[0].description);
											$('#morning').html("<p>" + result.data.daily[0].temp.morn + "<sup>" + "o" + "</sup>" +  "</p>" + "<p>" + "Morning" + "</p>");
											$('#noon').html("<p>" + result.data.daily[0].temp.day + "<sup>" + "o" + "</sup>" +  "</p>" + "<p>" + "Noon" + "</p>");
											$('#evening').html("<p>" + result.data.daily[0].temp.eve + "<sup>" + "o" + "</sup>" +  "</p>" + "<p>" + "Evening" + "</p>");
											$('#night').html("<p>" + result.data.daily[0].temp.night + "<sup>" + "o" + "</sup>" +  "</p>" + "<p>" + "Night" + "</p>");

											$('#day1Date').html(new Date((result.data.daily[1].dt)*1000).toDateString());
											$('#day1Temp').html(result.data.daily[1].temp.day);
											if(result.data.daily[1].weather[0].description === "overcast clouds") {
												weatherDescription = cloudy;
											} else {
												weatherDescription = result.data.daily[1].weather[0].description;
											}
											$('#day1Weather').html(weatherDescription);


											$('#day2Date').html(new Date((result.data.daily[2].dt)*1000).toDateString());
											$('#day2Temp').html(result.data.daily[2].temp.day);
											if(result.data.daily[2].weather[0].description === "overcast clouds") {
												weatherDescription = cloudy;
											} else {
												weatherDescription = result.data.daily[2].weather[0].description;
											}
											$('#day2Weather').html(weatherDescription);


											$('#day3Date').html(new Date((result.data.daily[3].dt)*1000).toDateString());
											$('#day3Temp').html(result.data.daily[3].temp.day);
											if(result.data.daily[3].weather[0].description === "overcast clouds") {
												weatherDescription = cloudy;
											} else {
												weatherDescription = result.data.daily[3].weather[0].description;
											}
											$('#day3Weather').html(weatherDescription);


											$('#day4Date').html(new Date((result.data.daily[4].dt)*1000).toDateString());
											$('#day4Temp').html(result.data.daily[4].temp.day);
											if(result.data.daily[4].weather[0].description === "overcast clouds") {
												weatherDescription = cloudy;
											} else {
												weatherDescription = result.data.daily[4].weather[0].description;
											}
											$('#day4Weather').html(weatherDescription);


											$('#day5Date').html(new Date((result.data.daily[5].dt)*1000).toDateString());
											$('#day5Temp').html(result.data.daily[5].temp.day);
											if(result.data.daily[5].weather[0].description === "overcast clouds") {
												weatherDescription = cloudy;
											} else {
												weatherDescription = result.data.daily[5].weather[0].description;
											}
											$('#day5Weather').html(weatherDescription);


											$('#day6Date').html(new Date((result.data.daily[6].dt)*1000).toDateString());
											$('#day6Temp').html(result.data.daily[6].temp.day);
											if(result.data.daily[6].weather[0].description === "overcast clouds") {
												weatherDescription = cloudy;
											} else {
												weatherDescription = result.data.daily[6].weather[0].description;
											}
											$('#day6Weather').html(weatherDescription);
											




											let date = JSON.parse(result.data.current.dt);


											
											let myDate = new Date((JSON.parse(result.data.current.dt) + result.data.timezone_offset)*1000);
											//let myDate = new Date(date*1000);
											//let dateArray = myDate.split(" ");

											let stringDate = myDate.toString();
											let arrayDate = stringDate.split(" ");
											let finalDate = arrayDate[0] + " " + arrayDate[1] + " " + arrayDate[2] + " " + arrayDate[3] + " " + arrayDate[4] + " " + arrayDate[5];
											
											let total = 0;

											let addOrSub;

											let gmtSplit= arrayDate[5].split('');

											let gmt1 = Number(gmtSplit[4]);
											let gmt2 = Number(gmtSplit[5]);
											let gmt3 = Number(gmtSplit[6]);
											let gmt4 = Number(gmtSplit[7]);

												total = gmt1 * 10

											if(gmt2 > 0) {
												total += gmt2;
											}

											if(gmt3 > 0) {
												total += gmt3 * 0.1;	
											}

											if(gmt4 > 0) {
												total += gmt4 * 0.01;
											}

											let arrayOfNum = arrayDate[4].split(':');
											let arrayNum = (Number(arrayOfNum[0])) + (Number(arrayOfNum[1])*0.01);

											let finalNum = 0;

											
											
											
											if(gmtSplit[3] === "+") {
												if(arrayNum < 1) {
													finalNum = arrayNum;
												} else {
													finalNum = arrayNum - total;
												};
											} else {
												finalNum = arrayNum + total;;
											}

											let splitFinal = finalNum.toString().split('.');																		

											if(splitFinal[1] == 0 || splitFinal[1].length < 2) {
												splitFinal[1] = splitFinal[1] + "0";
											}

											if(splitFinal[0].length < 2) {
												splitFinal[0] = splitFinal[0] + "0";
											}

											if(splitFinal[1].length > 2) {
												let lastSplit = splitFinal[1].split('');
												splitFinal[1] = lastSplit[0] + lastSplit[1];
											}


											let resultTime = splitFinal[0] + ":" + splitFinal[1] + ":" + arrayOfNum[2];
											let finalDateTime = arrayDate[0] + " " + arrayDate[1] + " " + arrayDate[2] + " " + arrayDate[3] + " " + resultTime;
											
											$('#dateTime').html('<p>' + finalDateTime + '</p>');
										}
									
									},
									error: function(jqXHR, textStatus, errorThrown) {
										console.log("error");
										//$("#results").html("Invalid location");
									}
								});
							}
						
						},
						error: function(jqXHR, textStatus, errorThrown) {
							console.log("error");
						}
					});
	
				}
	
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log("error");
				// your error code
			}
		}); 

		$("#contentBox").show();
	
	});

	$("#h5Button").click(function() { 
		$("#contentBox").hide();
		$("#button").show();
	});

	$("#button").click(function() { 
		$("#contentBox").show();
	});
