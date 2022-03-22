    $('#butOne').click(function() {
        navigator.geolocation.getCurrentPosition((position) => {
            console.log(position);
        });
    });