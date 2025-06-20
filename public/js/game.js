const WeddingGame = {
  game: null,

  init() {
    // Configuration Phaser avec nos scènes
    const config = {
      ...GameConfig,
      scene: GameConfig.scenes,
    };

    console.log("Initialisation du jeu...");
    this.game = new Phaser.Game(config);
  },
};

window.addEventListener("DOMContentLoaded", () => {
  WeddingGame.init();
});
