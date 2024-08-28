// routes/clientRoutes.js
const express = require("express");
const db = require("../db");

const router = express.Router();

// Récupérer tous les clients
router.get("/clients", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM Client");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la récupération des clients");
  }
});

// Récupérer un client par ID
router.get("/clients/:id", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM Client WHERE client_id = $1", [
      req.params.id,
    ]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send("Client non trouvé");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la récupération du client");
  }
});

// Créer un nouveau client
router.post("/clients", async (req, res) => {
  const {
    nom,
    adresse,
    email,
    telephone,
    contact_principal,
    type_client,
    secteur_activite,
    date_creation,
    statut,
    numero_client,
    condition_de_paiement,
    type_remise,
    remise,
    solde_compte,
    date_dernier_achat,
    notes,
  } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO Client (nom, adresse, email, telephone, contact_principal, type_client, secteur_activite, date_creation, statut, numero_client, condition_de_paiement, type_remise, remise, solde_compte, date_dernier_achat, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *`,
      [
        nom,
        adresse,
        email,
        telephone,
        contact_principal,
        type_client,
        secteur_activite,
        date_creation,
        statut,
        numero_client,
        condition_de_paiement,
        type_remise,
        remise,
        solde_compte,
        date_dernier_achat,
        notes,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la création du client");
  }
});

// Mettre à jour un client
router.put("/clients/:id", async (req, res) => {
  const {
    nom,
    adresse,
    email,
    telephone,
    contact_principal,
    type_client,
    secteur_activite,
    date_creation,
    statut,
    numero_client,
    condition_de_paiement,
    type_remise,
    remise,
    solde_compte,
    date_dernier_achat,
    notes,
  } = req.body;

  try {
    const result = await db.query(
      `UPDATE Client SET nom = $1, adresse = $2, email = $3, telephone = $4, contact_principal = $5, type_client = $6, secteur_activite = $7, date_creation = $8, statut = $9, numero_client = $10, condition_de_paiement = $11, type_remise = $12, remise = $13, solde_compte = $14, date_dernier_achat = $15, notes = $16
      WHERE client_id = $17
      RETURNING *`,
      [
        nom,
        adresse,
        email,
        telephone,
        contact_principal,
        type_client,
        secteur_activite,
        date_creation,
        statut,
        numero_client,
        condition_de_paiement,
        type_remise,
        remise,
        solde_compte,
        date_dernier_achat,
        notes,
        req.params.id,
      ]
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send("Client non trouvé");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la mise à jour du client");
  }
});

// Supprimer un client
router.delete("/clients/:id", async (req, res) => {
  try {
    const result = await db.query(
      "DELETE FROM Client WHERE client_id = $1 RETURNING *",
      [req.params.id]
    );

    if (result.rows.length > 0) {
      res.status(204).send("Client supprimé");
    } else {
      res.status(404).send("Client non trouvé");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la suppression du client");
  }
});

module.exports = router;
