'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CartDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cartId : { type:Sequelize.INTEGER,
        references: {
          model: 'Carts',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      serviceId:  {type:Sequelize.INTEGER},
      status:{type:Sequelize.STRING},
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
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('CartDetails');
  }
};
