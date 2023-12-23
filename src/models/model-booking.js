'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Booking.hasOne(models.Cart, { foreignKey: 'customer_id', sourceKey: 'id' });
      // define association here
    }
  }
  Booking.init(
    {
      booking_code: DataTypes.STRING,
      customer_id: DataTypes.INTEGER,
      type: DataTypes.INTEGER,
      customer_name: DataTypes.STRING,
      customer_phonenumber: DataTypes.STRING,
      number_of_guests: DataTypes.INTEGER,
      table_id: DataTypes.STRING,
      status: DataTypes.STRING,
      deposit_amount: DataTypes.INTEGER,
      order: DataTypes.TEXT,
      note: DataTypes.TEXT,
      history: DataTypes.TEXT,
      arrival_time: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Booking',
      timestamps: true,
    },
  );
  return Booking;
};
