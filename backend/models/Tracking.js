// backend/models/Tracking.js
const { Model, DataTypes } = require('sequelize');

class Tracking extends Model {
  static init(sequelize) {
    super.init({
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      carrier: {
          type: DataTypes.STRING,
          allowNull: true,
      }
    }, {
      sequelize,
      modelName: 'Tracking',
    });
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  }
}

module.exports = Tracking;
