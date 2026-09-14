const WeddingGame = {
  game: null,

  init() {
    this.launchGame();
  },

  launchGame: () => {
    const config = {
      ...GameConfig,
      scene: GameConfig.scenes,
    };

    try {
      console.log("Game started");

      WeddingGame.game = new Phaser.Game(config);
    } catch (error) {
      console.log(error);
    }
  },
};

window.addEventListener("DOMContentLoaded", () => {
  WeddingGame.init();
});
