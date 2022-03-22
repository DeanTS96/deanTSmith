    $('#butOne').click(function() {
        navigator.geolocation.getCurrentPosition((position) => {
            console.log(position);
        });
    });

    let map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer.provider('Stamen.Watercolor').addTo(map);