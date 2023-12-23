module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('cartItems', [
      {
        cart_id: 1,
        menu_id: 5,
        quantity: 1,
      },
      {
        cart_id: 1,
        menu_id: 2,
        quantity: 1,
      },
      {
        cart_id: 1,
        menu_id: 6,
        quantity: 1,
      },
      {
        cart_id: 1,
        menu_id: 25,
        quantity: 1,
      },
      {
        cart_id: 1,
        menu_id: 21,
        quantity: 1,
      },
      {
        cart_id: 1,
        menu_id: 16,
        quantity: 1,
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('cartItems', null, {});
  },
};
