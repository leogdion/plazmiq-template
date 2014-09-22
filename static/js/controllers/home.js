define(['store', '../libs/rest/index'], function (store, rest) {
  return {
    template: 'home',
    initialize: function () {
      var session = {
        sessionKey: store.get('sessionKey'),
        deviceKey: store.get('deviceKey'),
        apiKey: "yaCCeDCruL/8ccbFz57sQZiDiu7FVzQfjkMirvSTMBWg19z5Hu8OqYww/2Q/Y3r/"
      };
      console.log(session);
      if (session && session.sessionKey && session.deviceKey) {
        rest.put('session', session, {
          success: function (data, status, xhr) {

          },
          error: function (xhr, errorType, error) {}
        });
      }
    }
  };
});