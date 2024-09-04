const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Fournisseur = sequelize.define(
  "Fournisseur",
  {
    fournisseur_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom_societe: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    adresse_ligne_1: {
      type: DataTypes.STRING,
    },
    adresse_ligne_2: {
      type: DataTypes.STRING,
    },
    adresse_ligne_3: {
      type: DataTypes.STRING,
    },
    localite: {
      type: DataTypes.STRING,
    },
    code_postal: {
      type: DataTypes.STRING,
    },
    pays: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    telephone: {
      type: DataTypes.STRING,
    },
    telecopie: {
      type: DataTypes.STRING,
    },
    contact_principal: {
      type: DataTypes.STRING,
    },
    compte_tiers: {
      type: DataTypes.STRING,
    },
    reglement: {
      type: DataTypes.STRING,
    },
    siret: {
      type: DataTypes.STRING,
    },
    secteur_activite: {
      type: DataTypes.STRING,
    },
    type_fournisseur: {
      type: DataTypes.STRING,
    },
    date_creation: {
      type: DataTypes.DATE,
    },
    statut: {
      type: DataTypes.STRING,
    },
    numero_fournisseur: {
      type: DataTypes.STRING,
    },
    conditions_de_paiement: {
      type: DataTypes.TEXT,
    },
    delai_livraison_standard: {
      type: DataTypes.INTERVAL,
    },
    solde_compte: {
      type: DataTypes.DECIMAL(10, 2),
    },
    classement: {
      type: DataTypes.STRING(10),
    },
    notes: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "Fournisseur",
    timestamps: false,
  }
);

module.exports = Fournisseur;
