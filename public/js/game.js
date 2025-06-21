const WeddingGame = {
  game: null,

  init() {
    this.fullscreenPrompt();
  },

  fullscreenPrompt: () => {
    const dialog = document.getElementById("fullscreen-dialog");
    const btn = document.getElementById("enter-fullscreen-btn");

    btn.addEventListener("click", async () => {
      const elem = document.documentElement;

      try {
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          await elem.webkitRequestFullscreen();
        }

        dialog.style.display = "none";
        WeddingGame.launchGame();
      } catch (err) {
        console.error("Erreur plein écran :", err);
      }
    });
  },

  launchGame: () => {
    const config = {
      ...GameConfig,
      scene: GameConfig.scenes,
    };

    WeddingGame.game = new Phaser.Game(config);
  },
};

window.addEventListener("DOMContentLoaded", () => {
  WeddingGame.init();
});
