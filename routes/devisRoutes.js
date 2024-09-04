// routes/devisRoutes.js
const express = require("express");
const db = require("../db");

const router = express.Router();

// Récupérer tous les devis
router.get("/devis", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT Devis.*, Client.nom AS client_nom 
      FROM Devis 
      JOIN Client ON Devis.client_id = Client.client_id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la récupération des devis");
  }
});

// Récupérer un devis par ID
router.get("/devis/:id", async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT Devis.*, Client.nom 
      FROM Devis 
      JOIN Client ON Devis.client_id = Client.client_id
      WHERE Devis.devis_id = $1
    `,
      [req.params.id]
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send("Devis non trouvé");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la récupération du devis");
  }
});

// Créer un nouveau devis
router.post("/devis", async (req, res) => {
  const {
    client_id,
    date_creation,
    date_validite,
    statut,
    total_ht,
    total_ttc,
    conditions_paiement,
    delai_livraison,
    interlocuteur,
    taux_tva,
    total_tva,
    remise,
    validite,
    conditions_speciales,
    remarques,
  } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO Devis (client_id, date_creation, date_validite, statut, total_ht, total_ttc, conditions_paiement, delai_livraison, interlocuteur, taux_tva, total_tva, remise, validite, conditions_speciales, remarques)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *`,
      [
        client_id,
        date_creation,
        date_validite,
        statut,
        total_ht,
        total_ttc,
        conditions_paiement,
        delai_livraison,
        interlocuteur,
        taux_tva,
        total_tva,
        remise,
        validite,
        conditions_speciales,
        remarques,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la création du devis");
  }
});

// Mettre à jour un devis
router.put("/devis/:id", async (req, res) => {
  const {
    client_id,
    date_creation,
    date_validite,
    statut,
    total_ht,
    total_ttc,
    conditions_paiement,
    delai_livraison,
    interlocuteur,
    taux_tva,
    total_tva,
    remise,
    validite,
    conditions_speciales,
    remarques,
  } = req.body;

  try {
    const result = await db.query(
      `UPDATE Devis SET client_id = $1, date_creation = $2, date_validite = $3, statut = $4, total_ht = $5, total_ttc = $6, conditions_paiement = $7, delai_livraison = $8, interlocuteur = $9, taux_tva = $10, total_tva = $11, remise = $12, validite = $13, conditions_speciales = $14, remarques = $15
      WHERE devis_id = $16
      RETURNING *`,
      [
        client_id,
        date_creation,
        date_validite,
        statut,
        total_ht,
        total_ttc,
        conditions_paiement,
        delai_livraison,
        interlocuteur,
        taux_tva,
        total_tva,
        remise,
        validite,
        conditions_speciales,
        remarques,
        req.params.id,
      ]
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send("Devis non trouvé");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la mise à jour du devis");
  }
});

// Supprimer un devis
router.delete("/devis/:id", async (req, res) => {
  try {
    const result = await db.query(
      "DELETE FROM Devis WHERE devis_id = $1 RETURNING *",
      [req.params.id]
    );

    if (result.rows.length > 0) {
      res.status(204).send("Devis supprimé");
    } else {
      res.status(404).send("Devis non trouvé");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la suppression du devis");
  }
});

module.exports = router;
