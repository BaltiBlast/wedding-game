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

  // Bouton Alexis cliquable
  const alexisButton = this.add
    .text(600, 300, "Alexis", {
      fontSize: "24px",
      fill: "#ffaa00",
    })
    .setOrigin(0.5);

  // Rendre le bouton cliquable
  alexisButton.setInteractive();
  alexisButton.on("pointerdown", function () {
    console.log("Alexis sélectionné !");
    // TODO: passer au niveau 1 avec le personnage Alexis
  });

  const vefaButton = this.add
    .text(600, 350, "Vefa", {
      fontSize: "24px",
      fill: "#ffaa00",
    })
    .setOrigin(0.5);

  // Rendre le bouton cliquable
  vefaButton.setInteractive();
  vefaButton.on("pointerdown", function () {
    console.log("Vefa sélectionnée !");
    // TODO: passer au niveau 1 avec le personnage Vefa
  });
}
