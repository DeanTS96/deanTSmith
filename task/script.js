/*alert("helloooooo");

const but = document.getElementById("butOne");
but.onclick = () => {
        but.style.color = "blue";
    };*/

    $('#butOne').click(function() {
		console.log("hi 1")

		$.ajax({
			url: "getWeather.php",
			type: 'GET',
			dataType: 'json',
			data: {
				icao: $('#inputOne').val()
			},
			success: function(result) {
				console.log("hi 2")

				console.log(JSON.stringify(result));

				if (result.status.name == "ok") {
					console.log("hi 3")

					$('#results').html("hi");
				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
		}); 
	
	});

