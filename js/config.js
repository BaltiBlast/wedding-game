const GameConfig = {
  width: 1024,
  height: 1024,
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

  // Scènes du jeu
  scenes: [
    ScreenTitle,
    Level1,
    Elevator,
    // {
    //   key: "Level2",
    //   preload: preloadLevel2,
    //   create: createLevel2,
    //   update: updateLevel2,
    // },
  ],
};
