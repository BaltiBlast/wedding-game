function preloadTitleScreen() {
  console.log("Chargement du TitleScreen...");
}

function createTitleScreen() {
  console.log("Création du TitleScreen...");

  // Fond coloré simple
  this.add.rectangle(400, 300, 800, 600, 0x1a1a2e);

  // Le titre
  this.add
    .text(400, 100, "WEDDING GAME - FAIRE PART", {
      fontSize: "32px",
      fill: "#ffffff",
    })
    .setOrigin(0.5);

  // Zone d'affichage du personnage (à gauche)
  characterDisplay = this.add
    .text(200, 350, "Choisissez un personnage", {
      fontSize: "18px",
      fill: "#cccccc",
    })
    .setOrigin(0.5);

  // Bouton Alexis cliquable
  const alexisButton = this.add
    .text(600, 300, "Alexis", {
      fontSize: "24px",
      fill: "#ffaa00",
    })
    .setOrigin(0.5);

  let selectedCharacter = null;

  // Rendre le bouton cliquable
  alexisButton.setInteractive();
  alexisButton.on("pointerdown", () => {
    console.log("Alexis sélectionné !");
    selectedCharacter = "Alexis";
    characterDisplay.setText("Alexis\n(Le marié)");
  });

  const vefaButton = this.add
    .text(600, 350, "Vefa", {
      fontSize: "24px",
      fill: "#ffaa00",
    })
    .setOrigin(0.5);

  // Rendre le bouton cliquable
  vefaButton.setInteractive();
  vefaButton.on("pointerdown", () => {
    console.log("Vefa sélectionnée !");
    selectedCharacter = "Vefa";
    characterDisplay.setText("Vefa\n(La mariée)");
  });

  // Bouton Commencer (centré en bas)
  const startButton = this.add
    .text(400, 500, "Commencer", {
      fontSize: "28px",
      fill: "#00ff00",
    })
    .setOrigin(0.5);

  startButton.setInteractive();
  startButton.on("pointerdown", () => {
    if (selectedCharacter) {
      console.log(`Démarrage avec ${selectedCharacter}`);
      this.scene.start("Level1");
    } else {
      console.log("Aucun personnage sélectionné !");
    }
  });
}
