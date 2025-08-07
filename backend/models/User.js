// backend/models/User.js
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

class User extends Model {
  static init(sequelize) {
    super.init({
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: { isEmail: true }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      sequelize,
      modelName: 'User',
      hooks: {
        beforeSave: async (user) => {
          if (user.changed('password')) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        }
      }
    });
  }

  static associate(models) {
    this.hasMany(models.Tracking, { foreignKey: 'userId', as: 'trackings' });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

module.exports = User;
