'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Menu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Menu.belongsTo(models.Catalog, { foreignKey: 'slug', sourceKey: 'catalogSlug' });
    }
  }
  Menu.init(
    {
      name: DataTypes.STRING,
      slug: DataTypes.STRING,
      catalog: DataTypes.STRING,
      catalogSlug: DataTypes.STRING,
      price: DataTypes.INTEGER,
      max_order: DataTypes.INTEGER,
      unit: DataTypes.STRING,
      image: DataTypes.STRING,
      desc: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'Menu',
      timestamps: true,
    },
  );
  return Menu;
};
