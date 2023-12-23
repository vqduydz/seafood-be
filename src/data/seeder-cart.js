module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('carts', [
      {
        customer_id: 1,
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('carts', null, {});
  },
};
