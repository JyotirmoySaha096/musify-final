import { DataTypes, Sequelize } from 'sequelize';

export function initPermissionModel(sequelize: Sequelize) {
  const Permission = sequelize.define(
    'Permission',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: 'permissions',
      timestamps: false,
    },
  );

  return Permission;
}
