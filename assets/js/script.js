$('#sendEmail').on('submit', function(event) {
    event.preventDefault();
    const name = $('#name').val();
    const email = $('#email').val();
    const subject = $('#subject').val();
    const body = $('#message').val();
    const message = body + ('<br><p>From ' + name + ' at ' + email +'</p>');
    $("#loading").show();

    $.ajax({
        url: 'sendEmail.php',
        type: 'POST',
        data:{
            name: name,
            email: email,
            subject: subject,
            message: message
        },
        success: function(result) {
            $("#loading").hide();
            //alert('email recieved');
            $("#confirmationMessage").slideDown("slow").delay(5000).slideUp("slow");
            $('#sendEmail')[0].reset();
        },
        error: function(error) {
            $("#loading").hide();
            alert('Error sending email');
        }
    });
});