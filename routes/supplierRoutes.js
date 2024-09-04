const express = require("express");
const db = require("../db");

const router = express.Router();

// Récupérer tous les fournisseurs
router.get("/fournisseurs", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM Fournisseur");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la récupération des fournisseurs");
  }
});

// Récupérer un fournisseur par ID
router.get("/fournisseurs/:id", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM Fournisseur WHERE fournisseur_id = $1",
      [req.params.id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send("Fournisseur non trouvé");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la récupération du fournisseur");
  }
});

// Créer un nouveau fournisseur
router.post("/fournisseurs", async (req, res) => {
  const {
    nom_societe,
    adresse_ligne_1,
    adresse_ligne_2,
    adresse_ligne_3,
    localite,
    code_postal,
    pays,
    email,
    telephone,
    telecopie,
    contact_principal,
    compte_tiers,
    reglement,
    siret,
    secteur_activite,
    type_fournisseur,
    date_creation,
    statut,
    numero_fournisseur,
    conditions_de_paiement,
    delai_livraison_standard,
    solde_compte,
    classement,
    notes,
  } = req.body;

  try {
    // Vérifier si un fournisseur avec le même SIRET existe déjà
    const existingFournisseur = await db.query(
      "SELECT * FROM Fournisseur WHERE siret = $1",
      [siret]
    );

    if (existingFournisseur.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "Un fournisseur avec le même SIRET existe déjà." });
    }

    // Créer un nouveau fournisseur
    const result = await db.query(
      `INSERT INTO Fournisseur (
        nom_societe,
        adresse_ligne_1,
        adresse_ligne_2,
        adresse_ligne_3,
        localite,
        code_postal,
        pays,
        email,
        telephone,
        telecopie,
        contact_principal,
        compte_tiers,
        reglement,
        siret,
        secteur_activite,
        type_fournisseur,
        date_creation,
        statut,
        numero_fournisseur,
        conditions_de_paiement,
        delai_livraison_standard,
        solde_compte,
        classement,
        notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
      RETURNING *`,
      [
        nom_societe,
        adresse_ligne_1,
        adresse_ligne_2,
        adresse_ligne_3,
        localite,
        code_postal,
        pays,
        email,
        telephone,
        telecopie,
        contact_principal,
        compte_tiers,
        reglement,
        siret,
        secteur_activite,
        type_fournisseur,
        date_creation,
        statut,
        numero_fournisseur,
        conditions_de_paiement,
        delai_livraison_standard,
        solde_compte,
        classement,
        notes,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erreur lors de la création du fournisseur:", error);
    res.status(500).send("Erreur lors de la création du fournisseur");
  }
});

// Mettre à jour un fournisseur
router.put("/fournisseurs/:id", async (req, res) => {
  const {
    nom_societe,
    adresse_ligne_1,
    adresse_ligne_2,
    adresse_ligne_3,
    localite,
    code_postal,
    pays,
    email,
    telephone,
    telecopie,
    contact_principal,
    compte_tiers,
    reglement,
    siret,
    secteur_activite,
    type_fournisseur,
    statut,
    numero_fournisseur,
    conditions_de_paiement,
    delai_livraison_standard,
    solde_compte,
    classement,
    notes,
  } = req.body;

  try {
    const result = await db.query(
      `UPDATE Fournisseur 
       SET nom_societe = $1,
           adresse_ligne_1 = $2,
           adresse_ligne_2 = $3,
           adresse_ligne_3 = $4,
           localite = $5,
           code_postal = $6,
           pays = $7,
           email = $8,
           telephone = $9,
           telecopie = $10,
           contact_principal = $11,
           compte_tiers = $12,
           reglement = $13,
           siret = $14,
           secteur_activite = $15,
           type_fournisseur = $16,
           statut = $17,
           numero_fournisseur = $18,
           conditions_de_paiement = $19,
           delai_livraison_standard = $20,
           solde_compte = $21,
           classement = $22,
           notes = $23
       WHERE fournisseur_id = $24
       RETURNING *`,
      [
        nom_societe,
        adresse_ligne_1,
        adresse_ligne_2,
        adresse_ligne_3,
        localite,
        code_postal,
        pays,
        email,
        telephone,
        telecopie,
        contact_principal,
        compte_tiers,
        reglement,
        siret,
        secteur_activite,
        type_fournisseur,
        statut,
        numero_fournisseur,
        conditions_de_paiement,
        delai_livraison_standard,
        solde_compte,
        classement,
        notes,
        req.params.id,
      ]
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send("Fournisseur non trouvé");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la mise à jour du fournisseur");
  }
});

// Supprimer un fournisseur
router.delete("/fournisseurs/:id", async (req, res) => {
  try {
    const result = await db.query(
      "DELETE FROM Fournisseur WHERE fournisseur_id = $1 RETURNING *",
      [req.params.id]
    );

    if (result.rows.length > 0) {
      res.status(204).send("Fournisseur supprimé");
    } else {
      res.status(404).send("Fournisseur non trouvé");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la suppression du fournisseur");
  }
});

module.exports = router;
