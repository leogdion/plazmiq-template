//var nodemailer = require('nodemailer');
var configuration = require('../configuration');
var _ = require('lodash');
var templates = require('./templates.js')(__dirname + '/../templates');
var postmark = require('postmark')(configuration.mail.postmark.api_key || process.env[configuration.mail.postmark.api_key_env]);

module.exports = {
  queue: function (template, data, callback) {
    templates(template, data, function (error, mailOptions) {
      if (error) {
        callback(error);
      } else {
        postmark.send(mailOptions, callback);
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