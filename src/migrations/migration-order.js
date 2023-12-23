'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      deliver_id: {
        type: Sequelize.INTEGER,
      },
      handler_id: {
        type: Sequelize.INTEGER,
      },
      payment_methods: {
        type: Sequelize.STRING,
      },
      order_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      customer_id: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.STRING,
      },
      type: {
        type: Sequelize.INTEGER,
      },
      payment: {
        type: Sequelize.INTEGER,
      },
      deposit_amount: {
        type: Sequelize.INTEGER,
      },
      ship_fee: {
        type: Sequelize.INTEGER,
      },
      total_amount: {
        type: Sequelize.INTEGER,
      },
      total_payment: {
        type: Sequelize.INTEGER,
      },
      items: {
        type: Sequelize.TEXT,
      },
      table_id: {
        type: Sequelize.STRING,
      },
      history: {
        type: Sequelize.TEXT,
      },
      receiver: {
        type: Sequelize.TEXT,
      },
      orderer: {
        type: Sequelize.TEXT,
      },
      note: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  },
};
