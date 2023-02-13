$('#sendEmail').on('submit', function(event) {
    event.preventDefault();
    const name = $('#name').val();
    const email = $('#email').val();
    const subject = $('#subject').val();
    const body = $('#message').val();
    const message = body + ('<br><p>From ' + name + ' at ' + email +'</p>');
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
            alert('email recieved');
            $('#sendEmail')[0].reset();
        },
        error: function(error) {
            alert('Error sending email');
        }
    });
});