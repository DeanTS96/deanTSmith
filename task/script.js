/*alert("helloooooo");

const but = document.getElementById("butOne");
but.onclick = () => {
        but.style.color = "blue";
    };*/

    $('#butOne').click(function() {
		console.log("hi 1")

		$.ajax({
			url: "../../geonamesExample/libs/php/getCountryInfo.php",
			type: 'POST',
			dataType: 'json',
			data: {
				icao: $('#inputOne').val(),
				lang: "en",
				country: "GB"

			},
			success: function(result) {
				console.log("hi 2")

				console.log(JSON.stringify(result));

				if (result.status.name == "ok") {
					console.log("hi 3")

					//$('#results').html("hi");
					$('#results').html(result['data']['clouds']);
				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
				console.log("error");
			}
		}); 
	
	});

