'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('wallets', {
      walletId: {
        type: Sequelize.STRING, // сменить на INTEGER
        allowNull: false,
      },
      walletUUID: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      walletSecret: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      mnemonicPhrase: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      walletName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      walletStatus: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      proxyStatus: {
        type: Sequelize.STRING,
        allowNull: false,
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
      proxyUUID: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'proxy',
          key: 'ProxyUUID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('wallets');
  },
};