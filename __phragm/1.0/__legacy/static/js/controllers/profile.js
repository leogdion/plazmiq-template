define(['../libs/shared/index', 'store', 'hasher', '../libs/rest/index'], function (shared, store, hasher, rest) {
  return {
    templates: {
      'main': 'profile',
      '#log-nav': 'profile-nav'
    },
    prepare: function (cb) {
      this.data = {
        user: shared.get('user')
      };
      if (this.data.user) {
        cb(this.data);
      } else {
        var session = {
          deviceKey: store.get('deviceKey'),
          apiKey: "yaCCeDCruL/8ccbFz57sQZiDiu7FVzQfjkMirvSTMBWg19z5Hu8OqYww/2Q/Y3r/"
        };
        var sessionKey = store.get('sessionKey');
        if (session && sessionKey && session.deviceKey) {
          rest.put('sessions/' + encodeURIComponent(sessionKey), session, {
            success: function (data, status, xhr) {
              //hasher.setHash('profile');
              shared.set('user', data.user);
              delete data.user;
              store(data);
              this.data = {
                user: shared.get('user')
              };
              cb(this.data);
            },
            error: function (xhr, errorType, error) {
              hasher.setHash('/');
            }
          });
        }
      }
      return this.data;
    }
  };
});