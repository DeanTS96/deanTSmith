	let polyToRemove;
	let newPoly;
	let num = 1;
	let layerGroup;
	let camLayerGroup;
	let borderLayer;
	let capitalMarker;

	let homeLat = 0;
	let homeLng = 0;
	
	let currency;
	let currentCountry;
	let country;
	let countryWithoutSpaces;
	let capitalCity;

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
					console.log(result.data, "HERE");

					if(borderLayer) {
						map.removeLayer(borderLayer);
					};

					borderLayer = L.geoJSON(result.data).addTo(map);
					map.fitBounds(borderLayer.getBounds());

	
					/*if(result.data.length > 1) {
						let fullArray = [];
						
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
					};*/
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
			url: "php/getCovidStatistics.php",
			type: 'POST',
			dataType: 'json',
			data: {
				countryCode: countryCode
			},
			success: function(result) {
				console.log(JSON.stringify(result));

				if (result.status.name == "ok") {
					console.log(result.data, "Covid")				
				}

				$('#active').html(result.data.active.toLocaleString());
				$('#activePerM').html(result.data.activePerOneMillion.toLocaleString());
				$('#cases').html(result.data.cases.toLocaleString());
				$('#casesPerM').html(result.data.casesPerOneMillion.toLocaleString());
				$('#deaths').html(result.data.deaths.toLocaleString());
				$('#deathsPerM').html(result.data.deathsPerOneMillion.toLocaleString());
				$('#covidPopulation').html(result.data.population.toLocaleString());
				$('#recovered').html(result.data.recovered.toLocaleString());
				$('#tests').html(result.data.tests.toLocaleString());

			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
		});


		$.ajax({
			url: "php/getPublicHolidays.php",
			type: 'POST',
			dataType: 'json',
			data: {
				countryCode: countryCode
			},
			success: function(result) {
				console.log(JSON.stringify(result));

				if (result.status.name == "ok") {
					console.log(result.data.holidays[0].name, "PublicHolidays")	

					$("#carouselIndicators").empty();
					$("#carouselInner").empty();

					console.log(Date.parse("2021-02-14").toString("dS"));
					let gregorianDate = Date.parse("2021-02-14");
					console.log(new Date());
					console.log(gregorianDate.getMonth());
					//console.log(Date.parse("2021-02-14").toLongDateString());

					console.log("earthquake", Date.parse("2011-01-03").toString());

					let carouselCount = 0;
					const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

					result.data.holidays.forEach(holiday => {

						$("#carouselIndicators").append("<button></button>");
						$("#carouselIndicators").children().last().attr({
							"data-bs-target" : "#carouselExampleIndicators",
							"data-bs-slide-to" : carouselCount,
							"aria-label" : carouselCount + 1
						});

						carouselCount += 1;

						let carouselDate = Date.parse(holiday.date).toString("MM dS").split(" ");
						console.log("checkDate", carouselDate);
						let monthNumber = Number(carouselDate[0]);


						$("#carouselInner").append("<div><h1>" + holiday.name + "</h1><br><p>" + months[monthNumber-1] + ", " + holiday.weekday.date.name + "<sup>" 
							+ carouselDate[1] + "</sup>" + "</p></div>")
						$("#carouselInner").children().last().attr({
							"class" : "carousel-item"
						});
						
					});

					$("#carouselIndicators").children().first().attr({
						"class" : "active",
						"aria-current" : "true"
					});
					$("#carouselInner").children().first().attr({
						"class" : "carousel-item active",
						"id" : "carouselItem"
					});

				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
		});


		$.ajax({
			url: "php/getNews.php",
			type: 'POST',
			dataType: 'json',
			data: {
				countryCode: countryCode
			},
			success: function(result) {
				console.log(JSON.stringify(result));

				if (result.status.name == "ok") {
					console.log(result.data.data[0], "NEWS")	

					$("#news1").attr("style", "display: block;");
					$("#news2").attr("style", "display: block;");
					$("#news3").attr("style", "display: block;");

					if(result.data.pagination.count < 3) {
						console.log("wrong");
						$("#news3").attr("style", "display: none;");

						if(result.data.pagination.count < 2) {
							$("#news2").attr("style", "display: none;");
						}
						if(result.data.pagination.count < 1) {
							$("#news2").attr("style", "display: none;");
						}

					};

						$('#title1').html(result.data.data[0].title);
						$('#newsContent1').html(result.data.data[0].description);
						$('#author1').html(result.data.data[0].author);
						$('#source1').html(result.data.data[0].source);
						$('#news1pic').attr("src",result.data.data[0].image);
						$('#newsLink1').attr("href",result.data.data[0].url);
		
						$('#title2').html(result.data.data[1].title);
						$('#newsContent2').html(result.data.data[1].description);
						$('#author2').html(result.data.data[1].author);
						$('#source2').html(result.data.data[1].source);
						$('#news2pic').attr("src",result.data.data[1].image);
						$('#newsLink2').attr("href",result.data.data[1].url);
	
						$('#title3').html(result.data.data[2].title);
						$('#newsContent3').html(result.data.data[2].description);
						$('#author3').html(result.data.data[2].author);
						$('#source3').html(result.data.data[2].source);
						$('#news3pic').attr("src",result.data.data[2].image);
						$('#newsLink3').attr("href",result.data.data[2].url);

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

					capitalCity = result.data[0].capital;

					$.ajax({
						url: "php/getCapital.php",
						type: 'POST',
						dataType: 'json',
						data: {
							capital: result.data[0].capital
						},
						success: function(result) {
							console.log(JSON.stringify(result));
			
							if (result.status.name == "ok") {
								console.log(result.data, "capitallll")	
								
								var capitalExtraMarker = L.ExtraMarkers.icon({
									icon: 'fa-landmark-dome',
									markerColor: 'orange',
									shape: 'star',
									prefix: 'fa'
								  });
									
								  if(capitalMarker) {
									  map.removeLayer(capitalMarker);
								  };

								  capitalMarker = L.marker([result.data.latitude, result.data.longitude], {icon: capitalExtraMarker}).bindPopup('<p style="color:orange; font-size: 2em; font-weight: bold;">' + capitalCity + '</p>'  ).addTo(map);				 							

							}
						
						},
						error: function(jqXHR, textStatus, errorThrown) {
							// your error code
						}
					});

					countryInfoResult = result.data[0];
					currency = result.data[0].currencyCode;

					$('#capital').html(result.data[0].capital);
					$('#continent').html(result.data[0].continentName);
					$('#languages').html(result.data[0].languages);
					$('#population').html(result.data[0].population);
					$('#area').html(result.data[0].areaInSqKm);
					$('#currency').html(result.data[0].currencyCode);
					$('#fipsCode').html(result.data[0].fipsCode);
					$('#countryCode').html(result.data[0].countryCode);
	
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
							console.log("example", Date.parse("2011-01-03").toString());

							var myExtraMarker = L.ExtraMarkers.icon({
								icon: 'fa-house-crack',
								markerColor: 'green-dark',
								shape: 'circle',
								prefix: 'fa'
							  });
								
							  if(layerGroup) {
								  map.removeLayer(layerGroup);
							  };
		
							  layerGroup = L.layerGroup().addTo(map);

							result.data.forEach(function(earthquake) {	

								const earthMonths = ["January","February","March","April","May","June","July","August","September","October","November","December"];

								let dateTime = earthquake.datetime.split(" ");
								console.log("array", dateTime);	


								let earthquakeDate = Date.parse(dateTime[0]).toString("MM dS yyyy").split(" ");
								earthquakeDate[0] = earthMonths[Number(earthquakeDate[0])];
								earthquakeDate.join(" ");		
								
								  layerGroup.addLayer(L.marker([earthquake.lat,earthquake.lng], {icon: myExtraMarker}).bindPopup('<h5 <p style="color: green">Earthquake</h1>' + '<p style="color: green">' + earthquakeDate.join(" ") + " " + earthquake.datetime.split(" ")[1] + ". Magnitude " + '<span style="font-size: 2em;">' + earthquake.magnitude + "</span></p>" ));								  								  							 
							});							
						}
					});

					$.ajax({
						url:  "php/getWebcams.php",
						type: 'POST',
						dataType: 'json',
						data: {
							countryCode: countryCode
						},
						success: function(result) {	
							console.log(JSON.stringify(result));
							console.log("here", result.data.webcams);

							var myCamExtraMarker = L.ExtraMarkers.icon({
								icon: 'fa-video',
								markerColor: 'red',
								shape: 'square',
								prefix: 'fa'
							  });
								
							  if(camLayerGroup) {
								  map.removeLayer(camLayerGroup);
							  };
		
							  camLayerGroup = L.layerGroup().addTo(map);

							result.data.webcams.forEach(function(cam) {							  
								  camLayerGroup.addLayer(L.marker([cam.location.latitude,cam.location.longitude], {icon: myCamExtraMarker}).bindPopup('<iframe src="' + cam.player.day.embed + '"></iframe>'));								  								  							 
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
									//map.flyTo([result.data.lat, result.data.lng], 6);
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

											//console.log("thingyTime", Date.parse(result.data.daily[1].dt));
											console.log("beforeParse", new Date((JSON.parse(result.data.current.dt) - 3600 + result.data.timezone_offset)*1000));

											$('#todayTemp').html(Math.round(result.data.current.temp) + "<sup>o</sup>");
											$('#windSpeed').html(Math.round(result.data.current.wind_speed) + "<sup> mph</sup>");
											$('#weatherDescription').html(result.data.current.weather[0].description);


											$('#day1').html(new Date((result.data.daily[1].dt)*1000).toDateString().split(" ")[0]);
											$('#temp1').html(Math.round(result.data.daily[1].temp.day) + "<sup>o</sup>");

											$('#day2').html(new Date((result.data.daily[2].dt)*1000).toDateString().split(" ")[0]);
											$('#temp2').html(Math.round(result.data.daily[2].temp.day) + "<sup>o</sup>");

											$('#day3').html(new Date((result.data.daily[3].dt)*1000).toDateString().split(" ")[0]);
											$('#temp3').html(Math.round(result.data.daily[3].temp.day) + "<sup>o</sup>");

											$('#day4').html(new Date((result.data.daily[4].dt)*1000).toDateString().split(" ")[0]);
											$('#temp4').html(Math.round(result.data.daily[4].temp.day) + "<sup>o</sup>");

											$('#day5').html(new Date((result.data.daily[5].dt)*1000).toDateString().split(" ")[0]);
											$('#temp5').html(Math.round(result.data.daily[5].temp.day) + "<sup>o</sup>");

											$('#day6').html(new Date((result.data.daily[6].dt)*1000).toDateString().split(" ")[0]);
											$('#temp6').html(Math.round(result.data.daily[6].temp.day) + "<sup>o</sup>");
											

											/*let weatherDescription;
											let cloudy = 'cloudy';
											let scatteredClouds = 'some clouds';								
		
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
											} else if(result.data.daily[1].weather[0].description === "scattered clouds") {
												weatherDescription = scatteredClouds;
											} else {
												weatherDescription = result.data.daily[1].weather[0].description;
											}
											$('#day1Weather').html(weatherDescription);


											$('#day2Date').html(new Date((result.data.daily[2].dt)*1000).toDateString());
											$('#day2Temp').html(result.data.daily[2].temp.day);
											if(result.data.daily[2].weather[0].description === "overcast clouds") {
												weatherDescription = cloudy;
											} else if(result.data.daily[2].weather[0].description === "scattered clouds") {
												weatherDescription = scatteredClouds;
											} else {
												weatherDescription = result.data.daily[2].weather[0].description;
											}

											$('#day2Weather').html(weatherDescription);


											$('#day3Date').html(new Date((result.data.daily[3].dt)*1000).toDateString());
											$('#day3Temp').html(result.data.daily[3].temp.day);
											if(result.data.daily[3].weather[0].description === "overcast clouds") {
												weatherDescription = cloudy;
											} else if(result.data.daily[3].weather[0].description === "scattered clouds") {
												weatherDescription = scatteredClouds;
											} else {
												weatherDescription = result.data.daily[3].weather[0].description;
											}
											$('#day3Weather').html(weatherDescription);


											$('#day4Date').html(new Date((result.data.daily[4].dt)*1000).toDateString());
											$('#day4Temp').html(result.data.daily[4].temp.day);
											if(result.data.daily[4].weather[0].description === "overcast clouds") {
												weatherDescription = cloudy;
											} else if(result.data.daily[4].weather[0].description === "scattered clouds") {
												weatherDescription = scatteredClouds;
											} else {
												weatherDescription = result.data.daily[4].weather[0].description;
											}
											$('#day4Weather').html(weatherDescription);


											$('#day5Date').html(new Date((result.data.daily[5].dt)*1000).toDateString());
											$('#day5Temp').html(result.data.daily[5].temp.day);
											if(result.data.daily[5].weather[0].description === "overcast clouds") {
												weatherDescription = cloudy;
											} else if(result.data.daily[5].weather[0].description === "scattered clouds") {
												weatherDescription = scatteredClouds;
											} else {
												weatherDescription = result.data.daily[5].weather[0].description;
											}
											$('#day5Weather').html(weatherDescription);


											$('#day6Date').html(new Date((result.data.daily[6].dt)*1000).toDateString());
											$('#day6Temp').html(result.data.daily[6].temp.day);
											if(result.data.daily[6].weather[0].description === "overcast clouds") {
												weatherDescription = cloudy;
											} else if(result.data.daily[6].weather[0].description === "scattered clouds") {
												weatherDescription = scatteredClouds;
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

											console.log("mytester", finalDateTime);
											*/
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
	});

	

	

	let helloPopup = L.popup().setContent('Hello World!');

	let countryInfoButton = L.easyButton('fa-circle-info', function(btn, map){
		let tableId = document.getElementById("infoTable");
		if (tableId.style.display === "block") {
			tableId.style.display = "none";
		  } else {
			document.getElementById("weatherCard").style.display = "none";
			document.getElementById("covidTable").style.display = "none";
			document.getElementById("newsBox").style.display = "none";
			document.getElementById("publicHolidayCarousel").style.display = "none";
			tableId.style.display = "block";
		  }
	}).addTo(map);
	countryInfoButton.button.style = 'color:blue; font-size:2em; height:45px; width:45px; line-height:45px;';


	let weatherButton = L.easyButton('fa-cloud-sun', function(btn, map){
		let weatherId = document.getElementById("weatherCard");
		if (weatherId.style.display === "block") {
			weatherId.style.display = "none";
		  } else {
			document.getElementById("infoTable").style.display = "none";
			document.getElementById("newsBox").style.display = "none";
			document.getElementById("publicHolidayCarousel").style.display = "none";
			document.getElementById("covidTable").style.display = "none";
			weatherId.style.display = "block";
		  }
	}).addTo(map);
	weatherButton.button.style = 'color:gray; font-size:2em; height:45px; width:45px; line-height:45px;';


	let covidButton = L.easyButton('fa-virus-covid', function(btn, map){
		let tableId = document.getElementById("covidTable");
		if (tableId.style.display === "block") {
			tableId.style.display = "none";
		  } else {
			document.getElementById("weatherCard").style.display = "none";
			document.getElementById("infoTable").style.display = "none";
			document.getElementById("newsBox").style.display = "none";
			document.getElementById("publicHolidayCarousel").style.display = "none";
			tableId.style.display = "block";
		  }
	}).addTo(map);
	covidButton.button.style = 'color:green; font-size:2em; height:45px; width:45px; line-height:45px;';


	let holidayButton = L.easyButton('fa-plane-departure', function(btn, map){
		let carouselId = document.getElementById("publicHolidayCarousel");
		if (carouselId.style.display === "block") {
			carouselId.style.display = "none";
		  } else {
			document.getElementById("weatherCard").style.display = "none";
			document.getElementById("infoTable").style.display = "none";
			document.getElementById("covidTable").style.display = "none";
			document.getElementById("newsBox").style.display = "none";
			carouselId.style.display = "block";
		  }
	}).addTo(map);
	holidayButton.button.style = 'color:orange; font-size:2em; height:45px; width:45px; line-height:45px;';


	let newsButton = L.easyButton('fa-newspaper', function(btn, map){
		let newsId = document.getElementById("newsBox");
		if (newsId.style.display === "block") {
			newsId.style.display = "none";
		  } else {
			document.getElementById("weatherCard").style.display = "none";
			document.getElementById("infoTable").style.display = "none";
			document.getElementById("covidTable").style.display = "none";
			document.getElementById("publicHolidayCarousel").style.display = "none";
			newsId.style.display = "block";
		  }
	}).addTo(map);
	newsButton.button.style = 'color:red; font-size:2em; height:45px; width:45px; line-height:45px;';



	console.log("time", Date.today());
