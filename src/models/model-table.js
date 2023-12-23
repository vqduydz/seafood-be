'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Table extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Table.hasOne(models.Cart, { foreignKey: 'customer_id', sourceKey: 'id' });
      // define association here
    }
  }
  Table.init(
    { name: DataTypes.STRING, type: DataTypes.STRING, available: DataTypes.BOOLEAN, max: DataTypes.INTEGER },
    {
      sequelize,
      modelName: 'Table',
      timestamps: true,
    },
  );
  return Table;
};
