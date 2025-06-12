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

  // Scènes du jeu
  scenes: [
    {
      key: "TitleScreen",
      preload: preloadTitleScreen,
      create: createTitleScreen,
    },
    {
      key: "Level1",
      preload: preloadLevel1,
      create: createLevel1,
      update: updateLevel1,
    },
    {
      key: "Level2",
      preload: preloadLevel2,
      create: createLevel2,
      update: updateLevel2,
    },
  ],
};
