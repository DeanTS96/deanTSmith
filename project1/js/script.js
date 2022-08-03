	$(window).load(function() {
		$('.preloader').fadeOut('slow');
 	});
 
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
			//console.log(JSON.stringify(result));

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

				if (result.status.name == "ok") {

					let characters = result.data.split("");
					countryCode = characters[0]+characters[1];

					$('#countries').val(countryCode);
					$('#countries').trigger('change');

					
				}
			}
		});

	});
	
	

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
	
				if (result.status.name == "ok") {

					if(borderLayer) {
						map.removeLayer(borderLayer);
					};

					let myStyle = {
						"color": "#0077FF",
						"weight": 5,
						"opacity": 0.9
					};

					borderLayer = L.geoJSON(result.data, {style: myStyle}).addTo(map);		
					map.fitBounds(borderLayer.getBounds());

	
					
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

				if (result.status.name == "ok") {
					wikiLinksResult = result.data;
					$('#wikiLinks').html("<p>" + wikiLinksResult + "</p>");					
				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
	
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

				if (result.status.name == "ok") {	

					$("#carouselIndicators").empty();
					$("#carouselInner").empty();

					
					let gregorianDate = Date.parse("2021-02-14");

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

				if (result.status.name == "ok") {	

					$("#news1").attr("style", "display: block;");
					$("#news2").attr("style", "display: block;");
					$("#news3").attr("style", "display: block;");

					if(result.data.pagination.count < 3) {
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
			
							if (result.status.name == "ok") {
								
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
			
							if (result.status.name == "ok") {		
								exchangeRateResult = result.data;	
								$('#exchangeRate').html(result.data);											
							}
						
						},
						error: function(jqXHR, textStatus, errorThrown) {

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
						
										if (result.status.name == "ok") {

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
						}
					});
	
				}
	
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log("error");

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
