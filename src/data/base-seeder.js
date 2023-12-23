module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      return await queryInterface.bulkInsert('table-name', [
        //data
      ]);
    } catch (error) {
      console.error('Error in Seeder "up":', error.name, error.message, error.parent);
      throw error;
    }
  },
  down: async (queryInterface, Sequelize) => {
    try {
      console.log('Success in Seeder "down"');
      return await queryInterface.bulkDelete('table-name', null, {});
    } catch (error) {
      console.error('Error in Seeder "down":', error);
      throw error;
    }
  },
};
