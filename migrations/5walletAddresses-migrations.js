'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('wallet_Addresses', {
      walletUUID: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'wallets',
          key: 'walletUUID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      BNB: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      TRX: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ETHevm: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('wallet_Addresses');
  },
};