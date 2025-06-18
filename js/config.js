const GameConfig = {
  width: 1024,
  height: 1024,
  pixelArt: true,
  type: Phaser.AUTO,
  parent: "game-container",
  backgroundColor: "#000000",
  physics: {
    default: "arcade",
    arcade: { debug: false },
  },
  // Constantes du jeu
  WEDDING_DATE: "27.09.25",
  defaultDuration: 2000,

  dom: {
    createContainer: true,
  },
  // Scènes du jeu
  scenes: [
    // ScreenTitle,
    Level1,
    Elevator,
    Level2,
    StartshipCockpit,
    StarshipTraveling,
    Level3,
    ScreenEnding,
  ],
};
