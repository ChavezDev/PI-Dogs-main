const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "dog",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: "nameIndex",
      },
      height: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      weight: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      life_span: {
        field: "life_span",
        type: DataTypes.STRING,
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bred_for: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: false, // para eliminar que se creen por defecto los campos de registro
    }
  );
};
