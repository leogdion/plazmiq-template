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
            res.status(400).send();
          } else {
            res.status(201).send('create');
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