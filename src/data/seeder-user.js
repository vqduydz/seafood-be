module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      return await queryInterface.bulkInsert('users', [
        {
          email: 'admin@gmail.com',
          password: '$2a$10$UxQFediHOpWwI/3MPCBxKeNKZnqctdamrWCfOIIWXShnJ1gM1Azym',
          name: 'Admin',
          phoneNumber: '0908260591',
          gender: 'Nam',
          role: 'Root',
        },
        {
          email: 'kh@gmail.com',
          password: '$2a$10$UxQFediHOpWwI/3MPCBxKeNKZnqctdamrWCfOIIWXShnJ1gM1Azym',
          name: 'khách Hàng',
          phoneNumber: '0908260591',
          gender: 'Nam',
          role: 'Customer',
        },
      ]);
    } catch (error) {
      console.error('Error in Seeder "up":', error);
      throw error;
    }
  },
  down: async (queryInterface, Sequelize) => {
    try {
      return await queryInterface.bulkDelete('users', null, {});
    } catch (error) {
      console.error('Error in Seeder "down":', error);
      throw error;
    }
  },
};
