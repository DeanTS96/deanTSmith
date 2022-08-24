console.log("Hello");

$.ajax({
        url: "php/getAll.php",
        type: "POST",
        dataType: "json",

        success: function(result) {
            console.log(result);
            console.log(JSON.stringify(result));
        },
        error: function(errorThrown) {
            console.log("errorPHP");
        }
    });