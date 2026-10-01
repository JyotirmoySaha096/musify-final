'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('roles', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      }
    });

    await queryInterface.createTable('permissions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // e.g. "manage:users", "delete:songs"
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      }
    });

    await queryInterface.createTable('role_permissions', {
      roleId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'roles', key: 'id' },
        onDelete: 'CASCADE',
      },
      permissionId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'permissions', key: 'id' },
        onDelete: 'CASCADE',
      },
    });

    await queryInterface.createTable('user_roles', {
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      roleId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'roles', key: 'id' },
        onDelete: 'CASCADE',
      },
    });

    // Add unique constraints to join tables
    await queryInterface.addConstraint('role_permissions', {
      fields: ['roleId', 'permissionId'],
      type: 'unique',
      name: 'unique_role_permission'
    });

    await queryInterface.addConstraint('user_roles', {
      fields: ['userId', 'roleId'],
      type: 'unique',
      name: 'unique_user_role'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_roles');
    await queryInterface.dropTable('role_permissions');
    await queryInterface.dropTable('permissions');
    await queryInterface.dropTable('roles');
  }
};
