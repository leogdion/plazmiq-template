var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Session = sequelize.define('Session', {
    id: {
      type : Sequelize.UUID,
      unique: true,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4
    }
  },
    {
        classMethods:{
            associate:function(models){
              Session.belongsTo(models.User);
            }
        }
    }
  );

  return Session;
};