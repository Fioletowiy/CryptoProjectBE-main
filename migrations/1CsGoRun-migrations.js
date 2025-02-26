'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      userId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      picture: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      accessToken: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      refreshToken: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      userRole: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
        defaultValue: ['guest'],
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
    await queryInterface.createTable('wallets', {
      steamId: {
        type: Sequelize.DataTypes.STRING,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      steamAvatar: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      steamName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      accountStatus: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      proxyData: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      proxyStatus: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      userAgent: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      cookies: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      authJWT: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      groupId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
      },
      acceptLanguage: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      secChUa: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      ownerId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users', // Имя таблицы, на которую ссылается внешний ключ
          key: 'userId', // Имя столбца в таблице users
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
      },
      activeSuccessfullCounts: {
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 0,
      },
      activeFailedCounts: {
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 0,
      },
    });
    await queryInterface.createTable('csgorunactivelogs', {
      logId: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        allowNull: false,
      },
      type: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      steamID: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      time: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      promo: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      errorMessage: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      ownerId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
      },
      groupId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
      },
    });
    await queryInterface.createTable('csgorungroups', {
      groupId: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      groupName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      groupOwner: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
      },
      groupMembersCount: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
      },
    });
    await queryInterface.createTable('csrunPromoLogs', {
      logId: {
        type: Sequelize.DataTypes.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
      },
      isSuccess: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
      },
      userId: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      steamId: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      promoCode: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      proxy: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      errorMessage: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('csgorunactivelogs');
    await queryInterface.dropTable('wallets');
    await queryInterface.dropTable('csgorungroups');
    await queryInterface.dropTable('users');
    await queryInterface.dropTable('csrunPromoLogs');
  },
};
