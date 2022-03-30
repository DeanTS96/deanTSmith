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

				console.log("hi");

				result.data.forEach(
					function(countryObject) {
						$('#countries').append($("<option>").val(countryObject.iso).text(countryObject.country));
					
				});	
			};
		}
	});


    navigator.geolocation.getCurrentPosition((position) => {
        lat = position.coords.latitude; 
        lng = position.coords.longitude;

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
					console.log(result.data);

					let characters = result.data.split("");
					countryCode = characters[0]+characters[1];
					console.log(countryCode);

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
		console.log(countryWithoutSpaces);
	
	
		let splitCountry = currentCountry.split(' ');
	
		if(splitCountry.length > 1) {
			countryWithoutSpaces = splitCountry[0];
			for(let i = 1; i < splitCountry.length; i++) {
				countryWithoutSpaces += "%20" + splitCountry[i];
			};
		};

		console.log(countryWithoutSpaces);


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
							console.log(array.length + " in function length");
							for(let i = 0; i < array.length; i++) {
								let swappedArray = [];
								console.log(array[i]);
	
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
				
							swappedArray.push(coords);
							});
						};
						swapLatLng(result.data);
	
						var mypolygon = L.polygon([
							swappedArray
						]).addTo(map);
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
			success: function(result) {console.log("herrrrrrrr");
				console.log(JSON.stringify(result));
				console.log("herrrrrrrr");
	
				if (result.status.name == "ok") {
					console.log(countryWithoutSpaces);
					wikiLinksResult = result.data;
					console.log(wikiLinksResult);
					console.log("herrrrrrr");

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

								//$('#countryInfo').html("<p id=yoyo>" + "yoyo" + "</p>");	
											

							}
						
						},
						error: function(jqXHR, textStatus, errorThrown) {
							// your error code
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
		
											currentTemp = result.data.current.temp;
											tomorrowTemp = result.data.current.temp;

											let date = JSON.parse(result.data.current.dt);

											console.log(new Date((JSON.parse(result.data.current.dt) + result.data.timezone_offset)*1000));
											
											let myDate = new Date((JSON.parse(result.data.current.dt) + result.data.timezone_offset)*1000);
											//let myDate = new Date(date*1000);
											//let dateArray = myDate.split(" ");
											console.log(myDate);
											let stringDate = myDate.toString();
											let arrayDate = stringDate.split(" ");
											let finalDate = arrayDate[0] + " " + arrayDate[1] + " " + arrayDate[2] + " " + arrayDate[3] + " " + arrayDate[4] + " " + arrayDate[5];
											console.log(arrayDate);
											console.log(finalDate);
											console.log("HERE" ,new Date((1648666512+7200)*1000));
											
											let total = 0;

											let addOrSub;

											let gmtSplit= arrayDate[5].split('');
											console.log(gmtSplit);
											console.log("HERE",gmtSplit);
											console.log(Number(gmtSplit[4]));
											let gmt1 = Number(gmtSplit[4]);
											let gmt2 = Number(gmtSplit[5]);
											let gmt3 = Number(gmtSplit[6]);
											let gmt4 = Number(gmtSplit[7]);

												total = gmt1 * 10
												console.log("YOYO", total);

											if(gmt2 > 0) {
												total += gmt2;
												console.log("YOYO", total);

											}

											if(gmt3 > 0) {
												console.log("YOYO", total);

												total += gmt3 * 0.1;
												console.log("YOYO", total);

											}

											if(gmt4 > 0) {
												total += gmt4 * 0.01;
												console.log("YOYO", total);

											}

											console.log(arrayDate[4].split(':'));
											let arrayOfNum = arrayDate[4].split(':');
											let arrayNum = (Number(arrayOfNum[0])) + (Number(arrayOfNum[1])*0.01);

											let finalNum = 0;

											
											
											
											if(gmtSplit[3] === "+") {
												finalNum = arrayNum - total;
												console.log("POSATIVE");
											} else {
												finalNum = letFinalNum = arrayNum + total;;
											}

											console.log(finalNum, "here");

											let splitFinal = finalNum.toString().split('.');
											
											console.log(splitFinal);
										

											if(splitFinal[1].length < 2) {
												console.log(splitFinal[1].length);
												splitFinal[1] = splitFinal[1] + "0";
												console.log(splitFinal[1]);
											}
											console.log(splitFinal[1]);

											let resultTime = splitFinal[0] + ":" + splitFinal[1] + ":" + arrayOfNum[2];
											console.log(resultTime);

											let finalDateTime = arrayDate[0] + " " + arrayDate[1] + " " + arrayDate[2] + " " + arrayDate[3] + " " + resultTime;




											

											

											$('#weatherToday').html('<p>' + finalDateTime + '</p>');
		
											/*$('#fakeDiv').append('<div id="contentBox"></div>');
				$('#contentBox').css({
		
					"font-size": "1.4em",
					"position": "absolute",
					"z-index": "2",
					"margin": "auto",
					"width": "50%",
					"border": "solid black 2px",
					"top": "0",
					"bottom":"0",
					"left": "0",
					"right": "0",
					"overflow":"scroll",
					"height": "500px"
		
				}).html( 
					"<p>" + "Wiki segment: " + wikiLinksResult + "</p>" + "<br>" + 
					"<br>" +
					"<p>" + "Temperature: " + result.data.current.temp + "<br>" +
					"Temperature for Tomorrow: " + result.data.daily[0].temp.day + "<br>" +
					"<p>" + 
						"Capital: " + countryInfoResult.capital + "<br>" +
						"Spoken Languages: " + countryInfoResult.languages + "<br>" +
						"Continent: " + countryInfoResult.continentName + "<br>" +
						"Popluation: " + countryInfoResult.population + "<br>" +
						"Area in" + "<sup>SqKm</sup>" + ": " + countryInfoResult.areaInSqKm + "<br>" +
						"Current exchange rate to USD: " + exchangeRateResult +
					"</p>");*/
						
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
				// your error code
			}
		}); 
	
	});
