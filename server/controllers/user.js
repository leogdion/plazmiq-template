module.exports = function (include) {
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
        create: function (req, res) {
          console.log(req.body);
          if (req.body.secret !== 'testTEST123!') {
            res.send(400);
          } else {
            res.send(201, 'create');
          }
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