var templates = require('./templates.js')(__dirname + '/../../static/emails');

var postmark = require('postmark');
var pmConfig = require('../../gulp/revquire')({
  "apiKey": "POSTMARK_API_KEY",
  "apiToken": "POSTMARK_API_TOKEN",
  "inboundAddress": "POSTMARK_INBOUND_ADDRESS",
  "smtpServe": "POSTMARK_SMTP_SERVER"
}, __dirname + '/../../.credentials/postmark.json');

var client = new postmark.Client(pmConfig.apiKey);
module.exports = {
  queue: function (template, data, callback) {
    templates(template, data, function (error, mailOptions) {
      if (error) {
        callback(error);
      } else {
        client.send(mailOptions, callback);
      }

/*
      var smtpTransport = nodemailer.createTransport("SMTP", {
        service: "Gmail",
        auth: {
          user: "monit@brightdigit.com",
          pass: "monit5ervices"
        }
      });

      // send mail with defined transport object
      smtpTransport.sendMail(mailOptions, callback);
      */
    });

  }
};