'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Feedback extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  Feedback.init(
    {
      customer_id: DataTypes.INTEGER,
      menu_id: DataTypes.INTEGER,
      point: DataTypes.INTEGER,
      feedback_content: DataTypes.TEXT,
      feedback_code: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Feedback',
      timestamps: true,
    },
  );
  return Feedback;
};
