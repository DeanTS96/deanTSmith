/*alert("helloooooo");

const but = document.getElementById("butOne");
but.onclick = () => {
        but.style.color = "blue";
    };*/

    $('#butOne').click(function() {

		$.ajax({
			url: "getWeather.php",
			type: 'POST',
			dataType: 'json',
			data: {
				icao: $('#inputOne').val()
			},
			success: function(result) {

				console.log(JSON.stringify(result));

				if (result.status.name == "ok") {

					$('#results').html(result['data'][0]['clouds']);
				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
		}); 
	
	});

