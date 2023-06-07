'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Session extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Session.belongsTo(models.Sport, { foreignKey: 'sportId' });
      Session.belongsTo(models.User, { foreignKey: "creatorId" });
      Session.hasMany(models.SessionPlayer, { foreignKey: "sessionId" });
      
    }
  }
  Session.init({
    sportId: DataTypes.INTEGER,
    creatorId: DataTypes.INTEGER,
    when: DataTypes.STRING,
    venue: DataTypes.STRING,
    iscanceled: DataTypes.STRING,
    reason: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Session',
    tableName: 'Sessions',
  });
  return Session;
};  