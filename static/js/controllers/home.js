define(['store', '../libs/rest/index'], function (store, rest) {
  return {
    template: 'home',
    initialize: function () {
      var session = {
        deviceKey: store.get('deviceKey'),
        apiKey: "yaCCeDCruL/8ccbFz57sQZiDiu7FVzQfjkMirvSTMBWg19z5Hu8OqYww/2Q/Y3r/"
      };
      var sessionKey = store.get('sessionKey');
      if (session && sessionKey && session.deviceKey) {
        rest.put('sessions/' + encodeURIComponent(sessionKey), session, {
          success: function (data, status, xhr) {

          },
          error: function (xhr, errorType, error) {}
        });
      }
    }
  };
});