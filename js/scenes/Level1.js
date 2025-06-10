function preloadLevel1() {
  console.log("Chargement du Level1...");
}

function createLevel1() {
  console.log("Création du Level1...");

  this.add
    .text(400, 300, "NIVEAU 1 - Trouvez le code !", {
      fontSize: "32px",
      fill: "#ffffff",
    })
    .setOrigin(0.5);
}
