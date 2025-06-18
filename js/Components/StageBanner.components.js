// ======================================================================== //
// USAGE
//
// 1. Add in scene's create :
// Show stage banner
// StageBanner.showStageBanner(this, text, delay);
//
// Explains : this = scene, text = "Stage name", delay = during display
// ======================================================================== //

class StageBanner {
  //-------------------------------------------------------------------------------------------- //
  static showStageBanner(scene, text, delay = 0) {
    const container = scene.add.container(scene.cameras.main.centerX, -100);
    container.setDepth(99999);
    container.setAlpha(0);

    const background = scene.add.rectangle(0, 0, 240, 40, 0x000000, 0.85);
    background.setOrigin(0.5);
    background.setStrokeStyle(1, 0xffffff);

    const label = scene.add
      .text(0, 0, text, {
        fontFamily: "PressStart2P",
        fontSize: "18px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    container.add([background, label]);

    this.bannerAnimation(scene, container, delay);
  }

  //-------------------------------------------------------------------------------------------- //
  static bannerAnimation(scene, container, delay) {
    scene.time.delayedCall(delay, () => {
      scene.tweens.add({
        targets: container,
        y: 90,
        alpha: 1,
        ease: "Cubic.easeOut",
        duration: 400,
        onComplete: () => {
          this.hideStageBanner(scene, container);
        },
      });
    });
  }

  //-------------------------------------------------------------------------------------------- //
  static hideStageBanner(scene, container) {
    scene.time.delayedCall(5000, () => {
      scene.tweens.add({
        targets: container,
        y: -100,
        alpha: 0,
        ease: "Cubic.easeIn",
        duration: 400,
        onComplete: () => container.destroy(),
      });
    });
  }
}
