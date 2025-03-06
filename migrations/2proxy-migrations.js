'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('proxy', {
      ProxyUUID: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      ProxyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ProxyName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ProxyComment: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ProxyIP: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ProxyPort: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ProxyUserName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ProxyPassword: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ProxyProtocol: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ProxyStatus: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ownerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'userId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('proxy');
  },
};