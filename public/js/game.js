const WeddingGame = {
  game: null,

  init() {
    if (this.redirectIfTooSmall()) return;
    window.addEventListener("resize", () => this.redirectIfTooSmall());
    this.launchGame();
  },

  redirectIfTooSmall() {
    if (window.innerWidth < GameConfig.width || window.innerHeight < GameConfig.height) {
      window.location.replace("./mobile.html");
      return true;
    }
    return false;
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
