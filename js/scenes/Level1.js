function preloadLevel1() {
  console.log("Chargement du Level1...");
}

function createLevel1() {
  console.log("Création du Level1...");

  // Fond du niveau 1
  this.add.rectangle(400, 300, 800, 600, 0x2d4a22);

  // Titre du niveau
  this.add
    .text(400, 50, "NIVEAU 1 - Trouvez le code de l'ascenseur", {
      fontSize: "24px",
      fill: "#ffffff",
    })
    .setOrigin(0.5);

  // Instructions
  this.add
    .text(400, 100, "Parlez au PNJ pour obtenir un indice !", {
      fontSize: "16px",
      fill: "#cccccc",
    })
    .setOrigin(0.5);

  // PNJ près du feu (placeholder)
  const npc = this.add
    .text(200, 400, "PNJ", {
      fontSize: "20px",
      fill: "#ffaa00",
      backgroundColor: "#333333",
      padding: { x: 10, y: 5 },
    })
    .setOrigin(0.5);

  // Rendre le PNJ cliquable
  npc.setInteractive();
  npc.on("pointerdown", () => {
    console.log("Discussion avec le PNJ");
    // TODO: afficher le dialogue
  });
}
