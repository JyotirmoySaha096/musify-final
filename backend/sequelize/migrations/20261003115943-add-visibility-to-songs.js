'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('songs', 'visibility', {
      type: Sequelize.ENUM('public', 'member', 'exclusive'),
      allowNull: false,
      defaultValue: 'public',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('songs', 'visibility');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_songs_visibility";');
  }
};
