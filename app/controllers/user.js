var configuration = require('../libs/configuration');
var url = require('url');
var postmark = require('postmark');
var pmConfig = require('../../gulp/revquire')({
  "apiKey": "POSTMARK_API_KEY",
  "apiToken": "POSTMARK_API_TOKEN",
  "inboundAddress": "POSTMARK_INBOUND_ADDRESS",
  "smtpServe": "POSTMARK_SMTP_SERVER"
}, __dirname + '/../../.credentials/postmark.json');

var client = new postmark.Client (pmConfig.apiKey);

module.exports = function (include) {

  var User = require("../models").User;
  return {
    users: {
      params: {

      },
      actions: {
        index: function (req, res) {
          res.send('list ' + include("datetime"));
        },
        show: function (req, res) {
          res.send('show');
        },
        create: function (req, res, next) {
          var components = url.parse(req.get('referer') || req.get('origin'));

          User.register({
            name: req.body.name,
            emailAddress: req.body.emailAddress
          }, req.body.password, function (err, user) {
            if (err) {
              return next(err);
            }
            var fullUrl = url.format({
              host: components.host,
              protocol: components.protocol,
              slashes: components.slashes,
              search: "activationKey=" + user.activationKey
            });
            res.send({
              "name": user.name
            });
          });
        },
        update: function (req, res) {
          res.send('update');
        },
        destroy: function (req, res) {
          res.send('destroy');
        }
      }
    }
  };
};