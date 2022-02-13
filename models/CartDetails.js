'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
    class CartDetails extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here

        }
    };
    CartDetails.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        cartId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'Carts',
                key: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'cascade',
        },
        serviceId: { type: Sequelize.INTEGER },
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

    },
        {
            sequelize,
            modelName: 'CartDetails',
        });
    return CartDetails;
};