const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const Client = require("./Client");

const Devis = sequelize.define(
  "Devis",
  {
    devis_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    client_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Client,
        key: "client_id",
      },
    },
    date_creation: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    date_validite: {
      type: DataTypes.DATE,
    },
    statut: {
      type: DataTypes.STRING,
    },
    total_ht: {
      type: DataTypes.DECIMAL(10, 2),
    },
    total_ttc: {
      type: DataTypes.DECIMAL(10, 2),
    },
    conditions_paiement: {
      type: DataTypes.TEXT,
    },
    delai_livraison: {
      type: DataTypes.DATE,
    },
    interlocuteur: {
      type: DataTypes.STRING,
    },
    taux_tva: {
      type: DataTypes.DECIMAL(4, 2),
    },
    total_tva: {
      type: DataTypes.DECIMAL(10, 2),
    },
    remise: {
      type: DataTypes.DECIMAL(10, 2),
    },
    validite: {
      type: DataTypes.INTEGER,
    },
    conditions_speciales: {
      type: DataTypes.TEXT,
    },
    remarques: {
      type: DataTypes.TEXT,
    },
    version: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    tableName: "Devis",
    timestamps: false,
  }
);

// Définir la relation entre Devis et Client
Devis.belongsTo(Client, { foreignKey: "client_id" });

module.exports = Devis;
