'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        //define your association here
    }
  };
  Cart.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    userId: { type: Sequelize.INTEGER },
    shopId: { type: Sequelize.INTEGER },
    status:{ type:Sequelize.STRING },
    merchantName: { type: Sequelize.STRING },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: new Date()
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: new Date()
    }

  },
    {
      sequelize,
      modelName: 'Cart',
    });
  return Cart;
};