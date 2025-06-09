const GameConfig = {
  width: 800,
  height: 600,
  type: Phaser.AUTO,
  parent: "game-container",
  backgroundColor: "#000000",

  // Constantes du jeu
  WEDDING_DATE: "27.09.25",

  // Scènes du jeu
  scenes: [
    {
      key: "TitleScreen",
      preload: preloadTitleScreen,
      create: createTitleScreen,
    },
  ],
};
