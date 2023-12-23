'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CartItem.belongsTo(models.User, { foreignKey: 'id', sourceKey: 'customer_id' });
      CartItem.belongsTo(models.Menu, { foreignKey: 'menu_id', targetKey: 'id' });

      // define association here
    }
  }
  CartItem.init(
    {
      customer_id: DataTypes.INTEGER,
      menu_id: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'CartItem',
      timestamps: true,
    },
  );
  return CartItem;
};
