'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Catalog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Catalog.hasMany(models.Menu, { foreignKey: 'catalogSlug', sourceKey: 'slug' });
    }
  }
  Catalog.init(
    {
      name: DataTypes.STRING,
      slug: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Catalog',
      timestamps: true,
    },
  );
  return Catalog;
};
