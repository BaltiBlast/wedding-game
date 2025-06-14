const GameConfig = {
  width: 1024,
  height: 1024,
  type: Phaser.AUTO,
  parent: "game-container",
  backgroundColor: "#000000",
  physics: {
    default: "arcade",
    arcade: { debug: true },
  },
  // Constantes du jeu
  WEDDING_DATE: "27.09.25",
  defaultDuration: 2000,

  // Scènes du jeu
  scenes: [
    // ScreenTitle,
    // Level1,
    // Elevator,
    // Level2,
    StartshipCockpit,
  ],
};
