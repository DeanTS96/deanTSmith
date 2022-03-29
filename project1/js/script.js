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
				$('#paragraph').html(result.data)

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
		
											$('#fakeDiv').append('<div id="contentBox"></div>');
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
					"</p>");
						
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
























	
	/*$.ajax({
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

					$.ajax({
						url: "php/getcountryBorders.geo.json.php",
						type: 'POST',
						dataType: 'json',
						data: {
							isoCode: countryCode
						},
						success: function(result) {
							console.log(JSON.stringify(result));
			
							if (result.status.name == "ok") {
								$('#paragraph').html(result.data);
	

								result.data[0].returningArray.forEach(
									function(countryObject) {
										$('#countries').append($("<option>").val(countryObject.iso).text(countryObject.country));
									
								});

								currentCountry = result.data[0].currentCountry;

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
										country: currentCountry,
										//country: $("select option:selected").html(),
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

											$.ajax({
												url: "php/getCountryInfo.php",
												type: 'POST',
												dataType: 'json',
												data: {
													country: countryCode,
													lang: 'en'
												},
												success: function(result) {
													console.log(JSON.stringify(result));
										
													if (result.status.name == "ok") {
														countryInfoResult = result.data[0];
														currency = result.data[0].currencyCode;

														$.ajax({
															url: "php/getWikiLinks.php",
															type: 'POST',
															dataType: 'json',
															data: {
																country: countryWithoutSpaces
																//country: $("select option:selected").html()
															},
															success: function(result) {
																console.log(JSON.stringify(result));
													
																if (result.status.name == "ok") {
																	wikiLinksResult = result.data;

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

																							$('#fakeDiv').append('<div id="contentBox"></div>');
		$('#contentBox').css({

			"font-size": "1.4em",
			"position": "absolute",
			"z-index": "2",
			"margin": "auto",
			"width": "50%",
			"height": "50%",
			"border": "solid black 2px",
			"top": "0",
			"bottom":"0",
			"left": "0",
			"right": "0",
			"overflow":"scroll",

			

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
			"</p>");
			 
																			
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
													
																}
															
															},
															error: function(jqXHR, textStatus, errorThrown) {
																// your error code
															}
														}); 
													}
												
												},
												error: function(jqXHR, textStatus, errorThrown) {
													// your error code
												}
											}); 
							
										}
									
									},
									error: function(jqXHR, textStatus, errorThrown) {
										// your error code
									}
								});


							}
						
						},
						error: function(jqXHR, textStatus, errorThrown) {
							// your error code
						}
					}); 	
					

				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
		}); */

	




	
	
// ON COUNTRY SELECTED

/*$('#countries').change(function(){


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
						}
					
					},
					error: function(jqXHR, textStatus, errorThrown) {
						// your error code
					}
				});

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
						}
					
					},
					error: function(jqXHR, textStatus, errorThrown) {
						// your error code
					}
				}); 

			}

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

									$('#fakeDiv').append('<div id="contentBox"></div>');
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
			"</p>");
				
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

		
		},
		error: function(jqXHR, textStatus, errorThrown) {
			// your error code
		}
	}); 


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

});*/
