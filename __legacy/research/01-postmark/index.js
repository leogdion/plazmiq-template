var postmark = require('postmark')("POSTMARK_API_TEST");

postmark.send({
        "From": "phragm@brightdigit.com", 
        "To": "test@brightdigit.com", 
        "Subject": "Test", 
        "TextBody": "Test Message"
    }, function(error, success) {
        if(error) {
            console.error("Unable to send via postmark: " + error.message);
            return;
        }
        console.info("Sent to postmark for delivery")
    });