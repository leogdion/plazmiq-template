Object.byString = function(o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    if (o) {
      for (var i = 0, n = a.length; i < n; ++i) {
          var k = a[i];
          if (k in o) {
              o = o[k];
          } else {
              return;
          }
      }
    }
    return o;
};

var fs = require('fs-extra');
var unirest = require('unirest');
var async = require('async');
var glob = require('glob');
var path = require('path');
var package = require("./package.json");
var beginkit_package = package.beginkit;

var domain_suffix = "api.mailchimp.com";
var base_path = "3.0";
var beginkit_creds;
try {
  beginkit_creds = require('../../.credentials/beginkit.json');
} catch (e) {
}


var mc_api_key = Object.byString(beginkit_creds,"services.MailChimp.ApiKey");

var dc = mc_api_key && mc_api_key.split  && mc_api_key.split('-')[1];

var base_url = dc ? ["https://", dc, ".", domain_suffix, "/", base_path , "/"].join("") : undefined;

var state = require('crypto').randomBytes(64).toString('hex');

var campaign_folder_id = Object.byString(beginkit_package,"services.MailChimp.folders.campaign");
var template_folder_id = Object.byString(beginkit_package,"services.MailChimp.folders.template");
var campaign_statuses = Object.byString(beginkit_package,"services.MailChimp.campaigns.overwrite.status") || [];

//var templatesPath = "../../beginkit/MailChimp/templates.json";

//fs.ensureFileSync(templatesPath);
  //var templates =  fs.readJsonSync(templatesPath, {throws: false}) || {};

async.parallel([
  function (cb) {
    unirest.get(base_url + "/campaigns")
    .auth(state, mc_api_key)
    .header('content-type', 'application/json')
    .send({})
    .end(function (response) {
      /*
       if (response.body.error) {
         console.log(response.body.error_description);
       } else {
         templates[response.body.id] = response.body;
       }
       cb(response.body.error);
       */
       var campaigns = response.body.campaigns.filter( function (_) {
        
          return _.settings.folder_id == campaign_folder_id
       }).reduce(function (memo, _) {
        //var template = templates[_.settings.template_id];
        //if (template) {
          memo[_.settings.template_id] = _.status;  
        //}

        
        return memo
       }, {});
       cb(null,campaigns);
     });
  },
  function (cb) {
    unirest.get(base_url + "/templates")
    .auth(state, mc_api_key)
    .header('content-type', 'application/json')
    .send({})
    .end(function (response) {
      /*
       if (response.body.error) {
         console.log(response.body.error_description);
       } else {
         templates[response.body.id] = response.body;
       }
       cb(response.body.error);
       */
       var templates = response.body.templates.filter( function (_) {
        
          return _.folder_id == template_folder_id
       }).map(function (_) {
        return {name : _.name,  id : _.id}
       }, {});
       cb(null, templates);
     });
  }
], function (error, results) {
  var templates = results[1].reduce(function (memo, _) {
    var status = results[0][_.id];
    if (!status || campaign_statuses.indexOf(status) > -1) {
      memo[_.name] = _.id;  
    } else if (status) {
      memo[_.name] = null;
    }
    
    return memo;
  }, {});
  glob('newsletters/**/index.html', function (er, files) {
    async.each(files, 
      function (file, cb) {
        var template_name = path.basename(path.dirname(file));
        var template_id = templates[template_name];
        if (template_id === null) {
          console.log("skipping ", template_name);
          cb();
        } else {
          fs.readFile(file, function(err, data) {
            var htmltext = new Buffer(data).toString();
            if (template_id) {
         // console.log("overwrite ", template_name);
          
              unirest.patch(base_url + "/templates/" + template_id)
              .auth(state, mc_api_key)
              .header('content-type', 'application/json')
              .send({"name": template_name, "folder_id" : template_folder_id, "html": htmltext})
              .end(function (response) {
                if (response.body.error) {
                  console.log(response.body.error_description);
                } else {

          console.log("overwrite ", template_name);
                }
                cb(response.body.error);
              });
              
            } else {
          //console.log("creating ", template_name);
              
              unirest.post(base_url + "/templates")
              .auth(state, mc_api_key)
              .header('content-type', 'application/json')
              .send({"name": template_name, "folder_id" : template_folder_id, "html": htmltext})
              .end(function (response) {
                if (response.body.error) {
                  console.log(response.body.error_description);
                } else {
                  
          console.log("creating ", template_name);
                }
                cb(response.body.error);
              });
              
            }
          });
        }
      },
      function (error) {
        if (error) {
          console.log(error);
        }
        process.exit(error ? 1 : 0);
      }
    );
  });
//     // read all files in newsletters folder
//     async.each(files, 
//       function (file, cb) {
//         var template_name = path.basename(path.dirname(file));
//         if (templates[template_name]) {
//           cb();
//           return;
//         }

//         });
//       },
//       function (error) {
//         fs.writeJson(templatesPath, templates, {spaces : 2}, function (err){
//           done(err || error);
//         });
//       }
//     );
//   // If the `nonull` option is set, and nothing
//   // was found, then files is ["**/*.js"]
//   // er is an error object or null.

//   });
// })(function (error) {
//   console.log(error);
//   process.exit(error ? 1 : 0);
// });
});

//    (function (done) {
//   var template_folder_id = Object.byString(beginkit_package,"services.MailChimp.folders.template");

// // read folder from settings
//   glob('newsletters/**/index.html', function (er, files) {
//     // read all files in newsletters folder
//     async.each(files, 
//       function (file, cb) {
//         var template_name = path.basename(path.dirname(file));
//         if (templates[template_name]) {
//           cb();
//           return;
//         }
//         fs.readFile(file, function(err, data) {
//          var htmltext = new Buffer(data).toString();
//          unirest.post(base_url + "/templates")
//          .auth(state, mc_api_key)
//          .header('content-type', 'application/json')
//          .send({"name": template_name, "folder_id" : template_folder_id, "html": htmltext})
//          .end(function (response) {
//             if (response.body.error) {
//               console.log(response.body.error_description);
//             } else {
//               templates[response.body.id] = response.body;
//             }
//             cb(response.body.error);
//           });
//         });
//       },
//       function (error) {
//         fs.writeJson(templatesPath, templates, {spaces : 2}, function (err){
//           done(err || error);
//         });
//       }
//     );
//   // If the `nonull` option is set, and nothing
//   // was found, then files is ["**/*.js"]
//   // er is an error object or null.

//   });
// })(function (error) {
//   console.log(error);
//   process.exit(error ? 1 : 0);
// });



