    /*$('#butOne').click(function() {
        navigator.geolocation.getCurrentPosition((position) => {
            console.log(position);
        });
    });*/

    let lat = 0;
    let lng = 0;
    console.log(lat);

    let whereUR = navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        lat = position.coords.latitude; 
        lng = position.coords.longitude;
        console.log(lat, lng);

        let map = L.map('map').setView([lat, lng], 13);
        L.tileLayer.provider('OpenStreetMap.Mapnik').addTo(map);
    });

    console.log(lat);

    setTimeout(function(){
        console.log(lat)
    }, 1000);

        

  