const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Client = sequelize.define(
  "Client",
  {
    client_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    adresse: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    telephone: {
      type: DataTypes.STRING,
    },
    contact_principal: {
      type: DataTypes.STRING,
    },
    type_client: {
      type: DataTypes.STRING,
    },
    secteur_activite: {
      type: DataTypes.STRING,
    },
    date_creation: {
      type: DataTypes.DATE,
    },
    statut: {
      type: DataTypes.STRING,
    },
    numero_client: {
      type: DataTypes.STRING,
    },
    condition_de_paiement: {
      type: DataTypes.TEXT,
    },
    type_remise: {
      type: DataTypes.STRING,
    },
    remise: {
      type: DataTypes.DECIMAL(5, 2),
    },
    solde_compte: {
      type: DataTypes.DECIMAL(10, 2),
    },
    date_dernier_achat: {
      type: DataTypes.DATE,
    },
    notes: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "Client",
    timestamps: false,
  }
);

module.exports = Client;
