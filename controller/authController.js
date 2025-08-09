const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { nom, prenom, email, password, type_profil } = req.body;//donnes recu du formulaire doivent etre formater ou nommer identiquement 

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertion dans la table Utilisateur
    const resultUser = await pool.query(
      `INSERT INTO utilisateur (nom, prenom, email, password, type_profil)
       VALUES ($1, $2, $3, $4, $5) RETURNING id_utilisateur`,
      [nom, prenom, email, hashedPassword, type_profil]
    );

    const userId = resultUser.rows[0].id_utilisateur;//recuperation de l'id user pour stocker dans la table est_un avec l'id du profil correspondant
    let profileId = null;

    //  Insertion dans la table profil correspondante
    if (type_profil === "etudiant") {
      const resProfile = await pool.query(
        `INSERT INTO etudiant (niveau_etudes, nom_universite)
         VALUES ($1, $2) RETURNING id_etudiant`,
        ["Niveau par défaut", "Université inconnue"]
      );
      profileId = resProfile.rows[0].id_etudiant;
      await pool.query(
        `INSERT INTO est_un (id_utilisateur, id_etudiant)
         VALUES ($1, $2)`,
        [userId, profileId]
      );

    } else if (type_profil === "enseignant") {
      const resProfile = await pool.query(
        `INSERT INTO enseignant (domaine_expertise)
         VALUES ($1) RETURNING id_enseignant`,
        ["Spécialité inconnue"]
      );
      profileId = resProfile.rows[0].id_enseignant;
      await pool.query(
        `INSERT INTO est_un (id_utilisateur, id_enseignant)
         VALUES ($1, $2)`,
        [userId, profileId]
      );

    } else if (type_profil === "independant") {
      const resProfile = await pool.query(
        `INSERT INTO independant (domaine_expertise)
         VALUES ($1) RETURNING id_independant`,
        ["Spécialité inconnue"]
      );
      profileId = resProfile.rows[0].id_independant;
      await pool.query(
        `INSERT INTO est_un (id_utilisateur, id_independant)
         VALUES ($1, $2)`,
        [userId, profileId]
      );
    }

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      id_utilisateur: userId,
      profil: type_profil,
      id_profil: profileId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
//api de connection 
exports.login= async (req, res) => {
  const { email, password } = req.body;//reception  des donnees du formulaire
  try {

    const result = await pool.query(
      'SELECT * FROM utilisateur WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0)
      return res.status(401).json({ error: 'Utilisateur non trouvé' });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).json({ error: 'Mot de passe incorrect' });

    const token = jwt.sign({ id: user.id_utilisateur }, 'secret_key');
    res.json({ success: true, message: 'Connexion réussie', token, user });

  } catch (error) {
    console.error("Erreur générale login:", error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

