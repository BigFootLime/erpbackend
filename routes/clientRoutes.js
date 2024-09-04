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
  console.log(req.body);
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
    rue,
    localite,
    code_postal,
    pays,
    siret,
    telephone,
    telecopie,
    compte_tiers,
    reglement,
    groupe_financier,
    contact_principal,
  } = req.body;

  try {
    // Check if a client with the same SIRET already exists
    const existingClient = await db.query(
      "SELECT * FROM Client WHERE siret = $1",
      [siret]
    );

    if (existingClient.rows.length > 0) {
      // If a client with the same SIRET is found, return an error response
      return res
        .status(400)
        .json({ error: "Client with the same SIRET already exists." });
    }

    // If no existing client is found, proceed with insertion
    const result = await db.query(
      `INSERT INTO Client ( 
        nom, 
        rue, 
        localite, 
        code_postal, 
        pays, 
        siret, 
        telephone, 
        telecopie, 
        compte_tiers, 
        reglement, 
        groupe_financier, 
        contact_principal
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        nom,
        rue,
        localite,
        code_postal,
        pays,
        siret,
        telephone,
        telecopie,
        compte_tiers,
        reglement,
        groupe_financier,
        contact_principal,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error during client creation:", error);
    res.status(500).send("Erreur lors de la création du client");
  }
});

// Mettre à jour un client
router.put("/clients/:id", async (req, res) => {
  const {
    nom,
    rue,
    localite,
    code_postal,
    pays,
    siret,
    telephone,
    telecopie,
    compte_tiers,
    reglement,
    groupe_financier,
    contact_principal,
  } = req.body;

  try {
    const result = await db.query(
      `UPDATE Client 
       SET nom = $1, 
           rue = $2, 
           localite = $3, 
           code_postal = $4, 
           pays = $5, 
           siret = $6, 
           telephone = $7, 
           telecopie = $8, 
           compte_tiers = $9, 
           reglement = $10, 
           groupe_financier = $11, 
           contact_principal = $12
       WHERE client_id = $13
       RETURNING *`,
      [
        nom,
        rue,
        localite,
        code_postal,
        pays,
        siret,
        telephone,
        telecopie,
        compte_tiers,
        reglement,
        groupe_financier,
        contact_principal,
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
