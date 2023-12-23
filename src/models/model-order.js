'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  Order.init(
    {
      deliver_id: DataTypes.INTEGER,
      handler_id: DataTypes.INTEGER,
      payment_methods: DataTypes.STRING,
      order_code: DataTypes.STRING,
      customer_id: DataTypes.INTEGER,
      type: DataTypes.INTEGER,
      table_id: DataTypes.STRING,
      status: DataTypes.STRING,
      payment: DataTypes.INTEGER,
      deposit_amount: DataTypes.INTEGER,
      ship_fee: DataTypes.INTEGER,
      total_amount: DataTypes.INTEGER,
      total_payment: DataTypes.INTEGER,
      items: DataTypes.TEXT,
      history: DataTypes.TEXT,
      receiver: DataTypes.TEXT,
      orderer: DataTypes.TEXT,
      note: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'Order',
      timestamps: true,
    },
  );
  return Order;
};
